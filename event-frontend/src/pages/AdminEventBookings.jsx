import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function AdminEventBookings() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  
  const fetchEventBookings = async () => {
    try {
      const res = await API.get(`/admin/events/${eventId}/bookings`);

      setEvent(res.data.event);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchEventBookings();
  }, []);


  if (!event) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* EVENT DETAILS */}
      <h2>{event.title}</h2>
      <p>
        📍 {event.location} <br />
        📅 {new Date(event.date).toDateString()} <br />
        💰 ₹{event.price}
      </p>

      <hr />

      {/* BOOKINGS LIST */}
      <h3>Bookings</h3>

      {bookings.length === 0 && <p>No bookings yet</p>}

      {bookings.map((booking) => (
        <div key={booking._id} style={card}>
          <p>
            <strong>User:</strong> {booking.user?.email}
          </p>
          <p>
            <strong>Status:</strong> {booking.status}
          </p>
          <p>
            <strong>Payment:</strong> {booking.paymentStatus}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default AdminEventBookings;

const card = {
  background: "#fff",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};
