import React from "react";
import { useAuth } from "../context/useAuth";

const AuthExample = () => {
  const {
    currentUser,
    isLoggedIn,
    isLoading,
    userRole,
    login,
    logout,
    loginAsUser,
    loginAsAdmin,
    loginAsManager,
    hasPermission,
    isAdmin,
    isUser,
    getUserPreferences,
    getUserSubscription,
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleLogin = async (email, password, role = "user") => {
    const result = await login(email, password, role);
    if (result.success) {
      console.log("Login successful:", result.user);
    } else {
      console.error("Login failed:", result.error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>SajiloCoffee+ Authentication Demo</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Current Status</h3>
        <p>
          <strong>Logged In:</strong> {isLoggedIn ? "Yes" : "No"}
        </p>
        <p>
          <strong>User Role:</strong> {userRole || "None"}
        </p>
        {currentUser && (
          <div>
            <p>
              <strong>User:</strong> {currentUser.name} ({currentUser.email})
            </p>
            <p>
              <strong>User ID:</strong> {currentUser.id}
            </p>
          </div>
        )}
      </div>

      {!isLoggedIn ? (
        <div style={{ marginBottom: "20px" }}>
          <h3>Quick Login Options (Development)</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button onClick={loginAsUser} style={{ padding: "8px 16px" }}>
              Login as User (Rajesh)
            </button>
            <button onClick={loginAsAdmin} style={{ padding: "8px 16px" }}>
              Login as Admin (Krishna)
            </button>
            <button onClick={loginAsManager} style={{ padding: "8px 16px" }}>
              Login as Manager
            </button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h4>Manual Login</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleLogin(
                  formData.get("email"),
                  formData.get("password"),
                  formData.get("role")
                );
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  style={{ padding: "8px", marginRight: "10px" }}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  style={{ padding: "8px", marginRight: "10px" }}
                />
                <select
                  name="role"
                  style={{ padding: "8px", marginRight: "10px" }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" style={{ padding: "8px 16px" }}>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <h3>User Actions</h3>
          <button
            onClick={logout}
            style={{ padding: "8px 16px", marginRight: "10px" }}
          >
            Logout
          </button>

          <div style={{ marginTop: "20px" }}>
            <h4>User Information</h4>
            {isUser() && (
              <div>
                <p>
                  <strong>Preferences:</strong>
                </p>
                <pre>{JSON.stringify(getUserPreferences(), null, 2)}</pre>
                <p>
                  <strong>Subscription:</strong>
                </p>
                <pre>{JSON.stringify(getUserSubscription(), null, 2)}</pre>
              </div>
            )}

            {isAdmin() && (
              <div>
                <h4>Admin Permissions</h4>
                <p>
                  Can manage products:{" "}
                  {hasPermission("products", "create") ? "Yes" : "No"}
                </p>
                <p>
                  Can delete orders:{" "}
                  {hasPermission("orders", "delete") ? "Yes" : "No"}
                </p>
                <p>
                  Can manage users:{" "}
                  {hasPermission("users", "update") ? "Yes" : "No"}
                </p>
                <p>
                  Can view analytics:{" "}
                  {hasPermission("analytics", "read") ? "Yes" : "No"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h3>Available Emails for Testing</h3>
        <div>
          <h4>Users:</h4>
          <ul>
            <li>rajesh@example.com (Regular User)</li>
            <li>sita@example.com (Regular User)</li>
          </ul>
          <h4>Admins:</h4>
          <ul>
            <li>admin@sajilocoffee.plus (Admin - Krishna)</li>
            <li>manager@sajilocoffee.plus (Manager - Priya)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthExample;
