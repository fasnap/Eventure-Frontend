import React, { useEffect, useState } from "react";
import Layout from "../shared/user/Layout";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreatorEvents, updateEventStatus } from "../../api/event";
import dayjs from "dayjs";
import QRCodeScanner from "./QRCodeScanner";
import CreatorSidebar from "../shared/creator/CreatorSidebar";
import Header from "../shared/Header";
import { Link } from "react-router-dom";

// function CreatorEvents() {
//   const { events, loading, error } = useSelector((state) => state.events);
//   const accessToken = useSelector((state) => state.auth.accessToken);
//   const dispatch = useDispatch();
//   const [selectedEventId, setSelectedEventId] = useState(null); // State to track the selected event for QR code scanning

//   useEffect(() => {
//     if (accessToken) {
//       dispatch(fetchCreatorEvents(accessToken));
//     }
//   }, [accessToken, dispatch]);

//   const notApprovedEvents = events?.filter(
//     (event) => !event.is_approved && dayjs(event.date).isAfter(dayjs(), "day")
//   );
//   const upcomingEvents = events?.filter(
//     (event) => event.is_approved && dayjs(event.date).isAfter(dayjs(), "day")
//   );
//   const completedEvents = events?.filter(
//     (event) => event.is_approved && dayjs(event.date).isBefore(dayjs(), "day")
//   );
//   const expiredEvents = events?.filter(
//     (event) => !event.is_approved && dayjs(event.date).isBefore(dayjs(), "day")
//   );

//   // Function to determine the color for event types
//   const getEventTypeColor = (eventType) => {
//     return eventType === "online" ? "text-blue-500" : "text-green-500";
//   };

//   // Function to determine the color for event date (Upcoming / Expired)
//   const getDateColor = (date) => {
//     return dayjs(date).isBefore(dayjs()) ? "text-red-500" : "text-green-500";
//   };

//   const handleScanButtonClick = (eventId) => {
//     setSelectedEventId(eventId);
//   };
//   return (
//     <Layout>
//       <div className="container mx-auto p-6 flex">
//         <CreatorSidebar />
//         <div className="ml-8 w-full">
//           <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
//             Your Event Dashboard
//           </h2>

//           {/* Not Approved / Waiting for Admin Approval */}
//           {notApprovedEvents?.length > 0 && (
//             <div className="mb-8">
//               <h4 className="text-2xl font-semibold text-gray-900 mb-6">
//                 <span className="text-blue-500">Not Approved </span>
//                 <span className="text-sm text-gray-500">
//                   (Waiting for Admin Approval)
//                 </span>
//               </h4>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {notApprovedEvents.map((event) => (
//                   <div
//                     key={event.id}
//                     className="bg-white shadow-lg rounded-lg overflow-hidden"
//                   >
//                     <img
//                       className="w-full h-48 object-cover"
//                       src={event.image}
//                       alt={event.title}
//                     />
//                     <div className="p-6">
//                       <h5 className="text-lg font-semibold text-gray-800 truncate mb-4">
//                         {event.title}
//                       </h5>
//                       <div className="flex justify-between text-sm text-gray-600 mb-4">
//                         {/* Event Type */}
//                         <p
//                           className={`inline-block ${getEventTypeColor(
//                             event.event_type
//                           )}`}
//                         >
//                           {event.event_type}
//                         </p>
//                         {/* Date */}
//                         <p
//                           className={`inline-block ${getDateColor(event.date)}`}
//                         >
//                           {dayjs(event.date).format("MMMM D, YYYY")}
//                         </p>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-600">
//                         {/* Category */}
//                         <p>{event.category}</p>
//                         {/* Ticket Type */}
//                         <p>{event.ticket_type}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Upcoming Events */}
//           {upcomingEvents?.length > 0 && (
//             <div className="mb-8">
//               <h4 className="text-2xl font-semibold text-gray-900 mb-6">
//                 <span className="text-green-500">Upcoming Events</span>
//               </h4>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {upcomingEvents.map((event) => (
//                   <div
//                     key={event.id}
//                     className="bg-white shadow-lg rounded-lg overflow-hidden"
//                   >
//                     <img
//                       className="w-full h-48 object-cover"
//                       src={event.image}
//                       alt={event.title}
//                     />
//                     <div className="p-6">
//                       <h5 className="text-lg font-semibold text-gray-800 truncate mb-4">
//                         {event.title}
//                       </h5>
//                       <div className="flex justify-between text-sm text-gray-600 mb-4">
//                         {/* Event Type */}
//                         <p
//                           className={`inline-block ${getEventTypeColor(
//                             event.event_type
//                           )}`}
//                         >
//                           {event.event_type}
//                         </p>
//                         {/* Date */}
//                         <p
//                           className={`inline-block ${getDateColor(event.date)}`}
//                         >
//                           {dayjs(event.date).format("MMMM D, YYYY")}
//                         </p>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-600">
//                         {/* Category */}
//                         <p>{event.category}</p>
//                         {/* Ticket Type */}
//                         <p>{event.ticket_type}</p>
//                       </div>
//                       <button
//                         className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//                         onClick={() => handleScanButtonClick(event.id)}
//                       >
//                         Scan QR
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Completed Events */}
//           {completedEvents?.length > 0 && (
//             <div className="mb-8">
//               <h4 className="text-2xl font-semibold text-gray-900 mb-6">
//                 <span className="text-gray-600">Completed Events</span>
//               </h4>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {completedEvents.map((event) => (
//                   <div
//                     key={event.id}
//                     className="bg-white shadow-lg rounded-lg overflow-hidden"
//                   >
//                     <img
//                       className="w-full h-48 object-cover"
//                       src={event.image}
//                       alt={event.title}
//                     />
//                     <div className="p-6">
//                       <h5 className="text-lg font-semibold text-gray-800 truncate mb-4">
//                         {event.title}
//                       </h5>
//                       <div className="flex justify-between text-sm text-gray-600 mb-4">
//                         {/* Event Type */}
//                         <p
//                           className={`inline-block ${getEventTypeColor(
//                             event.event_type
//                           )}`}
//                         >
//                           {event.event_type}
//                         </p>
//                         {/* Date */}
//                         <p
//                           className={`inline-block ${getDateColor(event.date)}`}
//                         >
//                           {dayjs(event.date).format("MMMM D, YYYY")}
//                         </p>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-600">
//                         {/* Category */}
//                         <p>{event.category}</p>
//                         {/* Ticket Type */}
//                         <p>{event.ticket_type}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Expired Events (Not Approved) */}
//           {expiredEvents?.length > 0 && (
//             <div className="mb-8">
//               <h4 className="text-2xl font-semibold text-gray-900 mb-6">
//                 <span className="text-red-500">Expired Events</span>
//                 <span className="text-sm text-gray-500"> (Not Approved)</span>
//               </h4>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {expiredEvents.map((event) => (
//                   <div
//                     key={event.id}
//                     className="bg-white shadow-lg rounded-lg overflow-hidden"
//                   >
//                     <img
//                       className="w-full h-48 object-cover"
//                       src={event.image}
//                       alt={event.title}
//                     />
//                     <div className="p-6">
//                       <h5 className="text-lg font-semibold text-gray-800 truncate mb-4">
//                         {event.title}
//                       </h5>
//                       <div className="flex justify-between text-sm text-gray-600 mb-4">
//                         {/* Event Type */}
//                         <p
//                           className={`inline-block ${getEventTypeColor(
//                             event.event_type
//                           )}`}
//                         >
//                           {event.event_type}
//                         </p>
//                         {/* Date */}
//                         <p
//                           className={`inline-block ${getDateColor(event.date)}`}
//                         >
//                           {dayjs(event.date).format("MMMM D, YYYY")}
//                         </p>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-600">
//                         {/* Category */}
//                         <p>{event.category}</p>
//                         {/* Ticket Type */}
//                         <p>{event.ticket_type}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {/* Render QR Code Scanner if event selected */}
//           {selectedEventId && (
//             <QRCodeScanner
//               selectedEventId={selectedEventId}
//               eventCreator={{ accessToken }}
//             />
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default CreatorEvents;

