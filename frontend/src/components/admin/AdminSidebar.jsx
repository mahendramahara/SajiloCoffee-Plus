import React from "react";
import { Nav, Navbar, Badge } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { showNotification } from "../../utils/notify";

const AdminSidebar = ({ isCollapsed, isVisible, onToggle }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showNotification.success("Logged out successfully");
    navigate("/admin/login");
  };

  const menuItems = [
    {
      icon: "fas fa-tachometer-alt",
      label: "Dashboard",
      path: "/admin/dashboard",
      permission: null,
    },
    {
      icon: "fas fa-coffee",
      label: "Products",
      path: "/admin/products",
      permission: "products.read",
      badge: "12",
    },
    {
      icon: "fas fa-shopping-cart",
      label: "Orders",
      path: "/admin/orders",
      permission: "orders.read",
      badge: "3",
    },
    {
      icon: "fas fa-users",
      label: "Users",
      path: "/admin/users",
      permission: "users.read",
    },
    {
      icon: "fas fa-user-shield",
      label: "Admins",
      path: "/admin/admins",
      permission: "admins.read",
    },
    {
      icon: "fas fa-crown",
      label: "Subscriptions",
      path: "/admin/subscriptions",
      permission: "subscriptions.read",
    },
    {
      icon: "fas fa-chart-bar",
      label: "Analytics",
      path: "/admin/analytics",
      permission: "analytics.sales",
    },
    {
      icon: "fas fa-table",
      label: "Tables",
      path: "/admin/tables",
      permission: "settings.tables",
    },
    {
      icon: "fas fa-bell",
      label: "Notifications",
      path: "/admin/notifications",
      permission: null,
    },
    {
      icon: "fas fa-cog",
      label: "Settings",
      path: "/admin/settings",
      permission: "settings.cafe",
    },
  ];

  const hasPermissionToAccess = (permission) => {
    if (!permission) return true;
    const [resource, action] = permission.split(".");
    return admin?.permissions?.[resource]?.[action] ?? false;
  };

  return (
    <div
      className={`admin-sidebar ${isCollapsed ? "collapsed" : ""} ${
        isVisible ? "show" : ""
      }`}
    >
      <div className="sidebar-header">
        <div className="d-flex align-items-center">
          <div className="sidebar-logo">
            <i className="fas fa-coffee text-primary"></i>
          </div>
          {!isCollapsed && (
            <div className="sidebar-brand">
              <h5 className="mb-0">SajiloCoffee+</h5>
              <small className="text-muted">Admin Panel</small>
            </div>
          )}
        </div>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i
            className={`fas fa-${
              isCollapsed ? "chevron-right" : "chevron-left"
            }`}
          ></i>
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <img
            src={admin?.avatar || "/images/avatars/default.png"}
            alt={admin?.name}
            className="rounded-circle"
          />
          <div className="user-status"></div>
        </div>
        {!isCollapsed && (
          <div className="user-info">
            <h6 className="mb-0">{admin?.name}</h6>
            <small className="text-muted text-capitalize">
              {admin?.role}
            </small>
          </div>
        )}
      </div>

      <Nav className="sidebar-nav flex-column">
        {menuItems.map((item, index) => {
          if (!hasPermissionToAccess(item.permission)) {
            return null;
          }

          return (
            <Nav.Item key={index}>
              <Nav.Link
                as={NavLink}
                to={item.path}
                className="sidebar-nav-link"
                title={isCollapsed ? item.label : ""}
              >
                <i className={item.icon}></i>
                {!isCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <Badge bg="danger" className="ms-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Nav.Link>
            </Nav.Item>
          );
        })}

        <div className="sidebar-divider"></div>

        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/admin/profile"
            className="sidebar-nav-link"
            title={isCollapsed ? "Profile" : ""}
          >
            <i className="fas fa-user-circle"></i>
            {!isCollapsed && <span className="nav-label">Profile</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            onClick={handleLogout}
            className="sidebar-nav-link text-danger"
            style={{ cursor: "pointer" }}
            title={isCollapsed ? "Logout" : ""}
          >
            <i className="fas fa-sign-out-alt"></i>
            {!isCollapsed && <span className="nav-label">Logout</span>}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
