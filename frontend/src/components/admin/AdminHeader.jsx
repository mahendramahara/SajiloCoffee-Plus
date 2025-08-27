import React, { useState } from "react";
import { Navbar, Nav, Dropdown, Badge, Form, Button } from "react-bootstrap";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import analyticsData from "../../api/analytics.json";

const AdminHeader = ({ onSidebarToggle }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  const notifications = analyticsData.notifications.slice(0, 8);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    const icons = {
      order: "shopping-cart",
      inventory: "exclamation-triangle",
      user: "user-plus",
      subscription: "crown",
      payment: "credit-card",
      review: "star",
      system: "tools",
    };
    return icons[type] || "bell";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "danger",
      normal: "primary",
      low: "secondary",
    };
    return colors[priority] || "primary";
  };

  const formatNotificationTime = (timeString) => {
    const now = new Date();
    const notificationTime = new Date(timeString);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return notificationTime.toLocaleDateString();
  };

  return (
    <Navbar className="admin-header" expand="lg">
      <div className="d-flex align-items-center">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onSidebarToggle}
          className="sidebar-toggle-btn me-3"
        >
          <i className="fas fa-bars"></i>
        </Button>

        <Form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <Form.Control
              type="search"
              placeholder="Search products, orders, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="search-btn"
            >
              <i className="fas fa-search"></i>
            </Button>
          </div>
        </Form>
      </div>

      <Nav className="ms-auto d-flex align-items-center">
        <Nav.Item className="me-3">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-primary"
              size="sm"
              className="notification-toggle"
              id="notifications-dropdown"
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <Badge bg="danger" className="notification-badge">
                  {unreadCount}
                </Badge>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="notification-dropdown">
              <Dropdown.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Notifications</span>
                  <Badge bg="primary">{notifications.length}</Badge>
                </div>
              </Dropdown.Header>
              <Dropdown.Divider />

              {notifications.map((notification) => (
                <Dropdown.Item
                  key={notification.id}
                  className={`notification-item ${
                    notification.unread ? "unread" : ""
                  }`}
                >
                  <div className="notification-content">
                    <div className="notification-icon">
                      <i
                        className={`fas fa-${getNotificationIcon(
                          notification.type
                        )} ${getPriorityColor(notification.priority)}`}
                      ></i>
                    </div>
                    <div className="notification-text">
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      <small className="text-muted">
                        {formatNotificationTime(notification.time)}
                      </small>
                    </div>
                  </div>
                </Dropdown.Item>
              ))}

              <Dropdown.Divider />
              <Dropdown.Item className="text-center">
                <small>View all notifications</small>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav.Item>

        <Nav.Item>
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              className="user-dropdown-toggle"
              id="user-dropdown"
            >
              <div className="user-info-header">
                <img
                  src={admin?.avatar || "/images/avatars/default.png"}
                  alt={admin?.name}
                  className="user-avatar-header"
                />
                <div className="user-details">
                  <span className="user-name">{admin?.name}</span>
                  <small className="user-role text-muted text-capitalize">
                    {admin?.role}
                  </small>
                </div>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="user-dropdown">
              <Dropdown.Header>
                <div className="text-center">
                  <img
                    src={admin?.avatar || "/images/avatars/default.png"}
                    alt={admin?.name}
                    className="user-avatar-large rounded-circle mb-2"
                  />
                  <div className="fw-semibold">{admin?.name}</div>
                  <small className="text-muted">{admin?.email}</small>
                </div>
              </Dropdown.Header>
              <Dropdown.Divider />

              <Dropdown.Item onClick={() => navigate("/admin/profile")}>
                <i className="fas fa-user me-2"></i>
                Profile
              </Dropdown.Item>

              <Dropdown.Item onClick={() => navigate("/admin/settings")}>
                <i className="fas fa-cog me-2"></i>
                Settings
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default AdminHeader;
