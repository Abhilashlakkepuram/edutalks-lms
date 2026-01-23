import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../styles/exam.css";

const ExamResult = () => {
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();
    const { state } = useLocation();
    // state = { passed, score, passPercentage }

    if (!state) {
        return <p style={{ padding: "40px", textAlign: "center" }}>No result found. Please take the exam first.</p>;
    }

    const { passed, score, passPercentage } = state;
    console.log("ExamResult State:", state); // Debug log
    console.log("Received Score:", score); // Debug log

    // Fallback calculation in case 'passed' boolean is unreliable
    const isPassed = passed === true || (Number(score) >= Number(passPercentage));

    return (
        <div className="exam-page result-page">
            <div className={`result-card ${isPassed ? "pass" : "fail"}`}>
                <h1>{isPassed ? "🎉 Congratulations!" : "❌ Try Again"}</h1>

                <p className="result-score">
                    Your Score <i className="fa-solid fa-bullseye" style={{ color: isPassed ? "#10b981" : "#ef4444" }}></i> : <strong>{score}%</strong>
                </p>

                <p className="result-info">
                    Minimum Required <i className="fa-solid fa-clipboard-check" style={{ color: "#4f46e5" }}></i> : {passPercentage}%
                </p>

                {isPassed ? (
                    <div className="result-actions">
                        <p className="success-msg">You have successfully passed this lesson! With {score}%</p>
                        <button
                            className="primary-btn continue-btn"
                            onClick={() =>
                                navigate(`/student/course/${courseId}`)
                            }
                        >
                            Continue Learning →
                        </button>
                    </div>
                ) : (
                    <div className="result-actions">
                        <p className="fail-msg">You didn't meet the passing criteria.</p>
                        <button
                            className="primary-btn retry-btn"
                            onClick={() =>
                                navigate(`/student/course/${courseId}`)
                            }
                        >
                            Rewatch Lesson & Retry Exam
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamResult;
