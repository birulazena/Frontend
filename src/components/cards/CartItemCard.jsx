import { Card, Button, Form } from "react-bootstrap";
import { BsTrash, BsPlus, BsDash } from "react-icons/bs";
import itemImage from "../../assets/ItemImg.jpg";

export default function CartItemCard({
  item,
  isSelected,
  onToggleSelect,
  onChangeQuantity,
  onRemove,
}) {
  return (
    <Card className="mb-3 shadow-sm border-0">
      <Card.Body className="d-flex flex-column flex-sm-row align-items-center gap-3 p-3">
        <Form.Check
          type="checkbox"
          className="fs-4"
          checked={isSelected}
          onChange={() => onToggleSelect(item.id)}
          style={{ cursor: "pointer" }}
        />

        <img
          src={itemImage}
          alt={item.name}
          style={{
            width: "90px",
            height: "90px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          className="flex-shrink-0"
        />

        <div className="flex-grow-1 text-center text-sm-start">
          <h5 className="mb-1 text-capitalize">{item.name}</h5>
          <div className="text-muted small">
            ${item.price.toFixed(2)} / unit
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center bg-light rounded px-2 py-1">
          <Button
            variant="link"
            className="text-dark p-1 text-decoration-none"
            onClick={() => onChangeQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <BsDash size={20} />
          </Button>
          <span
            className="mx-2 fw-bold"
            style={{ minWidth: "20px", textAlign: "center" }}
          >
            {item.quantity}
          </span>
          <Button
            variant="link"
            className="text-dark p-1 text-decoration-none"
            onClick={() => onChangeQuantity(item.id, 1)}
          >
            <BsPlus size={20} />
          </Button>
        </div>

        <div
          className="text-end d-flex flex-column align-items-end"
          style={{ minWidth: "100px" }}
        >
          <div className="fs-5 fw-bold mb-2 text-primary">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
          <Button
            variant="link"
            className="text-danger p-0 text-decoration-none small"
            onClick={() => onRemove(item.id)}
          >
            <BsTrash className="me-1" /> Remove
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
