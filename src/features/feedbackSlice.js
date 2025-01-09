import { createSlice } from "@reduxjs/toolkit";
import { fetchAllFeedback } from "../api/event";

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllFeedback.fulfilled, (state, action) => {
      const { eventId, feedbacks } = action.payload;
      state[eventId] = feedbacks;
    });
  },
});

export default feedbackSlice.reducer;
