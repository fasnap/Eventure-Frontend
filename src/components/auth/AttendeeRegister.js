import React, { useState } from "react";
import { registerUser, verifyOtp } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { loginSuccess } from "../../features/authSlice";
import { useDispatch } from "react-redux";
function AttendeeRegister() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    user_type: "attendee",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, username, password, confirm_password } = formData;
    const errors = {};

    if (!username) {
      errors.username = "Username is required";
    } else if (/\s/.test(username)) {
      errors.username = "Username should not contain spaces";
    } else if (!/^[a-zA-Z]{4,}$/.test(username)) {
      errors.username =
        "Username must be at least 4 characters long and only contain letters";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (/\s/.test(email)) {
      errors.email = "Email should not contain spaces";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (/\s/.test(password)) {
      errors.password = "Password should not contain spaces";
    } else if (
      !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}/.test(
        password
      )
    ) {
      errors.password =
        "Password must be at least 8 characters long, with a capital letter, a number, and a special character";
    }

    if (password !== confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await registerUser(formData);
        console.log(response);
        setIsOtpSent(true);
        setShowModal(true);
        // startResendCooldown();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const serverErrors = error.response.data;
          if (serverErrors.username) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              username: "Username is already taken",
            }));
          }
          if (serverErrors.email) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Email is already taken",
            }));
          }
        } else {
          console.error("Registration error: ", error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFeedbackMessage("");
    try {
      await verifyOtp({ email: formData.email, otp: otp });
      setFeedbackMessage("OTP verified successfully!");
      setTimeout(() => {
        navigate("/attendee/login");
      }, 1000);
    } catch (error) {
      console.error("OTP verification error: ", error);
      setFeedbackMessage("Invalid OTP, please try again.");
    }
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/user/google-auth/",
        {
          token: credential,
          user_type: "attendee",
        }
      );
      const data = res.data;
      if (data.access) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        dispatch(
          loginSuccess({
            user: {
              email: data.email,
              username: data.username,
              user_type: "attendee",
            },
            accessToken: data.access,
            refreshToken: data.refresh,
          })
        );

        navigate("/attendee/profile");
      } else {
        console.error("Google authentication failed.");
      }
    } catch (error) {
      console.error("An error occurred during Google authentication:", error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed", error);
  };

  return (
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-blue-900 text-center hidden md:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
            }}
          ></div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className=" flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                Sign up for Attending Events
              </h1>
              <p className="text-[12px] text-gray-500 pb-4 pt-1">
                Hey enter your details to create your account
              </p>
            </div>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
            <p className="pt-4">or</p>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  name="username"
                  onChange={handleChange}
                  placeholder="Enter your Username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}

                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}

                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}

                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  name="confirm_password"
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirm_password}
                  </p>
                )}

                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  disabled={loading}
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">
                    {loading ? "Registering..." : "Register"}
                  </span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Already have an account? {/* <a href=""> */}
                  <span
                    className="text-blue-900 font-semibold cursor-pointer"
                    onClick={() => navigate("/attendee/login")}
                  >
                    Sign in
                  </span>
                  {/* </a> */}
                </p>
              </div>
            </div>
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                  <h3 className="text-xl font-semibold mb-4">Enter OTP</h3>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    placeholder="OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    required
                  />
                  <button
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
                    type="submit"
                    onClick={handleVerifyOtp}
                  >
                    Verify
                  </button>
                  <button
                    className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {feedbackMessage && (
                    <p
                      className={`mt-3 text-sm ${
                        feedbackMessage.includes("successfully")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {feedbackMessage}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendeeRegister;
