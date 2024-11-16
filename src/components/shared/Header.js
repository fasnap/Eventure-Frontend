import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaBell, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { logoutUser } from "../../api/auth";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/user/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/user/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-white shadow-md p-4 flex flex-col md:flex-row items-center justify-between">
      {/* Logo and Title */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center space-x-3">
          <img
            src="https://via.placeholder.com/40"
            alt="Eventure Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
          />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
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
              <FaUserCircle className="text-gray-600 text-2xl" />
              <span className="text-gray-700 font-medium hidden md:block">
                Hi, {user.username}
              </span>
              <span
                onClick={handleLogout}
                className="text-gray-700 font-medium cursor-pointer hidden md:block"
              >
                Logout
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
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Create Event
              </Link>
            </>
          )}

          {isAuthenticated &&
            (user?.user_type === "creator" ? (
              <Link
                to="/creator/register"
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Create Event
              </Link>
            ) : user?.user_type === "attendee" ? (
              <Link
                to="/events"
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