import React from "react";

function ChatHeader({ selectedRoom, currentUser }) {
  return (
    <div className="bg-white p-3 sm:p-4 border-b">
      <div className="flex items-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
          {(currentUser?.id === selectedRoom?.attendee.id
            ? selectedRoom?.creator?.username
            : selectedRoom?.attendee?.username
          )
            .charAt(0)
            .toUpperCase()}
        </div>
        <div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-medium truncate">
              {currentUser.id === selectedRoom?.attendee.id
                ? selectedRoom?.creator?.username
                : selectedRoom?.attendee?.username}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {currentUser?.id === selectedRoom?.attendee?.id
                ? "Creator"
                : "Attendee"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
