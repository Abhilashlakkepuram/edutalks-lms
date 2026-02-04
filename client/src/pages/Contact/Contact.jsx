import React, { useState } from "react";
import "../../styles/contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        topic: "General Query",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // success | error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setStatus("success");
                setFormData({ name: "", email: "", phone: "", topic: "General Query", message: "" });
                alert("Message sent successfully!");
            } else {
                setStatus("error");
                alert(data.message || "Failed to send message.");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">

            {/* HERO */}
            <section className="contact-hero">
                <h1>Contact EduTalks Support</h1>
                <p>
                    Need help with courses, subscriptions, or your account?
                    Our team is ready to assist you.
                </p>
            </section>

            {/* SUPPORT OPTIONS */}
            <section className="support-options">
                <div className="support-card">
                    <i className="fa-solid fa-circle-question"></i>
                    <h3>Help Center</h3>
                    <p>Find answers to common questions and guides.</p>
                </div>

                <div className="support-card">
                    <i className="fa-solid fa-envelope-open-text"></i>
                    <h3>Email Support</h3>
                    <p>support@edutalks.com</p>
                </div>

                <div className="support-card">
                    <i className="fa-solid fa-phone-volume"></i>
                    <h3>Call Us</h3>
                    <p>+91 98765 43210</p>
                </div>

                <div className="support-card">
                    <i className="fa-solid fa-comments"></i>
                    <h3>Live Chat</h3>
                    <p>Chat with our support team (9AM – 6PM IST)</p>
                </div>
            </section>

            {/* CONTACT FORM */}
            <section className="contact-form-section">
                <div className="form-left">
                    <h2>Send us a message</h2>
                    <p>
                        Fill the form and our team will get back to you within 24 hours.
                    </p>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* ADDED PHONE NUMBER FIELD */}
                        <div className="form-row" style={{ marginTop: "15px" }}>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                style={{ width: "100%" }}
                                required
                            />
                        </div>

                        <select
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            style={{ marginTop: "15px" }}
                        >
                            <option value="Course Issue">Course Issue</option>
                            <option value="Subscription Issue">Subscription Issue</option>
                            <option value="Technical Problem">Technical Problem</option>
                            <option value="General Query">General Query</option>
                        </select>

                        <textarea
                            name="message"
                            rows="6"
                            placeholder="Describe your issue..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Submit Request"}
                        </button>
                    </form>
                </div>

                <div className="form-right">
                    <h3>EduTalks Headquarters</h3>
                    <p>Hyderabad, India</p>

                    <h4>Working Hours</h4>
                    <p>Monday – Saturday</p>
                    <p>9:00 AM – 6:00 PM IST</p>

                    <div className="social-links">
                        <i className="fa-brands fa-linkedin"></i>
                        <i className="fa-brands fa-twitter"></i>
                        <i className="fa-brands fa-instagram"></i>
                    </div>
                </div>
            </section>

            {/* TRUST SECTION */}
            <section className="contact-trust">
                <h2>Trusted by 1000+ learners across India</h2>
                <p>
                    EduTalks helps students become job-ready with structured courses,
                    real assessments and certificates.
                </p>
            </section>

        </div>
    );
};

export default Contact;
