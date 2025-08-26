import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { showSuccess, showError } from "../../utils";

const Login = () => {
  const { login, loginAsUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password, "user");

      if (result.success) {
        showSuccess(`Welcome back, ${result.user.name}!`);
        navigate("/");
      } else {
        showError(result.error || "Login failed");
      }
    } catch {
      showError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setIsLoading(true);
    try {
      const result = await loginAsUser();
      if (result.success) {
        showSuccess(`Welcome back, ${result.user.name}!`);
        navigate("/");
      }
    } catch {
      showError("Quick login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <div className="auth-card mx-auto">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary mb-3">Welcome Back</h1>
            <p className="text-muted">Sign in to your SajiloCoffee+ account</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-custom-primary w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </Form>

          <div className="text-center mb-3">
            <span className="text-muted">or</span>
          </div>

          <Button
            variant="outline-secondary"
            className="w-100 mb-3"
            onClick={handleQuickLogin}
            disabled={isLoading}
          >
            Quick Login (Demo)
          </Button>

          <hr className="my-4" />

          <div className="text-center">
            <p className="text-muted mb-0">
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="fw-semibold mb-2">Demo Accounts:</h6>
            <small className="text-muted d-block">
              Email: rajesh@example.com
            </small>
            <small className="text-muted d-block">
              Email: sita@example.com
            </small>
            <small className="text-muted">Password: Any password works</small>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
