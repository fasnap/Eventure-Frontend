import React, { useEffect } from "react";
import { Check, CheckCheck } from "lucide-react";
import MediaMessage from "./MediaMessage";

function MessageList({ messages, currentUser, messagesEndRef, socket }) {
  useEffect(() => {
    if (!messages || !socket) return;

    const sendReadReceipts = () => {
      if (socket.readyState === WebSocket.OPEN) {
        const unreadMessages = messages.filter(
          (msg) => msg.status === "sent" && msg.sender?.id !== currentUser?.id
        );

        unreadMessages.forEach((msg) => {
          try {
            socket.send(
              JSON.stringify({
                type: "message_read",
                message_id: msg.id,
              })
            );
          } catch (error) {
            console.error("Failed to send read receipt:", error);
          }
        });
      } else {
        // Retry after a short delay if socket not ready
        setTimeout(sendReadReceipts, 200);
      }
    };

    sendReadReceipts();
  }, [messages, socket, currentUser]);
  if (!messages) return null;

  const MessageStatus = ({ status, isOwnMessage }) => {
    if (!isOwnMessage) return null;
    console.log("Message status:", status);

    switch (status) {
      case "sent":
        return (
          <div className="text-gray-500">
            <Check className="h-4 w-4" />
          </div>
        );
      case "read":
        return (
          <div className="text-blue-700">
            <CheckCheck className="h-4 w-4" />
          </div>
        );
      default:
        return null;
    }
  };
  const isSenderCurrentUser = (message) => {
    return message.sender?.id === currentUser?.id;
  };
  console.log("isSenderCurrentUser", isSenderCurrentUser);
  console.log("messages", currentUser);
  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
      {messages.map((msg, index) => {
        const isOwnMessage = isSenderCurrentUser(msg);
        console.log("Message object:", msg);
        return (
          <div
            key={msg.id || index}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            {!isOwnMessage && msg.sender?.username && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 flex-shrink-0">
                {msg.sender.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                isOwnMessage ? "bg-white text-black" : "bg-gray-200"
              }`}
            >
              {msg.media_url ? (
                <MediaMessage message={msg} />
              ) : (
                <p className="break-words text-sm sm:text-base">
                  {msg.content}
                </p>
              )}

              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs sm:text-sm text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                <MessageStatus
                  status={msg.status}
                  isOwnMessage={isOwnMessage}
                />
                {isOwnMessage && (
                  <span className="text-xs ml-2 opacity-75">You</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
