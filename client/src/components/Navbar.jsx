import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import { useTranslation } from "react-i18next";
import "../styles/navbar.css";

const Navbar = () => {
  const user = getUser();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );

  // Initialize language from localStorage or default to 'en'
  // But i18n usually handles this with the detector.
  // We just need state for visual UI if needed, but i18n.language is truth.

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2>
          <i
            className="fa-solid fa-graduation-cap"
            style={{ marginRight: "10px", color: "var(--accent)" }}
          ></i>
          <span style={{ color: "var(--accent)" }}>Edu</span>
          <span style={{ color: "var(--text-primary)" }}>Talks</span>
        </h2>
      </Link>

      <div className="nav-actions">
        {/* Language Switcher */}
        <div className="language-switcher">
          <i className="fa-solid fa-globe"></i>
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">ENGLISH</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          style={{ color: "var(--text-secondary)" }}
        >
          {theme === "light" ? (
            <i className="fa-solid fa-moon"></i>
          ) : (
            <i className="fa-solid fa-sun"></i>
          )}
        </button>

        {!user ? (
          <>
            <Link to="/plans">Plans</Link>
            <Link to="/login">{t('login')}</Link>
            <Link to="/register">{t('register')}</Link>
          </>
        ) : (
          <>
            {user.role === "student" && (
              <>
                <Link to="/student/dashboard">{t('dashboard')}</Link>
                <Link to="/student/my-courses">{t('myCourses')}</Link>
                <Link to="/plans">Plans</Link>
              </>
            )}

            {user.role === "instructor" && (
              <>
                <Link to="/instructor/dashboard">{t('dashboard')}</Link>
                <Link to="/instructor/my-courses">{t('myCourses')}</Link>
                <Link to="/instructor/create-course">{t('createCourse')}</Link>
              </>
            )}

            {user.role === "admin" && (
              <Link to="/admin/dashboard">{t('dashboard')}</Link>
            )}

            <button onClick={handleLogout} className="logout-btn">
              {t('logout')}
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
