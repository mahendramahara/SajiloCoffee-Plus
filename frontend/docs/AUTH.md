# Authentication Context Documentation

## Overview

The SajiloCoffee+ authentication system provides a comprehensive context-based authentication solution for the frontend application. It includes user authentication, role-based access control, and permission management.

## Setup

### 1. Wrap your app with AuthProvider

```jsx
import React from "react";
import { AuthProvider } from "./context";
import App from "./App";

function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default Root;
```

### 2. Use the useAuth hook

```jsx
import { useAuth } from "./context/useAuth";

function MyComponent() {
  const { isLoggedIn, currentUser, login, logout } = useAuth();

  // Your component logic here
}
```

## Available Values

### State Variables

- `currentUser` - Current logged-in user object
- `isLoggedIn` - Boolean indicating if user is authenticated
- `isLoading` - Boolean indicating loading state
- `userRole` - Current user's role ('user', 'admin', 'manager')
- `permissions` - User's permission object (for admins/managers)

### Authentication Functions

- `login(email, password, roleType)` - Login function
- `logout()` - Logout function
- `loginAsUser()` - Quick login as regular user (dev only)
- `loginAsAdmin()` - Quick login as admin (dev only)
- `loginAsManager()` - Quick login as manager (dev only)

### Utility Functions

- `hasPermission(resource, action)` - Check specific permissions
- `isAdmin()` - Check if current user is admin
- `isUser()` - Check if current user is regular user
- `isManager()` - Check if current user is manager
- `updateProfile(updates)` - Update user profile
- `getUserPreferences()` - Get user preferences
- `getUserSubscription()` - Get user subscription info

## Protected Routes

### Basic Protection

```jsx
import ProtectedRoute from './routes/ProtectedRoute';

// Require authentication
<ProtectedRoute>
  <MyProtectedComponent />
</ProtectedRoute>

// Require specific role
<ProtectedRoute requireRole="admin">
  <AdminComponent />
</ProtectedRoute>

// Require specific permission
<ProtectedRoute requirePermission={{ resource: 'products', action: 'create' }}>
  <CreateProductComponent />
</ProtectedRoute>
```

### Specialized Route Components

```jsx
import {
  UserOnlyRoute,
  AdminOnlyRoute,
  ManagerOnlyRoute,
  PermissionRoute
} from './routes/ProtectedRoute';

// User-only content
<UserOnlyRoute>
  <UserDashboard />
</UserOnlyRoute>

// Admin-only content
<AdminOnlyRoute>
  <AdminPanel />
</AdminOnlyRoute>

// Permission-specific content
<PermissionRoute resource="orders" action="delete">
  <DeleteOrderButton />
</PermissionRoute>
```

## Test Users

### Regular Users

- **Email:** rajesh@example.com
- **Email:** sita@example.com
- **Role:** user
- **Password:** Any (development mode)

### Admin Users

- **Email:** admin@sajilocoffee.plus
- **Name:** Krishna Bhattarai
- **Role:** admin
- **Password:** Any (development mode)

- **Email:** manager@sajilocoffee.plus
- **Name:** Priya Gurung
- **Role:** manager
- **Password:** Any (development mode)

## Permission System

### Available Resources

- `products` - Coffee products
- `orders` - Customer orders
- `users` - User management
- `analytics` - Dashboard analytics
- `subscriptions` - Subscription plans
- `tables` - Table management
- `settings` - System settings

### Available Actions

- `read` - View/read access
- `create` - Create new items
- `update` - Modify existing items
- `delete` - Remove items
- `bulkActions` - Bulk operations

### Example Permission Check

```jsx
const { hasPermission } = useAuth();

// Check if user can create products
if (hasPermission("products", "create")) {
  // Show create product button
}

// Check if user can delete orders
if (hasPermission("orders", "delete")) {
  // Show delete order option
}
```

## Development Features

### Quick Login Buttons

For development convenience, use the quick login functions:

```jsx
const { loginAsUser, loginAsAdmin, loginAsManager } = useAuth();

<button onClick={loginAsUser}>Login as User</button>
<button onClick={loginAsAdmin}>Login as Admin</button>
<button onClick={loginAsManager}>Login as Manager</button>
```

### Mock Data Access

Access mock data directly (development only):

```jsx
const { mockUsers, mockAdmins, isDevelopment } = useAuth();

if (isDevelopment) {
  console.log("Available users:", mockUsers);
  console.log("Available admins:", mockAdmins);
}
```

## Examples

### Complete Login Component

```jsx
import React, { useState } from "react";
import { useAuth } from "../context/useAuth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password, role);
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
```

### User Profile Display

```jsx
import React from "react";
import { useAuth } from "../context/useAuth";

const UserProfile = () => {
  const {
    currentUser,
    getUserPreferences,
    getUserSubscription,
    updateProfile,
  } = useAuth();

  if (!currentUser) return null;

  return (
    <div>
      <h2>Profile: {currentUser.name}</h2>
      <p>Email: {currentUser.email}</p>
      <p>Role: {currentUser.role}</p>

      {getUserPreferences() && (
        <div>
          <h3>Preferences</h3>
          <pre>{JSON.stringify(getUserPreferences(), null, 2)}</pre>
        </div>
      )}

      {getUserSubscription() && (
        <div>
          <h3>Subscription</h3>
          <pre>{JSON.stringify(getUserSubscription(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
```

This authentication system provides a solid foundation for your cafe application with proper role-based access control and development-friendly features!
