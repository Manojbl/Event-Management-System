const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

// ================================
// RAZORPAY INSTANCE
// ================================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================================
// EMAIL TRANSPORTER
// ================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================================
// CREATE PAYMENT ORDER
// ================================
exports.createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        message: "Booking ID and amount are required",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to pay for this booking",
      });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `booking_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);

    booking.razorpayOrderId = order.id;
    await booking.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({
      message: "Payment order creation failed",
      error: error.message,
    });
  }
};

// ================================
// VERIFY PAYMENT + EMAIL TICKET
// ================================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingId
    ) {
      return res.status(400).json({
        message: "Payment verification failed: missing fields",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // Update booking as PAID
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    // Increment booked seats
    await Event.findByIdAndUpdate(
      booking.event,
      { $inc: { bookedSeats: 1 } },
      { new: true }
    );

    // ================================
    // QR CODE + EMAIL TICKET
    // ================================
    const event = await Event.findById(booking.event).populate("createdBy");

    const qrBuffer = await QRCode.toBuffer(booking._id.toString());
    
   
    await transporter.sendMail({
  from: `"Eventify" <${process.env.EMAIL_USER}>`,
  to: req.user.email,
  subject: "🎟 Your Event Ticket - Eventify",
  html: `
    <h2>Booking Confirmed 🎉</h2>

    <p><b>Event:</b> ${event.title}</p>
    <p><b>Location:</b> ${event.location}</p>
    <p><b>Date:</b> ${new Date(event.date).toDateString()}</p>
    <p><b>Price:</b> ₹${event.price}</p>

    <p><b>Show this QR code at entry:</b></p>
    <img src="cid:ticketqr" width="200" />

    <p><b>Booking ID:</b> ${booking._id}</p>

    <br/>
    <p>Thank you for booking with <b>Eventify</b> 🚀</p>
  `,
  attachments: [
    {
      filename: "ticket-qr.png",
      content: qrBuffer,
      cid: "ticketqr", // 🔥 MUST MATCH img src
    },
  ],
});

    res.status(200).json({
      success: true,
      message: "Payment verified & ticket emailed successfully",
      booking,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};