import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import "../styles/navbar.css";

const Navbar = () => {
  const user = getUser();
  const navigate = useNavigate();

  const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "light");

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

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2>
          <i className="fa-solid fa-graduation-cap" style={{ marginRight: "10px", color: "var(--accent)" }}></i>
          <span style={{ color: "var(--accent)" }}>Edu</span>
          <span style={{ color: "var(--text-primary)" }}>Talks</span>
        </h2>
      </Link>

      <div className="nav-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          style={{ color: "var(--text-secondary)" }}
        >
          {theme === "light" ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
        </button>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        ) : (
          <>
            {user.role === "student" && (
              <>
                <Link to="/student/dashboard">Dashboard</Link>
                <Link to="/student/my-courses">My Courses</Link>
              </>
            )}

            {user.role === "instructor" && (
              <>
                <Link to="/instructor/dashboard">Dashboard</Link>
                <Link to="/instructor/my-courses">My Courses</Link>
                <Link to="/instructor/create-course">Create Course</Link>
              </>
            )}

            {user.role === "admin" && <Link to="/admin/dashboard">Dashboard</Link>}

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
