import { Card, Button, Form, Badge } from "react-bootstrap";
import {
  BsCreditCard,
  BsPlus,
  BsCheckCircleFill,
  BsTrash,
} from "react-icons/bs";

export default function CreditCardSelector({
  cards,
  selectedCardId,
  onSelectCard,
  onAddCard,
  onDeleteCard,
  onToggleStatus,
}) {
  const maskCardNumber = (number) => {
    if (!number || number.length < 16) return number;
    const last4 = number.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  return (
    <div>
      <style>
        {`
          .delete-btn-hover {
            opacity: 0.6;
            transition: all 0.2s ease-in-out;
            color: #dc3545; 
          }
          .delete-btn-hover:hover {
            opacity: 1;
            transform: scale(1.2);
            color: #dc3545 !important;
            filter: drop-shadow(0 2px 4px rgba(220,53,69,0.3));
          }
          .custom-switch .form-check-input {
            cursor: pointer;
            width: 2.5em;
            height: 1.25em;
          }
        `}
      </style>

      <h4 className="mb-4 fw-bold">Payment Methods</h4>

      {cards && cards.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {cards.map((card) => {
            const isActive = card.active;
            const isSelected = selectedCardId === card.id && isActive;

            return (
              <Card
                key={card.id}
                onClick={() => isActive && onSelectCard(card.id)}
                className="transition-all position-relative"
                style={{
                  cursor: isActive ? "pointer" : "default",
                  borderRadius: "16px",
                  width: "100%",
                  maxWidth: "360px",
                  aspectRatio: "1.586 / 1",
                  backgroundColor: isSelected ? "#f0f7ff" : "#ffffff",
                  border: isSelected
                    ? "2px solid #0d6efd"
                    : "1px solid #dee2e6",
                  boxShadow: isSelected
                    ? "0 8px 16px rgba(13, 110, 253, 0.15)"
                    : "0 4px 8px rgba(0,0,0,0.05)",
                  opacity: isActive ? 1 : 0.65,
                  filter: isActive ? "none" : "grayscale(100%)",
                }}
              >
                <Card.Body className="p-4 d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center gap-2">
                      <BsCreditCard
                        size={32}
                        className={
                          isSelected ? "text-primary" : "text-secondary"
                        }
                      />
                      {isSelected && (
                        <BsCheckCircleFill className="text-primary fs-5" />
                      )}

                      {!isActive && (
                        <Badge bg="secondary" className="ms-2">
                          INACTIVE
                        </Badge>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      {onToggleStatus && (
                        <Form.Check
                          type="switch"
                          id={`status-switch-${card.id}`}
                          className="custom-switch m-0 p-0 d-flex align-items-center"
                          checked={isActive}
                          onChange={(e) => {
                            e.stopPropagation();
                            onToggleStatus(card.id, isActive);
                          }}
                          title={isActive ? "Deactivate card" : "Activate card"}
                        />
                      )}

                      {onDeleteCard && (
                        <Button
                          variant="link"
                          className="p-0 m-0 border-0 delete-btn-hover"
                          title="Delete card"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCard(card.id);
                          }}
                        >
                          <BsTrash size={22} />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4
                      className="font-monospace tracking-wide mb-3"
                      style={{ letterSpacing: "2px", color: "#333" }}
                    >
                      {maskCardNumber(card.number)}
                    </h4>
                    <div className="d-flex justify-content-between align-items-end small text-muted">
                      <div className="text-uppercase fw-semibold">
                        {card.holder}
                      </div>
                      <div className="fw-semibold">
                        {card.expirationDate.substring(0, 7)}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}

          <Card
            onClick={onAddCard}
            className="bg-light transition-all mt-2"
            style={{
              cursor: "pointer",
              borderRadius: "16px",
              border: "2px dashed #ced4da",
              width: "100%",
              maxWidth: "360px",
              height: "80px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "#adb5bd")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ced4da")}
          >
            <Card.Body className="d-flex justify-content-center align-items-center text-secondary p-0 gap-2">
              <BsPlus size={28} className="text-primary" />
              <span className="fw-medium text-dark">Add New Card</span>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div
          className="text-center py-5 px-3 bg-white rounded shadow-sm border"
          style={{ borderRadius: "16px", borderColor: "#dee2e6" }}
        >
          <div className="d-inline-block bg-light rounded-circle p-4 mb-4">
            <BsCreditCard size={40} className="text-secondary" />
          </div>
          <h5 className="fw-bold">No saved cards</h5>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "300px" }}>
            Add a payment method to easily complete your future purchases.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="rounded-pill px-5 fw-bold"
            onClick={onAddCard}
          >
            Add Payment Method
          </Button>
        </div>
      )}
    </div>
  );
}
