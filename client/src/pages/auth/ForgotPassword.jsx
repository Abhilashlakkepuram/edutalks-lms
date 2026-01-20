import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import "../../styles/auth-premium.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const res = await forgotPassword(email);
            if (res.success) {
                // Navigate to verify OTP page with email in state
                navigate("/verify-reset-otp", { state: { email } });
            } else {
                setError(res.message || "Something went wrong.");
            }
        } catch (err) {
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="split-layout">
                {/* LEFT PANEL (Content Right) */}
                <div className="split-right">
                    <h2>Forgot Password?</h2>
                    <p className="subtitle" style={{ textAlign: "left", marginBottom: "30px" }}>
                        Enter your email to receive a password reset code.
                    </p>

                    {message && <div className="success-message" style={{ color: "green", marginBottom: "10px" }}>{message}</div>}
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div className="input-group" style={{ marginBottom: "0" }}>
                            <input
                                className="premium-input"
                                placeholder="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button className="premium-btn" disabled={loading}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>

                    <div className="auth-footer" style={{ textAlign: "left", marginTop: "30px" }}>
                        Remember your password? <Link to="/login">Sign In</Link>
                    </div>
                </div>

                {/* RIGHT PANEL (Visual Left) */}
                <div className="split-left">
                    <h1 style={{ color: "#333" }}>Reset<br /><span style={{ color: "red" }}>Password</span></h1>
                    <p style={{ color: "#333", fontWeight: "bold" }}>Securely recover your account access.</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
