import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Nav,
  Tab,
} from "react-bootstrap";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import ordersData from "../../api/orders.json";
import subscriptionsData from "../../api/subscriptions.json";
import productsData from "../../api/products.json";

const Profile = () => {
  const { currentUser, updateUser, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    preferences: {
      sweetness: currentUser?.preferences?.sweetness || "medium",
      strength: currentUser?.preferences?.strength || "medium",
      milk: currentUser?.preferences?.milk || "regular",
      temperature: currentUser?.preferences?.temperature || "hot",
    },
  });

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const userOrders = ordersData.filter(
    (order) => order.userId === currentUser?.id
  );
  const userSubscriptions = subscriptionsData.filter(
    (sub) => sub.userId === currentUser?.id
  );

  const getOrderTotal = (order) => {
    return order.items.reduce((total, item) => {
      const product = productsData.find((p) => p.id === item.productId);
      return total + (product ? product.price.regular * item.quantity : 0);
    }, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("preferences.")) {
      const prefKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: "success",
      preparing: "warning",
      ready: "info",
      delivered: "primary",
      cancelled: "danger",
      active: "success",
      paused: "warning",
      expired: "secondary",
    };
    return variants[status] || "secondary";
  };

  return (
    <>
      <div className="page-header">
        <Container>
          <Row>
            <Col>
              <h1 className="display-5 fw-bold text-primary mb-2">
                <i className="bi bi-person-circle me-3"></i>
                My Profile
              </h1>
              <p className="lead text-muted">
                Manage your account settings and preferences
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Row>
            <Col lg={3} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body className="text-center">
                  <div
                    className="profile-avatar mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "var(--color-primary)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      color: "white",
                      margin: "0 auto",
                    }}
                  >
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h5 className="mb-1">{currentUser?.name}</h5>
                  <p className="text-muted small">{currentUser?.email}</p>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sign Out
                  </Button>
                </Card.Body>
              </Card>

              <Nav variant="pills" className="flex-column mt-3">
                <Nav.Item>
                  <Nav.Link eventKey="profile">
                    <i className="bi bi-person me-2"></i>
                    Profile Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="orders">
                    <i className="bi bi-bag me-2"></i>
                    Order History
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="subscriptions">
                    <i className="bi bi-arrow-repeat me-2"></i>
                    Subscriptions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="preferences">
                    <i className="bi bi-gear me-2"></i>
                    Preferences
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col lg={9}>
              <Tab.Content>
                <Tab.Pane eventKey="profile">
                  <Card className="shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Personal Information</h5>
                      {!isEditing ? (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <i className="bi bi-pencil me-2"></i>
                          Edit
                        </Button>
                      ) : (
                        <div>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-2"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={handleSave}
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </Card.Header>
                    <Card.Body>
                      {!isEditing ? (
                        <Row>
                          <Col md={6} className="mb-3">
                            <strong>Name:</strong> {currentUser?.name}
                          </Col>
                          <Col md={6} className="mb-3">
                            <strong>Email:</strong> {currentUser?.email}
                          </Col>
                          <Col md={6} className="mb-3">
                            <strong>Phone:</strong>{" "}
                            {currentUser?.phone || "Not provided"}
                          </Col>
                          <Col md={6} className="mb-3">
                            <strong>Member Since:</strong>{" "}
                            {new Date(
                              currentUser?.createdAt
                            ).toLocaleDateString()}
                          </Col>
                          <Col xs={12}>
                            <strong>Address:</strong>{" "}
                            {currentUser?.address || "Not provided"}
                          </Col>
                        </Row>
                      ) : (
                        <Form>
                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  name="address"
                                  value={formData.address}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="orders">
                  <Card className="shadow-sm">
                    <Card.Header>
                      <h5 className="mb-0">Order History</h5>
                    </Card.Header>
                    <Card.Body>
                      {userOrders.length === 0 ? (
                        <div className="text-center py-4">
                          <i className="bi bi-bag-x display-4 text-muted mb-3"></i>
                          <p className="text-muted">No orders yet</p>
                          <Button
                            variant="primary"
                            onClick={() => navigate("/menu")}
                          >
                            Browse Menu
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {userOrders.map((order) => (
                            <div key={order.id} className="p-3 border rounded">
                              <Row className="align-items-center">
                                <Col md={8}>
                                  <h6 className="mb-1">
                                    Order #{order.id.slice(-8)}
                                  </h6>
                                  <p className="text-muted small mb-1">
                                    {new Date(
                                      order.orderDate
                                    ).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(
                                      order.orderDate
                                    ).toLocaleTimeString()}
                                  </p>
                                  <p className="small mb-0">
                                    {order.items.length} item(s) • Total: NPR{" "}
                                    {getOrderTotal(order)}
                                  </p>
                                </Col>
                                <Col md={4} className="text-end">
                                  <span
                                    className={`badge bg-${getStatusBadge(
                                      order.status
                                    )} mb-2`}
                                  >
                                    {order.status}
                                  </span>
                                  <br />
                                  <Button variant="outline-primary" size="sm">
                                    View Details
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="subscriptions">
                  <Card className="shadow-sm">
                    <Card.Header>
                      <h5 className="mb-0">My Subscriptions</h5>
                    </Card.Header>
                    <Card.Body>
                      {userSubscriptions.length === 0 ? (
                        <div className="text-center py-4">
                          <i className="bi bi-arrow-repeat display-4 text-muted mb-3"></i>
                          <p className="text-muted">No active subscriptions</p>
                          <Button
                            variant="primary"
                            onClick={() => navigate("/subscriptions")}
                          >
                            Browse Plans
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {userSubscriptions.map((subscription) => {
                            const product = productsData.find(
                              (p) => p.id === subscription.productId
                            );
                            return (
                              <div
                                key={subscription.id}
                                className="p-3 border rounded"
                              >
                                <Row className="align-items-center">
                                  <Col md={8}>
                                    <h6 className="mb-1">
                                      {product?.name || "Product"}
                                    </h6>
                                    <p className="text-muted small mb-1">
                                      {subscription.frequency} • Next delivery:{" "}
                                      {new Date(
                                        subscription.nextDelivery
                                      ).toLocaleDateString()}
                                    </p>
                                    <p className="small mb-0">
                                      NPR {subscription.price} per delivery
                                    </p>
                                  </Col>
                                  <Col md={4} className="text-end">
                                    <span
                                      className={`badge bg-${getStatusBadge(
                                        subscription.status
                                      )} mb-2`}
                                    >
                                      {subscription.status}
                                    </span>
                                    <br />
                                    <Button variant="outline-primary" size="sm">
                                      Manage
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="preferences">
                  <Card className="shadow-sm">
                    <Card.Header>
                      <h5 className="mb-0">Coffee Preferences</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Sweetness Level</Form.Label>
                              <Form.Select
                                name="preferences.sweetness"
                                value={formData.preferences.sweetness}
                                onChange={handleInputChange}
                              >
                                <option value="none">No Sugar</option>
                                <option value="low">Light</option>
                                <option value="medium">Medium</option>
                                <option value="high">Sweet</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Coffee Strength</Form.Label>
                              <Form.Select
                                name="preferences.strength"
                                value={formData.preferences.strength}
                                onChange={handleInputChange}
                              >
                                <option value="mild">Mild</option>
                                <option value="medium">Medium</option>
                                <option value="strong">Strong</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Milk Preference</Form.Label>
                              <Form.Select
                                name="preferences.milk"
                                value={formData.preferences.milk}
                                onChange={handleInputChange}
                              >
                                <option value="none">No Milk</option>
                                <option value="regular">Regular Milk</option>
                                <option value="oat">Oat Milk</option>
                                <option value="almond">Almond Milk</option>
                                <option value="soy">Soy Milk</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Group>
                              <Form.Label>Temperature</Form.Label>
                              <Form.Select
                                name="preferences.temperature"
                                value={formData.preferences.temperature}
                                onChange={handleInputChange}
                              >
                                <option value="hot">Hot</option>
                                <option value="warm">Warm</option>
                                <option value="iced">Iced</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Button variant="primary" onClick={handleSave}>
                          Save Preferences
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
};

export default Profile;
