import React from "react";

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          Select a chat to start messaging
        </h3>
        <p className="text-gray-500">
          Choose from your existing conversations or start a new one
        </p>
      </div>
    </div>
  );
}
export default EmptyState;
