import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/card.css';
import Toast from "../Toast";
import retailer_default from "../../Assests/Images/manufacturer_default.jpg";
import { fetchRetailer } from "../../Services/Utils/stakeholder";

const RetailerCard = ({id, retailerObject}) => {
  const {authState} = useContext(AuthContext);
  const {contractState} = useContext(ContractContext);
  const role = authState.stakeholder.role;
  const [retailer, setRetailer] = useState({
    id: "00000",
    name: "",
    location: "",
    inventory: [],
    totalSales: 0,
  });

  useEffect(() => {
    if(retailerObject){
      setRetailer(retailerObject);
    }
    else if(contractState.retailerContract){
      (async() => {
        setRetailer(await fetchRetailer(
          authState.address,
          contractState.retailerContract,
          id
        ))
      })();
    }
  }, [retailerObject])

  const verify = async () => {
    try{
      await contractState.retailerContract.methods.verify(id).send({from: authState.address});
      setRetailer(retailer => {
        return {
          ...retailer,
          isVerified: true
        }
      })
      Toast("success", "Retailer verified successfully");
    } catch(e){
      Toast("error", e.message);
    }
  }

  return (
    <div className="col-12 col-lg-6 my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img
            src={retailer_default}
            width="100%"
            alt="Retailer"
          />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Id: </span>
          <span className="card-value">{retailer.formattedAddress}</span>
          <br/>
          <span className="card-key">Name: </span>
          <span className="card-value">{retailer.name}</span>
          <br/>
          <span className="card-key">Location: </span>
          <span className="card-value">{retailer.location}</span>
          <br/>
          <span className="">
            <span className="card-key"> Inventory: </span>
            <span className="badge bg-info">{retailer.inventory?.length || 0} Products</span>
          </span>
          <br/>
          <span className="">
            <span className="card-key"> Total Sales: </span>
            <span className="badge bg-success">{retailer.totalSales || 0}</span>
          </span>
          <br/>
          <span className="">
            <span className="card-key"> Verification: </span>
            {retailer.isVerified?
              <span className="">
                <span className="badge bg-success">Verified</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">Not Verified</span>
                {role === "admin"?
                  <span
                    className="badge bg-dark mx-1"
                    type="button"
                    onClick={verify}
                  >
                    <i className="fa fa-certificate"/>
                    Verify
                  </span>
                : ""
                }
              </span>
            }
          </span>
        </div>
      </div>
      <hr/>
    </div>
  )
}
export default RetailerCard;
