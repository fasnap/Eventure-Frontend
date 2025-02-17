import { MessageCircle } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrGetChatRoom } from "../../api/chat";

function CreatorListModal({ creators, isOpen, onClose, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!isOpen) return null; // Don't render the modal if it's not open
  console.log("Creators received:", creators); // Add this line

  const handleCreatorClick = (creatorId) => {
    onClose();
    navigate(`/creator/${creatorId}`);
  };

  const handleChatClick = async (creatorId) => {
    try {
      const result = await dispatch(
        createOrGetChatRoom({
          attendeeId: currentUser.id,
          creatorId: creatorId,
        })
      ).unwrap();

      onClose();
      navigate("/chat", { state: { selectedRoom: result } });
    } catch (error) {
      console.error("Failed to create/get chat room:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg transform transition-all scale-95 hover:scale-100 mx-4 sm:mx-8 md:mx-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Event Creators
          </h2>
          <button
            className="text-2xl font-bold text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            X
          </button>
        </div>

        {/* List of Creators with Profile Picture */}
        <div>
          {creators.length > 0 ? (
            <ul className="space-y-6">
              {creators.map((creator) => (
                <li
                  key={creator.id}
                  className="flex flex-wrap items-center space-x-6 p-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  {/* Profile Picture */}
                  <img
                    src={creator.profile_picture || "/default-profile.jpg"} // Fallback if no image
                    alt={creator.username}
                    className="w-16 h-16 rounded-full object-cover border-2"
                  />
                  {/* Creator Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-xl font-semibold text-gray-800 truncate">
                      {creator.username}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {creator.event_count} Events
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {creator.organisation_name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-800 truncate">{creator.email}</p>

                  <button
                    onClick={() => handleCreatorClick(creator.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold border-b-2 border-transparent hover:border-blue-500"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleChatClick(creator.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No creators available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatorListModal;
