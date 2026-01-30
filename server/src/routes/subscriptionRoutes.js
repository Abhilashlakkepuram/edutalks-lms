const express = require("express");
const { subscribe } = require("../controllers/subscriptionController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// POST /api/subscriptions/subscribe
router.post("/subscribe", authMiddleware, subscribe);

module.exports = router;
