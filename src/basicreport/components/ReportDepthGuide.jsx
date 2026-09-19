import { Check, FileSearch, ListChecks } from "lucide-react";

const reports = [
  {
    value: "basic",
    title: "Basic ATS Report",
    subtitle: "A focused decision-ready overview",
    bestFor: "Best for a fast application check",
    icon: FileSearch,
    tone: "gold",
    points: ["8-page compatibility report", "Score, role fit, and outlook", "Keywords and critical gaps", "Prioritized action plan"],
  },
  {
    value: "detailed",
    title: "Detailed 50-Point Analysis",
    subtitle: "A complete evidence-level resume audit",
    bestFor: "Best for a full resume optimization",
    icon: ListChecks,
    tone: "blue",
    points: ["50 ATS and recruiter checks", "Deep content and format review", "Evidence-level diagnostics", "Rewrites and full roadmap"],
  },
];

function ReportDepthGuide({ selectedLevel = "basic" }) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#D7E1E5] bg-[#FFFDFC]/90 shadow-[0_10px_26px_rgba(7,47,73,.05)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 bg-[#F7FAFA] px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0B3B59] text-white"><FileSearch size={13} /></span>
          <div>
            <h3 className="text-[11px] font-black text-[#103650]">Which report should I choose?</h3>
            <p className="mt-0.5 text-[8px] font-medium text-[#617D8E]">Compare the level of guidance included in each report.</p>
          </div>
        </div>
        <span className="hidden rounded-full border border-[#D5A442]/45 bg-[#FFF3D9] px-3 py-1 text-[6.5px] font-black uppercase tracking-[.14em] text-[#99620A] sm:block">Your choice is highlighted</span>
      </div>
      <div className="grid gap-2 border-t border-[#E4E9EA] p-2 lg:grid-cols-2">
        {reports.map(({ value, title, subtitle, bestFor, icon: Icon, tone, points }) => {
          const selected = selectedLevel === value;
          return (
          <article key={title} className={`relative flex gap-2.5 rounded-[12px] border px-3 py-2 transition ${selected ? "border-[#D5A442] bg-[#FFF8E9]" : "border-transparent bg-white"}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${tone === "gold" ? "bg-[#FFF0D0] text-[#B87910]" : "bg-[#E8F1F5] text-[#315E75]"}`}>
              <Icon size={14} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><h4 className="text-[10px] font-black text-[#103650]">{title}</h4>{selected ? <span className="rounded-full bg-[#D5A442] px-2 py-0.5 text-[5.5px] font-black uppercase tracking-[.12em] text-white">Selected</span> : null}</div>
              <p className="mt-0.5 text-[7.5px] font-semibold text-[#78909E]">{subtitle}</p>
              <p className="mt-1 text-[7px] font-black uppercase tracking-[.08em] text-[#A66B0D]">{bestFor}</p>
              <ul className="mt-1 grid gap-0.5 sm:grid-cols-2 sm:gap-x-3">
                {points.map((point) => <li key={point} className="flex items-start gap-1.5 text-[7.5px] font-medium text-[#47697D]"><Check size={10} strokeWidth={3} className="mt-px shrink-0 text-[#C58A22]" />{point}</li>)}
              </ul>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

export default ReportDepthGuide;
