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
import { useAuth } from "../../context/AuthContext";
import { API } from "../../api/endpoints";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(API.AUTH.LOGIN, credentials);
      const userData = response.data.userDto || response.data.user;

      if (userData && userData.active === false) {
        toast.error(
          "Your account has been deactivated. Please contact the administrator.",
        );
        return;
      }

      login(response.data.accessToken, response.data.refreshToken);

      toast.success("Welcome back!");
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
              <h2 className="text-center fw-bold mb-4">Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold">
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    className="py-2 border-0 bg-light"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold">
                    Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      className="py-2 border-0 bg-light"
                    />
                    <Button
                      variant="light"
                      onClick={togglePasswordVisibility}
                      type="button"
                      className="border-0 bg-light text-secondary"
                    >
                      {showPassword ? (
                        <BsEyeSlash size={20} />
                      ) : (
                        <BsEye size={20} />
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-3 py-2 fw-bold rounded-3"
                >
                  Log In
                </Button>
              </Form>
              <div className="text-center mt-4 small text-muted">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary fw-bold text-decoration-none"
                >
                  Register
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
