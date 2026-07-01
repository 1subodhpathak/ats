function LiveScoreBadge({ score = 0, status = "idle" }) {
  const tone =
    status === "error"
      ? "bg-rose-100 text-rose-700"
      : status === "saving"
      ? "bg-amber-100 text-amber-700"
      : status === "saved"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-slate-100 text-slate-700";

  const label =
    status === "error"
      ? "Save error"
      : status === "saving"
      ? "Saving..."
      : status === "saved"
      ? "Saved"
      : status === "dirty"
      ? "Unsaved"
      : "Idle";

  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800">
        Line score {score}
      </span>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
        {label}
      </span>
    </div>
  );
}

export default LiveScoreBadge;
