const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date,
    paymentId: String,
    orderId: String,
    status: {
        type: String,
        enum: ["active", "expired", "pending"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
