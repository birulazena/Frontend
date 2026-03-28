import { Card, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { BsCalendarWeek, BsCurrencyDollar } from "react-icons/bs";

export default function UserStatsCard({
  isAdmin,
  filters,
  totalSum,
  loading,
  onFilterChange,
  onSubmit,
}) {
  return (
    <Card className="mb-4 border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <Card.Body className="p-0">
        <Row className="g-0 align-items-stretch">
          <Col lg={8} className="p-4 p-md-5">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
              <BsCalendarWeek className="text-primary" /> User Spending Summary
            </h5>
            <Form onSubmit={onSubmit}>
              <Row className="g-3 align-items-end">
                <Col sm={isAdmin ? 4 : 6}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold mb-1">
                      From
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="fromDate"
                      value={filters.fromDate}
                      onChange={onFilterChange}
                      required
                      className="border-0 bg-light rounded-3 py-2 text-muted"
                      style={{ fontSize: "0.9rem" }}
                    />
                  </Form.Group>
                </Col>
                <Col sm={isAdmin ? 4 : 6}>
                  <Form.Group>
                    <Form.Label className="small text-muted fw-bold mb-1">
                      To
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="toDate"
                      value={filters.toDate}
                      onChange={onFilterChange}
                      required
                      className="border-0 bg-light rounded-3 py-2 text-muted"
                      style={{ fontSize: "0.9rem" }}
                    />
                  </Form.Group>
                </Col>

                {isAdmin && (
                  <Col sm={4}>
                    <Form.Group>
                      <Form.Label className="small text-danger fw-bold mb-1">
                        User ID (Admin)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        inputMode="numeric"
                        name="userId"
                        placeholder="User ID"
                        value={filters.userId}
                        onChange={onFilterChange}
                        className="border-0 bg-light rounded-3 py-2"
                      />
                    </Form.Group>
                  </Col>
                )}

                <Col sm={12} className="mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="fw-bold rounded-pill px-4"
                  >
                    {loading ? (
                      <Spinner size="sm" className="me-2" />
                    ) : (
                      "Update User Stats"
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col
            lg={4}
            className="p-4 d-flex flex-column justify-content-center align-items-center text-white"
            style={{ background: "linear-gradient(135deg, #0d6efd, #0b5ed7)" }}
          >
            <p
              className="mb-1 text-white-50 fw-medium text-uppercase tracking-wide"
              style={{ letterSpacing: "1px", fontSize: "0.8rem" }}
            >
              User Spent
            </p>
            <h2 className="fw-bold mb-0 d-flex align-items-center fs-2">
              {loading ? (
                <Spinner animation="border" variant="light" size="sm" />
              ) : (
                <>
                  <BsCurrencyDollar className="opacity-75 me-1" size={28} />
                  {Number(totalSum).toFixed(2)}
                </>
              )}
            </h2>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
