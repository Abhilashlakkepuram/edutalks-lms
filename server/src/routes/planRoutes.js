const express = require("express");
const Plan = require("../models/Plan");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const plans = await Plan.find({ isActive: true });
        res.json({ success: true, plans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;