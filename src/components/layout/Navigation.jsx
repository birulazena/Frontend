import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="mb-4 shadow-sm"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/home"
          className="d-flex align-items-center gap-2"
        >
          MyStore
          {isAdmin && (
            <Badge
              bg="danger"
              style={{ fontSize: "0.6rem", verticalAlign: "middle" }}
            >
              ADMIN
            </Badge>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>
            <Nav.Link as={Link} to="/cart">
              Cart
            </Nav.Link>
            <Nav.Link as={Link} to="/orders">
              My Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/payments">
              My Payments
            </Nav.Link>

            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>

            {isAdmin && (
              <>
                <div className="vr bg-secondary mx-2 d-none d-lg-block"></div>
                <Nav.Link as={Link} to="/admin/users" className="text-info">
                  Users
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/orders" className="text-info">
                  All Orders
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="align-items-center">
            <Button variant="outline-light" onClick={handleLogout} size="sm">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
