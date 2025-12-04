import { useContext, useEffect, useState } from 'react';

import '../../Assests/Styles/product.page.css';
import { useLocation } from 'react-router-dom';
import { fetchManufacturer, formattedAddress } from '../../Services/Utils/stakeholder';
import { ContractContext } from '../../Services/Contexts/ContractContext';
import { AuthContext } from '../../Services/Contexts/AuthContext';
import Toast from '../../Components/Toast';
import Rating from '../../Components/Rating';

const Product = () => {
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const { contractState, updateStats } = useContext(ContractContext);
  const [product, setProduct] = useState(location.state.product);
  const [transferState, setTransferState] = useState({
    from: authState.address,
    to: ""
  });
  const [reviewState, setReviewState] = useState({
    rating: 0,
    comment: "",
    from: authState.address,
  })
  const [isOwner, setIsOnwer] = useState(authState.address.toLowerCase() == location.state.product.item["currentOwner"].toLowerCase());

  const reload = async () => {
    const id = location.state.product.item.id;
    const response = await contractState.productContract.methods.get(id).call({from: authState.address});
    const product = {
      "item": response.item,
      "rawProducts": response.rawProducts,
      "reviews": response.reviews,
      "transactions": response.transactions,
      "manufacturer": await fetchManufacturer(authState.address, contractState.manufacturerContract, response.item["manufacturer"])
    }
    setProduct(product);
    // Update isOwner state after reload
    setIsOnwer(authState.address.toLowerCase() === response.item["currentOwner"].toLowerCase());
  }

  const transfer = async () => {
    // Validate address before transfer
    if (!transferState.to || transferState.to.trim() === "") {
      Toast("error", "Please enter a valid address");
      return;
    }

    try {
      await contractState.productContract.methods.transfer(transferState.to, product.item.id).send({from: authState.address});
      await reload();
      Toast("success", "Product transferred successfully");
      // Clear transfer input
      setTransferState({
        from: authState.address,
        to: ""
      });
      updateStats();
    } catch (error) {
      Toast("error", error.message || "Transfer failed");
    }
  }

  const postReview = async () => {
    if(!isOwner){
      Toast("error", "You are not the owner of this product");
      return;
    }
    await contractState.productContract.methods.addReview(product.item.id, reviewState.rating, reviewState.comment).send({from: authState.address});
    await reload();
    Toast("success", "Review posted successfully");
    setReviewState({
      rating: 0,
      comment: "",
      from: authState.address,
    });
    updateStats();
  }

  return (
    <div className="wrapper">
      <div className="row top-wrapper">
        <div className="col-12 col-md-12 tw-right">
          <span className="tw-heading1">
            {product.item["title"]}
          </span>
          <br/>
          <span className='tw-product-stats d-flex align-items-center'>
            <Rating rating={product.item["rating"]/20} editable={false}/>
            &nbsp;| &nbsp;
            <span>
              {product.reviews.length} ratings &nbsp;| &nbsp;
            </span>
            <span>
              {product.transactions.length} transactions
            </span>
          </span>
          <div className='mt-2'>
            <strong>Batch #:</strong> {product.item["batchNumber"] || "N/A"}
            {product.item["expiryDate"] && (
              <>
                {" | "}
                {new Date().getTime() / 1000 > product.item["expiryDate"] ? (
                  <span className='badge bg-danger'>EXPIRED</span>
                ) : (
                  <span className='badge bg-success'>FRESH</span>
                )}
              </>
            )}
          </div>
          <div className='mt-1'>
            <strong>Manufactured:</strong> {product.item["manufacturingDate"] ? new Date(product.item["manufacturingDate"] * 1000).toDateString() : "N/A"}
            {" | "}
            <strong>Expires:</strong> {product.item["expiryDate"] ? new Date(product.item["expiryDate"] * 1000).toDateString() : "N/A"}
          </div>
          <div className='mt-1'>
            <strong>Launched:</strong> {new Date(product.item["launchDate"] * 1000).toDateString()}
          </div>
          <br/>
          <span className='tw-brand'>
            Brand: {product.manufacturer["name"]} &nbsp;| &nbsp;
            {product.manufacturer.isRenewableUsed?
              <span className="">
                <span className="badge bg-success">Eco Friendly</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">Non Eco Friendly</span>
              </span>
            }
          </span>
          <br/>
          <span className='tw-seller text-wrap'>
            Sold by: {formattedAddress(product.item["currentOwner"])}
          </span>
          <br/>
          <div className='tw-transfer-wrapper'>
            <input
              type="text"
              placeholder='Enter receiver address'
              value={transferState.to}
              disabled={!isOwner}
              onChange={
                (e) => {
                  setTransferState({
                    ...transferState,
                    to: e.target.value
                  })
                }
              }
            />
            &nbsp;
            &nbsp;
            <button
              disabled={!isOwner}
              onClick={transfer}
            >Transfer</button>
          </div>
        </div>
      </div>
      <hr/>
      <div className="middle-wrapper">
        <span className='heading'>
          Ingredients
        </span>
        <br/>
        <span>
          {product.rawProducts.map((rawProduct, index) => (
            <span key={index} className='me-3'>
              {rawProduct["name"]} &nbsp;
              {rawProduct["isVerified"]?
                <i className='text-success fa fa-check' title='Verified'/>
              :
                <i className='text-warning fa fa-exclamation' title='Not verified'/>
              }
            </span>
          ))}
        </span>
      </div>
      <hr/>
      <div className="bottom-wrapper">
        <div className='row'>
          <div className='col-12 col-md-6'>
            <span className='heading'>
              Transaction Timeline
            </span>
            <div className='timeline-container mt-3'>
              {product.transactions.length === 0 ? (
                <div className='text-muted text-center py-3'>
                  <i className='fa fa-info-circle'></i> No transactions yet
                </div>
              ) : (
                product.transactions.map((transaction, index) => (
                  <div key={index} className='timeline-item'>
                    <div className='timeline-marker'>
                      <div className='timeline-icon'>
                        <i className='fa fa-exchange'></i>
                      </div>
                      {index < product.transactions.length - 1 && (
                        <div className='timeline-line'></div>
                      )}
                    </div>
                    <div className='timeline-content'>
                      <div className='timeline-header'>
                        <span className='timeline-date'>
                          <i className='fa fa-clock-o'></i> {new Date(transaction["date"] * 1000).toLocaleString()}
                        </span>
                        <span className='badge bg-primary ms-2'>
                          Transfer #{product.transactions.length - index}
                        </span>
                      </div>
                      <div className='timeline-body mt-2'>
                        <div className='d-flex align-items-center mb-2'>
                          <i className='fa fa-user text-danger me-2'></i>
                          <strong>From:</strong>
                          <span className='ms-2 font-monospace' style={{fontSize: '0.9rem'}}>
                            {formattedAddress(transaction["from"])}
                          </span>
                        </div>
                        <div className='d-flex align-items-center'>
                          <i className='fa fa-arrow-down text-muted me-2'></i>
                        </div>
                        <div className='d-flex align-items-center mt-1'>
                          <i className='fa fa-user text-success me-2'></i>
                          <strong>To:</strong>
                          <span className='ms-2 font-monospace' style={{fontSize: '0.9rem'}}>
                            {formattedAddress(transaction["to"])}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className='col-12 col-md-6'>
            <span className='heading'>
              Reviews
            </span>
            <div className='bw-review-wrapper'>
              <textarea
                placeholder='Comment'
                className='col-10'
                value={reviewState.comment}
                disabled={!isOwner}
                onChange={
                  (e) => {
                    setReviewState({
                      ...reviewState,
                      comment: e.target.value
                    })
                  }
                }
              />
              <br/>
              <span className='d-flex align-items-center'>
                <Rating rating={reviewState.rating} editable={isOwner} onChange={
                  (rating) => {
                    setReviewState({
                      ...reviewState,
                      rating: rating*20
                    })
                  }
                }/>
                <button onClick={postReview} disabled={!isOwner}>Post</button>
              </span>
              <br/>
            </div>
            {product.reviews.map((review, index) => (
              <div key={index} className='my-1 border'>
                <span className='d-flex align-items-center'>
                  <Rating rating={review["rating"]/20} editable={false}/>
                  &nbsp;
                  <span className='badge bg-success'>Verified Purchase</span>
                </span>
                Reviewer: &nbsp; {formattedAddress(review["reviewer"])} &nbsp;
                <br/>
                Reviewed on: {new Date(review["date"] * 1000).toDateString()}
                <br/>
                {review["comment"]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Product;