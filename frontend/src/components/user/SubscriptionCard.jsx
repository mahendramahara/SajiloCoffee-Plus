import React from "react";
import { Card, Button, Badge, ListGroup } from "react-bootstrap";

const SubscriptionCard = ({ plan, onSubscribe, isActive = false }) => {
  const getCycleLabel = (cycle) => {
    switch (cycle) {
      case "monthly":
        return "Month";
      case "6-month":
        return "6 Months";
      case "annual":
        return "Year";
      default:
        return cycle;
    }
  };

  const getPricePerMonth = (price, cycle) => {
    switch (cycle) {
      case "6-month":
        return Math.round(price / 6);
      case "annual":
        return Math.round(price / 12);
      default:
        return price;
    }
  };

  return (
    <div className="subscription-card-wrapper">
      <Card
        className={`subscription-plan-card ${
          plan.popular ? "popular-plan" : ""
        } ${isActive ? "active-plan" : ""}`}
      >
        {plan.popular && (
          <div className="popular-badge">
            <Badge bg="warning" className="text-dark">
              <i className="bi bi-star-fill me-1"></i>
              Most Popular
            </Badge>
          </div>
        )}

        <Card.Header className="text-center plan-header">
          <h4 className="plan-title">{plan.name}</h4>
          <div className="plan-price">
            <span className="currency">NPR</span>
            <span className="amount">{plan.price.toLocaleString()}</span>
            <span className="period">/{getCycleLabel(plan.cycle)}</span>
          </div>
          {plan.cycle !== "monthly" && (
            <div className="price-breakdown">
              <small className="text-muted">
                NPR {getPricePerMonth(plan.price, plan.cycle)}/month
              </small>
            </div>
          )}
          {plan.savingsPercentVsMonthly && (
            <div className="savings-badge">
              <Badge bg="success" className="savings-tag">
                Save {plan.savingsPercentVsMonthly}%
              </Badge>
            </div>
          )}
        </Card.Header>

        <Card.Body className="plan-body">
          <ListGroup variant="flush" className="features-list">
            {plan.features.map((feature, index) => (
              <ListGroup.Item key={index} className="feature-item">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                {feature}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="perks-section">
            <h6 className="perks-title">Premium Perks</h6>
            <div className="perks-grid">
              <div className="perk-item">
                <i className="bi bi-gift text-primary"></i>
                <span>{plan.perks.freePowderGrams}g Free Powder</span>
              </div>
              <div className="perk-item">
                <i className="bi bi-door-open text-primary"></i>
                <span>{plan.perks.indoorVisitsPerMonth} Visits/Month</span>
              </div>
              <div className="perk-item">
                <i className="bi bi-clock text-primary"></i>
                <span>{plan.perks.privateSpaceHours}hrs Private Space</span>
              </div>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="plan-footer">
          <Button
            className={`subscribe-btn ${
              plan.popular ? "btn-primary" : "btn-outline-primary"
            }`}
            size="lg"
            onClick={() => onSubscribe(plan.id, plan.name)}
            disabled={isActive}
          >
            {isActive ? (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Current Plan
              </>
            ) : (
              <>
                <i className="bi bi-arrow-right me-2"></i>
                Subscribe Now
              </>
            )}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default SubscriptionCard;
