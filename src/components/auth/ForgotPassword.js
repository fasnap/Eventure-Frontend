import React, { useState } from "react";
import {
  forgotPassword,
  resetPassword,
  verifyOtpForgotPassword,
} from "../../api/auth";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP, Step 3: Enter New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification status
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      setStep(2); // Move to Step 2 if OTP sent successfully
    } catch (error) {
      setMessage("Error sending OTP: " + error.response.data.error);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyOtpForgotPassword(email, otp);
      setMessage(response.message);
      setOtpVerified(true); // Set OTP as verified if correct
      setStep(3);
    } catch (error) {
      setMessage("Invalid OTP: " + error.response.data.error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await resetPassword({
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage(response.message);
      setStep(1); // Reset to Step 1 after successful password reset
      navigate("/attendee/login");
    } catch (error) {
      setMessage("Error resetting password: " + error.response.data.error);
    }
  };

  return (
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Forgot Password
        </h1>
        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            } mb-4`}
          >
            {message}
          </p>
        )}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all duration-300 ease-in-out"
            >
              Send OTP
            </button>
          </form>
        )}
        {step === 2 && !otpVerified && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all duration-300 ease-in-out"
            >
              Verify OTP
            </button>
          </form>
        )}
        {otpVerified && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all duration-300 ease-in-out"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
