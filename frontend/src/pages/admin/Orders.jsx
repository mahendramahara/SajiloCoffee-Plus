import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import { useAuth } from "../../context/useAuth";
import { showNotification } from "../../utils/notify";
import ordersData from "../../api/orders.json";
import productsData from "../../api/products.json";
import usersData from "../../api/users.json";

const OrderManagement = () => {
  const { hasPermission } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const orderStatuses = ["all", "pending", "preparing", "served", "cancelled"];

  useEffect(() => {
    const ordersWithDetails = ordersData.map((order) => {
      const user = usersData.find((u) => u.id === order.userId);
      const itemsWithProducts = order.items.map((item) => {
        const product = productsData.find((p) => p.id === item.productId);
        return { ...item, product };
      });

      return {
        ...order,
        user,
        items: itemsWithProducts,
      };
    });

    setOrders(ordersWithDetails);
    setFilteredOrders(ordersWithDetails);
  }, []);

  const filterOrders = useCallback(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.table.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, orders]);

  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    if (!hasPermission("orders", "update")) {
      showNotification.error("You do not have permission to update orders");
      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );

    showNotification.success(`Order status updated to ${newStatus}`);
  };

  const deleteOrder = (orderId) => {
    if (!hasPermission("orders", "delete")) {
      showNotification.error("You do not have permission to delete orders");
      return;
    }

    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      showNotification.success("Order deleted successfully");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "secondary",
      preparing: "warning",
      served: "success",
      cancelled: "danger",
    };
    return variants[status] || "primary";
  };

  const getStatusActions = (order) => {
    const actions = [];

    if (order.status === "pending") {
      actions.push(
        <Button
          key="prepare"
          size="sm"
          variant="warning"
          onClick={() => updateOrderStatus(order.id, "preparing")}
          className="me-1"
        >
          Start Preparing
        </Button>
      );
    }

    if (order.status === "preparing") {
      actions.push(
        <Button
          key="serve"
          size="sm"
          variant="success"
          onClick={() => updateOrderStatus(order.id, "served")}
          className="me-1"
        >
          Mark Served
        </Button>
      );
    }

    if (order.status !== "cancelled" && order.status !== "served") {
      actions.push(
        <Button
          key="cancel"
          size="sm"
          variant="danger"
          onClick={() => updateOrderStatus(order.id, "cancelled")}
        >
          Cancel
        </Button>
      );
    }

    return actions;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getTotalRevenue = () => {
    return filteredOrders.reduce((sum, order) => sum + order.total, 0);
  };

  const getOrderStats = () => {
    const stats = {
      total: filteredOrders.length,
      pending: filteredOrders.filter((o) => o.status === "pending").length,
      preparing: filteredOrders.filter((o) => o.status === "preparing").length,
      served: filteredOrders.filter((o) => o.status === "served").length,
      cancelled: filteredOrders.filter((o) => o.status === "cancelled").length,
    };
    return stats;
  };

  const stats = getOrderStats();

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="dashboard-title">Order Management</h1>
          <p className="dashboard-subtitle">Track and manage customer orders</p>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={2} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-primary">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.total}</h3>
                  <p className="stat-label">Total Orders</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={2} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-secondary">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.pending}</h3>
                  <p className="stat-label">Pending</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={2} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-warning">
                  <i className="fas fa-fire"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.preparing}</h3>
                  <p className="stat-label">Preparing</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={2} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-success">
                  <i className="fas fa-check"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.served}</h3>
                  <p className="stat-label">Served</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={2} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-danger">
                  <i className="fas fa-times"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.cancelled}</h3>
                  <p className="stat-label">Cancelled</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={2} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-info">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">
                    ₨{getTotalRevenue().toLocaleString()}
                  </h3>
                  <p className="stat-label">Revenue</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="data-card mb-4">
        <Card.Header>
          <h5 className="card-title">Filter Orders</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by order ID, customer, or table..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Statuses"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="data-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title">Orders ({filteredOrders.length})</h5>
            <Badge bg="primary">
              {currentOrders.length} of {filteredOrders.length}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Table</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="order-id">#{order.id.slice(-8)}</span>
                    {order.subscriptionPerkApplied && (
                      <div>
                        <Badge bg="warning" size="sm">
                          <i className="fas fa-crown me-1"></i>
                          Perk Applied
                        </Badge>
                      </div>
                    )}
                  </td>
                  <td>
                    <div>
                      <strong>{order.user?.name || "Unknown"}</strong>
                      <br />
                      <small className="text-muted">{order.user?.email}</small>
                    </div>
                  </td>
                  <td>
                    <span className="table-number">Table {order.table}</span>
                  </td>
                  <td>
                    <div>
                      <strong>
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </strong>
                      <br />
                      <small className="text-muted">
                        {order.items
                          .slice(0, 2)
                          .map((item) => item.product?.name)
                          .join(", ")}
                        {order.items.length > 2 && "..."}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong className="order-total">₨{order.total}</strong>
                      {order.discount > 0 && (
                        <div>
                          <small className="text-success">
                            -₨{order.discount} discount
                          </small>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge bg={getStatusBadge(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td>
                    <small>{formatTime(order.placedAt)}</small>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleShowDetails(order)}
                      >
                        <i className="fas fa-eye"></i>
                      </Button>

                      {hasPermission("orders", "update") &&
                        getStatusActions(order)}

                      {hasPermission("orders", "delete") && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteOrder(order.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber =
                    currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNumber > totalPages) return null;

                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}

                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Order Details #{selectedOrder?.id.slice(-8)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p>
                    <strong>Name:</strong> {selectedOrder.user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.user?.email}
                  </p>
                  <p>
                    <strong>Table:</strong> {selectedOrder.table}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusBadge(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </p>
                  <p>
                    <strong>Placed:</strong>{" "}
                    {formatTime(selectedOrder.placedAt)}
                  </p>
                  <p>
                    <strong>Updated:</strong>{" "}
                    {formatTime(selectedOrder.updatedAt)}
                  </p>
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
                  {selectedOrder.items.map((item, index) => (
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
                  <span>₨{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="d-flex justify-content-between text-success">
                    <span>Discount:</span>
                    <span>-₨{selectedOrder.discount}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>₨{selectedOrder.total}</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderManagement;
