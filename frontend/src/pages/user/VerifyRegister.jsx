import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { showSuccess, showError } from "../../utils";
import { verifyEmail, resendVerificationOTP } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const VerifyRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      showError("Please register first");
      navigate("/register");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!otp || otp.length !== 6) {
      showError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const response = await verifyEmail({
        email,
        otp,
      });

      if (response.success) {
        login(response.data.user, response.data.accessToken, response.data.tokenExpiresIn);
        
        showSuccess(response.message || "Email verified successfully!");
        navigate("/");
      } else {
        showError(response.message || "Email verification failed. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Email verification failed. Please try again.";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      const response = await resendVerificationOTP(email);

      if (response.success) {
        showSuccess(response.message || "Verification code sent successfully!");
      } else {
        showError(response.message || "Failed to resend verification code.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to resend verification code.";
      showError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <div className="auth-card mx-auto" style={{ maxWidth: "500px" }}>
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary mb-3">Verify Your Email</h1>
            <p className="text-muted">
              We've sent a verification code to <strong>{email}</strong>
            </p>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Alert variant="info" className="mb-4">
                <small>
                  Please check your email and enter the 6-digit verification code below.
                </small>
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Verification Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    className="text-center fs-4 letter-spacing-2"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-custom-primary w-100 mb-3"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>
              </Form>

              <div className="text-center">
                <p className="text-muted mb-2">Didn't receive the code?</p>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleResendOTP}
                  disabled={isResending}
                >
                  {isResending ? "Resending..." : "Resend Code"}
                </Button>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => navigate("/register")}
              className="text-decoration-none"
            >
              ← Back to Registration
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default VerifyRegister;
