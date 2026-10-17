import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Coins, Download, FolderOpen, ListChecks, Loader2, Lock, RefreshCw, Sparkles, X } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Loader from "../../components/common/Loader";
import ReportGenerationLoader from "../../components/common/ReportGenerationLoader";
import Toast from "../../components/common/Toast";
import InsufficientTokensModal from "../../components/common/InsufficientTokensModal";
import DownloadGateModal from "../../components/common/DownloadGateModal";
import ATSReportNextStepsModal from "../../components/common/ATSReportNextStepsModal";
import BasicATSPrintReport from "../components/BasicATSPrintReport";
import { generateAnalysisReport } from "../../services/reportApi";
import { getBasicAnalysisReport, saveBasicReportToRepository } from "../services/basicReportApi";
import { checkDownloadPass } from "../../services/downloadGateService";
import { fetchSubscriptionStatus, isPaidPlan } from "../../services/subscriptionService";
import apiClient from "../../services/apiClient";
import reportBackground from "../../assets/home/report.png";

const BASIC_REPORT_SECTIONS = [
  "Overview",
  "Score Breakdown",
  "Requirements",
  "Strengths",
  "Skill Gaps",
  "Keyword Coverage",
  "ATS Optimization",
  "Final Verdict",
];

function BasicATSReportPage() {
  const { user } = useUser();
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationReport = location.state?.basicReport;
  const [report, setReport] = useState(navigationReport || null);
  const [status, setStatus] = useState(navigationReport ? "success" : "loading");
  const [error, setError] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isPlanUpgradeModalOpen, setIsPlanUpgradeModalOpen] = useState(false);
  const [isCheckingPlan, setIsCheckingPlan] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [tokensRemaining, setTokensRemaining] = useState(0);
  const [isDownloadGateOpen, setIsDownloadGateOpen] = useState(false);
  const [isCheckingPass, setIsCheckingPass] = useState(false);
  const [tokenModal, setTokenModal] = useState({ isOpen: false, currentBalance: 0, minRequired: 15000 });
  const acceptUpgradeRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [hasDetailedReport, setHasDetailedReport] = useState(false);
  const [isNextStepsModalOpen, setIsNextStepsModalOpen] = useState(false);
  const isPrintMode = new URLSearchParams(location.search).get("printMode") === "1";

  useEffect(() => {
    if (status !== "success" || !report || isPrintMode) return;
    const reportKey = report?.resume_id || analysisId || "default";
    try {
      const alreadySeen = sessionStorage.getItem(`cs_ats_nudge_seen_${reportKey}`);
      if (!alreadySeen) {
        const timer = setTimeout(() => {
          setIsNextStepsModalOpen(true);
        }, 1600);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [status, report, analysisId, isPrintMode]);

  useEffect(() => {
    const resumeId = report?.resume_id || analysisId;
    if (!resumeId) return;

    try {
      const cached = window.sessionStorage.getItem(`careersense.detailedReport.v1.${resumeId}`)
        || window.localStorage.getItem(`careersense.detailedReport.v1.${resumeId}`);
      if (cached) {
        setHasDetailedReport(true);
        return;
      }
    } catch {}

    let active = true;
    apiClient.get(`/resumes/${resumeId}/analysis/latest`)
      .then((res) => {
        if (!active) return;
        const data = res?.data;
        if (data?.report_level === "detailed" || (Array.isArray(data?.analysis_points) && data.analysis_points.length > 0)) {
          setHasDetailedReport(true);
        }
      })
      .catch(() => {});

    return () => { active = false; };
  }, [report?.resume_id, analysisId]);

  useEffect(() => {
    if (navigationReport) return undefined;
    let active = true;
    getBasicAnalysisReport(analysisId)
      .then(({ data }) => { if (active) { setReport(data); setStatus("success"); } })
      .catch((requestError) => { if (active) { setError(requestError?.response?.data?.detail || requestError?.message || "Unable to load the Basic ATS report."); setStatus("error"); } });
    return () => { active = false; };
  }, [analysisId, navigationReport]);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    fetchSubscriptionStatus(user.id).then((sub) => {
      if (active && sub) {
        setUserPlan(sub.plan || "free");
        setTokensRemaining(sub.tokensRemaining ?? 0);
      }
    });
    return () => { active = false; };
  }, [user?.id]);

  useEffect(() => {
    if (status !== "success" || !new URLSearchParams(location.search).get("autoPrint")) return undefined;
    const timer = window.setTimeout(() => window.print(), 500);
    return () => window.clearTimeout(timer);
  }, [location.search, status]);

  useEffect(() => {
    if (!isUpgradeModalOpen) return undefined;
    acceptUpgradeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !upgrading) setIsUpgradeModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUpgradeModalOpen, upgrading]);

  const handleUpgradeClick = async () => {
    if (upgrading || isCheckingPlan) return;

    if (hasDetailedReport) {
      navigate(`/reports/analysis/${report?.resume_id || analysisId}`);
      return;
    }

    setIsCheckingPlan(true);
    try {
      const sub = user?.id
        ? await fetchSubscriptionStatus(user.id)
        : { plan: "free", tokensRemaining: 0 };
      setUserPlan(sub.plan || "free");
      setTokensRemaining(sub.tokensRemaining ?? 0);

      if (!isPaidPlan(sub.plan)) {
        setIsPlanUpgradeModalOpen(true);
        return;
      }

      if ((sub.tokensRemaining ?? 0) < 15000) {
        setTokenModal({
          isOpen: true,
          currentBalance: sub.tokensRemaining ?? 0,
          minRequired: 15000,
        });
        return;
      }

      setIsUpgradeModalOpen(true);
    } catch {
      setIsPlanUpgradeModalOpen(true);
    } finally {
      setIsCheckingPlan(false);
    }
  };

  const upgrade = async () => {
    if (!report || upgrading) return;
    setIsUpgradeModalOpen(false);
    setUpgrading(true);
    setError("");
    try {
      const generated = await generateAnalysisReport({ resume_id: report.resume_id, jd_text: report.jdText || undefined });
      setHasDetailedReport(true);
      navigate(`/reports/analysis/${report.resume_id}`, {
        state: { detailedReport: generated?.data },
      });
    } catch (requestError) {
      const isTokenError =
        requestError?.response?.status === 402 ||
        requestError?.response?.data?.error === "INSUFFICIENT_TOKENS" ||
        requestError?.response?.data?.message?.toLowerCase()?.includes("token") ||
        requestError?.message?.toLowerCase()?.includes("token");

      if (isTokenError) {
        setTokenModal({
          isOpen: true,
          currentBalance: requestError?.response?.data?.currentBalance ?? 0,
          minRequired: requestError?.response?.data?.minRequired ?? 15000,
        });
      } else {
        setError(requestError?.response?.data?.detail || "Unable to generate the detailed analysis.");
      }
      setUpgrading(false);
    }
  };

  const saveToRepository = async () => {
    if (!report || saveStatus === "loading" || report.saved_report_id) return;
    setSaveStatus("loading");
    setSaveMessage("");
    try {
      const response = await saveBasicReportToRepository(report);
      setReport((current) => current ? {
        ...current,
        saved_report_id: response.data?.report_id || current.resume_id,
      } : current);
      setSaveStatus("success");
      setSaveMessage("Basic report saved to your repository.");
    } catch (requestError) {
      setSaveStatus("error");
      setSaveMessage(requestError?.response?.data?.detail || "Unable to save the Basic report right now.");
    }
  };

  const executeDownloadReport = () => {
    if (!report?.resume_id) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setError("Your browser blocked the PDF preview. Please allow pop-ups and try again.");
      return;
    }

    try {
      // Seed the new tab directly. A Basic report contains fields that may not yet
      // be available in the backend copy immediately after generation.
      printWindow.sessionStorage.setItem(
        `careersense.basicReport.v1.${report.resume_id}`,
        JSON.stringify(report)
      );
      printWindow.location.replace(
        `/reports/basic/${report.resume_id}?printMode=1&autoPrint=1`
      );
    } catch {
      printWindow.close();
      setError("Unable to prepare the Basic report download. Please try again.");
    }
  };

  const downloadReport = async () => {
    if (!report?.resume_id || isCheckingPass) return;

    if (!user?.id) {
      setIsDownloadGateOpen(true);
      return;
    }

    setIsCheckingPass(true);
    try {
      const passCheck = await checkDownloadPass(
        user.id,
        "ats_report",
        report.resume_id || analysisId || "default"
      );
      if (!passCheck.canDownload) {
        setIsDownloadGateOpen(true);
        return;
      }
    } catch (e) {
      console.warn("Download pass verification check error:", e);
    } finally {
      setIsCheckingPass(false);
    }

    executeDownloadReport();
  };

  if (status === "loading") return <div className="brand-type mx-auto max-w-5xl px-4 py-8"><Loader label="Loading Basic ATS report..." /></div>;
  if (status === "error") return <div className="brand-type mx-auto max-w-5xl px-4 py-8"><Toast message={error} variant="error" /></div>;

  if (isPrintMode) {
    return (
      <main className="brand-type min-h-screen bg-white p-0">
        <BasicATSPrintReport report={report} />
      </main>
    );
  }

  const generatedDate = new Date(report?.generated_at || report?.created_at || Date.now())
    .toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  const navigateToSection = (index) => {
    document.querySelectorAll(".basic-report-document .basic-print-page")[index]
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="brand-type min-h-screen bg-[#F7F2E9] px-4 py-5 text-[#0B3550] sm:px-5 lg:px-6">
      <ReportGenerationLoader
        open={upgrading}
        analysisType={report.analysis_type === "resume_jd" ? "resume_jd" : "resume"}
        reportLevel="detailed"
      />

      {isUpgradeModalOpen ? (
        <div
          className="fixed inset-0 z-[140] grid place-items-center bg-[#062E47]/55 p-4 backdrop-blur-[6px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !upgrading) setIsUpgradeModalOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="premium-upgrade-title"
            aria-describedby="premium-upgrade-description"
            className="relative w-full max-w-[470px] overflow-hidden rounded-[24px] border border-[#E2D7C5] bg-[#FFFDF8] shadow-[0_30px_85px_rgba(5,42,66,.30)]"
          >
            <div className="h-[3px] bg-[#D59A2E]" />
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(false)}
              aria-label="Close upgrade confirmation"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-[#D8E1E5] bg-[#F7F4ED] text-[#567386] transition hover:bg-[#EEE8DC]"
            >
              <X size={15} />
            </button>

            <div className="px-6 pb-6 pt-7 sm:px-8">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FFF0CF] text-[#B9790D]">
                <ListChecks size={22} />
              </div>
              <p className="mt-5 text-[8px] font-black uppercase tracking-[.2em] text-[#A56C10]">Premium Analysis</p>
              <h2 id="premium-upgrade-title" className="mt-2 text-[23px] font-black leading-[1.2] tracking-[-.025em] text-[#103650]">
                Upgrade to the Detailed 50-Point Report?
              </h2>
              <p id="premium-upgrade-description" className="mt-3 text-[11.5px] font-medium leading-[1.65] text-[#617D8E]">
                The 50-point detailed analysis is a premium feature. It reviews deeper ATS checks, evidence, recruiter readiness, and targeted improvements.
              </p>

              <div className="mt-5 flex items-center gap-4 rounded-[14px] border border-[#E7C77D] bg-[#FFF6E2] px-4 py-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0B3B59] text-[#F0C45A]"><Coins size={19} /></span>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[.15em] text-[#8F6725]">Required for this report</p>
                  <p className="mt-0.5 text-[18px] font-black text-[#103650]">15,000 Tokens</p>
                </div>
              </div>

              <p className="mt-4 text-[8.5px] font-medium leading-[1.5] text-[#78909E]">
                Tokens will only be used after you accept and report generation begins.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#E8E1D7] bg-[#FAF6EE] px-6 py-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsUpgradeModalOpen(false)} className="rounded-[9px] border border-[#C9D6DD] bg-[#FFFDF8] px-5 py-2.5 text-[10px] font-black text-[#31566D] transition hover:bg-[#F1F4F4]">
                Cancel
              </button>
              <button ref={acceptUpgradeRef} type="button" onClick={upgrade} className="rounded-[9px] bg-[#0B3B59] px-5 py-2.5 text-[10px] font-black text-white shadow-[0_8px_18px_rgba(11,59,89,.16)] transition hover:bg-[#0D4968]">
                Accept &amp; Generate
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {isPlanUpgradeModalOpen ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#041E30]/75 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsPlanUpgradeModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPlanUpgradeModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B] transition hover:bg-[#E2E8F0] hover:text-[#0F172A]"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8CE92] bg-[#FFF6E3] text-[#A66B0D] shadow-xs">
              <Sparkles className="h-7 w-7 text-[#D3A445]" />
            </div>

            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5A442]/45 bg-[#FFF3D9] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#99620A]">
                <Lock className="h-3 w-3" /> Pro Plan Feature
              </span>
              <h3 className="mt-2.5 text-xl font-black tracking-tight text-[#0B3B59]">
                Unlock Detailed 50-Point Analysis
              </h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-[#617D8E]">
                Detailed 50-Point Analysis is exclusive to paid plans. Upgrade your account to access in-depth recruiter checks, granular ATS scores, and bullet-by-bullet rewrites.
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-[#E9F0F4] bg-[#F7FAFC] p-3.5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1A435D]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5F3FA] text-[#0B3B59]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
                <span>50 comprehensive ATS diagnostic parameters</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1A435D]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5F3FA] text-[#0B3B59]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
                <span>AI-powered line rewrites and impact metrics</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1A435D]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5F3FA] text-[#0B3B59]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
                <span>Full recruiter readiness scorecard</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPlanUpgradeModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <a
                href="https://careersenseai.com/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0B3B59] to-[#0A4D78] text-xs font-bold text-white shadow-md hover:from-[#082E47] hover:to-[#083D60] transition"
              >
                Upgrade to Pro <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-[1680px] space-y-6">
        <section
          className="relative min-h-[235px] overflow-hidden rounded-[20px] border border-white/10 bg-cover bg-center text-white shadow-[0_22px_50px_rgba(6,43,67,.17)]"
          style={{ backgroundImage: `url(${reportBackground})` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,38,60,.98)_0%,rgba(5,43,67,.93)_38%,rgba(5,43,67,.62)_65%,rgba(5,43,67,.12)_100%)]" />
          <div className="relative flex min-h-[235px] flex-col justify-between gap-4 p-5 sm:p-6 lg:flex-row lg:items-end lg:p-7">
            <div className="max-w-[730px]">
              <Link to="/dashboard?section=reports" className="inline-flex items-center gap-2 text-[9px] font-bold text-[#D6E2E8] transition hover:text-white">
                <ChevronLeft size={14} />Back to Reports
              </Link>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#E8B94F]" />
                <span className="text-[8px] font-black uppercase tracking-[.24em] text-[#E8B94F]">Basic Report</span>
              </div>
              <h1 className="mt-2 font-serif text-[32px] font-semibold leading-none tracking-[-.035em] sm:text-[38px] lg:text-[42px]">
                ATS Compatibility Report
              </h1>
              <p className="mt-2 max-w-[650px] text-[11.5px] font-medium leading-[1.55] text-[#D1DEE5] sm:text-[12px]">
                A focused ATS assessment with the essential scores, skill gaps, keywords, and next steps for your application.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-medium text-[#D5E1E7]">
                <span>▣ &nbsp;Generated {generatedDate}</span><span className="hidden h-4 w-px bg-white/20 sm:block" />
                <span>◇ &nbsp;for {report.target_role || "your target role"}</span><span className="hidden h-4 w-px bg-white/20 sm:block" />
                <span>▤ &nbsp;Using {report.resume_file_name || `${report.candidate_name}'s resume`}</span>
              </div>
            </div>
            <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1 lg:justify-end">
              <button onClick={saveToRepository} disabled={saveStatus === "loading" || Boolean(report.saved_report_id)} className="inline-flex shrink-0 items-center gap-2 rounded-[9px] border border-white/25 bg-white/10 px-3 py-2 text-[9px] font-black text-white backdrop-blur-sm transition hover:bg-white/15 disabled:cursor-default disabled:opacity-70">
                <FolderOpen size={14} />{report.saved_report_id ? "Saved" : saveStatus === "loading" ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleUpgradeClick}
                disabled={upgrading || isCheckingPlan}
                className="inline-flex shrink-0 items-center gap-2 rounded-[9px] border border-white/25 bg-white/10 px-3 py-2 text-[9px] font-black text-white backdrop-blur-sm transition hover:bg-white/15 disabled:opacity-60"
              >
                {isCheckingPlan ? (
                  <Loader2 size={14} className="animate-spin text-amber-400" />
                ) : hasDetailedReport ? (
                  <ListChecks size={14} className="text-[#38BDF8]" />
                ) : !isPaidPlan(userPlan) ? (
                  <Lock size={13} className="text-[#E8B94F]" />
                ) : (
                  <ListChecks size={14} />
                )}
                {upgrading
                  ? "Generating..."
                  : isCheckingPlan
                  ? "Checking plan..."
                  : hasDetailedReport
                  ? "View Detailed 50 Point Analysis"
                  : "Upgrade to Detailed 50 Point Analysis"}
              </button>
              <button
                onClick={downloadReport}
                disabled={isCheckingPass}
                className="inline-flex shrink-0 items-center gap-2 rounded-[9px] border border-white/25 bg-white/10 px-3 py-2 text-[9px] font-black text-white backdrop-blur-sm transition hover:bg-white/15 disabled:opacity-60"
              >
                {isCheckingPass ? (
                  <Loader2 size={14} className="animate-spin text-amber-400" />
                ) : (
                  <Download size={14} />
                )}
                {isCheckingPass ? "Preparing..." : "Download"}
              </button>
              <button
                onClick={() => setIsNextStepsModalOpen(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[9px] border border-[#E8B94F]/60 bg-[#E8B94F]/20 px-3 py-2 text-[9px] font-black text-[#E8B94F] backdrop-blur-sm transition hover:bg-[#E8B94F]/35"
                title="View Recommended Next Career Steps"
              >
                <Sparkles size={14} className="text-[#E8B94F]" />
                Next Steps
              </button>
              <Link to="/check-ats" className="inline-flex shrink-0 items-center gap-2 rounded-[9px] border border-[#E8B94F] bg-[#E8B94F] px-3 py-2 text-[9px] font-black text-[#062B43]"><RefreshCw size={14} />New Check</Link>
            </div>
          </div>
        </section>

        {error ? <Toast message={error} variant="error" /> : null}
        {saveMessage ? <Toast message={saveMessage} variant={saveStatus === "error" ? "error" : "success"} /> : null}

        <div className={`grid gap-6 ${isSidebarMinimized ? "xl:grid-cols-[86px_minmax(0,1fr)]" : "xl:grid-cols-[255px_minmax(0,1fr)]"}`}>
          <aside className="hidden min-w-0 xl:block">
            <nav className="sticky top-6 overflow-hidden rounded-[20px] border border-[#E5DDD1] bg-[#FFFDF8] shadow-[0_16px_38px_rgba(6,43,67,.065)]" aria-label="Basic report sections">
              <div className="flex items-center justify-between bg-[#0A3A56] px-4 py-4 text-white">
                {!isSidebarMinimized ? <span className="text-[10px] font-black uppercase tracking-[.16em]">Report Sections</span> : null}
                <button type="button" onClick={() => setIsSidebarMinimized((value) => !value)} aria-label={isSidebarMinimized ? "Expand sidebar" : "Minimize sidebar"} className="ml-auto grid h-8 w-8 place-items-center rounded-[9px] border border-white/20 bg-white/10 transition hover:bg-white/15">
                  {isSidebarMinimized ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                </button>
              </div>
              <div className="space-y-1 p-3">
                {BASIC_REPORT_SECTIONS.map((label, index) => (
                  <button key={label} type="button" onClick={() => navigateToSection(index)} title={label} className={`flex w-full items-center rounded-[11px] p-2 text-left text-[11px] font-bold text-[#526F80] transition hover:bg-[#F8F4ED] hover:text-[#0B3550] ${isSidebarMinimized ? "justify-center" : "gap-3"}`}>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] border border-[#E2DBD0] bg-[#F3ECE0] text-[9px] font-black text-[#0B3550]">{index + 1}</span>
                    {!isSidebarMinimized ? <span className="truncate">{label}</span> : null}
                  </button>
                ))}
              </div>
            </nav>
          </aside>
          <div className="min-w-0 overflow-x-auto">
            <BasicATSPrintReport report={report} />
          </div>
        </div>
      </div>

      <InsufficientTokensModal
        isOpen={tokenModal.isOpen}
        onClose={() => setTokenModal((prev) => ({ ...prev, isOpen: false }))}
        currentBalance={tokenModal.currentBalance}
        minRequired={tokenModal.minRequired}
      />

      <DownloadGateModal
        isOpen={isDownloadGateOpen}
        onClose={() => setIsDownloadGateOpen(false)}
        clerkUser={user}
        resourceType="ats_report"
        resourceId={report?.resume_id || analysisId || "default"}
        resourceName="Basic ATS Analysis Report PDF"
        onSuccessDownload={executeDownloadReport}
      />

      <ATSReportNextStepsModal
        isOpen={isNextStepsModalOpen}
        onClose={() => setIsNextStepsModalOpen(false)}
        score={report?.overall_score || report?.score || 0}
        targetRole={report?.target_role || ""}
        analysisId={report?.resume_id || analysisId || ""}
      />
    </main>
  );
}

export default BasicATSReportPage;
