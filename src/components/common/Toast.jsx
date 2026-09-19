function Toast({ message = "", variant = "info", compact = false }) {
  if (!message) {
    return null;
  }

  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
  };

  return (
    <div className={`${compact ? "rounded-[10px] px-3 py-2 text-[11px] font-semibold" : "rounded-2xl px-4 py-3 text-sm"} border ${styles[variant]}`}>
      {message}
    </div>
  );
}

export default Toast;
