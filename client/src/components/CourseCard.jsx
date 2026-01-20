import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLoggedIn()) {
      navigate("/login", {
        state: { redirectTo: `/course/${course._id}` }
      });
      return;
    }
    navigate(`/course/${course._id}`);
  };

  return (
    <div className="course-card" onClick={handleClick}>
      <div className="course-image-wrapper">
        <img
          src={course.image || "https://via.placeholder.com/300x180"}
          alt={course.title}
        />
        <div className="course-overlay">
          <span>View Details</span>
        </div>
      </div>
      <div className="course-content">
        <div className="course-badges">
          <span className="badge category-badge">{course.category || "General"}</span>
        </div>
        <h4>{course.title}</h4>
        <p className="course-desc">
          {course.description}
        </p>
        <div className="instructor">
          <span>By {course.instructor?.firstName} {course.instructor?.lastName}</span>
        </div>
        <div className="course-footer">
          <div className="price-container">
            {course.discount > 0 ? (
              <div className="price-box">
                <span className="original-price">₹{course.price}</span>
                <span className="discounted-price">
                  ₹{Math.round(course.price * (1 - course.discount / 100))}
                </span>
              </div>
            ) : (
              <span className="regular-price">₹{course.price}</span>
            )}
          </div>
          <button className="enroll-btn" onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}>
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
