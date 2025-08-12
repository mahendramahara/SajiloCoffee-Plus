import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const FeaturedProducts = ({ products, title = "Featured Products" }) => {
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center fw-bold text-primary mb-3">{title}</h2>
          <p className="text-center text-muted">
            Discover our most popular coffee selections
          </p>
        </Col>
      </Row>

      <Row>
        {products.map((product) => (
          <Col lg={3} md={6} key={product.id} className="mb-4">
            <div className="product-card">
              <div className="product-image">
                <i className="bi bi-cup-hot"></i>
              </div>
              <div className="p-3">
                <h5 className="fw-semibold mb-2">{product.name}</h5>
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
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row>
        <Col className="text-center">
          <Button
            as={Link}
            to="/menu"
            size="lg"
            className="btn-custom-secondary"
          >
            View All Products
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FeaturedProducts;
