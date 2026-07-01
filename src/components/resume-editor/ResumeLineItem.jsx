import { useEffect, useRef } from "react";

import EditableTextBlock from "./EditableTextBlock";
import LiveScoreBadge from "./LiveScoreBadge";
import LineAnalysisPanel from "../ai-suggestions/LineAnalysisPanel";
import RewriteWithAIButton from "../ai-suggestions/RewriteWithAIButton";

function ResumeLineItem({
  item,
  lineState,
  suggestion,
  onChange,
  onFocus,
  onAnalyze,
  onRewrite,
  onApplySuggestion,
  onDismissSuggestion,
  aiEnabled = true,
  highlighted = false,
}) {
  const itemRef = useRef(null);
  const loadingMode = suggestion?.loadingMode;

  useEffect(() => {
    if (highlighted) {
      itemRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlighted]);

  return (
    <div
      ref={itemRef}
      data-line-id={item.line_id}
      className={[
        "space-y-3 rounded-lg border p-3 transition-all duration-300",
        highlighted
          ? "border-[#0a66c2] bg-blue-50 shadow-[0_0_0_4px_rgba(10,102,194,0.14)]"
          : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Resume line
        </p>
        {aiEnabled ? (
          <LiveScoreBadge score={item.score} status={lineState?.status || "idle"} />
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            Not analyzed
          </span>
        )}
      </div>
      <EditableTextBlock 
        value={item.text} 
        onChange={(text) => onChange(item.line_id, text)} 
        onFocus={() => onFocus && onFocus(item.line_id)}
      />
      {aiEnabled ? (
        <div className="flex flex-wrap gap-3">
          <RewriteWithAIButton
            onClick={() => onAnalyze(item.line_id, item.text)}
            loading={loadingMode === "analysis"}
          >
            Analyze line
          </RewriteWithAIButton>
          <RewriteWithAIButton
            onClick={() => onRewrite(item.line_id, item.text)}
            loading={loadingMode === "rewrite"}
          />
        </div>
      ) : null}
      {lineState?.error ? (
        <p className="text-sm text-rose-600">{lineState.error}</p>
      ) : null}
      {aiEnabled ? (
        <LineAnalysisPanel
          suggestion={suggestion}
          onApply={() => onApplySuggestion(item.line_id, suggestion?.data)}
          onDismiss={() => onDismissSuggestion(item.line_id)}
        />
      ) : null}
    </div>
  );
}

export default ResumeLineItem;
