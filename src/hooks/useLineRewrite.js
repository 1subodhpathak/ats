import { useMemo } from "react";

import { analyzeLine, rewriteLine } from "../services/aiApi";
import useEditorStore from "../store/useEditorStore";
import useResumeStore from "../store/useResumeStore";

function useLineRewrite() {
  const resume = useResumeStore((state) => state.currentResume);
  const suggestions = useEditorStore((state) => state.suggestions);
  const setSuggestionLoading = useEditorStore((state) => state.setSuggestionLoading);
  const setSuggestionData = useEditorStore((state) => state.setSuggestionData);
  const setSuggestionError = useEditorStore((state) => state.setSuggestionError);
  const toggleSuggestionOpen = useEditorStore((state) => state.toggleSuggestionOpen);

  const runAnalysis = async (lineId, lineText) => {
    if (!resume?.resume_id) {
      return;
    }

    setSuggestionLoading(lineId, "analysis");
    try {
      const response = await analyzeLine({
        resume_id: resume.resume_id,
        line_id: lineId,
        line_text: lineText,
      });
      setSuggestionData(lineId, {
        type: "analysis",
        ...response.data,
      });
    } catch (error) {
      const message =
        error?.response?.data?.detail || "Unable to analyze this line right now.";
      setSuggestionError(lineId, message);
    }
  };

  const runRewrite = async (lineId, lineText) => {
    if (!resume?.resume_id) {
      return;
    }

    setSuggestionLoading(lineId, "rewrite");
    try {
      const response = await rewriteLine({
        resume_id: resume.resume_id,
        line_id: lineId,
        line_text: lineText,
      });
      setSuggestionData(lineId, {
        type: "rewrite",
        ...response.data,
      });
    } catch (error) {
      const message =
        error?.response?.data?.detail || "Unable to rewrite this line right now.";
      setSuggestionError(lineId, message);
    }
  };

  const runSectionAnalysis = async (items) => {
    for (const item of items) {
      await runAnalysis(item.line_id, item.text);
    }
  };

  return useMemo(
    () => ({
      suggestions,
      runAnalysis,
      runRewrite,
      runSectionAnalysis,
      toggleSuggestionOpen,
    }),
    [suggestions, toggleSuggestionOpen]
  );
}

export default useLineRewrite;
