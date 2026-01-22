import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../api/api";

function AdminEventScan() {
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
          // ✅ stop camera immediately
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
    setMessage("⏳ Verifying ticket...");

    try {
      const res = await API.post("/admin/scan-qr", { bookingId });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Invalid / already used ticket"
      );
    }
  };

  return (
    <div style={container}>
      <h2>🎟 Scan Event Ticket</h2>

      <div id="qr-reader" style={scannerBox}></div>

      <button onClick={startScan} disabled={scanning} style={btn}>
        {scanning ? "📷 Scanning..." : "📷 Start Scan"}
      </button>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
}

export default AdminEventScan;

/* ---------- styles ---------- */

const container = {
  maxWidth: "420px",
  margin: "auto",
  padding: "30px",
  textAlign: "center",
};

const scannerBox = {
  border: "2px dashed #007bff",
  borderRadius: "12px",
  padding: "10px",
  marginBottom: "15px",
};

const btn = {
  padding: "10px 18px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};