import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../features/authSlice";
import { loginAdminUser } from "../../api/admin";

function AdminLogin() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect admin to the admin dashboard
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAdminUser(formData); // Make sure this loginUser function can handle admin login
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
      if (result.user_type !== "admin") {
        setError("You are not authorized to access this page."); // Set error if user is not admin
        return;
      }
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                Admin Login Page
              </h1>
              <p className="text-[12px] text-gray-500">
                Please enter your admin credentials
              </p>
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
                <input
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />

                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center"
                  disabled={loading}
                >
                  <span className="ml-3">
                    {loading ? "Logging in..." : "Login"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
