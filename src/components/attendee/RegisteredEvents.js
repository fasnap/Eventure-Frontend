import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendeeRegisteredEvents } from "../../api/event";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Header from "../shared/Header";
import AttendeeSidebar from "../shared/attendee/AttendeeSidebar";
import { FaTicketAlt } from "react-icons/fa";
import NoDataFound from "../shared/NoDataFound";
import axios from "axios";
import { EVENT_BASE_URL } from "../../api/base";
import { toast } from "react-toastify";

function RegisteredEvents() {
  const accessToken = localStorage.getItem("accessToken");
  const registeredEvents = useSelector(
    (state) => state.events.registeredEvents
  );
  const eventsLoading = useSelector((state) => state.events.loading);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchAttendeeRegisteredEvents(accessToken));
      console.log("Registered events", registeredEvents);
    }
  }, [dispatch, accessToken]);

  return (
    <div className="bg-violet-50 min-h-screen">
      <Header />
      <div className="flex">
        <AttendeeSidebar />

        <div className="flex-1 pt-4 pb-4 pl-8">
          {registeredEvents?.length > 0 ? (
            <div>
              <h1 className="ml-8 mb-8 text-3xl font-bold text-gray-600">
                Registered Events
              </h1>
              {registeredEvents.map((event) => (
                <EventCard key={event.event.id} event={event} />
              ))}
            </div>
          ) : (
            <NoDataFound
              message="No Registered Events Found"
              subMessage="We couldn't find any registered events."
            />
          )}
        </div>
      </div>
    </div>
  );
}
function EventCard({ event }) {
  const registeredEvents = useSelector(
    (state) => state.events.registeredEvents
  );
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);

  const navigate = useNavigate();
  console.log("regi events", registeredEvents);
  const handleTicketView = (eventId, ticketId) => {
    // Null check for registeredEvents and eventId
    if (registeredEvents && eventId) {
      const event = registeredEvents.find(
        (event) => event.event.id === eventId && event.ticket === ticketId
      );

      if (event) {
        setTicketDetails(event); // Set the ticket details, not the entire event list
        setShowTicketModal(true);
      }
    }
  };
  const handleJoinStream = async (eventId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${EVENT_BASE_URL}mark-stream-attendance/`,
        { eventId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.already_present) {
        navigate(`/event/stream/${eventId}`);
      } else {
        toast.success("Attendance marked successfully");
        navigate(`/event/stream/${eventId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to mark attendance");
    }
  };

  return (
    <div className="ml-8 mr-4 mb-8 rounded-lg p-6 bg-white shadow-md">
      <div className="flex">
        <img
          className="h-20 w-40 object-cover"
          src={event.event.image}
          alt={event.event.title}
        />
        <h2 className="text-xl font-semibold mb-4 ml-8">{event.event.title}</h2>
      </div>
      <div className="mt-4">
        <button
          key={event.ticket}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => handleTicketView(event.event.id, event.ticket)}
        >
          <FaTicketAlt /> View Ticket
        </button>
        {/* Show Join Stream button only for online events that are ongoing and streaming */}
        {event.event.event_type === "online" &&
          event.event.creator_status === "ongoing" &&
          event.event.is_streaming && (
            <button
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
              onClick={() => handleJoinStream(event.event.id)}
            >
              Join Stream
            </button>
          )}
      </div>
      <p className="mb-4 mt-8">{event.event.description}</p>
      <hr />
      <div className="flex">
        <p className="text-sm text-gray-600 mt-8">
          <span className="font-bold mb-4">Type: </span>{" "}
          {event.event.event_type}
        </p>
        <p className="text-sm ml-20 text-gray-600 mt-8">
          <span className="font-bold mb-4">Starts on: </span>
          {event.event.date} {event.event.start_time}
        </p>
        <p className="text-sm ml-20 text-gray-600 mt-8">
          <span className="font-bold mb-4">Category: </span>
          {event.event.category}
        </p>
      </div>
      {/* Modal to show ticket details */}
      {ticketDetails && showTicketModal && (
        <Modal
          isOpen={showTicketModal}
          onRequestClose={() => setShowTicketModal(false)}
          contentLabel="Event Ticket"
          ariaHideApp={false}
          className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 mx-auto mt-6"
        >
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              {ticketDetails.event.title}
            </h3>

            <div className="ticket-details w-full bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
              <div className="flex flex-col items-center">
                <img
                  src={ticketDetails.event.image}
                  alt={ticketDetails.event.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-4 text-center text-gray-600">
                  <p>Date: {ticketDetails.event.date}</p>
                  <p>
                    Time: {ticketDetails.event.start_time} -{" "}
                    {ticketDetails.event.end_time}
                  </p>
                  <p>Location: {ticketDetails.event.location}</p>
                </div>
              </div>
              <div className="qr-code mt-6 flex justify-center">
                <img
                  src={ticketDetails.qr_code_url}
                  alt="QR Code"
                  className="w-32 h-32 border-2 border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-between w-full mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                onClick={() => setShowTicketModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default RegisteredEvents;
