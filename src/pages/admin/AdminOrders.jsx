import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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
import { BsBoxSeam, BsSearch, BsXCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import OrderCard from "../../components/cards/OrderCard";

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10) - 1;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  const [tempFilters, setTempFilters] = useState({
    status: searchParams.get("status") || "",
    startTime: searchParams.get("startTime") || "",
    endTime: searchParams.get("endTime") || "",
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setOrders([]);

      const params = {
        page: currentPage,
        size: pageSize,
      };

      const status = searchParams.get("status");
      const start = searchParams.get("startTime");
      const end = searchParams.get("endTime");

      if (status) params.status = status;
      if (start) params.startTime = `${start}T00:00:00`;
      if (end) params.endTime = `${end}T23:59:59`;

      const response = await api.get(API.ORDERS.GET_ALL, { params });
      const data = response.data;

      if (data && Array.isArray(data.content)) {
        setOrders(data.content);
        setTotalPages(data.totalPages || 0);
      } else {
        setOrders(Array.isArray(data) ? data : []);
        setTotalPages(1);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load orders", err);
      setError("Could not load orders list.");
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    newParams.set("page", "1");
    if (tempFilters.status) newParams.set("status", tempFilters.status);
    if (tempFilters.startTime)
      newParams.set("startTime", tempFilters.startTime);
    if (tempFilters.endTime) newParams.set("endTime", tempFilters.endTime);
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setTempFilters({ status: "", startTime: "", endTime: "" });
    setSearchParams({ page: 1 });
  };

  const handlePageChange = (pageNumber) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNumber + 1);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container className="py-5" style={{ maxWidth: "1200px" }}>
      <div className="mb-4 d-flex align-items-center gap-3 border-bottom pb-3">
        <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
          <BsBoxSeam size={28} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Global Orders</h2>
          <p className="text-muted mb-0">Manage all customer orders.</p>
        </div>
      </div>

      <Card className="mb-5 border-0 shadow-sm rounded-4 bg-light">
        <Card.Body className="p-4">
          <Form onSubmit={applyFilters}>
            <Row className="g-3 align-items-end">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold mb-1">
                    Status
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={tempFilters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Statuses</option>
                    <option value="CREATED">CREATED</option>
                    <option value="PAID">PAID</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold mb-1">
                    Start Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="startTime"
                    value={tempFilters.startTime}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold mb-1">
                    End Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="endTime"
                    value={tempFilters.endTime}
                    onChange={handleFilterChange}
                    min={tempFilters.startTime}
                  />
                </Form.Group>
              </Col>
              <Col lg={3} md={6} className="d-flex gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-bold"
                >
                  <BsSearch /> Filter
                </Button>
                <Button variant="outline-secondary" onClick={resetFilters}>
                  <BsXCircle />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-3">Fetching page {currentPage + 1}...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-danger">
          <h5>{error}</h5>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <h5>No orders found</h5>
        </div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            {orders.map((order) => (
              <Col xs={12} lg={6} xl={4} key={order.id}>
                <OrderCard order={order} />
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
