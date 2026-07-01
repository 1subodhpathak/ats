function Toast({ message = "", variant = "info" }) {
  if (!message) {
    return null;
  }

  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[variant]}`}>
      {message}
    </div>
  );
}

export default Toast;
