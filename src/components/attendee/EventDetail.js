import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAttendeeRegisteredEvents, fetchSingleEvent, registerForEvent } from "../../api/event";
import { useDispatch, useSelector } from "react-redux";
import { MAP_BASE_URL } from "../../api/base";
import { FaUserCircle, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { clearSelectedEvent } from "../../features/eventsSlice";
import toast from "react-hot-toast";
import Header from "../shared/Header";

function EventDetail() {
  const accessToken = localStorage.getItem("accessToken");
  const user = useSelector((state) => state.auth.user);
  const { selectedEvent, loading, error } = useSelector(
    (state) => state.events
  );

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [eventStartDate, setEventStartDate] = useState(null);
  const [eventEndDate, setEventEndDate] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); // Track registration state

  useEffect(() => {
    dispatch(clearSelectedEvent());
    dispatch(fetchSingleEvent({ accessToken, eventId: id }));
  }, [dispatch, id, accessToken]);

  useEffect(() => {
    if (selectedEvent) {
      if (selectedEvent.start_time && selectedEvent.end_time) {
        const startDate = new Date(
          `${selectedEvent.date}T${selectedEvent.start_time}`
        );
        const endDate = new Date(
          `${selectedEvent.date}T${selectedEvent.end_time}`
        );

        setEventStartDate(startDate);
        setEventEndDate(endDate);
      }
    }
  }, [selectedEvent]);

  const handleAddToCalendar = () => {
    if (eventStartDate && eventEndDate) {
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

  const handleRegister = async () => {
    if (!selectedEvent) {
      toast.error("Event details not available.");
      return;
    }
    if (selectedEvent.available_ticket === 0) {
      toast.error("Tickets are not available for this event.");
      return;
    }
    setIsRegistering(true);
    try {
      if (selectedEvent.ticket_type === "paid") {
        sessionStorage.setItem("canAccessPaymentPage", "true");
        navigate(`/payment/${id}`);
      } else {
        const loadingToast = toast.loading("Registering for event...");

        const response = await dispatch(
          registerForEvent({ accessToken, eventId: id, user: user })
        ).unwrap();
        toast.dismiss(loadingToast);
        toast.success("Successfully registered for the event!", {
          duration: 3000,
          icon: "🎉",
        });
        await dispatch(fetchAttendeeRegisteredEvents(accessToken));

        setTimeout(() => {
          navigate("/attendee/registered_events");
        }, 1500);
      }
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again", {
        duration: 4000,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // Get registration button styles and text based on state
  const getRegistrationButton = () => {
    if (selectedEvent.is_registered) {
      return (
        <button
          disabled
          className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow cursor-not-allowed transition-colors duration-200"
        >
          Already Registered
        </button>
      );
    }

    if (isRegistering) {
      return (
        <button
          disabled
          className="px-6 py-2 bg-blue-300 text-white rounded-lg shadow cursor-wait transition-colors duration-200"
        >
          {selectedEvent.ticket_type === "paid"
            ? "Processing..."
            : "Registering..."}
        </button>
      );
    }

    return (
      <button
        onClick={handleRegister}
        disabled={loading || selectedEvent.available_ticket === 0}
        className={`px-6 py-2 rounded-lg shadow transition-colors duration-200 ${
          selectedEvent.available_ticket === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {selectedEvent.ticket_type === "paid"
          ? "Proceed to payment"
          : "Register for free"}
      </button>
    );
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-9 text-center text-red-600">
        <p>Failed to load event details. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {selectedEvent ? (
        <div className="container mx-auto px-4 py-9 space-y-8">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-800">
              {selectedEvent.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-gray-600">
              <a
                href={`${MAP_BASE_URL}${selectedEvent.latitude},${selectedEvent.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View on Map
              </a>
              <span className="hidden md:block">|</span>
              <span>
                {new Date(selectedEvent.date).toLocaleDateString()} at{" "}
                {selectedEvent.start_time}
              </span>
            </div>
            <p className="text-gray-500">
              {selectedEvent.country}, {selectedEvent.district},
              {selectedEvent.state}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Event Image */}
            <div className="lg:w-2/3">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>

            {/* Event Details */}
            <div className="lg:w-1/3 bg-white p-6 border border-gray-200 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Event Details
              </h2>

              <div className="space-y-6 text-gray-600">
                <div className="flex items-start space-x-4">
                  <FaUserCircle className="text-blue-500 text-xl mt-1" />
                  <div>
                    <h3 className="text-gray-500">Organized by</h3>
                    <p className="font-semibold">{selectedEvent.creator}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FaCalendarAlt className="text-blue-500 text-xl mt-1" />
                  <div>
                    <h3 className="text-gray-500">Date and Time</h3>
                    <p className="font-semibold">
                      {new Date(selectedEvent.date).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}{" "}
                      <br /> at{" "}
                      {new Date(
                        `${selectedEvent.date}T${selectedEvent.start_time}`
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <button
                      onClick={handleAddToCalendar}
                      className="text-green-500 hover:underline"
                    >
                      Add to Calendar
                    </button>
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <FaMapMarkerAlt className="text-blue-500 text-2xl mt-1" />
                  <div>
                    <h3 className="text-gray-500">Location</h3>
                    <p className="font-semibold">{selectedEvent.location}</p>
                    <a
                      href={`${MAP_BASE_URL}${selectedEvent.latitude},${selectedEvent.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
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
            <p className="text-gray-600 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>
          {/* Register Button */}
          <div className="text-center mt-6">{getRegistrationButton()}</div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-9 text-center">
          <p>Loading event details...</p>
        </div>
      )}
    </div>
  );
}

export default EventDetail;
