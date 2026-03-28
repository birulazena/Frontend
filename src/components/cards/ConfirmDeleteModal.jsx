import { Modal, Button, Spinner } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

export default function ConfirmDeleteModal({
  show,
  onHide,
  onConfirm,
  isDeleting,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  cancelText = "Cancel",
  confirmText = "Yes, Delete",
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      contentClassName="border-0 rounded-4 shadow-lg"
    >
      <Modal.Body className="p-4 p-md-5 text-center">
        <div
          className="mx-auto mb-4 bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: "84px", height: "84px" }}
        >
          <BsTrash size={38} />
        </div>

        <h3 className="fw-bold mb-3 text-dark">{title}</h3>

        <p
          className="text-muted mb-5 px-sm-2"
          style={{ fontSize: "1.05rem", lineHeight: "1.6" }}
        >
          {message}
        </p>

        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Button
            variant="light"
            size="lg"
            className="fw-bold w-100 rounded-pill border-0"
            onClick={onHide}
            disabled={isDeleting}
            style={{ backgroundColor: "#f1f3f5", color: "#6c757d" }}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            size="lg"
            className="fw-bold w-100 rounded-pill shadow-sm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Removing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
