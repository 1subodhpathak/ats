import { useMemo } from "react";

import { getATSScore } from "../services/atsApi";
import useATSStore from "../store/useATSStore";
import useResumeStore from "../store/useResumeStore";

function useATSScore() {
  const resume = useResumeStore((state) => state.currentResume);
  const { result, status, error, setLoading, setResult, setError } = useATSStore();

  const fetchScore = async () => {
    if (!resume?.resume_id) {
      setError("Upload a resume before generating an ATS score.");
      return null;
    }

    setLoading();

    try {
      const response = await getATSScore({
        resume_id: resume.resume_id,
      });
      setResult(response.data);
      return response.data;
    } catch (requestError) {
      const message =
        requestError?.response?.data?.detail ||
        "Unable to generate ATS score right now.";
      setError(message);
      return null;
    }
  };

  return useMemo(
    () => ({
      resume,
      result,
      status,
      error,
      fetchScore,
    }),
    [error, result, resume, status]
  );
}

export default useATSScore;
