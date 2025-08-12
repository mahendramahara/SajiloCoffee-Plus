import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <h1 className="display-4 fw-bold mb-4">Welcome to SajiloCoffee+</h1>
            <p className="lead mb-4">
              Experience the finest Nepali coffee culture with premium blends,
              fresh roasts, and authentic flavors delivered right to your
              doorstep.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button
                as={Link}
                to="/menu"
                size="lg"
                className="btn-custom-primary"
              >
                <i className="bi bi-cup-hot me-2"></i>
                Explore Menu
              </Button>
              <Button
                as={Link}
                to="/subscriptions"
                size="lg"
                className="btn-custom-secondary"
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Subscribe Now
              </Button>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <div
              className="hero-image"
              style={{
                width: "100%",
                height: "400px",
                background:
                  "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "6rem",
                color: "var(--color-surface)",
                boxShadow: "0 20px 40px rgba(75, 46, 33, 0.3)",
              }}
            >
              <i className="bi bi-cup-hot"></i>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
