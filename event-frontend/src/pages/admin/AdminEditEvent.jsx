import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

function AdminEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setEvent(res.data);
    } catch {
      alert("Failed to load event");
    }
  };

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/events/${id}`, event);
    alert("Event updated");
    navigate(-1);
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Event</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" value={event.title} onChange={handleChange} />
        <input name="location" value={event.location} onChange={handleChange} />
        <input
          type="date"
          name="date"
          value={event.date?.slice(0, 10)}
          onChange={handleChange}
        />
        <input name="price" value={event.price} onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default AdminEditEvent;