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
  ProgressBar,
  ListGroup,
} from "react-bootstrap";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { showNotification } from "../../utils/notify";
import subscriptionsData from "../../api/subscriptions.json";
import usersData from "../../api/users.json";

const SubscriptionManagement = () => {
  const { admin } = useAdminAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [activeTab, setActiveTab] = useState("plans");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [error, setError] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: "",
    cycle: "monthly",
    price: "",
    currency: "NPR",
    features: [""],
    perks: {
      freePowderGrams: 0,
      indoorVisitsPerMonth: 0,
      privateSpaceHours: 0,
    },
    popular: false,
  });

  useEffect(() => {
    try {
      setSubscriptions(subscriptionsData || []);

      const usersWithActiveSubscriptions = (usersData || [])
        .filter(
          (user) => user.subscription && user.subscription.status === "active"
        )
        .map((user) => {
          const plan = (subscriptionsData || []).find(
            (s) => s.id === user.subscription.planId
          );
          return {
            ...user,
            subscriptionPlan: plan,
          };
        });

      setUserSubscriptions(usersWithActiveSubscriptions);
      setFilteredSubscriptions(usersWithActiveSubscriptions);
      setError(null);
    } catch (err) {
      console.error("Error loading subscription data:", err);
      setError("Failed to load subscription data");
      setUserSubscriptions([]);
      setFilteredSubscriptions([]);
    }
  }, []);

  const filterSubscriptions = useCallback(() => {
    let filtered = activeTab === "plans" ? subscriptions : userSubscriptions;

    if (searchTerm && activeTab === "subscribers") {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all" && activeTab === "subscribers") {
      filtered = filtered.filter(
        (item) => item.subscription?.status === statusFilter
      );
    }

    setFilteredSubscriptions(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, subscriptions, userSubscriptions, activeTab]);

  useEffect(() => {
    filterSubscriptions();
  }, [filterSubscriptions]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const handleShowDetails = (item) => {
    setSelectedSubscription(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubscription(null);
  };

  const handleShowPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanFormData({
        name: plan.name,
        cycle: plan.cycle,
        price: plan.price.toString(),
        currency: plan.currency,
        features: plan.features || [""],
        perks: plan.perks || {
          freePowderGrams: 0,
          indoorVisitsPerMonth: 0,
          privateSpaceHours: 0,
        },
        popular: plan.popular || false,
      });
    } else {
      setEditingPlan(null);
      setPlanFormData({
        name: "",
        cycle: "monthly",
        price: "",
        currency: "NPR",
        features: [""],
        perks: {
          freePowderGrams: 0,
          indoorVisitsPerMonth: 0,
          privateSpaceHours: 0,
        },
        popular: false,
      });
    }
    setShowPlanModal(true);
  };

  const handleClosePlanModal = () => {
    setShowPlanModal(false);
    setEditingPlan(null);
  };

  const handlePlanFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("perks.")) {
      const perkName = name.split(".")[1];
      setPlanFormData((prev) => ({
        ...prev,
        perks: {
          ...prev.perks,
          [perkName]: type === "number" ? parseInt(value) || 0 : value,
        },
      }));
    } else {
      setPlanFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    setPlanFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const addFeature = () => {
    setPlanFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    setPlanFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handlePlanSubmit = (e) => {
    e.preventDefault();

    const planData = {
      ...planFormData,
      price: parseFloat(planFormData.price),
      features: planFormData.features.filter((f) => f.trim() !== ""),
      id: editingPlan ? editingPlan.id : `sub_${Date.now()}`,
      createdAt: editingPlan ? editingPlan.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingPlan) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === editingPlan.id ? planData : s))
      );
      showNotification.success("Subscription plan updated successfully");
    } else {
      setSubscriptions((prev) => [...prev, planData]);
      showNotification.success("Subscription plan created successfully");
    }

    handleClosePlanModal();
  };

  const getStats = () => {
    const totalPlans = subscriptions.length;
    const activeSubscribers = userSubscriptions.length;
    const totalRevenue = userSubscriptions.reduce((sum, user) => {
      return sum + (user.subscriptionPlan?.price || 0);
    }, 0);
    const popularPlan = subscriptions.find((plan) => plan.popular);

    return { totalPlans, activeSubscribers, totalRevenue, popularPlan };
  };

  const stats = getStats();

  const formatPrice = (price, cycle) => {
    const cycleText = {
      monthly: "/month",
      "6-month": "/6 months",
      annual: "/year",
    };
    return `₨${price.toLocaleString()}${cycleText[cycle] || ""}`;
  };

  const getCycleBadge = (cycle) => {
    const variants = {
      monthly: "primary",
      "6-month": "warning",
      annual: "success",
    };
    return variants[cycle] || "secondary";
  };

  return (
    <Container fluid>
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="dashboard-title">Subscription Management</h1>
          <p className="dashboard-subtitle">
            Manage subscription plans and subscribers
          </p>
        </div>
        {admin?.permissions?.subscriptions?.create && (
          <Button
            variant="primary"
            className="btn-admin-primary"
            onClick={() => handleShowPlanModal()}
          >
            <i className="fas fa-plus me-2"></i>
            Add Plan
          </Button>
        )}
      </div>

      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-primary">
                  <i className="fas fa-crown"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.totalPlans}</h3>
                  <p className="stat-label">Total Plans</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-success">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.activeSubscribers}</h3>
                  <p className="stat-label">Active Subscribers</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-info">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">
                    ₨{stats.totalRevenue.toLocaleString()}
                  </h3>
                  <p className="stat-label">Monthly Revenue</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-warning">
                  <i className="fas fa-star"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">
                    {stats.popularPlan?.name?.split(" ")[0] || "None"}
                  </h3>
                  <p className="stat-label">Popular Plan</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="data-card mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div className="tab-buttons">
              <Button
                variant={activeTab === "plans" ? "primary" : "outline-primary"}
                className="me-2"
                onClick={() => setActiveTab("plans")}
              >
                <i className="fas fa-list me-2"></i>
                Subscription Plans
              </Button>
              <Button
                variant={
                  activeTab === "subscribers" ? "primary" : "outline-primary"
                }
                onClick={() => setActiveTab("subscribers")}
              >
                <i className="fas fa-users me-2"></i>
                Subscribers
              </Button>
            </div>
          </div>
        </Card.Header>

        {activeTab === "subscribers" && (
          <Card.Body className="border-bottom">
            <Row>
              <Col md={6} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search subscribers..."
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
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>

      <Card className="data-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title">
              {activeTab === "plans"
                ? "Subscription Plans"
                : "Active Subscribers"}
              ({filteredSubscriptions.length})
            </h5>
            <Badge bg="primary">
              {currentItems.length} of {filteredSubscriptions.length}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {activeTab === "plans" ? (
            <div className="subscription-grid p-4">
              <Row>
                {currentItems.map((plan) => (
                  <Col lg={4} md={6} key={plan.id} className="mb-4">
                    <Card
                      className={`subscription-plan-card h-100 ${
                        plan.popular ? "popular-plan" : ""
                      }`}
                    >
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
                          <h2 className="price">
                            ₨{plan.price.toLocaleString()}
                          </h2>
                          <Badge
                            bg={getCycleBadge(plan.cycle)}
                            className="cycle-badge"
                          >
                            {plan.cycle}
                          </Badge>
                        </div>

                        {plan.savingsPercentVsMonthly && (
                          <div className="savings-badge mb-3">
                            <Badge bg="success">
                              Save {plan.savingsPercentVsMonthly}%
                            </Badge>
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
                                <strong>
                                  {
                                    userSubscriptions.filter(
                                      (u) => u.subscription.planId === plan.id
                                    ).length
                                  }
                                </strong>
                                <br />
                                <small className="text-muted">
                                  Subscribers
                                </small>
                              </div>
                            </Col>
                            <Col>
                              <div className="stat-item">
                                <strong>
                                  {plan.perks?.indoorVisitsPerMonth || 0}
                                </strong>
                                <br />
                                <small className="text-muted">
                                  Visits/Month
                                </small>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <div className="plan-actions">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleShowDetails(plan)}
                            className="me-2"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          {admin?.permissions?.subscriptions?.update && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleShowPlanModal(plan)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          )}
                          {admin?.permissions?.subscriptions?.delete && (
                            <Button variant="outline-danger" size="sm">
                              <i className="fas fa-trash"></i>
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="modern-table">
                <thead>
                  <tr>
                    <th>Subscriber</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Started</th>
                    <th>Renewal</th>
                    <th>Revenue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user) => (
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
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{user.subscriptionPlan?.name}</strong>
                          <br />
                          <Badge
                            bg={getCycleBadge(user.subscriptionPlan?.cycle)}
                          >
                            {user.subscriptionPlan?.cycle}
                          </Badge>
                        </div>
                      </td>
                      <td>
                        <Badge bg="success">Active</Badge>
                      </td>
                      <td>
                        <small>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div>
                          <strong>{user.subscription.renewAt}</strong>
                          <br />
                          <small className="text-muted">
                            {Math.ceil(
                              (new Date(user.subscription.renewAt) -
                                new Date()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong className="text-success">
                          ₨{user.subscriptionPlan?.price}
                        </strong>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleShowDetails(user)}
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          {admin?.permissions?.subscriptions?.update && (
                            <Button variant="outline-warning" size="sm">
                              <i className="fas fa-pause"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center p-4">
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
            {activeTab === "plans" ? "Plan Details" : "Subscriber Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubscription && activeTab === "plans" && (
            <div>
              <div className="text-center mb-4">
                <div className="plan-icon-large mb-3">
                  <i className="fas fa-crown"></i>
                </div>
                <h3>{selectedSubscription.name}</h3>
                <h4 className="text-primary">
                  {formatPrice(
                    selectedSubscription.price,
                    selectedSubscription.cycle
                  )}
                </h4>
              </div>

              <h6>Features</h6>
              <ul className="list-group list-group-flush mb-4">
                {selectedSubscription.features.map((feature, index) => (
                  <li key={index} className="list-group-item">
                    <i className="fas fa-check text-success me-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>

              <h6>Perks Details</h6>
              <Row>
                <Col md={4}>
                  <div className="text-center p-3 bg-light rounded">
                    <h4 className="text-primary">
                      {selectedSubscription.perks?.freePowderGrams || 0}g
                    </h4>
                    <small>Free Powder</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3 bg-light rounded">
                    <h4 className="text-success">
                      {selectedSubscription.perks?.indoorVisitsPerMonth || 0}
                    </h4>
                    <small>Visits/Month</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3 bg-light rounded">
                    <h4 className="text-warning">
                      {selectedSubscription.perks?.privateSpaceHours || 0}h
                    </h4>
                    <small>Private Space</small>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Plan Add/Edit Modal */}
      <Modal show={showPlanModal} onHide={handleClosePlanModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-crown me-2"></i>
            {editingPlan ? "Edit Subscription Plan" : "Add Subscription Plan"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePlanSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={planFormData.name}
                    onChange={handlePlanFormChange}
                    placeholder="e.g. Himalayan Enthusiast"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Cycle</Form.Label>
                  <Form.Select
                    name="cycle"
                    value={planFormData.cycle}
                    onChange={handlePlanFormChange}
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="3-month">3 Month</option>
                    <option value="6-month">6 Month</option>
                    <option value="yearly">Yearly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (NPR)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={planFormData.price}
                    onChange={handlePlanFormChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Free Powder (grams)</Form.Label>
                  <Form.Control
                    type="number"
                    name="perks.freePowderGrams"
                    value={planFormData.perks.freePowderGrams}
                    onChange={handlePlanFormChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Indoor Visits/Month</Form.Label>
                  <Form.Control
                    type="number"
                    name="perks.indoorVisitsPerMonth"
                    value={planFormData.perks.indoorVisitsPerMonth}
                    onChange={handlePlanFormChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Private Space Hours</Form.Label>
                  <Form.Control
                    type="number"
                    name="perks.privateSpaceHours"
                    value={planFormData.perks.privateSpaceHours}
                    onChange={handlePlanFormChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Features</Form.Label>
              {planFormData.features.map((feature, index) => (
                <div key={index} className="mb-2 d-flex">
                  <Form.Control
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter feature description"
                  />
                  {planFormData.features.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => removeFeature(index)}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={addFeature}
                className="mt-2"
              >
                <i className="fas fa-plus me-1"></i>
                Add Feature
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="popular"
                label="Mark as popular plan"
                checked={planFormData.popular}
                onChange={handlePlanFormChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClosePlanModal}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <i className="fas fa-save me-1"></i>
                {editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SubscriptionManagement;
