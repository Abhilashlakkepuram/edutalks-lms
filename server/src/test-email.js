require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync("src/email-test-output.txt", msg + "\n");
};

const testEmail = async () => {
    fs.writeFileSync("src/email-test-output.txt", "--- Email Diagnostic Start ---\n");
    log("🔍 Checking Email Configuration...");

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        log("❌ Missing EMAIL_USER or EMAIL_PASS in .env file");
        return;
    }

    log(`📧 User: ${user}`);
    log(`🔑 Pass (raw): '${pass}'`);
    log(`🔑 Pass (length): ${pass.length} characters`);

    // Clean password same as production code
    const cleanPass = pass.replace(/\s+/g, "");
    log(`🧹 Cleaned Pass (length): ${cleanPass.length} characters`);

    if (cleanPass.length !== 16) {
        log("❌ ERROR: App Password must be EXACTLY 16 characters.");
        log(`   Yours is ${cleanPass.length} characters long.`);
    } else {
        log("✅ Password length is correct (16 characters).");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: user,
            pass: cleanPass
        }
    });

    try {
        log("📡 Attempting to connect to Gmail...");
        await transporter.verify();
        log("✅ SUCCESS! Your credentials are correct.");
    } catch (error) {
        log("❌ CONNECTION FAILED:");
        log(error.message);

        if (error.response && error.response.includes("535-5.7.8")) {
            log("\n⚠️  DIAGNOSIS: Invalid Username or Password.");
            log("1. Check if 'EMAIL_USER' is exactly your Gmail address.");
            log("2. Check if 'EMAIL_PASS' is a valid 16-character App Password.");
            log("3. Ensure 2-Step Verification is ENABLED on your Google Account.");
            log("4. Generate a NEW App Password if unsure.");
        }
    }
};

testEmail();
