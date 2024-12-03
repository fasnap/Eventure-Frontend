import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEventCategories, fetchEvents } from "../../api/event";
import Layout from "../shared/user/Layout";
import Spinner from "../shared/Spinner";
import { MAP_BASE_URL } from "../../api/base";

function AllEvents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { events, loading, error } = useSelector((state) => state.events);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    if (!user || user.user_type !== "attendee") {
      console.log("Redirecting to attendee login");
      navigate("/attendee/login");

      return;
    }
    dispatch(
      fetchEvents({
        accessToken,
        minPrice,
        maxPrice,
        startDate,
        endDate,
        sortBy,
      })
    );
  }, [
    dispatch,
    navigate,
    user,
    accessToken,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    sortBy,
  ]);

  const handleEventClick = (eventId) => {
    console.log("Event ID:", eventId);
    navigate(`/attendee/events/${eventId}`);
  };

  if (!events) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="py-16 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-manrope font-bold text-2xl sm:text-3xl text-black mb-8 text-center">
            Available Events
          </h2>

          <div className="flex">
            {/* Sidebar for sorting */}
            <div className="w-1/4 pr-4">
              <div className="border-t">
                <div className="font-semibold mt-8 mb-4 uppercase">Sort By</div>
                <div
                  className={`cursor-pointer mb-2 text-sm ${
                    sortBy === "newest" ? "text-indigo-500" : "text-gray-500"
                  } hover:text-indigo-500`}
                  onClick={() => setSortBy("newest")}
                >
                  Newest
                </div>
                <div
                  className={`cursor-pointer mb-2 text-sm ${
                    sortBy === "a-z" ? "text-indigo-500" : "text-gray-500"
                  } hover:text-indigo-500`}
                  onClick={() => setSortBy("a-z")}
                >
                  A-Z
                </div>
                <div
                  className={`cursor-pointer mb-2 text-sm ${
                    sortBy === "z-a" ? "text-indigo-500" : "text-gray-500"
                  } hover:text-indigo-500`}
                  onClick={() => setSortBy("z-a")}
                >
                  Z-A
                </div>
                <div
                  className={`cursor-pointer mb-2 text-sm ${
                    sortBy === "price_high-to-low"
                      ? "text-indigo-500"
                      : "text-gray-500"
                  } hover:text-indigo-500`}
                  onClick={() => setSortBy("price_high-to-low")}
                >
                  Price: High to Low
                </div>
                <div
                  className={`cursor-pointer mb-2 text-sm ${
                    sortBy === "price_low_to_high"
                      ? "text-indigo-500"
                      : "text-gray-500"
                  } hover:text-indigo-500`}
                  onClick={() => setSortBy("price_low_to_high")}
                >
                  Price: Low to High
                </div>
              </div>
              {/* Sidebar for filtering */}
              <div className="border-t">
                <div className="font-semibold mt-8 mb-4 uppercase">Filter </div>
                {/* Price Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Price Range
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="mr-2 w-1/2 p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="ml-2 w-1/2 p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Date Range
                  </label>
                  <div className="flex items-center">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mr-2 w-1/2 p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="ml-2 w-1/2 p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Events grid */}
            <div className="w-3/4 ml-10">
              {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white border border-gray rounded-xl overflow-hidden shadow-sm transform transition-transform hover:scale-105 hover:shadow-sm duration-300"
                    >
                      <div className="w-full aspect-square">
                        <img
                          src={`${event.image}`}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-t-xl"
                        />
                      </div>
                      <div className="p-6 flex flex-col">
                        {/* Title and Online/Offline */}
                        <div className="flex justify-between items-start mb-2">
                          <h3
                            className="font-semibold text-xl text-gray-800"
                            onClick={() => handleEventClick(event.id)}
                          >
                            {event.title}
                          </h3>
                          <span
                            className={`${
                              event.type === "online"
                                ? "text-green-500"
                                : "text-red-500"
                            } font-semibold mt-1`}
                          >
                            {event.type === "online" ? "Online" : "Offline"}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm mb-2">
                          {event.description}
                        </p>

                        {/* Date and Location */}
                        <div className="flex justify-between items-center text-gray-600 text-sm">
                          <p>
                            {event.date} | {event.venue}
                          </p>
                          {/* Google Maps link */}
                          {event.latitude && event.longitude && (
                            <a
                              href={`${MAP_BASE_URL}${event.latitude},${event.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              View on Google Maps
                            </a>
                          )}
                        </div>
                        <p className="font-medium text-green-600 text-md mb-2 mt-3">
                          ₹ {event.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AllEvents;
