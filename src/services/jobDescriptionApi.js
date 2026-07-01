import apiClient from "./apiClient";
import { extractTextFromPDF, extractTextFromDocx } from "../utils/resumeParser";

export const getJobDescriptions = () => apiClient.get("/job-descriptions");

export const getJobDescription = async (jobDescriptionId) => {
  const response = await getJobDescriptions();
  const jd = response.data.find(j => j.id === jobDescriptionId);
  return { data: jd };
};

export const uploadJobDescriptionFile = async (formData) => {
  const file = formData.get("file");
  if (!file) throw new Error("No file selected.");

  let text = "";
  if (file.name.endsWith(".pdf")) {
    text = await extractTextFromPDF(file);
  } else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
    text = await extractTextFromDocx(file);
  } else {
    text = await file.text();
  }

  const payload = {
    id: "jd_" + Date.now(),
    name: file.name,
    text: text
  };

  await apiClient.post("/job-descriptions", payload);
  return {
    data: {
      job_description_id: payload.id,
      file_name: file.name,
      raw_text: text
    }
  };
};

