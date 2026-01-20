require('dotenv').config();
try {
    const sendEmail = require('./utils/sendEmail');
    console.log("✅ sendEmail loaded successfully");
} catch (error) {
    console.error("❌ Crashed loading sendEmail:", error);
}
