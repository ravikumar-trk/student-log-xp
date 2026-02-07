// axiosClient.ts
import axios from "axios";

// API Response type definition
export interface ApiResponse<T = unknown> {
  Errors: string[];
  Warnings: string[];
  Message: string;
  Result: T;
}

// In Vite-based projects use `import.meta.env` in the browser instead of `process.env`.
// Provide a small fallback to localhost for development.
const BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL ||
  (import.meta as any).env.VITE_API_URL ||
  (import.meta as any).env.REACT_APP_API_URL ||
  "http://localhost:5147/api";

const axiosClient = axios.create({
  baseURL: BASE_URL, // Your API endpoint (from Vite env)
  timeout: 150000, // 15 sec timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------
// REQUEST INTERCEPTOR
// -----------------------
axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  async (error) => {
    throw error;
  }
);

// -----------------------
// RESPONSE INTERCEPTOR
// -----------------------
axiosClient.interceptors.response.use(
  async (response) => {
    // Handle success responses (200, 201, 202)
    const status = response.status;

    switch (status) {
      case 200:
        // OK - Request successful, data returned
        console.log("Request successful (200 OK)");
        break;

      case 201:
        // Created - Resource created successfully
        console.log("Resource created successfully (201 Created)");
        break;

      case 202:
        // Accepted - Request accepted for processing
        console.log("Request accepted for processing (202 Accepted)");
        break;

      default:
        console.log(`Response received with status ${status}`);
    }

    return response;
  },

  async (error) => {
    let message = "Something went wrong!";
    const status = error?.response?.status;

    if (!error.response) {
      // Network errors
      message = "Network error — please check your connection!";
      throw new Error(message);
    }

    // Extract API response
    const apiResponse = error.response.data as ApiResponse;

    // Handle API errors from Errors array
    if (apiResponse?.Errors && apiResponse.Errors.length > 0) {
      message = apiResponse.Errors[0];
    } else if (apiResponse?.Message) {
      message = apiResponse.Message;
    }

    switch (status) {
      case 400:
        message = message || "Bad request!";
        break;

      case 401:
        message = "Unauthorized — please login again!";

        // Optional: auto logout / refresh token
        // localStorage.removeItem("authToken");
        // window.location.href = "/login";
        break;

      case 403:
        message = "Forbidden — you don't have access!";
        break;

      case 404:
        message = "Not found!";
        break;

      case 408:
        message = "Request timeout — please try again.";
        break;

      case 500:
        message = "Server error — try again later.";
        break;

      default:
        message = message || "Unexpected error!";
    }

    const apiError = new Error(message);
    (apiError as any).status = status;
    (apiError as any).data = error.response.data;
    throw apiError;
  }
);

export default axiosClient;
