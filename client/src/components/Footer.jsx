import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <h2 className="footer-logo">EduTalks</h2>
                        <p>Empowering learners worldwide with accessible, high-quality accessible education.</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h3>Learn</h3>
                            <ul>
                                <li><Link to="/plans">Plans</Link></li>
                                <li><Link to="/courses">Courses</Link></li>
                                <li><Link to="/bootcamps">Bootcamps</Link></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Company</h3>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/careers">Careers</Link></li>
                                <li><Link to="/blog">Blog</Link></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Support</h3>
                            <ul>
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/help">Help Center</Link></li>
                                <li><Link to="/terms">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} EduTalks. All rights reserved.</p>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/edutalkspvt"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="https://in.linkedin.com/company/edutalks-pvt-ltd"><i className="fa-brands fa-twitter"></i></a>
                        <a href="https://in.linkedin.com/company/edutalks-pvt-ltd"><i className="fa-brands fa-linkedin-in"></i></a>
                        <a href="https://www.instagram.com/p/DM3XfByh9M8/"><i className="fa-brands fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
