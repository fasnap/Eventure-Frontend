import React, { useEffect, useState } from "react";
import Layout from "../shared/admin/Layout";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboardData } from "../../api/admin";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);
  console.log("dashboard data is", data);
  const [chartData, setChartData] = useState(null);
  const [eventChartData, setEventChartData] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminDashboardData());
  }, [dispatch]);
  useEffect(() => {
    if (data?.monthly_data) {
      const labels = data.monthly_data.map((item) =>
        new Date(item.month).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
      );
      const registeredCounts = data.monthly_data.map(
        (item) => item.registered_count
      );
      const completedCounts = data.monthly_data.map(
        (item) => item.completed_count
      );
      const approvedCounts = data.monthly_data.map(
        (item) => item.approved_count
      );
      const rejectedCounts = data.monthly_data.map(
        (item) => item.rejected_count
      );

      setChartData({
        labels,
        datasets: [
          {
            label: "Registered Events",
            data: registeredCounts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
          {
            label: "Completed Events",
            data: completedCounts,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
          },
          {
            label: "Approved Events",
            data: approvedCounts,
            backgroundColor: "rgba(150, 202, 230, 0.6)",
          },
          {
            label: "Rejected Events",
            data: rejectedCounts,
            backgroundColor: "rgba(93, 144, 355, 0.6)",
          },
        ],
      });
    }
    if (data?.event_data) {
      const eventLabels = data.event_data.map((item) => item.category);
      const eventCounts = data.event_data.map((item) => item.count);
      setEventChartData({
        labels: eventLabels,
        datasets: [
          {
            label: "Event Count",
            data: eventCounts,
            backgroundColor: "rgba(255, 159, 64, 0.6)",
          },
        ],
      });
    }
  }, [data]);

  return (
    <Layout>
      <div className="flex-grow bg-gray-100 p-4">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">
              Total Approved Creators
            </h2>
            <p className="text-2xl font-semibold">
              {data?.total_approved_creators}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">
              Total Attendees
            </h2>
            <p className="text-2xl font-semibold">{data?.total_attendees}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">Total Events</h2>
            <p className="text-2xl font-semibold">{data?.total_events}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">
              Rejected Events
            </h2>
            <p className="text-2xl font-semibold">{data?.rejected_events}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">
              Completed Events
            </h2>
            <p className="text-2xl font-semibold">{data?.completed_events}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-sm font-medium text-gray-500">
              Upcoming Events
            </h2>
            <p className="text-2xl font-semibold">{data?.upcoming_events}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              Monthly Events Overview
            </h2>
            {/* Placeholder for a chart */}
            <div className="h-80 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              {chartData ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                  height={400}
                />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              Category Wise Event Overview
            </h2>
            {/* Placeholder for a chart */}
            <div className="h-80 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              {eventChartData ? (
                <Bar
                  data={eventChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                  height={400}
                />
              ) : (
                <p>Loading....</p>
              )}
            </div>
          </div>
        </div>

        {/* Links to Other Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-md font-semibold mb-2">Manage Users</h3>
            <p className="text-gray-600">View and manage user accounts</p>
            <button className="mt-2 text-blue-500">
              <Link to="/admin/users">Go to Users</Link>
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-md font-semibold mb-2">Creators</h3>
            <p className="text-gray-600">Track and manage creators</p>
            <button className="mt-2 text-blue-500">
              {" "}
              <Link to="/admin/creators"> Go to Creators</Link>
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-md font-semibold mb-2">Events</h3>
            <p className="text-gray-600">Manage events approval requests</p>
            <button className="mt-2 text-blue-500">
              <Link to="/admin/events">Go to Events</Link>
            </button>
          </div>
        </div>

        {/* Top 10 Events Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-8">
          <h2 className="text-lg font-semibold mb-4">Top 10 Events</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Event Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {data?.events_rating_data?.map((event, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{event.creator_username}</td>
                  <td className="border px-4 py-2">{event.title}</td>
                  <td className="border px-4 py-2">{event.average_rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
