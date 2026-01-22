const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getEventBookings,
  getEventPerformance,
  scanQrCheckIn,
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
console.log("adminOnly", adminOnly);
console.log("scanQrCheckIn", typeof scanQrCheckIn);
router.get("/event-performance", protect, adminOnly, getEventPerformance);
router.post("/scan-qr", protect, adminOnly, scanQrCheckIn);

module.exports = router;