import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyCourses } from "../../services/enrollmentService";
import "../../styles/student.css";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getMyCourses();
                if (res.success) {
                    setCourses(res.courses || []);
                }
            } catch (error) {
                console.error("Failed to load courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <div className="loading-spinner">Loading your courses...</div>;
    }

    return (
        <div className="student-courses-container">
            <div className="section-header">
                <h2>My Learning</h2>
                <p>Pick up where you left off.</p>
            </div>

            {courses.length === 0 ? (
                <div className="empty-state">
                    <i className="fa-solid fa-book-open" style={{ fontSize: "48px", color: "var(--text-muted)", marginBottom: "16px" }}></i>
                    <h3>No courses enrolled yet</h3>
                    <p>Explore our catalog to start learning.</p>
                    <Link to="/" className="browse-btn">
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="courses-grid">
                    {courses.map((enrollment) => (
                        <div key={enrollment._id} className="course-card-premium">

                            {/* Image Section */}
                            <div className="card-image-wrapper">
                                <img
                                    src={enrollment.course.image || "https://placehold.co/600x400?text=Course"}
                                    alt={enrollment.course.title}
                                    className="course-img"
                                />

                                <div className="overlay">
                                    <Link
                                        to={`/student/course/${enrollment.course._id}`}
                                        className="play-btn"
                                    >
                                        <i className="fa-solid fa-play"></i>
                                    </Link>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="card-content">
                                <div className="card-text">
                                    <h3 className="course-title">
                                        {enrollment.course.title}
                                    </h3>

                                    <p className="instructor-name">
                                        {enrollment.course.instructor
                                            ? `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`
                                            : "Unknown Instructor"}
                                    </p>

                                    <div className="progress-section">
                                        <span className="progress-text">
                                            {enrollment.progress || 0}% Complete
                                        </span>

                                        <div className="progress-bar-bg">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${enrollment.progress || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/student/course/${enrollment.course._id}`}
                                    className="continue-btn"
                                >
                                    Continue Learning
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default Courses;
