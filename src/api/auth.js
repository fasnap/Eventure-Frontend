import axios from "axios";
import { loginSuccess, logout } from "../features/authSlice";
import { USER_BASE_URL } from "./base";

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
    const response = await axios.post(`${USER_BASE_URL}login/`, data);
    console.log("Login response:", response.data); // Add this line

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getProfile = async () => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${USER_BASE_URL}attendee/profile/`, {
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
export const updateProfile = async (profileData) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(
      `${USER_BASE_URL}attendee/profile/`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error);
    throw error;
  }
};

export const getCreatorProfile = async () => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("Access Token:", accessToken);
  try {
    const response = await axios.get(`${USER_BASE_URL}creator/profile/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Creator profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching creator profile:", error);
    if (error.response?.status === 401) {
      throw error;
    }
    throw error;
  }
};

export const setupCreatorAccount = async (data) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(`${USER_BASE_URL}creator/profile/`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error setting up creator account:", error);
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
      { refresh_token: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userType")
    dispatch(logout());
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${USER_BASE_URL}forgot-password/`, { email });
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
    const response = await axios.post(`${USER_BASE_URL}verify-otp-forgot-password/`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


