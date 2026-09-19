import { useEffect, useMemo, useState } from "react";
import { Check, FileSearch, ListChecks, ShieldCheck, Target } from "lucide-react";

const VARIANTS = {
  "resume:basic": {
    eyebrow: "Basic Resume Report",
    title: "Building your ATS essentials",
    description: "Checking readability, structure, core keywords, and the most important improvements for your resume.",
    Icon: FileSearch,
    steps: ["Reading resume structure", "Checking ATS essentials", "Preparing your action plan"],
    accent: "#D39A2D",
    soft: "#FFF2D5",
  },
  "resume:detailed": {
    eyebrow: "Detailed Resume Analysis",
    title: "Running your 50-point review",
    description: "Reviewing every ATS checkpoint, recruiter signal, content pattern, and evidence area in your resume.",
    Icon: ListChecks,
    steps: ["Evaluating 50 ATS checks", "Reviewing evidence and impact", "Building detailed recommendations"],
    accent: "#367592",
    soft: "#E7F1F5",
  },
  "resume_jd:basic": {
    eyebrow: "Basic Resume + JD Report",
    title: "Measuring your role match",
    description: "Comparing your resume with the job description for essential requirements, keywords, and priority gaps.",
    Icon: Target,
    steps: ["Reading role requirements", "Matching core evidence", "Summarizing priority gaps"],
    accent: "#C98A24",
    soft: "#FFF0CE",
  },
  "resume_jd:detailed": {
    eyebrow: "Detailed Resume + JD Analysis",
    title: "Building your complete match report",
    description: "Mapping job requirements against resume evidence and completing the full 50-point compatibility analysis.",
    Icon: ListChecks,
    steps: ["Prioritizing JD requirements", "Mapping resume evidence", "Preparing the optimization roadmap"],
    accent: "#176F8E",
    soft: "#E2F0F4",
  },
};

function ReportGenerationLoader({ open, analysisType = "resume", reportLevel = "basic" }) {
  const [activeStep, setActiveStep] = useState(0);
  const config = useMemo(
    () => VARIANTS[`${analysisType}:${reportLevel}`] || VARIANTS["resume:basic"],
    [analysisType, reportLevel]
  );

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      return undefined;
    }
    const timer = window.setInterval(
      () => setActiveStep((current) => Math.min(current + 1, config.steps.length - 1)),
      1800
    );
    return () => window.clearInterval(timer);
  }, [config.steps.length, open]);

  if (!open) return null;

  const Icon = config.Icon;
  return (
    <div className="report-loader fixed inset-0 z-[120] grid place-items-center bg-[#062E47]/45 p-4 backdrop-blur-[7px]" role="status" aria-live="polite" aria-label={config.title}>
      <section className="report-loader-card relative w-full max-w-[520px] overflow-hidden rounded-[26px] border border-[#DED7CB] bg-[#FFFDF8] shadow-[0_32px_90px_rgba(5,42,66,.28)]">
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: config.accent }} />
        <div className="flex flex-col items-center px-7 pb-7 pt-9 text-center sm:px-10">
          <div className="relative grid h-[86px] w-[86px] place-items-center">
            <div className="report-loader-ring absolute inset-0 rounded-full border-[4px] border-[#E4EBEE]" style={{ borderTopColor: config.accent, borderRightColor: config.accent }} />
            <div className="grid h-[61px] w-[61px] place-items-center rounded-full text-[#083650] shadow-[inset_0_0_0_1px_rgba(8,54,80,.06)]" style={{ backgroundColor: config.soft }}>
              <Icon size={25} strokeWidth={1.9} />
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5" style={{ backgroundColor: config.soft }}>
            <span className="report-loader-pulse h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.accent }} />
            <span className="text-[8px] font-black uppercase tracking-[.18em] text-[#8F6119]">{config.eyebrow}</span>
          </div>
          <h2 className="mt-4 text-[23px] font-black tracking-[-.025em] text-[#103650]">{config.title}</h2>
          <p className="mt-2 max-w-[390px] text-[11.5px] font-medium leading-[1.6] text-[#668496]">{config.description}</p>

          <div className="mt-6 grid w-full gap-2 text-left">
            {config.steps.map((step, index) => {
              const complete = index < activeStep;
              const active = index === activeStep;
              return (
                <div key={step} className={`flex items-center gap-3 rounded-[11px] px-3 py-2 transition-opacity duration-300 ${index <= activeStep ? "opacity-100" : "opacity-45"}`}>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[8px] font-black" style={{ borderColor: complete || active ? config.accent : "#CBD8DE", backgroundColor: complete ? config.accent : active ? config.soft : "transparent", color: complete ? "#FFFDF8" : active ? "#765019" : "#78909E" }}>
                    {complete ? <Check size={12} strokeWidth={3} /> : index + 1}
                  </span>
                  <span className={`text-[9px] font-bold ${active ? "text-[#103650]" : "text-[#6E8797]"}`}>{step}</span>
                  {active ? <span className="report-loader-dots ml-auto text-[11px] font-black" style={{ color: config.accent }}>•••</span> : null}
                </div>
              );
            })}
          </div>

          <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-[#E5ECEF]">
            <div className="report-loader-progress h-full w-[42%] rounded-full" style={{ backgroundColor: config.accent }} />
          </div>
          <p className="mt-3 text-[8.5px] font-medium text-[#8EA3AE]">Please keep this window open while CareerSense finishes the report.</p>
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-[#EAE4DA] bg-[#FAF6EE] px-5 py-3 text-[8.5px] font-semibold text-[#7893A2]">
          <ShieldCheck size={13} className="text-[#C98A24]" />Your resume and job details remain private.
        </div>
      </section>
      <style>{`
        @keyframes reportLoaderSpin { to { transform: rotate(360deg); } }
        @keyframes reportLoaderTravel { from { transform: translateX(-120%); } to { transform: translateX(340%); } }
        @keyframes reportLoaderPulse { 50% { opacity: .35; transform: scale(.82); } }
        @keyframes reportLoaderEnter { from { opacity: 0; transform: translateY(10px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .report-loader-card { animation: reportLoaderEnter 420ms cubic-bezier(.22,1,.36,1) both; }
        .report-loader-ring { animation: reportLoaderSpin 1.4s linear infinite; }
        .report-loader-progress { animation: reportLoaderTravel 1.55s cubic-bezier(.25,1,.5,1) infinite; }
        .report-loader-pulse,.report-loader-dots { animation: reportLoaderPulse 1.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .report-loader-card,.report-loader-ring,.report-loader-progress,.report-loader-pulse,.report-loader-dots { animation: none !important; }
          .report-loader-progress { transform: translateX(70%); }
        }
      `}</style>
    </div>
  );
}

export default ReportGenerationLoader;
