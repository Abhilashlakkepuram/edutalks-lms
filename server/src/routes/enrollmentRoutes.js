const express = require("express");
const {
  enrollCourse,
  getMyCourses,
  updateProgress,
  completeLesson
} = require("../controllers/enrollmentController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");


const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

const router = express.Router();

// Student enrolls
router.post(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  enrollCourse
);

// Student's enrolled courses
router.get(
  "/my-courses",
  authMiddleware,
  roleMiddleware("student"),
  getMyCourses
);

// Update progress
router.post(
  "/progress",
  authMiddleware,
  roleMiddleware("student"),
  updateProgress
);


/* ---------------- COMPLETE LESSON ---------------- */
/* ---------------- COMPLETE LESSON ---------------- */



router.post(
  "/complete-lesson",
  authMiddleware,
  roleMiddleware("student"),
  completeLesson
);



module.exports = router;
