import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Nav,
  Tab,
  Badge,
} from "react-bootstrap";
import { useAuth } from "../../context/useAuth";
import { showNotification } from "../../utils/notify";

const Settings = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      restaurantName: "SajiloCoffee+",
      address: "Kathmandu, Nepal",
      phone: "+977-1-4567890",
      email: "info@sajilocoffee.com",
      timezone: "Asia/Kathmandu",
      currency: "NPR",
      language: "en",
    },
    business: {
      operatingHours: {
        monday: { open: "07:00", close: "22:00", closed: false },
        tuesday: { open: "07:00", close: "22:00", closed: false },
        wednesday: { open: "07:00", close: "22:00", closed: false },
        thursday: { open: "07:00", close: "22:00", closed: false },
        friday: { open: "07:00", close: "22:00", closed: false },
        saturday: { open: "08:00", close: "23:00", closed: false },
        sunday: { open: "08:00", close: "21:00", closed: false },
      },
      serviceCharge: 10,
      vat: 13,
      deliveryCharge: 50,
      minimumOrderAmount: 200,
      maxDeliveryRadius: 10,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderNotifications: true,
      lowStockAlerts: true,
      customerFeedback: true,
      promotionalEmails: false,
      systemMaintenance: true,
    },
    security: {
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowPasswordReset: true,
      maxLoginAttempts: 5,
      accountLockoutDuration: 15,
    },
    appearance: {
      theme: "light",
      primaryColor: "#8B4513",
      secondaryColor: "#D2691E",
      sidebarCollapsed: false,
      showAnimations: true,
      compactMode: false,
    },
  });

  const handleSettingChange = (category, key, value) => {
    if (!hasPermission("settings", "general")) {
      showNotification.error("You do not have permission to change settings");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    if (!hasPermission("settings", "business")) {
      showNotification.error(
        "You do not have permission to change business settings"
      );
      return;
    }

    setSettings((prev) => ({
      ...prev,
      business: {
        ...prev.business,
        operatingHours: {
          ...prev.business.operatingHours,
          [day]: {
            ...prev.business.operatingHours[day],
            [field]: value,
          },
        },
      },
    }));
  };

  const handleSaveSettings = (category) => {
    if (!hasPermission("settings", category)) {
      showNotification.error(
        `You do not have permission to save ${category} settings`
      );
      return;
    }

    // Simulate API call
    setTimeout(() => {
      showNotification.success(
        `${
          category.charAt(0).toUpperCase() + category.slice(1)
        } settings saved successfully`
      );
    }, 500);
  };

  const resetToDefaults = (category) => {
    if (!hasPermission("settings", category)) {
      showNotification.error(
        `You do not have permission to reset ${category} settings`
      );
      return;
    }

    showNotification.warning(
      `${
        category.charAt(0).toUpperCase() + category.slice(1)
      } settings reset to defaults`
    );
  };

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="dashboard-title">Settings</h1>
          <p className="dashboard-subtitle">
            Configure system preferences and business settings
          </p>
        </div>
        <Badge bg="info" className="settings-badge">
          <i className="fas fa-user-shield me-2"></i>
          {user?.role || "Admin"}
        </Badge>
      </div>

      <Card className="settings-card">
        <Card.Body className="p-0">
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Row className="g-0">
              <Col md={3} className="settings-sidebar">
                <Nav variant="pills" className="flex-column settings-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="general" className="settings-nav-link">
                      <i className="fas fa-cog me-2"></i>
                      General Settings
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="business" className="settings-nav-link">
                      <i className="fas fa-business-time me-2"></i>
                      Business Settings
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="notifications"
                      className="settings-nav-link"
                    >
                      <i className="fas fa-bell me-2"></i>
                      Notifications
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="security" className="settings-nav-link">
                      <i className="fas fa-shield-alt me-2"></i>
                      Security
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="appearance"
                      className="settings-nav-link"
                    >
                      <i className="fas fa-palette me-2"></i>
                      Appearance
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>

              <Col md={9} className="settings-content">
                <Tab.Content>
                  {/* General Settings */}
                  <Tab.Pane eventKey="general">
                    <div className="settings-pane">
                      <div className="settings-header">
                        <h4>General Settings</h4>
                        <p>
                          Basic restaurant information and system preferences
                        </p>
                      </div>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Restaurant Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={settings.general.restaurantName}
                              onChange={(e) =>
                                handleSettingChange(
                                  "general",
                                  "restaurantName",
                                  e.target.value
                                )
                              }
                              disabled={!hasPermission("settings", "general")}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="text"
                              value={settings.general.phone}
                              onChange={(e) =>
                                handleSettingChange(
                                  "general",
                                  "phone",
                                  e.target.value
                                )
                              }
                              disabled={!hasPermission("settings", "general")}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              value={settings.general.email}
                              onChange={(e) =>
                                handleSettingChange(
                                  "general",
                                  "email",
                                  e.target.value
                                )
                              }
                              disabled={!hasPermission("settings", "general")}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Timezone</Form.Label>
                            <Form.Select
                              value={settings.general.timezone}
                              onChange={(e) =>
                                handleSettingChange(
                                  "general",
                                  "timezone",
                                  e.target.value
                                )
                              }
                              disabled={!hasPermission("settings", "general")}
                            >
                              <option value="Asia/Kathmandu">
                                Asia/Kathmandu
                              </option>
                              <option value="Asia/Kolkata">Asia/Kolkata</option>
                              <option value="UTC">UTC</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={settings.general.address}
                              onChange={(e) =>
                                handleSettingChange(
                                  "general",
                                  "address",
                                  e.target.value
                                )
                              }
                              disabled={!hasPermission("settings", "general")}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Currency</Form.Label>
                            <Form.Select
                              value={settings.general.currency}
                              onChange={(e) =>
                                handleSettingChange(
                                  "general",
                                  "currency",
                                  e.target.value
                                )
                              }
                              disabled={!hasPermission("settings", "general")}
                            >
                              <option value="NPR">NPR (Nepalese Rupee)</option>
                              <option value="USD">USD (US Dollar)</option>
                              <option value="INR">INR (Indian Rupee)</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Language</Form.Label>
                            <Form.Select
                              value={settings.general.language}
                              onChange={(e) =>
                                handleSettingChange(
                                  "general",
                                  "language",
                                  e.target.value
                                )
                              }
                              disabled={!hasPermission("settings", "general")}
                            >
                              <option value="en">English</option>
                              <option value="ne">Nepali</option>
                              <option value="hi">Hindi</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="settings-actions">
                        <Button
                          variant="primary"
                          className="btn-admin-primary me-2"
                          onClick={() => handleSaveSettings("general")}
                          disabled={!hasPermission("settings", "general")}
                        >
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => resetToDefaults("general")}
                          disabled={!hasPermission("settings", "general")}
                        >
                          <i className="fas fa-undo me-2"></i>
                          Reset to Defaults
                        </Button>
                      </div>
                    </div>
                  </Tab.Pane>

                  {/* Business Settings */}
                  <Tab.Pane eventKey="business">
                    <div className="settings-pane">
                      <div className="settings-header">
                        <h4>Business Settings</h4>
                        <p>Operating hours, charges, and business rules</p>
                      </div>

                      <Card className="mb-4">
                        <Card.Header>
                          <h6 className="mb-0">Operating Hours</h6>
                        </Card.Header>
                        <Card.Body>
                          {Object.entries(settings.business.operatingHours).map(
                            ([day, hours]) => (
                              <Row
                                key={day}
                                className="mb-3 align-items-center"
                              >
                                <Col md={2}>
                                  <Form.Label className="mb-0 fw-bold">
                                    {dayNames[day]}
                                  </Form.Label>
                                </Col>
                                <Col md={2}>
                                  <Form.Check
                                    type="checkbox"
                                    label="Closed"
                                    checked={hours.closed}
                                    onChange={(e) =>
                                      handleOperatingHoursChange(
                                        day,
                                        "closed",
                                        e.target.checked
                                      )
                                    }
                                    disabled={
                                      !hasPermission("settings", "business")
                                    }
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Control
                                    type="time"
                                    value={hours.open}
                                    onChange={(e) =>
                                      handleOperatingHoursChange(
                                        day,
                                        "open",
                                        e.target.value
                                      )
                                    }
                                    disabled={
                                      hours.closed ||
                                      !hasPermission("settings", "business")
                                    }
                                  />
                                </Col>
                                <Col md={1} className="text-center">
                                  <span>to</span>
                                </Col>
                                <Col md={3}>
                                  <Form.Control
                                    type="time"
                                    value={hours.close}
                                    onChange={(e) =>
                                      handleOperatingHoursChange(
                                        day,
                                        "close",
                                        e.target.value
                                      )
                                    }
                                    disabled={
                                      hours.closed ||
                                      !hasPermission("settings", "business")
                                    }
                                  />
                                </Col>
                              </Row>
                            )
                          )}
                        </Card.Body>
                      </Card>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Service Charge (%)</Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={settings.business.serviceCharge}
                              onChange={(e) =>
                                handleSettingChange(
                                  "business",
                                  "serviceCharge",
                                  parseFloat(e.target.value)
                                )
                              }
                              disabled={!hasPermission("settings", "business")}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>VAT (%)</Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={settings.business.vat}
                              onChange={(e) =>
                                handleSettingChange(
                                  "business",
                                  "vat",
                                  parseFloat(e.target.value)
                                )
                              }
                              disabled={!hasPermission("settings", "business")}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Delivery Charge (₨)</Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              value={settings.business.deliveryCharge}
                              onChange={(e) =>
                                handleSettingChange(
                                  "business",
                                  "deliveryCharge",
                                  parseInt(e.target.value)
                                )
                              }
                              disabled={!hasPermission("settings", "business")}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Minimum Order Amount (₨)</Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              value={settings.business.minimumOrderAmount}
                              onChange={(e) =>
                                handleSettingChange(
                                  "business",
                                  "minimumOrderAmount",
                                  parseInt(e.target.value)
                                )
                              }
                              disabled={!hasPermission("settings", "business")}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="settings-actions">
                        <Button
                          variant="primary"
                          className="btn-admin-primary me-2"
                          onClick={() => handleSaveSettings("business")}
                          disabled={!hasPermission("settings", "business")}
                        >
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => resetToDefaults("business")}
                          disabled={!hasPermission("settings", "business")}
                        >
                          <i className="fas fa-undo me-2"></i>
                          Reset to Defaults
                        </Button>
                      </div>
                    </div>
                  </Tab.Pane>

                  {/* Notifications */}
                  <Tab.Pane eventKey="notifications">
                    <div className="settings-pane">
                      <div className="settings-header">
                        <h4>Notification Settings</h4>
                        <p>Configure how and when you receive notifications</p>
                      </div>

                      <Card className="mb-4">
                        <Card.Header>
                          <h6 className="mb-0">Communication Preferences</h6>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md={6}>
                              <Form.Check
                                type="switch"
                                label="Email Notifications"
                                checked={
                                  settings.notifications.emailNotifications
                                }
                                onChange={(e) =>
                                  handleSettingChange(
                                    "notifications",
                                    "emailNotifications",
                                    e.target.checked
                                  )
                                }
                                disabled={
                                  !hasPermission("settings", "notifications")
                                }
                                className="mb-3"
                              />
                              <Form.Check
                                type="switch"
                                label="SMS Notifications"
                                checked={
                                  settings.notifications.smsNotifications
                                }
                                onChange={(e) =>
                                  handleSettingChange(
                                    "notifications",
                                    "smsNotifications",
                                    e.target.checked
                                  )
                                }
                                disabled={
                                  !hasPermission("settings", "notifications")
                                }
                                className="mb-3"
                              />
                              <Form.Check
                                type="switch"
                                label="Promotional Emails"
                                checked={
                                  settings.notifications.promotionalEmails
                                }
                                onChange={(e) =>
                                  handleSettingChange(
                                    "notifications",
                                    "promotionalEmails",
                                    e.target.checked
                                  )
                                }
                                disabled={
                                  !hasPermission("settings", "notifications")
                                }
                                className="mb-3"
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Check
                                type="switch"
                                label="Order Notifications"
                                checked={
                                  settings.notifications.orderNotifications
                                }
                                onChange={(e) =>
                                  handleSettingChange(
                                    "notifications",
                                    "orderNotifications",
                                    e.target.checked
                                  )
                                }
                                disabled={
                                  !hasPermission("settings", "notifications")
                                }
                                className="mb-3"
                              />
                              <Form.Check
                                type="switch"
                                label="Low Stock Alerts"
                                checked={settings.notifications.lowStockAlerts}
                                onChange={(e) =>
                                  handleSettingChange(
                                    "notifications",
                                    "lowStockAlerts",
                                    e.target.checked
                                  )
                                }
                                disabled={
                                  !hasPermission("settings", "notifications")
                                }
                                className="mb-3"
                              />
                              <Form.Check
                                type="switch"
                                label="Customer Feedback"
                                checked={
                                  settings.notifications.customerFeedback
                                }
                                onChange={(e) =>
                                  handleSettingChange(
                                    "notifications",
                                    "customerFeedback",
                                    e.target.checked
                                  )
                                }
                                disabled={
                                  !hasPermission("settings", "notifications")
                                }
                                className="mb-3"
                              />
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      <div className="settings-actions">
                        <Button
                          variant="primary"
                          className="btn-admin-primary me-2"
                          onClick={() => handleSaveSettings("notifications")}
                          disabled={!hasPermission("settings", "notifications")}
                        >
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => resetToDefaults("notifications")}
                          disabled={!hasPermission("settings", "notifications")}
                        >
                          <i className="fas fa-undo me-2"></i>
                          Reset to Defaults
                        </Button>
                      </div>
                    </div>
                  </Tab.Pane>

                  {/* Security Settings */}
                  <Tab.Pane eventKey="security">
                    <div className="settings-pane">
                      <div className="settings-header">
                        <h4>Security Settings</h4>
                        <p>Manage authentication and security preferences</p>
                      </div>

                      <Alert variant="warning" className="security-warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Changes to security settings will affect all admin
                        users. Please review carefully before saving.
                      </Alert>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Session Timeout (minutes)</Form.Label>
                            <Form.Control
                              type="number"
                              min="5"
                              max="480"
                              value={settings.security.sessionTimeout}
                              onChange={(e) =>
                                handleSettingChange(
                                  "security",
                                  "sessionTimeout",
                                  parseInt(e.target.value)
                                )
                              }
                              disabled={!hasPermission("settings", "security")}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Password Minimum Length</Form.Label>
                            <Form.Control
                              type="number"
                              min="4"
                              max="32"
                              value={settings.security.passwordMinLength}
                              onChange={(e) =>
                                handleSettingChange(
                                  "security",
                                  "passwordMinLength",
                                  parseInt(e.target.value)
                                )
                              }
                              disabled={!hasPermission("settings", "security")}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Login Attempts</Form.Label>
                            <Form.Control
                              type="number"
                              min="3"
                              max="10"
                              value={settings.security.maxLoginAttempts}
                              onChange={(e) =>
                                handleSettingChange(
                                  "security",
                                  "maxLoginAttempts",
                                  parseInt(e.target.value)
                                )
                              }
                              disabled={!hasPermission("settings", "security")}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Account Lockout Duration (minutes)
                            </Form.Label>
                            <Form.Control
                              type="number"
                              min="5"
                              max="60"
                              value={settings.security.accountLockoutDuration}
                              onChange={(e) =>
                                handleSettingChange(
                                  "security",
                                  "accountLockoutDuration",
                                  parseInt(e.target.value)
                                )
                              }
                              disabled={!hasPermission("settings", "security")}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Check
                            type="switch"
                            label="Require Two-Factor Authentication"
                            checked={settings.security.requireTwoFactor}
                            onChange={(e) =>
                              handleSettingChange(
                                "security",
                                "requireTwoFactor",
                                e.target.checked
                              )
                            }
                            disabled={!hasPermission("settings", "security")}
                            className="mb-3"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Check
                            type="switch"
                            label="Allow Password Reset"
                            checked={settings.security.allowPasswordReset}
                            onChange={(e) =>
                              handleSettingChange(
                                "security",
                                "allowPasswordReset",
                                e.target.checked
                              )
                            }
                            disabled={!hasPermission("settings", "security")}
                            className="mb-3"
                          />
                        </Col>
                      </Row>

                      <div className="settings-actions">
                        <Button
                          variant="primary"
                          className="btn-admin-primary me-2"
                          onClick={() => handleSaveSettings("security")}
                          disabled={!hasPermission("settings", "security")}
                        >
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => resetToDefaults("security")}
                          disabled={!hasPermission("settings", "security")}
                        >
                          <i className="fas fa-undo me-2"></i>
                          Reset to Defaults
                        </Button>
                      </div>
                    </div>
                  </Tab.Pane>

                  {/* Appearance Settings */}
                  <Tab.Pane eventKey="appearance">
                    <div className="settings-pane">
                      <div className="settings-header">
                        <h4>Appearance Settings</h4>
                        <p>
                          Customize the look and feel of the admin interface
                        </p>
                      </div>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Theme</Form.Label>
                            <Form.Select
                              value={settings.appearance.theme}
                              onChange={(e) =>
                                handleSettingChange(
                                  "appearance",
                                  "theme",
                                  e.target.value
                                )
                              }
                              disabled={
                                !hasPermission("settings", "appearance")
                              }
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="auto">Auto (System)</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Primary Color</Form.Label>
                            <Form.Control
                              type="color"
                              value={settings.appearance.primaryColor}
                              onChange={(e) =>
                                handleSettingChange(
                                  "appearance",
                                  "primaryColor",
                                  e.target.value
                                )
                              }
                              disabled={
                                !hasPermission("settings", "appearance")
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Check
                            type="switch"
                            label="Sidebar Collapsed by Default"
                            checked={settings.appearance.sidebarCollapsed}
                            onChange={(e) =>
                              handleSettingChange(
                                "appearance",
                                "sidebarCollapsed",
                                e.target.checked
                              )
                            }
                            disabled={!hasPermission("settings", "appearance")}
                            className="mb-3"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Check
                            type="switch"
                            label="Show Animations"
                            checked={settings.appearance.showAnimations}
                            onChange={(e) =>
                              handleSettingChange(
                                "appearance",
                                "showAnimations",
                                e.target.checked
                              )
                            }
                            disabled={!hasPermission("settings", "appearance")}
                            className="mb-3"
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Check
                            type="switch"
                            label="Compact Mode"
                            checked={settings.appearance.compactMode}
                            onChange={(e) =>
                              handleSettingChange(
                                "appearance",
                                "compactMode",
                                e.target.checked
                              )
                            }
                            disabled={!hasPermission("settings", "appearance")}
                            className="mb-3"
                          />
                        </Col>
                      </Row>

                      <div className="settings-actions">
                        <Button
                          variant="primary"
                          className="btn-admin-primary me-2"
                          onClick={() => handleSaveSettings("appearance")}
                          disabled={!hasPermission("settings", "appearance")}
                        >
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => resetToDefaults("appearance")}
                          disabled={!hasPermission("settings", "appearance")}
                        >
                          <i className="fas fa-undo me-2"></i>
                          Reset to Defaults
                        </Button>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
