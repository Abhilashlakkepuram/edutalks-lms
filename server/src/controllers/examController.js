const Exam = require("../models/Exam");
const ExamResult = require("../models/ExamResult");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

module.exports = {
  // Instructor creates an exam for a lesson
  createExam: async (req, res) => {
    try {
      const { lessonId, questions, passingScore } = req.body;

      // Check if lesson exists
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(404).json({ success: false, message: "Lesson not found" });
      }

      // Check if exam already exists for this lesson
      const existingExam = await Exam.findOne({ lesson: lessonId });
      if (existingExam) {
        return res.status(400).json({ success: false, message: "Exam already exists for this lesson" });
      }

      const newExam = new Exam({
        lesson: lessonId,
        questions,
        passingScore
      });

      await newExam.save();

      res.status(201).json({
        success: true,
        message: "Exam created successfully",
        data: newExam
      });
    } catch (error) {
      console.error("Create Exam Error:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  },

  // Student fetches exam for a lesson
  getExamByLesson: async (req, res) => {
    try {
      const { lessonId } = req.params;

      const exam = await Exam.findOne({ lesson: lessonId }).populate("lesson", "title");
      if (!exam) {
        return res.status(404).json({ success: false, message: "No exam found for this lesson" });
      }

      // Hide correct answers for students
      const examForStudent = {
        ...exam.toObject(),
        questions: exam.questions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options
          // correctAnswer is excluded
        }))
      };

      res.status(200).json({
        success: true,
        data: examForStudent
      });
    } catch (error) {
      console.error("Get Exam Error:", error);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  },

  // Student submits exam
  submitExam: async (req, res) => {
    try {
      const { examId, answers, lessonId, courseId } = req.body;
      const studentId = req.user.id;

      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ success: false, message: "Exam not found" });
      }

      let correctCount = 0;

      exam.questions.forEach((q, i) => {
        if (answers[i] === q.correctAnswer) {
          correctCount++;
        }
      });

      const totalQuestions = exam.questions.length;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      const passed = percentage >= exam.passingScore;

      // ✅ Attempt count
      const attemptCount = await ExamResult.countDocuments({
        student: studentId,
        exam: examId
      });

      // ✅ Save exam history
      await ExamResult.create({
        student: studentId,
        exam: examId,
        totalQuestions,
        correctAnswers: correctCount,
        percentage,
        isPassed: passed,
        attempt: attemptCount + 1,
        answers: exam.questions.map((q, i) => ({
          questionId: q._id,
          selectedOption: answers[i] ?? null
        }))
      });

      // ✅ THIS IS THE REAL MAGIC
      if (passed) {
        const enrollment = await Enrollment.findOne({
          student: studentId,
          course: courseId
        });

        if (enrollment && !enrollment.completedLessons.includes(lessonId)) {
          enrollment.completedLessons.push(lessonId);

          const totalLessons = await Lesson.countDocuments({ course: courseId });

          enrollment.progress = Math.round(
            (enrollment.completedLessons.length / totalLessons) * 100
          );

          await enrollment.save();
        }
      }

      res.json({
        success: true,
        percentage,
        passed
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },



  // Get student's result for a lesson
  getStudentExamResult: async (req, res) => {
    try {
      const { lessonId } = req.params;
      const studentId = req.user.id;

      // Find exam for lesson
      const exam = await Exam.findOne({ lesson: lessonId });
      if (!exam) {
        return res.status(404).json({
          success: false,
          message: "Exam not found for this lesson"
        });
      }

      // Latest result
      const result = await ExamResult.findOne({
        student: studentId,
        exam: exam._id
      }).sort({ createdAt: -1 });

      if (!result) {
        return res.status(200).json({
          success: false,
          message: "No result found"
        });
      }

      res.json({
        success: true,
        result: {
          percentage: result.percentage,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          isPassed: result.isPassed
        }
      });

    } catch (error) {
      console.error("Get Result Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  },

};
