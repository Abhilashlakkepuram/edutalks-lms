const express = require("express");
const { getInstructorStats, getInstructorStudents } = require("../controllers/instructorController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Get Instructor Dashboard Stats
router.get("/stats", authMiddleware, roleMiddleware("instructor"), getInstructorStats);

// Get Instructor's Enrolled Students
router.get("/students", authMiddleware, roleMiddleware("instructor"), getInstructorStudents);

module.exports = router;
