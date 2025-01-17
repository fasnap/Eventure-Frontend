import { createSlice } from "@reduxjs/toolkit";
import { fetchEventReport } from "../api/eventReport";

const eventReportSlice = createSlice({
  name: "EventReport",
  initialState: {
    events: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload.events; // Fix: Access the events array from the response
      })
      .addCase(fetchEventReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default eventReportSlice.reducer;
