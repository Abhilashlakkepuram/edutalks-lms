import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/instructor.css";
import { getToken } from "../../utils/auth";
import BackButton from "../../components/BackButton";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: ""
  });
  const [message, setMessage] = useState("");


  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = getToken();

    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create course");
        return;
      }

      setMessage("Course created! Add lessons now...");
      setTimeout(() => {
        navigate(`/instructor/create-lesson/${data.course._id}`);
      }, 1000);
      setForm({ title: "", description: "", price: "", category: "", image: "" });
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="instructor-page">
      <div className="course-form-card">
        <BackButton to="/instructor/dashboard" label="Back" />
        <h2>Create New Course</h2>
        <p className="subtitle">
          Fill in the details below to publish a new course.
        </p>

        {message && <div className="info-message">{message}</div>}

        <form onSubmit={submit} className="course-form">
          <label>
            Course Title
            <input
              type="text"
              placeholder="e.g. Full Stack Web Development"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </label>

          <label>
            Course Description
            <textarea
              placeholder="Describe what students will learn..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </label>

          <div className="row">
            <label>
              Price (₹)
              <input
                type="number"
                placeholder="499"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                required
              />
            </label>

            <label>
              Image URL
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
              >
                <option value="">Select</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Data Science">Data Science</option>
              </select>
            </label>
          </div>

          <button type="submit" className="primary-btn">
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
