import { File } from "lucide-react";
import React from "react";

function MediaMessage({ message }) {
  const renderMedia = () => {
    if (!message.media_url) return null;

    switch (message.media_type) {
      case "image":
        return (
          <img
            src={message.media_url}
            alt={message.file_name || "Image"}
            className="max-w-full sm:max-w-sm rounded-lg shadow-lg"
          />
        );
      case "video":
        return (
          <video controls className="max-w-full sm:max-w-sm rounded-lg">
            <source src={message.media_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "file":
        return (
          <a
            href={message.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-2 sm:p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <File className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{message.file_name}</span>
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-2">
      {renderMedia()}
      {message.file_size && (
        <span className="text-xs text-gray-500 mt-1">
          {(message.file_size / 1024).toFixed(2)} KB
        </span>
      )}
    </div>
  );
}
export default MediaMessage;
