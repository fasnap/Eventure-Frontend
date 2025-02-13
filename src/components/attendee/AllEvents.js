import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../api/event";
import Layout from "../shared/user/Layout";
import { MAP_BASE_URL } from "../../api/base";
import { fetchCreators } from "../../api/creator";
import CreatorListModal from "../creator/CreatorListModal";
import NoDataFound from "../shared/NoDataFound";

function AllEvents() {
  const user = useSelector((state) => state.auth.user);
  const { events, loading, error } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { creators } = useSelector((state) => state.creator);

  useEffect(() => {
    dispatch(fetchCreators());
  }, [dispatch]);
  console.log("creators are ", creators);
  useEffect(() => {
    if (!user || user.user_type !== "attendee") {
      navigate("/attendee/login");
      return;
    }
    dispatch(
      fetchEvents({
        minPrice,
        maxPrice,
        startDate,
        endDate,
        sortBy,
        currentPage,
        pageSize,
      })
    );
  }, [
    dispatch,
    navigate,
    user,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    sortBy,
    currentPage,
    pageSize,
  ]);

  const handleEventClick = (eventId) => {
    navigate(`/attendee/events/${eventId}`);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(events.count / pageSize)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];
  const handleViewAllCreatorsClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="py-16 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-4"
            onClick={handleViewAllCreatorsClick}
          >
            View All Creators
          </button>
          <div className="">
            {events?.results?.length > 0 ? (
              <>
                <h2 className="font-manrope font-bold text-3xl text-gray-900 mb-8 text-center">
                  Available Events
                </h2>
                {/* Sorting and Filter Section */}
                <div className="bg-white shadow-sm mb-8 py-4 px-4 sm:px-8 rounded-lg">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Sort By
                      </h3>
                      <div className="flex gap-16 ">
                        {[
                          "newest",
                          "a-z",
                          "z-a",
                          "price_high-to-low",
                          "price_low_to_high",
                        ].map((option) => (
                          <div
                            key={option}
                            className={`cursor-pointer text-sm text-gray-500 hover:text-indigo-600 ${
                              sortBy === option ? "text-indigo-600" : ""
                            }`}
                            onClick={() => setSortBy(option)}
                          >
                            {option === "newest" && "Newest"}
                            {option === "a-z" && "A-Z"}
                            {option === "z-a" && "Z-A"}
                            {option === "price_high-to-low" &&
                              "Price: High to Low"}
                            {option === "price_low_to_high" &&
                              "Price: Low to High"}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Filter Section */}
                    <div className="space-y-6">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Filter
                      </h3>

                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Range
                        </label>
                        <div className="flex gap-4">
                          <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="sm:w-1/2 p-3 border border-gray-300 rounded-lg text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="sm:w-1/2 p-3 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      {/* Date Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Range
                        </label>
                        <div className="flex gap-4">
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="sm:w-1/2 p-3 border border-gray-300 rounded-lg text-sm"
                            min={todayDate}
                          />
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="sm:w-1/2 p-3 border border-gray-300 rounded-lg text-sm"
                            min={startDate || todayDate}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Listing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.results.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="w-full h-48">
                        <img
                          src={`${event.image}`}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3
                            className="font-semibold text-lg text-gray-800 cursor-pointer hover:text-indigo-600 truncate max-w-[70%]"
                            onClick={() => handleEventClick(event.id)}
                          >
                            {event.title}
                          </h3>
                          <span
                            className={`${
                              event.type === "online"
                                ? "text-green-500"
                                : "text-red-500"
                            } font-semibold text-sm`}
                          >
                            {event.type}
                            {event.type === "online" ? "Online" : "Offline"}
                          </span>
                        </div>

                        <div className="text-gray-600 text-sm mb-4">
                          <p>
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            <br />
                            {new Date(
                              `${event.date}T${event.start_time}`
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                          {event.latitude && event.longitude && (
                            <a
                              href={`${MAP_BASE_URL}${event.latitude},${event.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
                            >
                              Location
                            </a>
                          )}
                        </div>
                        <p className="font-medium text-green-600 text-md mt-2">
                          ₹ {event.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center w-full">
                No Events Found
              </div>
            )}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            {loading ? (
              <div className="text-indigo-500 font-semibold">Loading...</div>
            ) : (
              events &&
              events.count > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: Math.ceil(events.count / pageSize) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 ${
                        currentPage === page ? "bg-indigo-700" : "bg-indigo-500"
                      } text-white rounded-lg`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage === Math.ceil(events.count / pageSize) ||
                      loading
                    }
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300"
                  >
                    Next
                  </button>
                </div>
              )
            )}
          </div>
        </div>
        <CreatorListModal
          creators={creators}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          currentUser={user}
        />
      </div>
    </Layout>
  );
}

export default AllEvents;
