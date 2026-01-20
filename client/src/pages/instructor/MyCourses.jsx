import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/instructor.css";
import { getToken } from "../../utils/auth";

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const token = getToken();

            try {
                const res = await fetch("http://localhost:5000/api/courses/my", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();
                console.log("MyCourses data:", data);
                setCourses(data.courses || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="instructor-page">
            <div className="my-courses-wrapper">
                <div className="my-courses-header">
                    <h2>My Courses</h2>
                    <Link to="/instructor/create-course" className="primary-btn">
                        + Create Course
                    </Link>
                </div>

                {loading && <p>Loading courses...</p>}

                {!loading && courses.length === 0 && (
                    <p>No courses created yet.</p>
                )}

                <div className="course-card-grid">
                    {courses.map((course) => (
                        <div key={course._id} className="course-manage-card">
                            <h3>{course.title}</h3>
                            <p className="course-desc">
                                {course.description}
                            </p>

                            <div className="course-meta-row">
                                <span>₹ {course.price}</span>
                                <span>{course.category}</span>
                            </div>

                            <div className="course-actions">
                                <Link
                                    to={`/instructor/create-lesson/${course._id}`}
                                    className="secondary-btn"
                                >
                                    Add Lessons
                                </Link>

                                {/* Future actions */}
                                {/* <button className="danger-btn">Delete</button> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
