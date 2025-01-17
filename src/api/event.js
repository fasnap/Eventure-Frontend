import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { EVENT_BASE_URL } from "./base";
import axiosInstance from "../instance/axiosInstance";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (
    { minPrice, maxPrice, startDate, endDate, sortBy, currentPage },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        "/events/attendee/events/list/",
        {
          params: {
            min_price: minPrice || null,
            max_price: maxPrice || null,
            start_date: startDate || null,
            end_date: endDate || null,
            sort_by: sortBy || "created_at",
            page: currentPage || 1,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEventCategories = createAsyncThunk(
  "eventCategories/fetchCategories",
  async () => {
    const response = await axios.get(`${EVENT_BASE_URL}event-categories/`);
    return response.data;
  }
);

export const createEvent = createAsyncThunk(
  "event/createEvent",
  async ({ eventData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/events/create_event/`,
        eventData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSingleEvent = createAsyncThunk(
  "events/fetchSingleEvent",
  async ({ accessToken, eventId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${EVENT_BASE_URL}${eventId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCreatorEvents = createAsyncThunk(
  "events/fetchCreatorEvents",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${EVENT_BASE_URL}creator/events`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerForEvent = createAsyncThunk(
  "events/registerForEvent",
  async ({ accessToken, eventId, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${EVENT_BASE_URL}${eventId}/register/`,
        {
          event: eventId, // Pass event ID
          attendee: user, // Pass the logged-in user's ID
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAttendeeRegisteredEvents = createAsyncThunk(
  "events/fetchAttendeeRegisteredEvents",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${EVENT_BASE_URL}attendee/registered_events/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("response: ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createRazorpayOrder = createAsyncThunk(
  "payment/createRazorpayOrder",
  async (eventId, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const response = await axios.post(
        `${EVENT_BASE_URL}create-order/${eventId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAttendance = createAsyncThunk(
  "events/markAttendance",
  async ({ qrCodeData, eventId }, { rejectWithValue }) => {
    try {
      console.log("QR Code Data in api call:", qrCodeData);

      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${EVENT_BASE_URL}mark-attendance/`,
        {
          qr_code_data: qrCodeData,
          eventId: eventId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEventStatistics = createAsyncThunk(
  "events/fetchEventStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${EVENT_BASE_URL}event-statistics/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateEventStatus = createAsyncThunk(
  "events/updateStatus",
  async ({ eventId, status }, { rejectWithValue }) => {
    console.log("event id in apic all", eventId);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${EVENT_BASE_URL}${eventId}/update-status/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitFeedback = createAsyncThunk(
  "events/submitFeedback",
  async ({ eventId, feedback }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `${EVENT_BASE_URL}${eventId}/feedback/submit/`,
        { feedback },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateFeedback = createAsyncThunk(
  "events/updateFeedback",
  async ({ feedbackId, feedback }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/events/${feedbackId}/update/feedback/`,
        feedback
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAllFeedback = createAsyncThunk(
  "feedback/fetchAllFeedback",
  async ({ eventId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/feedbacks/`);
      console.log("event id ", eventId, "feedback response: ", response.data);

      return { eventId, feedbacks: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
