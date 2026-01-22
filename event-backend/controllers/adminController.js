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

/* =========================
   EVENT PERFORMANCE (ADMIN)
========================= */
exports.getEventPerformance = async (req, res) => {
  try {
    const events = await Event.find();

    const performance = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({
          event: event._id,
          paymentStatus: "paid",
        });

        const totalBookings = bookings.length;

        const revenue = bookings.reduce(
          (sum, b) => sum + (b.eventPrice ?? event.price ?? 0),
          0
        );

        let status = "No Sales";
        if (totalBookings >= 5) status = "High Demand";
        else if (totalBookings > 0) status = "Low Demand";

        return {
          _id: event._id,
          title: event.title,
          location: event.location,
          totalBookings,
          revenue,
          status,
        };
      })
    );

    res.json({ performance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load event performance" });
  }
};


exports.scanQrCheckIn = async (req, res) => {
  try {
    let { bookingId } = req.body;

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