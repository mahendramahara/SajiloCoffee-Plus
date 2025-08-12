import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    preferences: {
      sweetness: "medium",
      strength: "medium",
      milk: "regular",
      temperature: "hot",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("preferences.")) {
      const prefKey = name.split(".")[1];
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [prefKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showSuccess("Account created successfully! Please log in.");
      navigate("/login");
    } catch {
      showError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <div className="auth-card mx-auto" style={{ maxWidth: "500px" }}>
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary mb-3">Join SajiloCoffee+</h1>
            <p className="text-muted">
              Create your account and discover great coffee
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </Form.Group>

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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="fw-semibold mb-3 text-primary">
              Coffee Preferences
            </h6>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sweetness Level</Form.Label>
                  <Form.Select
                    name="preferences.sweetness"
                    value={formData.preferences.sweetness}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="none">No Sugar</option>
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="sweet">Sweet</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Coffee Strength</Form.Label>
                  <Form.Select
                    name="preferences.strength"
                    value={formData.preferences.strength}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="strong">Strong</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Milk Preference</Form.Label>
                  <Form.Select
                    name="preferences.milk"
                    value={formData.preferences.milk}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="regular">Regular Milk</option>
                    <option value="buffalo">Buffalo Milk</option>
                    <option value="plant">Plant Milk</option>
                    <option value="none">No Milk</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Temperature</Form.Label>
                  <Form.Select
                    name="preferences.temperature"
                    value={formData.preferences.temperature}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="hot">Hot</option>
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                    <option value="iced">Iced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              className="btn-custom-primary w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </Form>

          <hr className="my-4" />

          <div className="text-center">
            <p className="text-muted mb-0">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Register;
