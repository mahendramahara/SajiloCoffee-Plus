import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../../context/useAuth";
import { showNotification } from "../../utils/notify";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password, "admin");

      if (result.success) {
        showNotification.success(
          "Login successful! Welcome to SajiloCoffee+ Admin"
        );
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(result.error || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setIsLoading(true);
    try {
      const result =
        role === "admin"
          ? await login("admin@sajilocoffee.plus", "password", "admin")
          : await login("manager@sajilocoffee.plus", "password", "admin");

      if (result.success) {
        showNotification.success(`Logged in as demo ${role}`);
        navigate("/admin/dashboard", { replace: true });
      }
    } catch {
      setError("Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center"
      >
        <Row className="w-100">
          <Col md={6} lg={4} className="mx-auto">
            <Card className="shadow-lg border-0 admin-login-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="admin-logo mb-3">
                    <i
                      className="fas fa-coffee text-primary"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h2 className="admin-title">SajiloCoffee+ Admin</h2>
                  <p className="text-muted">Sign in to your admin account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your admin email"
                      required
                      size="lg"
                      className="admin-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      size="lg"
                      className="admin-input"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 admin-login-btn mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="text-muted mb-3">Demo Accounts</p>
                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleDemoLogin("admin")}
                      disabled={isLoading}
                      className="demo-btn"
                    >
                      <i className="fas fa-user-shield me-2"></i>
                      Login as Admin
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleDemoLogin("manager")}
                      disabled={isLoading}
                      className="demo-btn"
                    >
                      <i className="fas fa-user-tie me-2"></i>
                      Login as Manager
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
