const ErrorPage = ({
  code,
  title,
  message,
  actionText = "Go Home",
  onAction = () => (window.location.href = "/"),
}) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-bg)",
      padding: "20px",
    }}
  >
    <div
      style={{
        textAlign: "center",
        maxWidth: "500px",
        background: "var(--color-surface)",
        padding: "48px 32px",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          fontSize: "72px",
          fontWeight: "bold",
          color: "var(--color-primary)",
          marginBottom: "16px",
          lineHeight: 1,
        }}
      >
        {code}
      </div>
      <h1
        style={{
          fontSize: "24px",
          color: "var(--color-text)",
          marginBottom: "12px",
          fontWeight: "600",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          color: "var(--color-muted)",
          marginBottom: "32px",
          fontSize: "16px",
        }}
      >
        {message}
      </p>
      <button
        onClick={onAction}
        style={{
          background: "var(--color-primary)",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "6px",
          fontSize: "16px",
          fontWeight: "500",
          transition: "all 0.2s",
          cursor: "pointer",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "var(--color-accent)";
          e.target.style.transform = "translateY(-1px)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "var(--color-primary)";
          e.target.style.transform = "translateY(0)";
        }}
      >
        {actionText}
      </button>
    </div>
  </div>
);

export const NotFound = () => (
  <ErrorPage
    code="404"
    title="Page Not Found"
    message="The page you're looking for doesn't exist or has been moved."
  />
);

export const Forbidden = () => (
  <ErrorPage
    code="403"
    title="Access Forbidden"
    message="You don't have permission to access this resource."
  />
);

export const ServerError = () => (
  <ErrorPage
    code="500"
    title="Server Error"
    message="Something went wrong on our end. Please try again later."
    actionText="Refresh Page"
    onAction={() => window.location.reload()}
  />
);

export const Unauthorized = () => (
  <ErrorPage
    code="401"
    title="Unauthorized"
    message="Please log in to access this page."
    actionText="Go to Login"
    onAction={() => (window.location.href = "/login")}
  />
);

export default ErrorPage;
