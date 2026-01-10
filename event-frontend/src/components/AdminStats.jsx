import { useEffect, useState } from "react";
import API from "../api/api";

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/dashboard-stats");
      setStats(res.data);
    } catch {
      alert("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={styles.grid}>
      <Stat title="Total Events" value={stats.totalEvents} />
      <Stat title="Total Bookings" value={stats.totalBookings} />
      <Stat title="Revenue" value={`₹${stats.totalRevenue}`} />
      <Stat title="Upcoming Events" value={stats.upcomingEvents} />
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <p style={styles.value}>{value}</p>
    </div>
  );
}

export default AdminStats;

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  value: {
    fontSize: "26px",
    fontWeight: "bold",
    marginTop: "10px",
  },
};
