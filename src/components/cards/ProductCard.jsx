import { Card, Button, Badge } from "react-bootstrap";
import { BsPencil, BsTrash, BsCartPlus, BsCartCheck } from "react-icons/bs";
import defaultImage from "../../assets/ItemImg.jpg";

export default function ProductCard({
  item,
  isAdmin,
  onEdit,
  onDelete,
  onToggleCart,
  isInCart,
}) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={defaultImage}
        alt={item.name}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-capitalize">{item.name}</Card.Title>
        <Card.Text className="text-muted fs-5 fw-bold mb-4">
          ${item.price.toFixed(2)}
        </Card.Text>

        <div className="mt-auto d-flex gap-2">
          <Button
            variant={isInCart ? "success" : "primary"}
            className="w-100 position-relative"
            onClick={() => onToggleCart(item)}
          >
            {isInCart ? (
              <>
                <BsCartCheck className="me-2" />
                In Cart
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  1
                </Badge>
              </>
            ) : (
              <>
                <BsCartPlus className="me-2" />
                Buy
              </>
            )}
          </Button>

          {isAdmin && (
            <>
              <Button variant="outline-warning" onClick={() => onEdit(item)}>
                <BsPencil />
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => onDelete(item.id)}
              >
                <BsTrash />
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
