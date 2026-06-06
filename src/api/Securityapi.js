import axiosInstance from "./axiosInstance.js";

// Add a timestamp to every GET to prevent 304 cached responses
const bust = () => `_=${Date.now()}`;

export const updatePassword = (data) =>
  axiosInstance.put("/security/password", data);

export const getPreferences = () =>
  axiosInstance.get(`/security/preferences?${bust()}`);

export const updatePreferences = (data) =>
  axiosInstance.put("/security/preferences", data);

export const getSessions = () =>
  axiosInstance.get(`/security/sessions?${bust()}`);

export const revokeSession = (sessionId) =>
  axiosInstance.delete(`/security/sessions/${sessionId}`);

export const revokeAllSessions = () =>
  axiosInstance.delete("/security/sessions");

export const getActivity = (limit = 20) =>
  axiosInstance.get(`/security/activity?limit=${limit}&${bust()}`);