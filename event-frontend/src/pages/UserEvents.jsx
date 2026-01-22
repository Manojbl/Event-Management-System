import { useEffect, useState } from "react";
import API from "../api/api";

function UserEvents() {
  const [events, setEvents] = useState([]);
  const [bookedEventIds, setBookedEventIds] = useState(new Set());
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchEventsAndBookings();
  }, []);

  // ======================
  // FETCH EVENTS + BOOKINGS
  // ======================
  const fetchEventsAndBookings = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        API.get("/events"),
        API.get("/bookings/my-bookings"),
      ]);

      const eventList = Array.isArray(eventsRes.data)
        ? eventsRes.data
        : eventsRes.data.events || [];

      setEvents(eventList);

      // extract booked event IDs
      const bookedIds = new Set(
        (bookingsRes.data.bookings || [])
          .filter(b => b.paymentStatus === "paid")
          .map(b => b.event._id)
      );

      setBookedEventIds(bookedIds);
    } catch (err) {
      alert("Failed to load events");
      console.error(err);
    }
  };

  // ======================
  // BOOK EVENT
  // ======================
  const handleBook = async (eventId, price) => {
    try {
      setLoading(true);

      const res = await API.post("/bookings", { eventId });
      const bookingId = res.data.booking._id;

      // create payment
      await handleCreateOrder(bookingId, price);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // PAYMENT
  // ======================
  const handleCreateOrder = async (bookingId, amount) => {
    const res = await API.post("/payments/create-order", {
      bookingId,
      amount,
    });

    const { orderId, key } = res.data;

    const options = {
      key,
      amount: amount * 100,
      currency: "INR",
      name: "Event Management System",
      order_id: orderId,

      handler: async (response) => {
        await API.post("/payments/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingId,
        });

        alert("Booking confirmed ✅");

        // 🔥 refresh events + bookings
        fetchEventsAndBookings();
      },
    };

    new window.Razorpay(options).open();
  };

  // ======================
  // UI
  // ======================
  return (
    <div style={{ padding: "20px" }}>
      <h2>Events</h2>

      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        events.map((event) => {
          const isBooked = bookedEventIds.has(event._id);

          return (
            <div key={event._id} style={card}>
              <h3>{event.title}</h3>
              <p><b>Location:</b> {event.location}</p>
              <p><b>Price:</b> ₹{event.price}</p>
              <p>
                <b>Seats Remaining:</b>{" "}
                <span
                  style={{
                    color:
                      event.capacity - event.bookedSeats <= 0
                        ? "red"
                        : event.capacity - event.bookedSeats <= 3
                        ? "orange"
                        : "green",
                    fontWeight: "bold",
                  }}
                >
                  {event.capacity - event.bookedSeats}
                </span>
              </p>

              {isBooked ? (
                <span style={bookedBadge}>BOOKED</span>
              ) : event.bookedSeats >= event.capacity ? (
                <span style={{ ...bookedBadge, backgroundColor: "red" }}>
                  FULLY BOOKED
                </span>
              ) : (
                <button
                  onClick={() => handleBook(event._id, event.price)}
                  disabled={loading}
                  style={btn}
                >
                  Book & Pay
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default UserEvents;

/* ======================
   STYLES
====================== */

const card = {
  border: "1px solid #ccc",
  margin: "15px 0",
  padding: "15px",
  borderRadius: "5px",
};

const btn = {
  padding: "8px 15px",
  backgroundColor: "#3399cc",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const bookedBadge = {
  display: "inline-block",
  padding: "6px 12px",
  backgroundColor: "green",
  color: "#fff",
  borderRadius: "4px",
  fontWeight: "bold",
};