import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../services/authService";
import "../../styles/auth.css";
import { useToast } from "../../context/ToastContext";

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();

  // Timer state
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    setCanResend(false);
    setTimer(60);
    setError("");

    try {
      const res = await resendOtp(state.email);
      if (res.success) {
        showToast("OTP Resent Successfully", "success");
      } else {
        setError(res.message);
        showToast(res.message, "error");
        setCanResend(true); // Allow retry if failed
        setTimer(0);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to resend OTP", "error");
      setCanResend(true);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await verifyOtp({
      email: state.email,
      otp
    });

    if (!res.success) {
      setError(res.message);
      showToast(res.message || "OTP verification failed", "error");
      return;
    }

    showToast("OTP verified — you may login now", "success");
    navigate("/login", {
      state: { redirectTo: state.redirectTo }
    });
  };

  return (
    <div className="auth-box">
      <h2>Verify OTP</h2>
      <p style={{ textAlign: "center", marginBottom: "20px", color: "var(--text-secondary)" }}>
        Enter the code sent to {state?.email}
      </p>
      {error && <p className="error">{error}</p>}

      <form onSubmit={submit}>
        <input placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
        <button className="primary-btn">Verify</button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            style={{
              background: "transparent",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              padding: "8px 16px",
              cursor: "pointer"
            }}
          >
            Resend OTP
          </button>
        ) : (
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Resend OTP in {timer}s
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
