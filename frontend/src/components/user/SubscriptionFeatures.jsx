import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const SubscriptionFeatures = ({ features }) => {
  return (
    <Container className="subscription-features-section">
      <Row className="mb-4">
        <Col className="text-center">
          <h2 className="features-title">Why Choose Our Subscriptions?</h2>
          <p className="features-subtitle">
            All plans include these amazing benefits
          </p>
        </Col>
      </Row>

      <Row className="features-grid">
        {features.map((feature, index) => (
          <Col lg={3} md={6} key={index} className="mb-4">
            <div className="subscription-feature-card">
              <div className="feature-icon-wrapper">
                <i className={`bi ${feature.icon} feature-icon`}></i>
              </div>
              <h5 className="feature-title">{feature.title}</h5>
              <p className="feature-description">{feature.description}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SubscriptionFeatures;
