import React from "react";

function ChatHeader({ selectedRoom, currentUser }) {
  
  return (
    <div className="bg-white p-4 border-b">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
          {(currentUser?.id === selectedRoom?.attendee.id
            ? selectedRoom?.creator?.username
            : selectedRoom?.attendee?.username
          )
            .charAt(0)
            .toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-medium">
            {currentUser.id === selectedRoom?.attendee.id
              ? selectedRoom?.creator?.username
              : selectedRoom?.attendee?.username}
          </h3>
          <p className="text-sm text-gray-500">
            {currentUser?.id === selectedRoom?.attendee?.id
              ? "Creator"
              : "Attendee"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
