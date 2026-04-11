import { Card, Button, Badge, Stack } from "react-bootstrap";
import {
  BsPersonCircle,
  BsEnvelope,
  BsCalendar,
  BsClockHistory,
} from "react-icons/bs";

export default function UserAdminCard({ user, onManageClick }) {
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden admin-user-card">
      <div
        className="position-absolute top-0 start-0 end-0"
        style={{
          height: "4px",
          backgroundColor: user.active ? "#198754" : "#6c757d",
          zIndex: 10,
        }}
      />

      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="p-1 bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
              <BsPersonCircle size={38} className="text-primary" />
            </div>
            <div>
              <h5
                className="fw-bold mb-0 text-dark text-truncate"
                style={{ maxWidth: "150px" }}
              >
                {user.name} {user.surname}
              </h5>
              <small className="text-muted font-monospace opacity-75">
                #{user.id}
              </small>
            </div>
          </div>
          <Badge
            bg={user.active ? "success" : "secondary"}
            className="rounded-pill px-3 py-2 fw-semibold"
            style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
          >
            {user.active ? "ACTIVE" : "INACTIVE"}
          </Badge>
        </div>

        <div className="bg-light rounded-4 p-3 mb-4 flex-grow-1 border border-white">
          <Stack gap={3}>
            <div className="d-flex align-items-center">
              <BsEnvelope size={16} className="text-primary opacity-50 me-3" />
              <div className="text-truncate small fw-medium text-dark">
                {user.email}
              </div>
            </div>

            <div className="d-flex align-items-center">
              <BsCalendar size={16} className="text-primary opacity-50 me-3" />
              <div className="small fw-medium text-dark">
                <span className="text-muted me-1">Born:</span>{" "}
                {formatDate(user.birthDate)}
              </div>
            </div>

            <div className="d-flex align-items-center">
              <BsClockHistory
                size={16}
                className="text-primary opacity-50 me-3"
              />
              <div className="small fw-medium text-dark">
                <span className="text-muted me-1">Joined:</span>{" "}
                {formatDate(user.createdAt)}
              </div>
            </div>
          </Stack>
        </div>

        <Button
          variant="primary"
          className="w-100 fw-bold rounded-3 py-2 shadow-sm border-0"
          onClick={() => onManageClick(user.id)}
        >
          Manage User
        </Button>
      </Card.Body>

      <style>
        {`
          .admin-user-card {
            border: 1px solid transparent !important;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .admin-user-card:hover {
            border-color: rgba(13, 110, 253, 0.25) !important;
            box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08) !important;
          }
          .admin-user-card .btn-primary {
             background-color: #0d6efd;
             transition: background-color 0.2s ease;
          }
          .admin-user-card .btn-primary:hover {
             background-color: #0b5ed7;
          }
        `}
      </style>
    </Card>
  );
}
