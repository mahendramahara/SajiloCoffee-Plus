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
import usersData from "../../api/users.json";
import subscriptionsData from "../../api/subscriptions.json";

const UserManagement = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const subscriptionFilters = ["all", "active", "none"];

  useEffect(() => {
    const usersWithSubscriptions = usersData.map((user) => {
      const subscription = subscriptionsData.find(
        (s) => s.id === user.subscription?.planId
      );
      return {
        ...user,
        subscriptionPlan: subscription,
      };
    });

    setUsers(usersWithSubscriptions);
    setFilteredUsers(usersWithSubscriptions);
  }, []);

  const filterUsers = useCallback(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (subscriptionFilter !== "all") {
      if (subscriptionFilter === "active") {
        filtered = filtered.filter(
          (user) => user.subscription?.status === "active"
        );
      } else if (subscriptionFilter === "none") {
        filtered = filtered.filter(
          (user) => !user.subscription || user.subscription.status === "none"
        );
      }
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, subscriptionFilter, users]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const suspendUser = (userId) => {
    if (!hasPermission("users", "suspend")) {
      showNotification.error("You do not have permission to suspend users");
      return;
    }

    if (window.confirm("Are you sure you want to suspend this user?")) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, suspended: true, updatedAt: new Date().toISOString() }
            : user
        )
      );
      showNotification.success("User suspended successfully");
    }
  };

  const activateUser = (userId) => {
    if (!hasPermission("users", "update")) {
      showNotification.error("You do not have permission to activate users");
      return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, suspended: false, updatedAt: new Date().toISOString() }
          : user
      )
    );
    showNotification.success("User activated successfully");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getUserStats = () => {
    const stats = {
      total: filteredUsers.length,
      active: filteredUsers.filter((u) => !u.suspended).length,
      suspended: filteredUsers.filter((u) => u.suspended).length,
      withSubscription: filteredUsers.filter(
        (u) => u.subscription?.status === "active"
      ).length,
      totalSpent: filteredUsers.reduce(
        (sum, user) => sum + (user.stats?.totalSpend || 0),
        0
      ),
    };
    return stats;
  };

  const stats = getUserStats();

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="dashboard-title">User Management</h1>
          <p className="dashboard-subtitle">
            Manage customer accounts and subscriptions
          </p>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={2} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-primary">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.total}</h3>
                  <p className="stat-label">Total Users</p>
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
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.active}</h3>
                  <p className="stat-label">Active Users</p>
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
                  <i className="fas fa-user-slash"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.suspended}</h3>
                  <p className="stat-label">Suspended</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-warning">
                  <i className="fas fa-crown"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.withSubscription}</h3>
                  <p className="stat-label">With Subscription</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-info">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">
                    ₨{stats.totalSpent.toLocaleString()}
                  </h3>
                  <p className="stat-label">Total Spent</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="data-card mb-4">
        <Card.Header>
          <h5 className="card-title">Filter Users</h5>
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
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Select
                value={subscriptionFilter}
                onChange={(e) => setSubscriptionFilter(e.target.value)}
              >
                {subscriptionFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter === "all"
                      ? "All Users"
                      : filter === "active"
                      ? "With Active Subscription"
                      : "No Subscription"}
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
            <h5 className="card-title">Users ({filteredUsers.length})</h5>
            <Badge bg="primary">
              {currentUsers.length} of {filteredUsers.length}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Subscription</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="user-avatar me-3">
                        <img
                          src={user.avatar || "/images/avatars/default.png"}
                          alt={user.name}
                          className="rounded-circle"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div>
                        <h6 className="mb-1">{user.name}</h6>
                        <small className="text-muted">
                          ID: {user.id.slice(-8)}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.subscription?.status === "active" ? (
                      <div>
                        <Badge bg="success">Active</Badge>
                        <div>
                          <small className="text-muted">
                            {user.subscriptionPlan?.name}
                          </small>
                        </div>
                      </div>
                    ) : (
                      <Badge bg="secondary">None</Badge>
                    )}
                  </td>
                  <td>
                    <div>
                      <strong>{user.stats?.orderCount || 0}</strong>
                      <div>
                        <small className="text-muted">
                          Avg: ₨{user.stats?.averageOrderValue || 0}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong className="text-success">
                      ₨{user.stats?.totalSpend || 0}
                    </strong>
                  </td>
                  <td>
                    {user.suspended ? (
                      <Badge bg="danger">Suspended</Badge>
                    ) : (
                      <Badge bg="success">Active</Badge>
                    )}
                  </td>
                  <td>
                    <small>{formatDate(user.createdAt)}</small>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleShowDetails(user)}
                      >
                        <i className="fas fa-eye"></i>
                      </Button>

                      {hasPermission("users", "suspend") &&
                        (user.suspended ? (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => activateUser(user.id)}
                          >
                            <i className="fas fa-user-check"></i>
                          </Button>
                        ) : (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => suspendUser(user.id)}
                          >
                            <i className="fas fa-user-slash"></i>
                          </Button>
                        ))}
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
          <Modal.Title>User Details - {selectedUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Row className="mb-4">
                <Col md={4} className="text-center">
                  <img
                    src={selectedUser.avatar || "/images/avatars/default.png"}
                    alt={selectedUser.name}
                    className="rounded-circle mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <h5>{selectedUser.name}</h5>
                  <p className="text-muted">{selectedUser.email}</p>
                  <Badge bg={selectedUser.suspended ? "danger" : "success"}>
                    {selectedUser.suspended ? "Suspended" : "Active"}
                  </Badge>
                </Col>
                <Col md={8}>
                  <h6>Account Information</h6>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td>
                          <strong>User ID:</strong>
                        </td>
                        <td>{selectedUser.id}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Role:</strong>
                        </td>
                        <td className="text-capitalize">{selectedUser.role}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Joined:</strong>
                        </td>
                        <td>{formatDate(selectedUser.createdAt)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Last Updated:</strong>
                        </td>
                        <td>{formatDate(selectedUser.updatedAt)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {selectedUser.subscription?.status === "active" && (
                <div className="mb-4">
                  <h6>Subscription Details</h6>
                  <Card className="bg-light">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-primary">
                            {selectedUser.subscriptionPlan?.name}
                          </h6>
                          <p className="mb-1">
                            <strong>Price:</strong> ₨
                            {selectedUser.subscriptionPlan?.price} /{" "}
                            {selectedUser.subscriptionPlan?.cycle}
                          </p>
                          <p className="mb-0">
                            <strong>Renews:</strong>{" "}
                            {selectedUser.subscription.renewAt}
                          </p>
                        </div>
                        <Badge bg="success">Active</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}

              <div className="mb-4">
                <h6>Preferences</h6>
                <Row>
                  <Col md={6}>
                    <Table borderless size="sm">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Sweetness:</strong>
                          </td>
                          <td className="text-capitalize">
                            {selectedUser.preferences?.sweetness}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Strength:</strong>
                          </td>
                          <td className="text-capitalize">
                            {selectedUser.preferences?.strength}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Milk:</strong>
                          </td>
                          <td className="text-capitalize">
                            {selectedUser.preferences?.milk}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <div>
                      <strong>Favorite Flavors:</strong>
                      <div className="mt-1">
                        {selectedUser.preferences?.flavors?.map((flavor, i) => (
                          <Badge key={i} bg="secondary" className="me-1">
                            {flavor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div>
                <h6>Order Statistics</h6>
                <Row>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-primary">
                        {selectedUser.stats?.orderCount || 0}
                      </h4>
                      <small className="text-muted">Total Orders</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-success">
                        ₨{selectedUser.stats?.totalSpend || 0}
                      </h4>
                      <small className="text-muted">Total Spent</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-info">
                        ₨{selectedUser.stats?.averageOrderValue || 0}
                      </h4>
                      <small className="text-muted">Avg Order Value</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="text-warning">
                        {selectedUser.favorites?.length || 0}
                      </h4>
                      <small className="text-muted">Favorites</small>
                    </div>
                  </Col>
                </Row>
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

export default UserManagement;
