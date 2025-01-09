// Sidebar.js
import React from "react";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AttendeeSidebar = () => {
  return (
    <aside className="w-1/6 bg-white p-6 hidden md:block mt-2">
      <nav>
        <ul className="space-y-8">
          <li className="flex items-center">
            <FaUserCircle className="h-5 w-5 mr-2 text-gray-600" />

            <Link
              to="/attendee/profile"
              className="text-black hover:underline ml-2"
            >
              Profile
            </Link>
          </li>
          <li className="flex items-center">
            <FaCalendarAlt className="h-5 w-5 mr-2 text-gray-600" />
            <Link
              to="/attendee/registered_events"
              className="text-black hover:underline whitespace-nowrap ml-2"
            >
              Registered Events
            </Link>
          </li>
          <li className="flex items-center ">
            <FaChartLine className="h-5 w-5 mr-2 text-gray-600" />
            <Link
              to="/attended/events"
              className="text-black hover:underline whitespace-nowrap ml-2"
            >
              Attended Events
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AttendeeSidebar;
