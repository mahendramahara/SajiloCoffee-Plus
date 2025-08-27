import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "../context/AdminAuthContext";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import ProductManagement from "../pages/admin/Products";
import OrderManagement from "../pages/admin/Orders";
import UserManagement from "../pages/admin/Users";
import AdminManagement from "../pages/admin/Admins";
import SubscriptionManagement from "../pages/admin/Subscriptions";
import Analytics from "../pages/admin/Analytics";
import TableManagement from "../pages/admin/Tables";
import Settings from "../pages/admin/Settings";
import Profile from "../pages/admin/Profile";

const AdminRoutesContent = () => {
  const { isLoggedIn } = useAdminAuth();

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="admins" element={<AdminManagement />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="tables" element={<TableManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

const AdminRoutes = () => {
  return (
    <AdminAuthProvider>
      <AdminRoutesContent />
    </AdminAuthProvider>
  );
};

export default AdminRoutes;
