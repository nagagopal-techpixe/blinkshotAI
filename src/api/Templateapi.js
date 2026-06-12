// src/api/templateApi.js
import axiosInstance from "./axiosInstance";
export const renderTemplate = (templateId, json) =>
  axiosInstance.post(`/templates/${templateId}/render`, { json }, { timeout: 300000 });
export const createTemplate    = ()                        => axiosInstance.post("/templates");
export const getMyTemplates    = ()                        => axiosInstance.get("/templates");
export const getTemplateById   = (templateId)              => axiosInstance.get(`/templates/${templateId}`);
export const updateTemplate    = (templateId, data)        => axiosInstance.put(`/templates/${templateId}`, data);
export const deleteTemplate    = (templateId)              => axiosInstance.delete(`/templates/${templateId}`);
export const getGlobalTemplates = (params) => axiosInstance.get("/templates/global", { params });
export const createFromGlobal   = (globalTemplateId) => axiosInstance.post(`/templates/from-global/${globalTemplateId}`);