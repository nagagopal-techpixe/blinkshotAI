import axiosInstance from "./axiosInstance.js";

export const get2FAStatus = async () => {
  const { data } = await axiosInstance.get("/2fa/status");
  return data;
};

export const setupTOTP = async () => {
  const { data } = await axiosInstance.post("/2fa/totp/setup");
  return data;
};

export const verifyAndEnableTOTP = async (token) => {
  const { data } = await axiosInstance.post("/2fa/totp/verify", { token });
  return data;
};

export const validateTOTP = async (userId, token) => {
  const { data } = await axiosInstance.post("/2fa/totp/validate", { userId, token });
  return data;
};

export const toggleMethod = async (method, enabled) => {
  const { data } = await axiosInstance.patch("/2fa/methods", { method, enabled });
  return data;
};

export const getRecoveryCodeStatus = async () => {
  const { data } = await axiosInstance.get("/2fa/recovery-codes");
  return data;
};

export const regenerateRecoveryCodes = async (token) => {
  const { data } = await axiosInstance.post("/2fa/recovery-codes/regenerate", { token });
  return data;
};

export const addTrustedDevice = async (location) => {
  const { data } = await axiosInstance.post("/2fa/trusted-devices", { location });
  return data;
};

export const revokeTrustedDevice = async (deviceId) => {
  const { data } = await axiosInstance.delete(`/2fa/trusted-devices/${deviceId}`);
  return data;
};

export const disable2FA = async (password) => {
  try {
    const { data } = await axiosInstance.delete("/2fa/disable", { data: { password } });
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error(err.response.data.message || "Incorrect password");
    }
    throw err;
  }
};

export const verify2FALogin = async (userId, token) => {
  try {
    const { data } = await axiosInstance.post("/2fa/login/verify", { userId, token });
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error(err.response.data.message || "Invalid code");
    }
    throw err;
  }
};