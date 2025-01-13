import React from "react";

function MessageInput({ message, setMessage, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t bg-white">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
