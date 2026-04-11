import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import orderImage from "../../assets/OrderImg.jpg";

export default function OrderCard({ order }) {
  const navigate = useNavigate();

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "CREATED":
        return "primary";
      case "PAID":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Card
      className={`h-100 shadow-sm border-0 rounded-4 overflow-hidden ${order.deleted ? "opacity-75" : ""}`}
    >
      <Card.Img
        variant="top"
        src={orderImage}
        alt="Order package"
        style={{
          height: "160px",
          objectFit: "cover",
          filter: order.deleted ? "grayscale(100%)" : "none",
        }}
      />

      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="fw-bold mb-0 text-dark">
            Order #{order.id}
          </Card.Title>
          <Badge
            bg={getStatusBadge(order.status)}
            className="rounded-pill px-3 py-2"
          >
            {order.status}
          </Badge>
        </div>

        {order.deleted && (
          <Badge bg="danger" className="mb-2 align-self-start rounded-pill">
            DELETED
          </Badge>
        )}

        <Card.Text className="text-muted small mb-3">
          Placed on: {formattedDate}
        </Card.Text>

        <Card.Text className="fs-4 fw-bold mb-4 text-primary">
          ${order.totalPrice.toFixed(2)}
        </Card.Text>

        <div className="mt-auto">
          <Button
            variant="outline-primary"
            className="w-100 fw-bold rounded-3"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
