import React, { createContext, useState, useEffect } from "react";
import usersData from "../api/users.json";
import adminsData from "../api/admins.json";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("sajilocoffee_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        setUserRole(user.role);
        setPermissions(user.permissions || null);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("sajilocoffee_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, roleType = "user") => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let user = null;

      if (roleType === "admin") {
        user = adminsData.find((admin) => admin.email === email);
      } else {
        user = usersData.find((user) => user.email === email);
      }

      if (user) {
        const userWithAuth = {
          ...user,
          loginAt: new Date().toISOString(),
          sessionId: `session_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        };

        setCurrentUser(userWithAuth);
        setIsLoggedIn(true);
        setUserRole(user.role);
        setPermissions(user.permissions || null);

        localStorage.setItem("sajilocoffee_user", JSON.stringify(userWithAuth));

        setIsLoading(false);
        return { success: true, user: userWithAuth };
      } else {
        setIsLoading(false);
        return { success: false, error: "User not found" };
      }
    } catch {
      setIsLoading(false);
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setUserRole(null);
    setPermissions(null);
    localStorage.removeItem("sajilocoffee_user");
  };

  const loginAsUser = () => {
    return login("rajesh@example.com", "password", "user");
  };

  const loginAsAdmin = () => {
    return login("admin@sajilocoffee.plus", "password", "admin");
  };

  const loginAsManager = () => {
    return login("manager@sajilocoffee.plus", "password", "admin");
  };

  const hasPermission = (resource, action) => {
    if (!permissions || !permissions[resource]) return false;
    return permissions[resource][action] === true;
  };

  const isAdmin = () => userRole === "admin";
  const isUser = () => userRole === "user";
  const isManager = () => userRole === "manager";

  const updateProfile = (updates) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem("sajilocoffee_user", JSON.stringify(updatedUser));
  };

  const getUserPreferences = () => {
    return currentUser?.preferences || null;
  };

  const getUserSubscription = () => {
    return currentUser?.subscription || null;
  };

  const value = {
    currentUser,
    isLoggedIn,
    isLoading,
    userRole,
    permissions,
    login,
    logout,
    loginAsUser,
    loginAsAdmin,
    loginAsManager,
    hasPermission,
    isAdmin,
    isUser,
    isManager,
    updateProfile,
    getUserPreferences,
    getUserSubscription,
    isDevelopment: import.meta.env.DEV,
    mockUsers: usersData,
    mockAdmins: adminsData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
