const Lesson = require("../models/Lesson");

/* ---------------- CREATE LESSON ---------------- */
// Instructor only
exports.createLesson = async (req, res) => {
  try {
    const { title, videoUrl, courseId, order } = req.body;

    const lesson = await Lesson.create({
      title,
      videoUrl,
      course: courseId,
      order
    });

    res.status(201).json({
      success: true,
      lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ---------------- GET COURSE LESSONS ---------------- */
// Student / Instructor
exports.getCourseLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      course: req.params.courseId
    }).sort("order");

    res.json({
      success: true,
      lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
