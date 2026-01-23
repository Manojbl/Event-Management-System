const Booking = require("../models/Booking");

exports.canScanTicket = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID required" });
    }

    const booking = await Booking.findById(bookingId).populate("event");

    if (!booking || !booking.event) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ Admin can scan any ticket
    if (req.user.role === "admin") {
      req.booking = booking;
      return next();
    }

    // ✅ Event creator can scan their own event tickets
    if (
      booking.event.createdBy.toString() === req.user._id.toString()
    ) {
      req.booking = booking;
      return next();
    }

    return res.status(403).json({ message: "Permission denied" });
  } catch (err) {
    console.error("SCAN PERMISSION ERROR:", err);
    res.status(500).json({ message: "Permission check failed" });
  }
};