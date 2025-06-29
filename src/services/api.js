import axios from "axios";

import { logout } from "./auth";

const API_BASE_URL = "https://stocksystem-464322.rj.r.appspot.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  const isTokenExpired = error.response?.status === 401 && error.response?.data?.message?.toLowerCase().includes("token expirado.");

  if (isTokenExpired) {
    logout();
    window.location.href = "/login";
  }

  return Promise.reject(error);
});

export default api;