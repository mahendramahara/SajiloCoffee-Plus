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
import { flex, grid, spacing, shadows } from "../utils/styles";

const UtilsShowcase = () => {
  const testNotifications = () => {
    notify.success("Success!", "Operation completed successfully");
    setTimeout(() => notify.error("Error!", "Something went wrong"), 500);
    setTimeout(
      () => notify.warning("Warning!", "Please check your input"),
      1000
    );
    setTimeout(
      () => notify.info("Info", "This is an information message"),
      1500
    );
    setTimeout(
      () => notify.auth("Auth Required", "Please log in to continue"),
      2000
    );
  };

  const testModal = () => {
    popup.show({
      title: "Custom Modal",
      size: "medium",
      children: (
        <div style={{ textAlign: "center" }}>
          <h3 style={{ color: "var(--color-text)", marginBottom: spacing.md }}>
            Modal Content
          </h3>
          <p style={{ color: "var(--color-muted)", marginBottom: spacing.lg }}>
            This is a custom modal with your root colors and responsive design.
          </p>
          <button
            onClick={() => popup.hide()}
            style={{
              background: "var(--color-primary)",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      ),
    });
  };

  const testConfirm = () => {
    popup.confirm(
      "Delete Item",
      "Are you sure you want to delete this item? This action cannot be undone.",
      () => showSuccess("Item deleted successfully"),
      () => showError("Action cancelled")
    );
  };

  const testLoading = () => {
    loading.show("Processing your request...");
    setTimeout(() => loading.hide(), 3000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        padding: spacing.lg,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            ...flex.center,
            marginBottom: spacing.xxl,
            textAlign: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "var(--color-primary)",
                marginBottom: spacing.sm,
              }}
            >
              SajiloCoffee+ Utils
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "var(--color-muted)",
              }}
            >
              Lightweight, fast, responsive utilities for your cafe app
            </p>
          </div>
        </header>

        <div
          style={{
            ...grid.auto,
            gap: spacing.lg,
            marginBottom: spacing.xxl,
          }}
        >
          <div
            style={{
              background: "var(--color-surface)",
              padding: spacing.lg,
              borderRadius: "12px",
              border: "1px solid var(--color-border)",
              boxShadow: shadows.md,
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "var(--color-text)",
                marginBottom: spacing.md,
              }}
            >
              Notifications
            </h2>
            <p
              style={{
                color: "var(--color-muted)",
                marginBottom: spacing.md,
                fontSize: "14px",
              }}
            >
              Toast notifications with animations and your brand colors
            </p>
            <button
              onClick={testNotifications}
              style={{
                background: "var(--color-primary)",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Test All Notifications
            </button>
          </div>

          <div
            style={{
              background: "var(--color-surface)",
              padding: spacing.lg,
              borderRadius: "12px",
              border: "1px solid var(--color-border)",
              boxShadow: shadows.md,
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "var(--color-text)",
                marginBottom: spacing.md,
              }}
            >
              Modals & Popups
            </h2>
            <p
              style={{
                color: "var(--color-muted)",
                marginBottom: spacing.md,
                fontSize: "14px",
              }}
            >
              Lightweight modal system with overlay and animations
            </p>
            <div style={{ ...flex.col, gap: spacing.sm }}>
              <button
                onClick={testModal}
                style={{
                  background: "var(--color-accent)",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Custom Modal
              </button>
              <button
                onClick={testConfirm}
                style={{
                  background: "var(--color-secondary)",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Confirm Dialog
              </button>
            </div>
          </div>

          <div
            style={{
              background: "var(--color-surface)",
              padding: spacing.lg,
              borderRadius: "12px",
              border: "1px solid var(--color-border)",
              boxShadow: shadows.md,
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "var(--color-text)",
                marginBottom: spacing.md,
              }}
            >
              Loading States
            </h2>
            <p
              style={{
                color: "var(--color-muted)",
                marginBottom: spacing.md,
                fontSize: "14px",
              }}
            >
              Full-screen loading with branded spinner
            </p>
            <button
              onClick={testLoading}
              style={{
                background: "var(--color-muted)",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Show Loading (3s)
            </button>
          </div>

          <div
            style={{
              background: "var(--color-surface)",
              padding: spacing.lg,
              borderRadius: "12px",
              border: "1px solid var(--color-border)",
              boxShadow: shadows.md,
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "var(--color-text)",
                marginBottom: spacing.md,
              }}
            >
              Auth Helpers
            </h2>
            <p
              style={{
                color: "var(--color-muted)",
                marginBottom: spacing.md,
                fontSize: "14px",
              }}
            >
              Quick authentication status notifications
            </p>
            <div style={{ ...flex.col, gap: spacing.sm }}>
              <button
                onClick={showAuthRequired}
                style={{
                  background: "var(--color-danger)",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Auth Required
              </button>
              <button
                onClick={showUnauthorized}
                style={{
                  background: "var(--color-danger)",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Unauthorized
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            padding: spacing.lg,
            borderRadius: "12px",
            border: "1px solid var(--color-border)",
            boxShadow: shadows.md,
            marginBottom: spacing.xxl,
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "var(--color-text)",
              marginBottom: spacing.md,
            }}
          >
            Error Pages
          </h2>
          <p
            style={{
              color: "var(--color-muted)",
              marginBottom: spacing.md,
              fontSize: "14px",
            }}
          >
            Professional error pages with consistent branding
          </p>
          <div
            style={{
              ...grid.four,
              gap: spacing.sm,
            }}
          >
            {[
              { component: NotFound, title: "404 Not Found", code: "404" },
              { component: Forbidden, title: "403 Forbidden", code: "403" },
              {
                component: ServerError,
                title: "500 Server Error",
                code: "500",
              },
              {
                component: Unauthorized,
                title: "401 Unauthorized",
                code: "401",
              },
            ].map(({ component, title, code }) => (
              <button
                key={code}
                onClick={() =>
                  popup.show({
                    title: `${code} Error`,
                    size: "large",
                    children: React.createElement(component),
                  })
                }
                style={{
                  background: "var(--color-border)",
                  color: "var(--color-text)",
                  border: "none",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface-alt)",
            padding: spacing.lg,
            borderRadius: "12px",
            border: "1px solid var(--color-border)",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--color-text)",
              marginBottom: spacing.sm,
            }}
          >
            Implementation
          </h3>
          <pre
            style={{
              fontSize: "12px",
              color: "var(--color-muted)",
              lineHeight: 1.5,
              overflow: "auto",
              background: "var(--color-surface)",
              padding: spacing.md,
              borderRadius: "6px",
              border: "1px solid var(--color-border)",
            }}
          >
            {`import { notify, popup, loading } from '../utils';
import { NotFound, Forbidden } from '../components/common/ErrorPages';

// Notifications
notify.success('Success!', 'Operation completed');
notify.error('Error!', 'Something went wrong');

// Modals
popup.confirm('Delete?', 'Are you sure?', onConfirm);
popup.alert('Info', 'This is important');

// Loading
loading.show('Processing...');
loading.hide();

// Error Pages
<NotFound />
<Forbidden />`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UtilsShowcase;
