import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

function UserHostedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await API.get("/events/my-events");

      // ✅ Defensive check
      setEvents(res.data?.events || []);
    } catch (err) {
      console.error("Hosted Events Error:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load hosted events.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Loading your hosted events...</h3>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎤 My Hosted Events</h2>

      {events.length === 0 ? (
        <p>You haven’t created any events yet</p>
      ) : (
        events.map((event) => (
          <div key={event._id} style={card}>
            <h3>{event.title}</h3>

            <p>
              <b>📍 Location:</b> {event.location}
            </p>

            <p>
              <b>📅 Date:</b>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>

            <p>
              <b>💰 Price:</b> ₹{event.price}
            </p>

            <div style={{ marginTop: "12px" }}>
              <Link
                to={`/host/events/${event._id}/bookings`}
                style={btn}
              >
                View Bookings
              </Link>

              <Link
                to={`/host/events/${event._id}/scan`}
                style={btn}
              >
                Scan Tickets
              </Link>

              <Link
                to={`/host/events/edit/${event._id}`}
                style={btn}
              >
                Edit Event
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserHostedEvents;

/* ---------------- styles ---------------- */

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "6px",
  background: "#fff",
};

const btn = {
  marginRight: "10px",
  padding: "6px 12px",
  background: "#0d6efd",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "4px",
  display: "inline-block",
};