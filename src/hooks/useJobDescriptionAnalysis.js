import { useMemo } from "react";

import { analyzeJobDescription } from "../services/atsApi";
import useATSStore from "../store/useATSStore";
import useResumeStore from "../store/useResumeStore";

function useJobDescriptionAnalysis() {
  const resume = useResumeStore((state) => state.currentResume);
  const {
    jobDescriptionInput,
    jobDescriptionResult,
    jobDescriptionStatus,
    jobDescriptionError,
    setJobDescriptionInput,
    setJobDescriptionLoading,
    setJobDescriptionResult,
    setJobDescriptionError,
  } = useATSStore();

  const submitJobDescription = async () => {
    if (!resume?.resume_id) {
      setJobDescriptionError("Upload a resume before running JD matching.");
      return null;
    }

    if (!jobDescriptionInput.trim()) {
      setJobDescriptionError("Paste a job description to analyze keyword alignment.");
      return null;
    }

    setJobDescriptionLoading();

    try {
      const response = await analyzeJobDescription({
        resume_id: resume.resume_id,
        job_description: jobDescriptionInput,
      });
      setJobDescriptionResult(response.data);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "Unable to analyze the job description right now.";
      setJobDescriptionError(message);
      return null;
    }
  };

  return useMemo(
    () => ({
      resume,
      jobDescriptionInput,
      jobDescriptionResult,
      jobDescriptionStatus,
      jobDescriptionError,
      setJobDescriptionInput,
      submitJobDescription,
    }),
    [
      jobDescriptionError,
      jobDescriptionInput,
      jobDescriptionResult,
      jobDescriptionStatus,
      resume,
      setJobDescriptionInput,
    ]
  );
}

export default useJobDescriptionAnalysis;
