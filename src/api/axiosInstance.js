import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Request interceptor — attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lumina_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url    = error.config?.url || "";

    // These routes return 401 for business-logic reasons (wrong password,
    // wrong TOTP code, etc.) — let the component handle the error & show a toast.
    // Only redirect to /login when it's a genuine session-expiry 401.
    const skipRedirect =
      url.includes("/security/") ||
      url.includes("/2fa/")      ||
      url.includes("/auth/");

    if (status === 401 && !skipRedirect) {
      localStorage.removeItem("lumina_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;