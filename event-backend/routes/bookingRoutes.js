const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  bookEvent,
  getMyBookings,
} = require("../controllers/bookingController");

// USER: book event
router.post("/", protect, bookEvent);

// USER: view my bookings
router.get("/my", protect, getMyBookings);

module.exports = router;
