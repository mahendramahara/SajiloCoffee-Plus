import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const ProductFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="search-filter-bar">
      <Container>
        <Row className="align-items-center">
          <Col lg={4} className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search coffee..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </Col>
          <Col lg={3} className="mb-3">
            <Form.Select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={3} className="mb-3">
            <Form.Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </Form.Select>
          </Col>
          <Col lg={2} className="mb-3">
            <Button
              variant="outline-secondary"
              onClick={() => {
                onSearchChange("");
                onCategoryChange("");
                onSortChange("name");
              }}
              className="w-100"
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductFilters;
