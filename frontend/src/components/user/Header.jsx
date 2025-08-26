import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge, Dropdown } from "react-bootstrap";
import { useAuth } from "../../context/useAuth";

const Header = () => {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount] = useState(2);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="navbar-custom shadow-sm" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary">
          SajiloCoffee<span className="text-accent">+</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/menu" className="nav-link-custom">
              Menu
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/recommendations"
              className="nav-link-custom"
            >
              For You
            </Nav.Link>
            {isLoggedIn && (
              <Nav.Link
                as={Link}
                to="/subscriptions"
                className="nav-link-custom"
              >
                Subscriptions
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center gap-2">
            {isLoggedIn ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/cart"
                  className="cart-link position-relative d-flex align-items-center"
                >
                  <i className="bi bi-cart3 fs-5"></i>
                  {cartCount > 0 && (
                    <Badge bg="danger" className="cart-badge position-absolute">
                      {cartCount}
                    </Badge>
                  )}
                  <span className="cart-text d-none d-lg-inline ms-1">
                    Cart
                  </span>
                </Nav.Link>

                <Dropdown align="end" className="profile-dropdown">
                  <Dropdown.Toggle
                    variant="link"
                    className="profile-toggle d-flex align-items-center text-decoration-none border-0 bg-transparent p-1"
                    id="profile-dropdown"
                  >
                    <div className="avatar-sm me-2">
                      {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="profile-name d-none d-md-inline text-start">
                      {currentUser?.name || "User"}
                    </span>
                    <i className="bi bi-chevron-down ms-1 fs-6"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-custom">
                    <Dropdown.Item
                      as={Link}
                      to="/profile"
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/orders"
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-bag me-2"></i>
                      My Orders
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="dropdown-item-custom"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <div className="auth-buttons d-flex gap-2 align-items-center">
                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-sm px-3"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3">
                  Sign Up
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
