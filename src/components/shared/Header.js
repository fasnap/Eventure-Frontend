import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaBell, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { fetchCreatorProfile, logoutUser } from "../../api/auth";

function Header() {
  const { data, status } = useSelector((state) => state.profile);
  const user = useSelector((state) => state.auth.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutInProgress, setLogoutInProgress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/attendee/login");
    } else if (user?.user_type === "creator") {
      dispatch(fetchCreatorProfile());
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogout = async () => {
    setLogoutInProgress(true);
    await dispatch(logoutUser());
    const userType = user.user_type;
    if (userType === "attendee") {
      navigate("/attendee/login");
    } else if (userType === "creator") {
      navigate("/creator/login");
    }
    setLogoutInProgress(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const profileClick = () => {
    const userType = user.user_type;
    if (userType === "attendee") {
      navigate("/attendee/profile");
    } else if (userType === "creator") {
      navigate("/creator/profile");
    }
  };

  return (
    <header className="bg-white shadow-sm p-4 flex flex-col md:flex-row items-center justify-between">
      {/* Logo and Title */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center space-x-3">
          <img
            onClick={() => navigate("/")}
            src="https://via.placeholder.com/40"
            alt="Eventure Logo"
            className="cursor-pointer w-8 h-8 md:w-10 md:h-10 rounded-full"
          />
          <h1
            onClick={() => navigate("/")}
            className="text-xl md:text-2xl font-bold text-gray-800 cursor-pointer"
          >
            Eventure
          </h1>
        </div>
        <button
          className="md:hidden text-gray-600 text-2xl"
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } w-full md:w-auto flex-grow md:flex md:items-center md:justify-end md:space-x-4`}
      >
        <div className="md:flex-grow md:max-w-md mx-4">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Notification and User Section */}
        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
          {/* Notification Icon with Badge */}
          <div className="relative">
            <FaBell className="text-gray-600 hover:text-blue-600 cursor-pointer text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>

          {/* User Profile Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-2">
              <FaUserCircle
                className="text-gray-600 text-2xl cursor-pointer"
                onClick={profileClick}
                title="Go to Profile"
              />
              <span
                onClick={profileClick}
                className="cursor-pointer text-gray-700 font-medium hidden md:block"
              >
                Hi, {user.username}
              </span>
              <span
                onClick={handleLogout}
                className={`text-red-700 font-medium cursor-pointer hidden md:block ${
                  logoutInProgress ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={logoutInProgress}
              >
                {logoutInProgress ? "Logging out..." : "Logout"}
              </span>
            </div>
          ) : (
            <>
              <Link
                to="/attendee/register"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Register for Event
              </Link>
              <Link
                to="/creator/register"
                className="text-white hover:text-blue-700 font-medium bg-green-400 py-2 px-4 rounded"
              >
                Create Event
              </Link>
            </>
          )}

          {isAuthenticated &&
            (user?.user_type === "creator" ? (
              data && data.is_verified ? (
                <Link
                  to="/creator/event/type"
                  className="text-white hover:text-blue-700 font-medium bg-green-400 py-2 px-4 rounded"
                >
                  Create Event
                </Link>
              ) : (
                ""
              )
            ) : user?.user_type === "attendee" ? (
              <Link
                to="/attendee/home/events"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Browse Events
              </Link>
            ) : null)}
        </div>
      </div>
    </header>
  );
}

export default Header;
