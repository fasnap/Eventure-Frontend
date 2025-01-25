import axios from "axios";
import { loginSuccess, logout } from "../features/authSlice";
import { USER_BASE_URL } from "./base";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../instance/axiosInstance";

export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${USER_BASE_URL}register/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await axios.post(`${USER_BASE_URL}verify-otp/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post("/user/login/", data);
    console.log("response in api call", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/user/attendee/profile/", {});

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw error;
    }
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(
      `${USER_BASE_URL}attendee/profile/`,
      profileData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCreatorProfile = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(`${USER_BASE_URL}creator/profile/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw error;
    }
    throw error;
  }
};

export const setupCreatorAccount = async (data) => {
  console.log("data to pass", data);
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(`${USER_BASE_URL}creator/profile/`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("api resposne is ", response.data);
    return response.data;
  } catch (error) {
    console.log("error in api resposne",error);
    throw error;
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      throw new Error("No access or refresh token found");
    }
    await axios.post(
      `${USER_BASE_URL}logout/`,
      { refresh_token: refreshToken }, // Send refresh_token in the request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // localStorage.clear();
    localStorage.clear();
    dispatch(logout());
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${USER_BASE_URL}forgot-password/`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${USER_BASE_URL}reset-password/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtpForgotPassword = async (email, otp) => {
  try {
    const response = await axios.post(
      `${USER_BASE_URL}verify-otp-forgot-password/`,
      {
        email,
        otp,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCreatorProfile = createAsyncThunk(
  "auth/fetchCreatorProfile",
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(`${USER_BASE_URL}creator/profile/`, {
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
