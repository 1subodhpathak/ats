function Loader({ label = "Loading...", className = "" }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`flex items-center justify-center p-6 ${className}`}
    >
      <span
        aria-hidden="true"
        className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F7E8C4]"
      >
        <span className="absolute inset-[4px] animate-spin rounded-full border-[3px] border-[#D5E2E8] border-r-[#C98A1D] border-t-[#083F5E] motion-reduce:animate-none" />
        <span className="h-2 w-2 rounded-full bg-[#C98A1D]" />
      </span>
    </div>
  );
}

export default Loader;
