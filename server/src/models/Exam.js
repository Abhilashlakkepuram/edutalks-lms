const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number, // Index of the correct option
    required: true
  }
});

const examSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      unique: true // One exam per lesson
    },
    questions: [questionSchema],
    passingScore: {
      type: Number,
      required: true,
      default: 70 // Percentage
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
