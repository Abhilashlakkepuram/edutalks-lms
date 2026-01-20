const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const sendSms = require("../utils/sendSms");

const getOtpHtml = (otp) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px; text-align: center;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background: linear-gradient(90deg, #4f46e5, #ec4899); padding: 30px; color: white;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">EduTalks</h1>
      <p style="margin: 5px 0 0; opacity: 0.9; font-size: 16px;">Learn. Grow. Succeed.</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 22px;">Confirm Your Email</h2>
      <p style="color: #6b7280; margin-bottom: 30px; font-size: 16px; line-height: 1.5;">
        Welcome to EduTalks! Use the code below to complete your registration and start learning.
      </p>
      <div style="background: #eef2ff; border-radius: 8px; padding: 20px; display: inline-block; margin-bottom: 30px;">
        <span style="font-size: 36px; font-weight: bold; color: #4f46e5; letter-spacing: 5px; font-family: monospace;">${otp}</span>
      </div>
      <p style="color: #9ca3af; font-size: 14px;">
        This code will expire in 5 minutes.<br>
        If you didn't request this, please ignore this email.
      </p>
    </div>
    <div style="background: #f9fafb; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
      © ${new Date().getFullYear()} EduTalks LMS. All rights reserved.
    </div>
  </div>
</div>
`;

/* ---------------- REGISTER ---------------- */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isVerified: false
    });

    try {
      await sendEmail(email, "Your OTP Verification Code", getOtpHtml(otp));
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError.message);
      // FAILED TO SEND EMAIL - Let the user know!
      return res.status(500).json({
        success: false,
        message: "Registration successful but failed to send OTP email. Please contact support. Error: " + emailError.message
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered. OTP sent to email."
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



/* ---------------- LOGIN ---------------- */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify OTP first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ---------------- RESEND OTP ---------------- */
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    try {
      await sendEmail(email, "Resend: Your OTP Code", getOtpHtml(otp));
    } catch (emailError) {
      return res.status(500).json({ success: false, message: "Failed to send email" });
    }

    res.json({ success: true, message: "OTP resent successfully" });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ---------------- FORGOT PASSWORD ---------------- */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist."
      });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #4f46e5, #ec4899); padding: 30px; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">EduTalks</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 22px;">Reset Your Password</h2>
            <p style="color: #6b7280; margin-bottom: 30px; font-size: 16px; line-height: 1.5;">
              You requested to reset your password. Use the code below to proceed.
            </p>
            <div style="background: #eef2ff; border-radius: 8px; padding: 20px; display: inline-block; margin-bottom: 30px;">
              <span style="font-size: 36px; font-weight: bold; color: #4f46e5; letter-spacing: 5px; font-family: monospace;">${otp}</span>
            </div>
            <p style="color: #9ca3af; font-size: 14px;">
              This code will expire in 10 minutes.<br>
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      </div>
    `;

    try {
      await sendEmail(email, "Reset Your Password", emailHtml);
    } catch (emailError) {
      console.error("EMAIL ERROR (Reset Password):", emailError.message);
      // We still return success to the user for security reasons, but log it server-side
    }

    res.json({
      success: true,
      message: "If an account with that email exists, we have sent a password reset OTP."
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ---------------- VERIFY RESET OTP ---------------- */
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error("VERIFY RESET OTP ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ---------------- RESET PASSWORD ---------------- */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired session. Please start again."
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset fields
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    user.isVerified = true; // ✅ Mark user as verified since they proved email ownership

    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully. You can now login."
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
