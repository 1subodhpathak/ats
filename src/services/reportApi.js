import apiClient from "./apiClient";
import { evaluateFiftyPointAnalysis } from "./groqAIService";

// Helper to dynamically build category scores from raw analysis points
const buildCategoryScores = (points) => {
  if (!points || !points.length) return [];
  
  const groups = {};
  points.forEach(point => {
    const cat = point.category || "General";
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(point);
  });

  return Object.entries(groups).map(([catName, catPoints]) => {
    const passed = catPoints.filter(p => p.current_status === "Passed").length;
    const needs = catPoints.filter(p => p.current_status === "Needs Improvement").length;
    const critical = catPoints.filter(p => p.current_status === "Critical Fix").length;
    const totalScore = catPoints.reduce((sum, p) => sum + (p.score || 0), 0);
    const avgScore = catPoints.length ? Math.round(totalScore / catPoints.length) : 0;

    return {
      category: catName,
      score: avgScore,
      passed_points: passed,
      needs_improvement_points: needs,
      critical_fix_points: critical
    };
  });
};

export const generateAnalysisReport = async (payload) => {
  const resumeResponse = await apiClient.get(`/resumes/${payload.resume_id}`);
  const resumeText = resumeResponse.data.raw_text;
  
  const analysisReport = await evaluateFiftyPointAnalysis(resumeText, payload.jd_text);
  analysisReport.jdText = payload.jd_text;

  const response = await apiClient.post(`/resumes/${payload.resume_id}/analyze`, analysisReport);
  const resume = resumeResponse.data;
  const categoryScores = buildCategoryScores(analysisReport.analysis_points);

  return {
    data: {
      report_id: payload.resume_id,
      resume_id: payload.resume_id,
      resume_file_name: resume.file_name,
      candidate_name: resume.candidate_name,
      created_at: new Date(),
      overall_score: analysisReport.overall_score,
      has_job_description: !!payload.jd_text,
      report_type: payload.jd_text ? "resume_jd" : "resume",
      category_scores: categoryScores,
      ...analysisReport
    }
  };
};

export const getAnalysisReport = async (resumeId) => {
  const response = await apiClient.get(`/resumes/${resumeId}/analysis/latest`);
  const resumeResponse = await apiClient.get(`/resumes/${resumeId}`);
  const resume = resumeResponse.data;
  
  const categoryScores = buildCategoryScores(response.data.analysis_points);

  return {
    data: {
      report_id: resume.resume_id,
      resume_id: resume.resume_id,
      resume_file_name: resume.file_name,
      candidate_name: resume.candidate_name,
      created_at: resume.latestAnalysis?.createdAt || resume.updatedAt,
      overall_score: resume.latestAnalysis?.overall_score || resume.current_score,
      has_job_description: !!resume.latestAnalysis?.jdText,
      report_type: resume.latestAnalysis?.jdText ? "resume_jd" : "resume",
      category_scores: categoryScores,
      ...response.data
    }
  };
};

export const saveAnalysisReport = async (analysisId) => {
  // Auto-saved during generate, return success
  return { data: { success: true } };
};

export const getSavedReports = async () => {
  const response = await apiClient.get("/all");
  const resumes = response.data.storedResumes || [];
  
  const reports = resumes
    .filter((r) => r.latestAnalysis && r.latestAnalysis.overall_score)
    .map((resume) => {
      const categoryScores = buildCategoryScores(resume.latestAnalysis?.analysis_points);
      return {
        report_id: resume.resume_id,
        resume_id: resume.resume_id,
        resume_file_name: resume.file_name,
        candidate_name: resume.candidate_name,
        created_at: resume.latestAnalysis.createdAt || resume.updatedAt,
        overall_score: resume.latestAnalysis.overall_score || resume.current_score,
        has_job_description: !!resume.latestAnalysis.jdText,
        report_type: resume.latestAnalysis.jdText ? "resume_jd" : "resume",
        category_scores: categoryScores
      };
    });

  return { data: reports };
};

export const getSavedReport = getAnalysisReport;

export const getAnalysisReportPreviewPages = async () => {
  return { data: { pages: [] } };
};

export const getSavedReportPreviewPages = getAnalysisReportPreviewPages;

export const getAnalysisReportPdfUrl = (resumeId) => {
  return `${window.location.origin}/reports/analysis/${resumeId}?printMode=1&autoPrint=1`;
};

export const getSavedReportPdfUrl = getAnalysisReportPdfUrl;
