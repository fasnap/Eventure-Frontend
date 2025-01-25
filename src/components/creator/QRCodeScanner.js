import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useDispatch, useSelector } from "react-redux";
import { markAttendance } from "../../api/event";

const QRCodeScanner = ({ selectedEventId, eventCreator, onScanComplete }) => {
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const attendanceMessage = useSelector(
    (state) => state.events.attendanceMessage
  );
  const [scanSuccess, setScanSuccess] = useState(false); // Track scan success state
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [scannerEnabled, setScannerEnabled] = useState(true);

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const onScanSuccess = (decodedText) => {
    // Your existing attendance marking logic
    markAttendance({
      qrCodeData: decodedText,
      eventId: selectedEventId,
    });
  };
  const handleError = (err) => {
    console.error(err);
    setMessage("Error scanning QR code.");
    setScanSuccess(false);
    setShowModal(true);
    setScannerEnabled(false);
  };
  const handleCloseModal = () => {
    setShowModal(false); // Close modal
    setMessage("");
    setLastScannedCode(null);
    setScannerEnabled(true);
  };

  const handleBack = () => {
    if (onScanComplete) {
      onScanComplete();
    }
  };

  const onScanError = (error) => {
    console.error(error);
  };

  return <div id="reader" style={{ width: "100%" }}></div>;
};

export default QRCodeScanner;
