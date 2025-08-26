import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading = false }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <i className="bi bi-search"></i>
        <h4>No products found</h4>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <Row>
      {products.map((product) => (
        <Col lg={4} md={6} key={product.id} className="mb-4">
          <div className="product-card">
            <div className="product-image">
              <i className="bi bi-cup-hot"></i>
              {product.tags && product.tags.includes("popular") && (
                <span className="badge bg-warning position-absolute top-0 start-0 m-2">
                  Popular
                </span>
              )}
            </div>
            <div className="p-3">
              <h5 className="fw-semibold mb-2">{product.name}</h5>
              <p className="text-muted small mb-3">{product.description}</p>

              {product.tags && (
                <div className="mb-3">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="badge bg-secondary me-1 mb-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className="price-badge">
                    NPR{" "}
                    {typeof product.price === "number"
                      ? product.price
                      : product.price.regular}
                  </span>
                  {typeof product.price === "object" &&
                    product.price.member && (
                      <small className="text-muted d-block">
                        Member: NPR {product.price.member}
                      </small>
                    )}
                  {product.sizes && product.sizes.length > 0 && (
                    <small className="text-muted d-block">
                      From NPR {Math.min(...product.sizes.map((s) => s.price))}
                    </small>
                  )}
                </div>
                <div className="text-end">
                  <div className="text-warning small">
                    {"★".repeat(Math.floor(product.ratingAverage || 4.2))}
                    <span className="text-muted ms-1">
                      ({product.ratingAverage || 4.2})
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button
                  as={Link}
                  to={`/product/${product.id}`}
                  size="sm"
                  className="btn-custom-primary flex-grow-1"
                >
                  View Details
                </Button>
                <Button size="sm" variant="outline-primary">
                  <i className="bi bi-cart-plus"></i>
                </Button>
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
