import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import SubscriptionCard from "./SubscriptionCard";

const SubscriptionPlans = ({ plans, onSubscribe, currentSubscription }) => {
  return (
    <Container className="subscription-plans-section">
      <Row className="mb-4">
        <Col className="text-center">
          <h2 className="plans-title">Choose Your Perfect Plan</h2>
          <p className="plans-subtitle">
            Flexible pricing for every coffee lover
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        {plans.map((plan) => (
          <Col lg={4} md={6} key={plan.id} className="mb-4">
            <SubscriptionCard
              plan={plan}
              onSubscribe={onSubscribe}
              isActive={currentSubscription?.planId === plan.id}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SubscriptionPlans;
