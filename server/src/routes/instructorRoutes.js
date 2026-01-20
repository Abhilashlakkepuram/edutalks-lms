const express = require("express");
const { getInstructorStats } = require("../controllers/instructorController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Get Instructor Dashboard Stats
router.get("/stats", authMiddleware, roleMiddleware("instructor"), getInstructorStats);

module.exports = router;
