const Event = require("../models/Event");
const Booking = require("../models/Booking");

/* DASHBOARD */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const paidBookings = await Booking.find({
      paymentStatus: "paid",
    }).populate("event", "price");

    let revenue = 0;
    paidBookings.forEach((b) => {
      if (b.event?.price) revenue += b.event.price;
    });

    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() },
    });

    res.json({ totalEvents, totalBookings, revenue, upcomingEvents });
  } catch {
    res.status(500).json({ message: "Admin stats failed" });
  }
};

/* EVENT BOOKINGS */
exports.getEventBookings = async (req, res) => {
  try {
    const eventId = req.params.id || req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const bookings = await Booking.find({ event: eventId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ event, bookings });
  } catch {
    res.status(500).json({ message: "Failed to fetch event bookings" });
  }
};

/* QR SCAN */
const mongoose = require("mongoose");

exports.scanQrCheckIn = async (req, res) => {
  try {
    let { bookingId } = req.body;
    const eventId = req.params.id;

    // QR may contain JSON
    if (typeof bookingId === "string" && bookingId.startsWith("{")) {
      bookingId = JSON.parse(bookingId).bookingId;
    }

    if (!bookingId || bookingId.length !== 24) {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    const booking = await Booking.findById(bookingId).populate("event");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔥 CRITICAL FIX — event ownership validation
    if (booking.event._id.toString() !== eventId) {
      return res
        .status(403)
        .json({ message: "Ticket does not belong to this event" });
    }

    if (booking.checkedIn) {
      return res.status(400).json({ message: "Ticket already used" });
    }

    booking.checkedIn = true;
    booking.status = "checked-in";
    booking.checkedInAt = new Date();
    await booking.save();

    res.json({ message: "✅ Entry allowed" });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    res.status(500).json({ message: "QR scan failed" });
  }
};