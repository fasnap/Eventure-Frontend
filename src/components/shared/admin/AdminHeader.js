// src/components/shared/AdminHeader.js

import React, { useEffect, useState } from "react";
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

const AdminHeader = () => {
  const user = useSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  useEffect(()=>{
    if(!isAuthenticated || !user || user.user_type !== 'admin'){
      navigate("/admin/login");
    }
  },[isAuthenticated, user, navigate, dispatch])

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/admin/login");
  };
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
            <FaBell className="text-white-600 hover:text-blue-600 cursor-pointer text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>

          {/* User Profile Section */}

          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-white-400 text-xl" />
            <span className="text-white-400 font-small hidden md:block">
              Hi, {user? user.username :""}
            </span>
            <span
              // onClick={handleLogout}
              className="text-white-700 font-medium cursor-pointer hidden md:block"
            >
              <FaSignOutAlt
                onClick={handleLogout}
                className="h-6 w-5 text-white"
              />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
