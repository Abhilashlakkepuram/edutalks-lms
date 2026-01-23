import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "../../styles/plans.css";


const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handlePlanClick = (plan) => {
        const token = getToken();
        if (!token) {
            navigate("/login");
        } else {
            // For now, redirect logged-in users to dashboard/home
            // In a real app, this would trigger payment for paid plans
            navigate("/student/dashboard");
        }
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/plans");
                const data = await res.json();
                if (data.success) {
                    setPlans(data.plans);
                }
            } catch (err) {
                console.error("Failed to load plans", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (loading) {
        return (
            <div className="plans-page">
                <p>Loading Plans...</p>
            </div>
        );
    }

    return (
        <div className="plans-page">
            <h1 className="plans-title">Choose Your Plan</h1>
            <p className="plans-subtitle">
                Unlock your potential with our flexible pricing options. Start learning today!
            </p>

            <div className="plans-grid">
                {plans.map((plan) => (
                    <div
                        key={plan._id}
                        className={`plan-card ${plan.name.includes("Pro") ? "featured" : ""}`}
                    >
                        {plan.name.includes("Pro") && (
                            <div className="featured-badge">MOST POPULAR</div>
                        )}

                        <h3 className="plan-name">{plan.name}</h3>

                        <div className="plan-price-box">
                            <span className="plan-currency">₹</span>
                            <span className="plan-price">{plan.price}</span>
                            <span className="plan-duration">
                                {plan.durationInMonths === 0 ? "/ forever" : `/ ${plan.durationInMonths} months`}
                            </span>
                        </div>

                        <ul className="plan-features">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="feature-item">
                                    <i className="fa-solid fa-circle-check feature-icon"></i>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            className="plan-btn"
                            onClick={() => handlePlanClick(plan)}
                        >
                            {plan.price === 0 ? "Get Started Free" : "Subscribe Now"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;
