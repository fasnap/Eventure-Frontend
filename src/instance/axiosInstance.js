import axios from "axios";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: "http://18.206.174.87/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
