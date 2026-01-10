import { Link } from "react-router-dom";

function UserNavbar() {

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
};


  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Eventify</div>

      <div style={styles.links}>
        <Link to="/events" style={styles.link}>Events</Link>
        <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
}

export default UserNavbar;

const styles = {
  navbar: {
    height: "60px",
    background: "#1f2933",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
  },
  logo: { fontSize: "22px", fontWeight: "bold" },
  links: { display: "flex", gap: "20px", alignItems: "center" },
  link: { color: "#fff", textDecoration: "none" },
  logout: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    cursor: "pointer",
  },
};
