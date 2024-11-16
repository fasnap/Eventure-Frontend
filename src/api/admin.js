import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/admin_panel/";

export const loginAdminUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}login/`, data);
    console.log("Login response:", response.data); // Add this line

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
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
    const response = await axios.get(`${API_URL}users/list/`, {
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
      `${API_URL}users/block_unblock/${userId}/`,
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
    const response = await axios.get(`${API_URL}creators/list/`, {
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
      `${API_URL}creators/approve/${id}/`,
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
      `${API_URL}creators/reject/${id}/`,
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
    const response = await axios.get(`${API_URL}approved-creators/`, {
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
