import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../utils";
import tablesData from "../../api/tables.json";
import PageHeader from "../../components/user/PageHeader";
import CartItem from "../../components/user/CartItem";
import CartSummary from "../../components/user/CartSummary";

const Cart = () => {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState("");

  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Traditional Masala Chai",
      size: "Regular",
      quantity: 2,
      price: 180,
      customizations: { Sugar: "Medium", Milk: "Regular" },
    },
    {
      id: "2",
      name: "Himalayan Black Coffee",
      size: "Large",
      quantity: 1,
      price: 250,
      customizations: { Strength: "Strong" },
    },
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId));
    showSuccess("Item removed from cart");
  };

  const handleCheckout = () => {
    if (!selectedTable) {
      showSuccess("Please select a table first");
      return;
    }
    showSuccess(
      `Order placed for Table ${selectedTable}. Proceeding to checkout...`
    );
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/menu");
  };

  if (cartItems.length === 0) {
    return (
      <>
        <PageHeader
          title="Shopping Cart"
          subtitle="Your cart is empty"
          icon="bi bi-cart"
        />
        <Container className="py-5">
          <div className="empty-state">
            <i className="bi bi-cart-x"></i>
            <h4>Your cart is empty</h4>
            <p>Add some delicious coffee to get started</p>
            <button
              className="btn btn-primary"
              onClick={handleContinueShopping}
            >
              Browse Menu
            </button>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Shopping Cart"
        subtitle={`${cartItems.length} item${
          cartItems.length !== 1 ? "s" : ""
        } in your cart`}
        icon="bi bi-cart"
      />

      <Container className="py-4 cart-page-container">
        <Row className="align-items-start">
          <Col xl={8} lg={7} className="mb-4">
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </Col>
          <Col xl={4} lg={5}>
            <div className="cart-summary-wrapper">
              <CartSummary
                items={cartItems}
                onCheckout={handleCheckout}
                onContinueShopping={handleContinueShopping}
                selectedTable={selectedTable}
                onTableChange={setSelectedTable}
                tables={tablesData}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Cart;
