import { useEffect, useMemo, useState } from "react";

import Card from "../common/Card";
import { getResumeOriginalPreviewUrl } from "../../services/resumeApi";
import InteractiveOverlayEditor from "./InteractiveOverlayEditor";
import Ats from "./Ats";

function getExtension(fileName = "") {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() : "";
}

function ResumePreview({ resume, previewVersion, highlightedLineId }) {
  const [mode, setMode] = useState("editor");
  const extension = getExtension(resume?.file_name);

  useEffect(() => {
    if (highlightedLineId) {
      setMode("editor");
    }
  }, [highlightedLineId]);

  const originalSourceUrl = useMemo(() => {
    if (!resume?.resume_id) {
      return "";
    }
    return getResumeOriginalPreviewUrl(resume.resume_id, String(previewVersion || ""));
  }, [previewVersion, resume?.resume_id]);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2.5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">A4 Document View</h3>
          <p className="text-xs text-slate-500">{extension.toUpperCase()} workspace</p>
        </div>
        <div className="flex rounded-md bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("editor")}
            className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
              mode === "editor"
                ? "bg-[#0a66c2] text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Visual Editor
          </button>
          <button
            type="button"
            onClick={() => setMode("ats")}
            className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
              mode === "ats"
                ? "bg-[#0a66c2] text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ATS Resume
          </button>
          <button
            type="button"
            onClick={() => setMode("original")}
            className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
              mode === "original"
                ? "bg-[#0a66c2] text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Original
          </button>
        </div>
      </div>
      
      {mode === "editor" ? (
        <div className="h-[calc(100vh-150px)] max-h-[820px] min-h-[620px] overflow-auto">
          <InteractiveOverlayEditor
            resumeId={resume?.resume_id}
            highlightedLineId={highlightedLineId}
          />
        </div>
      ) : mode === "ats" ? (
        <div className="h-[calc(100vh-150px)] max-h-[820px] min-h-[620px] overflow-auto">
          <Ats resume={resume} />
        </div>
      ) : (
        <div className="flex justify-center overflow-auto bg-slate-200 px-3 py-4">
          <iframe
            key={originalSourceUrl}
            src={originalSourceUrl}
            title="Original uploaded resume"
            className="aspect-[210/297] h-[calc(100vh-150px)] max-h-[820px] min-h-[620px] w-full max-w-[640px] rounded-sm bg-white shadow-md"
          />
        </div>
      )}
    </Card>
  );
}

export default ResumePreview;
