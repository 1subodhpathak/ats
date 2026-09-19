import { Check, Coins, FileSearch, ListChecks } from "lucide-react";
import { REPORT_LEVELS } from "../constants/reportTypes";

const choices = [
  {
    value: REPORT_LEVELS.BASIC,
    title: "Basic ATS Report",
    description: "Focused 8-page compatibility report",
    resumeTokenEstimate: "8,000–10,000 tokens",
    resumeJdTokenEstimate: "8,000–10,000 tokens",
    badge: "Recommended",
    icon: FileSearch,
  },
  {
    value: REPORT_LEVELS.DETAILED,
    title: "Detailed 50-Point Analysis",
    description: "Full evidence, rewrites, and deep checks",
    resumeTokenEstimate: "12,000–20,000 tokens",
    resumeJdTokenEstimate: "12,000–30,000 tokens",
    badge: "Deep analysis",
    icon: ListChecks,
  },
];

function ReportTypeSelector({
  value,
  onChange,
  disabled = false,
  compact = false,
  showResumeTokenEstimate = false,
  showResumeJdTokenEstimate = false,
}) {
  return (
    <fieldset className="min-w-0" disabled={disabled}>
      <legend className="mb-2 text-[8px] font-black uppercase tracking-[0.18em] text-[#6E8797]">
        Choose report depth
      </legend>
      <div className={`grid gap-2 ${compact ? "sm:grid-cols-2" : "md:grid-cols-2"}`}>
        {choices.map(({ value: optionValue, title, description, resumeTokenEstimate, resumeJdTokenEstimate, badge, icon: Icon }) => {
          const selected = value === optionValue;
          const tokenEstimate = showResumeJdTokenEstimate
            ? resumeJdTokenEstimate
            : resumeTokenEstimate;
          return (
            <label
              key={optionValue}
              className={`relative flex cursor-pointer items-center gap-3 rounded-[14px] border px-3 py-2.5 transition ${
                selected
                  ? "border-[#D3A445] bg-[#FFF6E3] shadow-[0_7px_18px_rgba(138,91,16,.08)]"
                  : "border-[#D5E1E7] bg-white hover:border-[#AFC5D0]"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="radio"
                name="report-level"
                value={optionValue}
                checked={selected}
                onChange={() => onChange(optionValue)}
                className="sr-only"
              />
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${selected ? "bg-[#0B3B59] text-white" : "bg-[#EAF2F5] text-[#416A80]"}`}>
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black text-[#123A54]">{title}</span>
                  <span className="text-[6px] font-black uppercase tracking-[0.12em] text-[#A66B0D]">{badge}</span>
                </span>
                <span className="mt-0.5 block text-[7.5px] font-medium text-[#748D9C]">{description}</span>
                {showResumeTokenEstimate || showResumeJdTokenEstimate ? (
                  <span
                    className={`mt-2 inline-flex items-center gap-2 rounded-[8px] border px-2.5 py-1.5 text-[9.5px] font-black leading-none shadow-sm ${
                      selected
                        ? "border-[#C98B24] bg-[#D9A43A] text-white"
                        : "border-[#E0BE70] bg-[#FFF2D2] text-[#81540B]"
                    }`}
                  >
                    <Coins size={13} strokeWidth={2.5} aria-hidden="true" />
                    <span>
                      <span className="mr-1 text-[7px] uppercase tracking-[0.1em] opacity-90">
                        Estimated usage
                      </span>
                      {tokenEstimate}
                    </span>
                  </span>
                ) : null}
              </span>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? "border-[#D3A445] bg-[#D3A445] text-white" : "border-[#C8D6DD] text-transparent"}`}>
                <Check size={11} strokeWidth={3} aria-hidden="true" />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default ReportTypeSelector;
