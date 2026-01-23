require("dotenv").config(); // Load environment variables (from .env in root or server root)
const mongoose = require("mongoose");
const Plan = require("../models/Plan");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/edutalks";

mongoose.connect(MONGO_URI)
    .then(() => console.log(`✅ Connected to MongoDB at ${MONGO_URI.split("@")[1] || "localhost"}`))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const plans = [
    {
        name: "Free Plan",
        price: 0,
        durationInMonths: 0,
        features: [
            "Limited courses access",
            "No exams",
            "Community support"
        ]
    },
    {
        name: "Starter Plan",
        price: 499,
        durationInMonths: 3,
        features: [
            "All courses access",
            "Exams enabled",
            "Email support"
        ]
    },
    {
        name: "Pro Plan",
        price: 899,
        durationInMonths: 6,
        features: [
            "All courses access",
            "Exams enabled",
            "Certificate included",
            "Download materials"
        ]
    },
    {
        name: "Ultimate Plan",
        price: 1499,
        durationInMonths: 12,
        features: [
            "All courses access",
            "Exams enabled",
            "Certificate included",
            "Priority support"
        ]
    }
];

const seedPlans = async () => {
    try {
        await Plan.deleteMany({}); // Optional: clear existing plans
        await Plan.insertMany(plans);
        console.log("✅ Plans Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedPlans();
