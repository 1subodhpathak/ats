function ImprovementReason({ reason, issues = [] }) {
  return (
    <div className="space-y-3">
      {issues.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Issues found
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {issues.map((issue) => (
              <span
                key={issue}
                className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700"
              >
                {issue}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Why this is better
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{reason}</p>
      </div>
    </div>
  );
}

export default ImprovementReason;
