import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "../../styles/student.css";

const StudentMyCourses = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const res = await fetch("http://localhost:5000/api/enrollments/my-courses", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            const data = await res.json();
            if (data.success) setCourses(data.courses);
        };

        load();
    }, []);

    return (
        <div className="student-courses-container">
            <div className="section-header">
                <h2>My Learning</h2>
                <p>Track your progress and continue learning.</p>
            </div>

            {courses.length === 0 ? (
                <div className="empty-state">
                    <h3>You haven't enrolled in any courses yet.</h3>
                    <p>Start your learning journey today by exploring our catalog.</p>
                    <Link to="/" className="browse-btn">Browse Courses</Link>
                </div>
            ) : (
                <div className="courses-grid">
                    {courses.map((item) => (
                        <div key={item._id} className="course-card-premium" onClick={() => item.course?._id && navigate(`/student/course/${item.course._id}`)}>
                            <div className="card-image-wrapper">
                                <img
                                    src={item.course?.image && item.course?.image !== "" ? item.course.image : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
                                    alt={item.course?.title}
                                    className="course-img"
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
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
                                <h3 className="course-title">{item.course?.title || "Untitled Course"}</h3>
                                <p className="instructor-name">
                                    {item.course?.instructor?.firstName} {item.course?.instructor?.lastName}
                                </p>

                                <div className="progress-section">
                                    <div className="progress-labels">
                                        <span>Progress</span>
                                        <span>{item.progress || 0}%</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${item.progress || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <button className="continue-btn">
                                    Continue Learning
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentMyCourses;
