import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/user/Home";
import Menu from "../pages/user/Menu";
import ProductDetail from "../pages/user/ProductDetail";
import Cart from "../pages/user/Cart";
import Orders from "../pages/user/Orders";
import Profile from "../pages/user/Profile";
import Subscriptions from "../pages/user/Subscriptions";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Recommendations from "../pages/user/Recommendations";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="recommendations" element={<Recommendations />} />

        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default UserRoutes;
