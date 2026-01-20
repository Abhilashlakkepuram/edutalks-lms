import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser, isLoggedIn } from "../utils/auth";
import "../styles/base.css";
import BackButton from "../components/BackButton";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        const data = await res.json();
        if (data.success) {
          setCourse(data.course);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = () => {
    if (!isLoggedIn()) {
      navigate("/register", {
        state: { redirectTo: `/payment/${courseId}` }
      });
      return;
    }

    const user = getUser();
    if (!user || user.role !== "student") {
      alert("Only students can enroll");
      return;
    }

    navigate(`/payment/${courseId}`);
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>;
  if (!course) return <div style={{ padding: "40px" }}>Course not found</div>;

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <BackButton />
      <div className="course-header" style={{ marginBottom: "30px" }}>
        <img
          src={course.image || "https://via.placeholder.com/800x400"}
          alt={course.title}
          className="course-detail-img"
        />

        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>{course.title}</h1>
        <p style={{ color: "#666", fontSize: "18px", marginBottom: "20px" }}>
          Created by {course.instructor?.firstName} {course.instructor?.lastName}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "#4f46e5" }}>
            ₹{course.price}
          </span>
          <button onClick={handleEnroll} className="primary-btn">
            Enroll Now
          </button>
        </div>
      </div>

      <div className="course-description">
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "20px" }}>About this Course</h3>
        <p style={{ lineHeight: "1.6", color: "#374151", marginBottom: "40px" }}>{course.description}</p>

        {/* ✅ SYLLABUS SECTION */}
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "20px" }}>Course Content</h3>
        <div className="lesson-list">
          {course.lessons && course.lessons.length > 0 ? (
            course.lessons.map((lesson, index) => (
              <div key={lesson._id} className="lesson-item-public">
                <div className="lesson-info">
                  <span className="lesson-number">{index + 1}</span>
                  <span className="lesson-title">{lesson.title}</span>
                </div>
                <span className="lock-icon">🔒</span>
              </div>
            ))
          ) : (
            <p style={{ color: "#666", fontStyle: "italic" }}>No lessons added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
