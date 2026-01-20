const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

/* ---------------- CREATE COURSE ---------------- */
// Instructor only
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      category,
      image,
      instructor: req.user.id
    });

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ---------------- GET ALL COURSES ---------------- */
// Public
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "firstName lastName email");

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ---------------- GET COURSE BY ID ---------------- */
// Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "firstName lastName email");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // ✅ Fetch lessons for this course
    const lessons = await Lesson.find({ course: req.params.id }).select("title order createdAt").sort("order");

    res.json({
      success: true,
      course: {
        ...course.toObject(),
        lessons
      }
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- GET INSTRUCTOR COURSES ---------------- */
// Protected
exports.getMyCourses = async (req, res) => {
  try {
    console.log("Fetching courses for instructor:", req.user.id);
    const courses = await Course.find({ instructor: req.user.id });
    console.log("Courses found:", courses);
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


