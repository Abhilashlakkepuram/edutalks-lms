// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("EMAIL CONFIG ERROR:", error);
//   } else {
//     console.log("✅ Email server is ready");
//   }
// });

// module.exports = async (email, otp) => {
//   await transporter.sendMail({
//     from: `"LMS App" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Your OTP Verification Code",
//     html: `<h2>Your OTP is ${otp}</h2><p>Expires in 5 minutes</p>`
//   });
// };
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: (process.env.EMAIL_PASS || "").replace(/\s+/g, "")
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ EMAIL CONFIG ERROR:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

module.exports = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"EduTalks LMS" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    });
    console.log("✅ Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ SEND EMAIL ERROR:", error);
    throw error;
  }
};
