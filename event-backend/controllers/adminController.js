const Event = require("../models/Event");
const Booking = require("../models/Booking");

/* =========================
   DASHBOARD STATS
========================= */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$eventPrice" } } },
    ]);

    const revenue = revenueAgg.length ? revenueAgg[0].total : 0;

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