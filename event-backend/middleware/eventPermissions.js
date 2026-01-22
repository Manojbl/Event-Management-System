const Event = require("../models/Event");

exports.eventOwnerOrAdmin = async (req, res, next) => {
  try {
    // ✅ Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // ✅ Works for both :id and :eventId
    const eventId = req.params.id || req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  } catch (err) {
    console.error("PERMISSION ERROR:", err);
    res.status(500).json({ message: "Permission check failed" });
  }
};