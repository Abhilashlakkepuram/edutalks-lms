import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import "../../styles/auth-premium.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get email and otp from previous page (state)
    const { email, otp } = location.state || {};

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password");
        }
    }, [email, otp, navigate]);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await resetPassword({ email, otp, newPassword: password });
            if (res.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 3000); // Redirect after 3 seconds
            } else {
                setError(res.message || "Failed to reset password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page-container">
                <div className="split-layout">
                    <div style={{ padding: "40px", width: "100%", textAlign: "center" }}>
                        <div style={{ fontSize: "60px", color: "green", marginBottom: "20px" }}>
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <h2>Password Reset Successful!</h2>
                        <p style={{ color: "#6b7280", margin: "20px 0" }}>
                            Your password has been updated securely. You can now login with your new password.
                        </p>
                        <p>Redirecting to login...</p>
                        <Link to="/login" className="premium-btn" style={{ display: "inline-block", maxWidth: "200px", marginTop: "20px", textDecoration: "none" }}>
                            Login Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page-container">
            <div className="split-layout">
                <div className="split-right">
                    <h2>Set New Password</h2>
                    <p className="subtitle" style={{ textAlign: "left", marginBottom: "30px" }}>
                        Create a strong password for your account.
                    </p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div className="input-group" style={{ marginBottom: "0" }}>
                            <div style={{ position: "relative" }}>
                                <input
                                    className="premium-input"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingRight: "45px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer", color: "#6b7280"
                                    }}
                                >
                                    <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                                </button>
                            </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: "0" }}>
                            <input
                                className="premium-input"
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className="premium-btn" disabled={loading}>
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="auth-footer" style={{ textAlign: "left", marginTop: "30px" }}>
                        <Link to="/login">Cancel</Link>
                    </div>
                </div>

                <div className="split-left">
                    <h1 style={{ color: "#333" }}>Secure<br /><span style={{ color: "red" }}>Account</span></h1>
                    <p style={{ color: "#333", fontWeight: "bold" }}>Your security is our priority.</p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
