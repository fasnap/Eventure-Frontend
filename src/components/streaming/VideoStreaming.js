import React, { useState } from "react";
import { useParams } from "react-router-dom";
import VideoStreamingRoom from "./VideoStreamingRoom";

function VideoStreaming() {
  const { eventId } = useParams();
  const [error, setError] = useState(null);
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <VideoStreamingRoom eventId={eventId} onError={setError} />
      </div>
    </div>
  );
}

export default VideoStreaming;
