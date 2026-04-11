import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Spinner,
  Pagination,
  Row,
  Col,
  Card,
  Form,
  Button,
  Collapse,
} from "react-bootstrap";
import { BsReceipt, BsFilter, BsXCircle, BsBarChartLine } from "react-icons/bs";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import PaymentCard from "../../components/cards/PaymentCard";
import UserStatsCard from "../../components/cards/UserStatsCard";
import GlobalStatsCard from "../../components/cards/GlobalStatsCard";

export default function Payments() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = parseInt(searchParams.get("page") || "1", 10) - 1;
  const initialPage = urlPage >= 0 ? urlPage : 0;

  const getTodayDateTime = () => {
    const d = new Date();
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const getLastMonthDateTime = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [showStatsToggle, setShowStatsToggle] = useState(true);
  const [totalSum, setTotalSum] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsFilters, setStatsFilters] = useState({
    fromDate: getLastMonthDateTime(),
    toDate: getTodayDateTime(),
    userId: user?.userId || "",
  });

  const [globalTotalSum, setGlobalTotalSum] = useState(0);
  const [loadingGlobalStats, setLoadingGlobalStats] = useState(false);
  const [globalStatsFilters, setGlobalStatsFilters] = useState({
    fromDate: getLastMonthDateTime(),
    toDate: getTodayDateTime(),
  });

  const [payments, setPayments] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const [showFilters, setShowFilters] = useState(false);
  const [tempListFilters, setTempListFilters] = useState({
    orderId: "",
    status: "",
    userId: user?.userId || "",
  });
  const [activeListFilters, setActiveListFilters] = useState({
    orderId: "",
    status: "",
    userId: user?.userId || "",
  });

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10) - 1;
    if (pageFromUrl >= 0 && pageFromUrl !== currentPage)
      setCurrentPage(pageFromUrl);
  }, [searchParams, currentPage]);

  const fetchStats = useCallback(
    async (currentFilters) => {
      if (
        !currentFilters.fromDate ||
        !currentFilters.toDate ||
        currentFilters.fromDate > currentFilters.toDate
      )
        return;
      try {
        setLoadingStats(true);
        const targetUserId = currentFilters.userId || user.userId;
        const params = {
          from: `${currentFilters.fromDate}:00Z`,
          to: `${currentFilters.toDate}:00Z`,
        };
        const response = await api.get(
          API.PAYMENTS.GET_USER_TOTAL_SUM(targetUserId),
          { params },
        );
        setTotalSum(response.data?.totalSum || 0);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user spending statistics.");
      } finally {
        setLoadingStats(false);
      }
    },
    [user?.userId],
  );

  const fetchGlobalStats = useCallback(
    async (currentFilters) => {
      if (
        !isAdmin ||
        !currentFilters.fromDate ||
        !currentFilters.toDate ||
        currentFilters.fromDate > currentFilters.toDate
      )
        return;
      try {
        setLoadingGlobalStats(true);
        const params = {
          from: `${currentFilters.fromDate}:00Z`,
          to: `${currentFilters.toDate}:00Z`,
        };
        const response = await api.get(API.PAYMENTS.GET_GLOBAL_TOTAL_SUM, {
          params,
        });
        setGlobalTotalSum(
          typeof response.data === "number"
            ? response.data
            : response.data?.totalSum || 0,
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load global system statistics.");
      } finally {
        setLoadingGlobalStats(false);
      }
    },
    [isAdmin],
  );

  const fetchPaymentsList = useCallback(async () => {
    try {
      setLoadingList(true);
      const params = {
        userId: activeListFilters.userId || user.userId,
        page: currentPage,
        size: pageSize,
      };
      if (activeListFilters.orderId) params.orderId = activeListFilters.orderId;
      if (activeListFilters.status) params.status = activeListFilters.status;

      const response = await api.get(API.PAYMENTS.GET_ALL_BY_FILTER, {
        params,
      });
      setPayments(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setErrorList(null);
    } catch {
      setErrorList("Could not load payment history.");
    } finally {
      setLoadingList(false);
    }
  }, [currentPage, activeListFilters, user?.userId]);

  useEffect(() => {
    if (user?.userId) {
      fetchStats(statsFilters);
      if (isAdmin) fetchGlobalStats(globalStatsFilters);
      fetchPaymentsList();
    }
  }, [
    user?.userId,
    fetchPaymentsList,
    fetchStats,
    fetchGlobalStats,
    isAdmin,
    globalStatsFilters,
    statsFilters,
  ]);

  const applyStatsFilters = (e) => {
    e.preventDefault();
    fetchStats(statsFilters);
  };
  const applyGlobalStatsFilters = (e) => {
    e.preventDefault();
    fetchGlobalStats(globalStatsFilters);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSearchParams({ page: pageNumber + 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyListFilters = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setSearchParams({ page: 1 });
    setActiveListFilters({ ...tempListFilters });
  };

  const resetListFilters = () => {
    const defaultFilters = { orderId: "", status: "", userId: user.userId };
    setTempListFilters(defaultFilters);
    setActiveListFilters(defaultFilters);
    setCurrentPage(0);
    setSearchParams({ page: 1 });
  };

  if (loadingList && payments.length === 0 && !errorList) {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center py-5"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h5 className="text-muted fw-light">Loading payment data...</h5>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      <div className="mb-4 d-flex align-items-center gap-3 border-bottom pb-3">
        <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-none d-sm-flex">
          <BsReceipt size={28} />
        </div>
        <div>
          <h2 className="fw-bold mb-0">My Payments</h2>
          <p className="text-muted mb-0 d-none d-sm-block">
            View your transaction history and spending statistics.
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-end mb-3">
        <h4 className="fw-bold mb-0 text-secondary">Statistics</h4>
        <Button
          variant={showStatsToggle ? "primary" : "outline-primary"}
          size="sm"
          className="rounded-pill px-3 fw-medium d-flex align-items-center gap-2"
          onClick={() => setShowStatsToggle(!showStatsToggle)}
        >
          <BsBarChartLine size={18} />
          {showStatsToggle ? "Hide Stats" : "Show Stats"}
        </Button>
      </div>

      <Collapse in={showStatsToggle}>
        <div>
          <UserStatsCard
            isAdmin={isAdmin}
            filters={statsFilters}
            totalSum={totalSum}
            loading={loadingStats}
            onFilterChange={(e) => {
              if (
                e.target.name === "userId" &&
                e.target.value !== "" &&
                !/^\d+$/.test(e.target.value)
              )
                return;
              setStatsFilters((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }));
            }}
            onSubmit={applyStatsFilters}
          />

          {isAdmin && (
            <GlobalStatsCard
              filters={globalStatsFilters}
              totalSum={globalTotalSum}
              loading={loadingGlobalStats}
              onFilterChange={(e) =>
                setGlobalStatsFilters((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              onSubmit={applyGlobalStatsFilters}
            />
          )}
        </div>
      </Collapse>

      <div className="d-flex justify-content-between align-items-end mb-4 mt-5">
        <h4 className="fw-bold mb-0 text-secondary">Transaction History</h4>
        <Button
          variant={showFilters ? "primary" : "outline-primary"}
          size="sm"
          className="rounded-pill px-3 fw-medium d-flex align-items-center gap-2 transition-all"
          onClick={() => setShowFilters(!showFilters)}
        >
          <BsFilter size={18} />
          {showFilters ? "Close Filters" : "Filters"}
        </Button>
      </div>

      <Collapse in={showFilters}>
        <div>
          <Card className="mb-4 border-0 shadow-sm rounded-4 bg-light">
            <Card.Body className="p-4">
              <Form onSubmit={applyListFilters}>
                <Row className="g-3 align-items-end">
                  <Col md={isAdmin ? 3 : 6} sm={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold mb-1">
                        Order ID
                      </Form.Label>
                      <Form.Control
                        type="text"
                        inputMode="numeric"
                        name="orderId"
                        placeholder="e.g. 123"
                        value={tempListFilters.orderId}
                        onChange={(e) => {
                          if (
                            e.target.value !== "" &&
                            !/^\d+$/.test(e.target.value)
                          )
                            return;
                          setTempListFilters((p) => ({
                            ...p,
                            orderId: e.target.value,
                          }));
                        }}
                        className="border-0 shadow-none rounded-3 py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={isAdmin ? 3 : 6} sm={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold mb-1">
                        Status
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={tempListFilters.status}
                        onChange={(e) =>
                          setTempListFilters((p) => ({
                            ...p,
                            status: e.target.value,
                          }))
                        }
                        className="border-0 shadow-none rounded-3 py-2"
                      >
                        <option value="">All Statuses</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILED">Failed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {isAdmin && (
                    <Col md={3} sm={6}>
                      <Form.Group>
                        <Form.Label className="small text-danger fw-bold mb-1">
                          User ID (Admin)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          inputMode="numeric"
                          name="userId"
                          placeholder="User ID"
                          value={tempListFilters.userId}
                          onChange={(e) => {
                            if (
                              e.target.value !== "" &&
                              !/^\d+$/.test(e.target.value)
                            )
                              return;
                            setTempListFilters((p) => ({
                              ...p,
                              userId: e.target.value,
                            }));
                          }}
                          className="border-0 shadow-none rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>
                  )}
                  <Col
                    md={isAdmin ? 3 : 12}
                    sm={12}
                    className="d-flex gap-2 mt-4 mt-md-0 justify-content-end"
                  >
                    <Button
                      variant="outline-secondary"
                      onClick={resetListFilters}
                      className="px-3 rounded-3"
                    >
                      <BsXCircle size={18} />
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 fw-bold rounded-3"
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Collapse>

      {errorList ? (
        <div className="text-center py-4">
          <h5 className="text-danger">{errorList}</h5>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border-0 shadow-sm mt-3">
          <BsReceipt size={50} className="text-secondary mb-3 opacity-50" />
          <h5 className="fw-bold">No payments found</h5>
          <p className="text-muted mb-0">No transactions match your filters.</p>
        </div>
      ) : (
        <Row>
          <Col>
            <div className="d-flex flex-column gap-2 mb-4">
              {payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
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
          </Col>
        </Row>
      )}
    </Container>
  );
}
