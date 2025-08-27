import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setAccessToken(token);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        clearAuth();
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (userData, token, tokenExpiresIn) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("tokenExpiresIn", tokenExpiresIn);
    setAccessToken(token);
    setIsLoggedIn(true);
    
    // Fetch complete user data including profile image
    try {
      const response = await getMe();
      const completeUserData = response.data.user;
      localStorage.setItem("user", JSON.stringify(completeUserData));
      setUser(completeUserData);
    } catch (error) {
      console.error("Error fetching complete user data:", error);
      // Fallback to provided userData if API fails
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiresIn");
    
    setUser(null);
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  const updateUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
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
    user,
    isLoggedIn,
    isLoading,
    accessToken,
    login,
    logout,
    updateUser,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
