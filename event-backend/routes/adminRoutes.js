const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { eventOwnerOrAdmin } = require("../middleware/eventPermissions");

const {
  getDashboardStats,
  getEventBookings,
} = require("../controllers/adminController");

/* DASHBOARD */
router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);

/* ADMIN + EVENT OWNER */
router.get(
  "/events/:eventId/bookings",
  protect,
  eventOwnerOrAdmin,
  getEventBookings
);

module.exports = router;