const express = require("express");
const { createCheckoutSession } = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
    "/checkout",
    authMiddleware,
    roleMiddleware("student"),
    createCheckoutSession
);

module.exports = router;