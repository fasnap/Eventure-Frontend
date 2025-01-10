import { createAsyncThunk } from "@reduxjs/toolkit";
import { USER_BASE_URL } from "./base";
import axiosInstance from "../instance/axiosInstance";

export const fetchCreators = createAsyncThunk(
  "creator/fetchCreators",
  async () => {
    const response = await axiosInstance.get(`${USER_BASE_URL}creators-list/`);
    console.log("respnse", response.data);
    return response.data;
  }
);

export const fetchCreatorProfile = createAsyncThunk(
  "creator/fetchCreatorProfile",
  async (creatorId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${USER_BASE_URL}creator/${creatorId}/`
      );
      console.log("creator profile", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
