import { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CartItemCard from "../../components/cards/CartItemCard";
import api from "../../api/axios";
import { API } from "../../api/endpoints";

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [selectedIds, setSelectedIds] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    return new Set(savedCart.map((item) => item.id));
  });

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleQuantityChange = (id, delta) => {
    const newCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    });
    updateCart(newCart);
  };

  const handleRemoveItem = (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    updateCart(newCart);
    const newSelected = new Set(selectedIds);
    newSelected.delete(id);
    setSelectedIds(newSelected);
  };

  const handleToggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === cartItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cartItems.map((item) => item.id)));
    }
  };

  const selectedItems = cartItems.filter((item) => selectedIds.has(item.id));
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    const selectedItems = cartItems.filter((item) => selectedIds.has(item.id));

    if (selectedItems.length === 0) {
      toast.warning("Please select at least one item to proceed.");
      return;
    }

    const payload = {
      items: selectedItems.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await api.post(API.ORDERS.CREATE, payload);
      toast.success("Order created successfully!");

      const remainingItems = cartItems.filter(
        (item) => !selectedIds.has(item.id),
      );

      updateCart(remainingItems);
      setSelectedIds(new Set());
      navigate("/orders");
    } catch (error) {
      console.error("Failed to create order", error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2 className="mb-4">Your cart is empty</h2>
        <p className="text-muted mb-4">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("/products")}
        >
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Shopping Cart</h2>

      <Row className="g-4">
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <Form.Check
              type="checkbox"
              id="select-all"
              label={`Select All (${cartItems.length})`}
              className="fw-bold"
              checked={
                selectedIds.size === cartItems.length && cartItems.length > 0
              }
              onChange={handleToggleSelectAll}
            />
          </div>

          {cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              isSelected={selectedIds.has(item.id)}
              onToggleSelect={handleToggleSelect}
              onChangeQuantity={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
        </Col>

        <Col lg={4}>
          <Card
            className="shadow-sm border-0 position-sticky rounded-4 overflow-hidden"
            style={{ top: "20px" }}
          >
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4">Order Summary</h4>

              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Items Selected:</span>
                <span>{selectedItems.length}</span>
              </div>

              <hr className="my-3 opacity-25" />

              <div className="d-flex justify-content-between align-items-end mb-4">
                <span className="fs-5 fw-bold">Total:</span>
                <span className="fs-3 fw-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 fw-bold py-3 rounded-3"
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
              >
                Place Order
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
