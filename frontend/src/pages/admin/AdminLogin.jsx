import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { showSuccess, showError } from "../../utils";
import { adminApi } from "../../api/adminApi";

const AdminLogin = () => {
  const { login } = useAdminAuth();
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
      const response = await adminApi.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        localStorage.setItem('adminAccessToken', response.data.accessToken);
        localStorage.setItem('adminTokenExpiresIn', response.data.tokenExpiresIn);
        
        const adminResponse = await adminApi.getMe();
        if (adminResponse.success) {
          login(adminResponse.data.admin, response.data.accessToken, response.data.tokenExpiresIn);
          showSuccess(response.message || `Welcome back, ${adminResponse.data.admin.name}!`);
          navigate("/admin/dashboard");
        } else {
          login(response.data.admin, response.data.accessToken, response.data.tokenExpiresIn);
          showSuccess(response.message || `Welcome back, ${response.data.admin.name}!`);
          navigate("/admin/dashboard");
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
    <>
      <div className="auth-container admin-login-bg">
        <Container>
          <div className="auth-card mx-auto">
            <div className="text-center mb-4">
              <div className="admin-logo mb-3">
                <i className="fas fa-shield-alt admin-icon"></i>
              </div>
              <h1 className="h3 fw-bold text-primary mb-3">Admin Portal</h1>
              <p className="text-muted">Sign in to access the admin dashboard</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your admin email"
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
                {isLoading ? "Signing In..." : "Admin Sign In"}
              </Button>
            </Form>

            <div className="text-center mb-3">
              <p className="text-muted">
                Customer login?{" "}
                <Link to="/login" className="text-decoration-none">
                  User Login
                </Link>
              </p>
            </div>

            <div className="text-center">
              <Link to="/" className="text-muted text-decoration-none">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Customer Site
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <style jsx>{`
        .admin-login-bg {
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
          min-height: 100vh;
        }
        
        .admin-logo {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #8B4513, #D2691E);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        
        .admin-icon {
          font-size: 2rem;
          color: white;
        }

        .admin-demo-info {
          background: rgba(139, 69, 19, 0.05);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(139, 69, 19, 0.1);
        }
      `}</style>
    </>
  );
};

export default AdminLogin;
