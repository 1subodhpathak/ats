import { Sparkles } from "lucide-react";

import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";
import { getScoreToneClasses } from "../../utils/scoreUtils";

function ATSScoreCard({ score = 0, summary = "" }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Overall ATS score</p>
          <h3 className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">
            {score}
          </h3>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${getScoreToneClasses(
            score
          )}`}
        >
          <Sparkles className="h-4 w-4" />
          Live analysis
        </span>
      </div>
      <ProgressBar value={score} />
      <p className="text-sm leading-6 text-slate-600">{summary}</p>
    </Card>
  );
}

export default ATSScoreCard;
