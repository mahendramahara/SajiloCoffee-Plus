import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import TableSelection from "./TableSelection";

const CartSummary = ({
  items,
  onCheckout,
  onContinueShopping,
  selectedTable,
  onTableChange,
  tables,
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + delivery + tax;

  return (
    <Card className="cart-summary">
      <Card.Header>
        <h5 className="mb-0">Order Summary</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-2">
          <Col>Subtotal ({items.length} items)</Col>
          <Col xs="auto">NPR {subtotal}</Col>
        </Row>
        <Row className="mb-2">
          <Col>Delivery Fee</Col>
          <Col xs="auto">
            {delivery === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              `NPR ${delivery}`
            )}
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>Tax (13%)</Col>
          <Col xs="auto">NPR {tax}</Col>
        </Row>
        <hr />
        <Row className="mb-3">
          <Col>
            <strong>Total</strong>
          </Col>
          <Col xs="auto">
            <strong>NPR {total}</strong>
          </Col>
        </Row>

        {delivery > 0 && (
          <div className="alert alert-info py-2 px-3 mb-3">
            <small>
              <i className="bi bi-info-circle me-2"></i>
              Add NPR {500 - subtotal} more for free delivery
            </small>
          </div>
        )}

        <TableSelection
          selectedTable={selectedTable}
          onTableChange={onTableChange}
          tables={tables}
        />

        <div className="d-grid gap-2">
          <Button
            className="btn-custom-primary"
            size="lg"
            onClick={onCheckout}
            disabled={items.length === 0 || !selectedTable}
          >
            <i className="bi bi-credit-card me-2"></i>
            Proceed to Checkout
          </Button>
          <Button variant="outline-primary" onClick={onContinueShopping}>
            Continue Shopping
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartSummary;
