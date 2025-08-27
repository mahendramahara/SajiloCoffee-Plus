import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Badge, Pagination, InputGroup, Form } from "react-bootstrap";
import { useAuth } from "../../context/useAuth";
import { showNotification } from "../../utils/notify";
import StatsCard from "../../components/admin/Dashboard/StatsCard";
import OrdersTable from "../../components/admin/Orders/OrdersTable";
import OrderDetailsModal from "../../components/admin/orders/OrderDetailsModal";
import { adminApi } from "../../api/adminApi";

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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const orderStatuses = ["all", "pending", "preparing", "served", "cancelled"];

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminApi.getAllOrders();
      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
    } catch (error) {
      showNotification.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await adminApi.getOrderStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch order stats:", error);
    }
  };

  const filterOrders = useCallback(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!hasPermission("orders", "update")) {
      showNotification.error("You do not have permission to update orders");
      return;
    }

    try {
      await adminApi.updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      );
      showNotification.success(`Order status updated to ${newStatus}`);
      fetchOrderStats();
    } catch (error) {
      showNotification.error("Failed to update order status", error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!hasPermission("orders", "delete")) {
      showNotification.error("You do not have permission to delete orders");
      return;
    }

    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await adminApi.deleteOrder(orderId);
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        showNotification.success("Order deleted successfully");
        fetchOrderStats();
      } catch (error) {
        showNotification.error("Failed to delete order", error);
      }
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getTotalRevenue = () => {
    return filteredOrders.reduce((sum, order) => sum + order.total, 0);
  };

  if (loading) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

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
          <StatsCard
            title="Total Orders"
            value={filteredOrders.length}
            icon="fa-shopping-cart"
            bgColor="bg-primary"
          />
        </Col>
        <Col md={2} className="mb-3">
          <StatsCard
            title="Pending"
            value={stats.pendingOrders || 0}
            icon="fa-clock"
            bgColor="bg-secondary"
          />
        </Col>
        <Col md={2} className="mb-3">
          <StatsCard
            title="Preparing"
            value={stats.preparingOrders || 0}
            icon="fa-fire"
            bgColor="bg-warning"
          />
        </Col>
        <Col md={2} className="mb-3">
          <StatsCard
            title="Served"
            value={filteredOrders.filter(o => o.status === "served").length}
            icon="fa-check"
            bgColor="bg-success"
          />
        </Col>
        <Col md={2} className="mb-3">
          <StatsCard
            title="Cancelled"
            value={filteredOrders.filter(o => o.status === "cancelled").length}
            icon="fa-times"
            bgColor="bg-danger"
          />
        </Col>
        <Col md={2} className="mb-3">
          <StatsCard
            title="Revenue"
            value={`₨${getTotalRevenue().toLocaleString()}`}
            icon="fa-rupee-sign"
            bgColor="bg-info"
          />
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
          <OrdersTable
            orders={currentOrders}
            onShowDetails={handleShowDetails}
            onUpdateStatus={updateOrderStatus}
            onDeleteOrder={deleteOrder}
            hasPermission={hasPermission}
          />

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

      <OrderDetailsModal
        show={showModal}
        order={selectedOrder}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

export default OrderManagement;