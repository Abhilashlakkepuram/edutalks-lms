import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser, isLoggedIn, getToken } from "../utils/auth";
import "../styles/coursedetail.css"; // Import the new CSS
import BackButton from "../components/BackButton";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

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

    const checkEnrollment = async () => {
      if (!isLoggedIn()) return;

      try {
        const token = getToken();
        const res = await fetch(`http://localhost:5000/api/enrollments/${courseId}/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.isEnrolled) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error("Check enrollment error:", error);
      }
    };

    fetchCourse();
    checkEnrollment();
  }, [courseId]);

  const handleEnroll = () => {
    if (isEnrolled) {
      navigate(`/student/course/${courseId}`);
      return;
    }

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

  if (loading) return <div className="loading-container">Loading...</div>;
  if (!course) return <div className="error-container">Course not found</div>;

  const originalPrice = course.price;
  const discount = course.discount || 0;
  const finalPrice = Math.round(originalPrice * (1 - discount / 100));

  return (
    <div className="cd-course-detail-page">
      {/* Hero Section */}
      <div className="cd-hero">
        <div className="cd-hero-content">
          <div className="cd-hero-text">
            <BackButton />
            <h1 className="cd-hero-title">{course.title}</h1>
            <p className="cd-hero-description">{course.description && course.description.substring(0, 150)}...</p>
            <div className="cd-hero-meta">
              <span>Created by <span className="cd-instructor-name">{course.instructor?.firstName} {course.instructor?.lastName}</span></span>
              <span><i className="fa-solid fa-calendar-days"></i> Last updated {new Date(course.updatedAt || Date.now()).toLocaleDateString()}</span>
              <span><i className="fa-solid fa-globe"></i> English</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cd-content-wrapper">
        {/* Left Column */}
        <div className="cd-main-content">
          {/* About Course */}
          <div className="cd-about-section">
            <h3 className="cd-section-title">About this Course</h3>
            <p className="cd-about-text">{course.description}</p>
          </div>

          {/* Syllabus */}
          <div className="cd-syllabus-section">
            <h3 className="cd-section-title">Course Content</h3>
            <div className="cd-lesson-list">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, index) => (
                  <div key={lesson._id} className="cd-lesson-item">
                    <div className="cd-lesson-info">
                      <span className="cd-lesson-number">{index + 1}</span>
                      <span className="cd-lesson-title">{lesson.title}</span>
                    </div>
                    <span className="cd-lock-icon"><i className="fa-solid fa-lock"></i></span>
                  </div>
                ))
              ) : (
                <p style={{ padding: "20px", color: "#666", fontStyle: "italic", textAlign: "center" }}>No lessons added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="cd-sidebar-content">
          <div className="cd-enrollment-card">
            <img
              src={course.image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
              alt={course.title}
              className="cd-course-preview-img"
            />
            <div className="cd-card-body">
              <div className="cd-price-container">
                <span className="cd-current-price">₹{finalPrice}</span>
                {discount > 0 && (
                  <>
                    <span className="cd-original-price">₹{originalPrice}</span>
                    <span className="cd-discount-tag">{discount}% OFF</span>
                  </>
                )}
              </div>

              <button onClick={handleEnroll} className={`cd-enroll-btn ${isEnrolled ? "enrolled-btn" : ""}`}>
                {isEnrolled ? "Go to Course" : "Enroll Now"}
              </button>

              <ul className="cd-course-features">
                <li><i className="fa-solid fa-infinity cd-feature-icon"></i> Full lifetime access</li>
                <li><i className="fa-solid fa-mobile-screen cd-feature-icon"></i> Access on mobile and desktop</li>
                <li><i className="fa-solid fa-trophy cd-feature-icon"></i> Certificate of completion</li>
                <li><i className="fa-solid fa-chalkboard-user cd-feature-icon"></i> Expert instructor support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
