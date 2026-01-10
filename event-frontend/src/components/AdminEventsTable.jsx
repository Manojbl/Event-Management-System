import { useEffect, useState } from "react";
import API from "../api/api";

function AdminEventsTable() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data.events || []);
    } catch {
      alert("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(`/events/${id}`);
      fetchEvents();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={styles.card}>
      <h2>Manage Events</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>{e.location}</td>
              <td>₹{e.price}</td>
              <td>
                <button style={styles.edit}>Edit</button>
                <button
                  style={styles.delete}
                  onClick={() => deleteEvent(e._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEventsTable;

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginTop: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },
  edit: {
    marginRight: "8px",
    padding: "4px 8px",
    cursor: "pointer",
  },
  delete: {
    padding: "4px 8px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
