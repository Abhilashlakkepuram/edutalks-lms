import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyResetOtp, resendOtp } from "../../services/authService";
import "../../styles/auth-premium.css";

const VerifyResetOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from previous page
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await verifyResetOtp({ email, otp });
            if (res.success) {
                // Navigate to Reset Password page
                navigate("/reset-password", { state: { email, otp } });
            } else {
                setError(res.message || "Invalid OTP");
            }
        } catch (err) {
            setError("Failed to verify OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setMessage("");
        setError("");
        try {
            // We can reuse the normal resendOtp or forgotPassword.
            // Since forgotPassword generates a reset OTP, better to use that logic or a specific resend endpoint.
            // Reusing forgotPassword logic is safer as it sets the reset context.
            // ... but wait, `forgotPassword` sends the email again with a new OTP. Let's use that.
            const { forgotPassword } = await import("../../services/authService");
            const res = await forgotPassword(email);
            if (res.success) {
                setMessage("Code resent successfully!");
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError("Failed to resend code.");
        }
    };

    return (
        <div className="auth-page-container">
            <div className="split-layout">
                <div className="split-right">
                    <h2>Verify Code</h2>
                    <p className="subtitle" style={{ textAlign: "left", marginBottom: "30px" }}>
                        Enter the code sent to <strong>{email}</strong>
                    </p>

                    {message && <div style={{ color: "green", marginBottom: "10px" }}>{message}</div>}
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div className="input-group" style={{ marginBottom: "0" }}>
                            <input
                                className="premium-input"
                                placeholder="Enter 6-digit Code"
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                style={{ letterSpacing: "5px", textAlign: "center", fontSize: "1.2rem" }}
                            />
                        </div>

                        <button className="premium-btn" disabled={loading}>
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </form>

                    <div className="auth-footer" style={{ textAlign: "left", marginTop: "30px" }}>
                        Didn't receive code? <button onClick={handleResend} style={{ background: "none", border: "none", color: "#4f46e5", cursor: "pointer", fontWeight: "bold" }}>Resend</button>
                    </div>
                    <div className="auth-footer" style={{ textAlign: "left", marginTop: "10px" }}>
                        <Link to="/login">Back to Login</Link>
                    </div>
                </div>

                <div className="split-left">
                    <h1 style={{ color: "#333" }}>Identify<br /><span style={{ color: "red" }}>Yourself</span></h1>
                    <p style={{ color: "#333", fontWeight: "bold" }}>We need to verify it's really you.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyResetOtp;
