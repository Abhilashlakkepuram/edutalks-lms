const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: String,
    price: Number,
    durationInMonths: Number,
    features: [String],
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Plan", planSchema);