const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: "admin@example.com" });
        if (existingAdmin) {
            console.log("Admin already exists (admin@example.com). Resetting role to 'admin' just in case.");
            existingAdmin.role = "admin";
            await existingAdmin.save();
            console.log("Admin role verified.");
            process.exit();
        }

        // Create new admin
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await User.create({
            firstName: "Super",
            lastName: "Admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin",
            isVerified: true
        });

        console.log("✅ Admin created successfully!");
        console.log("Email: admin@example.com");
        console.log("Password: admin123");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
