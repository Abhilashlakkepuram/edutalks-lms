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
