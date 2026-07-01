function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}) {
  const variantStyles = {
    primary:
      "bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-600/20",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
