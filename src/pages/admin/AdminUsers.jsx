import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { BsPeopleFill, BsSearch, BsXCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import UserAdminCard from "../../components/cards/UserAdminCard";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = parseInt(searchParams.get("page") || "1", 10) - 1;
  const initialPage = urlPage >= 0 ? urlPage : 0;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 9;

  const [tempFilters, setTempFilters] = useState({ name: "", surname: "" });
  const [activeFilters, setActiveFilters] = useState({ name: "", surname: "" });

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10) - 1;
    if (pageFromUrl >= 0 && pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [searchParams, currentPage]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        size: pageSize,
      };

      if (activeFilters.name) params.name = activeFilters.name;
      if (activeFilters.surname) params.surname = activeFilters.surname;

      const response = await api.get(API.USER.GET_ALL, { params });

      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Could not load users list.");
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeFilters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setSearchParams({ page: 1 });
    setActiveFilters({ ...tempFilters });
  };

  const resetFilters = () => {
    const defaultFilters = { name: "", surname: "" };
    setTempFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    setCurrentPage(0);
    setSearchParams({ page: 1 });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSearchParams({ page: pageNumber + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleManageUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <Container className="py-5" style={{ maxWidth: "1200px" }}>
      <div className="mb-4 d-flex align-items-center gap-3 border-bottom pb-3">
        <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
          <BsPeopleFill size={28} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Users Management</h2>
          <p className="text-muted mb-0">
            View and manage all registered users in the system.
          </p>
        </div>
      </div>

      <Card className="mb-5 border-0 shadow-sm rounded-4 bg-light">
        <Card.Body className="p-4">
          <Form onSubmit={applyFilters}>
            <Row className="g-3 align-items-end">
              <Col md={4} sm={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold mb-1">
                    First Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Search by name..."
                    value={tempFilters.name}
                    onChange={handleFilterChange}
                    className="border-0 shadow-none rounded-3 py-2"
                  />
                </Form.Group>
              </Col>

              <Col md={4} sm={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold mb-1">
                    Surname
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="surname"
                    placeholder="Search by surname..."
                    value={tempFilters.surname}
                    onChange={handleFilterChange}
                    className="border-0 shadow-none rounded-3 py-2"
                  />
                </Form.Group>
              </Col>

              <Col md={4} sm={12} className="d-flex gap-2 mt-4 mt-md-0">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                >
                  <BsSearch /> Search
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={resetFilters}
                  className="px-3 rounded-3"
                >
                  <BsXCircle size={18} />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loading && users.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <h5 className="text-danger">{error}</h5>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border-0 shadow-sm">
          <BsPeopleFill size={50} className="text-secondary mb-3 opacity-50" />
          <h5 className="fw-bold">No users found</h5>
          <p className="text-muted mb-0">
            No users match your current search criteria.
          </p>
        </div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            {users.map((u) => (
              <Col xs={12} lg={6} xl={4} key={u.id}>
                <UserAdminCard user={u} onManageClick={handleManageUser} />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination className="shadow-sm">
                <Pagination.Prev
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx}
                    active={idx === currentPage}
                    onClick={() => handlePageChange(idx)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
