import { createAsyncThunk } from "@reduxjs/toolkit";
import { CHAT_BASE_URL } from "./base";
import axios from "axios";

export const fetchChatGroups = createAsyncThunk(
  "chat/fetchChatGroups",
  async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(`${CHAT_BASE_URL}chat-groups/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (groupId, {}) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(`${CHAT_BASE_URL}messages/${groupId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
);
