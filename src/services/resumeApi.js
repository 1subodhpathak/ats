import apiClient from "./apiClient";
import { extractTextFromPDF, extractTextFromDocx, buildResumeStructure } from "../utils/resumeParser";

export const getResumes = async () => {
  const response = await apiClient.get("/all");
  return { data: response.data.storedResumes || [] };
};

export const uploadResume = async (formData) => {
  const file = formData.get("file");
  if (!file) throw new Error("No file selected");

  // 1. Upload original file to AWS S3
  const s3Response = await apiClient.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  const { file_name, s3Url } = s3Response.data;

  // 2. Parse text on frontend
  let text = "";
  if (file.name.endsWith(".pdf")) {
    text = await extractTextFromPDF(file);
  } else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
    text = await extractTextFromDocx(file);
  } else {
    text = await file.text();
  }

  // 3. Build layout/sections structures
  const resumeId = "res_" + Date.now();
  const structuredResume = buildResumeStructure(resumeId, file_name, text);
  structuredResume.s3Url = s3Url;

  // 4. Save to Express/MongoDB backend
  const saveResponse = await apiClient.post("/resumes", structuredResume);
  return { data: saveResponse.data };
};

export const getResume = (resumeId) => apiClient.get(`/resumes/${resumeId}`);

export const updateResumeLine = (resumeId, lineId, payload) =>
  apiClient.patch(`/resumes/${resumeId}/line/${lineId}`, payload);

export const getResumeLayout = async (resumeId) => {
  const resumeResponse = await getResume(resumeId);
  const resume = resumeResponse.data;
  
  const textBlocks = [];
  let blockIdCounter = 1;
  
  (resume.sections || []).forEach(sec => {
    // Add section title block
    textBlocks.push({
      block_id: `block_sec_${blockIdCounter++}`,
      section_name: sec.section_name,
      text: sec.section_name,
      original_text: sec.section_name,
      is_editable: false,
      font_size: 16,
      font_family: "Arial",
      x: 50,
      y: blockIdCounter * 30,
      width: 500,
      height: 25,
      score: 100
    });
    
    sec.items.forEach(item => {
      textBlocks.push({
        block_id: item.line_id,
        section_name: sec.section_name,
        text: item.text,
        original_text: item.original_text,
        is_editable: true,
        font_size: 11,
        font_family: "Arial",
        x: 50,
        y: blockIdCounter * 30,
        width: 500,
        height: 20,
        score: item.score
      });
    });
  });

  return {
    data: {
      pages: [
        {
          page_number: 1,
          width: 612,
          height: 792,
          text_blocks: textBlocks
        }
      ]
    }
  };
};

export const getResumeVersions = (resumeId) =>
  apiClient.get(`/resumes/${resumeId}/versions`);

export const restoreResumeVersion = (resumeId, payload) =>
  apiClient.post(`/resumes/${resumeId}/restore-version`, payload);

export const getResumeSourceUrl = (resumeId) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/careersense/ats";
  return `${baseUrl}/resumes/${resumeId}/source`;
};

export const getResumePdfPreviewUrl = (resumeId) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/careersense/ats";
  return `${baseUrl}/resumes/${resumeId}/pdf`;
};

export const getResumeOriginalPreviewUrl = (resumeId) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/careersense/ats";
  return `${baseUrl}/resumes/${resumeId}/preview/original`;
};
