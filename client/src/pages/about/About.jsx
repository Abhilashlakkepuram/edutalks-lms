import React from "react";
import "../../styles/about.css";

const About = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>Empowering Your Future</h1>
                <p>
                    EduTalks is dedicated to democratizing education by providing high-quality,
                    accessible learning resources to everyone, everywhere.
                </p>
            </div>

            <section className="mission-section">
                <div className="mission-content">
                    <h2>Our Mission</h2>
                    <p>
                        At EduTalks, we believe that education is the key to unlocking human potential.
                        We strive to bridge the gap between curiosity and expertise by connecting
                        passionate instructors with eager learners.
                    </p>
                    <p>
                        Whether you are looking to upskill for a new career, explore a hobby,
                        or simply learn something new, we provide the platform and community
                        to support your journey.
                    </p>
                </div>
                <div className="mission-image">
                    <i className="fa-solid fa-lightbulb"></i>
                </div>
            </section>

            <div className="stats-section">
                <div className="stat-item">
                    <span className="stat-number">10k+</span>
                    <span className="stat-label">Students</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Courses</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">200+</span>
                    <span className="stat-label">Instructors</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Countries</span>
                </div>
            </div>

            <section className="offerings-section">
                <h2>What We Offer</h2>
                <div className="offerings-grid">
                    <div className="offering-card">
                        <div className="offering-icon">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        <h3>Expert Instructors</h3>
                        <p>
                            Learn from industry experts who are passionate about sharing their
                            knowledge and experience.
                        </p>
                    </div>

                    <div className="offering-card">
                        <div className="offering-icon">
                            <i className="fa-solid fa-laptop-code"></i>
                        </div>
                        <h3>Hands-on Learning</h3>
                        <p>
                            Gain practical skills through project-based learning and interactive
                            assignments.
                        </p>
                    </div>

                    <div className="offering-card">
                        <div className="offering-icon">
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <h3>Community Support</h3>
                        <p>
                            Join a vibrant community of learners to share ideas, ask questions,
                            and grow together.
                        </p>
                    </div>

                    <div className="offering-card">
                        <div className="offering-icon">
                            <i className="fa-solid fa-certificate"></i>
                        </div>
                        <h3>Certification</h3>
                        <p>
                            Earn recognized certificates upon course completion to showcase your
                            skills to employers.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
