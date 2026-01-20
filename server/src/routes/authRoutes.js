const express = require("express");
const { register, login, verifyOtp, forgotPassword, verifyResetOtp, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", require("../controllers/authController").resendOtp);
router.post("/login", login);

// Forgot Password Flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
