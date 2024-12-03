import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../shared/user/Layout";
import { fetchSingleEvent } from "../../api/event";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../shared/Spinner";
import { MAP_BASE_URL, USER_BASE_URL } from "../../api/base";
import { FaUserCircle, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

function EventDetail() {
  const { id } = useParams();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { selectedEvent, loading, error } = useSelector(
    (state) => state.events
  ); // Get the events list from the Redux store

  const [eventStartDate, setEventStartDate] = useState(null);
  const [eventEndDate, setEventEndDate] = useState(null);

  useEffect(() => {
    console.log("EventDetail", id);
    dispatch(fetchSingleEvent({ accessToken, eventId: id }));
  }, [dispatch, id, accessToken]);

  useEffect(() => {
    if (selectedEvent && selectedEvent.start_time && selectedEvent.end_time) {
      const startDate = new Date(
        `${selectedEvent.date}T${selectedEvent.start_time}`
      );
      const endDate = new Date(
        `${selectedEvent.date}T${selectedEvent.end_time}`
      );

      setEventStartDate(startDate);
      setEventEndDate(endDate);
    }
  }, [selectedEvent]);

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (!selectedEvent) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  const handleAddToCalendar = () => {
    if (setEventStartDate && setEventEndDate) {
      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${
        selectedEvent.title
      }&dates=${eventStartDate
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "")}/${eventEndDate
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "")}&details=${
        selectedEvent.description
      }&location=${selectedEvent.location}&sf=true&output=xml`;
      window.open(calendarUrl, "_blank");
    }
  };
  return (
    <Layout>
      <div className="container mx-auto px-4 py-9 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            {selectedEvent.title}
          </h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <a
              href={`${MAP_BASE_URL}${selectedEvent.latitude},${selectedEvent.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on Map
            </a>
            <span>|</span>
            <span>
              {new Date(selectedEvent.date).toLocaleDateString()} at{" "}
              {selectedEvent.start_time}
            </span>
          </div>
          <p className="text-gray-500">
            {selectedEvent.country}, {selectedEvent.district},{" "}
            {selectedEvent.state}
          </p>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
          {/* Event Image */}
          <div className="md:w-2/3">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-64 object-cover rounded-lg shadow-sm"
            />
          </div>
          {/* Event Details */}
          <div className="md:w-2/5 bg-white p-6 border border-gray-150 rounded-sm space-y-2 ml-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Event Details
            </h2>

            <div className="space-y-4 text-gray-600">
              <div className="flex items-start space-x-4">
                <FaUserCircle className="text-blue-500 text-xl mt-1" />
                <div>
                  <h3 className="text-gray-500">Organized by</h3>
                  <p className="font-semibold pt-2 pb-2">
                    {selectedEvent.creator}
                  </p>
                  {/* <Link
                    to=""
                    onClick={() => fetchCreatorProfile(selectedEvent.creator)}
                    className="font-medium text-green-500 hover:underline"
                  >
                    View Profile
                  </Link> */}
                </div>
              </div>
              <div className="flex items-start space-x-4 pt-4">
                <FaCalendarAlt className="text-blue-500 text-xl mt-1" />
                <div>
                  <h3 className="text-gray-500">Date and Time</h3>
                  <p className="font-semibold pt-2 pb-2">
                    {new Date(selectedEvent.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    <br /> at {selectedEvent.start_time}
                  </p>
                  <button
                    onClick={handleAddToCalendar}
                    className="font-medium text-green-500 hover:underline"
                  >
                    Add to Calendar
                  </button>
                </div>
              </div>
              {/* Location */}
              <div className="flex items-start space-x-4 pt-4">
                <FaMapMarkerAlt className="text-blue-500 text-3xl mt-1" />
                <div>
                  <h3 className="text-gray-500">Location</h3>
                  <p className="font-semibold pt-2 pb-2">
                    {selectedEvent.location}
                  </p>
                  <a
                    href={`${MAP_BASE_URL}${selectedEvent.latitude},${selectedEvent.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-green-500 hover:underline"
                  >
                    View Map
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Event Description Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About the Event
          </h2>
          <p className="text-gray-600">{selectedEvent.description}</p>
        </div>
      </div>
    </Layout>
  );
}

export default EventDetail;
