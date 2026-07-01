import { useMemo } from "react";

import { exportResumeAsDocx, exportResumeAsPdf } from "../services/exportApi";
import useEditorStore from "../store/useEditorStore";
import useResumeStore from "../store/useResumeStore";

function parseFilenameFromDisposition(disposition, fallback) {
  if (!disposition) {
    return fallback;
  }

  const match = disposition.match(/filename="?(.*?)"?$/i);
  return match?.[1] || fallback;
}

function triggerDownload(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

function useDownloadResume() {
  const resume = useResumeStore((state) => state.currentResume);
  const exportStatus = useEditorStore((state) => state.exportStatus);
  const setExportLoading = useEditorStore((state) => state.setExportLoading);
  const setExportSuccess = useEditorStore((state) => state.setExportSuccess);
  const setExportError = useEditorStore((state) => state.setExportError);
  const setExportFormat = useEditorStore((state) => state.setExportFormat);

  const downloadResume = async (formatOverride) => {
    if (!resume?.resume_id) {
      setExportError("Upload a resume before exporting.");
      return;
    }

    const format = formatOverride || exportStatus.format || "docx";
    setExportFormat(format);
    setExportLoading(format);

    try {
      const response =
        format === "pdf"
          ? await exportResumeAsPdf({ resume_id: resume.resume_id, template: "ats_clean" })
          : await exportResumeAsDocx({ resume_id: resume.resume_id, template: "ats_clean" });

      const fallbackName =
        format === "pdf" ? "resume_export.pdf" : "resume_export.docx";
      const fileName = parseFilenameFromDisposition(
        response.headers["content-disposition"],
        fallbackName
      );
      triggerDownload(response.data, fileName);
      setExportSuccess(format);
    } catch (error) {
      const message =
        error?.response?.data?.detail || "Unable to export the resume right now.";
      setExportError(message);
    }
  };

  return useMemo(
    () => ({
      resume,
      exportStatus,
      setExportFormat,
      downloadResume,
    }),
    [downloadResume, exportStatus, resume, setExportFormat]
  );
}

export default useDownloadResume;
