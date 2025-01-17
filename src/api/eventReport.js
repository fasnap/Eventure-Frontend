import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../instance/axiosInstance";

export const fetchEventReport = createAsyncThunk(
  "eventReport/fetchEventReport",
  async (filters) => {
    const response = await axiosInstance.get("/events/event-report/", {
      params: filters,
    });
    console.log("response", response.data);
    return response.data;
  }
);
