import axios from "axios";
import { toast } from "react-toastify";
import { CONFIG } from "../config";
import { API } from "./endpoints";

const api = axios.create({
  baseURL: CONFIG.BACKEND_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const status = error.response.status;

      if (status === 401 && !originalRequest._retry) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axios.post(
              API.AUTH.REFRESH,
              {},
              {
                headers: { Authorization: `Bearer ${refreshToken}` },
              },
            );

            const newAccessToken = refreshResponse.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token expired");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
      }

      const backendData = error.response.data;
      let displayMessage = backendData?.message;

      if (backendData?.errors && typeof backendData.errors === "object") {
        const errorMessages = Object.values(backendData.errors);
        displayMessage = errorMessages.join(". ");
      } else if (typeof backendData === "string") {
        displayMessage = backendData;
      }

      switch (status) {
        case 400:
        case 409:
          toast.error(displayMessage || "Invalid data. Please check the form.");
          break;
        case 401:
          toast.warning(displayMessage || "Invalid credentials.");
          break;
        case 403:
          toast.error("Access denied.");
          break;
        case 404:
          toast.error(displayMessage || "Resource not found.");
          break;
        case 500:
          toast.error("Server Error (500). Please try again later.");
          break;
        default:
          toast.error(displayMessage || `Error ${status}`);
      }
    } else if (error.request) {
      toast.error("Server is unreachable. Check your connection.");
    } else {
      toast.error(`Error: ${error.message}`);
    }

    return Promise.reject(error);
  },
);

export default api;