function CreatorEvents() {
  const { events, loading, error } = useSelector((state) => state.events);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const [selectedEventId, setSelectedEventId] = useState(null); // State to track the selected event for QR code scanning

  console.log("events", events);
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
  const handleStatusChange = (status) => {
    setStatusToUpdate(status);
    setShowConfirmation(true);
  };
  const confirmStatusChange = async () => {
    console.log("event id ", event.id);
    dispatch(updateEventStatus({ eventId: event.id, status: statusToUpdate })); // Dispatch action to update status
    setShowConfirmation(false);
  };
  const today = new Date().toISOString().split("T")[0];
  const isEventToday = event.date === today;

  return (
    <div className="ml-8 mr-4 mb-8 rounded-lg p-6 bg-white shadow-md">
      <div className="flex">
        <img
          className="h-20 w-40 object-cover"
          src={event.image}
          alt={event.title}
        />
        <h2 className="text-xl font-semibold mb-4 ml-8">{event.title}</h2>
      </div>
      <p className="mb-4 mt-8">{event.description}</p>
      <hr />
      <div className="flex">
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

        {event.event_type === "online" && event.meeting_link && (
          <p className="text-sm ml-20 text-gray-600 mt-8">
            <span className="font-bold mb-4">Meet Link: </span>
            {event.meeting_link}
          </p>
        )}
        <div className="flex space-x-4 mt-8">
          {event.creator_status === "upcoming" && isEventToday && (
            <button
              className="inline-block bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md"
              onClick={() => handleStatusChange("ongoing")}
            >
              Mark as Ongoing
            </button>
          )}

          {event.creator_status === "ongoing" && (
            <button
              className="inline-block bg-green-500 text-white hover:bg-green-600 px-6 py-2 rounded-lg shadow-md"
              onClick={() => handleStatusChange("completed")}
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>

      {onScanClick && (
        <button
          className="mt-10 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => onScanClick(event.id)}
        >
          Scan QR
        </button>
      )}
      <div className="flex space-x-4 mt-8">
        {event.creator_status === "completed" &&
          event.admin_status === "approved" && (
            <>
              <Link
                to={`/event/attended-users/${event.id}`}
                className="inline-block bg-green-500 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                View Attended Users
              </Link>
              <Link
                to={`/event/registered-users/${event.id}`}
                className="inline-block bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="inline-block bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="inline-block bg-green-500 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                View Attended Users
              </Link>
              <Link
                to={`/event/registered-users/${event.id}`}
                className="inline-block bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                View Registered Users
              </Link>
            </>
          )}
      </div>
      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold">
              Are you sure you want to update the status?
            </h3>
            <div className="mt-4 flex space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={confirmStatusChange}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatorEvents;
