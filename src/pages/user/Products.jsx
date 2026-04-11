import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Pagination,
  Spinner,
} from "react-bootstrap";
import ProductCard from "../../components/cards/ProductCard";
import api from "../../api/axios";
import { API } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import ConfirmDeleteModal from "../../components/cards/ConfirmDeleteModal";

export default function Products() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  const fetchItems = useCallback(async (page) => {
    try {
      setLoading(true);
      const response = await api.get(API.ITEMS.GET_ALL, {
        params: { page, size: pageSize },
      });

      if (response.data.content) {
        setItems(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setItems(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage, fetchItems]);

  const handleShowCreate = () => {
    setEditingItem(null);
    setFormData({ name: "", price: "" });
    setShowModal(true);
  };

  const handleShowEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, price: item.price });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
    };

    try {
      if (editingItem) {
        await api.put(API.ITEMS.UPDATE(editingItem.id), payload);
        toast.success("Item updated successfully!");
      } else {
        await api.post(API.ITEMS.CREATE, payload);
        toast.success("Item created successfully!");
      }
      handleCloseModal();
      fetchItems(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving the item.");
    }
  };

  const initiateDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeletingItem(true);
      await api.delete(API.ITEMS.DELETE(itemToDelete));
      toast.success("Item deleted!");
      if (items.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchItems(currentPage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the item.");
    } finally {
      setIsDeletingItem(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleToggleCart = (item) => {
    setCart((prevCart) => {
      const isAlreadyInCart = prevCart.some(
        (cartItem) => cartItem.id === item.id,
      );
      let updatedCart;

      if (isAlreadyInCart) {
        updatedCart = prevCart.filter((cartItem) => cartItem.id !== item.id);
        toast.info(`${item.name} removed from cart`);
      } else {
        updatedCart = [...prevCart, { ...item, quantity: 1 }];
        toast.success(`${item.name} added to cart!`);
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Products</h2>
        {isAdmin && (
          <Button
            variant="success"
            onClick={handleShowCreate}
            className="rounded-pill px-4 fw-bold"
          >
            + Add New Item
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-muted py-5">
          <h4>No items found.</h4>
        </div>
      ) : (
        <>
          <Row xs={1} md={2} lg={4} className="g-4">
            {items.map((item) => {
              const isItemInCart = cart.some(
                (cartItem) => cartItem.id === item.id,
              );
              return (
                <Col key={item.id}>
                  <ProductCard
                    item={item}
                    isAdmin={isAdmin}
                    onEdit={handleShowEdit}
                    onDelete={initiateDelete}
                    onToggleCart={handleToggleCart}
                    isInCart={isItemInCart}
                  />
                </Col>
              );
            })}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination className="shadow-sm">
                <Pagination.Prev
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx}
                    active={idx === currentPage}
                    onClick={() => setCurrentPage(idx)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">
            {editingItem ? "Edit Item" : "Create New Item"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="py-0">
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted fw-bold">
                Item Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-light border-0 py-2"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted fw-bold">
                Price ($)
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="bg-light border-0 py-2"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-3">
            <Button
              variant="light"
              onClick={handleCloseModal}
              className="fw-bold"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="fw-bold px-4">
              {editingItem ? "Save Changes" : "Create Item"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={cancelDelete}
        onConfirm={confirmDelete}
        isDeleting={isDeletingItem}
        title="Delete Product?"
        message="Are you sure you want to delete this product? This action cannot be undone and it will be removed from the store."
        cancelText="Cancel"
        confirmText="Yes, Delete Product"
      />
    </Container>
  );
}
