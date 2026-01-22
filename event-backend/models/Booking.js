const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    status: {
      type: String,
      enum: ["booked", "cancelled", "checked-in"],
      default: "booked",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    checkedIn:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
