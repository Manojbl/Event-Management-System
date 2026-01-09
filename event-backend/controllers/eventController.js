const Event = require("../models/Event");

// CREATE EVENT (ADMIN ONLY)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price } = req.body;

    if (!title || !description || !date || !location || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      price,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// GET ALL EVENTS (PUBLIC)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
