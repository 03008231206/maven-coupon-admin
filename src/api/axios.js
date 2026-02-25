import axios from "axios";
import { getAccessToken, clearAuth } from "../auth/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Request interceptor: token attach karega
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: token invalid ho to logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearAuth();
      // optional redirect
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
