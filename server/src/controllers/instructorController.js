const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");


exports.getInstructorStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get all courses by this instructor
        const courses = await Course.find({ instructor: userId });
        const courseIds = courses.map(course => course._id);
        const coursesCount = courses.length;

        // 2. Count all lessons in these courses
        const lessonsCount = await Lesson.countDocuments({
            course: { $in: courseIds }
        });

        // 3. Count unique students enrolled in these courses
        const students = await Enrollment.distinct("student", {
            course: { $in: courseIds }
        });
        const studentsCount = students.length;

        res.json({
            success: true,
            stats: {
                courses: coursesCount,
                lessons: lessonsCount,
                students: studentsCount
            }
        });
    } catch (error) {
        console.error("STATS ERROR:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get all students enrolled in instructor's courses
// @route   GET /api/instructor/students
// @access  Instructor
exports.getInstructorStudents = async (req, res) => {
    try {
        // 1. Find all courses created by this instructor
        const courses = await Course.find({ instructor: req.user.id }).select("_id");

        if (!courses.length) {
            return res.status(200).json({ success: true, students: [] });
        }

        const courseIds = courses.map(course => course._id);

        // 2. Find enrollments for these courses
        console.log("Course IDs for Instructor:", courseIds);

        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate("student", "firstName lastName email")
            .populate("course", "title")
            .sort("-createdAt");

        console.log("Found Enrollments:", enrollments.length);

        // 3. Format data for frontend (Flattening structure slightly if needed, but direct is fine)
        // Front end expects: student info, course info, progress.

        // 3. Filter out any enrollments where the student might be null (deleted users)
        const validEnrollments = enrollments.filter(e => e.student);

        res.status(200).json({
            success: true,
            students: validEnrollments
        });

    } catch (error) {
        console.error("Get Students Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
