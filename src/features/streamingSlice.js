import { createSlice } from "@reduxjs/toolkit";
import { joinStreamingRoom, leaveStreamingRoom } from "../api/streaming";

const streamingSlice = createSlice({
  name: "streaming",
  initialState: {
    isStreaming: false,
    roomData: null,
    error: null,
    participants: [],
    streamStatus: "idle",
  },
  reducers: {
    setStreaming: (state, action) => {
      state.isStreaming = action.payload;
    },
    setStreamStatus: (state, action) => {
      state.streamStatus = action.payload;
    },
    addParticipant: (state, action) => {
      if (!state.participants.find((p) => p.id === action.payload.id)) {
        state.participants.push(action.payload);
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(
        (participant) => participant.id !== action.payload
      );
    },
    clearStreamingState: (state) => {
      state.isStreaming = false;
      state.roomData = null;
      state.error = null;
      state.participants = [];
      state.streamStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinStreamingRoom.pending, (state) => {
        state.streamStatus = "connecting";
        state.error = null;
      })
      .addCase(joinStreamingRoom.fulfilled, (state, action) => {
        state.roomData = action.payload;
        state.streamStatus = "connected";
        state.error = null;
      })
      .addCase(joinStreamingRoom.rejected, (state, action) => {
        state.error = action.error.message;
        state.streamStatus = "failed";
      })

      .addCase(leaveStreamingRoom.fulfilled, (state, action) => {
        state.isStreaming = false;
        state.roomData = null;
        state.participants = [];
        state.streamStatus = "ended";
      })
      .addCase(leaveStreamingRoom.rejected, (state, action) => {
        state.error = action.error.message;
        state.streamStatus = "error";
      });
  },
});

export const {
  setStreaming,
  setStreamStatus,
  addParticipant,
  removeParticipant,
  clearStreamingState,
} = streamingSlice.actions;

export default streamingSlice.reducer;
