import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

const ActiveSubscription = ({ subscription }) => {
  return (
    <Container className="active-subscription-section">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="active-subscription-card">
            <Card.Body className="text-center">
              <div className="subscription-status-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h4 className="subscription-title">
                <Badge bg="light" className="status-badge text-success">
                  Active Subscription
                </Badge>
              </h4>
              <h5 className="current-plan">{subscription.planName}</h5>
              <p className="subscription-description">
                You're enjoying all the premium benefits of our subscription
                service
              </p>
              <div className="renewal-info">
                <small className="renewal-text">
                  <i className="bi bi-calendar-event me-2"></i>
                  Renews on:{" "}
                  {new Date(subscription.renewAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ActiveSubscription;
