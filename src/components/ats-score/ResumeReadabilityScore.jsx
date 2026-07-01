import Card from "../common/Card";

function ResumeReadabilityScore({ score = 0 }) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">ATS readability</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{score}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        This score reflects how easy the resume is for parsers and recruiters to scan,
        including sentence length, structure, and line cleanliness.
      </p>
    </Card>
  );
}

export default ResumeReadabilityScore;
