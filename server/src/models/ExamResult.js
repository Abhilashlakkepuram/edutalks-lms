const mongoose = require("mongoose");

const examResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    attempt: {
      type: Number,
      required: true
    },

    isPassed: {
      type: Boolean,
      required: true
    },
    answers: [{ // Store student answers to review logic if needed
      questionId: mongoose.Schema.Types.ObjectId,
      selectedOption: Number
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamResult", examResultSchema);
