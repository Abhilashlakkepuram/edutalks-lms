import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "../../styles/auth-premium.css";

const PaymentSuccess = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const courseId = params.get("courseId");
    const enrolledRef = useRef(false);

    // Status states: 'loading', 'success', 'error'
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Process enrollment...');

    useEffect(() => {
        if (enrolledRef.current) return;
        enrolledRef.current = true;

        if (!courseId) {
            setStatus('error');
            setMessage('Invalid course information.');
            setTimeout(() => navigate("/student/dashboard"), 3000);
            return;
        }

        const enroll = async () => {
            try {
                setMessage('Verifying payment and enrolling...');
                const token = getToken();
                if (!token) throw new Error("Authentication missing");

                const res = await fetch("http://localhost:5000/api/enrollments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ courseId })
                });

                const data = await res.json();

                if (data.success) {
                    setStatus('success');
                    setMessage('Enrollment successful! Redirecting...');
                    setTimeout(() => {
                        navigate("/student/dashboard");
                    }, 2000);
                } else {
                    // If already enrolled, treated as success for UX
                    if (data.message === "Already enrolled") {
                        setStatus('success');
                        setMessage('You are already enrolled! Redirecting...');
                        setTimeout(() => navigate("/student/dashboard"), 2000);
                    } else {
                        throw new Error(data.message || "Enrollment failed");
                    }
                }

            } catch (err) {
                console.error("Enrollment error after payment:", err);
                setStatus('error');
                setMessage("Enrollment failed. Please contact support. " + err.message);
            }
        };

        enroll();
    }, [courseId, navigate]);

    return (
        <div style={{ textAlign: "center", padding: "50px", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            {status === 'loading' && (
                <>
                    <div className="spinner" style={{ marginBottom: "20px" }}></div>
                    <h2 style={{ color: "#4f46e5", fontSize: "2rem", marginBottom: "1rem" }}>Processing...</h2>
                    <p style={{ color: "#4b5563" }}>{message}</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <h2 style={{ color: "#10b981", fontSize: "2rem", marginBottom: "1rem" }}>Payment Successful! 🎉</h2>
                    <p style={{ color: "#4b5563" }}>{message}</p>
                    <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "10px" }}>Check your email for confirmation.</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <h2 style={{ color: "#ef4444", fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong</h2>
                    <p style={{ color: "#374151" }}>{message}</p>
                    <button
                        onClick={() => navigate("/student/dashboard")}
                        style={{ marginTop: "20px", padding: "10px 20px", background: "#4f46e5", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                    >
                        Go to Dashboard
                    </button>
                </>
            )}
        </div>
    );
};

export default PaymentSuccess;
