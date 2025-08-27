import React, { useState, useEffect } from "react";
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
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMe, updateUser as updateUserAPI, updateCoffeePreferences } from "../../api/authApi";
import { showSuccess, showError } from "../../utils";

const Profile = () => {
  const { user, updateUser, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    sweetnessLevel: "Medium",
    coffeeStrength: "Medium",
    milkPreference: "Regular Milk",
    temperature: "Hot",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        sweetnessLevel: user.coffeePreferences?.sweetnessLevel || "Medium",
        coffeeStrength: user.coffeePreferences?.coffeeStrength || "Medium",
        milkPreference: user.coffeePreferences?.milkPreference || "Regular Milk",
        temperature: user.coffeePreferences?.temperature || "Hot",
      });
    }
  }, [user]);

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const avatarSrc = user?.avatar || "/media/user/image.png";
  
  const userOrders = [];
  const userSubscriptions = [];
  const productsData = [];

  const getOrderTotal = (order) => {
    return order.items?.reduce((total, item) => total + (item.price * item.quantity || 0), 0) || 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const refreshUserProfile = async () => {
    try {
      const response = await getMe();
      if (response.success) {
        const userData = response.data.user;
        updateUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          sweetnessLevel: userData.coffeePreferences?.sweetnessLevel || "Medium",
          coffeeStrength: userData.coffeePreferences?.coffeeStrength || "Medium",
          milkPreference: userData.coffeePreferences?.milkPreference || "Regular Milk",
          temperature: userData.coffeePreferences?.temperature || "Hot",
        });
      }
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      let updateResponse;
      
      const baseData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };
      
      if (selectedFile) {
        const formDataForUpload = new FormData();
        formDataForUpload.append('name', formData.name);
        formDataForUpload.append('phone', formData.phone);
        formDataForUpload.append('address', formData.address);
        formDataForUpload.append('avatar', selectedFile);
        
        console.log('Uploading with file:', selectedFile.name);
        updateResponse = await updateUserAPI(formDataForUpload);
      } else {
        console.log('Updating without file');
        updateResponse = await updateUserAPI(baseData);
      }
      
      if (updateResponse.success) {
        const preferencesData = {
          sweetnessLevel: formData.sweetnessLevel,
          coffeeStrength: formData.coffeeStrength,
          milkPreference: formData.milkPreference,
          temperature: formData.temperature,
        };
        
        await updateCoffeePreferences(preferencesData);
        
        await refreshUserProfile();
        
        setIsEditing(false);
        removeSelectedFile();
        showSuccess("Profile updated successfully");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await handleSaveProfile();
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
                    className="profile-avatar mb-3 position-relative"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      overflow: "hidden",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <img 
                      src={previewUrl || avatarSrc}
                      alt={user?.name || "User"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/media/user/image.png";
                      }}
                    />
                    {isEditing && (
                      <>
                        <div 
                          className="position-absolute top-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "24px", height: "24px", cursor: "pointer" }}
                          onClick={() => document.getElementById('avatar-upload').click()}
                        >
                          <i className="bi bi-camera text-white" style={{ fontSize: "12px" }}></i>
                        </div>
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        {selectedFile && (
                          <div 
                            className="position-absolute top-0 start-0 bg-danger rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "20px", height: "20px", cursor: "pointer" }}
                            onClick={removeSelectedFile}
                          >
                            <i className="bi bi-x text-white" style={{ fontSize: "12px" }}></i>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <h5 className="mb-1">{user?.name}</h5>
                  <p className="text-muted small">{user?.email}</p>
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
                            <strong>Name:</strong> {user?.name}
                          </Col>
                          <Col md={6} className="mb-3">
                            <strong>Email:</strong> {user?.email}
                          </Col>
                          <Col md={6} className="mb-3">
                            <strong>Phone:</strong>{" "}
                            {user?.phone || "Not provided"}
                          </Col>
                          <Col md={6} className="mb-3">
                            <strong>Member Since:</strong>{" "}
                            {new Date(
                              user?.createdAt
                            ).toLocaleDateString()}
                          </Col>
                          <Col xs={12}>
                            <strong>Address:</strong>{" "}
                            {user?.address || "Not provided"}
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
                                name="sweetnessLevel"
                                value={formData.sweetnessLevel}
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
                                name="coffeeStrength"
                                value={formData.coffeeStrength}
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
                                name="milkPreference"
                                value={formData.milkPreference}
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
                                name="temperature"
                                value={formData.temperature}
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
