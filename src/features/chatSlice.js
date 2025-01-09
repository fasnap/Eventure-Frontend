import { createSlice } from "@reduxjs/toolkit";
import { fetchChatGroups, fetchMessages } from "../api/chatApi";

const chatSlice = createSlice({
  name: "chatGroups",
  initialState: {
    groups: [],
    selectedGroup: null,
    messages: [],
    status: "idle",
  },
  reducers: {
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
      // state.messages = [];
    },
    addMessage: (state, action) => {
      const exists = state.messages.some((msg) => msg.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChatGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = action.payload;
      })
      .addCase(fetchChatGroups.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { setSelectedGroup, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
