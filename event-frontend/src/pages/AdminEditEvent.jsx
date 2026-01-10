import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function AdminEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    location: "",
    date: "",
    price: "",
  });

  const fetchEvent = async () => {
    const res = await API.get("/events");
    const found = res.data.find((e) => e._id === id);
    if (found) setEvent(found);
  };
  
  useEffect(() => {
    fetchEvent();
  }, []);


  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/events/${id}`, event);
    alert("Event updated");
    navigate("/admin/events");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Event</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" value={event.title} onChange={handleChange} placeholder="Title" />
        <input name="location" value={event.location} onChange={handleChange} placeholder="Location" />
        <input type="date" name="date" value={event.date?.slice(0,10)} onChange={handleChange} />
        <input name="price" value={event.price} onChange={handleChange} placeholder="Price" />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}

export default AdminEditEvent;