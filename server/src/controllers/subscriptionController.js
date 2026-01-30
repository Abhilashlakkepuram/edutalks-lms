const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

exports.subscribe = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user.id;

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        // Calculate end date
        let endDate = null;
        if (plan.durationInMonths > 0) {
            const date = new Date();
            date.setMonth(date.getMonth() + plan.durationInMonths);
            endDate = date;
        }

        // Check for existing active subscription and deactivate it? 
        // For now, we'll just create a new one. The middleware usually checks for *any* active one.
        // Ideally we should mark previous ones as expired, but let's keep it simple "stacking" or just latest.

        // Deactivate previous active subscriptions for this user
        await Subscription.updateMany(
            { user: userId, status: "active" },
            { status: "expired" }
        );

        const subscription = await Subscription.create({
            user: userId,
            plan: planId,
            startDate: new Date(),
            endDate: endDate,
            status: "active" // Auto-activate for now as per "get started" flow
        });

        res.status(201).json({
            success: true,
            message: "Subscribed successfully",
            subscription
        });

    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
