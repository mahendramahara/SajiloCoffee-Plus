import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { showSuccess, showAuthRequired } from "../../utils";
import productsData from "../../api/products.json";
import ratingsData from "../../api/ratings.json";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const product = productsData.find((p) => p.id === id);
  const productRatings = ratingsData.filter((r) => r.productId === id);

  const [selectedSize, setSelectedSize] = useState("regular");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Product not found</Alert>
        <Button variant="outline-primary" onClick={() => navigate("/menu")}>
          Back to Menu
        </Button>
      </Container>
    );
  }

  const availableAddons = [
    { id: "extra-shot", name: "Extra Shot", price: 50 },
    { id: "extra-cardamom", name: "Extra Cardamom", price: 20 },
    { id: "plant-milk", name: "Plant Milk", price: 30 },
    { id: "extra-hot", name: "Extra Hot", price: 0 },
    { id: "less-sugar", name: "Less Sugar", price: 0 },
  ];

  const calculateTotal = () => {
    const basePrice = product.price[selectedSize] || product.price.regular;
    const addonsPrice = selectedAddons.reduce((total, addonId) => {
      const addon = availableAddons.find((a) => a.id === addonId);
      return total + (addon ? addon.price : 0);
    }, 0);
    return (basePrice + addonsPrice) * quantity;
  };

  const handleAddonChange = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      showAuthRequired();
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      size: selectedSize,
      quantity,
      addons: selectedAddons,
      price: calculateTotal(),
    };

    showSuccess(`${product.name} added to cart!`);
    console.log("Added to cart:", cartItem);
  };

  const averageRating =
    productRatings.length > 0
      ? productRatings.reduce((sum, r) => sum + r.rating, 0) /
        productRatings.length
      : 0;

  return (
    <>
      <div className="page-header">
        <Container>
          <Row>
            <Col>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => navigate("/menu")}
                className="mb-3"
              >
                <i className="bi bi-arrow-left me-2"></i>Back to Menu
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Row>
          <Col lg={6}>
            <div
              className="product-image-large mb-4"
              style={{
                height: "400px",
                background: "var(--color-bg)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "6rem",
                color: "var(--color-muted)",
              }}
            >
              <i className="bi bi-cup-hot"></i>
            </div>
          </Col>

          <Col lg={6}>
            <h1 className="fw-bold text-primary mb-3">{product.name}</h1>
            <p className="lead text-muted mb-4">{product.description}</p>

            {averageRating > 0 && (
              <div className="mb-3">
                <div className="rating-stars me-2">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi bi-star${
                        i < Math.floor(averageRating) ? "-fill" : ""
                      }`}
                    ></i>
                  ))}
                </div>
                <small className="text-muted">
                  ({productRatings.length} reviews)
                </small>
              </div>
            )}

            {product.tags && (
              <div className="mb-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="badge bg-light text-dark me-2">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Size</Form.Label>
                    <Form.Select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      {Object.entries(product.price).map(([size, price]) => (
                        <option key={size} value={size}>
                          {size.charAt(0).toUpperCase() + size.slice(1)} - NPR{" "}
                          {price}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Quantity</Form.Label>
                    <div className="quantity-control">
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="mx-3 fw-medium">{quantity}</span>
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Add-ons</Form.Label>
                {availableAddons.map((addon) => (
                  <Form.Check
                    key={addon.id}
                    type="checkbox"
                    id={addon.id}
                    label={`${addon.name} ${
                      addon.price > 0 ? `(+NPR ${addon.price})` : ""
                    }`}
                    checked={selectedAddons.includes(addon.id)}
                    onChange={() => handleAddonChange(addon.id)}
                  />
                ))}
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold text-primary mb-0">
                    NPR {calculateTotal()}
                  </h4>
                  <small className="text-muted">Total price</small>
                </div>
                <Button
                  className="btn-custom-primary"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>Add to Cart
                </Button>
              </div>
            </Form>
          </Col>
        </Row>

        {productRatings.length > 0 && (
          <Row className="mt-5">
            <Col>
              <h4 className="fw-semibold mb-4">Customer Reviews</h4>
              {productRatings.slice(0, 3).map((review) => (
                <div key={review.id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star${
                            i < review.rating ? "-fill" : ""
                          }`}
                        ></i>
                      ))}
                    </div>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-0">{review.comment}</p>
                </div>
              ))}
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default ProductDetail;
