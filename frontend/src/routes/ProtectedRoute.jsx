import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useAdminAuth } from "../context/AdminAuthContext";
import { LoadingSpinner } from "../utils/loading";
import { Unauthorized, Forbidden } from "../components/common/ErrorPages";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requiredRole = null,
  requirePermission = null,
  fallback = null,
}) => {
  const isAdminRoute = requiredRole === "admin" || requiredRole === "manager" || requiredRole === "staff";
  
  const userAuth = useAuth();
  const adminAuth = useAdminAuth();
  
  const { isLoggedIn, isLoading, userRole, hasPermission } = isAdminRoute ? {
    isLoggedIn: adminAuth.isLoggedIn,
    isLoading: adminAuth.isLoading,
    userRole: adminAuth.admin?.role,
    hasPermission: (resource, action) => {
      return adminAuth.admin?.permissions?.[resource]?.[action] || false;
    }
  } : userAuth;

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (requireAuth && !isLoggedIn) {
    if (requiredRole === "admin") {
      return <Navigate to="/admin/login" replace />;
    }
    return fallback || <Unauthorized />;
  }

  if (
    requiredRole &&
    requiredRole === "admin" &&
    !["admin", "manager", "staff"].includes(userRole)
  ) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && requiredRole !== "admin" && userRole !== requiredRole) {
    return fallback || <Forbidden />;
  }

  if (
    requirePermission &&
    !hasPermission(requirePermission.resource, requirePermission.action)
  ) {
    return fallback || <Forbidden />;
  }

  return children;
};

export const UserOnlyRoute = ({ children, fallback }) => (
  <ProtectedRoute requireRole="user" fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const AdminOnlyRoute = ({ children, fallback }) => (
  <ProtectedRoute requireRole="admin" fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const ManagerOnlyRoute = ({ children, fallback }) => (
  <ProtectedRoute requireRole="manager" fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export const PermissionRoute = ({ children, resource, action, fallback }) => (
  <ProtectedRoute requirePermission={{ resource, action }} fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
