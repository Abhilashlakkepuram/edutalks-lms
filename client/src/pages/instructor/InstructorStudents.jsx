import { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import "../../styles/instructor.css"; // Reusing instructor styles or create new
import { useTranslation } from "react-i18next";

import BackButton from "../../components/BackButton";

const InstructorStudents = () => {
    const { t } = useTranslation();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = getToken();
                const res = await fetch("http://localhost:5000/api/instructor/students", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setStudents(data.students);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div className="instructor-page">
            <div className="dashboard-wrapper">
                <div style={{ marginBottom: "20px" }}>
                    <BackButton to="/instructor/dashboard" label="Back to Dashboard" />
                </div>
                <h1 className="dashboard-page-title">👨‍🎓 My Students</h1>

                <div className="dashboard-welcome" style={{ marginBottom: "30px" }}>
                    <div className="welcome-content">
                        <h2>Track Student Progress</h2>
                        <p>View all students enrolled in your courses.</p>
                    </div>
                </div>

                {loading ? (
                    <p>Loading students...</p>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Enrolled Course</th>
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((item) => (
                                        <tr key={item._id}>
                                            <td style={{ fontWeight: "600" }}>
                                                <div className="user-name-wrapper">
                                                    <div className="avatar-circle avatar-blue">
                                                        {item.student?.firstName?.[0] || "?"}
                                                    </div>
                                                    {item.student ? `${item.student.firstName} ${item.student.lastName}` : "Unknown Student"}
                                                </div>
                                            </td>
                                            <td>{item.student?.email}</td>
                                            <td>{item.course?.title}</td>
                                            <td>
                                                <div className="progress-bar-bg" style={{ width: "120px", height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                                                    <div
                                                        style={{
                                                            width: `${item.progress}%`,
                                                            height: "100%",
                                                            background: item.progress === 100 ? "#10b981" : "#4f46e5",
                                                            transition: "width 0.3s ease"
                                                        }}
                                                    ></div>
                                                </div>
                                                <span style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px", display: "block" }}>
                                                    {item.progress}% Completed
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorStudents;
