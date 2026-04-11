import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import OrderCard from "../../components/cards/OrderCard";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(API.ORDERS.GET_BY_USER_ID(user.userId));

        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.userId]);

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">My Orders</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted py-5">
          <h4 className="fw-bold">You have no orders yet.</h4>
          <p>Go to the shop and buy something awesome!</p>
          <Link to="/products">
            <Button
              variant="primary"
              size="lg"
              className="mt-3 rounded-pill px-4"
            >
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <Row xs={1} md={2} lg={4} className="g-4">
          {orders.map((order) => (
            <Col key={order.id}>
              <OrderCard order={order} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
