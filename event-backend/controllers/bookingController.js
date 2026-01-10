const Booking = require("../models/Booking");
const Event = require("../models/Event");

// BOOK EVENT (USER)
exports.bookEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        message: "Event ID is required",
      });
    }

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
    });

    res.status(201).json({
      message: "Event booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// GET MY BOOKINGS (USER)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });
    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
