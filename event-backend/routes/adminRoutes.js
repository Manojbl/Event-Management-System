const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getEventBookings,
} = require("../controllers/adminController");

// dashboard stats
router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);

// ✅ EVENT BOOKINGS (THIS WAS MISSING)
router.get(
  "/events/:eventId/bookings",
  protect,
  adminOnly,
  getEventBookings
);

module.exports = router;