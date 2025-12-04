import { useContext, useState } from "react"
import { Button, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import '../../Assests/Styles/launchProduct.modal.css';
import { AuthContext } from "../../Services/Contexts/AuthContext"
import { ContractContext } from "../../Services/Contexts/ContractContext";
import Toast from "../Toast";
import Loading from "../Loading";

const LIGHTHOUSE_API_KEY = '84ce00be.26d4027ab7774b249b0dd66dff4ecc6b';

const LaunchProduct = ({isModalOpen, toggleModal, manufacturerRP}) => {
  const { authState } = useContext(AuthContext);
  const { contractState, updateStats } = useContext(ContractContext);
  const [product, setProduct] = useState({
    id: "",
    title: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    selectedRawProducts: {},
    image: {
      url: "",
      isLoading: false,
    }
  })

  const toggleRP = (rawProductIndex) => {
    setProduct(product => {
      return {
        ...product,
        selectedRawProducts: {
          ...product.selectedRawProducts,
          [rawProductIndex]: !product.selectedRawProducts[rawProductIndex]
        }
      }
    });
  }

  const launch = async () => {
    if(product.id === "" || product.title === "") {
      Toast("error", "Product id and title required!");
      return;
    }

    // Validate product ID is numeric only
    if (!/^\d+$/.test(product.id)) {
      Toast("error", "Product ID must be numeric only (e.g., 1, 2, 123)");
      return;
    }

    // Validate batch number
    if(!product.batchNumber || product.batchNumber.trim() === "") {
      Toast("error", "Batch number is required");
      return;
    }

    // Validate dates
    if(!product.manufacturingDate || !product.expiryDate) {
      Toast("error", "Manufacturing and expiry dates are required");
      return;
    }

    const mfgDate = new Date(product.manufacturingDate).getTime() / 1000; // Convert to Unix timestamp
    const expDate = new Date(product.expiryDate).getTime() / 1000;

    if(expDate <= mfgDate) {
      Toast("error", "Expiry date must be after manufacturing date");
      return;
    }

    const selectedRPIndexes = Object.keys(product.selectedRawProducts).filter(key => product.selectedRawProducts[key]);
    const selectedRP = selectedRPIndexes.map(key => {
      return {
        "name": manufacturerRP[key].name,
        "isVerified": manufacturerRP[key].isVerified
      }
    })
    if(selectedRP.length === 0){
      Toast("error", "Please select atleast one raw product");
      return;
    }

    try {
      // Use empty string if no image uploaded
      const imageUrl = product.image.url || "";

      await contractState.productContract.methods.add(
        product.id,
        product.title,
        selectedRP,
        imageUrl,
        product.batchNumber,
        mfgDate,
        expDate
      ).send({from: authState.address});
      await contractState.manufacturerContract.methods.launchProduct(product.id).send({from: authState.address});
      Toast("success", "Launced Product!");
      setProduct({
        id: "",
        title: "",
        batchNumber: "",
        manufacturingDate: "",
        expiryDate: "",
        selectedRawProducts: {},
        image: {
          url: "",
          isLoading: false,
        }
      })
      toggleModal();
      updateStats();
    } catch (error) {
      console.error("Launch product error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      // Extract meaningful error message
      let errorMessage = "Failed to launch product";

      // Try different error formats
      const errMsg = error.message || error.data?.message || error.reason || "";

      if (errMsg.includes("User denied") || error.code === 4001) {
        errorMessage = "Transaction cancelled by user";
      } else if (errMsg.includes("Manufacturer not verified")) {
        errorMessage = "Manufacturer must be verified by admin first";
      } else if (errMsg.includes("already exists") || errMsg.includes("Product exists")) {
        errorMessage = "Product ID already exists. Use a different ID";
      } else if (errMsg) {
        // Show the actual error message (first line, truncated)
        errorMessage = errMsg.split('\n')[0].substring(0, 150);
      } else if (error.code === -32603) {
        // Generic JSON-RPC error - check if it's a revert
        errorMessage = "Transaction failed. Check: 1) Product ID is unique, 2) You're verified, 3) Raw products selected";
      }

      Toast("error", errorMessage);
    }
  }

  return (
    <div>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader>Launch Product </ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupText>
              Product ID
            </InputGroupText>
            <Input
              placeholder="Enter numeric ID (e.g., 1, 2, 123)"
              value={product.id}
              onChange={(e) => setProduct(product => ({ ...product, id: e.target.value }))}
            />
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupText>
              Product Title
            </InputGroupText>
            <Input placeholder="product title"
              value={product.title}
              onChange={(e) => setProduct(product => ({ ...product, title: e.target.value }))}
            />
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupText>
              Batch Number
            </InputGroupText>
            <Input
              placeholder="Enter batch number (e.g., BATCH-2024-001)"
              value={product.batchNumber}
              onChange={(e) => setProduct(product => ({ ...product, batchNumber: e.target.value }))}
            />
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupText>
              Manufacturing Date
            </InputGroupText>
            <Input
              type="date"
              value={product.manufacturingDate}
              onChange={(e) => setProduct(product => ({ ...product, manufacturingDate: e.target.value }))}
            />
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupText>
              Expiry Date
            </InputGroupText>
            <Input
              type="date"
              value={product.expiryDate}
              onChange={(e) => setProduct(product => ({ ...product, expiryDate: e.target.value }))}
            />
          </InputGroup>
          <br/>
          <div className="row mt-2 justify-content-around">
            {Object.keys(manufacturerRP).map((rawProductIndex) => {
              const rawProduct = manufacturerRP[rawProductIndex];
              return (
                <div className={`
                  col-5 d-flex justify-content-between 
                  align-items-center my-2 mx-1 raw-product-card 
                  ${product.selectedRawProducts[rawProductIndex]? "raw-product-card-selected": ""}
                  `} key={rawProductIndex}
                  onClick={() => toggleRP(rawProductIndex)}
                  type = "button"
                >
                  <span className="raw-product-card-name">{rawProduct.name}</span>
                  {rawProduct.isVerified?
                    <span className="badge bg-success">Verified</span>
                  :
                    <span className="badge bg-warning">Not Verified</span>
                  }
                </div>
              )
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={launch}>Launch</Button>
          {" "}
          <Button onClick={() => {
            setProduct({
              id: "",
              title: "",
              selectedRawProducts: {},
              image: {
                url: "",
                isLoading: false,
              }
            })
            toggleModal();
          }}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
export default LaunchProduct;