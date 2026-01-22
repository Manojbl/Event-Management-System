import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";

function AdminEventBookings() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get(`/events/${eventId}/bookings`);
      setEvent(res.data.event);
      setBookings(res.data.bookings || []);
    } catch (err) {
      alert("Failed to load bookings");
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{event.title}</h2>
      <p>📍 {event.location}</p>

      <h3>Bookings</h3>

      {bookings.length === 0 && <p>No bookings yet</p>}

      {bookings.map((b) => (
        <div key={b._id} style={card}>
          <p><b>User:</b> {b.user?.email}</p>
          <p><b>Status:</b> {b.status}</p>
          <p><b>Payment:</b> {b.paymentStatus}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminEventBookings;

const card = {
  padding: 12,
  border: "1px solid #ccc",
  borderRadius: 6,
  marginBottom: 10,
};