import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import BackButton from "../../components/BackButton";

const Payment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const handlePayment = async () => {
        const token = getToken();

        try {
            const res = await fetch("http://localhost:5000/api/payment/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    course: { _id: courseId, title: "Course Enrollment", price: 499 }
                })
            });

            const data = await res.json();
            if (data.success) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                alert("Payment failed: " + (data.message || "Unknown error"));
            }

        } catch (error) {
            console.error("Payment error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center", minHeight: "80vh", alignItems: "center", background: "#f9fafb" }}>
            <div style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "40px", background: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
                <BackButton />
                <div style={{ marginBottom: "20px", fontSize: "48px", color: "#4f46e5" }}>
                    <i className="fa-solid fa-lock"></i>
                </div>
                <h2 style={{ marginBottom: "10px", color: "#111827", fontSize: "24px" }}>Secure Checkout</h2>
                <p style={{ marginBottom: "30px", color: "#6b7280", lineHeight: "1.5" }}>
                    You are being redirected to our secure payment partner, Stripe.
                    We do not store your card details.
                </p>

                <div style={{ background: "#f3f4f6", padding: "15px", borderRadius: "8px", marginBottom: "30px", border: "1px dashed #d1d5db" }}>
                    <p style={{ margin: "0 0 5px", fontSize: "14px", color: "#6b7280" }}>Total to Pay</p>
                    <p style={{ margin: "0", fontSize: "28px", fontWeight: "bold", color: "#111827" }}>₹499</p>
                </div>

                <button
                    className="premium-btn"
                    onClick={handlePayment}
                    style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "16px" }}
                >
                    <i className="fa-solid fa-credit-card" style={{ marginRight: "10px" }}></i>
                    Pay Securely via Card / UPI
                </button>

                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px", color: "#9ca3af", fontSize: "24px" }}>
                    <i className="fa-brands fa-cc-visa"></i>
                    <i className="fa-brands fa-cc-mastercard"></i>
                    <i className="fa-brands fa-google-pay"></i>
                </div>
            </div>
        </div>
    );
};

export default Payment;
