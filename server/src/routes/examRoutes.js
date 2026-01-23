const express = require("express");
const {
  createExam,
  getExamByLesson,
  submitExam,
  getStudentExamResult
} = require("../controllers/examController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/* Instructor creates exam */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("instructor"),
  createExam
);

/* Student fetch exam */
router.get(
  "/lesson/:lessonId",
  authMiddleware,
  getExamByLesson
);

/* Student fetch exam RESULT */
router.get(
  "/results/:lessonId",
  authMiddleware,
  getStudentExamResult
);

/* Student submits exam */
router.post(
  "/submit",
  authMiddleware,
  submitExam
);

module.exports = router;
