import apiClient from "./apiClient";
import { evaluateFiftyPointAnalysis } from "./groqAIService";

export const generateAnalysisReport = async (payload) => {
  const resumeResponse = await apiClient.get(`/resumes/${payload.resume_id}`);
  const resumeText = resumeResponse.data.raw_text;
  
  const analysisReport = await evaluateFiftyPointAnalysis(resumeText, payload.jd_text);
  analysisReport.jdText = payload.jd_text;

  const response = await apiClient.post(`/resumes/${payload.resume_id}/analyze`, analysisReport);
  return { data: response.data };
};

export const getAnalysisReport = async (resumeId) => {
  const response = await apiClient.get(`/resumes/${resumeId}/analysis/latest`);
  return { data: response.data };
};

export const saveAnalysisReport = async (analysisId) => {
  // Auto-saved during generate, return success
  return { data: { success: true } };
};

export const getSavedReports = async () => {
  const response = await apiClient.get("/all");
  const resumes = response.data.storedResumes || [];
  return { data: resumes };
};

export const getSavedReport = getAnalysisReport;

export const getAnalysisReportPreviewPages = async () => {
  return { data: { pages: [] } };
};

export const getSavedReportPreviewPages = getAnalysisReportPreviewPages;

export const getAnalysisReportPdfUrl = (resumeId) => {
  const token = window.clerkGetToken ? "placeholder" : ""; // Dynamic token query param resolved in layout
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/careersense/ats";
  return `${baseUrl}/resumes/${resumeId}/pdf`;
};

export const getSavedReportPdfUrl = getAnalysisReportPdfUrl;

