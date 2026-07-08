import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenCheck,
  Gauge,
  SearchCheck,
  ScanText,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  FileText,
  X,
} from "lucide-react";

const coverageItems = [
  {
    title: "Executive Overview",
    description:
      "A quick summary of current ATS readiness, strongest fit areas, and the biggest risks before you apply.",
    icon: Gauge,
    accent: "bg-[#E9F1FF] text-[#244C98]",
  },
  {
    title: "JD Match Analysis",
    description:
      "Checks how well your resume aligns with the target job description, including missing skills, domain terms, and role intent.",
    icon: SearchCheck,
    accent: "bg-[#EEFBF6] text-[#12805F]",
  },
  {
    title: "ATS Parsing Review",
    description:
      "Flags layout, formatting, section-order, and readability issues that could prevent an ATS from extracting the right details.",
    icon: ScanText,
    accent: "bg-[#FFF3E7] text-[#B65A1A]",
  },
  {
    title: "Keyword Coverage",
    description:
      "Shows matched keywords, weak keywords, and the exact phrases that need stronger proof or clearer placement.",
    icon: BookOpenCheck,
    accent: "bg-[#F4EFFF] text-[#6E41C9]",
  },
  {
    title: "Recruiter Risk Flags",
    description:
      "Highlights likely objections such as missing proof, unclear seniority, skill gaps, or resume sections that raise questions.",
    icon: ShieldAlert,
    accent: "bg-[#FFF0F0] text-[#C23D4D]",
  },
  {
    title: "Rewrite Guidance",
    description:
      "Ends with practical improvement recommendations, stronger bullet directions, and a final verdict for the next application step.",
    icon: Sparkles,
    accent: "bg-[#EEF8FF] text-[#0F5D8B]",
  },
];

function ATSReportCoverage() {
  const [isSampleReportOpen, setIsSampleReportOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    if (!isSampleReportOpen) {
      document.body.style.overflow = "";
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSampleReportOpen]);

  return (
    <>
      <section
        id="ats-report-coverage"
        className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(135deg,#3b4c66_0%,#2c3a54_42%,#18243a_100%)] py-14 text-swanwing shadow-[0_-20px_60px_rgba(17,29,64,0.18)] md:py-16 lg:min-h-screen lg:py-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/ATS Coverage.png')" }}
        />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgb(0, 19, 96) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-y-0 left-0 w-[42%] bg-[radial-gradient(circle_at_top_left,rgba(229,203,148,0.18),transparent_68%)]" />
        <div className="absolute inset-y-0 right-0 w-[36%] bg-[radial-gradient(circle_at_center_right,rgba(255,255,255,0.08),transparent_72%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172232]/92 via-[#1d2b3f]/82 to-[#1d2b3f]/68" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center gap-10 px-6 lg:min-h-screen lg:flex-row lg:items-center lg:gap-10">
          <div className="flex w-full flex-col justify-center space-y-5 lg:w-[36%] lg:shrink-0">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#e5cb94]">
              ATS Report Breakdown
            </span>
            <h2 className="max-w-xl text-4xl font-black leading-[0.95] tracking-tight text-swanwing sm:text-5xl lg:text-4xl xl:text-5xl">
              What your ATS report will{" "}
              <span className="text-[#e5cb94]">actually cover.</span>
            </h2>
            <p className="max-w-lg text-sm font-medium leading-relaxed text-swanwing/72 md:text-base">
              CareerSense does more than give a score. The report breaks down how
              your resume performs across ATS compatibility, JD alignment,
              recruiter readability, keyword strength, and rewrite direction.
            </p>

            <div className="mt-1 flex flex-col gap-3 text-sm font-semibold text-swanwing/74 md:text-[13px]">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#e5cb94] text-[11px] text-[#e5cb94]">
                  ✓
                </span>
                Resume readability check
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#e5cb94] text-[11px] text-[#e5cb94]">
                  ✓
                </span>
                JD keyword gap analysis
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#e5cb94] text-[11px] text-[#e5cb94]">
                  ✓
                </span>
                Practical improvement suggestions
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSampleReportOpen(true)}
              className="group mt-3 inline-flex min-h-[48px] w-fit items-center justify-between gap-4 rounded-[18px] border border-white/18 bg-white/10 px-5 py-3 text-left text-swanwing transition duration-300 hover:-translate-y-0.5 hover:bg-white/14"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e5cb94]">
                  Preview Output
                </p>
                <p className="mt-1 text-sm font-black">View sample report</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#10245A] shadow-[0_10px_24px_rgba(16,36,90,0.18)] transition duration-300 group-hover:translate-x-0.5">
                <FileText className="h-4 w-4" />
              </div>
            </button>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-[64%] xl:gap-5">
            {coverageItems.map(({ title, description, icon: Icon, accent }) => (
              <div
                key={title}
                className="group relative flex min-h-[180px] flex-col justify-center rounded-[24px] border border-white/18 bg-[#f7f3ea] p-5 text-royalblue shadow-[0_20px_40px_rgba(7,14,28,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-white xl:min-h-[190px] xl:p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 -translate-x-2 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-[#244C98] group-hover:opacity-100" />
                </div>
                <h3 className="text-[18px] font-black leading-tight text-[#1D2B3F]">
                  {title}
                </h3>
                <p className="mt-2 text-[12px] font-medium leading-relaxed text-slate-600 xl:text-[13px]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isSampleReportOpen ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="flex h-[92vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[28px] border border-[#D8DFE7] bg-white shadow-[0_28px_80px_rgba(16,36,90,0.22)]"
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-[#E4DDD4] bg-[linear-gradient(180deg,rgba(246,241,234,0.7),rgba(255,255,255,0.95))] px-5 py-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5E7EA3]">
                          Sample Report
                        </p>
                        <h3 className="mt-1 truncate text-[20px] font-black tracking-tight text-[#10245A]">
                          ATS Resume Checker PDF
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsSampleReportOpen(false)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D8DFE7] bg-white text-[#10245A] transition duration-300 hover:-translate-y-0.5"
                        style={{
                          boxShadow: "0 12px 22px rgba(16,36,90,0.08)",
                        }}
                        aria-label="Close sample report"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-hidden bg-[#F6F1EA] p-3 sm:p-4">
                      <iframe
                        src="/ATS%20Resume%20Checker.pdf#toolbar=0&navpanes=0&scrollbar=1"
                        title="Sample ATS report PDF"
                        className="h-full w-full rounded-[22px] border border-[#D8DFE7] bg-white shadow-[0_18px_48px_rgba(16,36,90,0.14)]"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}

export default ATSReportCoverage;
