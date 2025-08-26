import React, { useState } from "react";
import { Container, Row, Col, Button, Badge, Tab, Tabs } from "react-bootstrap";
import { useAuth } from "../../context/useAuth";
import ordersData from "../../api/orders.json";
import productsData from "../../api/products.json";

const Orders = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("active");

  const userOrders = ordersData.filter(
    (order) => order.userId === currentUser?.id
  );

  const getProductDetails = (productId) => {
    return productsData.find((p) => p.id === productId);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      preparing: { variant: "warning", text: "Preparing" },
      ready: { variant: "success", text: "Ready" },
      served: { variant: "secondary", text: "Served" },
    };

    const config = statusConfig[status] || { variant: "light", text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const activeOrders = userOrders.filter((order) =>
    ["preparing", "ready"].includes(order.status)
  );
  const completedOrders = userOrders.filter(
    (order) => order.status === "served"
  );

  const OrderCard = ({ order }) => (
    <div className="cart-item mb-3">
      <Row>
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="fw-semibold mb-0">Order #{order.id.slice(-8)}</h6>
            {getStatusBadge(order.status)}
          </div>

          <div className="mb-2">
            <small className="text-muted">
              <i className="bi bi-calendar me-1"></i>
              {new Date(order.placedAt).toLocaleString()}
            </small>
            <small className="text-muted ms-3">
              <i className="bi bi-geo-alt me-1"></i>
              Table {order.table}
            </small>
          </div>

          <div className="mb-2">
            {order.items.map((item, index) => {
              const product = getProductDetails(item.productId);
              return (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center py-1"
                >
                  <div>
                    <span className="fw-medium">
                      {product?.name || "Unknown Product"}
                    </span>
                    <small className="text-muted ms-2">
                      {item.size} x {item.qty}
                      {item.addons.length > 0 && ` (${item.addons.join(", ")})`}
                    </small>
                  </div>
                  <small className="text-muted">
                    NPR {item.unitPrice * item.qty}
                  </small>
                </div>
              );
            })}
          </div>

          {order.subscriptionPerkApplied && (
            <div className="mb-2">
              <Badge bg="info" className="me-2">
                <i className="bi bi-crown me-1"></i>
                Subscription Discount Applied
              </Badge>
            </div>
          )}
        </Col>

        <Col md={4} className="text-end">
          <div className="mb-2">
            <div className="fw-semibold text-primary">NPR {order.total}</div>
            {order.discount > 0 && (
              <small className="text-muted text-decoration-line-through">
                NPR {order.subtotal}
              </small>
            )}
          </div>

          {order.status === "preparing" && (
            <small className="text-warning">
              <i className="bi bi-clock me-1"></i>
              Estimated: 10-15 mins
            </small>
          )}

          {order.status === "ready" && (
            <small className="text-success">
              <i className="bi bi-check-circle me-1"></i>
              Ready for pickup!
            </small>
          )}
        </Col>
      </Row>
    </div>
  );

  if (userOrders.length === 0) {
    return (
      <Container className="py-5">
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-bag"></i>
          </div>
          <h3>No orders yet</h3>
          <p>Start by ordering some delicious coffee</p>
          <Button href="/menu" className="btn-custom-primary">
            Browse Menu
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <div className="page-header">
        <Container>
          <Row>
            <Col>
              <h1 className="display-5 fw-bold text-primary mb-2">My Orders</h1>
              <p className="lead text-muted">Track your coffee orders</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
          <Tab
            eventKey="active"
            title={`Active Orders (${activeOrders.length})`}
          >
            {activeOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <i className="bi bi-clock"></i>
                </div>
                <h4>No active orders</h4>
                <p>Your current orders will appear here</p>
              </div>
            ) : (
              <div>
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </Tab>

          <Tab
            eventKey="completed"
            title={`Order History (${completedOrders.length})`}
          >
            {completedOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <i className="bi bi-check-circle"></i>
                </div>
                <h4>No completed orders</h4>
                <p>Your order history will appear here</p>
              </div>
            ) : (
              <div>
                {completedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default Orders;
