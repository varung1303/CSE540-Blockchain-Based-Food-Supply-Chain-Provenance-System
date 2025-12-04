import { useContext, useEffect, useState } from "react";
import { Card, CardBody, Row } from "reactstrap";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchManufacturer } from "../../Services/Utils/stakeholder";

const BottomWrapper = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [enhancedStats, setEnhancedStats] = useState({
    expiredProducts: 0,
    freshProducts: 0,
    uniqueBatches: new Set(),
    ecoFriendlyProducts: 0
  });

  useEffect(() => {
    const calculateEnhancedStats = async () => {
      if (!contractState.productContract) return;

      try {
        const productIds = await contractState.productContract.methods.getItemIds().call({ from: authState.address });
        const currentTime = Math.floor(Date.now() / 1000);
        const batches = new Set();
        let expiredCount = 0;
        let freshCount = 0;
        let ecoCount = 0;

        for (let i = 0; i < productIds.length; i++) {
          const response = await contractState.productContract.methods.get(productIds[i]).call({ from: authState.address });

          if (response.item.manufacturer === "0x0000000000000000000000000000000000000000") {
            continue;
          }

          if (response.item.expiryDate && currentTime > response.item.expiryDate) {
            expiredCount++;
          } else if (response.item.expiryDate) {
            freshCount++;
          }

          if (response.item.batchNumber) {
            batches.add(response.item.batchNumber);
          }

          try {
            const manufacturer = await fetchManufacturer(
              authState.address,
              contractState.manufacturerContract,
              response.item.manufacturer
            );
            if (manufacturer.isRenewableUsed) {
              ecoCount++;
            }
          } catch (e) {
          }
        }

        setEnhancedStats({
          expiredProducts: expiredCount,
          freshProducts: freshCount,
          uniqueBatches: batches,
          ecoFriendlyProducts: ecoCount
        });
      } catch (error) {
        console.error("Error calculating enhanced stats:", error);
      }
    };

    calculateEnhancedStats();
  }, [contractState.productContract, authState.address]);

  const stats = [
    {
      icon: "fa-cube",
      label: "Total Products",
      count: contractState.stats.productsCount,
      color: "#3498db"
    },
    {
      icon: "fa-check-circle",
      label: "Fresh Products",
      count: enhancedStats.freshProducts,
      color: "#27ae60"
    },
    {
      icon: "fa-exclamation-triangle",
      label: "Expired Products",
      count: enhancedStats.expiredProducts,
      color: "#e74c3c"
    },
    {
      icon: "fa-barcode",
      label: "Unique Batches",
      count: enhancedStats.uniqueBatches.size,
      color: "#9b59b6"
    },
    {
      icon: "fa-leaf",
      label: "Eco-Friendly",
      count: enhancedStats.ecoFriendlyProducts,
      color: "#16a085"
    },
    {
      icon: "fa-exchange",
      label: "Transactions",
      count: contractState.stats.transactionsCount,
      color: "#f39c12"
    },
    {
      icon: "fa-star",
      label: "Reviews",
      count: contractState.stats.reviewsCount,
      color: "#e67e22"
    }
  ]

  return (
    <div className="bottom-wrapper">
      <h5 className="bw-heading">
        Dashboard Statistics
      </h5>
      <Row className="justify-content-center">
        {stats.map((stat, index) => (
          <Card className="col-12 col-md-3 col-lg-2 border-0 bw-stats-card" key={index} style={{ margin: '10px' }}>
            <CardBody>
              <div className="d-flex flex-column align-items-center bw-stats-card-body">
                <i className={`fa ${stat.icon} fa-2x mb-2`} style={{ color: stat.color }}></i>
                <div className="bw-stats-card-count" style={{ color: stat.color, fontSize: '2rem', fontWeight: 'bold' }}>
                  {stat.count}
                </div>
                <div className="bw-stats-card-label text-center" style={{ fontSize: '0.9rem' }}>
                  {stat.label}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </Row>
    </div>
  )
}
export default BottomWrapper;