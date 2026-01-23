const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");
const User = require("../models/User");
const Course = require("../models/Course");
const ExamResult = require("../models/ExamResult");
const sendEmail = require("../utils/sendEmail");

const getReceiptHtml = (user, course, price, total) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; text-align: left;">
    <div style="background: linear-gradient(90deg, #4f46e5, #ec4899); padding: 30px; color: white; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">EduTalks</h1>
      <p style="margin: 5px 0 0; opacity: 0.9; font-size: 16px;">Enrollment Confirmation</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 22px;">Hello ${user.firstName},</h2>
      <p style="color: #4b5563; margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
        Congratulations! You have successfully enrolled in <strong>${course.title}</strong>. 
        We are excited to help you learn and grow.
      </p>
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="margin-top: 0; color: #111827; font-size: 18px;">Course Details</h3>
        <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Instructor:</strong> ${course.instructor.firstName} ${course.instructor.lastName}</p>
        <div style="margin-top: 15px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
           <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #4b5563;">
             <span>Price</span>
             <span>₹${price}</span>
           </div>
           <div style="display: flex; justify-content: space-between; font-weight: bold; color: #111827; font-size: 18px; margin-top: 10px; border-top: 1px dashed #d1d5db; padding-top: 10px;">
             <span>Total Paid</span>
             <span>₹${total}</span>
           </div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 40px;">
        <a href="http://localhost:5173/dashboard" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Start Learning Now</a>
      </div>
    </div>
    <div style="background: #f9fafb; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; text-align: center;">
      Transaction Date: ${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}<br>
      © ${new Date().getFullYear()} EduTalks LMS. All rights reserved.
    </div>
  </div>
</div>
`;

/* ---------------- ENROLL COURSE ---------------- */
// Student only
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // ✅ 1. Validate input
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // ✅ 2. Prevent duplicate enrollment (clean)
    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled"
      });
    }

    // ✅ 3. Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId
    });

    // ✅ 4. Send Email (Restored Logic)
    try {
      const user = await User.findById(req.user.id);
      const course = await Course.findById(courseId).populate("instructor");

      if (user && course) {
        const price = course.price;
        const discount = course.discount || 0;
        const total = Math.round(price * (1 - discount / 100));

        await sendEmail(
          user.email,
          `Enrollment Confirmation: ${course.title}`,
          getReceiptHtml(user, course, price, total)
        );
        console.log(`📧 Enrollment email sent to ${user.email} for course ${course.title}`);
      }
    } catch (emailErr) {
      console.error("⚠️ Failed to send enrollment email:", emailErr.message);
      // Continue - do not fail the request
    }

    // ✅ 5. Response
    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      enrollment
    });

  } catch (error) {
    console.error("Enroll error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ---------------- MY COURSES ---------------- */
// Student only
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id
    }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "firstName lastName"
      }
    });

    // Filter out enrollments where the course might have been deleted
    const validEnrollments = enrollments.filter(enrollment => enrollment.course);

    // ✅ Sync completedLessons with ExamResults (Fixes inconsistent state)
    for (const enrollment of validEnrollments) {
      if (!enrollment.completedLessons || enrollment.completedLessons.length === 0) continue;

      // Find which of the 'completedLessons' actually have a passed exam result
      const passedExamResults = await ExamResult.find({
        student: req.user.id,
        isPassed: true
      }).populate({
        path: 'exam',
        match: { lesson: { $in: enrollment.completedLessons } },
        select: 'lesson'
      });

      const validCompletedLessonIds = passedExamResults
        .filter(r => r.exam && r.exam.lesson)
        .map(r => r.exam.lesson.toString());

      // Update the enrollment object in memory (not DB, unless we want to persist the cleanup)
      // Persisting cleanup is better for consistency
      if (enrollment.completedLessons.length !== validCompletedLessonIds.length) {
        enrollment.completedLessons = validCompletedLessonIds;
        // Recalculate progress
        const totalLessons = await Lesson.countDocuments({ course: enrollment.course._id });
        enrollment.progress = totalLessons > 0
          ? Math.round((validCompletedLessonIds.length / totalLessons) * 100)
          : 0;
        await enrollment.save();
      }
    }

    res.json({
      success: true,
      courses: validEnrollments
    });
  } catch (error) {
    console.error("Error in getMyCourses:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ---------------- UPDATE PROGRESS ---------------- */
// Student only
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, progress } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    enrollment.progress = progress;
    await enrollment.save();

    res.json({
      success: true,
      message: "Progress updated"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* ---------------- COMPLETE LESSON ---------------- */
// Student only
exports.completeLesson = async (req, res) => {
  try {
    const { lessonId, courseId } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    if (enrollment.completedLessons.includes(lessonId)) {
      return res.json({
        success: true,
        message: "Lesson already completed"
      });
    }

    enrollment.completedLessons.push(lessonId);

    const totalLessons = await Lesson.countDocuments({ course: courseId });

    enrollment.progress = Math.round(
      (enrollment.completedLessons.length / totalLessons) * 100
    );

    await enrollment.save();

    res.json({
      success: true,
      progress: enrollment.progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
