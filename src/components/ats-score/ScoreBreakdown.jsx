import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";

const labels = {
  keyword_match: "Keyword Match",
  role_relevance: "Role Relevance",
  clarity: "Experience Clarity",
  impact: "Impact and Metrics",
  action_verbs: "Action Verbs",
  formatting: "Formatting",
  grammar: "Grammar",
  ats_readability: "ATS Readability",
  section_completeness: "Section Completeness",
};

function ScoreBreakdown({ breakdown }) {
  if (!breakdown) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold text-slate-900">Score breakdown</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key} className="space-y-2 rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-700">{labels[key] || key}</span>
              <span className="text-sm font-semibold text-slate-900">{value}</span>
            </div>
            <ProgressBar value={value} />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ScoreBreakdown;
