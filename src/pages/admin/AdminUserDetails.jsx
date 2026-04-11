import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import { BsArrowLeft, BsBoxSeam, BsCreditCard, BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import CreditCardSelector from "../../components/forms/CreditCardSelector";
import CreditCardInput from "../../components/forms/CreditCardInput";
import OrderCard from "../../components/cards/OrderCard";
import UserProfileCard from "../../components/cards/UserProfileCard";

export default function AdminUserDetails() {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isSavingUser, setIsSavingUser] = useState(false);

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    holder: "",
    expirationDate: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isDeletingCard, setIsDeletingCard] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);

      const [userRes, ordersRes] = await Promise.all([
        api.get(API.USER.GET_BY_ID(targetUserId)),
        api.get(API.ORDERS.GET_BY_USER_ID(targetUserId)),
      ]);

      setUser(userRes.data);
      setOrders(ordersRes.data.orders || []);

      const activeCard = userRes.data.cards?.find((c) => c.active);

      setSelectedCardId((prevId) => {
        if (userRes.data.cards?.find((c) => c.id === prevId && c.active)) {
          return prevId;
        }
        return activeCard ? activeCard.id : null;
      });

      setError(null);
    } catch (err) {
      console.error("Failed to load user details", err);
      setError("User not found or you don't have permission.");
      toast.error("Failed to load user details.");
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSaveUser = async (updatedFormData) => {
    try {
      setIsSavingUser(true);
      await api.patch(API.USER.UPDATE(targetUserId), updatedFormData);
      toast.success("User data updated successfully!");
      await fetchUserData();
    } catch (err) {
      console.error("Failed to update user", err);
      toast.error(err.response?.data?.message || "Failed to update user data.");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleToggleUserStatus = async () => {
    try {
      if (user.active) {
        await api.patch(API.USER.DEACTIVATE(targetUserId));
        toast.info("User account deactivated.");
      } else {
        await api.patch(API.USER.ACTIVATE(targetUserId));
        toast.success("User account activated.");
      }

      setUser((prev) => ({ ...prev, active: !prev.active }));
    } catch (err) {
      console.error("Failed to toggle user status", err);
      toast.error(
        err.response?.data?.message || "Could not change user status.",
      );
    }
  };

  const handleNewCardChange = (index, e) => {
    const { name, value } = e.target;
    const formattedValue = name === "holder" ? value.toUpperCase() : value;
    setNewCard((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleCancelAddCard = () => {
    setIsAddingCard(false);
    setNewCard({ number: "", holder: "", expirationDate: "" });
  };

  const handleSaveNewCard = async () => {
    if (newCard.number.length !== 16) {
      toast.warning("Card number must be exactly 16 digits.");
      return;
    }

    if (!newCard.holder || !newCard.expirationDate) {
      toast.warning("Please fill in all card details.");
      return;
    }

    try {
      setIsSavingCard(true);
      let formattedDate = newCard.expirationDate;
      if (formattedDate.includes("/")) {
        const [month, year] = formattedDate.split("/");
        const fullYear =
          year.trim().length === 2 ? `20${year.trim()}` : year.trim();
        const paddedMonth = month.trim().padStart(2, "0");
        formattedDate = `${fullYear}-${paddedMonth}-01`;
      }

      const payload = {
        number: newCard.number.replace(/\s/g, ""),
        holder: newCard.holder,
        expirationDate: formattedDate,
      };

      await api.post(API.CARDS.CREATE(targetUserId), payload);
      toast.success("Card added successfully!");
      setIsAddingCard(false);
      setNewCard({ number: "", holder: "", expirationDate: "" });

      const cardsResponse = await api.get(
        API.CARDS.GET_BY_USER_ID(targetUserId),
      );
      setUser((prevUser) => ({
        ...prevUser,
        cards: cardsResponse.data || [],
      }));
    } catch (err) {
      console.error("Failed to save card", err);
      toast.error(err.response?.data?.message || "Failed to add card.");
    } finally {
      setIsSavingCard(false);
    }
  };

  const handleToggleCardStatus = async (cardId, isCurrentlyActive) => {
    try {
      if (isCurrentlyActive) {
        await api.patch(API.CARDS.DEACTIVATE(cardId));
        toast.info("Card deactivated.");
        if (selectedCardId === cardId) setSelectedCardId(null);
      } else {
        await api.patch(API.CARDS.ACTIVATE(cardId));
        toast.success("Card activated.");
      }

      setUser((prevUser) => ({
        ...prevUser,
        cards: prevUser.cards.map((card) =>
          card.id === cardId ? { ...card, active: !isCurrentlyActive } : card,
        ),
      }));
    } catch (err) {
      console.error("Failed to toggle card status", err);
      toast.error("Could not change card status.");
    }
  };

  const initiateDeleteCard = (cardId) => {
    setCardToDelete(cardId);
    setShowDeleteModal(true);
  };

  const cancelDeleteCard = () => {
    setShowDeleteModal(false);
    setCardToDelete(null);
  };

  const confirmDeleteCard = async () => {
    if (!cardToDelete) return;
    try {
      setIsDeletingCard(true);
      await api.delete(API.CARDS.DELETE(cardToDelete));
      toast.success("Card removed successfully!");
      if (selectedCardId === cardToDelete) setSelectedCardId(null);

      setUser((prevUser) => ({
        ...prevUser,
        cards: prevUser.cards.filter((card) => card.id !== cardToDelete),
      }));
    } catch (err) {
      console.error("Failed to delete card", err);
      toast.error("Failed to delete the card.");
    } finally {
      setIsDeletingCard(false);
      setShowDeleteModal(false);
      setCardToDelete(null);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading user profile...</p>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container className="py-5 text-center">
        <h4 className="text-danger mb-4">{error}</h4>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/admin/users")}
        >
          <BsArrowLeft className="me-2" /> Back to Users List
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "1200px" }}>
      <Button
        variant="link"
        className="text-decoration-none text-secondary p-0 mb-4 d-inline-flex align-items-center custom-hover-link"
        onClick={() => navigate("/admin/users")}
      >
        <BsArrowLeft className="me-2" /> Back to Users List
      </Button>

      <div className="mb-4 border-bottom pb-3">
        <h2 className="fw-bold mb-0">Manage User #{user.id}</h2>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <UserProfileCard
            userData={user}
            isSaving={isSavingUser}
            onSave={handleSaveUser}
            showAdminControls={true}
            onToggleStatus={handleToggleUserStatus}
          />
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-4 mb-4 bg-white">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-3">
                <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                  <BsCreditCard size={20} />
                </div>
                <h5 className="fw-bold mb-0">Payment Methods</h5>
              </div>

              {isAddingCard ? (
                <div>
                  <h6 className="fw-bold mb-3">Add New Payment Method</h6>
                  <CreditCardInput
                    card={newCard}
                    index={0}
                    onChange={handleNewCardChange}
                    onRemove={handleCancelAddCard}
                  />
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button
                      variant="secondary"
                      onClick={handleCancelAddCard}
                      disabled={isSavingCard}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="success"
                      onClick={handleSaveNewCard}
                      disabled={isSavingCard || newCard.number.length !== 16}
                    >
                      {isSavingCard ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Saving...
                        </>
                      ) : (
                        "Save Card"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <CreditCardSelector
                  cards={user.cards || []}
                  selectedCardId={selectedCardId}
                  onSelectCard={setSelectedCardId}
                  onAddCard={() => setIsAddingCard(true)}
                  onDeleteCard={initiateDeleteCard}
                  onToggleStatus={handleToggleCardStatus}
                />
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0 rounded-4 bg-white">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-3">
                <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                  <BsBoxSeam size={20} />
                </div>
                <h5 className="fw-bold mb-0">Order History</h5>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 border-0 shadow-sm mt-3">
                  <BsBoxSeam
                    size={50}
                    className="text-secondary mb-3 opacity-50"
                  />
                  <h5 className="fw-bold">No orders found</h5>
                  <p className="text-muted mb-0">
                    This user hasn't placed any orders yet.
                  </p>
                </div>
              ) : (
                <Row className="g-3">
                  {orders.map((order) => (
                    <Col md={6} key={order.id}>
                      <OrderCard order={order} />
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showDeleteModal}
        onHide={cancelDeleteCard}
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
          <h3 className="fw-bold mb-3 text-dark">Remove Card?</h3>
          <p
            className="text-muted mb-5 px-sm-2"
            style={{ fontSize: "1.05rem", lineHeight: "1.6" }}
          >
            Are you sure you want to delete this payment method for the user?
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Button
              variant="light"
              size="lg"
              className="fw-bold w-100 rounded-pill border-0"
              onClick={cancelDeleteCard}
              disabled={isDeletingCard}
              style={{ backgroundColor: "#f1f3f5", color: "#6c757d" }}
            >
              Keep Card
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="fw-bold w-100 rounded-pill shadow-sm"
              onClick={confirmDeleteCard}
              disabled={isDeletingCard}
            >
              {isDeletingCard ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />{" "}
                  Removing...
                </>
              ) : (
                "Yes, Remove It"
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
