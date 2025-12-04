import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";

import '../../Assests/Styles/products.page.css';
import ProductCard from "../../Components/Cards/ProductCard";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchManufacturer } from "../../Services/Utils/stakeholder";
import fake_product from '../../Assests/Images/fake_product.jpg';
import Toast from "../../Components/Toast";

const Products = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [productIds, setProductids] = useState([]);
  const [products, setProducts] = useState({});
  const [allProducts, setAllProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    expiryStatus: "all",
    verifiedOnly: false,
    ecoFriendlyOnly: false
  });

  useEffect(() => {
    if(contractState.productContract){
      (async () => {
        const productIds = await contractState.productContract.methods.getItemIds().call({from: authState.address});
        setProductids(productIds);
      })();
    }
  },[])

  useEffect(() => {
    if(contractState.productContract){
      (async () => {
        const products = {};
        for(let i = 0; i < productIds.length; i++){
          const response = await contractState.productContract.methods.get(productIds[i]).call({from: authState.address});
          const product = {
            "item": response.item,
            "rawProducts": response.rawProducts,
            "reviews": response.reviews,
            "transactions": response.transactions,
            "manufacturer": await fetchManufacturer(authState.address, contractState.manufacturerContract, response.item["manufacturer"])
          }
          if(product.item.manufacturer != "0x0000000000000000000000000000000000000000"){
            products[productIds[i]] = product;
          }
        }
        console.log(products)
        setAllProducts(products);
        setProducts(products);
      })();
    }
  }, [productIds])

  const applyFilters = () => {
    let filtered = { ...allProducts };

    if (searchTerm.trim() !== "") {
      filtered = Object.keys(filtered).reduce((acc, productId) => {
        const product = filtered[productId];
        const matchesSearch =
          product.item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.item.batchNumber && product.item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
          product.manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          productId.toLowerCase().includes(searchTerm.toLowerCase());

        if (matchesSearch) {
          acc[productId] = product;
        }
        return acc;
      }, {});
    }

    if (filters.expiryStatus !== "all") {
      const currentTime = Math.floor(Date.now() / 1000);
      filtered = Object.keys(filtered).reduce((acc, productId) => {
        const product = filtered[productId];
        const isExpired = product.item.expiryDate && currentTime > product.item.expiryDate;

        if (filters.expiryStatus === "fresh" && !isExpired) {
          acc[productId] = product;
        } else if (filters.expiryStatus === "expired" && isExpired) {
          acc[productId] = product;
        }
        return acc;
      }, {});
    }

    if (filters.verifiedOnly) {
      filtered = Object.keys(filtered).reduce((acc, productId) => {
        const product = filtered[productId];
        if (product.manufacturer.isVerified) {
          acc[productId] = product;
        }
        return acc;
      }, {});
    }

    if (filters.ecoFriendlyOnly) {
      filtered = Object.keys(filtered).reduce((acc, productId) => {
        const product = filtered[productId];
        if (product.manufacturer.isRenewableUsed) {
          acc[productId] = product;
        }
        return acc;
      }, {});
    }

    setProducts(filtered);
  }

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      expiryStatus: "all",
      verifiedOnly: false,
      ecoFriendlyOnly: false
    });
    setProducts(allProducts);
  }

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, allProducts])

  return (
    <div className="wrapper">
      <div className="heading">Products</div>

      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <InputGroup className="mb-3">
              <InputGroupText>
                <i className="fa fa-search"></i>
              </InputGroupText>
              <Input
                placeholder="Search by product name, batch number, manufacturer, or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <div className="row">
              <div className="col-12 col-md-4 mb-2">
                <InputGroup>
                  <InputGroupText>Expiry Status</InputGroupText>
                  <Input
                    type="select"
                    value={filters.expiryStatus}
                    onChange={(e) => setFilters({...filters, expiryStatus: e.target.value})}
                  >
                    <option value="all">All Products</option>
                    <option value="fresh">Fresh Only</option>
                    <option value="expired">Expired Only</option>
                  </Input>
                </InputGroup>
              </div>

              <div className="col-12 col-md-4 mb-2">
                <div className="form-check" style={{padding: '10px'}}>
                  <Input
                    type="checkbox"
                    id="verifiedCheck"
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
                  />
                  <label className="form-check-label" htmlFor="verifiedCheck" style={{marginLeft: '8px'}}>
                    Verified Manufacturers Only
                  </label>
                </div>
              </div>

              <div className="col-12 col-md-4 mb-2">
                <div className="form-check" style={{padding: '10px'}}>
                  <Input
                    type="checkbox"
                    id="ecoCheck"
                    checked={filters.ecoFriendlyOnly}
                    onChange={(e) => setFilters({...filters, ecoFriendlyOnly: e.target.checked})}
                  />
                  <label className="form-check-label" htmlFor="ecoCheck" style={{marginLeft: '8px'}}>
                    Eco-Friendly Only
                  </label>
                </div>
              </div>
            </div>

            <div className="text-center mt-2">
              <Button color="secondary" size="sm" onClick={resetFilters}>
                <i className="fa fa-refresh"></i> Reset Filters
              </Button>
              <span className="ms-3 text-muted">
                Showing {Object.keys(products).length} of {Object.keys(allProducts).length} products
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {Object.keys(products).map(productId => {
          const product = products[productId];
          return(
            <div key={productId} className="col-12 col-md-6">
              <NavLink className="nav-link" to={`/products/${productId}`} state={{product}}>
                <ProductCard product={product} />
              </NavLink>
            </div>
          )
        })}
        {Object.keys(products).length === 0 && Object.keys(allProducts).length > 0 ?
          <div align="center">
            <div className="col-10 col-md-6">
              <img src={fake_product} width="100%" />
              <span>
                No products match your search criteria
              </span>
            </div>
          </div>
        :
          ""
        }
        {Object.keys(allProducts).length === 0 ?
          <div align="center">
            <div className="col-10 col-md-6">
              <img src={fake_product} width="100%" />
              <span>
                No products found
              </span>
            </div>
          </div>
        :
          ""
        }
      </div>

    </div>
  )
}
export default Products;