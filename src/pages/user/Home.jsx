import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaShoppingBag, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const username = user?.username || user?.sub || "Guest";

  return (
    <Container className="py-5">
      <div className="mb-5 text-center py-5 bg-light rounded shadow-sm border">
        <h1 className="fw-bold mb-3">Welcome, {username}!</h1>
        <p className="text-muted fs-5 mb-4">
          Great to see you again. Discover our latest deals and top products.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="px-5 py-3 fw-bold rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
          onClick={() => navigate("/products")}
        >
          <FaShoppingBag /> Start Shopping
        </Button>
      </div>

      <h3 className="mb-4 text-center">Quick Access</h3>
      <Row className="g-4">
        <Col md={4}>
          <Card className="text-center h-100 shadow-sm border-0 bg-light">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
              <FaShoppingBag size={40} className="text-primary mb-4" />
              <h4 className="mb-3">Catalog</h4>
              <p className="text-muted mb-4">
                Looking for something specific? Browse our product catalog.
              </p>
              <Button
                variant="outline-primary"
                className="mt-auto px-4"
                onClick={() => navigate("/products")}
              >
                Browse Products
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center h-100 shadow-sm border-0 bg-light">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
              <FaBoxOpen size={40} className="text-primary mb-4" />
              <h4 className="mb-3">My Orders</h4>
              <p className="text-muted mb-4">
                Track your delivery status and view your order history.
              </p>
              <Button
                variant="outline-primary"
                className="mt-auto px-4"
                onClick={() => navigate("/orders")}
              >
                View Orders
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center h-100 shadow-sm border-0 bg-light">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5">
              <FaShoppingCart size={40} className="text-primary mb-4" />
              <h4 className="mb-3">Cart</h4>
              <p className="text-muted mb-4">
                Have some items saved? Now is the perfect time to check out!
              </p>
              <Button
                variant="outline-primary"
                className="mt-auto px-4"
                onClick={() => navigate("/cart")}
              >
                Go to Cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
