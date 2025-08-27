import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { showNotification } from "../../utils/notify";
import tablesData from "../../api/tables.json";
import ordersData from "../../api/orders.json";

const TableManagement = () => {
  const { admin } = useAdminAuth();
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTableData, setNewTableData] = useState({
    tableNumber: "",
    capacity: 2,
    status: "available",
  });

  useEffect(() => {
    const tablesWithOrders = tablesData.map((table) => {
      const currentOrder = table.currentOrderId
        ? ordersData.find((order) => order.id === table.currentOrderId)
        : null;

      return {
        ...table,
        currentOrder,
      };
    });

    setTables(tablesWithOrders);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      available: "success",
      occupied: "danger",
      reserved: "warning",
      maintenance: "secondary",
    };
    return colors[status] || "primary";
  };

  const getStatusIcon = (status) => {
    const icons = {
      available: "fas fa-check-circle",
      occupied: "fas fa-user-friends",
      reserved: "fas fa-clock",
      maintenance: "fas fa-tools",
    };
    return icons[status] || "fas fa-question-circle";
  };

  const handleStatusChange = (tableNumber, newStatus) => {
    if (!(admin?.permissions?.tables?.update ?? false)) {
      showNotification.error(
        "You do not have permission to update table status"
      );
      return;
    }

    setTables((prev) =>
      prev.map((table) =>
        table.tableNumber === tableNumber
          ? {
              ...table,
              status: newStatus,
              currentOrderId:
                newStatus === "available" ? null : table.currentOrderId,
            }
          : table
      )
    );

    showNotification.success(
      `Table ${tableNumber} status updated to ${newStatus}`
    );
  };

  const handleAddTable = () => {
    if (!(admin?.permissions?.tables?.create ?? false)) {
      showNotification.error("You do not have permission to add tables");
      return;
    }

    if (
      !newTableData.tableNumber ||
      tables.some((t) => t.tableNumber === parseInt(newTableData.tableNumber))
    ) {
      showNotification.error("Please enter a valid unique table number");
      return;
    }

    const newTable = {
      tableNumber: parseInt(newTableData.tableNumber),
      capacity: parseInt(newTableData.capacity),
      status: newTableData.status,
      currentOrderId: null,
      currentOrder: null,
    };

    setTables((prev) =>
      [...prev, newTable].sort((a, b) => a.tableNumber - b.tableNumber)
    );
    setNewTableData({ tableNumber: "", capacity: 2, status: "available" });
    setShowModal(false);
    showNotification.success("Table added successfully");
  };

  const getTableStats = () => {
    const available = tables.filter((t) => t.status === "available").length;
    const occupied = tables.filter((t) => t.status === "occupied").length;
    const reserved = tables.filter((t) => t.status === "reserved").length;
    const maintenance = tables.filter((t) => t.status === "maintenance").length;
    const totalCapacity = tables.reduce(
      (sum, table) => sum + table.capacity,
      0
    );
    const occupancyRate =
      tables.length > 0 ? ((occupied / tables.length) * 100).toFixed(1) : 0;

    return {
      available,
      occupied,
      reserved,
      maintenance,
      totalCapacity,
      occupancyRate,
    };
  };

  const stats = getTableStats();

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="dashboard-title">Table Management</h1>
          <p className="dashboard-subtitle">
            Manage restaurant seating and table assignments
          </p>
        </div>
        {(admin?.permissions?.tables?.create ?? false) && (
          <Button
            variant="primary"
            className="btn-admin-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Add Table
          </Button>
        )}
      </div>

      <Row className="mb-4">
        <Col xl={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card table-stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-success">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.available}</h3>
                  <p className="stat-label">Available</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card table-stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-danger">
                  <i className="fas fa-user-friends"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.occupied}</h3>
                  <p className="stat-label">Occupied</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card table-stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-warning">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.reserved}</h3>
                  <p className="stat-label">Reserved</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card table-stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-secondary">
                  <i className="fas fa-tools"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.maintenance}</h3>
                  <p className="stat-label">Maintenance</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card table-stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-info">
                  <i className="fas fa-chair"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.totalCapacity}</h3>
                  <p className="stat-label">Total Seats</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={2} md={4} sm={6} className="mb-3">
          <Card className="stat-card table-stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-primary">
                  <i className="fas fa-percentage"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.occupancyRate}%</h3>
                  <p className="stat-label">Occupancy</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="data-card table-management-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title">Restaurant Floor Plan</h5>
            <div className="table-legend">
              <Badge bg="success" className="me-2">
                Available
              </Badge>
              <Badge bg="danger" className="me-2">
                Occupied
              </Badge>
              <Badge bg="warning" className="me-2">
                Reserved
              </Badge>
              <Badge bg="secondary">Maintenance</Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-grid">
            <Row>
              {tables.map((table) => (
                <Col
                  xl={2}
                  lg={3}
                  md={4}
                  sm={6}
                  key={table.tableNumber}
                  className="mb-4"
                >
                  <Card className={`table-card ${table.status}`}>
                    <Card.Body className="text-center">
                      <div className="table-visual">
                        <div className={`table-icon ${table.status}`}>
                          <i className={getStatusIcon(table.status)}></i>
                        </div>
                        <h5 className="table-number">
                          Table {table.tableNumber}
                        </h5>
                        <div className="table-info">
                          <div className="capacity-info">
                            <i className="fas fa-users me-1"></i>
                            <span>{table.capacity} seats</span>
                          </div>
                          <Badge
                            bg={getStatusColor(table.status)}
                            className="status-badge"
                          >
                            {table.status}
                          </Badge>
                        </div>
                      </div>

                      {table.currentOrder && (
                        <div className="current-order mt-3">
                          <Card className="order-card">
                            <Card.Body className="p-2">
                              <div className="order-details">
                                <small className="text-muted">
                                  Current Order
                                </small>
                                <div className="order-id">
                                  #{table.currentOrder.id.slice(-8)}
                                </div>
                                <div className="order-total">
                                  ₨{table.currentOrder.total}
                                </div>
                                <Badge bg="warning" size="sm">
                                  {table.currentOrder.status}
                                </Badge>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      )}

                      <div className="table-actions mt-3">
                        <div className="btn-group-vertical w-100">
                          {table.status === "available" && (
                            <>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(
                                    table.tableNumber,
                                    "occupied"
                                  )
                                }
                                disabled={
                                  !(
                                    admin?.permissions?.tables?.update ?? false
                                  )
                                }
                              >
                                Mark Occupied
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(
                                    table.tableNumber,
                                    "reserved"
                                  )
                                }
                                disabled={
                                  !(
                                    admin?.permissions?.tables?.update ?? false
                                  )
                                }
                              >
                                Reserve
                              </Button>
                            </>
                          )}

                          {table.status === "occupied" && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  table.tableNumber,
                                  "available"
                                )
                              }
                              disabled={
                                !(
                                  admin?.permissions?.tables?.update ?? false
                                )
                              }
                            >
                              Clear Table
                            </Button>
                          )}

                          {table.status === "reserved" && (
                            <>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(
                                    table.tableNumber,
                                    "occupied"
                                  )
                                }
                                disabled={
                                  !(
                                    admin?.permissions?.tables?.update ?? false
                                  )
                                }
                              >
                                Check In
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(
                                    table.tableNumber,
                                    "available"
                                  )
                                }
                                disabled={
                                  !(
                                    admin?.permissions?.tables?.update ?? false
                                  )
                                }
                              >
                                Cancel Reservation
                              </Button>
                            </>
                          )}

                          {table.status !== "maintenance" && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  table.tableNumber,
                                  "maintenance"
                                )
                              }
                              disabled={
                                !(
                                  admin?.permissions?.tables?.update ?? false
                                )
                              }
                            >
                              Maintenance
                            </Button>
                          )}

                          {table.status === "maintenance" && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  table.tableNumber,
                                  "available"
                                )
                              }
                              disabled={
                                !(
                                  admin?.permissions?.tables?.update ?? false
                                )
                              }
                            >
                              Back to Service
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Table</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTable();
          }}
        >
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Table Number</Form.Label>
              <Form.Control
                type="number"
                value={newTableData.tableNumber}
                onChange={(e) =>
                  setNewTableData((prev) => ({
                    ...prev,
                    tableNumber: e.target.value,
                  }))
                }
                placeholder="Enter table number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Seating Capacity</Form.Label>
              <Form.Select
                value={newTableData.capacity}
                onChange={(e) =>
                  setNewTableData((prev) => ({
                    ...prev,
                    capacity: parseInt(e.target.value),
                  }))
                }
              >
                <option value={2}>2 Seats</option>
                <option value={4}>4 Seats</option>
                <option value={6}>6 Seats</option>
                <option value={8}>8 Seats</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Initial Status</Form.Label>
              <Form.Select
                value={newTableData.status}
                onChange={(e) =>
                  setNewTableData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="btn-admin-primary"
            >
              Add Table
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default TableManagement;
