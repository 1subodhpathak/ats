import { createPortal } from "react-dom";
import { 
  FilePenLine, 
  ScrollText, 
  Compass, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  X 
} from "lucide-react";

export default function ATSReportNextStepsModal({
  isOpen,
  onClose,
  score = 0,
  targetRole = "",
  analysisId = "",
}) {
  if (!isOpen) return null;

  const numericScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const isGoodScore = numericScore >= 75;
  const encodedRole = encodeURIComponent(targetRole || "");

  const handleDismiss = () => {
    if (analysisId) {
      try {
        sessionStorage.setItem(`cs_ats_nudge_seen_${analysisId}`, "true");
      } catch (err) {
        console.warn("Error setting sessionStorage:", err);
      }
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1528]/80 backdrop-blur-md transition-opacity"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-[#FFFDF8] border border-[#E0C58F]/50 p-6 sm:p-8 shadow-2xl transition-all my-auto text-[#112250]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ats-next-steps-title"
      >
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-700" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-5 right-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          aria-label="Close recommendations"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Title and Score Pill */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pr-8">
          <div className="flex-1">
            {/* Top pill indicator */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Report generated successfully</span>
            </div>

            {/* Main Title */}
            <h2
              id="ats-next-steps-title"
              className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#112250]"
            >
              Your ATS report is ready.
            </h2>

            {/* Subtitle */}
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              {isGoodScore ? (
                <>
                  Your resume scored <strong className="font-bold text-[#112250]">{numericScore}/100</strong> against the ATS criteria. Explore these practical next steps before applying.
                </>
              ) : (
                <>
                  Your resume scored <strong className="font-bold text-[#112250]">{numericScore}/100</strong> against the ATS criteria. Review these key improvements before applying.
                </>
              )}
            </p>
          </div>

          {/* Right Score Box */}
          <div className="flex shrink-0 self-start sm:self-auto items-center justify-center rounded-2xl bg-emerald-50/80 border border-emerald-100/90 px-6 py-3.5 text-center min-w-[125px]">
            <div>
              <div className="text-3xl font-black text-emerald-700 leading-none">
                {numericScore}
                <span className="text-sm font-bold text-slate-500 ml-0.5">/100</span>
              </div>
              <div className="mt-1.5 text-[9.5px] font-extrabold uppercase tracking-widest text-emerald-800">
                ATS Score
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mt-6 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500">
          <span>Recommended Next Steps</span>
          <span className="text-slate-400 font-semibold normal-case tracking-normal text-xs">3 career tools</span>
        </div>

        {/* Recommendation Cards */}
        <div className="mt-3.5 space-y-3">
          {/* Recommendation 1: Cover Letter (for score >= 75) or Resume Builder (for score < 75) */}
          {isGoodScore ? (
            <div className="group rounded-2xl border border-emerald-200/80 bg-white p-4 sm:p-5 shadow-xs transition hover:border-emerald-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <FilePenLine className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#112250]">Create a tailored cover letter</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wide text-emerald-800 border border-emerald-200/60">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-lg">
                      Introduce your strengths with a cover letter tailored to the role and your resume.
                    </p>
                  </div>
                </div>

                <a
                  href={`https://coverletter.careersenseai.com/${encodedRole ? `?role=${encodedRole}` : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#00695C] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#005B4F] active:scale-95 transition"
                >
                  <span>Write cover letter</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="group rounded-2xl border border-amber-200/80 bg-white p-4 sm:p-5 shadow-xs transition hover:border-amber-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <FilePenLine className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#112250]">Rebuild with AI Resume Builder</span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wide text-amber-800 border border-amber-200/60">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-lg">
                      Fix formatting gaps and boost keyword match with recruiter-tested templates.
                    </p>
                  </div>
                </div>

                <a
                  href={`https://resume.careersenseai.com/${encodedRole ? `?role=${encodedRole}` : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#00695C] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#005B4F] active:scale-95 transition"
                >
                  <span>Build ATS resume</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Recommendation 2: Career GPS (100% Free) */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition hover:border-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
                  <Compass className="h-5 w-5 text-amber-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#112250]">Explore your Career GPS</span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wide text-amber-800 border border-amber-200/60">
                      FREE CAREER TOOL
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-lg">
                    Understand your career readiness, explore role benchmarks, and plan your next steps.
                  </p>
                </div>
              </div>

              <a
                href="https://careersenseai.com/career-gps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#112250] shadow-xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition"
              >
                <span>Explore Career GPS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Recommendation 3: Certifi (Skill Certification) */}
          <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition hover:border-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Award className="h-5 w-5 text-teal-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#112250]">Validate your skills and get certified</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wide text-slate-700 border border-slate-200">
                      SKILL VALIDATION
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-lg">
                    Assess your skills and earn a verifiable CareerSense credential you can share.
                  </p>
                </div>
              </div>

              <a
                href="https://certifi.careersenseai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#112250] shadow-xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition"
              >
                <span>Explore Certifi</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Helper Note Banner */}
        <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Choose the tools that fit your goals. Your full ATS report remains available below.</span>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs font-bold text-[#112250] hover:underline transition"
          >
            Review detailed report
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex items-center justify-center rounded-xl bg-[#112250] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-[#1E3A6D] active:scale-95 transition"
          >
            Close & continue
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
