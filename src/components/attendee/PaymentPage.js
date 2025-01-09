import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createRazorpayOrder } from "../../api/event";
import { EVENT_BASE_URL } from "../../api/base";
import Header from "../shared/Header";

function PaymentPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { paymentData, loading, error } = useSelector((state) => state.payment);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) {
      loadRazorpayScript();
    }
  }, [scriptLoaded]);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => alert("Failed to load Razorpay script.");
    document.body.appendChild(script);
  };

  useEffect(() => {
    console.log("payment data loaded", paymentData);
    const canAccessPaymentPage = sessionStorage.getItem("canAccessPaymentPage");

    // If the user is not authorized to access this page, redirect them
    if (!canAccessPaymentPage) {
      navigate(`/attendee/events/${id}`); // Redirect back to the event detail page
    }

    // After the user navigates away, remove the flag
    return () => {
      sessionStorage.removeItem("canAccessPaymentPage");
    };
  }, [navigate, id]);

  useEffect(() => {
    // Dispatch the action to create the Razorpay order
    dispatch(createRazorpayOrder(id));
  }, [id, dispatch]);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      alert("Please wait while the payment script is loading.");
      return;
    }

    if (paymentData) {
      const options = {
        key: "rzp_test_mUKgq4YSORS7yB", // Replace with your Razorpay key ID
        amount: paymentData.amount, // Amount in paise
        currency: "INR",
        name: "Your Company Name",
        description: "Event Registration Payment",
        order_id: paymentData.order_id, // Razorpay order ID
        handler: async function (response) {
          try {
            localStorage.setItem("paymentSuccess", "true");
            navigate("/payment-success");
            const paymentDetails = {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              event_id: id,
            };

            const res = await fetch(
              `${EVENT_BASE_URL}registerPaidEvent/${id}/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(paymentDetails),
              }
            );
            if (!res.ok) throw new Error("Error saving registration data.");
          } catch (error) {
            console.error("Error saving registration:", error);
            alert("An error occurred while saving registration data.");
          }
        },
        prefill: {
          name: paymentData.name,
          email: paymentData.email,
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function () {
            localStorage.setItem("paymentFailed", "true");
            navigate("/payment-failure");
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Failed to fetch payment details");
    }
  };

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Payment Page
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            You are paying for registering Event
          </p>{" "}
          {loading && (
            <p className="text-gray-500">Loading payment details...</p>
          )}
          {error && (
            <p className="text-red-500 mb-4">
              {typeof error === "object" ? JSON.stringify(error) : error}
            </p>
          )}
          {paymentData && (
            <p className="text-lg text-gray-700 mb-6">
              Amount:{" "}
              <span className="font-bold text-green-600">
                ₹{(paymentData.amount / 100).toFixed(2)}
              </span>
            </p>
          )}
          <button
            onClick={handlePayment}
            disabled={loading || !paymentData}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Having trouble?{" "}
            <a href="/help" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
