import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAttendeeRegisteredEvents,
  fetchCreatorEvents,
  fetchEvents,
  fetchEventStatistics,
  fetchSingleEvent,
  markAttendance,
  startStreaming,
  submitFeedback,
} from "../api/event";
import {
  fetchAttendedEvents,
  fetchAttendedUsers,
  fetchRegisteredUsers,
} from "../api/attendance";

const initialState = {
  events: [],
  registeredEvents: [],
  attendedUsers: [],
  registeredUsers: [],
  attendedEvents: [],
  selectedEvent: null,
  loading: false,
  error: null,
  streamingStatus: null,
  attendanceMessage: "",
  statistics: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching all the events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetching single events
      .addCase(fetchSingleEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchSingleEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetching events of a creator
      .addCase(fetchCreatorEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatorEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchCreatorEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // For fetching registered events
      .addCase(fetchAttendeeRegisteredEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendeeRegisteredEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.registeredEvents = action.payload;
      })
      .addCase(fetchAttendeeRegisteredEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle start streaming actions
      .addCase(startStreaming.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.streamingStatus = null;
      })
      .addCase(startStreaming.fulfilled, (state) => {
        state.loading = false;
        state.streamingStatus = "success";
      })
      .addCase(startStreaming.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.streamingStatus = "error";
      })

      // Attendance marking
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.attendanceMessage = "";
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceMessage = "Attendance marked successfully.";
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.attendanceMessage =
          action.payload?.error || "Error marking attendance.";
      })

      // Statics for creators
      .addCase(fetchEventStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchEventStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetching attended users
      .addCase(fetchAttendedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.attendedUsers = action.payload;
      })
      .addCase(fetchAttendedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetching registered users
      .addCase(fetchRegisteredUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisteredUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.registeredUsers = action.payload;
      })
      .addCase(fetchRegisteredUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // For fetching attended events
      .addCase(fetchAttendedEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.attendedEvents = action.payload;
      })
      .addCase(fetchAttendedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Feedback for event
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.attendedEvents = state.attendedEvents.map((event) =>
          event.id === action.payload.event
            ? { ...event, feedback: action.payload }
            : event
        );
      })
  },
});

export const { clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
