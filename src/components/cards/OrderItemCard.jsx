import { Card, Badge } from "react-bootstrap";
import itemImage from "../../assets/ItemImg.jpg";

export default function OrderItemCard({ orderItem }) {
  const itemName = orderItem.name || "Unknown Item";
  const itemPrice = orderItem.price || 0;
  const itemQuantity = orderItem.quantity || 1;

  return (
    <Card className="h-100 shadow-sm border-0 overflow-hidden">
      <Card.Img
        variant="top"
        src={itemImage}
        alt={itemName}
        style={{ height: "180px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column bg-white">
        <Card.Title className="fs-6 text-capitalize mb-2">
          {itemName}
        </Card.Title>

        <div className="text-muted small mb-3">
          Qty:{" "}
          <Badge bg="secondary" className="ms-1 px-2">
            {itemQuantity}
          </Badge>
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-end mb-0">
          {itemQuantity > 1 && (
            <div className="text-muted small">${itemPrice.toFixed(2)} each</div>
          )}

          <Card.Text className="fs-5 fw-bold text-dark mb-0 ms-auto">
            ${(itemPrice * itemQuantity).toFixed(2)}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}
