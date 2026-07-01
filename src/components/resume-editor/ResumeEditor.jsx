import { useState } from "react";

import ResumePreview from "./ResumePreview";
import ResumeSection from "./ResumeSection";
import useResumeEditor from "../../hooks/useResumeEditor";
import useLineRewrite from "../../hooks/useLineRewrite";
import Card from "../common/Card";
import useResumeStore from "../../store/useResumeStore";
import EditorInsightsPanel from "./EditorInsightsPanel";
import useATSScore from "../../hooks/useATSScore";
import useATSStore from "../../store/useATSStore";

const improvementActionVerbPattern = /\b(achieved|analyzed|automated|built|coordinated|created|delivered|designed|developed|drove|implemented|improved|increased|involved|led|managed|optimized|performed|reduced|resolved|streamlined|supported|transformed)\b/i;
const improvementStaticPattern = /\b(address|phone|cell|mobile|email|e-mail|linkedin|github|portfolio|bachelor|master|university|college|school|education|gpa|phoenix|stephenville|texas|usa|az|nj|relocation|full time|part time|hybrid|remote|onsite)\b/i;
const improvementHeadingPattern = /^(profile summary|professional summary|summary|objective|experience|professional experience|work experience|education|skills|technical skills|certifications|projects|area of expertise)$/i;

function isImprovementCandidate(item) {
  const text = (item.text || "").trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const commaCount = (text.match(/,/g) || []).length;

  if (!text || improvementHeadingPattern.test(text) || improvementStaticPattern.test(text)) {
    return false;
  }

  if (/^\d{1,3}$/.test(text) || /^[•*\-–—▪◦●·]$/.test(text)) {
    return false;
  }

  if (wordCount < 6 || text.length < 35) {
    return false;
  }

  if (text.includes("|") && wordCount < 10) {
    return false;
  }

  if (commaCount >= 3 && !improvementActionVerbPattern.test(text)) {
    return false;
  }

  return true;
}

function scoreImprovementPriority(item) {
  const text = item.text || "";
  const lower = text.toLowerCase();
  let priority = 0;

  if (item.score < 75) priority += 25;
  if (!/\d|%|\$/.test(text)) priority += 18;
  if (!improvementActionVerbPattern.test(text.split(/\s+/).slice(0, 3).join(" "))) priority += 16;
  if (/\b(worked on|responsible for|involved in|helped|handled|perform|fixing)\b/i.test(lower)) priority += 14;
  if (text.length > 170) priority += 10;
  if (text.split(/\s+/).length < 10) priority += 8;

  return priority;
}

function getTopImprovementLineIds(resume, limit = 25) {
  return new Set(
    (resume?.sections || [])
      .filter((section) => !/\b(contact|personal|address|education|academic|certification|certifications)\b/i.test(`${section.section_id || ""} ${section.section_name || ""}`))
      .flatMap((section) => section.items)
      .filter(isImprovementCandidate)
      .map((item) => ({ item, priority: scoreImprovementPriority(item) }))
      .filter(({ priority }) => priority > 0)
      .sort((a, b) => b.priority - a.priority || a.item.score - b.item.score)
      .slice(0, limit)
      .map(({ item }) => item.line_id)
  );
}

function ResumeEditor() {
  const [highlightedLineId, setHighlightedLineId] = useState(null);
  const { resume, lineStates, handleLineChange, applyLineText } = useResumeEditor();
  const { suggestions, runAnalysis, runRewrite, runSectionAnalysis, toggleSuggestionOpen } = useLineRewrite();
  const previewVersion = useResumeStore((state) => state.previewVersion);
  const { result: atsResult, status, fetchScore } = useATSScore();
  const jdResult = useATSStore((state) => state.jobDescriptionResult);

  const handleApplySuggestion = async (lineId, data) => {
    const nextText = data?.suggested_line || data?.rewritten_line;
    if (!nextText) {
      return;
    }
    await applyLineText(lineId, nextText);
    toggleSuggestionOpen(lineId, false);
    handleSelectSuggestionLine(lineId);
  };

  const handleSelectSuggestionLine = (lineId) => {
    if (!lineId) {
      return;
    }
    setHighlightedLineId(lineId);
    window.setTimeout(() => setHighlightedLineId(null), 4000);
  };

  if (!resume) {
    return (
      <Card>
        <p className="text-sm text-slate-600">
          No resume is loaded yet. Upload a resume first to start editing.
        </p>
      </Card>
    );
  }

  const improvementLineIds = getTopImprovementLineIds(resume);
  if (highlightedLineId) {
    improvementLineIds.add(highlightedLineId);
  }
  const improvementCount = improvementLineIds.size;

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(580px,680px)] 2xl:grid-cols-[minmax(0,1fr)_720px]">
      <div className="min-w-0 space-y-4">
        <EditorInsightsPanel
          resume={resume}
          atsResult={atsResult}
          jdResult={jdResult}
          onRefreshScore={fetchScore}
          onSelectLine={handleSelectSuggestionLine}
          loading={status === "loading"}
        />
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0a66c2]">
            Live Editor
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold text-slate-950">
            {resume.file_name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Showing the {improvementCount} highest-impact improvement areas. Address, education,
            headings, and contact details are intentionally excluded.
          </p>
        </div>
        {improvementCount > 0 ? (
          resume.sections.map((section) => (
            <ResumeSection
              key={section.section_id}
              section={section}
              allowedLineIds={improvementLineIds}
              lineStates={lineStates}
              suggestions={suggestions}
              onLineChange={handleLineChange}
              onLineFocus={(lineId) => setHighlightedLineId(lineId)}
              onAnalyze={runAnalysis}
              onRewrite={runRewrite}
              onReviewSection={runSectionAnalysis}
              onApplySuggestion={handleApplySuggestion}
              onDismissSuggestion={(lineId) => toggleSuggestionOpen(lineId, false)}
              highlightedLineId={highlightedLineId}
            />
          ))
        ) : (
          <Card>
            <p className="text-sm text-slate-600">
              No high-impact editable improvement areas were detected. The remaining content is
              mostly static resume information such as contact, headings, or education.
            </p>
          </Card>
        )}
      </div>
      <div className="min-w-0 xl:sticky xl:top-[70px] xl:h-fit">
        <ResumePreview
          resume={resume}
          previewVersion={previewVersion}
          highlightedLineId={highlightedLineId}
        />
      </div>
    </div>
  );
}

export default ResumeEditor;
