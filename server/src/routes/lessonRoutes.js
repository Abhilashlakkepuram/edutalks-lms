const express = require("express");
const {
  createLesson,
  getCourseLessons
} = require("../controllers/lessonController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Instructor creates lesson
router.post(
  "/",
  authMiddleware,
  roleMiddleware("instructor"),
  createLesson
);

// Get lessons by course
router.get(
  "/:courseId",
  authMiddleware,
  getCourseLessons
);

module.exports = router;
