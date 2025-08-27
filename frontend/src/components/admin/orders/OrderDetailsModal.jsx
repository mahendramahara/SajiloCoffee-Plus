import React from 'react';
import { Modal, Button, Table, Badge, Row, Col } from 'react-bootstrap';

const OrderDetailsModal = ({ show, order, onClose }) => {
  if (!order) return null;

  const getStatusBadge = (status) => {
    const variants = {
      pending: "secondary",
      preparing: "warning", 
      served: "success",
      cancelled: "danger",
    };
    return variants[status] || "primary";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Order Details #{order.id.slice(-8)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col md={6}>
            <h6>Customer Information</h6>
            <p><strong>Name:</strong> {order.user?.name}</p>
            <p><strong>Email:</strong> {order.user?.email}</p>
            <p><strong>Table:</strong> {order.table}</p>
          </Col>
          <Col md={6}>
            <h6>Order Information</h6>
            <p>
              <strong>Status:</strong>{" "}
              <Badge bg={getStatusBadge(order.status)}>
                {order.status}
              </Badge>
            </p>
            <p><strong>Placed:</strong> {formatTime(order.placedAt)}</p>
            <p><strong>Updated:</strong> {formatTime(order.updatedAt)}</p>
          </Col>
        </Row>

        <h6>Order Items</h6>
        <Table responsive>
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Add-ons</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.product?.name}</td>
                <td>{item.size}</td>
                <td>{item.qty}</td>
                <td>₨{item.unitPrice}</td>
                <td>
                  {item.addons.length > 0 ? (
                    <div>
                      {item.addons.map((addon, i) => (
                        <Badge key={i} bg="secondary" className="me-1">
                          {addon}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </td>
                <td>₨{item.unitPrice * item.qty}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="order-summary mt-4">
          <div className="d-flex justify-content-between">
            <span>Subtotal:</span>
            <span>₨{order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="d-flex justify-content-between text-success">
              <span>Discount:</span>
              <span>-₨{order.discount}</span>
            </div>
          )}
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total:</span>
            <span>₨{order.total}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;
