import apiClient from "./apiClient";
import { evaluateFiftyPointAnalysis } from "./groqAIService";
import { buildAdvancedReport } from "./atsReportBuilder";
import { extractTextFromPDF, buildResumeStructure } from "../utils/resumeParser";
import { getResumeFileBlob } from "./resumeApi";

// Helper to dynamically build category scores from raw analysis points
const buildCategoryScores = (points) => {
  if (!points || !Array.isArray(points)) return [];
  
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

const inFlightAnalysisRequests = new Map();

export const generateAnalysisReport = async (payload) => {
  const dedupKey = `${payload.resume_id}_${payload.jd_text || ''}`;
  if (inFlightAnalysisRequests.has(dedupKey)) {
    return inFlightAnalysisRequests.get(dedupKey);
  }

  const analysisPromise = (async () => {
    try {
      const resumeResponse = await apiClient.get(`/resumes/${payload.resume_id}`);
      let resumeText = resumeResponse.data.raw_text || "";
      const fileName = resumeResponse.data.file_name || "Resume.pdf";

      const newlineCount = (resumeText.match(/\n/g) || []).length;
      const isFlattened = resumeText.trim() && newlineCount < 3;
      if (isFlattened && resumeResponse.data.s3Url) {
        try {
          console.log("Auto-healing old flattened resume document layout...");
          const fileBlob = await getResumeFileBlob(payload.resume_id);
          const file = new File([fileBlob], fileName, { type: "application/pdf" });
          const parsedText = await extractTextFromPDF(file);
          if (parsedText && parsedText.trim()) {
            resumeText = parsedText;
            const structuredResume = buildResumeStructure(payload.resume_id, fileName, parsedText);
            structuredResume.s3Url = resumeResponse.data.s3Url;
            structuredResume.candidate_name = resumeResponse.data.candidate_name;
            await apiClient.post("/resumes", structuredResume);
            console.log("Resume document successfully healed in database!");
          }
        } catch (e) {
          console.error("Auto-healing failed, falling back to original stored raw_text:", e);
        }
      }
      
      const analysisReport = await evaluateFiftyPointAnalysis(resumeText, payload.jd_text);
      analysisReport.jdText = payload.jd_text;

      // Pass actual Claude token count to backend for exact token ledger deduction
      if (analysisReport.total_tokens) {
        analysisReport.careerPoints = analysisReport.total_tokens;
        analysisReport.tokensCost = analysisReport.total_tokens;
      }

      // Compile full advanced report fields locally in the client
      const advancedReport = buildAdvancedReport(analysisReport, resumeText, fileName);

      // Align the main overall_score with the mathematically calculated readiness score
      analysisReport.overall_score = advancedReport.visual_summary.overall_score;

      // Save the raw report to database
      await apiClient.post(`/resumes/${payload.resume_id}/analyze`, analysisReport);
      
      const resume = resumeResponse.data;
      const categoryScores = buildCategoryScores(analysisReport.analysis_points);

      return {
        data: {
          ...advancedReport,
          report_id: payload.resume_id,
          resume_id: payload.resume_id,
          resume_file_name: resume.file_name,
          candidate_name: resume.candidate_name || advancedReport.candidate_name,
          created_at: new Date(),
          overall_score: analysisReport.overall_score,
          has_job_description: !!payload.jd_text,
          report_type: payload.jd_text ? "resume_jd" : "resume",
          category_scores: categoryScores,
        }
      };
    } finally {
      setTimeout(() => inFlightAnalysisRequests.delete(dedupKey), 5000);
    }
  })();

  inFlightAnalysisRequests.set(dedupKey, analysisPromise);
  return analysisPromise;
};


export const getAnalysisReport = async (resumeId) => {
  const response = await apiClient.get(`/resumes/${resumeId}/analysis/latest`);
  const resumeResponse = await apiClient.get(`/resumes/${resumeId}`);
  const resume = resumeResponse.data;
  
  const categoryScores = buildCategoryScores(response.data.analysis_points);
  
  // Re-build advanced report fields on-the-fly for compatibility
  const advancedReport = buildAdvancedReport(response.data, resume.raw_text, resume.file_name);

  return {
    data: {
      ...advancedReport,
      report_id: resume.resume_id,
      resume_id: resume.resume_id,
      resume_file_name: resume.file_name,
      candidate_name: resume.candidate_name || advancedReport.candidate_name,
      created_at: resume.latestAnalysis?.createdAt || resume.updatedAt,
      overall_score: resume.latestAnalysis?.overall_score || resume.current_score,
      has_job_description: !!resume.latestAnalysis?.jdText,
      report_type: resume.latestAnalysis?.jdText ? "resume_jd" : "resume",
      category_scores: categoryScores,
    }
  };
};

export const saveAnalysisReport = async (analysisId) => {
  // Auto-saved during generate, return success
  return { data: { success: true } };
};

export const getSavedReports = async () => {
  try {
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
          category_scores: categoryScores,
          tokens_cost: resume.latestAnalysis.tokensCost || resume.latestAnalysis.careerPoints || resume.latestAnalysis.total_tokens || 0,
          careerPoints: resume.latestAnalysis.careerPoints || resume.latestAnalysis.tokensCost || resume.latestAnalysis.total_tokens || 0,
          total_tokens: resume.latestAnalysis.total_tokens || resume.latestAnalysis.tokensCost || resume.latestAnalysis.careerPoints || 0
        };
      });

    return { data: reports };
  } catch (err) {
    console.error("[getSavedReports Error]", err);
    return { data: [] };
  }
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
