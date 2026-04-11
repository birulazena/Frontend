import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
  Badge,
} from "react-bootstrap";
import {
  BsShieldLockFill,
  BsCheckCircleFill,
  BsXCircleFill,
  BsPersonBadge,
} from "react-icons/bs";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import CreditCardSelector from "../../components/forms/CreditCardSelector";

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  const [order, setOrder] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);

        const orderResponse = await api.get(API.ORDERS.GET_BY_ID(id));
        const orderData = orderResponse.data;
        const orderOwnerId = orderData.userDto?.id;

        if (orderOwnerId !== user.userId && !isAdmin) {
          setError("You don't have permission to pay for this order.");
          return;
        }

        if (orderData.status !== "CREATED") {
          setError(
            `This order cannot be paid. Current status: ${orderData.status}`,
          );
          return;
        }

        setOrder(orderData);

        const cardsResponse = await api.get(
          API.CARDS.GET_BY_USER_ID(orderOwnerId),
        );
        const cardsData = cardsResponse.data;

        const activeCards = Array.isArray(cardsData)
          ? cardsData.filter((c) => c.active)
          : [];

        setUserCards(activeCards);

        if (activeCards.length > 0) {
          setSelectedCardId(activeCards[0].id);
        }
      } catch (err) {
        console.error("Failed to load checkout data", err);
        setError("Failed to load order or payment details.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchCheckoutData();
    }
  }, [id, user?.userId, isAdmin]);

  const handleAddCard = () => {
    if (isAdmin && order?.userDto?.id) {
      navigate(`/admin/users/${order.userDto.id}`);
      toast.info("You can add a new card from the user's management page.");
    } else {
      navigate("/profile");
      toast.info("You can add a new card in your profile.");
    }
  };

  const handlePayment = async () => {
    if (!selectedCardId) {
      toast.error("Please select a payment method.");
      return;
    }

    const paymentPayload = {
      orderId: order.id,
      paymentAmount: order.totalPrice,
    };

    try {
      setIsProcessing(true);

      const response = await api.post(API.PAYMENTS.CREATE, paymentPayload);
      const resultData = response.data;

      if (
        resultData.status === "SUCCESS" ||
        resultData.status === "COMPLETED"
      ) {
        setPaymentResult("SUCCESS");
      } else {
        setPaymentResult("FAILED");
      }

      setShowResultModal(true);
    } catch (err) {
      console.error("Payment failed", err);
      setPaymentResult("FAILED");
      setShowResultModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="grow" variant="primary" className="mb-3" />
        <h5 className="text-muted fw-light">Preparing secure checkout...</h5>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-5 text-center">
        <div className="bg-light p-5 rounded-4 d-inline-block">
          <h4 className="text-danger mb-4">{error || "Order not found."}</h4>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "1000px" }}>
      <div className="mb-5 border-bottom pb-3 d-flex justify-content-between align-items-end">
        <div>
          <h2 className="fw-bold mb-1">Checkout</h2>
          <p className="text-muted mb-0">Complete the payment securely.</p>
        </div>
        {isAdmin && order.userDto?.id !== user.userId && (
          <Badge
            bg="warning"
            text="dark"
            className="p-2 d-flex align-items-center gap-2 rounded-pill"
          >
            <BsPersonBadge size={16} /> Admin: Paying on behalf of User #
            {order.userDto.id}
          </Badge>
        )}
      </div>

      <Row className="g-5">
        <Col lg={7} xl={8}>
          <CreditCardSelector
            cards={userCards}
            selectedCardId={selectedCardId}
            onSelectCard={setSelectedCardId}
            onAddCard={handleAddCard}
          />
        </Col>

        <Col lg={5} xl={4}>
          <Card
            className="border-0 shadow-sm rounded-4 position-sticky"
            style={{ top: "24px", backgroundColor: "#f8f9fa" }}
          >
            <Card.Body className="p-4 p-xl-5">
              <h5 className="fw-bold mb-4">Summary</h5>

              <div className="d-flex justify-content-between mb-3 text-secondary">
                <span>Order Reference</span>
                <span className="fw-medium text-dark">#{order.id}</span>
              </div>
              <div className="d-flex justify-content-between mb-4 text-secondary">
                <span>Total Items</span>
                <span className="fw-medium text-dark">
                  {order.orderItems?.length || 0}
                </span>
              </div>

              <div className="border-top border-bottom py-3 my-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-dark">Total</span>
                  <span className="fs-3 fw-bold text-primary">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 fw-bold rounded-pill shadow-sm d-flex justify-content-center align-items-center gap-2 mb-3 py-3"
                onClick={handlePayment}
                disabled={!selectedCardId || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" />{" "}
                    Processing...
                  </>
                ) : (
                  "Pay Now"
                )}
              </Button>

              <div
                className="text-center text-muted d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: "0.85rem" }}
              >
                <BsShieldLockFill className="text-success" />
                <span>Encrypted & Secure</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showResultModal}
        centered
        backdrop="static"
        keyboard={false}
        contentClassName="border-0 rounded-4 shadow-lg"
      >
        <Modal.Body className="p-5 text-center">
          {paymentResult === "SUCCESS" ? (
            <>
              <div className="mx-auto mb-4 text-success d-flex justify-content-center align-items-center">
                <BsCheckCircleFill size={80} />
              </div>
              <h3 className="fw-bold mb-3 text-dark">Payment Successful!</h3>
              <p className="text-muted mb-4 fs-5">
                Thank you! Order <strong>#{order.id}</strong> has been
                successfully paid.
              </p>
              <Button
                variant="success"
                size="lg"
                className="w-100 rounded-pill fw-bold shadow-sm"
                onClick={() =>
                  navigate(
                    isAdmin ? `/admin/users/${order.userDto.id}` : "/orders",
                  )
                }
              >
                {isAdmin ? "Back to User Details" : "Back to My Orders"}
              </Button>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 text-danger d-flex justify-content-center align-items-center">
                <BsXCircleFill size={80} />
              </div>
              <h3 className="fw-bold mb-3 text-dark">Payment Failed</h3>
              <p className="text-muted mb-4 fs-5">
                Unfortunately, the transaction could not be completed. Please
                check the card details or try another payment method.
              </p>
              <Button
                variant="outline-danger"
                size="lg"
                className="w-100 rounded-pill fw-bold"
                onClick={() => setShowResultModal(false)}
              >
                Try Again
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
