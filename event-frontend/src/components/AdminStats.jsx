import { useEffect, useState } from "react";
import API from "../api/api";

function AdminStats() {
  // ======================
  // STATE
  // ======================
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    revenue: 0,
    upcomingEvents: 0,
  });

  const [performance, setPerformance] = useState([]);

  // ======================
  // FETCH DATA
  // ======================
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
        console.error("Stats error:", err);
      }
    };

    const fetchPerformance = async () => {
      try {
        const res = await API.get("/admin/event-performance");
        setPerformance(res.data.performance || []);
      } catch (err) {
        console.error("Performance error:", err);
      }
    };

    fetchStats();
    fetchPerformance();
  }, []);

  // ======================
  // UI
  // ======================
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>📊 Admin Dashboard</h2>

      {/* ======================
          STATS CARDS
      ====================== */}
      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
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

      {/* ======================
          EVENT PERFORMANCE
      ====================== */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "15px" }}>📈 Event Performance</h3>

        {performance.length === 0 ? (
          <p>No events found</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#f3f3f3" }}>
                <th style={thStyle}>Event</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Bookings</th>
                <th style={thStyle}>Revenue</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {performance.map((e) => (
                <tr key={e._id} style={{ textAlign: "center" }}>
                  <td style={tdStyle}>{e.title}</td>
                  <td style={tdStyle}>{e.location}</td>
                  <td style={tdStyle}>{e.totalBookings}</td>
                  <td style={tdStyle}>₹{e.revenue}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "14px",
                        color: "#fff",
                        fontSize: "12px",
                        background:
                          e.status === "High Demand"
                            ? "green"
                            : e.status === "Low Demand"
                            ? "orange"
                            : "gray",
                      }}
                    >
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ======================
   TABLE STYLES
====================== */
const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

export default AdminStats;