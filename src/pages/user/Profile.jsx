import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import CreditCardInput from "../../components/forms/CreditCardInput";
import CreditCardSelector from "../../components/forms/CreditCardSelector";
import UserProfileCard from "../../components/cards/UserProfileCard";
import ConfirmDeleteModal from "../../components/cards/ConfirmDeleteModal";

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    holder: "",
    expirationDate: "",
  });
  const [selectedCardId, setSelectedCardId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isDeletingCard, setIsDeletingCard] = useState(false);

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const response = await api.get(API.USER.GET_BY_ID(user.userId));
      setUserData(response.data);

      const allCards = response.data.cards || [];
      const firstActiveCard = allCards.find((c) => c.active);

      if (
        !allCards.find((c) => c.id === selectedCardId && c.active) &&
        firstActiveCard
      ) {
        setSelectedCardId(firstActiveCard.id);
      } else if (!firstActiveCard) {
        setSelectedCardId(null);
      }
    } catch (err) {
      console.error(err);
      setError("Could not load profile data.");
    }
  }, [user?.userId, selectedCardId]);

  useEffect(() => {
    if (user?.userId) {
      setLoading(true);
      loadUserData().finally(() => setLoading(false));
    }
  }, [user?.userId, loadUserData]);

  const handleSaveProfile = async (updatedFormData) => {
    try {
      setIsSavingProfile(true);
      await api.patch(API.USER.UPDATE(user.userId), updatedFormData);
      toast.success("Profile updated successfully!");
      await loadUserData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
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

      await api.post(API.CARDS.CREATE(user.userId), payload);
      toast.success("Card added successfully!");
      setIsAddingCard(false);
      setNewCard({ number: "", holder: "", expirationDate: "" });
      await loadUserData();
    } catch (err) {
      console.error(err);
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
      await loadUserData();
    } catch (err) {
      console.error(err);
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
      await loadUserData();
    } catch (err) {
      console.error(err);
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
        <p className="mt-3 text-muted">Loading profile...</p>
      </Container>
    );
  }

  if (error || !userData) {
    return (
      <Container className="py-5 text-center">
        <h4 className="text-danger">{error}</h4>
      </Container>
    );
  }

  const allCards = userData.cards || [];

  return (
    <Container className="py-5" style={{ maxWidth: "1000px" }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">My Profile</h2>
        <p className="text-muted">
          Manage your personal information and payment methods.
        </p>
      </div>

      <Row className="g-4">
        <Col lg={5}>
          <UserProfileCard
            userData={userData}
            isSaving={isSavingProfile}
            onSave={handleSaveProfile}
            showAdminControls={false}
          />
        </Col>

        <Col lg={7}>
          <Card className="shadow-sm border-0 rounded-4 h-100 bg-white">
            <Card.Body className="p-4">
              {isAddingCard ? (
                <div>
                  <h5 className="fw-bold mb-4">Add New Payment Method</h5>
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
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                      ) : (
                        "Save Card"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <CreditCardSelector
                  cards={allCards}
                  selectedCardId={selectedCardId}
                  onSelectCard={setSelectedCardId}
                  onAddCard={() => setIsAddingCard(true)}
                  onDeleteCard={initiateDeleteCard}
                  onToggleStatus={handleToggleCardStatus}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={cancelDeleteCard}
        onConfirm={confirmDeleteCard}
        isDeleting={isDeletingCard}
        title="Remove Card?"
        message="Are you sure you want to delete this payment method? You will need to add it again if you want to use it for future purchases."
        cancelText="Keep Card"
        confirmText="Yes, Remove It"
      />
    </Container>
  );
}
