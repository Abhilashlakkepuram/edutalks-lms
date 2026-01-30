import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getToken, getUser } from "../../utils/auth";
import "../../styles/admin.css";

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeView, setActiveView] = useState("courses"); // courses, users, students, instructors

    useEffect(() => {
        const load = async () => {
            try {
                const token = getToken();
                if (!token) return;

                const headers = { Authorization: `Bearer ${token}` };

                // Parallel fetching
                const [statsRes, coursesRes, usersRes] = await Promise.all([
                    fetch("http://localhost:5000/api/admin/stats", { headers }),
                    fetch("http://localhost:5000/api/admin/courses", { headers }),
                    fetch("http://localhost:5000/api/admin/users", { headers })
                ]);

                const statsData = await statsRes.json();
                const coursesData = await coursesRes.json();
                const usersData = await usersRes.json();

                if (statsData.success) setStats(statsData.stats);
                if (coursesData.success) setCourses(coursesData.courses);
                if (usersData.success) setUsers(usersData.users);

            } catch (err) {
                console.error("Dashboard Load Error:", err);
            }
        };

        load();
    }, []);

    const handleInputChange = (id, field, value) => {
        let newValue = value;
        if (field === "discount") {
            if (newValue < 0) newValue = 0;
            if (newValue > 100) newValue = 100;
        }

        setCourses(courses.map(course =>
            course._id === id ? { ...course, [field]: newValue } : course
        ));
    };

    const updatePrice = async (id) => {
        const course = courses.find(c => c._id === id);
        if (!course) return;

        const token = getToken();

        try {
            const res = await fetch(`http://localhost:5000/api/admin/course/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ price: course.price, discount: course.discount })
            });

            if (!res.ok) throw new Error("Update failed");

            alert("✅ Price & Discount Updated Successfully");
        } catch (err) {
            alert("❌ Failed to update");
        }
    };

    const deleteCourse = async (id) => {
        const token = getToken();
        await fetch(`http://localhost:5000/api/admin/course/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        setCourses(courses.filter((c) => c._id !== id));
    };

    // Filter users based on active view
    const getFilteredUsers = () => {
        if (activeView === "students") return users.filter(u => u.role === "student");
        if (activeView === "instructors") return users.filter(u => u.role === "instructor");
        return users;
    };

    const user = getUser();

    return (
        <div className="admin-page">
            <h1 className="dashboard-page-title">🛡️ Admin {t('dashboard')}</h1>
            <div className="dashboard-welcome">
                <div className="welcome-content">
                    <h2>{t('welcomeBack')}, {user?.firstName} {user?.lastName} 👋</h2>
                    <p>Manage your platform, users, and courses from one place.</p>
                </div>
                <div className="welcome-date">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </div>

            {!stats ? (
                <div className="loading-spinner">Loading dashboard data...</div>
            ) : (
                <>
                    {/* STATS CARDS */}
                    <div className="admin-stats">
                        <div
                            className={`stat-card active-users ${activeView === "users" ? "active-card" : ""}`}
                            onClick={() => setActiveView("users")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="stat-label">Total Users</span>
                            <span className="stat-value">{stats.totalUsers}</span>
                        </div>
                        <div
                            className={`stat-card active-students ${activeView === "students" ? "active-card" : ""}`}
                            onClick={() => setActiveView("students")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="stat-label">Students</span>
                            <span className="stat-value text-blue">{stats.students}</span>
                        </div>
                        <div
                            className={`stat-card active-instructors ${activeView === "instructors" ? "active-card" : ""}`}
                            onClick={() => setActiveView("instructors")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="stat-label">Instructors</span>
                            <span className="stat-value text-purple">{stats.instructors}</span>
                        </div>
                        <div
                            className={`stat-card active-courses ${activeView === "courses" ? "active-card" : ""}`}
                            onClick={() => setActiveView("courses")}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="stat-label">Total Courses</span>
                            <span className="stat-value text-pink">{stats.totalCourses}</span>
                        </div>
                    </div>

                    {/* DYNAMIC TABLE SECTION */}
                    <div className="section-title">
                        <h3>
                            {activeView === "courses" && "All Courses"}
                            {activeView === "users" && "All Users"}
                            {activeView === "students" && "Students Directory"}
                            {activeView === "instructors" && "Instructor Directory"}
                        </h3>
                    </div>

                    <div className="table-container">
                        {activeView === "courses" ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Course Title</th>
                                        <th>Instructor</th>
                                        <th>Price (₹)</th>
                                        <th>Discount (%)</th>
                                        <th>Final Fee</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>No courses found.</td></tr>
                                    ) : (
                                        courses.map((course) => (
                                            <tr key={course._id}>
                                                <td style={{ fontWeight: "600" }}>{course.title}</td>
                                                <td>
                                                    <div className="user-name-wrapper">
                                                        <div className="avatar-circle avatar-red">
                                                            {course.instructor?.firstName?.[0] || "U"}
                                                        </div>
                                                        {course.instructor?.firstName} {course.instructor?.lastName}
                                                    </div>
                                                </td>
                                                <td>
                                                    <input
                                                        className="table-input"
                                                        type="number"
                                                        value={course.price}
                                                        onChange={(e) => handleInputChange(course._id, "price", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className="table-input"
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={course.discount || 0}
                                                        onFocus={(e) => e.target.select()}
                                                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                                        onChange={(e) => handleInputChange(course._id, "discount", e.target.value)}
                                                        style={{ width: "80px", textAlign: "center" }}
                                                    />
                                                </td>
                                                <td className="status-text status-verified">
                                                    ₹{Math.round(Number(course.price) * (1 - (Number(course.discount) || 0) / 100))}
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <button className="primary-btn" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={() => updatePrice(course._id)}>Update</button>
                                                        <button className="delete-btn" onClick={() => { if (window.confirm("Delete course?")) deleteCourse(course._id); }}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilteredUsers().length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: "center", padding: "30px" }}>No users found.</td></tr>
                                    ) : (
                                        getFilteredUsers().map((user) => (
                                            <tr key={user._id}>
                                                <td>
                                                    <div className="user-name-wrapper">
                                                        <div className="avatar-circle avatar-indigo">
                                                            {user.firstName?.[0] || "U"}
                                                        </div>
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className={`role-badge role-${user.role}`}>
                                                        {user.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-text ${user.isVerified ? "status-verified" : "status-pending"}`}>
                                                        {user.isVerified ? "Verified" : "Pending"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
