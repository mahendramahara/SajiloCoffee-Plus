import React, { useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import productsData from "../../api/products.json";
import PageHeader from "../../components/user/PageHeader";
import ProductFilters from "../../components/user/ProductFilters";
import ProductGrid from "../../components/user/ProductGrid";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const categories = [
    ...new Set(productsData.flatMap((product) => product.tags || [])),
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productsData.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory ||
        (product.tags && product.tags.includes(selectedCategory));

      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price.regular - b.price.regular;
        case "price-high":
          return b.price.regular - a.price.regular;
        case "popular":
          return (
            (b.tags?.includes("popular") ? 1 : 0) -
            (a.tags?.includes("popular") ? 1 : 0)
          );
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <>
      <PageHeader
        title="Our Menu"
        subtitle="Discover our carefully crafted coffee selection"
        icon="bi bi-cup-hot"
      />

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Container className="py-4">
        <ProductGrid products={filteredAndSortedProducts} />
      </Container>
    </>
  );
};

export default Menu;
