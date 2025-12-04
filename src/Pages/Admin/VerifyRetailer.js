import { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/verify.page.css';
import RetailerCard from "../../Components/Cards/RetailerCard";

const VerifyRetailer = () => {
  const {contractState} = useContext(ContractContext);
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    (async() => {
      if(contractState.retailerContract){
        setAddresses(await contractState.retailerContract.methods.getAddresses().call());
      }
    })();
  }, [contractState.retailerContract])
  return (
    <div className="verify">
      <div className="heading">Verify Retailer</div>
      <div className="row">
        {addresses.map(address => (
          <RetailerCard key={address} id={address} />
        ))}
      </div>
    </div>
  )
}
export default VerifyRetailer;
