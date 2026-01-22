import { useEffect, useState } from "react";
import API from "../../api/api";

function UserBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/my-bookings");

        const bookingList = Array.isArray(res.data.bookings)
          ? res.data.bookings
          : [];

        setBookings(bookingList);
      } catch (err) {
        alert("Failed to load bookings");
        console.error(err.response?.data);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} style={card}>
            <h3>{booking.event?.title}</h3>
            <p><b>Location:</b> {booking.event?.location}</p>
            <p><b>Price:</b> ₹{booking.event?.price}</p>

            <p>
              <b>Payment Status:</b>{" "}
              <span style={{
                color: booking.paymentStatus === "paid" ? "green" : "orange"
              }}>
                {booking.paymentStatus.toUpperCase()}
              </span>
            </p>

            <p>
              <b>Booked On:</b>{" "}
              {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default UserBookings;

const card = {
  border: "1px solid #ccc",
  margin: "15px 0",
  padding: "15px",
  borderRadius: "5px",
};