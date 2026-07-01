import apiClient from "./apiClient";

export const exportResumeAsDocx = (payload) =>
  apiClient.post("/export/docx", payload, {
    responseType: "blob",
  });

export const exportResumeAsPdf = (payload) =>
  apiClient.post("/export/pdf", payload, {
    responseType: "blob",
  });
