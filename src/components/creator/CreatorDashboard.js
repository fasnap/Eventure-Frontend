import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventStatistics } from "../../api/event";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "../shared/Header";
import CreatorSidebar from "../shared/creator/CreatorSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
function CreatorDashboard() {
  const dispatch = useDispatch();
  const { statistics, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEventStatistics());
  }, [dispatch]);

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1];
  };
  const monthlyLabels = statistics?.monthly_event_stats?.map(
    (month) => `${getMonthName(month.date__month)} ${month.date__year}`
  );

  const totalEventsPerMonth = statistics?.monthly_event_stats?.map(
    (month) => month.total_events_per_month
  );

  const monthlyEventChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Total Events Created",
        data: totalEventsPerMonth,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };
  if (error) return <div>Error...{error}</div>;
  return (
    <div className="bg-violet-50 min-h-screen">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Event Dashboard
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* Section 1 */}
            <div className="bg-blue-100 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Events
              </h2>
              <p className="text-xl text-gray-600 mt-4">
                {statistics?.total_events}
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-red-100 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700">
                Events Waiting for admin approval
              </h2>
              <p className="text-xl text-gray-600 mt-4">
                {statistics?.waiting_approval_events}
              </p>
            </div>

            {/* Section 3 */}
            <div className="bg-yellow-100 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700">
                Events Rejected
              </h2>
              <p className="text-xl text-gray-600 mt-4">
                {statistics?.rejected_events}
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-green-100 shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700">
                Attended Events
              </h2>
              <p className="text-xl text-gray-600 mt-4">
                {statistics?.total_attended_events}
              </p>
            </div>
          </div>

          {/* Chart  */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8 mt-8">
            {/* Bar Chart for Event Statistics */}
            <div className="mb-8">
              <Bar
                data={monthlyEventChartData}
                options={{ responsive: true }}
              />
            </div>
          </div>
          {/* Event Statistics Section as Table */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Event Statistics
            </h3>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Event Title
                  </th>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Registered Attendees
                  </th>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Attended
                  </th>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Admin Approval Status
                  </th>
                  <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">
                    Event Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {statistics?.event_stats?.map((event) => (
                  <tr key={event.title} className="border-b">
                    <td className="px-4 py-2 text-gray-600">{event.title}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {event.total_registered}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {event.total_attended}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {event.admin_status}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {event.creator_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorDashboard;
