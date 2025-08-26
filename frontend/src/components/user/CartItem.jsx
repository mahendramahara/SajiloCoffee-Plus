import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="cart-item">
      <Row className="align-items-center g-3">
        <Col xs={12} sm={6} lg={5}>
          <div className="d-flex align-items-center">
            <div className="product-image-sm me-3">
              <i className="bi bi-cup-hot"></i>
            </div>
            <div className="product-details">
              <h6 className="fw-semibold mb-1 product-name">{item.name}</h6>
              <p className="text-muted small mb-0">{item.size}</p>
              {item.customizations && (
                <p className="text-muted small mb-0 customizations">
                  {Object.entries(item.customizations)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        </Col>

        <Col xs={6} sm={3} lg={2}>
          <div className="price-section">
            <span className="text-muted small d-block d-sm-none">Price</span>
            <span className="fw-medium price-text">NPR {item.price}</span>
          </div>
        </Col>

        <Col xs={6} sm={3} lg={2}>
          <div className="quantity-section">
            <span className="text-muted small d-block d-sm-none">Quantity</span>
            <div className="quantity-control">
              <Button
                size="sm"
                variant="outline-secondary"
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.quantity - 1)}
              >
                -
              </Button>
              <Form.Control
                type="number"
                size="sm"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                min="1"
                className="quantity-input"
              />
              <Button
                size="sm"
                variant="outline-secondary"
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>
        </Col>

        <Col xs={6} sm={6} lg={2}>
          <div className="total-section">
            <span className="text-muted small d-block d-sm-none">Total</span>
            <span className="fw-semibold total-price">
              NPR {item.price * item.quantity}
            </span>
          </div>
        </Col>

        <Col xs={6} sm={6} lg={1}>
          <div className="action-section">
            <Button
              size="sm"
              variant="outline-danger"
              className="remove-btn"
              onClick={() => onRemove(item.id)}
              title="Remove item"
            >
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartItem;
