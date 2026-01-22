import { useState } from "react";
import API from "../api/api";

function AdminCreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/events/create", {
        title,
        description,
        location,
        date,
        price,
        capacity,
      });

      alert("Event created successfully ✅");

      // Clear form after success
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setPrice("");
      setCapacity("");
    } catch (err) {
      console.error("CREATE EVENT ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create event ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "500px", margin: "auto" }}>
      <h2>Create Event (Admin)</h2>

      <form onSubmit={handleCreateEvent}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <textarea
          placeholder="Description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          required
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          type="date"
          value={date}
          required
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          required
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 15 }}
        />

        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          required
          onChange={(e) => setCapacity(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 15 }}
        />  

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default AdminCreateEvent;
