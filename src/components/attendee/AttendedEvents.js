import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendedEvents } from "../../api/attendance";
import Header from "../shared/Header";
import AttendeeSidebar from "../shared/attendee/AttendeeSidebar";
import {
  fetchAllFeedback,
  submitFeedback,
  updateFeedback,
} from "../../api/event";
import NoDataFound from "../shared/NoDataFound";

function AttendedEvents() {
  const { attendedEvents } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAttendedEvents());
  }, [dispatch]);

  return (
    <div className="bg-violet-50 min-h-screen">
      <Header />
      <div className="flex">
        <AttendeeSidebar />

        <div className="flex-1 pt-4 pb-4 pl-8">
          {attendedEvents && attendedEvents.length > 0 ? (
            <div>
              <h1 className="ml-8 mt-8 mb-8 text-3xl font-bold text-green-600">
                Attended Events
              </h1>
              {attendedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <NoDataFound
              message="No Attended Events Found"
              subMessage="We couldn't find any attended events."
            />
          )}
        </div>
      </div>
    </div>
  );
}
function EventCard({ event }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);

  const feedbacks = useSelector((state) =>
    state.feedback[event.id] ? state.feedback[event.id] : []
  );
  const { user } = useSelector((state) => state.auth); // Assuming the logged-in user is available here.

  const dispatch = useDispatch();
  console.log("feedbacks", feedbacks);
  console.log("user is id ", user);
  useEffect(() => {
    dispatch(fetchAllFeedback({ eventId: event.id }));
  }, [dispatch, event.id]);

  const userFeedback = feedbacks.find((fb) => fb.attendee === user.id);

  const handleSubmitFeedback = () => {
    dispatch(
      submitFeedback({ eventId: event.id, feedback: { rating, comment } })
    );

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleEditFeedback = () => {
    dispatch(
      updateFeedback({
        feedbackId: userFeedback.id,
        feedback: { rating, comment },
      })
    );

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

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
      </div>

      <div className="mt-8">
        {!userFeedback ? (
          <>
            <p className="mb-6 text-md font-semibold text-green-700">
              Review the Event
            </p>

            <div className="flex items-center mb-6">
              {/* Star Rating */}
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-10 h-10 cursor-pointer transition-all duration-200 ease-in-out ${
                      star <= (hover || rating)
                        ? "text-yellow-400 transform scale-110"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 40 40"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="ml-4 text-gray-600 text-xl">{rating} / 5</span>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-6 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Leave a comment"
              rows="4"
            />

            <button
              onClick={handleSubmitFeedback}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-300"
            >
              Submit Feedback
            </button>
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="mt-8">
        <p className="mb-6 text-xl font-semibold text-blue-400 tracking-wide">
          All Feedback
        </p>
        {feedbacks.length === 0 && (
          <div>
            <p className="text-gray-500">No reviews found</p>
          </div>
        )}
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="flex items-start mb-6 p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out"
          >
            {/* Feedback Content */}
            <div className="ml-6 flex-1">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-800">
                  {feedback.attendee === user.id
                    ? "You"
                    : feedback.attendee_username}
                </p>
                <p className="text-sm text-gray-500">Reviewed 3 hours ago</p>
              </div>

              {/* Rating Section */}
              <div className="flex items-center mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                      star <= feedback.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 40 40"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

              {/* Comment Section */}
              <p className="mt-4 text-gray-700 text-base leading-relaxed">
                {feedback.comment}
              </p>

              {/* Optional: "Edit" button if it's the logged-in user's feedback */}
              {feedback.attendee === user.id && (
                <button className="mt-4 text-blue-600 hover:underline text-sm">
                  Edit Feedback
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {toastVisible && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Review submitted successfully!
        </div>
      )}
    </div>
  );
}

export default AttendedEvents;
