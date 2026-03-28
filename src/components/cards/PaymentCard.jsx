import { Card, Badge, Row, Col } from "react-bootstrap";
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsClockHistory,
} from "react-icons/bs";

export default function PaymentCard({ payment }) {
  const isSuccess =
    payment.status === "SUCCESS" || payment.status === "COMPLETED";
  const isFailed = payment.status === "FAILED";

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="mb-3 border-0 shadow-sm rounded-4 transition-all custom-hover-card">
      <Card.Body className="p-4">
        <Row className="align-items-center">
          <Col xs="auto" className="pe-2">
            {isSuccess ? (
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle d-flex align-items-center justify-content-center">
                <BsCheckCircleFill size={24} />
              </div>
            ) : isFailed ? (
              <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle d-flex align-items-center justify-content-center">
                <BsXCircleFill size={24} />
              </div>
            ) : (
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle d-flex align-items-center justify-content-center">
                <BsClockHistory size={24} />
              </div>
            )}
          </Col>

          <Col>
            <div className="d-flex justify-content-between align-items-start mb-1">
              <h5 className="fw-bold mb-0 text-dark">
                Order #{payment.orderId}
              </h5>
              <h5 className="fw-bold mb-0 text-primary">
                ${payment.paymentAmount.toFixed(2)}
              </h5>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted small">
                {formatDate(payment.timestamp)}
              </span>
              <Badge
                bg={isSuccess ? "success" : isFailed ? "danger" : "warning"}
                className="px-3 py-2 rounded-pill shadow-sm"
              >
                {payment.status}
              </Badge>
            </div>

            <div className="text-muted mt-2" style={{ fontSize: "0.75rem" }}>
              Transaction ID:{" "}
              <span className="font-monospace">{payment.id}</span>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
