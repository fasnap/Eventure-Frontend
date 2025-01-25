import React, { useEffect, useState } from "react";
import Layout from "../shared/user/Layout";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreatorEvents, updateEventStatus } from "../../api/event";
import dayjs from "dayjs";
import QRCodeScanner from "./QRCodeScanner";
import CreatorSidebar from "../shared/creator/CreatorSidebar";
import Header from "../shared/Header";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CreatorEvents() {
  const { events, loading, error } = useSelector((state) => state.events);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const [selectedEventId, setSelectedEventId] = useState(null); // State to track the selected event for QR code scanning

  console.log("evenfts", events);
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCreatorEvents(accessToken));
    }
  }, [accessToken, dispatch]);

  const handleScanButtonClick = (eventId) => {
    setSelectedEventId(eventId);
  };

  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const ongoingEvents = events?.filter(
    (event) =>
      event.creator_status === "ongoing" && event.admin_status === "approved"
  );
  const waitingForApprovalEvents = events?.filter(
    (event) =>
      event.creator_status === "created" &&
      event.admin_status === "pending" &&
      event.date >= getCurrentDate()
  );

  const completedEvents = events?.filter(
    (event) =>
      event.creator_status === "completed" && event.admin_status === "approved"
  );

  const upcomingEvents = events?.filter(
    (event) =>
      event.creator_status === "upcoming" && event.admin_status === "approved"
  );
  console.log("upcoming events", upcomingEvents);

  const expiredEvents = events?.filter(
    (event) =>
      event.creator_status === "pending" && event.admin_status === "pending"
  );
  const handleScanComplete = () => {
    setSelectedEventId(null);
  };

  return (
    <div className="bg-violet-50 min-h-screen">
      <Header />
      <div className="flex">
        <CreatorSidebar />

        <div className="flex-1 pt-4 pb-4 pl-8">
          <h1 className="ml-8 mb-8 text-3xl font-bold text-gray-600">Events</h1>

          {ongoingEvents?.length > 0 && (
            <div>
              <h2 className="ml-8 mb-6 text-2xl font-bold text-gray-400">
                Ongoing Events
              </h2>

              {ongoingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onScanClick={handleScanButtonClick}
                />
              ))}
            </div>
          )}
          {waitingForApprovalEvents?.length > 0 && (
            <div>
              <h2 className="ml-8 mb-6 text-2xl font-bold text-gray-400">
                Events Waiting for Admin Approval
              </h2>
              {waitingForApprovalEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
          {upcomingEvents?.length > 0 && (
            <div>
              <h2 className="ml-8 mb-6 text-2xl font-bold text-gray-400">
                Upcoming Events
              </h2>
              {upcomingEvents.map((event) => (
                <div>
                  <EventCard key={event.id} event={event} />
                </div>
              ))}
            </div>
          )}
          {completedEvents?.length > 0 && (
            <div>
              <h2 className="ml-8 mb-6 text-2xl font-bold text-gray-400">
                Completed Events
              </h2>
              {completedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {expiredEvents?.length > 0 && (
            <div>
              <h2 className="ml-8 mb-6 text-2xl font-bold text-red-400">
                Expired Events
              </h2>
              {expiredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Render QR Code Scanner if event selected */}
          {selectedEventId && (
            <QRCodeScanner
              key={selectedEventId}
              selectedEventId={selectedEventId}
              eventCreator={{ accessToken }}
              onScanComplete={handleScanComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
function EventCard({ event, onScanClick }) {
  console.log("event in event card", event);
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState("");
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleStatusChange = (status) => {
    setStatusToUpdate(status);
    setShowConfirmation(true);
  };

  const confirmStatusChange = async () => {
    const loadingToastId = toast.loading("Updating event status...");

    try {
      await dispatch(
        updateEventStatus({ eventId: event.id, status: statusToUpdate })
      ).unwrap();
      // Dispatch action to update status
      await dispatch(fetchCreatorEvents(accessToken)).unwrap();
      setShowConfirmation(false);
      toast.dismiss(loadingToastId);
      toast.success(`Event status successfully updated to ${statusToUpdate}`, {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log("Error updating event status", error);
      toast.dismiss(loadingToastId);
      toast.error(`Failed to update event,  ${error.error}`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
      setShowConfirmation(false);
    }
  };

  const today = new Date().toLocaleDateString("en-CA");
  const isEventToday = event.date === today;

  const handleStartStream = (eventId) => {
    navigate(`/event/stream/${eventId}`);
  };

  return (
    <>
      <div className="ml-8 mr-4 mb-8 rounded-lg p-6 bg-white shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              className="h-20 w-40 object-cover"
              src={event.image}
              alt={event.title}
            />
            <h2 className="text-xl font-semibold mb-4 ml-8">{event.title}</h2>
          </div>
        </div>
        <p className="mb-4 mt-8">{event.description}</p>
        <hr />
        <div className="flex flex-wrap justify-start space-x-4 mt-8">
          <p className="text-sm text-gray-600 mt-8">
            <span className="font-bold mb-4">Type: </span> {event.event_type}
          </p>
          <p className="text-sm ml-20 text-gray-600 mt-8">
            <span className="font-bold mb-4">Starts on: </span>
            {event.date} {event.start_time}
          </p>
          <p className="text-sm ml-20 text-gray-600 mt-8">
            <span className="font-bold mb-4">Category: </span>
            {event.category}
          </p>
        </div>

        {onScanClick && (
          <button
            className="mt-10 bg-blue-400 text-white px-4 py-2 rounded"
            onClick={() => onScanClick(event.id)}
          >
            Scan QR
          </button>
        )}
        <div className="flex space-x-4 mt-8">
          {event.creator_status === "upcoming" &&
            event.admin_status === "approved" &&
            isEventToday && (
              <button
                className="inline-block bg-teal-500 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md"
                onClick={() => handleStatusChange("ongoing")}
              >
                Mark as Ongoing
              </button>
            )}
          {event.creator_status === "ongoing" &&
            event.event_type === "online" &&
            event.admin_status === "approved" && (
              <button
                className="inline-block bg-red-500 text-white hover:bg-red-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={() => handleStartStream(event.id)}
              >
                Start Stream
              </button>
            )}

          {event.creator_status === "ongoing" && (
            <button
              className="inline-block bg-yellow-300 text-white hover:bg-green-600 px-6 py-2 rounded-lg shadow-md"
              onClick={() => handleStatusChange("completed")}
            >
              Mark as Completed
            </button>
          )}
          {event.creator_status === "completed" &&
            event.admin_status === "approved" && (
              <>
                <Link
                  to={`/event/attended-users/${event.id}`}
                  className="inline-block bg-green-400 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Attended Users
                </Link>
                <Link
                  to={`/event/registered-users/${event.id}`}
                  className="inline-block bg-blue-400 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Registered Users
                </Link>
              </>
            )}

          {event.creator_status === "upcoming" &&
            event.admin_status === "approved" && (
              <>
                <Link
                  to={`/event/registered-users/${event.id}`}
                  className="inline-block bg-blue-400 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Registered Users
                </Link>
              </>
            )}

          {event.creator_status === "ongoing" &&
            event.admin_status === "approved" && (
              <>
                <Link
                  to={`/event/attended-users/${event.id}`}
                  className="inline-block bg-green-400 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Attended Users
                </Link>
                <Link
                  to={`/event/registered-users/${event.id}`}
                  className="inline-block bg-blue-400 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Registered Users
                </Link>
              </>
            )}
        </div>
        {/* Confirmation modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-full">
              <h3 className="text-lg font-semibold text-center">
                Are you sure you want to update the status?
              </h3>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="bg-red-500 text-white px-6 py-2 rounded-lg w-32"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-6 py-2 rounded-lg w-32"
                  onClick={confirmStatusChange}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CreatorEvents;
