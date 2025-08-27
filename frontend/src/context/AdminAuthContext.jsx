import React, { createContext, useContext, useState, useEffect } from "react";
import { adminApi } from '../api/adminApi';

const AdminAuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    const adminData = localStorage.getItem("admin");
    
    if (token && adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
        setAccessToken(token);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing admin data:", error);
        clearAuth();
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (adminData, token, tokenExpiresIn) => {
    localStorage.setItem("adminAccessToken", token);
    localStorage.setItem("adminTokenExpiresIn", tokenExpiresIn);
    setAccessToken(token);
    setIsLoggedIn(true);
    
    // Fetch complete admin data including profile
    try {
      const response = await adminApi.getMe();
      const completeAdminData = response.data.admin;
      localStorage.setItem("admin", JSON.stringify(completeAdminData));
      setAdmin(completeAdminData);
    } catch (error) {
      console.error("Error fetching complete admin data:", error);
      // Fallback to provided adminData if API fails
      localStorage.setItem("admin", JSON.stringify(adminData));
      setAdmin(adminData);
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminTokenExpiresIn");
    
    setAdmin(null);
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  const updateAdmin = (adminData) => {
    localStorage.setItem("admin", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const getAuthHeaders = () => {
    if (accessToken) {
      return {
        Authorization: `Bearer ${accessToken}`
      };
    }
    return {};
  };

  const value = {
    admin,
    isLoggedIn,
    isLoading,
    accessToken,
    login,
    logout,
    updateAdmin,
    getAuthHeaders,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
