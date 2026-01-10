import { Link } from "react-router-dom";

function AdminNavbar() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav style={nav}>
      <h2 style={{ color: "#fff" }}>Eventify</h2>

      <div>
        <Link to="/admin" style={link}>Dashboard</Link>
        <Link to="/admin/events" style={link}>Events</Link>
        <Link to="/admin/create-event" style={link}>Create Event</Link>
        <button onClick={logout} style={logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

export default AdminNavbar;

const nav = {
  background: "#0f172a",
  padding: "15px",
  display: "flex",
  justifyContent: "space-between",
};

const link = {
  color: "#fff",
  marginRight: "15px",
  textDecoration: "none",
};

const logoutBtn = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
};
