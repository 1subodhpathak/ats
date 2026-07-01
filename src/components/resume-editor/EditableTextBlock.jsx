function EditableTextBlock({ value, onChange, onFocus }) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      rows={Math.max(2, Math.ceil((value?.length || 0) / 72))}
      className="min-h-[76px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 outline-none transition focus:border-[#0a66c2] focus:ring-2 focus:ring-blue-100"
    />
  );
}

export default EditableTextBlock;
