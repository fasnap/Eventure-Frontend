import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../shared/Header";
import { useParams } from "react-router-dom";
import { fetchCreatorProfile } from "../../api/creator";

function CreatorDetail() {
  const { currentProfile } = useSelector((state) => state.creator);
  const dispatch = useDispatch();
  const { creatorId } = useParams();

  useEffect(() => {
    dispatch(fetchCreatorProfile(creatorId));
  }, [dispatch, creatorId]);

  return (
    <div className="bg-violet-50 min-h-screen">
      <Header />
      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl bg-gray-50 shadow-sm rounded-lg mt-10 p-8">
          <h1 className="text-3xl font-bold text-gray-700 text-center mb-6">
            Profile Details
          </h1>
          <div className="flex items-center space-x-8">
            <img
              src={
                currentProfile.profile_picture ||
                "https://via.placeholder.com/150?text=No+Image"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-gray-200"
            />
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">
                {currentProfile.username || "No Username"}
              </p>
              <p className="text-sm text-gray-600">{currentProfile.email}</p>
              <p className="text-sm text-gray-600">
                Organisation: {currentProfile.organisation_name || "N/A"}
              </p>
            </div>
            <button className="ml-auto px-6 py-3 rounded-lg text-black shadow hover:bg-blue-600">
              Chat
            </button>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button className="px-6 py-3 rounded-lg text-white bg-green-500 shadow hover:bg-green-600">
              Events Completed: {currentProfile.total_completed_events || 0}
            </button>
            <button className="px-6 py-3 rounded-lg text-white bg-blue-500 shadow hover:bg-blue-600">
              Events Ongoing: {currentProfile.total_ongoing_events || 0}
            </button>
            <button className="px-6 py-3 rounded-lg text-white bg-purple-500 shadow hover:bg-purple-600">
              Events Upcoming: {currentProfile.total_upcoming_events || 0}
            </button>
          </div>
        </div>

        {currentProfile.events?.length > 0 && (
          <div>
            <h2 className="ml-8 mb-6 text-2xl font-bold text-gray-400">
              Hosted Events
            </h2>
            <div className="space-y-6">
              {currentProfile.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function EventCard({ event, onScanClick }) {
  console.log("event in event card", event);

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
      </div>
    </div>
  );
}

export default CreatorDetail;
