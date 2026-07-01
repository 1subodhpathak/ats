function SectionToolbar({ itemCount = 0, onReviewSection, reviewing = false, aiEnabled = true }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-100 px-3 py-2">
      <span className="text-sm font-medium text-slate-700">
        {itemCount} editable lines
      </span>
      <div className="flex items-center gap-3">
        {aiEnabled ? (
          <button
            type="button"
            onClick={onReviewSection}
            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            {reviewing ? "AI Reviewing..." : "AI Review Section"}
          </button>
        ) : (
          <span className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
            Static section
          </span>
        )}
        <span className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
          Autosave on
        </span>
      </div>
    </div>
  );
}

export default SectionToolbar;
