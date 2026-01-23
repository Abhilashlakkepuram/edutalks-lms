import { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import "../../styles/createexam.css";
import BackButton from "../../components/BackButton";

const CreateExam = () => {
    const token = getToken();

    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [courseId, setCourseId] = useState("");
    const [lessonId, setLessonId] = useState("");

    const [questions, setQuestions] = useState([
        { question: "", options: ["", "", "", ""], correctAnswer: 0 }
    ]);

    /* LOAD INSTRUCTOR COURSES */
    useEffect(() => {
        const loadCourses = async () => {
            const res = await fetch(
                "http://localhost:5000/api/courses/my",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.success) setCourses(data.courses);
        };

        loadCourses();
    }, []);

    /* LOAD LESSONS WHEN COURSE SELECTED */
    useEffect(() => {
        if (!courseId) return;

        const loadLessons = async () => {
            const res = await fetch(
                `http://localhost:5000/api/lessons/${courseId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.success) setLessons(data.lessons);
        };

        loadLessons();
    }, [courseId]);

    /* QUESTION HANDLERS */
    const updateQuestion = (i, field, value) => {
        const updated = [...questions];
        updated[i][field] = value;
        setQuestions(updated);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { question: "", options: ["", "", "", ""], correctAnswer: 0 }
        ]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    /* SAVE EXAM */
    const submitExam = async () => {
        if (!courseId || !lessonId) {
            alert("Select course & lesson");
            return;
        }

        const res = await fetch(
            "http://localhost:5000/api/exams",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    courseId,
                    lessonId,
                    questions
                })
            }
        );

        const data = await res.json();
        if (data.success) {
            alert("✅ Exam created successfully");
            setQuestions([
                { question: "", options: ["", "", "", ""], correctAnswer: 0 }
            ]);
        } else {
            alert(data.message || "Failed to create exam");
        }
    };

    return (
        <div className="create-exam-wrapper">
            <div style={{ marginBottom: "20px" }}>
                <BackButton to="/instructor/dashboard" label="Dashboard" />
            </div>

            <div className="create-exam-header">
                <h1>Create Lesson Exam</h1>
                <p>Design a quiz to test student knowledge for a specific lesson.</p>
            </div>

            {/* SELECTION GROUP */}
            <div className="exam-select-group">
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Select Course</label>
                    <select
                        className="exam-select"
                        onChange={(e) => setCourseId(e.target.value)}
                    >
                        <option value="">-- Choose Course --</option>
                        {courses.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Select Lesson</label>
                    <select
                        className="exam-select"
                        onChange={(e) => setLessonId(e.target.value)}
                        disabled={!courseId}
                    >
                        <option value="">-- Choose Lesson --</option>
                        {lessons.map((l) => (
                            <option key={l._id} value={l._id}>
                                {l.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* QUESTIONS */}
            <div>
                {questions.map((q, i) => (
                    <div key={i} className="exam-question-card">
                        <div className="question-header">
                            <span className="question-label">Question {i + 1}</span>
                            {questions.length > 1 && (
                                <button className="remove-btn" onClick={() => removeQuestion(i)}>
                                    <i className="fa-solid fa-trash"></i> Remove
                                </button>
                            )}
                        </div>

                        <div className="input-group">
                            <input
                                className="question-input"
                                placeholder="Type your question here..."
                                value={q.question}
                                onChange={(e) => updateQuestion(i, "question", e.target.value)}
                            />
                        </div>

                        <div className="options-grid">
                            {q.options.map((opt, j) => (
                                <input
                                    key={j}
                                    className="option-input"
                                    placeholder={`Option ${j + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(i, j, e.target.value)}
                                />
                            ))}
                        </div>

                        <div className="input-group">
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
                                Correct Answer
                            </label>
                            <select
                                className="correct-answer-select"
                                value={q.correctAnswer}
                                onChange={(e) =>
                                    updateQuestion(i, "correctAnswer", Number(e.target.value))
                                }
                            >
                                {q.options.map((_, idx) => (
                                    <option key={idx} value={idx}>
                                        Option {idx + 1} is Correct
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            <div className="exam-actions">
                <button className="add-question-btn" onClick={addQuestion}>
                    <span style={{ fontSize: '18px' }}>+</span> Add Question
                </button>

                <button className="save-exam-btn" onClick={submitExam}>
                    Publish Exam
                </button>
            </div>
        </div>
    );
};

export default CreateExam;
