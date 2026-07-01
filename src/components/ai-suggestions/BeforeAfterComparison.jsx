function BeforeAfterComparison({ before, after }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Before
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{before}</p>
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Suggested
        </p>
        <p className="mt-2 text-sm leading-6 text-emerald-900">{after}</p>
      </div>
    </div>
  );
}

export default BeforeAfterComparison;
