import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "../../styles/player.css";
import BackButton from "../../components/BackButton";
import Lottie from "lottie-react";
import completedAnimation from "../../assets/lottie/lesson-completed.json";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);

  const [completedIds, setCompletedIds] = useState([]);
  const [progress, setProgress] = useState(0);

  const [score, setScore] = useState(null);
  const [examPassed, setExamPassed] = useState(false); // ✅ Strict validation
  const [rewatching, setRewatching] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 1️⃣ Load lessons */
  useEffect(() => {
    const fetchLessons = async () => {
      const res = await fetch(
        `http://localhost:5000/api/lessons/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) {
        setLessons(data.lessons);
        setActiveLesson(data.lessons[0]);
      }
    };
    fetchLessons();
  }, [courseId]);

  /* 2️⃣ Load enrollment (ONLY TRUTH) */
  useEffect(() => {
    if (!lessons.length) return;

    const loadEnrollment = async () => {
      const res = await fetch(
        "http://localhost:5000/api/enrollments/my-courses",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      const enrollment = data.courses.find(
        (e) => e.course._id === courseId
      );

      if (enrollment) {
        setCompletedIds(enrollment.completedLessons || []);
        setProgress(enrollment.progress || 0);
      }

      setLoading(false);
    };

    loadEnrollment();
  }, [lessons]);

  /* 3️⃣ Load score & validation */
  useEffect(() => {
    if (!activeLesson) return;

    // Reset state for new lesson
    setScore(null);
    setExamPassed(false);
    setRewatching(false);

    const fetchResult = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/exams/results/${activeLesson._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (data.success && data.result) {
          setScore(data.result.percentage);
          setExamPassed(data.result.isPassed); // ✅ Capture truth
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchResult();
  }, [activeLesson]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!activeLesson) return null;

  const isCompleted = completedIds.includes(activeLesson._id);
  const showCompletionScreen = isCompleted && examPassed; // ✅ Strict Logic

  const getEmbedUrl = (url) => {
    const id = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  };

  return (
    <div className="player-page">
      {/* Sidebar */}
      <aside className="lesson-sidebar">
        <BackButton to="/student/dashboard" label="Back to dashboard" />
        <h3>Course Content</h3>

        {lessons.map((lesson, i) => (
          <div
            key={lesson._id}
            className={`lesson-item ${activeLesson._id === lesson._id ? "active" : ""
              }`}
            onClick={() => setActiveLesson(lesson)}
          >
            {i + 1}. {lesson.title}
            {completedIds.includes(lesson._id) && " ✅"}
          </div>
        ))}

        <div className="progress-container">
          <div className="progress-info">
            <span>Course Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </aside>

      {/* Right side */}
      <main className="video-section">
        <h2>{activeLesson.title}</h2>

        {(!showCompletionScreen || rewatching) && (
          <iframe
            src={getEmbedUrl(activeLesson.videoUrl)}
            title={activeLesson.title}
            allowFullScreen
          />
        )}

        {!showCompletionScreen && (
          <div className="video-actions-container">
            <button
              onClick={() =>
                navigate(`/student/exam/${courseId}/${activeLesson._id}`)
              }
            >
              Take Assessment to Complete Lesson
            </button>
          </div>
        )}

        {showCompletionScreen && (
          <div className="completion-container">
            <Lottie
              animationData={completedAnimation}
              loop
              autoplay
              style={{ width: 160 }}
            />

            <span className="completed-text">Lesson Completed</span>

            <p>
              {score
                ? `You passed this lesson with ${score}% score`
                : "You have completed this lesson"}
            </p>

            <div className="player-actions">
              <button
                className="btn-rewatch"
                onClick={() => setRewatching(true)}
              >
                Rewatch Lesson
              </button>

              <button
                className="retake-btn"
                onClick={() =>
                  navigate(`/student/exam/${courseId}/${activeLesson._id}`)
                }
              >
                Retake Assessment
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursePlayer;
