import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../utils";
import { login as loginAPI, getMe } from "../../api/authApi";

const Login = () => {
  const { login } = useAuth();
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
      const response = await loginAPI({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('tokenExpiresIn', response.data.tokenExpiresIn);
        
        const userResponse = await getMe();
        if (userResponse.success) {
          login(userResponse.data.user, response.data.accessToken, response.data.tokenExpiresIn);
          showSuccess(response.message || `Welcome back, ${userResponse.data.user.name}!`);
          navigate("/");
        } else {
          login(response.data.user, response.data.accessToken, response.data.tokenExpiresIn);
          showSuccess(response.message || `Welcome back, ${response.data.user.name}!`);
          navigate("/");
        }
      } else {
        showError(response.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again.";
      showError(errorMessage);
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

          <hr className="my-4" />

          <div className="text-center mb-3">
            <p className="text-muted">
              Looking for admin access?{" "}
              <Link to="/admin/login" className="text-decoration-none">
                Admin Login
              </Link>
            </p>
          </div>

          <div className="text-center">
            <p className="text-muted mb-0">
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
