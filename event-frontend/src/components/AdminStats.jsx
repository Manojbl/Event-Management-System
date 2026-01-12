import { useEffect, useState } from "react";
import API from "../api/api";

function AdminStats() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    revenue: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/dashboard-stats");
        setStats({
          totalEvents: res.data.totalEvents || 0,
          totalBookings: res.data.totalBookings || 0,
          revenue: res.data.revenue || 0,
          upcomingEvents: res.data.upcomingEvents || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="stats-grid">
      <div className="stat-card blue">
        <h4>Total Events</h4>
        <h2>{stats.totalEvents}</h2>
      </div>

      <div className="stat-card green">
        <h4>Total Bookings</h4>
        <h2>{stats.totalBookings}</h2>
      </div>

      <div className="stat-card orange">
        <h4>Revenue</h4>
        <h2>₹{stats.revenue}</h2>
      </div>

      <div className="stat-card red">
        <h4>Upcoming Events</h4>
        <h2>{stats.upcomingEvents}</h2>
      </div>
    </div>
  );
}

export default AdminStats;