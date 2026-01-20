import { Link } from "react-router-dom";
import "../../styles/instructor.css";
import { getUser, getToken } from "../../utils/auth";
import { useEffect, useState } from "react";

const InstructorDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    courses: 0,
    lessons: 0,
    students: 0
  });

  useEffect(() => {
    const userData = getUser();
    setUser(userData);

    // Fetch Stats
    const fetchStats = async () => {
      const token = getToken();
      try {
        const res = await fetch("http://localhost:5000/api/instructor/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="instructor-page">
      <div className="dashboard-wrapper">
        <h1 className="dashboard-page-title">👨‍🏫 Instructor Dashboard</h1>
        <div className="dashboard-welcome">
          <div className="welcome-content">
            <h2>Welcome back, {user?.firstName}! 👋</h2>
            <p>Here is what’s happening with your courses today.</p>
          </div>
          <div className="welcome-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        {/* STATS */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>📘 Courses</h3>
            <p className="stat-number">{stats.courses}</p>
          </div>

          <div className="stat-card">
            <h3>🎥 Lessons</h3>
            <p className="stat-number">{stats.lessons}</p>
          </div>

          <div className="stat-card">
            <h3>👨‍🎓 Students</h3>
            <p className="stat-number">{stats.students}</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="dashboard-actions">
          <Link to="/instructor/create-course" className="primary-btn">
            + Create Course
          </Link>

          <Link to="/instructor/my-courses" className="secondary-btn">
            View My Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
