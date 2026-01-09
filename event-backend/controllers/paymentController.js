const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================================
// CREATE PAYMENT ORDER
// ================================
exports.createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // 1️⃣ Validate input
    if (!bookingId || !amount) {
      return res.status(400).json({
        message: "Booking ID and amount are required",
      });
    }

    // 2️⃣ Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // 3️⃣ (IMPORTANT) Ensure same user is paying
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to pay for this booking",
      });
    }

    // 4️⃣ Create Razorpay order
    const options = {
      amount: amount * 100, // rupees → paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);

    // 5️⃣ Save Razorpay order ID in booking
    booking.razorpayOrderId = order.id;
    await booking.save();

    // 6️⃣ Send response to frontend
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
// VERIFY PAYMENT
// ================================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // 1️⃣ Validate input
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

    // 2️⃣ Generate signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 3️⃣ Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // 4️⃣ Update booking as PAID
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
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
