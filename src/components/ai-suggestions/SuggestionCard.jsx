import Card from "../common/Card";
import ApplySuggestionButton from "./ApplySuggestionButton";
import BeforeAfterComparison from "./BeforeAfterComparison";
import ImprovementReason from "./ImprovementReason";

function SuggestionCard({ suggestion, onApply, onDismiss }) {
  if (!suggestion?.data) {
    return null;
  }

  const data = suggestion.data;
  const improvedText = data.suggested_line || data.rewritten_line;

  return (
    <Card className="space-y-4 border-sky-100 bg-sky-50/60">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
            {data.type === "analysis" ? "AI line analysis" : "AI rewrite suggestion"}
          </p>
          <h4 className="mt-1 text-lg font-semibold text-slate-900">
            Suggested improvement
          </h4>
        </div>
        {typeof data.line_score === "number" ? (
          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-sky-700">
            Score {data.line_score}
          </span>
        ) : null}
      </div>
      <BeforeAfterComparison before={data.original_line} after={improvedText} />
      <ImprovementReason reason={data.reason} issues={data.issues || []} />
      <ApplySuggestionButton onApply={onApply} onDismiss={onDismiss} />
    </Card>
  );
}

export default SuggestionCard;
