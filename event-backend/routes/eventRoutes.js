const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { eventOwnerOrAdmin } = require("../middleware/eventPermissions");

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyHostedEvents,
} = require("../controllers/eventController");

const {
  getEventBookings,
  scanQrCheckIn,
} = require("../controllers/adminController");

/* =====================
   PUBLIC
===================== */
router.get("/", getAllEvents);

/* =====================
   HOST (MUST be before :id)
===================== */
router.get("/my-events", protect, getMyHostedEvents);
router.post("/", protect, createEvent);

/* =====================
   BOOKINGS & SCAN (ADMIN + OWNER)
===================== */
router.get("/:id/bookings", protect, eventOwnerOrAdmin, getEventBookings);
router.post("/:id/scan", protect, eventOwnerOrAdmin, scanQrCheckIn);

/* =====================
   EDIT / DELETE (ADMIN + OWNER)
===================== */
router.put("/:id", protect, eventOwnerOrAdmin, updateEvent);
router.delete("/:id", protect, eventOwnerOrAdmin, deleteEvent);

/* =====================
   SINGLE EVENT (KEEP LAST)
===================== */
router.get("/:id", getEventById);

module.exports = router;