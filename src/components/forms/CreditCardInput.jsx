import { Card, Row, Col, Form, Button } from "react-bootstrap";

export default function CreditCardInput({ card, index, onChange, onRemove }) {
  // Проверка валидности номера (ровно 16 цифр)
  const isNumberInvalid = card.number.length > 0 && card.number.length !== 16;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "number") {
      // Оставляем только цифры и ограничиваем до 16
      formattedValue = value.replace(/\D/g, "").slice(0, 16);
    }

    if (name === "expirationDate") {
      const digits = value.replace(/\D/g, "");
      const prevValue = card.expirationDate || "";
      if (value.length > prevValue.length) {
        if (digits.length === 2) formattedValue = `${digits}/`;
        else if (digits.length > 2)
          formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
      } else {
        formattedValue = value;
      }
      formattedValue = formattedValue.slice(0, 5);
    }

    if (name === "holder") {
      formattedValue = value.replace(/[0-9]/g, "").toUpperCase();
    }

    onChange(index, { target: { name, value: formattedValue } });
  };

  return (
    <Card className="mb-3 bg-light border-0 rounded-4 shadow-sm">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <strong className="text-secondary small text-uppercase">
            Card Details
          </strong>
          <Button
            variant="link"
            className="text-danger p-0 text-decoration-none small"
            onClick={() => onRemove(index)}
          >
            Remove
          </Button>
        </div>
        <Row className="g-2">
          <Col md={12}>
            <Form.Group className="mb-2">
              <Form.Label className="small text-muted mb-1">
                Card Number
              </Form.Label>
              <Form.Control
                type="text"
                name="number"
                placeholder="16 digits required"
                value={card.number}
                onChange={handleInputChange}
                required
                // Добавляем класс ошибки, если цифр не 16
                isInvalid={isNumberInvalid}
                className="border-0 shadow-none py-2 font-monospace"
                style={{ letterSpacing: "2px" }}
              />
              <Form.Control.Feedback type="invalid">
                Card number must be exactly 16 digits.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          {/* Остальные поля без изменений */}
          <Col md={7}>
            <Form.Group className="mb-1">
              <Form.Label className="small text-muted mb-1">Holder</Form.Label>
              <Form.Control
                type="text"
                name="holder"
                value={card.holder}
                onChange={handleInputChange}
                required
                className="border-0 shadow-none py-2"
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-1">
              <Form.Label className="small text-muted mb-1">Expiry</Form.Label>
              <Form.Control
                type="text"
                name="expirationDate"
                value={card.expirationDate}
                onChange={handleInputChange}
                required
                className="border-0 shadow-none py-2 text-center font-monospace"
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
