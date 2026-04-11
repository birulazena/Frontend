import { useState } from "react";
import { Card, Button, Spinner, Badge, Form, Row, Col } from "react-bootstrap";
import {
  BsPersonCircle,
  BsEnvelope,
  BsCalendar,
  BsPencilSquare,
  BsPower,
} from "react-icons/bs";

export default function UserProfileCard({
  userData,
  isSaving,
  onSave,
  showAdminControls = false,
  onToggleStatus,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    birthDate: "",
  });

  const handleEditClick = () => {
    setFormData({
      name: userData.name || "",
      surname: userData.surname || "",
      email: userData.email || "",
      birthDate: userData.birthDate || "",
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await onSave(formData);
    setIsEditing(false);
  };

  if (!userData) return null;

  return (
    <Card className="shadow-sm border-0 rounded-4 bg-white">
      <Card.Body className="p-4">
        {isEditing ? (
          <div>
            <h5 className="fw-bold mb-4">Edit Profile</h5>
            <Row className="g-3 mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">
                    First Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-light border-0"
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">
                    Surname
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="bg-light border-0"
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-light border-0"
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">
                    Date of Birth
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="bg-light border-0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Button
                variant="light"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div className="d-flex align-items-center gap-3">
                <BsPersonCircle size={50} className="text-primary opacity-75" />
                <div>
                  <h4 className="fw-bold mb-0">
                    {userData.name} {userData.surname}
                  </h4>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <Badge bg={userData.active ? "success" : "secondary"}>
                      {userData.active ? "Active Account" : "Inactive Account"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="light"
                size="sm"
                className="text-primary rounded-circle p-2 shadow-sm"
                onClick={handleEditClick}
                title="Edit Profile"
              >
                <BsPencilSquare size={18} />
              </Button>
            </div>

            <div className="p-3 bg-light rounded-3 mb-4">
              <div className="mb-3 d-flex align-items-center text-secondary">
                <BsEnvelope className="me-3 fs-5" />
                <div>
                  <div
                    className="small text-muted fw-bold mb-1"
                    style={{ fontSize: "0.75rem" }}
                  >
                    EMAIL
                  </div>
                  <div className="fw-medium text-dark">{userData.email}</div>
                </div>
              </div>
              <div className="d-flex align-items-center text-secondary">
                <BsCalendar className="me-3 fs-5" />
                <div>
                  <div
                    className="small text-muted fw-bold mb-1"
                    style={{ fontSize: "0.75rem" }}
                  >
                    DATE OF BIRTH
                  </div>
                  <div className="fw-medium text-dark">
                    {userData.birthDate || "Not provided"}
                  </div>
                </div>
              </div>
            </div>

            {showAdminControls && onToggleStatus && (
              <div className="pt-3 border-top">
                <Button
                  variant={
                    userData.active ? "outline-danger" : "outline-success"
                  }
                  className="w-100 fw-bold d-flex align-items-center justify-content-center py-2 border-0 bg-opacity-10"
                  style={{
                    backgroundColor: userData.active ? "#f8d7da" : "#d1e7dd",
                  }}
                  onClick={onToggleStatus}
                >
                  <BsPower className="me-2" />
                  {userData.active
                    ? "Deactivate User Account"
                    : "Activate User Account"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
