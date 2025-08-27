import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';

const SubscriptionPlanCard = ({ plan, userSubscriptions, onShowDetails, onEdit, onDelete, hasPermission }) => {
  const getCycleBadge = (cycle) => {
    const colors = {
      monthly: "primary",
      "3-month": "info", 
      "6-month": "warning",
      yearly: "success"
    };
    return colors[cycle] || "secondary";
  };

  const subscribersCount = userSubscriptions.filter(
    (u) => u.subscription.planId === plan.id
  ).length;

  return (
    <Card className={`subscription-plan-card h-100 ${plan.popular ? "popular-plan" : ""}`}>
      {plan.popular && (
        <div className="popular-badge">
          <Badge bg="warning">
            <i className="fas fa-star me-1"></i>
            Most Popular
          </Badge>
        </div>
      )}

      <Card.Body className="text-center">
        <div className="plan-icon mb-3">
          <i className="fas fa-crown"></i>
        </div>

        <h4 className="plan-name">{plan.name}</h4>

        <div className="plan-price mb-3">
          <h2 className="price">₨{plan.price.toLocaleString()}</h2>
          <Badge bg={getCycleBadge(plan.cycle)} className="cycle-badge">
            {plan.cycle}
          </Badge>
        </div>

        {plan.savingsPercentVsMonthly && (
          <div className="savings-badge mb-3">
            <Badge bg="success">Save {plan.savingsPercentVsMonthly}%</Badge>
          </div>
        )}

        <div className="plan-features mb-4">
          {plan.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="feature-item">
              <i className="fas fa-check text-success me-2"></i>
              {feature}
            </div>
          ))}
          {plan.features.length > 3 && (
            <small className="text-muted">
              +{plan.features.length - 3} more features
            </small>
          )}
        </div>

        <div className="plan-stats mb-3">
          <Row>
            <Col>
              <div className="stat-item">
                <strong>{subscribersCount}</strong>
                <br />
                <small className="text-muted">Subscribers</small>
              </div>
            </Col>
            <Col>
              <div className="stat-item">
                <strong>{plan.perks?.indoorVisitsPerMonth || 0}</strong>
                <br />
                <small className="text-muted">Visits/Month</small>
              </div>
            </Col>
          </Row>
        </div>

        <div className="plan-actions">
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => onShowDetails(plan)}
            className="me-2"
          >
            <i className="fas fa-eye"></i>
          </Button>
          {hasPermission("subscriptions", "update") && (
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => onEdit(plan)}
            >
              <i className="fas fa-edit"></i>
            </Button>
          )}
          {hasPermission("subscriptions", "delete") && (
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => onDelete(plan.id)}
            >
              <i className="fas fa-trash"></i>
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SubscriptionPlanCard;
