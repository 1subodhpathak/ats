import Button from "../common/Button";
import Card from "../common/Card";

function JobDescriptionInput({
  value,
  onChange,
  onSubmit,
  loading = false,
}) {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Job description match</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Paste a target role description to compare its keywords against the current
          resume and see where to strengthen alignment.
        </p>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={8}
        placeholder="Paste the full job description here..."
        className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
      />
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? "Analyzing JD..." : "Analyze job description"}
      </Button>
    </Card>
  );
}

export default JobDescriptionInput;
