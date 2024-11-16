import axios from "axios";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if the error is due to an expired access token and the refresh flag is not set
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      const user=JSON.parse(localStorage.getItem("user"));
      if (user && user.user_type){
        if (user.user_type === "admin") {
          window.location.href = "/admin/login"; 
        } else if (user.user_type === "creator" || user.user_type === "attendee"){
          window.location.href = "/user/login"; // Redirect to login page
        }
      }
      localStorage.removeItem("user");
    }

    return Promise.reject(error); // Reject with the original error if it's not a 401 or other error occurred
  }
);
