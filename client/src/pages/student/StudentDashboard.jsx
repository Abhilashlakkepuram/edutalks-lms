import { useEffect, useState } from "react";
import { getUser, getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import "../../styles/student.css";

const StudentDashboard = () => {
	const [user, setUser] = useState(null);
	const [courses, setCourses] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		// 🔐 1. Load logged-in user
		const userData = getUser();
		if (!userData) {
			navigate("/login");
			return;
		}
		setUser(userData);

		// 📚 2. Fetch enrolled courses
		const fetchCourses = async () => {
			try {
				const token = getToken();
				if (!token) {
					navigate("/login");
					return;
				}

				const res = await fetch(
					"http://localhost:5000/api/enrollments/my-courses",
					{
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				);

				if (!res.ok) {
					throw new Error("Failed to load courses");
				}

				const data = await res.json();
				if (data.success) {
					setCourses(data.courses);
				}
			} catch (error) {
				console.error("Dashboard error:", error);
			}
		};

		fetchCourses();
	}, [navigate]);

	return (
		<div className="student-page">
			<div className="dashboard-wrapper">
				{/* WELCOME */}
				<h1 className="dashboard-page-title">👨‍🎓 Student Dashboard</h1>
				<div className="dashboard-welcome student-welcome">
					<div className="welcome-content">
						<h2>Welcome back, {user?.firstName}! 🎓</h2>
						<p>Ready to continue learning today?</p>
					</div>

					<div className="welcome-date">
						{new Date().toLocaleDateString("en-US", {
							weekday: "long",
							day: "numeric",
							month: "long"
						})}
					</div>
				</div>

				{/* STATS */}
				<div className="dashboard-stats">
					<div className="stat-card">
						<h3>📚 Enrolled Courses</h3>
						<p className="stat-number">{courses.length}</p>
					</div>

					<div className="stat-card">
						<h3>✅ Completed</h3>
						<p className="stat-number">
							{courses.filter(c => c.progress === 100).length}
						</p>
					</div>

					<div className="stat-card">
						<h3>🏆 Certificates</h3>
						<p className="stat-number">
							{courses.filter(c => c.progress === 100).length}
						</p>
					</div>
				</div>

				{/* MY COURSES */}
				{/* MY COURSES */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
					<h3 className="section-heading" style={{ marginBottom: 0 }}>
						My Courses
					</h3>
					<button
						className="primary-btn"
						onClick={() => navigate("/")}
						style={{ fontSize: "14px", padding: "8px 16px" }}
					>
						Enroll in New Course
					</button>
				</div>

				{courses.length === 0 ? (
					<p style={{ color: "var(--text-secondary)" }}>You have not enrolled in any courses yet.</p>
				) : (
					courses.map(item => (
						<div key={item._id} className="student-course-card">
							<h4>{item.course.title}</h4>
							<p>Progress: {item.progress || 0}%</p>

							<button
								className="primary-btn"
								onClick={() =>
									navigate(`/student/course/${item.course._id}`)
								}
							>
								Continue Learning
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default StudentDashboard;
