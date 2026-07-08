import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CircleHelp,
  ChevronRight,
  Check,
  FileText,
  LayoutDashboard,
  ReceiptText,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import useResumeStore from "../../store/useResumeStore";
import colorLogo from "../../assets/logos/BlueLogo.png";
import apiClient from "../../services/apiClient";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const isLandingPage = location.pathname === "/";
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const currentResume = useResumeStore((state) => state.currentResume);
  const isResumeJdFlow = !!(currentResume?.latestAnalysis?.jdText || location.pathname.includes("resume-jd"));

  const [totalPoints, setTotalPoints] = React.useState(0);
  const [estimatedCost, setEstimatedCost] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    async function fetchUsage() {
      try {
        const [resumesRes, jdsRes] = await Promise.all([
          apiClient.get("/all"),
          apiClient.get("/job-descriptions")
        ]);
        if (!active) return;

        const resumes = resumesRes.data.storedResumes || [];
        const jds = jdsRes.data.storedJobDescriptions || [];

        // Adapt resumes to reports
        const reports = resumes
          .filter((r) => r.latestAnalysis && r.latestAnalysis.overall_score)
          .map((resume) => ({
            report_id: resume.resume_id,
            overall_score: resume.latestAnalysis.overall_score,
            has_job_description: !!resume.latestAnalysis.jdText,
          }));

        // Estimate units
        const reportUnits = reports.reduce((total, r) => {
          const base = r.has_job_description ? 1825 : 1350;
          const scoreBonus = Math.round((r.overall_score || 0) * 4.75);
          return total + base + scoreBonus;
        }, 0);

        const resumeUnits = resumes.length * 180;
        const jdUnits = jds.length * 95;

        const sum = reportUnits + resumeUnits + jdUnits;
        setTotalPoints(sum);
        setEstimatedCost(sum / 100000);
      } catch (err) {
        console.error("Navbar failed to fetch usage metrics:", err);
      }
    }

    // Only fetch if authenticated
    if (userId) {
      fetchUsage();
    }
    return () => {
      active = false;
    };
  }, [currentResume, userId]);

  const workflowSteps = isResumeJdFlow
    ? [
      { key: "details", label: "Details" },
      { key: "resume", label: "Resume" },
      { key: "job", label: "Job Details" },
      { key: "editor", label: "Editor" },
    ]
    : [
      { key: "details", label: "Details" },
      { key: "resume", label: "Resume" },
      { key: "editor", label: "Editor" },
    ];

  const getCurrentStep = () => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/check-ats" ||
      location.pathname === "/repository"
    ) {
      return 1;
    }

    if (location.pathname === "/check-ats/resume" || location.pathname === "/check-ats/resume-jd") {
      return 2;
    }

    if (isResumeJdFlow) {
      if (location.pathname.startsWith("/check-ats/resume-jd/job-details")) {
        return 3;
      }
      if (
        location.pathname.startsWith("/reports/analysis/") ||
        location.pathname.startsWith("/repository/report/")
      ) {
        return 4;
      }
    } else {
      if (
        location.pathname.startsWith("/reports/analysis/") ||
        location.pathname.startsWith("/repository/report/")
      ) {
        return 3;
      }
    }

    return 1;
  };

  const currentStep = getCurrentStep();

  const handleScroll = (id) => {
    if (!isLandingPage) {
      navigate("/", { replace: true });

      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const InternalUsagePill = () => (
    <div className="hidden items-center gap-3 rounded-2xl border border-[#CFE0EC] bg-white/90 px-3 py-2 shadow-[0_8px_20px_rgba(16,36,90,0.045)] md:flex">
      <div className="flex items-center gap-1.5">
        <Zap className="h-3.5 w-3.5 text-[#6B87A0]" />
        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6B87A0]">
          Points
        </span>
        <span className="text-sm font-black tracking-tight text-[#2F4054]">
          {new Intl.NumberFormat().format(totalPoints)}
        </span>
      </div>

      <div className="h-4 w-px bg-[#D6E1E9]" />

      <div className="flex items-center gap-1.5">
        <ReceiptText className="h-3.5 w-3.5 text-[#6B87A0]" />
        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6B87A0]">
          Bill
        </span>
        <span className="text-sm font-black tracking-tight text-[#2F4054]">
          {`$${estimatedCost.toFixed(4)}`}
        </span>
      </div>
    </div>
  );

  const InternalLogo = () => (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <img src={colorLogo} alt="CareerSense Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-2xl shadow-xs shrink-0" />

      <div className="pr-3 xl:border-r xl:border-[#D6E1E9]">
        <h1 className="text-[25px] font-black leading-none tracking-[-0.04em]">
          {/* CareerSense */}
          <span className="text-[#0D2E63]">Career</span><span className="text-[#306099]">Sense</span>
        </h1>
        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-[#6B87A0]">
          ATS Intelligence
        </p>
      </div>
    </Link>
  );

  const LandingLogo = () => (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <img src={colorLogo} alt="CareerSense Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-2xl shadow-xs shrink-0" />

      <div>
        <h1 className="text-[25px] font-black leading-none tracking-[-0.04em]">
          {/* CareerSense */}
          <span className="text-[#0D2E63]">Career</span><span className="text-[#306099]">Sense</span>
        </h1>
        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-[#6B87A0]">
          ATS Intelligence
        </p>
      </div>
    </Link>
  );

  const InternalStepper = () => (
    <nav className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden px-2">
      {workflowSteps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={step.key}>
            <div
              className={`flex min-w-0 items-center gap-1.5 rounded-full px-2 py-1.5 transition ${isCurrent ? "bg-[#E8EEF4]" : "bg-transparent"
                }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${isComplete
                  ? "bg-[#6D879A] text-white"
                  : isCurrent
                    ? "bg-[#2F4054] text-white"
                    : "bg-[#D8E3EB] text-[#6B87A0]"
                  }`}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : stepNumber}
              </div>

              <span
                className={`hidden whitespace-nowrap text-[13px] font-black tracking-tight xl:inline ${isCurrent ? "text-[#2F4054]" : "text-[#6B87A0]"
                  }`}
              >
                {step.label}
              </span>
            </div>

            {index < workflowSteps.length - 1 ? (
              <div className="hidden h-px w-8 shrink-0 bg-[#A8B8C4] xl:block" />
            ) : null}
          </React.Fragment>
        );
      })}

      <div className="ml-1 hidden items-center gap-1.5 rounded-full px-2 py-1.5 text-[#6B87A0] xl:flex">
        <CircleHelp className="h-4 w-4" />
        <span className="whitespace-nowrap text-[13px] font-black tracking-tight">
          Help
        </span>
      </div>
    </nav>
  );

  const InternalActions = () => (
    <div className="flex shrink-0 items-center gap-2">
      <InternalUsagePill />

      <Link to="/dashboard">
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-xl border border-[#CFE0EC] bg-white/80 px-3 text-[13px] font-black text-[#2F4054] shadow-[0_8px_20px_rgba(16,36,90,0.045)] transition hover:-translate-y-0.5 hover:bg-white"
        >
          <LayoutDashboard className="h-4 w-4 xl:hidden" />
          <span className="hidden xl:inline">Dashboard</span>
        </button>
      </Link>

      <button
        type="button"
        onClick={handleBack}
        className="flex h-10 items-center gap-2 rounded-xl border border-[#CFE0EC] bg-white/80 px-3 text-[13px] font-black text-[#2F4054] shadow-[0_8px_20px_rgba(16,36,90,0.045)] transition hover:-translate-y-0.5 hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden xl:inline">Back</span>
      </button>
    </div>
  );

  return (
    <header
      className={
        isLandingPage
          ? "sticky top-0 z-50 w-full bg-transparent border-none shadow-none px-3 pt-3 sm:px-6 sm:pt-4"
          : "sticky top-0 z-50 border-b backdrop-blur-xl border-[#D6E1E9]/45 bg-[#F7F3ED]/96 px-4 py-2.5 sm:px-6 sm:py-3 shadow-[0_8px_22px_rgba(16,36,90,0.04)]"
      }
    >
      <div
        className={
          isLandingPage
            ? "mx-auto flex flex-col w-full max-w-[1536px] border border-white/60 bg-[#F6F1EA]/60 px-3 py-2.5 sm:px-6 sm:py-3.5 shadow-[0_18px_60px_rgba(47,65,86,0.12)] backdrop-blur-2xl rounded-xl sm:rounded-2xl"
            : "mx-auto flex flex-col w-full max-w-[1536px]"
        }
      >
        <div className="flex w-full items-center justify-between gap-3">
          {isLandingPage ? <LandingLogo /> : <InternalLogo />}

          {isLandingPage ? (
            <nav className="hidden items-center gap-8 md:flex">
              <button
                onClick={() => handleScroll("home")}
                className="text-xs font-bold text-slate-600 transition hover:text-royalblue"
              >
                Home
              </button>

              <button
                onClick={() => handleScroll("why-careersense")}
                className="text-xs font-bold text-slate-600 transition hover:text-royalblue"
              >
                Why CareerSense
              </button>

              <button
                onClick={() => handleScroll("how-it-works")}
                className="text-xs font-bold text-slate-600 transition hover:text-royalblue"
              >
                How It Works
              </button>

              <button
                onClick={() => handleScroll("testimony")}
                className="text-xs font-bold text-slate-600 transition hover:text-royalblue"
              >
                Testimonials
              </button>
            </nav>
          ) : (
            <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
              <InternalStepper />
              <InternalActions />
            </div>
          )}

          {isLandingPage ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 md:flex">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-lg border border-royalblue/30 px-4 py-2 text-xs font-bold text-royalblue hover:bg-royalblue/5 transition"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-3">
                    <InternalUsagePill />
                    <Link to="/check-ats" className="shrink-0">
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-lg bg-royalblue px-4 py-2 text-xs font-bold text-swanwing shadow-sm transition hover:bg-sapphire"
                      >
                        Check ATS
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </SignedIn>
              </div>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <button
                type="button"
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6E1E9]/80 bg-white/80 text-[#2F4054] md:hidden shadow-xs hover:bg-white transition"
              >
                {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <button
                type="button"
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6E1E9]/80 bg-white/80 text-[#2F4054] lg:hidden shadow-xs hover:bg-white transition"
              >
                {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileNavOpen && (
          <div className={`w-full border-t border-[#D6E1E9]/40 mt-3 pt-3 ${isLandingPage ? "md:hidden" : "lg:hidden"}`}>
            {isLandingPage ? (
              <nav className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    handleScroll("home");
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full text-left rounded-lg bg-white/40 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-white transition"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    handleScroll("why-careersense");
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full text-left rounded-lg bg-white/40 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-white transition"
                >
                  Why CareerSense
                </button>
                <button
                  onClick={() => {
                    handleScroll("how-it-works");
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full text-left rounded-lg bg-white/40 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-white transition"
                >
                  How It Works
                </button>
                <button
                  onClick={() => {
                    handleScroll("testimony");
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full text-left rounded-lg bg-white/40 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-white transition"
                >
                  Testimonials
                </button>

                <div className="border-t border-[#D6E1E9]/30 mt-1 pt-2">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="w-full rounded-lg bg-royalblue py-2.5 text-center text-xs font-bold text-swanwing transition hover:bg-sapphire"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    {/* Points & Bill for Landing Page logged in mobile view */}
                    <div className="flex flex-col gap-2 rounded-xl bg-white/70 p-2.5 border border-[#CFE0EC]/40 mb-2 font-bold">
                      <div className="flex items-center justify-between text-xs text-[#6B87A0]">
                        <span>Points Available</span>
                        <span className="text-sm font-black text-[#2F4054]">{new Intl.NumberFormat().format(totalPoints)}</span>
                      </div>
                      <div className="h-px bg-slate-100" />
                      <div className="flex items-center justify-between text-xs text-[#6B87A0]">
                        <span>Estimated Bill</span>
                        <span className="text-sm font-black text-[#2F4054]">{`$${estimatedCost.toFixed(4)}`}</span>
                      </div>
                    </div>

                    <Link to="/check-ats" onClick={() => setIsMobileNavOpen(false)}>
                      <button
                        type="button"
                        className="w-full rounded-lg bg-royalblue py-2.5 text-center text-xs font-bold text-swanwing transition hover:bg-sapphire"
                      >
                        Check ATS
                      </button>
                    </Link>
                  </SignedIn>
                </div>
              </nav>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Stepper info */}
                <div className="rounded-xl bg-[#E8EEF4]/50 p-2.5 text-xs text-[#2F4054]">
                  <p className="font-black text-[#2F4054] mb-1 text-[10px] tracking-wider uppercase">ATS Progress</p>
                  <div className="flex flex-col gap-1.5 font-bold">
                    {workflowSteps.map((step, index) => {
                      const stepNumber = index + 1;
                      const isComplete = stepNumber < currentStep;
                      const isCurrent = stepNumber === currentStep;
                      return (
                        <div key={step.key} className="flex items-center gap-2">
                          <span className={`h-5 w-5 flex items-center justify-center rounded-full text-[10px] shrink-0 ${
                            isComplete ? "bg-[#6D879A] text-white" : isCurrent ? "bg-[#2F4054] text-white" : "bg-[#D8E3EB] text-[#6B87A0]"
                          }`}>
                            {isComplete ? "✓" : stepNumber}
                          </span>
                          <span className={isCurrent ? "text-[#2F4054] font-black" : "text-[#6B87A0]"}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-col gap-2 rounded-xl bg-white/70 p-2.5 border border-[#CFE0EC]/40">
                  <div className="flex items-center justify-between text-xs font-bold text-[#6B87A0]">
                    <span>Points Available</span>
                    <span className="text-sm font-black text-[#2F4054]">{new Intl.NumberFormat().format(totalPoints)}</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between text-xs font-bold text-[#6B87A0]">
                    <span>Estimated Bill</span>
                    <span className="text-sm font-black text-[#2F4054]">{`$${estimatedCost.toFixed(4)}`}</span>
                  </div>
                </div>

                {/* Navigation actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/dashboard" onClick={() => setIsMobileNavOpen(false)} className="w-full">
                    <button
                      type="button"
                      className="w-full flex h-10 items-center justify-center gap-2 rounded-xl border border-[#CFE0EC] bg-white px-3 text-[13px] font-black text-[#2F4054]"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleBack();
                      setIsMobileNavOpen(false);
                    }}
                    className="w-full flex h-10 items-center justify-center gap-2 rounded-xl border border-[#CFE0EC] bg-white px-3 text-[13px] font-black text-[#2F4054]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
