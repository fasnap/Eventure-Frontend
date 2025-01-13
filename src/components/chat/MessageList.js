import React, { useEffect } from "react";
import { Check, CheckCheck } from "lucide-react";

function MessageList({ messages, currentUser, messagesEndRef, socket }) {
  useEffect(() => {
    if (!messages || !socket) return;

    const unreadMessages = messages.filter(
      (msg) => msg.status === "sent" && msg.sender?.id !== currentUser?.id
    );
    unreadMessages.forEach((msg) => {
      socket.send(
        JSON.stringify({
          type: "message_read",
          message_id: msg.id,
        })
      );
    });
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => {
        const isOwnMessage = isSenderCurrentUser(msg);
        console.log("Message object:", msg);
        return (
          <div
            key={msg.id || index}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            {!isOwnMessage && msg.sender?.username && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                {msg.sender.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isOwnMessage ? "bg-white text-black" : "bg-gray-200"
              }`}
            >
              <p className="break-words">{msg.content}</p>
              <div className="flex items-center justify-end gap-1 text-sm">
                <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
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
