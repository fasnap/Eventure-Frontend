import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const paymentSuccess = localStorage.getItem("paymentSuccess");

    // If payment is not successful, redirect to the home page or event registration page
    if (paymentSuccess !== "true") {
      navigate("/"); // Redirect to homepage or event registration page
    } else {
      // Clear the payment success flag after successful access to the page
      localStorage.removeItem("paymentSuccess");

      // Redirect after a brief message, like 5 seconds
      const timer = setTimeout(() => {
        navigate("/attendee/registered_events"); // Adjust this URL as needed
      }, 5000);

      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="p-8 bg-white rounded-lg shadow-xl max-w-md text-center">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 text-green-500 mx-auto animate-bounce"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.707-4.707a1 1 0 011.414-1.414L8.414 13.172l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your payment. You will be redirected to your registered
          events shortly.
        </p>
        <button
          onClick={() => navigate("/attendee/registered_events")}
          className="px-6 py-2 bg-green-500 text-white rounded-full text-lg shadow-md hover:bg-green-600 transition-all duration-300"
        >
          View Registered Events
        </button>
        <p className="text-sm text-gray-500 mt-4">
          You will be redirected automatically in a few seconds.
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
