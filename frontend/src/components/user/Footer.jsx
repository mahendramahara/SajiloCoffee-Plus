import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-custom mt-auto">
      <Container>
        <Row className="py-4">
          <Col md={4} className="mb-3">
            <h5 className="text-primary fw-bold mb-3">SajiloCoffee+</h5>
            <p className="text-muted small">
              Premium coffee experience with personalized recommendations and
              exclusive subscription benefits.
            </p>
            <div className="social-links">
              <a href="#" className="social-link me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-link me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-link me-3">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </Col>

          <Col md={2} className="mb-3">
            <h6 className="fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/menu" className="footer-link">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="footer-link">
                  Recommendations
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="footer-link">
                  Subscriptions
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={2} className="mb-3">
            <h6 className="fw-semibold mb-3">Account</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/profile" className="footer-link">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="footer-link">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">
                  Cart
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4} className="mb-3">
            <h6 className="fw-semibold mb-3">Contact Info</h6>
            <div className="text-muted small">
              <div className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                Kathmandu, Nepal
              </div>
              <div className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                +977-1-4567890
              </div>
              <div>
                <i className="bi bi-envelope me-2"></i>
                info@sajilocoffee.plus
              </div>
            </div>
          </Col>
        </Row>

        <hr className="my-3" />
        <Row className="py-2">
          <Col md={6}>
            <p className="text-muted small mb-0">
              &copy; 2025 SajiloCoffee+. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <Link to="#" className="footer-link me-3">
              Privacy Policy
            </Link>
            <Link to="#" className="footer-link">
              Terms of Service
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
