import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { joinStreamingRoom, leaveStreamingRoom } from "../../api/streaming";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { protocol, WEBSOCKET_BASE_URL } from "../../api/base";

function VideoStreamingRoom({ eventId, onError }) {
  const { roomData } = useSelector((state) => state.streaming);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const localVideoRef = useRef(null);
  const peerConnections = useRef(new Map());
  const websocketRef = useRef(null);
  const token = localStorage.getItem("accessToken");
  const remoteVideoRefs = useRef(new Map());
  const localStreamRef = useRef(null);
  const userType = useSelector((state) => state.auth.user?.user_type);
  const pendingIceCandidates = useRef(new Map());

  useEffect(() => {
    if (userType) {
      console.log("user type is", userType);
    } else {
      console.log("no user type");
    }

    console.log("LocalStream state changed:", !!localStream);
    if (localStream) {
      console.log("Stream tracks:", localStream.getTracks());
    }
  }, [localStream]);

  useEffect(() => {
    initializeCall();
    return () => {
      cleanup();
    };
  }, [eventId]);

  const initializeCall = async () => {
    try {
      const stream = await setupLocalStream(); // Store the returned stream
      if (!stream) {
        throw new Error("Failed to setup local stream");
      }

      const response = await dispatch(
        joinStreamingRoom({ eventId, token })
      ).unwrap();
      console.log("Joined streaming room:", response);

      // Initialize WebSocket after we have the stream
      if (stream && response) {
        await initializeWebSocket();
      }
    } catch (error) {
      console.error("Initialize call error:", error);
      onError(error.message);
    }
  };

  const setupLocalStream = async () => {
    try {
      console.log("Requesting media permissions...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      console.log("Local stream obtained:", stream.getTracks());
      localStreamRef.current = stream;

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("Local video stream attached to video element");
      }
      return stream;
    } catch (error) {
      console.error("Media access error:", error);
      onError(`Could not access camera/microphone: ${error.message}`);
      return null;
    }
  };

  const initializeWebSocket = () => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    // const wsUrl = `wss://eventure.fasna.xyz/ws/stream/${eventId}/?token=${token}`;
    const wsUrl = `${protocol}${WEBSOCKET_BASE_URL}/ws/stream/${eventId}/?token=${token}`;

    websocketRef.current = new WebSocket(wsUrl);

    websocketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      // Clear any existing connections when reconnecting
      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      sendSignal({ type: "join", userId: roomData?.user_id });
    };

    websocketRef.current.onmessage = handleWebSocketMessage;

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      onError("WebSocket connection failed");
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setTimeout(() => {
        if (websocketRef.current?.readyState === WebSocket.CLOSED) {
          initializeWebSocket();
        }
      }, 3000);
    };
  };

  const handleWebSocketMessage = async (event) => {
    const data = JSON.parse(event.data);
    console.log("WebSocket state:", websocketRef.current?.readyState);

    console.log("WebSocket message received:", data);

    try {
      switch (data.type) {
        case "join":
          if (data.sender_id !== roomData?.user_id) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await handleNewPeer(data.sender_id);
          }
          break;
        case "offer":
          if (data.sender_id !== roomData?.user_id) {
            await handleOffer(data);
          }
          break;
        case "answer":
          if (data.sender_id !== roomData?.user_id) {
            await handleAnswer(data);
          }
          break;
        case "ice_candidate":
          if (data.sender_id !== roomData?.user_id) {
            await handleIceCandidate(data);
          }
          break;
        case "peer_disconnected":
          handlePeerDisconnected(data.sender_id);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  };

  const createPeerConnection = (peerId) => {
    if (peerConnections.current.has(peerId)) {
      console.log("Reusing existing peer connection for:", peerId);
      return peerConnections.current.get(peerId);
    }

    const stream = localStreamRef.current;

    if (!stream) {
      console.error("No local stream available for peer connection");
      return null;
    }
    console.log("Creating new peer connection for:", peerId);

    console.log("Creating new peer connection for:", peerId);
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });
    // Add tracks using the ref stream
    stream.getTracks().forEach((track) => {
      console.log("Adding track to peer connection:", track.kind);
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate for peer:", peerId);
        sendSignal({
          type: "ice_candidate",
          candidate: event.candidate,
          target: peerId,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track from peer:", peerId);
      if (event.streams && event.streams[0]) {
        setRemoteStreams((prev) => {
          const newStreams = new Map(prev);
          newStreams.set(peerId, event.streams[0]);
          return newStreams;
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state for peer ${peerId}:`,
        pc.iceConnectionState
      );

      if (
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed"
      ) {
        console.log(`Attempting to reconnect with peer ${peerId}`);
        // Wait a bit before trying to reconnect
        setTimeout(() => {
          if (peerConnections.current.has(peerId)) {
            handleNewPeer(peerId);
          }
        }, 2000);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state for peer ${peerId}:`, pc.connectionState);
    };

    peerConnections.current.set(peerId, pc);
    return pc;
  };

  const handleNewPeer = async (peerId) => {
    console.log("Handling new peer:", peerId, "Local stream state:", {
      refStream: !!localStreamRef.current,
      stateStream: !!localStream,
    });

    if (peerId === roomData?.user_id) {
      console.log("Ignoring self connection");
      return;
    }

    // Try to get local stream with timeout
    let attempts = 0;
    while (!localStreamRef.current && attempts < 5) {
      console.log(`Waiting for local stream... Attempt ${attempts + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }

    if (!localStreamRef.current) {
      console.error("Failed to get local stream after multiple attempts");
      return;
    }

    console.log("Creating peer connection with confirmed local stream");
    const pc = createPeerConnection(peerId);
    if (!pc) {
      console.error("Failed to create peer connection");
      return;
    }

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      console.log("Created and set local offer for peer:", peerId);
      sendSignal({ type: "offer", offer: pc.localDescription, target: peerId });
    } catch (error) {
      console.error("Error creating offer:", error);
      onError("Failed to create connection offer");
    }
  };

  const handleOffer = async (data) => {
    if (data.sender_id === roomData?.user_id) return;
    console.log("Handling offer from peer:", data.sender_id);
    try {
      if (!localStreamRef.current) {
        throw new Error("Local stream not initialized");
      }

      let pc = peerConnections.current.get(data.sender_id);
      if (!pc) {
        pc = createPeerConnection(data.sender_id);
        if (!pc) {
          console.error("Failed to create peer connection for offer");
          return;
        }
      }
      if (
        pc.signalingState === "stable" ||
        pc.signalingState === "have-remote-offer"
      ) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        console.log("Set remote description from offer");
        await addPendingCandidates(data.sender_id);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("Created and set local answer");

        sendSignal({
          type: "answer",
          answer: pc.localDescription,
          target: data.sender_id,
        });
      } else {
        console.warn(
          `Cannot set remote description in current state: ${pc.signalingState}`
        );
      }
    } catch (error) {
      console.error("Error handling offer:", error);
      onError("Failed to handle connection offer");
    }
  };

  const handleAnswer = async (data) => {
    if (data.sender_id === roomData?.user_id) return;

    const pc = peerConnections.current.get(data.sender_id);
    if (!pc) {
      console.log("No peer connection found for:", data.sender_id);
      return;
    }

    try {
      if (pc.signalingState === "have-local-offer") {
        console.log(
          "Setting remote description for answer from peer:",
          data.sender_id
        );
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        await addPendingCandidates(data.sender_id);
      } else {
        console.log(
          "Peer connection state not ready for answer:",
          pc.signalingState
        );
      }
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };

  const handleIceCandidate = async (data) => {
    if (data.sender_id === roomData?.user_id) return;

    const pc = peerConnections.current.get(data.sender_id);
    if (pc) {
      try {
        // Only add ice candidate if we have a remote description
        if (pc.remoteDescription) {
          console.log("Adding ICE candidate for peer:", data.sender_id);
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
          console.log(
            "Waiting for remote description before adding ICE candidate"
          );
          const pendingCandidates =
            pendingIceCandidates.current.get(data.sender_id) || [];
          pendingCandidates.push(data.candidate);
          pendingIceCandidates.current.set(data.sender_id, pendingCandidates);
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    }
  };

  const handlePeerDisconnected = (peerId) => {
    console.log("Peer disconnected:", peerId);
    const pc = peerConnections.current.get(peerId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(peerId);
    }
    setRemoteStreams((prev) => {
      const newStreams = new Map(prev);
      newStreams.delete(peerId);
      return newStreams;
    });
  };

  const sendSignal = (data) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(data));
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const addPendingCandidates = async (peerId) => {
    const candidates = pendingIceCandidates.current.get(peerId) || [];
    const pc = peerConnections.current.get(peerId);

    if (pc && pc.remoteDescription && candidates.length > 0) {
      console.log(
        `Adding ${candidates.length} pending ICE candidates for peer ${peerId}`
      );
      for (const candidate of candidates) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding pending ICE candidate:", error);
        }
      }
      pendingIceCandidates.current.delete(peerId);
    }
  };

  const endCall = () => {
    cleanup();
    navigate(-1);
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped local track: ${track.kind}`);
      });
      localStreamRef.current = null;
    }
    // if (localStream) {
    //   localStream.getTracks().forEach((track) => track.stop());
    // }
    // Close all peer connections
    peerConnections.current.forEach((pc, peerId) => {
      console.log(`Closing peer connection with ${peerId}`);
      pc.close();
    });
    peerConnections.current.clear();

    // Close WebSocket
    if (websocketRef.current) {
      console.log("Closing WebSocket connection");
      websocketRef.current.close();
      websocketRef.current = null;
    }

    // Clear state
    setLocalStream(null);
    setRemoteStreams(new Map());

    console.log("Cleanup completed");
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-[360px] bg-gray-900 rounded-lg object-cover"
            />
            <p className="absolute top-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              You
            </p>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                className={`p-2 rounded-full ${
                  isAudioEnabled ? "bg-blue-500" : "bg-red-500"
                } text-white hover:opacity-80 transition-opacity`}
                onClick={toggleAudio}
              >
                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button
                className={`p-2 rounded-full ${
                  isVideoEnabled ? "bg-blue-500" : "bg-red-500"
                } text-white hover:opacity-80 transition-opacity`}
                onClick={toggleVideo}
              >
                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              <button
                className="p-2 rounded-full bg-red-500 text-white hover:opacity-80 transition-opacity"
                onClick={endCall}
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>

          {/* Remote Videos */}
          <div className="flex-1 flex flex-col items-center p-4">
            {console.log("remot streams????????????", remoteStreams)}
            {remoteStreams.size > 0 ? (
              <div className="grid grid-cols-1 gap-4 w-full">
                {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
                  <div key={peerId} className="relative w-full h-[360px]">
                    <video
                      key={peerId}
                      autoPlay
                      playsInline
                      ref={(el) => {
                        if (el && stream) {
                          el.srcObject = stream;
                          remoteVideoRefs.current.set(peerId, el);
                        }
                      }}
                      className="w-full h-full bg-gray-900 rounded-lg object-cover"
                    />
                    <h1>Hello {peerId}</h1>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-[360px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Waiting for others to join...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoStreamingRoom;
