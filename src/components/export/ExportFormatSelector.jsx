function ExportFormatSelector({ value, onChange }) {
  const options = [
    { value: "docx", label: "DOCX" },
    { value: "pdf", label: "PDF" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={[
            "rounded-full px-3 py-1.5 text-sm font-semibold transition",
            value === option.value
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200",
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ExportFormatSelector;
