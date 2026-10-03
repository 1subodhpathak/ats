import { X, Sparkles, Zap, ArrowUpRight, Coins } from "lucide-react";

export default function InsufficientTokensModal({
  isOpen,
  onClose,
  currentBalance = 0,
  minRequired = 5000,
}) {
  if (!isOpen) return null;

  const handleGoToPricing = () => {
    window.open("https://careersenseai.com/pricing", "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#062E47]/60 p-4 backdrop-blur-[8px] animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-[#E8DFC9] bg-[#FCF9F2] p-7 shadow-[0_24px_50px_rgba(6,46,71,0.28)]">
        {/* Subtle background gradient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F0BE4B]/20 blur-[40px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#0891b2]/15 blur-[40px]"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#EDE4D0]/60 text-[#475569] transition hover:bg-[#E2D5BE] hover:text-[#0f172a]"
        >
          <X size={18} strokeWidth={2.2} />
        </button>

        {/* Icon & Heading */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#F0BE4B] to-[#FCD34D] text-[#082F49] shadow-[0_10px_24px_rgba(240,190,75,0.35)]">
            <Coins size={32} strokeWidth={2.2} />
          </div>

          <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#F0BE4B]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#92400E]">
            <Sparkles size={13} className="text-[#D97706]" />
            Token Limit Reached
          </span>

          <h3 className="text-xl font-extrabold text-[#0B2A3D]">
            Insufficient Tokens
          </h3>

          <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#4A6375]">
            Generating an ATS Compatibility report requires a minimum of{" "}
            <span className="font-bold text-[#0B2A3D]">{minRequired.toLocaleString()} tokens</span>.
            {currentBalance > 0 ? (
              <> You currently have <span className="font-bold text-[#D97706]">{currentBalance.toLocaleString()} tokens</span> remaining.</>
            ) : (
              <> You have <span className="font-bold text-[#EF4444]">0 tokens</span> remaining.</>
            )}
          </p>

          <p className="mt-2 text-[12.5px] font-medium text-[#64748B]">
            Please upgrade your plan or add more tokens to generate your report.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex w-full flex-col gap-3">
            <button
              onClick={handleGoToPricing}
              type="button"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0E4663] to-[#165B80] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(14,70,99,0.25)] transition hover:from-[#09354C] hover:to-[#0E4663] hover:shadow-[0_10px_25px_rgba(14,70,99,0.35)] active:scale-[0.99]"
            >
              <Zap size={16} className="text-[#F0BE4B] fill-[#F0BE4B]" />
              <span>Upgrade Plan</span>
              <ArrowUpRight size={16} className="text-[#F0BE4B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={handleGoToPricing}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D5C7AA] bg-[#F4EDE0] px-5 py-3 text-sm font-bold text-[#0B2A3D] shadow-sm transition hover:bg-[#EAE0D0] hover:border-[#C4B390] active:scale-[0.99]"
            >
              <Coins size={15} className="text-[#0E4663]" />
              <span>Add More Tokens</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
