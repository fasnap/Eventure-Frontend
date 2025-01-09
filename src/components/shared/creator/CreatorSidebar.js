// Sidebar.js
import React from "react";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaChartLine,
  FaFileAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const CreatorSidebar = () => {
  return (
    <aside className="w-1/6 bg-white p-6 hidden md:block mt-2">
      <nav>
        <ul className="space-y-8">
          <li className="flex items-center">
            <FaUserCircle className="h-5 w-5 mr-2 text-gray-600" />

            <Link
              to="/creator/profile"
              className="text-black hover:underline ml-4"
            >
              Account Details
            </Link>
          </li>
          <li className="flex items-center">
            <FaCalendarAlt className="h-5 w-5 mr-2 text-gray-600" />
            <Link
              to="/creator/events"
              className="text-black hover:underline ml-4"
            >
              Events
            </Link>
          </li>
          <li className="flex items-center ">
            <FaChartLine className="h-5 w-5 mr-2 text-gray-600" />
            <Link
              to="/creator/dashboard"
              className="text-black hover:underline ml-4"
            >
              Statistics
            </Link>
          </li>
          <li className="flex items-center">
            <FaFileAlt className="h-5 w-5 mr-2 text-gray-600" />

            <Link
              href="#account-status"
              className="text-black hover:underline ml-4"
            >
              Report
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default CreatorSidebar;
