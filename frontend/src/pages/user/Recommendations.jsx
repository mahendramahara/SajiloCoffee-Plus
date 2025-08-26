import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import recommendationsData from "../../api/recommendations.json";
import productsData from "../../api/products.json";

const Recommendations = () => {
  const { currentUser, isLoggedIn } = useAuth();

  const userRecommendations = isLoggedIn
    ? recommendationsData.filter((rec) => rec.userId === currentUser?.id)
    : [];

  const getProductDetails = (productId) => {
    return productsData.find((p) => p.id === productId);
  };

  const popularProducts = productsData.slice(0, 4);
  const seasonalProducts = productsData
    .filter((p) => p.tags?.includes("seasonal") || p.name.includes("Monsoon"))
    .slice(0, 3);

  if (!isLoggedIn) {
    return (
      <>
        <div className="page-header">
          <Container>
            <Row>
              <Col lg={8} className="mx-auto text-center">
                <h1 className="display-5 fw-bold text-primary mb-3">
                  <i className="bi bi-stars me-3"></i>
                  Discover Great Coffee
                </h1>
                <p className="lead text-muted">
                  Sign in to get personalized recommendations based on your
                  taste preferences
                </p>
                <Button as={Link} to="/login" className="btn-custom-primary">
                  Sign In for Recommendations
                </Button>
              </Col>
            </Row>
          </Container>
        </div>

        <Container className="py-5">
          <Row className="mb-4">
            <Col>
              <h3 className="fw-bold text-primary mb-3">Popular Choices</h3>
              <p className="text-muted">See what other customers are loving</p>
            </Col>
          </Row>

          <Row>
            {popularProducts.map((product) => (
              <Col lg={3} md={6} key={product.id} className="mb-4">
                <div className="product-card">
                  <div className="product-image">
                    <i className="bi bi-cup-hot"></i>
                  </div>
                  <div className="p-3">
                    <h6 className="fw-semibold mb-2">{product.name}</h6>
                    <p className="text-muted small mb-3">
                      {product.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="price-badge">
                        NPR {product.price.regular}
                      </span>
                      <Button
                        as={Link}
                        to={`/product/${product.id}`}
                        size="sm"
                        className="btn-custom-primary"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <Container>
          <Row>
            <Col>
              <h1 className="display-5 fw-bold text-primary mb-2">
                <i className="bi bi-stars me-3"></i>
                For You, {currentUser?.name}
              </h1>
              <p className="lead text-muted">
                Personalized coffee recommendations based on your preferences
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {userRecommendations.length > 0 && (
          <>
            <Row className="mb-4">
              <Col>
                <h3 className="fw-bold text-primary mb-3">
                  Recommended for You
                </h3>
                <p className="text-muted">
                  Based on your taste preferences and order history
                </p>
              </Col>
            </Row>

            <Row className="mb-5">
              {userRecommendations.map((recommendation) => {
                const product = getProductDetails(recommendation.productId);
                if (!product) return null;

                return (
                  <Col lg={4} key={recommendation.id} className="mb-4">
                    <div className="recommendation-card">
                      <Row className="align-items-center">
                        <Col xs={3}>
                          <div
                            className="product-image-sm"
                            style={{
                              width: "60px",
                              height: "60px",
                              background: "var(--color-bg)",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5rem",
                              color: "var(--color-muted)",
                            }}
                          >
                            <i className="bi bi-cup-hot"></i>
                          </div>
                        </Col>
                        <Col xs={9}>
                          <h6 className="fw-semibold mb-1">{product.name}</h6>
                          <p className="text-muted small mb-2">
                            {recommendation.reason}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-medium text-primary">
                              NPR {product.price.regular}
                            </span>
                            <Button
                              as={Link}
                              to={`/product/${product.id}`}
                              size="sm"
                              className="btn-custom-primary"
                            >
                              Try It
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </>
        )}

        <Row className="mb-4">
          <Col>
            <h3 className="fw-bold text-primary mb-3">Seasonal Favorites</h3>
            <p className="text-muted">Perfect for the current season</p>
          </Col>
        </Row>

        <Row className="mb-5">
          {seasonalProducts.map((product) => (
            <Col lg={4} md={6} key={product.id} className="mb-4">
              <div className="product-card">
                <div className="product-image">
                  <i className="bi bi-cup-hot"></i>
                </div>
                <div className="p-3">
                  <h6 className="fw-semibold mb-2">{product.name}</h6>
                  <p className="text-muted small mb-3">{product.description}</p>
                  {product.tags && (
                    <div className="mb-3">
                      {product.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="badge bg-secondary me-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="price-badge">
                      NPR {product.price.regular}
                    </span>
                    <Button
                      as={Link}
                      to={`/product/${product.id}`}
                      size="sm"
                      className="btn-custom-primary"
                    >
                      Order Now
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="mb-4">
          <Col>
            <h3 className="fw-bold text-primary mb-3">
              Based on Your Preferences
            </h3>
            <p className="text-muted">Coffee that matches your taste profile</p>
          </Col>
        </Row>

        <Row>
          {currentUser?.preferences && (
            <Col lg={8} className="mx-auto">
              <div className="p-4 bg-light rounded mb-4">
                <h6 className="fw-semibold mb-3">Your Taste Profile</h6>
                <Row>
                  <Col md={3}>
                    <small className="text-muted d-block">Sweetness</small>
                    <span className="fw-medium">
                      {currentUser.preferences.sweetness}
                    </span>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted d-block">Strength</small>
                    <span className="fw-medium">
                      {currentUser.preferences.strength}
                    </span>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted d-block">Milk</small>
                    <span className="fw-medium">
                      {currentUser.preferences.milk}
                    </span>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted d-block">Temperature</small>
                    <span className="fw-medium">
                      {currentUser.preferences.temperature}
                    </span>
                  </Col>
                </Row>
              </div>
            </Col>
          )}
        </Row>

        <Row>
          {productsData.slice(0, 3).map((product) => (
            <Col lg={4} md={6} key={product.id} className="mb-4">
              <div className="product-card">
                <div className="product-image">
                  <i className="bi bi-cup-hot"></i>
                </div>
                <div className="p-3">
                  <h6 className="fw-semibold mb-2">{product.name}</h6>
                  <p className="text-muted small mb-3">{product.description}</p>
                  <div className="mb-2">
                    <small className="text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Matches your preferences
                    </small>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="price-badge">
                      NPR {product.price.regular}
                    </span>
                    <Button
                      as={Link}
                      to={`/product/${product.id}`}
                      size="sm"
                      className="btn-custom-primary"
                    >
                      Try It
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Recommendations;
