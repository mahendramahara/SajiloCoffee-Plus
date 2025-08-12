import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import { useAuth } from "../../context/useAuth";
import { showNotification } from "../../utils/notify";
import productsData from "../../api/products.json";

const ProductManagement = () => {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    sizes: [],
    available: true,
    tags: [],
    image: "",
    imageFile: null,
    imagePreview: "",
  });

  const categories = ["all", "espresso", "milk", "cold", "specialty", "tea"];

  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        sizes: product.sizes || [],
        available: product.available,
        tags: product.tags || [],
        image: product.image || "",
        imageFile: null,
        imagePreview: product.image || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        category: "",
        price: "",
        sizes: [],
        available: true,
        tags: [],
        image: "",
        imageFile: null,
        imagePreview: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: event.target.result,
            image: `/images/products/${file.name}`, // Simulated upload path
          }));
        };
        reader.readAsDataURL(file);
      } else {
        showNotification.error("Please select a valid image file");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasPermission("products", editingProduct ? "update" : "create")) {
      showNotification.error(
        "You do not have permission to perform this action"
      );
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      id: editingProduct?.id || `550e8400-e29b-41d4-a716-${Date.now()}`,
      ratingAverage: editingProduct?.ratingAverage || 0,
      ratingCount: editingProduct?.ratingCount || 0,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? productData : p))
      );
      showNotification.success("Product updated successfully");
    } else {
      setProducts((prev) => [...prev, productData]);
      showNotification.success("Product created successfully");
    }

    handleCloseModal();
  };

  const handleDelete = (productId) => {
    if (!hasPermission("products", "delete")) {
      showNotification.error("You do not have permission to delete products");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showNotification.success("Product deleted successfully");
    }
  };

  const toggleAvailability = (productId) => {
    if (!hasPermission("products", "update")) {
      showNotification.error("You do not have permission to update products");
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, available: !p.available } : p
      )
    );
    showNotification.success("Product availability updated");
  };

  const getCategoryBadge = (category) => {
    const variants = {
      espresso: "primary",
      milk: "success",
      cold: "info",
      specialty: "warning",
      tea: "secondary",
    };
    return variants[category] || "dark";
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="dashboard-title">Product Management</h1>
          <p className="dashboard-subtitle">
            Manage your coffee products and menu items
          </p>
        </div>
        {hasPermission("products", "create") && (
          <Button
            variant="primary"
            className="btn-admin-primary"
            onClick={() => handleShowModal()}
          >
            <i className="fas fa-plus me-2"></i>
            Add Product
          </Button>
        )}
      </div>

      <Card className="data-card mb-4">
        <Card.Header>
          <h5 className="card-title">Filter Products</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="data-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title">Products ({filteredProducts.length})</h5>
            <Badge bg="primary">
              {currentProducts.length} of {filteredProducts.length}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="product-image me-3">
                        <div className="product-placeholder">
                          <i className="fas fa-coffee"></i>
                        </div>
                      </div>
                      <div>
                        <h6 className="mb-1">{product.name}</h6>
                        <small className="text-muted">
                          {product.description?.substring(0, 50)}...
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg={getCategoryBadge(product.category)}>
                      {product.category}
                    </Badge>
                  </td>
                  <td>
                    <span className="fw-bold">₨{product.price}</span>
                    {product.sizes && product.sizes.length > 0 && (
                      <div>
                        <small className="text-muted">
                          +{product.sizes.length} size
                          {product.sizes.length > 1 ? "s" : ""}
                        </small>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-star text-warning me-1"></i>
                      <span>{product.ratingAverage}</span>
                      <small className="text-muted ms-1">
                        ({product.ratingCount})
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={product.available}
                        onChange={() => toggleAvailability(product.id)}
                        disabled={!hasPermission("products", "update")}
                      />
                      <label className="form-check-label">
                        {product.available ? "Available" : "Unavailable"}
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      {hasPermission("products", "update") && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(product)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                      )}
                      {hasPermission("products", "delete") && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber =
                    currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNumber > totalPages) return null;

                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}

                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {formData.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Available Sizes</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. small,regular,large"
                    value={formData.sizes.map((s) => s.size).join(",")}
                    onChange={(e) => {
                      const sizes = e.target.value
                        .split(",")
                        .map((size) => ({
                          size: size.trim(),
                          price: formData.price,
                        }))
                        .filter((s) => s.size);
                      setFormData((prev) => ({ ...prev, sizes }));
                    }}
                  />
                  <Form.Text className="text-muted">
                    Separate sizes with commas
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price (NPR)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="10"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="available"
                label="Available for order"
                checked={formData.available}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="btn-admin-primary"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ProductManagement;
