import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

/* AUTH PAGES */
import Login from "./pages/Login";
import Register from "./pages/Register";

/* USER PAGES */
import Events from "./pages/UserEvents";
import MyBookings from "./pages/UserBookings";

/* ADMIN PAGES */
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminEventBookings from "./pages/AdminEventBookings";
import AdminCreateEvent from "./pages/AdminCreateEvents";
import AdminEditEvent from "./pages/AdminEditEvent";
import AdminEventScan from "./pages/AdminEventScan";

/* NAVBARS */
import UserNavbar from "./components/UserNavbar";
import AdminNavbar from "./components/AdminNavbar";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔄 SYNC AUTH STATE ON PAGE REFRESH */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    setToken(storedToken);
    setRole(storedRole);
    setLoading(false);
  }, []);

  /* ⏳ WAIT UNTIL AUTH STATE IS READY */
  if (loading) return <p>Loading...</p>;

  /* ❌ NOT LOGGED IN */
  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  /* ✅ LOGGED IN – ADMIN */
  if (role === "admin") {
    return (
      <BrowserRouter>
        <AdminNavbar />
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route
            path="/admin/events/:eventId/bookings"
            element={<AdminEventBookings />}
          />
          <Route path="/admin/create-event" element={<AdminCreateEvent />} />
          <Route path="/admin/events/edit/:id" element={<AdminEditEvent />} />
          <Route path="/admin/events/:eventId/scan" element={<AdminEventScan />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  /* ✅ LOGGED IN – USER */
  return (
    <BrowserRouter>
      <UserNavbar />
      <Routes>
        <Route path="/events" element={<Events />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;