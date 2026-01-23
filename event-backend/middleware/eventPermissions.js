const Event = require("../models/Event");

exports.eventOwnerOrAdmin = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ PLATFORM ADMIN
    if (req.user.role === "admin") {
      return next();
    }

    // ✅ EVENT CREATOR (HOST)
    if (event.createdBy.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      message: "Permission denied for this event",
    });

  } catch (err) {
    console.error("PERMISSION ERROR:", err);
    res.status(500).json({ message: "Permission check failed" });
  }
};