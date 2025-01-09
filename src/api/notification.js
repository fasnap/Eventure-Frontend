import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { EVENT_BASE_URL } from "./base";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${EVENT_BASE_URL}notifications/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("fetched notifications are ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markAsViewed = createAsyncThunk(
  "notifications/markAsViewed",
  async ({ notificationId, accessToken }, { rejectWithValue }) => {
    try {
      await axios.post(
        `${EVENT_BASE_URL}notifications/${notificationId}/mark_viewed/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
