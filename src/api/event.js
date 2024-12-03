import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { EVENT_BASE_URL } from "./base";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (
    { accessToken, minPrice, maxPrice, startDate, endDate, sortBy },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${EVENT_BASE_URL}attendee/events/list/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            min_price: minPrice || null,
            max_price: maxPrice || null,
            start_date: startDate || null,
            end_date: endDate || null,
            sort_by: sortBy || "created_at",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error.response.data); // Log the error

      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEventCategories = createAsyncThunk(
  "eventCategories/fetchCategories",
  async () => {
    const response = await axios.get(`${EVENT_BASE_URL}event-categories/`);
    console.log("Fetched Events Data:", response.data);
    return response.data;
  }
);

export const createEvent = createAsyncThunk(
  "event/createEvent",
  async ({ eventData, accessToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${EVENT_BASE_URL}create_event/`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
      const response = await axios.get(
        `${EVENT_BASE_URL}${eventId}/`,
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
