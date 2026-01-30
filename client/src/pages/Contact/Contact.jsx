import React from "react";
import "../../styles/contact.css";

const Contact = () => {
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

                    <form className="contact-form">
                        <div className="form-row">
                            <input type="text" placeholder="Full Name" required />
                            <input type="email" placeholder="Email Address" required />
                        </div>

                        <select>
                            <option>Choose topic</option>
                            <option>Course Issue</option>
                            <option>Subscription Issue</option>
                            <option>Technical Problem</option>
                            <option>General Query</option>
                        </select>

                        <textarea rows="6" placeholder="Describe your issue..." required />

                        <button type="submit">Submit Request</button>
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
