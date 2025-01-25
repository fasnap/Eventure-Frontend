// src/components/shared/AdminHeader.js

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { logoutUser } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../../../features/notificationsSlice";
import { fetchNotifications, markAsViewed } from "../../../api/notification";
import toast from "react-hot-toast";

const AdminHeader = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const notifications = useSelector(
    (state) => state.notifications.notifications
  ); // Add this line
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false); // State to track notification dropdown visibility
  const notificationRef = useRef(null);
  const [logoutClicked, setLogoutClicked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://eventure.fasna.xyz/ws/admin/notifications/?token=${accessToken}`
    );

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(
        addNotification({
          id: data.notification_id,
          message: data.message,
          viewed: false,
        })
      );
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} 
          max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto 
          flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New Notification
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{data.message}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: "top-right",
        }
      );
    };

    return () => {
      socket.close();
    };
  }, [accessToken, dispatch]);

  const handleLogout = async () => {
    setLogoutClicked(true);
    try {
      await dispatch(logoutUser()); // Ensure logout is complete before navigating
      navigate("/admin/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLogoutClicked(false); // Re-enable the logout button
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchNotifications(accessToken));
    }
  }, [accessToken, dispatch]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (notificationId) => {
    dispatch(
      markAsViewed({ notificationId, accessToken }) // Use Redux action to update state
    );
  };
  // Close the notifications dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center space-x-3">
          <img
            src="https://via.placeholder.com/40"
            alt="Eventure Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
          />
          <h1 className="text-xl md:text-2xl font-bold text-white-800">
            Eventure
          </h1>
        </div>
        <button
          className="md:hidden text-white-600 text-2xl"
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
            className="w-full px-4 py-2 border border-white-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Notification and User Section */}
        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
          {/* Notification Icon with Badge */}
          <div className="relative">
            <FaBell
              onClick={toggleNotifications}
              className="text-white-600 hover:text-blue-600 cursor-pointer text-xl"
            />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {notifications.filter((notif) => !notif.viewed).length}
              </span>
            )}
            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                ref={notificationRef}
                className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-60 p-3"
              >
                <div className="font-bold text-sm mb-2">Notifications</div>
                {notifications.length > 0 ? (
                  <ul className="space-y-2">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`text-sm cursor-pointer ${
                          notification.viewed ? "bg-gray-200" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        {notification.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">No new notifications</p>
                )}
              </div>
            )}
          </div>

          {/* User Profile Section */}

          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-white-400 text-xl" />
            <span className="text-white-400 font-small hidden md:block">
              Hi, {user ? user.username : ""}
            </span>
            <span
              // onClick={handleLogout}
              className="text-white-700 font-medium cursor-pointer hidden md:block"
            >
              <FaSignOutAlt
                onClick={handleLogout}
                className={`text-red-700 font-medium cursor-pointer hidden md:block ${
                  logoutClicked ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={logoutClicked}
              />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
