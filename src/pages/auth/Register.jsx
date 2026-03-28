import { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import CreditCardInput from "../../components/forms/CreditCardInput";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import { toast } from "react-toastify";

export default function Register() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    name: "",
    surname: "",
    birthDate: "",
    email: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cards, setCards] = useState([]);

  const navigate = useNavigate();

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const addCard = () => {
    if (cards.length < 5) {
      setCards([...cards, { number: "", holder: "", expirationDate: "" }]);
    }
  };

  const removeCard = (indexToRemove) => {
    setCards(cards.filter((_, index) => index !== indexToRemove));
  };

  const handleCardChange = (index, e) => {
    const updatedCards = [...cards];
    updatedCards[index][e.target.name] = e.target.value;
    setCards(updatedCards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const isAnyCardInvalid = cards.some((card) => card.number.length !== 16);
    if (isAnyCardInvalid) {
      toast.warning("All card numbers must be exactly 16 digits.");
      return;
    }

    const formattedCards = cards.map((card) => {
      let expDate = card.expirationDate;

      if (expDate && expDate.includes("/")) {
        const [month, year] = expDate.split("/");
        const fullYear = year.length === 2 ? `20${year}` : year;
        expDate = `${fullYear}-${month.padStart(2, "0")}-01`;
      }

      return {
        ...card,
        expirationDate: expDate,
      };
    });

    const finalPayload = {
      ...userData,
      cards: formattedCards,
    };

    try {
      const response = await api.post(API.AUTH.REGISTER, finalPayload);
      if (response.status === 201 || response.status === 200) {
        toast.success("Registration successful! You can now log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center fw-bold mb-4">Create Account</h2>
              <Form onSubmit={handleSubmit}>
                <h5 className="mb-4 text-primary fw-bold">
                  Personal Information
                </h5>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted fw-bold">
                        First Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleUserChange}
                        required
                        className="py-2 border-0 bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted fw-bold">
                        Last Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="surname"
                        value={userData.surname}
                        onChange={handleUserChange}
                        required
                        className="py-2 border-0 bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted fw-bold">
                        Birth Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="birthDate"
                        value={userData.birthDate}
                        onChange={handleUserChange}
                        required
                        className="py-2 border-0 bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted fw-bold">
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleUserChange}
                        required
                        className="py-2 border-0 bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted fw-bold">
                        Username
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleUserChange}
                        required
                        className="py-2 border-0 bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted fw-bold">
                        Password
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={userData.password}
                          onChange={handleUserChange}
                          required
                          className="py-2 border-0 bg-light"
                        />
                        <Button
                          variant="light"
                          type="button"
                          className="border-0 bg-light text-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <BsEyeSlash size={18} />
                          ) : (
                            <BsEye size={18} />
                          )}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small text-muted fw-bold">
                        Confirm Password
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          isInvalid={
                            confirmPassword.length > 0 &&
                            userData.password !== confirmPassword
                          }
                          required
                          className="py-2 border-0 bg-light"
                        />
                        <Button
                          variant="light"
                          type="button"
                          className="border-0 bg-light text-secondary"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <BsEyeSlash size={18} />
                          ) : (
                            <BsEye size={18} />
                          )}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <hr className="my-5 opacity-25" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-primary mb-0 fw-bold">
                    Bank Cards ({cards.length}/5)
                  </h5>
                  {cards.length < 5 && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={addCard}
                      className="rounded-pill px-3"
                    >
                      + Add Card
                    </Button>
                  )}
                </div>
                <Row className="g-3">
                  {cards.map((card, index) => (
                    <Col md={12} key={index}>
                      <CreditCardInput
                        card={card}
                        index={index}
                        onChange={handleCardChange}
                        onRemove={removeCard}
                      />
                    </Col>
                  ))}
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-4 py-3 fw-bold rounded-3 shadow-sm"
                  size="lg"
                >
                  Create Account
                </Button>
              </Form>
              <div className="text-center mt-4 small text-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary fw-bold text-decoration-none"
                >
                  Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
