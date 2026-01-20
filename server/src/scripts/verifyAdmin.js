const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const admins = await User.find({ role: "admin" });
    console.log("Admins found:", admins.length);
    admins.forEach(a => console.log(`- ${a.email} (${a.firstName})`));

    // If no admin, create one
    if (admins.length === 0) {
        console.log("No admin found. Creating one...");
        // You can uncomment this if you want to auto-create
        /*
        await User.create({
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            password: "hashedpassword...", // logic needed for hashing
            role: "admin"
        });
        */
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

verify();
