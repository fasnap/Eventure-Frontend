import { useState } from "react";
import QRScanner from "react-qr-scanner";
import { useDispatch, useSelector } from "react-redux";
import { markAttendance } from "../../api/event";

const QRCodeScanner = ({ selectedEventId, eventCreator }) => {
  const [lastScannedCode, setLastScannedCode] = useState(null);

  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const attendanceMessage = useSelector(
    (state) => state.events.attendanceMessage
  );
  const [scanSuccess, setScanSuccess] = useState(false); // Track scan success state
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  const handleScan = async (data) => {
    if (!data || !data.text || data.text === lastScannedCode || isProcessing) {
      return;
    }
    console.log("Scanned QR code data:", data);

    setIsProcessing(true);
    setScanSuccess(false);
    setShowModal(false);

    try {
      console.log("event id is ",selectedEventId)
      console.log("qr data is event id ", data)
      const response = await dispatch(
        markAttendance({
          qrCodeData: data.text,
          eventId: selectedEventId,
        })
      );

      console.log("repsosne payload", response.payload);
      if (response.payload?.error) {
        setMessage(response.payload.error);
      } else {
        setMessage("QR Code validated successfully.");
      }
      setShowModal(true);

      setLastScannedCode(data.text);
    } catch (error) {
      console.error("Error during QR code scan:", error);
      setMessage("An unexpected error occurred while processing the QR code.");
      setShowModal(true);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleError = (err) => {
    console.error(err);
    setMessage("Error scanning QR code.");
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false); // Close modal
    setMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
      {/* Modal-like background */}
      <div className="relative w-2/4 h-3/4 bg-black rounded-lg overflow-hidden">
        {/* QR Scanner */}
        <QRScanner
          delay={300}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: 1,
            objectFit: "cover", // Ensures the image scales correctly
          }}
          onScan={handleScan}
          onError={handleError}
        />

        {/* Scanning Area Frame */}
        <div className="absolute w-full h-full border-4 border-dashed border-white rounded-lg z-20 flex justify-center items-center">
          <div className="text-white">Scan QR Code</div>
        </div>
      </div>

      {/* Modal for success/failure */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
          <div className="relative w-2/4 bg-white p-6 rounded-lg">
            <div className="flex justify-center items-center mb-4">
              {scanSuccess ? (
                <div className="text-green-500 text-6xl">✔</div> // Large green tick
              ) : (
                <div className="text-red-500 text-6xl">❌</div> // Red cross for failure
              )}
            </div>
            <div className="text-center text-lg font-semibold">{message}</div>
            <button
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md"
              onClick={handleCloseModal} // Close modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
