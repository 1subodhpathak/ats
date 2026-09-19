import apiClient from "../../services/apiClient";
import { getResume } from "../../services/resumeApi";
import { normalizeBasicReport } from "../builders/normalizeBasicReport";
import { BASIC_REPORT_SYSTEM_PROMPT, buildBasicReportUserPrompt } from "./basicReportPrompt";

const inFlight = new Map();
const memoryCache = new Map();
const cacheKey = (resumeId) => `careersense.basicReport.v1.${resumeId}`;
const repositoryKey = () =>
  `careersense.basicReport.repository.v1.${window.clerkUserId || window.Clerk?.user?.id || "default"}`;

function readCachedReport(resumeId) {
  if (memoryCache.has(String(resumeId))) {
    return memoryCache.get(String(resumeId));
  }

  try {
    const value = window.sessionStorage.getItem(cacheKey(resumeId))
      || window.localStorage.getItem(cacheKey(resumeId));
    const report = value ? JSON.parse(value) : null;
    if (report) memoryCache.set(String(resumeId), report);
    return report;
  } catch {
    return null;
  }
}

function cacheReport(resumeId, report) {
  memoryCache.set(String(resumeId), report);
  try {
    window.sessionStorage.setItem(cacheKey(resumeId), JSON.stringify(report));
    window.localStorage.setItem(cacheKey(resumeId), JSON.stringify(report));
  } catch {
    // The in-memory and server copies remain available when browser storage is full.
  }
}

function persistRepositoryReport(report) {
  try {
    const current = JSON.parse(window.localStorage.getItem(repositoryKey()) || "[]");
    const reports = Array.isArray(current) ? current : [];
    const next = [
      report,
      ...reports.filter(
        (item) => String(item.resume_id) !== String(report.resume_id)
      ),
    ];
    window.localStorage.setItem(repositoryKey(), JSON.stringify(next));
  } catch {
    throw new Error("CareerSense could not update the local repository index.");
  }
}

export function getSavedBasicReports() {
  try {
    const key = repositoryKey();
    let reports = [];
    const direct = window.localStorage.getItem(key);
    if (direct) {
      const parsed = JSON.parse(direct);
      if (Array.isArray(parsed)) reports = parsed;
    }
    
    // Also check default or local if empty
    if (!reports.length) {
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith("careersense.basicReport.repository.v1.")) {
          try {
            const list = JSON.parse(window.localStorage.getItem(k) || "[]");
            if (Array.isArray(list)) {
              reports = [...reports, ...list];
            }
          } catch (e) {}
        }
      }
    }
    
    // Deduplicate by resume_id
    const map = new Map();
    reports.forEach(r => {
      if (r && r.resume_id) map.set(String(r.resume_id), r);
    });
    return Array.from(map.values());
  } catch {
    return [];
  }
}

function parseContent(content) {
  const cleaned = String(content || "").replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  if (!cleaned) throw new Error("The analysis service returned an empty report.");
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("The analysis response was incomplete. Please run the Basic report again.");
  }
}

export async function generateBasicAnalysisReport({ resume_id, jd_text = "" }) {
  const key = `${resume_id}:${jd_text}`;
  if (inFlight.has(key)) return inFlight.get(key);

  const request = (async () => {
    const resumeResponse = await getResume(resume_id);
    const resume = resumeResponse.data;
    const aiResponse = await apiClient.post("/ai/chat-completion", {
      messages: [
        { role: "system", content: BASIC_REPORT_SYSTEM_PROMPT },
        { role: "user", content: buildBasicReportUserPrompt(resume.raw_text || "", jd_text) },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 6000,
    });
    const usage = aiResponse.data.usage || {};
    const raw = parseContent(aiResponse.data.choices?.[0]?.message?.content);
    const totalTokens = usage.total_tokens || (usage.prompt_tokens || 0) + (usage.completion_tokens || 0);
    const report = normalizeBasicReport(raw, {
      resumeId: resume_id,
      fileName: resume.file_name,
      candidateName: resume.candidate_name,
      jdText: jd_text,
    });
    report.total_tokens = totalTokens;
    report.tokensCost = totalTokens;
    report.careerPoints = totalTokens;
    report.model_name = "llama-3.3-70b-versatile";
    cacheReport(resume_id, report);
    persistRepositoryReport(report);
    await apiClient.post(`/resumes/${resume_id}/analyze`, report);
    return { data: report };
  })().finally(() => window.setTimeout(() => inFlight.delete(key), 5000));

  inFlight.set(key, request);
  return request;
}

export async function getBasicAnalysisReport(resumeId) {
  const cachedReport = readCachedReport(resumeId);
  if (cachedReport?.report_level === "basic" && cachedReport?.score_categories?.length) {
    return { data: normalizeBasicReport(cachedReport, { resumeId, jdText: cachedReport.jdText || "" }) };
  }

  const [analysisResponse, resumeResponse] = await Promise.all([
    apiClient.get(`/resumes/${resumeId}/analysis/latest`),
    getResume(resumeId),
  ]);
  const resume = resumeResponse.data;
  const storedAnalysis = analysisResponse?.data;
  const report = normalizeBasicReport(storedAnalysis || {}, {
    resumeId,
    fileName: resume.file_name,
    candidateName: resume.candidate_name,
    jdText: storedAnalysis?.jdText || "",
  });
  cacheReport(resumeId, report);
  return {
    data: report,
    resume,
  };
}

export async function saveBasicReportToRepository(report) {
  if (!report?.resume_id) {
    throw new Error("This Basic report is missing its resume identifier.");
  }

  const persistedReport = {
    ...report,
    report_level: "basic",
    saved_to_repository: true,
    saved_at: new Date().toISOString(),
  };

  await apiClient.post(`/resumes/${report.resume_id}/analyze`, persistedReport);

  const repositoryResponse = await apiClient.get("/all");
  const storedResumes = repositoryResponse.data?.storedResumes || [];
  const storedResume = storedResumes.find(
    (item) => String(item.resume_id || item.id) === String(report.resume_id)
  );

  if (!storedResume?.latestAnalysis) {
    throw new Error("The report could not be verified in your repository. Please try again.");
  }

  cacheReport(report.resume_id, persistedReport);
  persistRepositoryReport(persistedReport);
  return {
    data: {
      success: true,
      report_id: report.resume_id,
    },
  };
}
