const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");
const User = require("../models/User");
const Course = require("../models/Course");
const ExamResult = require("../models/ExamResult");
const sendEmail = require("../utils/sendEmail");

const getReceiptHtml = (user, course, price, discount, total, enrollmentId, paymentInfo) => `
<div style="font-family: 'Udemy Sans', 'SF Pro Text', -apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f7f9fa; padding: 40px 0; color: #2d2f31;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #d1d7dc; box-shadow: 0 2px 4px rgba(0,0,0,0.08); text-align: left;">
    
    <!-- Header -->
    <div style="padding: 24px; border-bottom: 1px solid #d1d7dc; display: flex; align-items: center; justify-content: space-between;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #a435f0;">EduTalks</h1>
    </div>
    <div style="text-align: right; padding: 24px;">
      <span style="font-size: 13px; color: #6a6f73; display: block;">Date: ${new Date(paymentInfo?.date || Date.now()).toLocaleDateString()}</span>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">
      <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #2d2f31;">Success! You are enrolled.</h2>
      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.4; color: #2d2f31;">
        Hi ${user.firstName}, you have successfully enrolled in the course. 
        Here are your enrollment details.
      </p>

      <!-- Payment Summary Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="border-bottom: 1px solid #d1d7dc;">
            <th style="text-align: left; padding: 12px 0; font-size: 14px; color: #6a6f73; font-weight: 700;">ITEM</th>
            <th style="text-align: right; padding: 12px 0; font-size: 14px; color: #6a6f73; font-weight: 700;">PRICE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #e8eaeb; vertical-align: top;">
              <div>
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px; color: #1c1d1f;">${course.title}</div>
                <div style="font-size: 14px; color: #6a6f73;">Instructor: ${course.instructor.firstName} ${course.instructor.lastName}</div>
              </div>
            </td>
            <td style="padding: 16px 0; border-bottom: 1px solid #e8eaeb; text-align: right; vertical-align: top; font-size: 15px; color: #1c1d1f;">
              ₹${price}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
           <span style="color: #6a6f73; font-size: 14px;">Total Price</span>
           <span style="font-size: 14px;">₹${price}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
           <span style="color: #6a6f73; font-size: 14px;">Discounts</span>
           <span style="font-size: 14px; color: #1e8739;">-₹${Math.round(price * (discount / 100))} (${discount}%)</span>
        </div>
        <div style="border-top: 1px solid #d1d7dc; margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between; font-weight: 700; font-size: 18px;">
           <span>Total Paid</span>
           <span>₹${total}</span>
        </div>
      </div>

      <!-- Payment Method -->
      <div style="background: #f7f9fa; padding: 16px; border-radius: 4px; margin-bottom: 24px; font-size: 14px; color: #2d2f31;">
        <div style="font-weight: 700; margin-bottom: 8px;">Payment Details:</div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #6a6f73;">Payment Method:</span>
            <span>${paymentInfo?.paymentMethod || 'Card'}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span style="color: #6a6f73;">Transaction ID:</span>
            <span style="font-family: monospace;">${paymentInfo?.paymentId || 'N/A'}</span>
        </div>
      </div>

      <!-- CTA -->
      <a href="http://localhost:5173/dashboard/my-courses" style="display: block; width: 100%; padding: 12px 0; background-color: #a435f0; color: white; text-align: center; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 4px;">Start Learning</a>
    
    </div>

    <!-- Footer -->
    <div style="background: #f7f9fa; padding: 24px; text-align: center; font-size: 12px; color: #6a6f73; border-top: 1px solid #d1d7dc;">
       <p style="margin: 0 0 8px;">EduTalks Pvt Ltd, Hyderabad, India.</p>
       <p style="margin: 0;">Need help? <a href="mailto:support@edutalks.com" style="color: #5624d0; text-decoration: none;">Contact Support</a></p>
    </div>
  </div>
</div>
`;

/* ---------------- ENROLL COURSE ---------------- */
// Student only
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId, paymentInfo } = req.body;

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

    // ✅ 4. Send Email
    try {
      const user = await User.findById(req.user.id);
      const course = await Course.findById(courseId).populate("instructor");

      if (user && course) {
        const price = course.price;
        const discount = course.discount || 0;
        const total = Math.round(price * (1 - discount / 100));

        await sendEmail(
          user.email,
          `Confirmation: You've enrolled in ${course.title}!`,
          getReceiptHtml(user, course, price, discount, total, enrollment._id, paymentInfo)
        );
        console.log(`📧 SUCCESS: Enrollment email sent to ${user.email} for course "${course.title}"`);
      } else {
        console.warn("⚠️ Email skipped: User or Course not found for email generation.");
      }
    } catch (emailErr) {
      console.error("❌ EMAIL FAILED: Failed to send enrollment email:", emailErr.message);
      // We do not return error here to ensure enrollment persists
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

    console.log(`[MyCourses Debug] Total Enrollments Found: ${enrollments.length}`);
    console.log(`[MyCourses Debug] Valid Enrollments (Course Exists): ${validEnrollments.length}`);
    if (enrollments.length !== validEnrollments.length) {
      console.warn(`[MyCourses Warning] ${enrollments.length - validEnrollments.length} enrollments invalid (Course may be deleted).`);
    }

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

/* ---------------- CHECK ENROLLMENT STATUS ---------------- */
exports.checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    res.json({
      success: true,
      isEnrolled: !!enrollment
    });
  } catch (error) {
    console.error("Check status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
