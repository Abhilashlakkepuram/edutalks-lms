import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import BackButton from "../../components/BackButton";

import "../../styles/payment.css";

const Payment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
                const data = await res.json();
                if (data.success) {
                    setCourse(data.course);
                } else {
                    setError("Failed to load course details.");
                }
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchCourse();
    }, [courseId]);

    const handlePayment = async () => {
        if (!course) return;
        const token = getToken();

        try {
            // Direct enrollment call (Bypassing Stripe as requested)
            // Mocking payment details to send to backend for email
            const paymentId = "PAY_" + Math.random().toString(36).substr(2, 9).toUpperCase();
            const paymentMethod = "Credit Card"; // or "UPI"
            const paymentDate = new Date().toISOString();

            const res = await fetch("http://localhost:5000/api/enrollments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    courseId: course._id,
                    paymentInfo: {
                        amount: finalPrice,
                        paymentId,
                        paymentMethod,
                        date: paymentDate
                    }
                })
            });

            const data = await res.json();

            if (data.success || data.message === "Already enrolled") {
                alert("Payment Success! Course details have been sent to your email.");
                navigate("/student/dashboard");
            } else {
                alert("Enrollment failed: " + (data.message || "Unknown error"));
            }

        } catch (error) {
            console.error("Payment error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    if (loading) return <div className="loading-container">Loading course details...</div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!course) return null;

    const originalPrice = course.price;
    const discount = course.discount || 0;
    const finalPrice = Math.round(originalPrice * (1 - discount / 100));

    return (
        <div className="payment-container">
            <div className="payment-card">
                <BackButton />
                <div className="payment-icon-wrapper">
                    <i className="fa-solid fa-lock"></i>
                </div>
                <h2 className="payment-title">Secure Checkout</h2>
                <p className="payment-description">
                    You are ensuring access to <strong>{course.title}</strong>.
                    <br />
                    Redirecting to secure payment partner.
                </p>

                <div className="payment-summary-box">
                    <p className="payment-summary-label">Total to Pay</p>
                    <p className="payment-amount">
                        ₹{finalPrice}
                        {discount > 0 && (
                            <span className="payment-original-price">
                                ₹{originalPrice}
                            </span>
                        )}
                    </p>
                    {discount > 0 && <span className="payment-discount-badge">Shape your future with {discount}% OFF!</span>}
                </div>

                <button
                    className="premium-btn payment-button"
                    onClick={handlePayment}
                >
                    <i className="fa-solid fa-credit-card" style={{ marginRight: "10px" }}></i>
                    Pay Securely via Card / UPI
                </button>

                <div className="payment-methods-icons">
                    <i className="fa-brands fa-cc-visa"></i>
                    <i className="fa-brands fa-cc-mastercard"></i>
                    <i className="fa-brands fa-google-pay"></i>
                </div>
            </div>
        </div>
    );
};

export default Payment;
