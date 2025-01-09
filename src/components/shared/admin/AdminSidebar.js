// src/components/shared/AdminSidebar.js

import React from "react";
import { Link, NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-56 bg-gray-700 h-full p-4 text-white">
      <nav>
        <ul>
          <li className="mb-4">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-bold"
                  : "text-white hover:text-yellow-400"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-bold"
                  : "text-white hover:text-yellow-400"
              }
            >
              All Users
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin/creators"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-bold"
                  : "text-white hover:text-yellow-400"
              }
            >
              Creators Request
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin/approved-creators"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-bold"
                  : "text-white hover:text-yellow-400"
              }
            >
              Approved Creators
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin/events"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-bold"
                  : "text-white hover:text-yellow-400"
              }
            >
              Events
            </NavLink>
          </li>
          {/* Add more admin links as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
