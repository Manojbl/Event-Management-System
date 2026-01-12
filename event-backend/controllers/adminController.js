const Event = require("../models/Event");
const Booking = require("../models/Booking");

/* =========================
   DASHBOARD STATS
========================= */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // ✅ FIXED REVENUE CALCULATION
    const paidBookings = await Booking.find({
      paymentStatus: "paid",
    }).populate("event", "price");

    let revenue = 0;
    paidBookings.forEach((b) => {
      if (b.event && b.event.price) {
        revenue += b.event.price;
      }
    });

    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() },
    });

    res.json({
      totalEvents,
      totalBookings,
      revenue,
      upcomingEvents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin stats failed" });
  }
};

/* =========================
   EVENT BOOKINGS (ADMIN)
========================= */
exports.getEventBookings = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const bookings = await Booking.find({ event: eventId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      event,
      bookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch event bookings" });
  }
};