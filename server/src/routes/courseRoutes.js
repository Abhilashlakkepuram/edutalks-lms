const express = require("express");
const {
  createCourse,
  getAllCourses
} = require("../controllers/courseController");
const { getCourseById } = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getMyCourses } = require("../controllers/courseController");

const router = express.Router();

// Instructor creates course
router.post(
  "/",
  authMiddleware,
  roleMiddleware("instructor"),
  createCourse
);

// Public course list
router.get("/", getAllCourses);

// Get instructor courses
router.get("/my", authMiddleware, getMyCourses);

// Get single course
router.get("/:id", getCourseById);

module.exports = router;
