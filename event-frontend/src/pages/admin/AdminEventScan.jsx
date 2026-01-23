import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import API from "../../api/api";

function AdminEventScan() {
  const { eventId } = useParams();   // ✅ real eventId
  const scannerRef = useRef(null);

  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);

  const startScan = async () => {
    if (scanning) return;

    setMessage("");
    setScanning(true);

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader");
    }

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await scannerRef.current.stop();
          setScanning(false);

          verifyTicket(decodedText.trim());
        }
      );
    } catch (err) {
      console.error(err);
      setMessage("❌ Camera access failed");
      setScanning(false);
    }
  };

  const verifyTicket = async (bookingId) => {
    try {
      const res = await API.post(`/events/${eventId}/scan`, {
        bookingId,
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Scan failed"
      );
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>🎟 Scan Event Ticket</h2>

      <div id="qr-reader" style={scannerBox}></div>

      <button onClick={startScan} disabled={scanning} style={btn}>
        {scanning ? "📷 Scanning..." : "📷 Start Scan"}
      </button>

      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
}

export default AdminEventScan;

/* =========================
   STYLES (AFTER EXPORT ✅)
========================= */

const container = {
  maxWidth: "420px",
  margin: "40px auto",
  padding: "25px",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const title = {
  marginBottom: "20px",
  color: "#333",
};

const scannerBox = {
  border: "2px dashed #0d6efd",
  borderRadius: "10px",
  padding: "10px",
  marginBottom: "15px",
};

const btn = {
  padding: "10px 20px",
  background: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
};

const messageStyle = {
  marginTop: "15px",
  fontWeight: "bold",
};