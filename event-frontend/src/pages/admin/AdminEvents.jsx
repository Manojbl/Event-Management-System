import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Events</h2>

      {events.length === 0 && <p>No events found</p>}

      {events.map((event) => (
        <div key={event._id} style={card}>
          <h3>{event.title}</h3>
          <p>
            📍 {event.location}<br />
            📅 {new Date(event.date).toDateString()}<br />
            💰 ₹{event.price}
          </p>

          <div style={btnGroup}>
            <button
              type="button"
              onClick={() =>
                navigate(`/admin/events/edit/${event._id}`)
              }
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/admin/events/${event._id}/bookings`)
              }
            >
              Bookings
            </button>

            <button
              type="button"
              style={{ background: "red", color: "#fff" }}
              onClick={() => handleDelete(event._id)}
            >
              Delete
            </button>
            <button
            onClick={() => navigate(`/admin/events/${event._id}/scan`)}
            style={scanBtn}
          >
            🎫 Scan Tickets
          </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminEvents;

const card = {
  background: "#fff",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "15px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const btnGroup = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
};

const scanBtn = {
  padding: "6px 12px",
  background: "#111827",
  color: "#fff",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};