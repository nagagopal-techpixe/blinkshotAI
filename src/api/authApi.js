import axios from "axios";

// Base instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lumina_token"); // ✅ FIXED
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth helpers
export const saveAuth = (token, user) => {
  localStorage.setItem("lumina_token", token); //  FIXED
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("lumina_token");
  localStorage.removeItem("user");
};

export const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
};

// API calls
export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data; // { success, token, user }
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data; // { success, token, user }
};

export const sendOtp = async (mobile) => {
  const { data } = await api.post("/auth/send-otp", { mobile });
  return data; // { success, expiresInMinutes, resendAvailableIn }
};

export const verifyOtp = async (payload) => {
  // payload: { mobile, otp }
  const { data } = await api.post("/auth/verify-otp", payload);
  return data; // { success, token, user }
};

export const resendOtp = async (mobile) => {
  const { data } = await api.post("/auth/resend-otp", { mobile });
  return data;
};

export default api;