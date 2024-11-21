// src/components/shared/AdminSidebar.js

import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-56 bg-gray-700 h-full p-4 text-white">
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/users">All Users</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/creators">Creators Request</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/approved-creators">Approved Creators</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/events">Events</Link>
          </li>
          {/* Add more admin links as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
