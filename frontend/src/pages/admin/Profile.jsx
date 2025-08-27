import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge,
  Modal,
} from "react-bootstrap";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { showNotification } from "../../utils/notify";

const Profile = () => {
  const { admin, logout } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: admin?.name || "Admin User",
    email: admin?.email || "admin@sajilocoffee.com",
    phone: "+977-9801234567",
    role: admin?.role || "admin",
    department: "Management",
    joinDate: "2024-01-15",
    lastLogin: new Date().toISOString(),
    avatar: null,
    bio: "Experienced restaurant administrator with expertise in operations management and customer service.",
    location: "Kathmandu, Nepal",
    timezone: "Asia/Kathmandu",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activityLog] = useState([
    {
      id: 1,
      action: "Login",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      ip: "192.168.1.1",
      device: "Chrome on Windows",
    },
    {
      id: 2,
      action: "Updated Product",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      details: 'Modified "Espresso" product',
    },
    {
      id: 3,
      action: "View Analytics",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      ip: "192.168.1.1",
      device: "Chrome on Windows",
    },
    {
      id: 4,
      action: "Login",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      ip: "192.168.1.2",
      device: "Firefox on MacOS",
    },
    {
      id: 5,
      action: "Changed Settings",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      details: "Updated notification preferences",
    },
  ]);

  const handleProfileUpdate = () => {
    // Validate form
    if (!profileData.name || !profileData.email) {
      showNotification.error("Name and email are required");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      showNotification.success("Profile updated successfully");
    }, 500);
  };

  const handlePasswordChange = () => {
    // Validate passwords
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      showNotification.error("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showNotification.error("Password must be at least 8 characters long");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
      showNotification.success("Password changed successfully");
    }, 500);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        showNotification.error("Image size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({ ...prev, avatar: e.target.result }));
        showNotification.success("Profile picture updated");
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "danger",
      manager: "warning",
      staff: "info",
      user: "secondary",
    };
    return colors[role] || "primary";
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeSince = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInHours = Math.floor((now - then) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - then) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="dashboard-title">Profile</h1>
          <p className="dashboard-subtitle">
            Manage your account information and settings
          </p>
        </div>
        <div>
          <Button
            variant={isEditing ? "success" : "primary"}
            className="btn-admin-primary me-2"
            onClick={isEditing ? handleProfileUpdate : () => setIsEditing(true)}
          >
            <i className={`fas ${isEditing ? "fa-save" : "fa-edit"} me-2`}></i>
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
          {isEditing && (
            <Button
              variant="outline-secondary"
              onClick={() => setIsEditing(false)}
            >
              <i className="fas fa-times me-2"></i>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Row>
        <Col lg={4} className="mb-4">
          <Card className="profile-card">
            <Card.Body className="text-center">
              <div className="profile-avatar-container">
                <div className="profile-avatar">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  {isEditing && (
                    <label className="avatar-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: "none" }}
                      />
                      <div className="upload-overlay">
                        <i className="fas fa-camera"></i>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <h4 className="profile-name">{profileData.name}</h4>
              <Badge
                bg={getRoleColor(profileData.role)}
                className="role-badge mb-3"
              >
                <i className="fas fa-shield-alt me-1"></i>
                {profileData.role.toUpperCase()}
              </Badge>

              <div className="profile-info">
                <div className="info-item">
                  <i className="fas fa-envelope text-muted me-2"></i>
                  <span>{profileData.email}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-phone text-muted me-2"></i>
                  <span>{profileData.phone}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-building text-muted me-2"></i>
                  <span>{profileData.department}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-calendar text-muted me-2"></i>
                  <span>
                    Joined {new Date(profileData.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-item">
                  <i className="fas fa-clock text-muted me-2"></i>
                  <span>Last active {getTimeSince(profileData.lastLogin)}</span>
                </div>
              </div>

              <div className="profile-actions mt-4">
                <Button
                  variant="outline-primary"
                  className="me-2 mb-2"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <i className="fas fa-key me-2"></i>
                  Change Password
                </Button>
                <Button
                  variant="outline-danger"
                  className="mb-2"
                  onClick={logout}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Row>
            <Col lg={12} className="mb-4">
              <Card className="profile-details-card">
                <Card.Header>
                  <h5 className="card-title">Personal Information</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Department</Form.Label>
                          <Form.Select
                            value={profileData.department}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                department: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          >
                            <option value="Management">Management</option>
                            <option value="Operations">Operations</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Service">Service</option>
                            <option value="Finance">Finance</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.location}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Timezone</Form.Label>
                          <Form.Select
                            value={profileData.timezone}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                timezone: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
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

                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={12}>
              <Card className="activity-log-card">
                <Card.Header>
                  <h5 className="card-title">Recent Activity</h5>
                </Card.Header>
                <Card.Body>
                  <div className="activity-timeline">
                    {activityLog.map((activity, index) => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          <i
                            className={`fas ${
                              activity.action === "Login"
                                ? "fa-sign-in-alt"
                                : activity.action === "Updated Product"
                                ? "fa-edit"
                                : activity.action === "View Analytics"
                                ? "fa-chart-bar"
                                : activity.action === "Changed Settings"
                                ? "fa-cog"
                                : "fa-circle"
                            }`}
                          ></i>
                        </div>
                        <div className="activity-content">
                          <div className="activity-header">
                            <span className="activity-action">
                              {activity.action}
                            </span>
                            <span className="activity-time">
                              {getTimeSince(activity.timestamp)}
                            </span>
                          </div>
                          <div className="activity-details">
                            <div className="activity-device">
                              <i className="fas fa-desktop me-1"></i>
                              {activity.device} • {activity.ip}
                            </div>
                            {activity.details && (
                              <div className="activity-description">
                                {activity.details}
                              </div>
                            )}
                            <div className="activity-timestamp text-muted">
                              {formatDateTime(activity.timestamp)}
                            </div>
                          </div>
                        </div>
                        {index < activityLog.length - 1 && (
                          <div className="activity-line"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Password Change Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordChange();
          }}
        >
          <Modal.Body>
            <Alert variant="info" className="password-requirements">
              <small>
                <strong>Password Requirements:</strong>
                <ul className="mb-0 mt-1">
                  <li>At least 8 characters long</li>
                  <li>Contains uppercase and lowercase letters</li>
                  <li>Contains at least one number</li>
                  <li>Contains at least one special character</li>
                </ul>
              </small>
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="btn-admin-primary"
            >
              <i className="fas fa-key me-2"></i>
              Change Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Profile;
