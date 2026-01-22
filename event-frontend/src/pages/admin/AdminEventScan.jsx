import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../../api/api";

function AdminEventScan() {
  const scannerRef = useRef(null);
  const [message, setMessage] = useState("");

  const startScan = async () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader");
    }

    await scannerRef.current.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        await scannerRef.current.stop();
        verifyTicket(decodedText.trim());
      }
    );
  };

  const verifyTicket = async (bookingId) => {
    try {
      const res = await API.post("/events/${eventId}/scan", { bookingId });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid ticket");
    }
  };

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h2>Scan Ticket</h2>
      <div id="qr-reader" style={scannerBox}></div>
      <button onClick={startScan}>Start Scan</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminEventScan;

const scannerBox = {
  border: "2px dashed #007bff",
  borderRadius: 10,
  padding: 10,
  marginBottom: 10,
};