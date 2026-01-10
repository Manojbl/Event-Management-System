import AdminStats from "../components/AdminStats";
function AdminDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Dashboard</h1>
      <AdminStats />
    </div>
  );
}

export default AdminDashboard;

const styles = {
  container: {
    padding: "30px",
    background: "#f4f6f8",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "20px",
  },
};
