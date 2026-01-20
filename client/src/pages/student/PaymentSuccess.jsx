import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "../../styles/auth-premium.css";

const PaymentSuccess = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const courseId = params.get("courseId");
    const enrolledRef = useRef(false); // Prevent double enrollment in strict mode

    useEffect(() => {
        if (enrolledRef.current) return;
        enrolledRef.current = true;

        const enroll = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/enrollments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ courseId })
                });

                // You might want to handle success/failure response here
                // For now, redirecting
                setTimeout(() => {
                    navigate("/student/dashboard");
                }, 2000);

            } catch (err) {
                console.error("Enrollment error after payment:", err);
            }
        };

        if (courseId) {
            enroll();
        } else {
            navigate("/student/dashboard");
        }
    }, [courseId, navigate]);

    return (
        <div style={{ textAlign: "center", padding: "50px", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h2 style={{ color: "#10b981", fontSize: "2rem", marginBottom: "1rem" }}>Payment Successful! 🎉</h2>
            <p style={{ color: "#4b5563" }}>Enrolling you in the course...</p>
        </div>
    );
};

export default PaymentSuccess;
