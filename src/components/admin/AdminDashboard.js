import React from "react";
import Layout from "../shared/admin/Layout";

function AdminDashboard() {
  return (
    <Layout>
      <div className="flex-grow bg-gray-100 p-4">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
            <p className="text-2xl font-semibold">1,234</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
            <p className="text-2xl font-semibold">567</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">Revenue</h2>
            <p className="text-2xl font-semibold">$12,345</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">
              Pending Support Tickets
            </h2>
            <p className="text-2xl font-semibold">12</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
            {/* Placeholder for a chart */}
            <div className="h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              Chart Placeholder
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">User Growth</h2>
            {/* Placeholder for a chart */}
            <div className="h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              Chart Placeholder
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <div className="bg-blue-500 h-2 w-2 rounded-full mr-3"></div>
              <p>
                User <strong>John Doe</strong> placed an order #1234
              </p>
              <span className="text-gray-500 ml-auto">5 mins ago</span>
            </li>
            <li className="flex items-center">
              <div className="bg-green-500 h-2 w-2 rounded-full mr-3"></div>
              <p>Order #1233 was marked as shipped</p>
              <span className="text-gray-500 ml-auto">15 mins ago</span>
            </li>
            <li className="flex items-center">
              <div className="bg-yellow-500 h-2 w-2 rounded-full mr-3"></div>
              <p>
                New support ticket opened by <strong>Jane Smith</strong>
              </p>
              <span className="text-gray-500 ml-auto">30 mins ago</span>
            </li>
          </ul>
        </div>

        {/* Links to Other Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-md font-semibold mb-2">Manage Users</h3>
            <p className="text-gray-600">View and manage user accounts</p>
            <button className="mt-2 text-blue-500">Go to Users</button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-md font-semibold mb-2">Orders</h3>
            <p className="text-gray-600">Track and manage orders</p>
            <button className="mt-2 text-blue-500">Go to Orders</button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-md font-semibold mb-2">Support</h3>
            <p className="text-gray-600">Manage customer support tickets</p>
            <button className="mt-2 text-blue-500">Go to Support</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
