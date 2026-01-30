import { useEffect, useState } from "react";
import { getUser, getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/student.css";

const StudentDashboard = () => {
	const [user, setUser] = useState(null);
	const [courses, setCourses] = useState([]);
	const navigate = useNavigate();
	const { t } = useTranslation();

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
				<h1 className="dashboard-page-title">👨‍🎓 Student {t('dashboard')}</h1>
				<div className="dashboard-welcome student-welcome">
					<div className="welcome-content">
						<h2>
							{t('welcomeBack')}, {user?.firstName}! 🎓
						</h2>
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

				{/* MY COURSES HEADER */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
					<h3 className="section-heading" style={{ marginBottom: 0 }}>
						My Courses
					</h3>
					<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
						<button
							className="primary-btn"
							onClick={() => navigate("/")}
							style={{ fontSize: "14px", padding: "8px 16px" }}
						>
							Enroll New
						</button>
					</div>
				</div>

				{courses.length === 0 ? (
					<div className="empty-dashboard-state">
						<p style={{ color: "var(--text-secondary)" }}>You have not enrolled in any courses yet.</p>
					</div>
				) : (
					<div className="dashboard-courses-grid">
						{courses.slice(0, 3).map(item => (
							<div
								key={item._id}
								className="student-course-card"
								onClick={() => navigate(`/student/course/${item.course._id}`)}
							>
								<div className="card-image-wrapper">
									<img
										src={item.course?.image && item.course?.image !== "" ? item.course.image : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
										alt={item.course?.title}
										className="course-img"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60";
										}}
									/>
									<div className="overlay">
										<div className="play-btn">
											<i className="fa-solid fa-play"></i>
										</div>
									</div>
								</div>

								<div className="card-content">
									<h4 className="course-title">{item.course.title}</h4>
									<p className="instructor-name">
										{item.course?.instructor?.firstName} {item.course?.instructor?.lastName}
									</p>

									<div className="progress-section">
										<div className="progress-labels">
											<span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Progress</span>
											<span style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: "bold" }}>{item.progress || 0}%</span>
										</div>
										<div className="progress-bar-bg">
											<div
												className="progress-bar-fill"
												style={{ width: `${item.progress || 0}%` }}
											></div>
										</div>
									</div>

									<button className="continue-btn" style={{ width: "100%", marginTop: "15px", textAlign: "center" }}>
										Continue
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default StudentDashboard;
