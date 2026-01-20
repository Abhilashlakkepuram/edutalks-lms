import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "../../styles/player.css";
import BackButton from "../../components/BackButton";

const CoursePlayer = () => {
    const { courseId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completed, setCompleted] = useState([]);
    const [progress, setProgress] = useState(0);

    const token = getToken();

    // 1️⃣ Load lessons
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/lessons/${courseId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const data = await res.json();
                if (data.success) {
                    setLessons(data.lessons);
                    const firstUnwatched = data.lessons.find(
                        (l) => !completed.includes(l._id)
                    );
                    setActiveLesson(firstUnwatched || data.lessons[0]);
                    // first lesson
                }
            } catch (err) {
                console.error("Lesson load error:", err);
            }
        };

        fetchLessons();
    }, [courseId]);

    // 2️⃣ Load progress AFTER lessons
    useEffect(() => {
        if (lessons.length === 0) return;

        const loadProgress = async () => {
            try {
                const res = await fetch(
                    "http://localhost:5000/api/enrollments/my-courses",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const data = await res.json();
                if (data.success) {
                    const enrollment = data.courses.find(
                        (e) => e.course._id === courseId
                    );

                    if (enrollment) {
                        setCompleted(enrollment.completedLessons || []);
                        setProgress(enrollment.progress || 0);

                        // Resume next lesson
                        const next = lessons.find(
                            (l) => !enrollment.completedLessons.includes(l._id)
                        );
                        if (next) setActiveLesson(next);

                    }
                }
            } catch (err) {
                console.error("Progress load error:", err);
            }
        };

        loadProgress();
    }, [lessons]);

    // 3️⃣ Mark lesson complete
    const markCompleted = async (lessonId) => {
        if (completed.includes(lessonId)) return;

        try {
            const res = await fetch(
                "http://localhost:5000/api/enrollments/complete-lesson",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ lessonId, courseId })
                }
            );

            const data = await res.json();
            if (data.success) {
                setCompleted((prev) => [...prev, lessonId]);
                setProgress(data.progress);
            }
        } catch (err) {
            console.error("Completion error", err);
        }
    };

    if (!activeLesson) return <p>Loading course...</p>;

    return (
        <div className="player-page">
            {/* LEFT */}
            <aside className="lesson-sidebar">
                <div style={{ padding: "10px" }}>
                    <BackButton to="/student/dashboard" label="Back to dashboard" />
                </div>
                <h3>Course Content</h3>

                {lessons.map((lesson, index) => (
                    <div
                        key={lesson._id}
                        className={`lesson-item ${activeLesson._id === lesson._id ? "active" : ""
                            }`}
                        onClick={() => setActiveLesson(lesson)}
                    >
                        {index + 1}. {lesson.title}
                        {completed.includes(lesson._id) && " ✅"}
                    </div>
                ))}

                <div className="progress-box">
                    Progress: {progress}%
                </div>
            </aside>

            {/* RIGHT */}
            <main className="video-section">
                <h2>{activeLesson.title}</h2>

                {/* Helper to convert YouTube URL to embed format */}
                {(() => {
                    const getEmbedUrl = (url) => {
                        if (!url) return "";
                        const videoId = url.split("v=")[1]?.split("&")[0];
                        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                    };

                    return (
                        <iframe
                            src={getEmbedUrl(activeLesson.videoUrl)}
                            title={activeLesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    );
                })()}
            </main>
        </div>
    );
};

export default CoursePlayer;
