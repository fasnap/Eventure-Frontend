import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentFailurePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const paymentFailed = localStorage.getItem("paymentFailed");

    // Redirect to homepage or event detail if payment wasn't flagged as failed
    if (paymentFailed !== "true") {
      navigate("/"); // Adjust the redirect as needed
    } else {
      // Clear the failure flag
      localStorage.removeItem("paymentFailed");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-red-100">
      <div className="p-8 bg-white rounded-lg shadow-xl max-w-md text-center">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 text-red-500 mx-auto animate-bounce"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.707 4.293a1 1 0 010 1.414L4.414 8H16a1 1 0 110 2H4.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-700 mb-6">
          Unfortunately, your payment could not be processed. Please try again.
        </p>
        <button
          onClick={() => navigate(`/attendee/events`)}
          className="px-6 py-2 bg-red-500 text-white rounded-full text-lg shadow-md hover:bg-red-600 transition-all duration-300"
        >
          Go Back to Event
        </button>
        <p className="text-sm text-gray-500 mt-4">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}

export default PaymentFailurePage;
