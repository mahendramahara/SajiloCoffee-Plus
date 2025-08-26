import React from "react";
import productsData from "../../api/products.json";
import HeroSection from "../../components/user/HeroSection";
import FeaturedProducts from "../../components/user/FeaturedProducts";
import StatsSection from "../../components/user/StatsSection";

const Home = () => {
  const featuredProducts = productsData.slice(0, 4);

  const stats = [
    { icon: "bi-cup-hot", value: "500+", label: "Premium Blends" },
    { icon: "bi-people", value: "10K+", label: "Happy Customers" },
    { icon: "bi-truck", value: "24/7", label: "Fast Delivery" },
    { icon: "bi-award", value: "5★", label: "Top Rated" },
  ];

  return (
    <>
      <HeroSection />
      <StatsSection stats={stats} />
      <FeaturedProducts products={featuredProducts} title="Featured Products" />
    </>
  );
};

export default Home;
