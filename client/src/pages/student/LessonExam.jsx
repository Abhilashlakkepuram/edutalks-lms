import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "../../styles/exam.css";
import BackButton from "../../components/BackButton";

const LessonExam = () => {
    const { lessonId, courseId } = useParams();
    const navigate = useNavigate();
    const token = getToken();

    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    /* 1️⃣ Load exam */
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/exams/lesson/${lessonId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();
                console.log("Exam API Response:", data);
                if (data.success) {
                    setExam(data.data);
                } else {
                    console.error("Exam load failed:", data.message);
                }
            } catch (err) {
                console.error("Exam load error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [lessonId]);

    /* 2️⃣ Select answer */
    const handleChange = (qIndex, optionIndex) => {
        setAnswers({
            ...answers,
            [qIndex]: optionIndex
        });
    };

    /* 3️⃣ Submit exam */
    const submitExam = async () => {
        setSubmitting(true);

        const res = await fetch(
            "http://localhost:5000/api/exams/submit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    answers: exam.questions.map((_, i) => answers[i] ?? null),
                    examId: exam._id,
                    lessonId,
                    courseId
                })
            }
        );

        const data = await res.json();
        console.log("Submit Exam Response:", data); // Debug log
        console.log("Percentage from server:", data.percentage); // Explicit check
        if (data.success) {
            setResult(data);
            setTimeout(() => {
                navigate(`/student/exam-result/${courseId}/${lessonId}`, {
                    state: {
                        passed: data.passed,
                        score: data.percentage,
                        passPercentage: exam.passingScore || 70
                    }
                });
            }, 1000);
        }

        setSubmitting(false);
    };


    if (loading) return <p className="exam-loading">Loading exam...</p>;
    if (!exam) return <p className="exam-loading">No exam found.</p>;

    return (
        <div className="exam-page">
            <div style={{ marginBottom: "20px" }}>
                <BackButton to={`/student/course/${courseId}`} label="Back to Course" />
            </div>
            <h1 className="exam-title"><span className="exam-title-lesson">{exam.lesson?.title || "Lesson"}</span><span className="exam-title-assessment"><i className="fa-solid fa-pen-to-square"></i> ASSESSMENT</span></h1>
            <p className="exam-subtitle">
                <i className="fa-solid fa-clipboard-check"></i> You Must Score <strong className="exam-subtitle-score">{exam.passingScore} %</strong> To Pass
            </p>
            {exam.questions.map((q, qIndex) => (
                <div key={qIndex} className="question-card">
                    <h3>
                        {qIndex + 1}. {q.question}
                    </h3>

                    {q.options.map((opt, optIndex) => (
                        <label
                            key={optIndex}
                            className={`option ${answers[qIndex] === optIndex ? 'selected' : ''}`}
                        >
                            <input
                                type="radio"
                                name={`question-${qIndex}`}
                                checked={answers[qIndex] === optIndex}
                                onChange={() => handleChange(qIndex, optIndex)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            ))}

            {!result && (
                <button
                    className="primary-btn exam-submit"
                    onClick={submitExam}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Submit Exam"}
                </button>
            )}
        </div>
    );
};

export default LessonExam;
