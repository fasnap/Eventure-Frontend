import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin, loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../features/authSlice";

function UserLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      const userType = localStorage.getItem("userType");
      console.log("User type: " + userType);
      if (userType === "attendee") {
        navigate("/attendee/profile");
      } else if (userType === "creator") {
        navigate("/creator/profile");
      }
    }
  }, [isAuthenticated, navigate]);
  const reachGoogle = () => {
    const clientID =
      "197116610660-ips5i8al3h07kitmdmmn1i4vdvv9at9b.apps.googleusercontent.com";
    const callBackURI = "http://localhost:3000/";
    window.location.replace(
      `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${callBackURI}&prompt=consent&response_type=code&client_id=${clientID}&scope=openid%20email%20profile&access_type=offline`
    );
  };
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
        console.log(error); 
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
  const handleGoogleLogin = async (code) => {
    try {
      const googleUser = await dispatch(googleLogin(code));
      if (googleUser) {
        if (googleUser.user_type === "attendee") {
          navigate("/attendee/profile");
        } else if (googleUser.user_type === "creator") {
          navigate("/creator/profile");
        }
      }
    } catch (error) {
      setBackendError("Google login failed. Please try again.");
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
              <button
                onClick={reachGoogle}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg mt-4"
              >
                Sign in with Google
              </button>
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