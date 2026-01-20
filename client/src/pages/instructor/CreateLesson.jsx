import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/instructor.css";
import { getToken } from "../../utils/auth";
import BackButton from "../../components/BackButton";

const CreateLesson = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [form, setForm] = useState({
        title: "",
        videoUrl: "",
        order: ""
    });
    const [message, setMessage] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setMessage("");

        const token = getToken();

        try {
            const res = await fetch("http://localhost:5000/api/lessons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    courseId
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Failed to add lesson");
                return;
            }

            setMessage("✅ Lesson added successfully");
            setForm({ title: "", videoUrl: "", order: "" });
            // after successful course creation
            navigate("/instructor/my-courses");

        } catch (err) {
            setMessage("Server error");
        }
    };

    return (
        <div className="instructor-page">
            <div className="course-form-card">
                <BackButton label="Back to Courses" to="/instructor/my-courses" />
                <h2>Add Lesson</h2>
                <p className="subtitle">
                    Add lessons to your course. Lessons will appear in order.
                </p>

                {message && <div className="info-message">{message}</div>}

                <form onSubmit={submit} className="course-form">
                    <label>
                        Lesson Title
                        <input
                            type="text"
                            placeholder="e.g. Introduction to React"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            required
                        />
                    </label>

                    <label>
                        Video URL
                        <input
                            type="url"
                            placeholder="https://youtube.com/..."
                            value={form.videoUrl}
                            onChange={(e) =>
                                setForm({ ...form, videoUrl: e.target.value })
                            }
                            required
                        />
                    </label>

                    <label>
                        Lesson Order
                        <input
                            type="number"
                            placeholder="1"
                            value={form.order}
                            onChange={(e) =>
                                setForm({ ...form, order: e.target.value })
                            }
                            required
                        />
                    </label>

                    <button type="submit" className="primary-btn">
                        Add Lesson
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLesson;
