// Sidebar.js
import React, { useState } from "react";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaChartLine,
  FaFileAlt,
  FaBars,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const CreatorSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="relative flex mt-1">
      <button
        className="md:hidden p-4 text-gray-600 focus:outline-none"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="h-6 w-6" />
      </button>
      <aside
        className={`fixed top-0 left-0 h-full min-h-screen bg-white p-6 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64 z-20 md:static md:translate-x-0`}
      >
        <nav>
          <ul className="space-y-8">
            <li className="flex items-center">
              <FaUserCircle className="h-5 w-5 mr-2 text-gray-600" />

              <Link
                to="/creator/profile"
                className="text-black hover:underline ml-2 truncate"
              >
                Account Details
              </Link>
            </li>
            <li className="flex items-center">
              <FaCalendarAlt className="h-5 w-5 mr-2 text-gray-600" />
              <Link
                to="/creator/events"
                className="text-black hover:underline whitespace-nowrap ml-2 truncate"
              >
                Events
              </Link>
            </li>
            <li className="flex items-center ">
              <FaChartLine className="h-5 w-5 mr-2 text-gray-600" />
              <Link
                to="/creator/dashboard"
                className="text-black hover:underline whitespace-nowrap ml-2 truncate"
              >
                Statistics
              </Link>
            </li>
            <li className="flex items-center">
              <FaFileAlt className="h-5 w-5 mr-2 text-gray-600" />

              <Link
                to="/event/report"
                className="text-black hover:underline whitespace-nowrap ml-2 truncate"
              >
                Report
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Overlay for Mobile View */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default CreatorSidebar;
