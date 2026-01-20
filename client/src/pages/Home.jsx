import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import "../styles/home.css";

const categories = [
  "All",
  "Development",
  "Design",
  "Business",
  "Data Science"
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    // ✅ Fetch real courses from backend
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();

        if (data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Failed to load courses", error);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = activeCategory === "All"
    ? courses
    : courses.filter((course) => course.category === activeCategory);

  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero">
        <h1>Join EduTalks – Start your learning journey today.</h1>
        <p>
          Welcome to a modern digital learning platform. Build skills for your present and future.
        </p>
        <Link to="/register">
          <button className="hero-btn">Get Started</button>
        </Link>
      </section>

      {/* CATEGORY TABS */}
      <section className="categories">
        {categories.map((category) => (
          <span
            key={category}
            className={activeCategory === category ? "active" : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </span>
        ))}
      </section>

      {/* COURSE GRID */}
      <section className="course-grid">
        {filteredCourses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        )}
      </section>
    </div>
  );
};

export default Home;
