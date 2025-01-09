import { createAsyncThunk } from "@reduxjs/toolkit";
import { EVENT_BASE_URL } from "./base";
import axiosInstance from "../instance/axiosInstance";

export const fetchAttendedUsers = createAsyncThunk(
  "events/fetchAttendedUsers",
  async (eventId) => {
    const response = await axiosInstance.get(
      `${EVENT_BASE_URL}${eventId}/attendance/`
    );
    console.log("respnse", response.data);
    return response.data;
  }
);

export const fetchRegisteredUsers = createAsyncThunk(
  "events/fetchRegisteredUsers",
  async (eventId) => {
    const response = await axiosInstance.get(
      `${EVENT_BASE_URL}${eventId}/registered_users/`
    );
    console.log("respnse", response.data);
    return response.data;
  }
);

export const fetchAttendedEvents = createAsyncThunk(
  "events/fetchAttendedEvents",
  async (_, { rejectWithValue }) => {
    const response = await axiosInstance.get(
      `${EVENT_BASE_URL}attendee/attended_events/`
    );
    console.log("respnse", response.data);
    return response.data;
  }
);
