import React from "react";
import {
  notify,
  popup,
  loading,
  showAuthRequired,
  showUnauthorized,
  showSuccess,
  showError,
} from "../utils";
import {
  NotFound,
  Forbidden,
  ServerError,
  Unauthorized,
} from "../components/common/ErrorPages";

const UtilsDemo = () => {
  const handleTestNotifications = () => {
    notify.success("Success!", "Operation completed successfully");
    setTimeout(() => notify.error("Error!", "Something went wrong"), 1000);
    setTimeout(
      () => notify.warning("Warning!", "Please check your input"),
      2000
    );
    setTimeout(
      () => notify.info("Info", "This is an information message"),
      3000
    );
    setTimeout(
      () => notify.auth("Auth Required", "Please log in to continue"),
      4000
    );
  };

  const handleTestPopups = () => {
    popup.alert("Alert", "This is an alert message");
  };

  const handleTestConfirm = () => {
    popup.confirm(
      "Confirm Action",
      "Are you sure you want to delete this item?",
      () => showSuccess("Item deleted successfully"),
      () => showError("Action cancelled")
    );
  };

  const handleTestLoading = () => {
    loading.show("Processing...");
    setTimeout(() => loading.hide(), 3000);
  };

  const handleTestAuth = () => {
    showAuthRequired();
  };

  const handleTestUnauth = () => {
    showUnauthorized();
  };

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "800px",
        margin: "0 auto",
        background: "var(--color-surface)",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
      }}
    >
      <h1
        style={{
          color: "var(--color-text)",
          marginBottom: "32px",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >
        SajiloCoffee+ Utils Demo
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <button
          onClick={handleTestNotifications}
          style={{
            background: "var(--color-primary)",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Test Notifications
        </button>

        <button
          onClick={handleTestPopups}
          style={{
            background: "var(--color-accent)",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Test Alert
        </button>

        <button
          onClick={handleTestConfirm}
          style={{
            background: "var(--color-secondary)",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Test Confirm
        </button>

        <button
          onClick={handleTestLoading}
          style={{
            background: "var(--color-muted)",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Test Loading
        </button>

        <button
          onClick={handleTestAuth}
          style={{
            background: "var(--color-danger)",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Auth Required
        </button>

        <button
          onClick={handleTestUnauth}
          style={{
            background: "var(--color-danger)",
            color: "white",
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Unauthorized
        </button>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            color: "var(--color-text)",
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Error Page Examples
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <button
            onClick={() =>
              popup.show({
                title: "404 Error",
                size: "large",
                children: <NotFound />,
              })
            }
            style={{
              background: "var(--color-border)",
              color: "var(--color-text)",
              border: "none",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            404 Not Found
          </button>

          <button
            onClick={() =>
              popup.show({
                title: "403 Error",
                size: "large",
                children: <Forbidden />,
              })
            }
            style={{
              background: "var(--color-border)",
              color: "var(--color-text)",
              border: "none",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            403 Forbidden
          </button>

          <button
            onClick={() =>
              popup.show({
                title: "500 Error",
                size: "large",
                children: <ServerError />,
              })
            }
            style={{
              background: "var(--color-border)",
              color: "var(--color-text)",
              border: "none",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            500 Server Error
          </button>

          <button
            onClick={() =>
              popup.show({
                title: "401 Error",
                size: "large",
                children: <Unauthorized />,
              })
            }
            style={{
              background: "var(--color-border)",
              color: "var(--color-text)",
              border: "none",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            401 Unauthorized
          </button>
        </div>
      </div>

      <div
        style={{
          background: "var(--color-surface-alt)",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3
          style={{
            color: "var(--color-text)",
            marginBottom: "8px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Usage Examples
        </h3>
        <pre
          style={{
            fontSize: "12px",
            color: "var(--color-muted)",
            lineHeight: 1.4,
            overflow: "auto",
          }}
        >
          {`import { notify, popup, loading } from '../utils';

notify.success('Success!', 'Operation completed');
popup.confirm('Delete?', 'Are you sure?', onConfirm);
loading.show('Processing...');`}
        </pre>
      </div>
    </div>
  );
};

export default UtilsDemo;
