import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";
import { getScoreToneClasses } from "../../utils/scoreUtils";

function JDMatchScore({ score = 0 }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">JD match score</p>
          <h3 className="mt-2 text-4xl font-semibold text-slate-950">{score}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getScoreToneClasses(score)}`}>
          Keyword fit
        </span>
      </div>
      <ProgressBar value={score} />
      <p className="text-sm leading-6 text-slate-600">
        This reflects how closely the current resume language overlaps with the job
        description’s important terms and focus areas.
      </p>
    </Card>
  );
}

export default JDMatchScore;
