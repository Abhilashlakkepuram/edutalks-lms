const express = require("express");
const {
    getDashboardStats,
    getAllUsers,
    getAllCourses,
    updateCoursePrice,
    deleteCourse
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Dashboard stats
router.get(
    "/stats",
    authMiddleware,
    roleMiddleware("admin"),
    getDashboardStats
);

// All users
router.get(
    "/users",
    authMiddleware,
    roleMiddleware("admin"),
    getAllUsers
);

// All courses
router.get(
    "/courses",
    authMiddleware,
    roleMiddleware("admin"),
    getAllCourses
);

// Update price & discount
router.put(
    "/course/:courseId",
    authMiddleware,
    roleMiddleware("admin"),
    updateCoursePrice
);

// Delete course
router.delete(
    "/course/:courseId",
    authMiddleware,
    roleMiddleware("admin"),
    deleteCourse
);

module.exports = router;
