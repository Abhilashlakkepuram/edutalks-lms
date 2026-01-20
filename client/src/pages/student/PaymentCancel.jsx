import { Link } from "react-router-dom";
import "../../styles/auth-premium.css"; // Ensure button styles are available

const PaymentCancel = () => {
    return (
        <div style={{ textAlign: "center", padding: "50px", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h2 style={{ color: "#ef4444", fontSize: "2rem", marginBottom: "1rem" }}>Payment Cancelled ❌</h2>
            <p style={{ color: "#4b5563", marginBottom: "2rem" }}>Your transaction was cancelled. No money was deducted.</p>
            <Link to="/student/dashboard" className="premium-btn" style={{ textDecoration: "none", display: "inline-block", maxWidth: "200px" }}>
                Go to Dashboard
            </Link>
        </div>
    );
};

export default PaymentCancel;
