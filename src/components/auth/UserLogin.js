import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../features/authSlice";

function UserLogin() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const userType = localStorage.getItem("userType");
      if (userType === "attendee") {
        navigate("/attendee/profile");
      } else if (userType === "creator") {
        navigate("/creator/profile");
      }
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { email, password } = formData;
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const result = await loginUser(formData);
        if (result.user_type) {
          localStorage.setItem("userType", result.user_type);
          dispatch(
            loginSuccess({
              user: {
                email: result.email,
                username: result.username,
                user_type: result.user_type,
              },
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            })
          );
          if (result.user_type === "attendee") {
            navigate("/attendee/profile");
          } else if (result.user_type === "creator") {
            navigate("/creator/profile");
          }
        } else {
          // If user_type is not present in the response show an error
          setBackendError("An error occurred. Please try again.");
        }
      } catch (error) {
        if (error.response && error.response.data) {
          // Check if the backend is returning a specific error message
          setBackendError(
            error.response.data.message ||
              error.response.data.error ||
              "An error occurred. Please try again."
          );
        } else {
          setBackendError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
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
                Login Page
              </h1>
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  name="email"
                  value={formData.email}
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                {backendError && (
                  <p className="text-red-500 text-xs mt-1">{backendError}</p>
                )}
                <div className="text-right">
                  <span
                    onClick={() => navigate("/user/forgot-password")}
                    className="text-blue-900 text-sm font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </span>
                </div>
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
                    {loading ? "Logging in..." : "Login"}
                  </span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  No account? {/* <a href=""> */}
                  <span className="text-blue-900 font-semibold">Sign Up</span>
                  {/* </a> */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
