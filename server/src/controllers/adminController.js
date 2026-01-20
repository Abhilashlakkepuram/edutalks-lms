const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

/* ---------------- ADMIN DASHBOARD ---------------- */
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const students = await User.countDocuments({ role: "student" });
        const instructors = await User.countDocuments({ role: "instructor" });
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();

        res.json({
            success: true,
            stats: {
                totalUsers,
                students,
                instructors,
                totalCourses,
                totalEnrollments
            }
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({
            success: false,
            message: "Admin stats failed"
        });
    }
};

/* ---------------- USERS ---------------- */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

/* ---------------- COURSES ---------------- */
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate(
            "instructor",
            "firstName lastName email"
        );
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate(
            "instructor",
            "firstName lastName email"
        );
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// Update price & discount
exports.updateCoursePrice = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { price, discount } = req.body;

        const course = await Course.findByIdAndUpdate(
            courseId,
            { price, discount },
            { new: true }
        );

        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};

// Delete course
exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.courseId);
        res.json({ success: true, message: "Course deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};
