import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatRooms, fetchMessages } from "../../api/chat";
import {
  addMessage,
  setSelectedRoom,
  updateMessageStatus,
} from "../../features/chatSlice";
import LoadingSpinner from "../shared/LoadingSpinner";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyState from "./EmptyState";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { chatRooms, messages, selectedRoom, loading } = useSelector(
    (state) => state.chat
  );
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRoom) {
      dispatch(fetchMessages(selectedRoom.id));
      connectWebSocket(selectedRoom.id);
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [selectedRoom]);

  const connectWebSocket = (roomId) => {
    const token = localStorage.getItem("accessToken");
    const ws = new WebSocket(
      `wss://eventure.fasna.xyz/ws/chat/${roomId}/?token=${token}`
    );

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "status_update") {
        dispatch(
          updateMessageStatus({
            roomId,
            messageId: data.message_id,
            status: data.status,
          })
        );
      } else {
        dispatch(
          addMessage({
            roomId,
            message: {
              id: data.message_id,
              content: data.message,
              sender_id: data.sender_id,
              timestamp: data.timestamp,
              status: data.status || "sent",
              sender: {
                id: data.sender_id,
                username: data.sender.username,
              },
              media_url: data.media_url,
              media_type: data.media_type,
              file_name: data.file_name,
              file_size: data.file_size,
            },
          })
        );
      }
      scrollToBottom();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket Disconnected", event);
      // Implement reconnection logic if needed
      setTimeout(() => {
        connectWebSocket(roomId);
      }, 1000);
    };

    setSocket(ws);
  };

  const handleRoomSelect = (room) => {
    dispatch(setSelectedRoom(room));
  };

  const handleSendMessage = (e, mediaData = null) => {
    e.preventDefault();
    const checkAndSend = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "message",
            message: message.trim(),
            media: mediaData,
          })
        );
        setMessage("");
        clearFileSelection();
      } else {
        // Retry after a short delay
        setTimeout(checkAndSend, 100);
      }
    };

    checkAndSend();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading && !chatRooms.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        chatRooms={chatRooms}
        currentUser={currentUser}
        selectedRoom={selectedRoom}
        onRoomSelect={handleRoomSelect}
      />

      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <ChatHeader selectedRoom={selectedRoom} currentUser={currentUser} />

            <MessageList
              messages={messages[selectedRoom.id]}
              currentUser={currentUser}
              messagesEndRef={messagesEndRef}
              socket={socket}
            />

            <MessageInput
              message={message}
              setMessage={setMessage}
              onSubmit={handleSendMessage}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
