import React, { useState } from "react";
import {
  FaBars,
  FaUserCircle,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AttendeeSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-4 text-gray-600 focus:outline-none"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="h-6 w-6" />
      </button>

      {/* Sidebar */}
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
                to="/attendee/profile"
                className="text-black hover:underline ml-2 truncate"
              >
                Profile
              </Link>
            </li>
            <li className="flex items-center">
              <FaCalendarAlt className="h-5 w-5 mr-2 text-gray-600" />
              <Link
                to="/attendee/registered_events"
                className="text-black hover:underline whitespace-nowrap ml-2 truncate"
              >
                Registered Events
              </Link>
            </li>
            <li className="flex items-center">
              <FaChartLine className="h-5 w-5 mr-2 text-gray-600" />
              <Link
                to="/attended/events"
                className="text-black hover:underline whitespace-nowrap ml-2 truncate"
              >
                Attended Events
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

export default AttendeeSidebar;
