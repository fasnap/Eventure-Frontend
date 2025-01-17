import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { Loader2 } from "lucide-react";
import { fetchEventReport } from "../../api/eventReport";
import { fetchEventCategories } from "../../api/event";
import axiosInstance from "../../instance/axiosInstance";
import Header from "../shared/Header";
import CreatorSidebar from "../shared/creator/CreatorSidebar";

const EventReport = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    status: "",
    sort_by: "date",
  });

  const { events, status } = useSelector((state) => state.EventReport);
  const { categories } = useSelector((state) => state.eventCategories);

  // Debounced filter updates
  const debouncedFetchEvents = useCallback(
    debounce((filters) => {
      dispatch(fetchEventReport(filters));
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchEventCategories());
  }, [dispatch]);

  useEffect(() => {
    debouncedFetchEvents(filters);
    return () => debouncedFetchEvents.cancel();
  }, [filters, debouncedFetchEvents]);

  const handleExport = async (type) => {
    try {
      const response = await axiosInstance.get(
        `/events/event-export/?export_type=${type}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `event_report.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data", error);
    }
  };

  return (
    <div className="bg-violet-50 min-h-screen">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                Events Report
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Search by title"
                    value={filters.title}
                    onChange={(e) =>
                      setFilters({ ...filters, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="created">Created</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleExport("csv")}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport("xlsx")}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    Export as PDF
                  </button>
                </div>

                <div className="relative overflow-x-auto rounded-lg border">
                  {status === "loading" && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                    </div>
                  )}
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        {[
                          "ID",
                          "Title",
                          "Category",
                          "Date",
                          "Start Time",
                          "End Time",
                          "Status",
                          "Ticket Type",
                          "Price",
                          "Registered",
                          "Attended",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left font-medium"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {events?.map((event, index) => (
                        <tr key={index} className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 font-medium">
                            {event.title}
                          </td>
                          <td className="px-4 py-3">{event.category}</td>
                          <td className="px-4 py-3">{event.date}</td>
                          <td className="px-4 py-3">{event.start_time}</td>
                          <td className="px-4 py-3">{event.end_time}</td>
                          <td className="px-4 py-3">{event.status}</td>
                          <td className="px-4 py-3">{event.ticket_type}</td>
                          <td className="px-4 py-3">{event.price}</td>
                          <td className="px-4 py-3 text-center">
                            {event.registered_attendees}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {event.attended_attendees}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventReport;
