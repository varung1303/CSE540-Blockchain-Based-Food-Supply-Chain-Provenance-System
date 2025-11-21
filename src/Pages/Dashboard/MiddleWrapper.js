import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";

const MiddleWrapper = () => {
  const features = [
    {
      title: "TRACEABILITY",
      description: "Mechanism to track the origin of a product, and the chain of distribution. This helps to ensure that the product is safe and secure."
    },
    {
      title: "TRADEABILITY",
      description: "Mechanism to trade a product with other stakeholders. This helps to ensure that the product is original and authentic."
    },
    {
      title: "REPUTATION SYSTEM",
      description: "Mechanism to allow users to rate product in marketplace in order to build trust through reputation."
    }
  ]

  return (
    <div className="middle-wrapper" style={{padding: '2rem 0'}}>
      <h5 className="mw-heading">
        Blockchain Powered End To End Consumer Experience Platform
      </h5>
      <Row>
        {features.map((feature, index) => (
          <Col md={4} sm={12} key={index} className="mb-4">
            <Card style={{
              height: '100%',
              background: 'var(--card-background)',
              border: 'none',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <CardBody>
                <CardTitle tag="h5" style={{
                  textAlign: 'center',
                  color: 'var(--primary-color)',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  marginBottom: '1rem'
                }}>
                  {feature.title}
                </CardTitle>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  textAlign: 'center'
                }}>
                  {feature.description}
                </p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
export default MiddleWrapper;