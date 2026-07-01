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
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import useResumeStore from "../../store/useResumeStore";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === "/";

  const currentResume = useResumeStore((state) => state.currentResume);
  const isResumeJdFlow = !!(currentResume?.latestAnalysis?.jdText || location.pathname.includes("resume-jd"));

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
          0
        </span>
      </div>

      <div className="h-4 w-px bg-[#D6E1E9]" />

      <div className="flex items-center gap-1.5">
        <ReceiptText className="h-3.5 w-3.5 text-[#6B87A0]" />
        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6B87A0]">
          Bill
        </span>
        <span className="text-sm font-black tracking-tight text-[#2F4054]">
          $0.0000
        </span>
      </div>
    </div>
  );

  const InternalLogo = () => (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F4054] text-white shadow-[0_10px_22px_rgba(16,36,90,0.14)]">
        <FileText className="h-5 w-5" />
      </div>

      <div className="hidden pr-3 sm:block xl:border-r xl:border-[#D6E1E9]">
        <h1 className="text-[15px] font-black leading-none tracking-tight text-[#2F4054]">
          CareerSense
        </h1>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#6B87A0]">
          ATS Intelligence
        </p>
      </div>
    </Link>
  );

  const LandingLogo = () => (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-royalblue text-swanwing shadow-md">
        <span className="text-lg font-black">CS</span>
      </div>

      <div>
        <h1 className="text-base font-black leading-none tracking-tight text-royalblue">
          CareerSense
        </h1>
        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-sapphire">
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
              className={`flex min-w-0 items-center gap-1.5 rounded-full px-2 py-1.5 transition ${
                isCurrent ? "bg-[#E8EEF4]" : "bg-transparent"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                  isComplete
                    ? "bg-[#6D879A] text-white"
                    : isCurrent
                      ? "bg-[#2F4054] text-white"
                      : "bg-[#D8E3EB] text-[#6B87A0]"
                }`}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : stepNumber}
              </div>

              <span
                className={`hidden whitespace-nowrap text-[13px] font-black tracking-tight xl:inline ${
                  isCurrent ? "text-[#2F4054]" : "text-[#6B87A0]"
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
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isLandingPage
          ? "border-shellstone/50 bg-swanwing/95 px-6 py-3 shadow-xs"
          : "border-[#D6E1E9] bg-[#F7F3ED]/96 px-4 py-2.5 shadow-[0_8px_22px_rgba(16,36,90,0.04)] lg:px-6"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-3 ${
          isLandingPage ? "max-w-7xl" : "max-w-[1680px]"
        }`}
      >
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

        {!isLandingPage ? (
          <div className="flex items-center gap-2 lg:hidden">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-black transition ${
                  isActive
                    ? "border-[#CFE0EC] bg-[#E8EEF4] text-[#2F4054]"
                    : "border-[#D6E1E9] bg-white text-[#6B87A0]"
                }`
              }
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </NavLink>

            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 rounded-xl border border-[#D6E1E9] bg-white px-3 py-2 text-xs font-black text-[#2F4054]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>
        ) : null}

        {isLandingPage ? (
          <div className="flex items-center gap-3">
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
              <UserButton afterSignOutUrl="/" />
              <Link to="/check-ats" className="shrink-0">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg bg-royalblue px-4 py-2 text-xs font-bold text-swanwing shadow-sm transition hover:bg-sapphire"
                >
                  Check ATS
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </SignedIn>
          </div>
        ) : (
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        )}
      </div>
    </header>
  );
}

export default Navbar;
