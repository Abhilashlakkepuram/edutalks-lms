import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "../../styles/plans.css";


const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handlePlanClick = async (plan) => {
        const token = getToken();
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/subscriptions/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ planId: plan._id })
            });

            const data = await res.json();
            if (data.success) {
                // Redirect to dashboard after successful subscription
                navigate("/student/dashboard");
            } else {
                alert(data.message || "Subscription failed");
            }
        } catch (error) {
            console.error("Subscription error:", error);
            alert("Something went wrong");
        }
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/plans");
                const data = await res.json();
                if (data.success) {
                    setPlans(data.plans.filter(plan => plan.price > 0));
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

            {/* HERO */}
            <section className="plans-hero udemy-style">
                <h1>Choose a plan for your learning journey</h1>
                <p>
                    Unlock your potential with our flexible subscription options. Cancel anytime.
                </p>
            </section>

            {/* PRICING CARDS */}
            <div className="plans-grid udemy-style-grid">
                {plans.map((plan) => (
                    <div
                        key={plan._id}
                        className={`plan-card udemy-card ${plan.name.includes("Pro") ? "featured" : ""}`}
                    >
                        {plan.name.includes("Pro") && (
                            <div className="best-seller-badge">Bestseller</div>
                        )}

                        <div className="card-header">
                            <h3 className="plan-name">{plan.name}</h3>
                            <p className="plan-audience">For ambitious learners</p>
                        </div>

                        <div className="plan-price-box">
                            <span className="plan-currency">₹</span>
                            <span className="plan-price">{plan.price}</span>
                            <span className="plan-period">/ month</span>
                        </div>

                        <button
                            className="plan-btn udemy-btn"
                            onClick={() => handlePlanClick(plan)}
                        >
                            {plan.price === 0 ? "Get Started" : "Start Subscription"}
                        </button>
                        <p className="cancel-text">Cancel anytime</p>

                        <div className="features-container">
                            <p className="features-title">Everything in this plan:</p>
                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="feature-item">
                                        <i className="fa-solid fa-check feature-icon"></i>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* FEATURE COMPARISON */}
            <section className="plans-comparison">
                <h2 className="comparison-title">Compare Plans</h2>
                <p className="comparison-subtitle">Find the perfect plan for your learning needs.</p>

                <div className="comparison-container">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th className="feature-header">Features</th>
                                {plans.map(plan => (
                                    <th key={plan._id} className={`plan-header ${plan.name.includes("Pro") ? "recommended" : ""}`}>
                                        {plan.name}
                                        {plan.name.includes("Pro") && <span className="recommended-badge">Recommended</span>}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { category: "Content Access", items: ["Unlimited Course Access", "HD Video Lessons", "Downloadable Resources", "Source Code Access"] },
                                { category: "Assessment & Practice", items: ["Lesson Assessments", "Coding Challenges", "Captsone Projects", "Real-world Exams"] },
                                { category: "Support & Certification", items: ["Certificate of Completion", "Priority Support", "Community Access", "1-on-1 Mentorship"] }
                            ].map((section, sIndex) => (
                                <>
                                    <tr key={`section-${sIndex}`} className="section-row">
                                        <td colSpan={plans.length + 1}>{section.category}</td>
                                    </tr>
                                    {section.items.map((feature, fIndex) => (
                                        <tr key={`feature-${sIndex}-${fIndex}`}>
                                            <td className="feature-name">{feature}</td>
                                            {plans.map(plan => {
                                                let hasFeature = false;
                                                const lowerName = plan.name.toLowerCase();
                                                const lowerFeature = feature.toLowerCase();

                                                if (lowerName.includes("pro") || lowerName.includes("premium")) {
                                                    hasFeature = true;
                                                } else if (lowerName.includes("free")) {
                                                    if (["unlimited course access", "lesson assessments", "community access"].includes(lowerFeature)) {
                                                        hasFeature = true;
                                                    }
                                                } else {
                                                    if (!["1-on-1 mentorship", "captsone projects"].includes(lowerFeature)) {
                                                        hasFeature = true;
                                                    }
                                                }

                                                return (
                                                    <td key={`${plan._id}-${feature}`} className="feature-status">
                                                        {hasFeature ? (
                                                            <i className="fa-solid fa-circle-check check-icon"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-circle-xmark cross-icon"></i>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FAQ */}
            <section className="plans-faq">
                <h2 className="faq-title">Frequently Asked Questions</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h4>Can I upgrade my plan later?</h4>
                        <p>Yes. You can upgrade anytime from your dashboard. The price difference will be adjusted automatically.</p>
                    </div>

                    <div className="faq-item">
                        <h4>Will I lose progress if my plan expires?</h4>
                        <p>No. Your progress is saved securely. You just won’t be able to access premium lessons until you renew.</p>
                    </div>

                    <div className="faq-item">
                        <h4>Do I get a certificate?</h4>
                        <p>Yes! Every course includes a certificate of completion that you can share on LinkedIn and your resume.</p>
                    </div>

                    <div className="faq-item">
                        <h4>What happens after I subscribe?</h4>
                        <p>You get instant access to all courses and features. You can start learning immediately.</p>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="plans-cta">
                <div className="cta-content">
                    <h2>Start learning today</h2>
                    <p>Join thousands of students and become a job-ready developer with EduTalks.</p>
                    <button
                        className="cta-btn"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        Choose a Plan
                    </button>
                </div>
            </section>
        </div>
    );

};

export default Plans;
