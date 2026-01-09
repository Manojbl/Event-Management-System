const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  createEvent,
  getAllEvents,
} = require("../controllers/eventController");

// PUBLIC: list events
router.get("/", getAllEvents);

// ADMIN: create event
router.post("/create", protect, adminOnly, createEvent);

module.exports = router;
