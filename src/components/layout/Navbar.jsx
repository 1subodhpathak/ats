import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Check,
  FileText,
  FilePenLine,
  ScrollText,
  MessagesSquare,
  Award,
  Gamepad2,
  LayoutDashboard,
  ReceiptText,
  Zap,
  Star,
  Menu,
  X,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import useResumeStore from "../../store/useResumeStore";
import colorLogo from "../../assets/logos/BlueLogo.png";
import { calculateAtsUsage } from "../../services/subscriptionService";
import { getSavedReports } from "../../services/reportApi";
import { getResumes } from "../../services/resumeApi";
import { getJobDescriptions } from "../../services/jobDescriptionApi";
import goldenLogo from "../../assets/logos/GoldenLogo.png";
import CustomUserButton from "../common/CustomUserButton";

const atsCareerTools = [
  { href: "https://resume.careersenseai.com/", label: "AI Resume Builder", description: "Create an ATS-ready resume", icon: FilePenLine, tone: "text-blue-700 bg-blue-100" },
  { href: "https://coverletter.careersenseai.com/", label: "Cover Letter Builder", description: "Write a tailored introduction", icon: ScrollText, tone: "text-violet-700 bg-violet-100" },
  { href: "https://careersenseai.com/interview-simulator", label: "Interview Simulator", description: "Practise role-specific interviews", icon: MessagesSquare, tone: "text-amber-700 bg-amber-100" },
  { href: "https://certifi.careersenseai.com/", label: "Skill Certification", description: "Prove job-ready capabilities", icon: Award, tone: "text-cyan-700 bg-cyan-100" },
];

