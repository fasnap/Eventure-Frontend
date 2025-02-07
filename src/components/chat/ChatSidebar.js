import React from "react";
import { MessageCircle, Clock } from "lucide-react";

function ChatSidebar({ chatRooms, currentUser, selectedRoom, onRoomSelect }) {
  return (
    <div className="w-full h-full border-r bg-white">
      <div className="p-3 sm:p-4 border-b">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chats
        </h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-4rem)]">
        {chatRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onRoomSelect(room)}
            className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
              selectedRoom?.id === room.id ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                {(currentUser.id === room.attendee.id
                  ? room.creator.username
                  : room.attendee.username
                ).charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate text-sm sm:text-base">
                  {currentUser.id === room.attendee.id
                    ? room.creator.username
                    : room.attendee.username}
                </h3>
                {room.last_message && (
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {room.last_message.content}
                  </p>
                )}
              </div>
              {room.last_message && (
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(room.last_message.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ChatSidebar;
