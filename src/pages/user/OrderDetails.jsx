import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Badge,
  Button,
  Spinner,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { BsArrowLeft, BsBoxSeam, BsCreditCard, BsTrash } from "react-icons/bs";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import OrderItemCard from "../../components/cards/OrderItemCard";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../../components/cards/ConfirmDeleteModal";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(API.ORDERS.GET_BY_ID(id));
        const fetchedOrder = response.data;

        if (fetchedOrder.userDto?.id !== user?.userId && !isAdmin) {
          setError("You don't have permission to view this order.");
          return;
        }

        setOrder(fetchedOrder);
      } catch {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchOrderDetails();
    }
  }, [id, user?.userId, isAdmin]);

  const initiateDeleteOrder = () => {
    setShowDeleteModal(true);
  };

  const cancelDeleteOrder = () => {
    setShowDeleteModal(false);
  };

  const confirmDeleteOrder = async () => {
    try {
      setIsDeletingOrder(true);
      await api.delete(API.ORDERS.DELETE(id));
      toast.success("Order deleted successfully!");
      navigate(-1);
    } catch {
      toast.error("Failed to delete order.");
    } finally {
      setIsDeletingOrder(false);
      setShowDeleteModal(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setUpdatingStatus(true);
      await api.patch(API.ORDERS.UPDATE(id), { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "CREATED":
        return "primary";
      case "PAID":
        return "success";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-5 text-center">
        <h4 className="text-danger">{error || "Order not found."}</h4>
        <Button
          variant="outline-primary"
          className="mt-3"
          onClick={() => navigate("/orders")}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4 max-w-4xl">
      <Button
        variant="link"
        className="text-decoration-none px-0 mb-4 text-muted custom-hover-link"
        onClick={() => navigate(-1)}
      >
        <BsArrowLeft className="me-2" /> Back
      </Button>

      <Card className="shadow-sm border-0 mb-5 bg-light">
        <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <h2 className="mb-0">Order #{order.id}</h2>

              {isAdmin && !order.deleted ? (
                <div className="d-flex align-items-center gap-2">
                  <Form.Select
                    size="sm"
                    value={order.status}
                    onChange={handleStatusChange}
                    disabled={updatingStatus}
                    className={`fw-bold text-${getStatusBadge(order.status)} border-${getStatusBadge(order.status)}`}
                    style={{
                      width: "auto",
                      borderRadius: "50rem",
                      cursor: "pointer",
                      paddingRight: "2rem",
                    }}
                  >
                    <option value="CREATED">CREATED</option>
                    <option value="PAID">PAID</option>
                  </Form.Select>
                  {updatingStatus && (
                    <Spinner
                      animation="border"
                      size="sm"
                      className="text-primary"
                    />
                  )}
                </div>
              ) : (
                <Badge
                  bg={getStatusBadge(order.status)}
                  className="fs-6 px-3 py-2 rounded-pill"
                >
                  {order.status}
                </Badge>
              )}

              {order.deleted && (
                <Badge bg="danger" className="fs-6 px-3 py-2 rounded-pill">
                  DELETED
                </Badge>
              )}
            </div>
            <div className="text-muted">
              <BsBoxSeam className="me-2" />
              Placed on {formatDate(order.createdAt)}
              {isAdmin && order.userDto && (
                <span className="ms-2 text-primary">
                  (User: {order.userDto.email})
                </span>
              )}
            </div>
          </div>

          <div className="d-flex flex-column align-items-md-end border-start border-2 ps-md-4 pt-3 pt-md-0">
            <div className="text-muted text-uppercase small fw-bold tracking-wide">
              Total Amount
            </div>
            <div className="fs-2 fw-bold text-primary mb-3">
              ${order.totalPrice.toFixed(2)}
            </div>

            <div className="d-flex gap-2 mt-auto">
              {!order.deleted && order.status === "CREATED" && (
                <Button variant="outline-danger" onClick={initiateDeleteOrder}>
                  <BsTrash className="me-1" /> Delete
                </Button>
              )}

              {!order.deleted && order.status === "CREATED" && (
                <Button
                  variant="success"
                  onClick={() => navigate(`/checkout/${order.id}`)}
                >
                  <BsCreditCard className="me-1" /> Pay Now
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <h4 className="mb-4">Items in this Order</h4>

      {order.orderItems && order.orderItems.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {order.orderItems.map((orderItem, index) => (
            <Col key={index}>
              <OrderItemCard orderItem={orderItem} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 bg-light rounded text-muted">
          No items found in this order.
        </div>
      )}

      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={cancelDeleteOrder}
        onConfirm={confirmDeleteOrder}
        isDeleting={isDeletingOrder}
        title="Delete Order?"
        message={`Are you sure you want to delete order #${order.id}? This action cannot be undone and the order will be permanently removed.`}
        cancelText="Cancel"
        confirmText="Yes, Delete It"
      />
    </Container>
  );
}
