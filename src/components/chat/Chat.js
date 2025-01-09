import React from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

function Chat() {
  const accessToken = localStorage.getItem("accessToken");
  console.log("chat page", accessToken);
  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      <div className="w-full sm:w-1/4 bg-white border-r shadow-md">
        <ChatSidebar />
      </div>
      <div className="w-full sm:w-3/4 flex flex-col">
        <ChatWindow />
      </div>
    </div>
  );
}

export default Chat;
