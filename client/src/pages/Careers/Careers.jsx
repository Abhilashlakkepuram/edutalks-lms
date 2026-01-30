import React from "react";
import "../../styles/careers.css";

const Careers = () => {
    return (
        <div className="careers-page">

            {/* HERO */}
            <section className="careers-hero">
                <h1>Build the Future of Learning with EduTalks</h1>
                <p>
                    We are on a mission to transform online education from passive
                    watching to active learning. Join us in shaping the next generation
                    of learners and developers.
                </p>
            </section>

            {/* WHY WORK WITH US */}
            <section className="careers-why">
                <h2>Why Work at EduTalks?</h2>
                <div className="why-grid">
                    <div className="why-card">
                        <h3>🚀 Fast Growing EdTech</h3>
                        <p>Be part of a startup redefining how students learn online.</p>
                    </div>
                    <div className="why-card">
                        <h3>💡 Innovation First</h3>
                        <p>We solve real problems in online learning with smart systems.</p>
                    </div>
                    <div className="why-card">
                        <h3>🌍 Remote Friendly</h3>
                        <p>Work from anywhere and collaborate with a passionate team.</p>
                    </div>
                    <div className="why-card">
                        <h3>📈 Career Growth</h3>
                        <p>Grow with us as we scale and expand globally.</p>
                    </div>
                </div>
            </section>

            {/* TEAMS */}
            <section className="careers-teams">
                <h2>Teams at EduTalks</h2>
                <div className="teams-grid">
                    <div>👨‍💻 Engineering</div>
                    <div>🎨 Design</div>
                    <div>📚 Content & Curriculum</div>
                    <div>📢 Marketing</div>
                    <div>🤝 Support</div>
                    <div>🧠 Product</div>
                </div>
            </section>

            {/* PERKS */}
            <section className="careers-perks">
                <h2>Perks & Benefits</h2>
                <div className="perks-grid">
                    <div>💻 Latest Equipment</div>
                    <div>🏖 Flexible Working Hours</div>
                    <div>📚 Learning Budget</div>
                    <div>🧘 Health & Wellness Support</div>
                    <div>🎉 Team Retreats</div>
                    <div>📈 Performance Bonuses</div>
                </div>
            </section>

            {/* OPEN POSITIONS */}
            <section className="careers-openings">
                <h2>Open Positions</h2>

                <div className="job-card">
                    <h3>Full Stack Developer (MERN)</h3>
                    <p>Remote • Full Time • 2+ Years Experience</p>
                    <button>Apply Now</button>
                </div>

                <div className="job-card">
                    <h3>UI/UX Designer</h3>
                    <p>Remote • Full Time • 1+ Years Experience</p>
                    <button>Apply Now</button>
                </div>

                <div className="job-card">
                    <h3>Technical Content Creator</h3>
                    <p>Remote • Part Time</p>
                    <button>Apply Now</button>
                </div>
            </section>

            {/* CTA */}
            <section className="careers-cta">
                <h2>Don’t see a role that fits?</h2>
                <p>Send us your resume and we’ll reach out when there’s a match.</p>
                <button>careers@edutalks.com</button>
            </section>

        </div>
    );
};

export default Careers;