function getCachedItems(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const isLandingPage = location.pathname === "/";
  const isDarkNavbarPage =
    location.pathname.startsWith("/check-ats/resume") ||
    location.pathname.startsWith("/reports/analysis/") ||
    location.pathname.startsWith("/reports/basic/") ||
    location.pathname.startsWith("/repository/report/");
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [subData, setSubData] = React.useState({ plan: "free", tokensRemaining: 30000 });

  const currentResume = useResumeStore((state) => state.currentResume);
  const isResumeJdFlow = !!(currentResume?.latestAnalysis?.jdText || location.pathname.includes("resume-jd"));

  const [totalPoints, setTotalPoints] = React.useState(() => {
    const cachedReports = getCachedItems("careersense_ats_reports_cache");
    const cachedResumes = getCachedItems("careersense_ats_resumes_cache");
    const cachedJd = getCachedItems("careersense_ats_jd_cache");
    return calculateAtsUsage([], cachedReports, cachedResumes, cachedJd).totalPoints;
  });
  const [estimatedCost, setEstimatedCost] = React.useState(() => {
    const cachedReports = getCachedItems("careersense_ats_reports_cache");
    const cachedResumes = getCachedItems("careersense_ats_resumes_cache");
    const cachedJd = getCachedItems("careersense_ats_jd_cache");
    return calculateAtsUsage([], cachedReports, cachedResumes, cachedJd).estimatedCost;
  });

  React.useEffect(() => {
    if (!user?.id) return;
    const fetchSub = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "https://server.datasenseai.com";
        const backendUrl = apiBase.replace(/\/careersense\/ats\/?$/, "");

        const [statusRes, ledgerRes, reportsResult, resumesResult, jdResult] = await Promise.allSettled([
          fetch(`${backendUrl}/careersense/subscription/status?clerkId=${user.id}`),
          fetch(`${backendUrl}/careersense/subscription/ledger?clerkId=${user.id}`),
          getSavedReports(),
          getResumes(),
          getJobDescriptions(),
        ]);

        if (statusRes.status === "fulfilled") {
          try {
            const data = await statusRes.value.json();
            if (data.success) {
              setSubData({ plan: data.plan || "free", tokensRemaining: data.tokensRemaining ?? 30000 });
            }
          } catch {}
        }

        let serverLedger = [];
        if (ledgerRes.status === "fulfilled" && ledgerRes.value?.ok) {
          try {
            const ledgerData = await ledgerRes.value.json();
            serverLedger = Array.isArray(ledgerData.ledger) ? ledgerData.ledger : [];
          } catch {}
        }

        const reports = reportsResult.status === "fulfilled" && Array.isArray(reportsResult.value?.data)
          ? reportsResult.value.data
          : getCachedItems("careersense_ats_reports_cache");

        const resumes = resumesResult.status === "fulfilled" && Array.isArray(resumesResult.value?.data)
          ? resumesResult.value.data
          : getCachedItems("careersense_ats_resumes_cache");

        const jobDescriptions = jdResult.status === "fulfilled" && Array.isArray(jdResult.value?.data)
          ? jdResult.value.data
          : getCachedItems("careersense_ats_jd_cache");

        const usage = calculateAtsUsage(serverLedger, reports, resumes, jobDescriptions);
        setTotalPoints(usage.totalPoints);
        setEstimatedCost(usage.estimatedCost);
      } catch (err) {
        console.error("Error fetching subscription in Navbar:", err);
      }
    };
    fetchSub();

    const handleTokensUpdated = () => fetchSub();
    window.addEventListener("careersense:tokens-updated", handleTokensUpdated);
    return () => {
      window.removeEventListener("careersense:tokens-updated", handleTokensUpdated);
    };
  }, [user?.id]);

  const workflowSteps = isResumeJdFlow
    ? [
      { key: "details", label: "Details" },
      { key: "resume", label: "Resume" },
      { key: "job", label: "Job Details" },
      { key: "report", label: "Report" },
    ]
    : [
      { key: "details", label: "Details" },
      { key: "resume", label: "Resume" },
      { key: "report", label: "Report" },
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
        location.pathname.startsWith("/reports/basic/") ||
        location.pathname.startsWith("/repository/report/")
      ) {
        return 4;
      }
    } else {
      if (
        location.pathname.startsWith("/reports/analysis/") ||
        location.pathname.startsWith("/reports/basic/") ||
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
    <div className="hidden items-center gap-2 md:flex">
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/90 px-3 py-1.5 shadow-2xs">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-500 shrink-0">
          <Star className="h-3.5 w-3.5" fill="currentColor" />
        </div>
        <div className="flex flex-col text-left leading-none">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 leading-tight">AI Tokens Remaining</p>
          <p className="text-xs font-black text-slate-900 leading-none mt-0.5">{(subData.tokensRemaining ?? 30000).toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/90 px-3 py-1.5 shadow-2xs">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0">
          <span className="text-xs font-black">$</span>
        </div>
        <div className="flex flex-col text-left leading-none">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 leading-tight">Bill</p>
          <p className="text-xs font-black text-slate-900 leading-none mt-0.5">${estimatedCost.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );

  const InternalLogo = () => (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <img src={isDarkNavbarPage ? goldenLogo : colorLogo} alt="CareerSense Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-2xl shadow-xs shrink-0" />

      <div className={`pr-3 xl:border-r ${isDarkNavbarPage ? "xl:border-white/20" : "xl:border-[#D6E1E9]"}`}>
        <h1 className="text-[25px] font-black leading-none tracking-[-0.04em]">
          {/* CareerSense */}
          <span className={isDarkNavbarPage ? "text-[#FFF8E9]" : "text-[#0B3453]"}>Career</span><span className="text-[#C88A26]">Sense</span>
        </h1>
        <p className={`mt-1 text-[9px] font-black uppercase tracking-[0.28em] ${isDarkNavbarPage ? "text-[#D7E3E9]" : "text-[#56768A]"}`}>
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
          <span className="text-[#0B3453]">Career</span><span className="text-[#C88A26]">Sense</span>
        </h1>
        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-[#56768A]">
          ATS Intelligence
        </p>
      </div>
    </Link>
  );

  const InternalStepper = () => (
    <nav className="flex min-w-0 flex-1 items-center justify-center overflow-hidden px-1">
      {workflowSteps.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={step.key}>
            <div
              className={`flex min-w-0 shrink items-center gap-1 rounded-full px-1.5 py-1 transition ${isCurrent ? (isDarkNavbarPage ? "bg-white/10" : "bg-[#E8EEF4]") : "bg-transparent"
                }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${isComplete
                  ? (isDarkNavbarPage ? "bg-[#C88A26] text-[#062E47]" : "bg-[#6D879A] text-white")
                  : isCurrent
                    ? (isDarkNavbarPage ? "bg-[#FFF8E9] text-[#062E47]" : "bg-[#2F4054] text-white")
                    : (isDarkNavbarPage ? "bg-white/15 text-[#D7E3E9]" : "bg-[#D8E3EB] text-[#6B87A0]")
                  }`}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : stepNumber}
              </div>

              <span
                className={`hidden whitespace-nowrap text-[12px] font-black tracking-tight xl:inline ${isDarkNavbarPage ? (isCurrent ? "text-[#FFF8E9]" : "text-[#B9CBD5]") : (isCurrent ? "text-[#2F4054]" : "text-[#6B87A0]")
                  }`}
              >
                {step.label}
              </span>
            </div>

            {index < workflowSteps.length - 1 ? (
              <div className={`mx-1 hidden h-px min-w-2 max-w-5 flex-1 xl:block ${isDarkNavbarPage ? "bg-white/25" : "bg-[#A8B8C4]"}`} />
            ) : null}
          </React.Fragment>
        );
      })}
    </nav>
  );

  const InternalActions = () => (
    <div className="flex shrink-0 items-center gap-2">
      <InternalUsagePill />

      <Link
        to="/play-with-resume"
        className="flex h-10 items-center gap-2 rounded-xl border border-[#D6A33D] bg-[#FFF3D7] px-3 text-[13px] font-black text-[#8B5B0E] shadow-[0_8px_20px_rgba(143,93,14,0.08)] transition hover:-translate-y-0.5 hover:bg-[#FFEAC0]"
      >
        <Gamepad2 className="h-4 w-4" />
        <span className="hidden 2xl:inline">Resume Quest</span>
      </Link>

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
          ? "relative z-50 w-full border-b border-[#D9C9AA]/65 bg-[#FBF8F1]/96 shadow-[0_8px_24px_rgba(11,52,83,0.10)] backdrop-blur-md"
          : isDarkNavbarPage
            ? "brand-type relative z-50 w-full border-b border-[#C99531]/35 bg-[rgba(6,46,71,0.96)] text-[#FFF8E9] shadow-[0_10px_30px_rgba(3,25,39,0.20)] backdrop-blur-xl"
            : "relative z-50 w-full border-b backdrop-blur-xl border-[#D6E1E9]/45 bg-[#F7F3ED]/96 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
      }
    >
      <div
        className={
          isLandingPage
            ? "mx-auto flex flex-col w-full max-w-[1600px] px-4 py-2.5 sm:px-8 sm:py-3"
            : "mx-auto flex flex-col w-full max-w-[1600px] px-4 py-2.5 sm:px-8 sm:py-3"
        }
      >
        <div className="flex w-full items-center justify-between gap-3">
          {isLandingPage ? <LandingLogo /> : <InternalLogo />}

          {isLandingPage ? (
            <nav className="hidden items-center gap-6 md:flex">
              <div
                className="relative shrink-0"
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setToolsOpen((val) => !val)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#38566C] transition hover:text-[#B8791D]"
                >
                  Career Tools
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
                </button>
                {toolsOpen && (
                  <div className="absolute left-0 top-full w-[330px] pt-3 z-50">
                    <div
                      className="rounded-2xl border border-[#D9C9AA] p-2.5 shadow-[0_20px_50px_rgba(11,52,83,0.22)] text-[#103650]"
                      style={{ backgroundColor: '#FAF6ED' }}
                    >
                      <div className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#B8791D]">
                        CareerSense Tools
                      </div>
                      {atsCareerTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <a
                            key={tool.label}
                            href={tool.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#F0E6D2]"
                          >
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.tone}`}>
                              <Icon size={17} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-xs font-extrabold text-[#103650]">{tool.label}</span>
                              <span className="mt-0.5 block truncate text-[11px] text-[#5D7B8C]">{tool.description}</span>
                            </span>
                          </a>
                        );
                      })}
                      <a
                        href="https://careersenseai.com/#career-tools"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-black text-[#B8791D] transition hover:bg-[#F0E6D2]"
                      >
                        Explore all career tools
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleScroll("why-careersense")}
                className="text-xs font-bold text-[#38566C] transition hover:text-[#B8791D]"
              >
                Why CareerSense
              </button>

              <button
                onClick={() => handleScroll("ats-report-coverage")}
                className="text-xs font-bold text-[#38566C] transition hover:text-[#B8791D]"
              >
                ATS Report
              </button>

              <button
                onClick={() => handleScroll("how-it-works")}
                className="text-xs font-bold text-[#38566C] transition hover:text-[#B8791D]"
              >
                How It Works
              </button>

              <Link
                to="/play-with-resume"
                className="relative inline-flex items-center gap-1.5 rounded-lg border border-[#D6A33D]/70 bg-[#FFF3D7] px-3 py-2 text-xs font-black text-[#8B5B0E] transition hover:border-[#C88A26] hover:bg-[#FFEAC0]"
              >
                <Gamepad2 className="h-3.5 w-3.5" />
                Resume Quest
                <span className="absolute -right-3 -top-2 inline-flex items-center gap-1 rounded-full border border-[#BDE6D2] bg-[#EAF8F1] px-1.5 py-0.5 text-[8px] font-black uppercase leading-none tracking-[0.08em] text-[#147A56] shadow-sm">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#27A878] opacity-50 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#16865E]" />
                  </span>
                  Play &amp; Win AI Tokens
                </span>
              </Link>
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
                      className="flex items-center gap-1 rounded-lg border border-[#0B3453]/25 bg-[#FFFDF8] px-4 py-2 text-xs font-bold text-[#0B3453] transition hover:border-[#C88A26]/60 hover:bg-[#F8EEDB]"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-3">
                    <InternalUsagePill />
                    <Link to="/dashboard" className="shrink-0">
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-lg bg-[#0B3453] px-4 py-2 text-xs font-bold text-[#FFF9EC] shadow-sm transition hover:bg-[#124767]"
                      >
                        Dashboard
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </SignedIn>
              </div>

              <SignedIn>
                <CustomUserButton />
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
                <CustomUserButton />
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
                <div className="rounded-xl border border-[#D9C9AA]/60 bg-white/70 p-2.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B8791D] mb-1.5">Career Tools</p>
                  <div className="flex flex-col gap-1">
                    {atsCareerTools.map((tool) => (
                      <a
                        key={tool.label}
                        href={tool.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-bold text-[#103650] hover:bg-[#F3EADB]/60"
                      >
                        <span>{tool.label}</span>
                        <span className="text-[10px] text-[#B8791D]">↗</span>
                      </a>
                    ))}
                  </div>
                </div>

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
                    handleScroll("ats-report-coverage");
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full text-left rounded-lg bg-white/40 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-white transition"
                >
                  ATS Report
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

                <Link
                  to="/play-with-resume"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#D6A33D] bg-[#FFF3D7] px-3 py-2.5 text-xs font-black text-[#8B5B0E] transition hover:bg-[#FFEAC0]"
                >
                  <span className="inline-flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" />
                    Start Resume Quest
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#BDE6D2] bg-[#EAF8F1] px-2 py-1 text-[9px] font-black uppercase leading-none tracking-[0.08em] text-[#147A56]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16865E]" aria-hidden="true" />
                    Play &amp; Win AI Tokens
                  </span>
                </Link>

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
                        <span>AI Tokens Remaining</span>
                        <span className="text-sm font-black text-[#2F4054]">{(subData.tokensRemaining ?? 30000).toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-slate-100" />
                      <div className="flex items-center justify-between text-xs text-[#6B87A0]">
                        <span>Estimated Bill</span>
                        <span className="text-sm font-black text-[#2F4054]">{`$${estimatedCost.toFixed(4)}`}</span>
                      </div>
                    </div>

                    <Link to="/dashboard" onClick={() => setIsMobileNavOpen(false)}>
                      <button
                        type="button"
                        className="w-full rounded-lg bg-royalblue py-2.5 text-center text-xs font-bold text-swanwing transition hover:bg-sapphire"
                      >
                        Dashboard
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
                    <span>AI Tokens Remaining</span>
                    <span className="text-sm font-black text-[#2F4054]">{(subData.tokensRemaining ?? 30000).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between text-xs font-bold text-[#6B87A0]">
                    <span>Estimated Bill</span>
                    <span className="text-sm font-black text-[#2F4054]">{`$${estimatedCost.toFixed(4)}`}</span>
                  </div>
                </div>

                {/* Navigation actions */}
                <Link
                  to="/play-with-resume"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#D6A33D] bg-[#FFF3D7] px-3 text-[13px] font-black text-[#8B5B0E]"
                >
                  <Gamepad2 className="h-4 w-4" />
                  Start Resume Quest
                </Link>

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
