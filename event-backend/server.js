const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
connectDB();
const app=express();
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));


app.listen(process.env.PORT || 5000, () => {
  console.log("Server running at port http://localhost:${process.env.PORT || 5000}");
});