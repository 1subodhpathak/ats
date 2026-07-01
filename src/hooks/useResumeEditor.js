import { useCallback, useEffect } from "react";

import useATSStore from "../store/useATSStore";
import useAutoSave from "./useAutoSave";
import { updateResumeLine } from "../services/resumeApi";
import useEditorStore from "../store/useEditorStore";
import useResumeStore from "../store/useResumeStore";

function useResumeEditor() {
  const resume = useResumeStore((state) => state.currentResume);
  const updateResumeLineLocally = useResumeStore((state) => state.updateResumeLineLocally);
  const applyServerLineUpdate = useResumeStore((state) => state.applyServerLineUpdate);
  const initializeFromResume = useEditorStore((state) => state.initializeFromResume);
  const setLineDirty = useEditorStore((state) => state.setLineDirty);
  const setLineSaving = useEditorStore((state) => state.setLineSaving);
  const setLineSaved = useEditorStore((state) => state.setLineSaved);
  const setLineError = useEditorStore((state) => state.setLineError);
  const lineStates = useEditorStore((state) => state.lineStates);
  const updateOverallScore = useATSStore((state) => state.updateOverallScore);

  useEffect(() => {
    if (resume) {
      initializeFromResume(resume);
    }
  }, [initializeFromResume, resume]);

  const persistLine = useCallback(
    async (lineId, text) => {
      if (!resume?.resume_id) {
        return;
      }

      setLineSaving(lineId);

      try {
        const response = await updateResumeLine(resume.resume_id, lineId, { text });
        applyServerLineUpdate(response.data);
        setLineSaved(lineId, response.data.text);

        if (typeof response.data.overall_score === "number") {
          updateOverallScore(response.data.overall_score);
        }
      } catch (error) {
        const message =
          error?.response?.data?.detail || "Unable to save this line right now.";
        setLineError(lineId, message);
      }
    },
    [
      applyServerLineUpdate,
      resume?.resume_id,
      setLineError,
      setLineSaved,
      setLineSaving,
      updateOverallScore,
    ]
  );

  const autosave = useAutoSave(persistLine, 700);

  const handleLineChange = useCallback(
    (lineId, text) => {
      updateResumeLineLocally(lineId, text);
      setLineDirty(lineId);
      autosave(lineId, text);
    },
    [autosave, setLineDirty, updateResumeLineLocally]
  );

  const applyLineText = useCallback(
    async (lineId, text) => {
      autosave.cancel();
      updateResumeLineLocally(lineId, text);
      setLineDirty(lineId);
      await persistLine(lineId, text);
    },
    [autosave, persistLine, setLineDirty, updateResumeLineLocally]
  );

  return {
    resume,
    lineStates,
    handleLineChange,
    applyLineText,
  };
}

export default useResumeEditor;
