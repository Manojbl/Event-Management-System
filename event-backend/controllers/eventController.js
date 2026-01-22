const Event = require("../models/Event");

/* GET ALL EVENTS */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

/* GET EVENT BY ID */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch {
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

/* CREATE EVENT */
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(event);
  } catch {
    res.status(500).json({ message: "Failed to create event" });
  }
};

/* UPDATE EVENT (ADMIN + OWNER) */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (
      req.user.role !== "admin" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch {
    res.status(500).json({ message: "Failed to update event" });
  }
};

/* DELETE EVENT (ADMIN + OWNER) */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (
      req.user.role !== "admin" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete event" });
  }
};

/* MY HOSTED EVENTS */
exports.getMyHostedEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id });
    res.json({ events });
  } catch {
    res.status(500).json({ message: "Failed to fetch hosted events" });
  }
};