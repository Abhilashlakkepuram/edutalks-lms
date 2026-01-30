import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/helpcenter.css";

const faqs = [
    {
        q: "How do I enroll in a course?",
        a: "Go to the course page and click on Enroll. If the course is paid, complete the payment and you will get instant access."
    },
    {
        q: "Why is my lesson locked?",
        a: "Lessons unlock after you complete the previous lesson assessment successfully."
    },
    {
        q: "How does course progress work?",
        a: "Your progress updates automatically when you pass lesson assessments."
    },
    {
        q: "Can I retake an assessment?",
        a: "Yes. You can retake assessments anytime from the lesson page."
    },
    {
        q: "Will I lose progress if my plan expires?",
        a: "No. Your progress is saved. You just can’t access content until you renew."
    }
];

const HelpCenter = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="help-page">

            {/* HERO SEARCH */}
            <section className="help-hero">
                <h1>Hi, how can we help?</h1>
                <input
                    type="text"
                    placeholder="Search for help articles..."
                    className="help-search"
                />
            </section>

            {/* SUPPORT CATEGORIES */}
            <section className="help-categories">
                <div className="help-card">
                    <i className="fa-solid fa-user-graduate"></i>
                    <h3>Getting Started</h3>
                    <p>Account creation, login, dashboard usage</p>
                </div>

                <div className="help-card">
                    <i className="fa-solid fa-book-open-reader"></i>
                    <h3>Courses & Lessons</h3>
                    <p>Enrollments, lessons, assessments</p>
                </div>

                <div className="help-card">
                    <i className="fa-solid fa-credit-card"></i>
                    <h3>Payments & Plans</h3>
                    <p>Subscriptions, Razorpay, billing issues</p>
                </div>

                <div className="help-card">
                    <i className="fa-solid fa-certificate"></i>
                    <h3>Certificates</h3>
                    <p>Course completion & certificates</p>
                </div>
            </section>

            {/* POPULAR TOPICS */}
            <section className="help-topics">
                <h2>Popular Help Topics</h2>

                <div className="topics-grid">
                    <div>How to enroll in courses</div>
                    <div>Lesson progress not updating</div>
                    <div>Payment failed but money deducted</div>
                    <div>Reset password</div>
                    <div>Retake assessment</div>
                    <div>Download certificate</div>
                </div>
            </section>

            {/* FAQ ACCORDION */}
            <section className="help-faq">
                <h2>Frequently Asked Questions</h2>

                {faqs.map((item, index) => (
                    <div key={index} className="faq-item">
                        <div
                            className="faq-question"
                            onClick={() =>
                                setOpenIndex(openIndex === index ? null : index)
                            }
                        >
                            {item.q}
                            <i className={`fa-solid ${openIndex === index ? "fa-minus" : "fa-plus"}`}></i>
                        </div>

                        {openIndex === index && (
                            <div className="faq-answer">{item.a}</div>
                        )}
                    </div>
                ))}
            </section>

            {/* CONTACT CTA */}
            <section className="help-contact">
                <h2>Still need help?</h2>
                <p>Our support team is here to assist you.</p>
                <Link to="/contact" className="help-contact-btn">Contact Support</Link>
            </section>

        </div>
    );
};

export default HelpCenter;
