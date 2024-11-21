import axios from "axios";
import { ADMIN_BASE_URL } from "./base";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginAdminUser = async (data) => {
  try {
    const response = await axios.post(`${ADMIN_BASE_URL}login/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get all users(attendees)
export const getAllUsers = async (
  accessToken,
  search,
  filter,
  sort,
  sortBy,
  currentPage
) => {
  try {
    const response = await axios.get(`${ADMIN_BASE_URL}users/list/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        search: search || "",
        filter: filter || "all",
        sort: sort || "asc",
        sort_by: sortBy || "created_at",
        page: currentPage || 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const blockUnblockUser = async (userId, accessToken) => {
  try {
    const response = await axios.patch(
      `${ADMIN_BASE_URL}users/block_unblock/${userId}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    throw error;
  }
};

export const getAllCreators = async (accessToken) => {
  try {
    const response = await axios.get(`${ADMIN_BASE_URL}creators/list/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching creators:", error);
    throw error;
  }
};

export const approveCreator = async (id, accessToken) => {
  try {
    const response = await axios.post(
      `${ADMIN_BASE_URL}creators/approve/${id}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error approving creator:", error);
    throw error;
  }
};

export const rejectCreator = async (id, accessToken) => {
  try {
    const response = await axios.post(
      `${ADMIN_BASE_URL}creators/reject/${id}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting creator:", error);
    throw error;
  }
};

export const getAllApprovedCreators = async (accessToken) => {
  try {
    const response = await axios.get(`${ADMIN_BASE_URL}approved-creators/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching creators:", error);
    throw error;
  }
};

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ADMIN_BASE_URL}event/list/`, {
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

export const approveEvent = createAsyncThunk(
  "events/approveEvent",
  async ({ eventId, accessToken }, { rejectWithValue }) => {
    try {
      console.log("event id at api call: ", eventId);
      const response = await axios.post(
        `${ADMIN_BASE_URL}event/approve/${eventId}/`,
        {},
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

export const rejectEvent = createAsyncThunk(
  "events/rejectEvent",
  async ({ eventId, accessToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ADMIN_BASE_URL}event/reject/${eventId}/`,
        {},
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
