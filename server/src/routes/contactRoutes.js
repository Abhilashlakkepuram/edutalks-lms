const express = require("express");
const { submitContact, getAllContacts, updateContactStatus, deleteContact } = require("../controllers/contactController");
const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public: Submit a query
router.post("/", submitContact);

// Admin: Get all queries & Update status
router.get("/", protect, authorize("admin"), getAllContacts);
router.put("/:id", protect, authorize("admin"), updateContactStatus);
router.delete("/:id", protect, authorize("admin"), deleteContact);

module.exports = router;

