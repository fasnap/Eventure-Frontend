import { createSlice } from "@reduxjs/toolkit";
import {
  createOrGetChatRoom,
  fetchChatRooms,
  fetchMessages,
} from "../api/chat";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatRooms: [],
    messages: {},
    selectedRoom: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateMessageStatus: (state, action) => {
      const { roomId, messageId, status } = action.payload;
      const message = state.messages[roomId]?.find(
        (msg) => msg.id === messageId
      );
      if (message) {
        message.status = status;
      }
    },
    setSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },

    addMessage: (state, action) => {
      const { roomId, message } = action.payload;
      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }
      state.messages[roomId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.chatRooms = action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { roomId, messages } = action.payload;
        state.messages[roomId] = messages;
      })
      .addCase(createOrGetChatRoom.fulfilled, (state, action) => {
        const exists = state.chatRooms.some(
          (room) => room.id === action.payload.id
        );
        if (!exists) {
          state.chatRooms.push(action.payload);
        }
        state.selectedRoom = action.payload;
      });
  },
});

export const { setSelectedRoom, addMessage, updateMessageStatus } = chatSlice.actions;
export default chatSlice.reducer;
