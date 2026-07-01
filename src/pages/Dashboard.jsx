import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Bolt,
  BriefcaseBusiness,
  Database,
  Download,
  Eye,
  FileCheck2,
  FileText,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  SearchCheck,
  Settings2,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import { uploadJobDescriptionFile, getJobDescriptions } from "../services/jobDescriptionApi";
import {
  getSavedReportPdfUrl,
  getSavedReports,
} from "../services/reportApi";
import { getResumes, uploadResume } from "../services/resumeApi";

const SECTION_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "reports", label: "My ATS Reports", icon: FileCheck2 },
  { id: "sources", label: "Data Sources", icon: Database },
  { id: "billing", label: "Usage & Billing", icon: Bolt },
  { id: "profile", label: "Profile Settings", icon: Settings2 },
];

const PROFILE_STORAGE_KEY = "careersense-dashboard-profile";
const DASHBOARD_SCALE = 0.75;

const DEFAULT_PROFILE = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  currentTitle: "",
};

function readStoredProfile() {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY) || "{}");
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatShortDate(value) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function estimateReportPoints(report) {
  const base = report.has_job_description ? 1825 : 1350;
  const scoreBonus = Math.round((report.overall_score || 0) * 4.75);
  return base + scoreBonus;
}

function estimateResumePoints() {
  return 180;
}

function estimateJdPoints() {
  return 95;
}

function formatPoints(value) {
  return new Intl.NumberFormat().format(Math.max(0, Math.round(value || 0)));
}

function formatUsd(value) {
  return `$${Number(value || 0).toFixed(4)}`;
}

function withTimeout(promise, timeoutMs = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => {
        reject(new Error("Request timed out"));
      }, timeoutMs);
    }),
  ]);
}

function SectionCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-[32px] border border-white/75 bg-white/72 shadow-[0_24px_50px_rgba(21,46,84,0.08)] backdrop-blur-sm ${className}`}
    >
      {children}
    </section>
  );
}

function SmallMetricCard({ label, value, subtext }) {
  return (
    <div className="rounded-[28px] border border-[#D5E2EC] bg-white/82 p-6 shadow-[0_18px_34px_rgba(21,46,84,0.06)]">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#6B88A0]">
        {label}
      </p>
      <p className="mt-4 text-[3rem] font-black leading-none tracking-[-0.05em] text-[#2F4054]">
        {value}
      </p>
      <p className="mt-3 text-base font-medium text-[#6A859B]">{subtext}</p>
    </div>
  );
}

function ProgressRow({ label, value, detail }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.98rem] font-bold text-[#2F4054]">{label}</span>
        <span className="text-[0.98rem] font-black text-[#2F4054]">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#DFE8EF]">
        <div
          className="h-full rounded-full bg-[#2F4054]"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      <p className="text-sm font-medium text-[#6A859B]">{detail}</p>
    </div>
  );
}

function DashboardSidebar({ activeSection, onSelectSection }) {
  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-r border-[#D7E3EC] bg-[linear-gradient(180deg,#E8F0F6_0%,#F6F1EA_68%,#FBF7F1_100%)]">
      <Link
        to="/"
        className="flex items-center gap-4 border-b border-[#D7E3EC] px-8 py-8 transition hover:bg-white/20"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F4054] text-white shadow-[0_14px_32px_rgba(18,36,72,0.18)]">
          <FileText className="h-7 w-7" />
        </div>
        <div>
          <p className="text-[2rem] font-black leading-none tracking-[-0.04em] text-[#2F4054]">
            CareerSense
          </p>
          <p className="mt-1 text-[12px] font-black uppercase tracking-[0.28em] text-[#6B88A0]">
            Workspace
          </p>
        </div>
      </Link>

      <nav className="space-y-2 px-5 py-8">
        {SECTION_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectSection(id)}
              className={`flex w-full items-center gap-4 rounded-[20px] border px-5 py-4 text-left transition ${active
                  ? "border-[#D4E0EA] bg-[#DCE7F1] text-[#2F4054] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]"
                  : "border-transparent bg-transparent text-[#66859C] hover:border-[#D8E3EC] hover:bg-white/45"
                }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[1.1rem] font-bold tracking-tight">{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function WorkspaceHeader({
  title,
  subtitle,
  totalPoints,
  estimatedCost,
  onStartBuilder,
}) {
  return (
    <div className="border-b border-[#D7E3EC] px-10 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.95rem] font-black tracking-[-0.04em] text-[#2F4054]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-[0.98rem] font-medium text-[#6A859B]">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#CFE0EC] bg-white/88 px-5 py-3 text-[#2F4054] shadow-[0_12px_26px_rgba(21,46,84,0.04)]">
            <Bolt className="h-4 w-4 text-[#6A859B]" />
            <span className="text-[0.96rem] font-bold text-[#6A859B]">
              Career Points Used
            </span>
            <span className="text-[1.05rem] font-black">{formatPoints(totalPoints)}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#CFE0EC] bg-white/88 px-5 py-3 text-[#2F4054] shadow-[0_12px_26px_rgba(21,46,84,0.04)]">
            <Gauge className="h-4 w-4 text-[#6A859B]" />
            <span className="text-[0.96rem] font-bold text-[#6A859B]">
              Estimated Cost
            </span>
            <span className="text-[1.05rem] font-black">{formatUsd(estimatedCost)}</span>
          </div>

          <button
            type="button"
            onClick={onStartBuilder}
            className="inline-flex items-center gap-3 rounded-[20px] bg-[#2F4054] px-6 py-3.5 text-[1rem] font-black text-white shadow-[0_18px_30px_rgba(18,36,72,0.18)] transition hover:-translate-y-0.5 hover:bg-[#3A4D64]"
          >
            <Sparkles className="h-5 w-5" />
            Check ATS
          </button>

          <div className="ml-2 flex items-center scale-110">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection({
  profile,
  reports,
  resumes,
  jobDescriptions,
  profileCompletion,
  onSelectSection,
  totalPoints,
}) {
  const latestReport = reports[0];
  const latestResume = resumes[0];
  const latestJd = jobDescriptions[0];
  const reportReadiness = reports.length ? Math.min(100, 35 + reports.length * 14) : 0;
  const sourceCoverage = Math.min(
    100,
    Math.round(((resumes.length + jobDescriptions.length) / 10) * 100)
  );

  return (
    <div className="space-y-8">
      <SectionCard className="grid gap-8 px-10 py-10 xl:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-[13px] font-black uppercase tracking-[0.3em] text-[#6B88A0]">
            Dashboard Overview
          </p>
          <h2 className="mt-6 text-[4.2rem] font-black leading-[0.92] tracking-[-0.08em] text-[#2F4054]">
            Welcome back,{" "}
            <span className="text-[#6F90A7]">
              {profile.fullName ? profile.fullName.split(" ")[0] : "there"}.
            </span>
          </h2>
          <p className="mt-6 max-w-4xl text-[1.18rem] font-medium leading-8 text-[#6A859B]">
            Your ATS workspace is live. Resume storage, job-description storage,
            ATS reports, billing visibility, and profile completion are all tracked
            here so you can pick up work anytime.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/check-ats"
              className="inline-flex items-center gap-3 rounded-[20px] bg-[#2F4054] px-7 py-4 text-[1.05rem] font-black text-white shadow-[0_18px_30px_rgba(18,36,72,0.16)] transition hover:-translate-y-0.5 hover:bg-[#394C63]"
            >
              <Sparkles className="h-5 w-5" />
              Check ATS
            </Link>
            <button
              type="button"
              onClick={() => onSelectSection("reports")}
              className="inline-flex items-center gap-3 rounded-[20px] border border-[#CFE0EC] bg-white px-7 py-4 text-[1.05rem] font-black text-[#2F4054] shadow-[0_10px_22px_rgba(21,46,84,0.04)] transition hover:-translate-y-0.5"
            >
              <FileCheck2 className="h-5 w-5" />
              Browse ATS Reports
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-3">
          <SmallMetricCard
            label="ATS Reports Created"
            value={reports.length}
            subtext="Saved for future access"
          />
          <SmallMetricCard
            label="Resumes Stored"
            value={resumes.length}
            subtext="Ready in Data Sources"
          />
          <SmallMetricCard
            label="JDs Stored"
            value={jobDescriptions.length}
            subtext={
              jobDescriptions.length ? "Available for Resume + JD" : "Add your first job description"
            }
          />
        </div>
      </SectionCard>

      <div className="grid gap-8 xl:grid-cols-[1.65fr_0.9fr]">
        <div className="space-y-8">
          <SectionCard className="px-8 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#DCE7F1] text-[2.5rem] font-black text-[#2F4054]">
                  {(profile.fullName || "F").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[2rem] font-black tracking-[-0.04em] text-[#2F4054]">
                    {profile.fullName || "Full Name"}
                  </p>
                  <p className="mt-1 text-[1.05rem] font-medium text-[#6A859B]">
                    {profile.currentTitle || "Complete your profile to personalize the workspace"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectSection("profile")}
                className="rounded-[18px] border border-[#CFE0EC] bg-[#EAF2FA] px-6 py-3 text-[1rem] font-bold text-[#2F4054]"
              >
                Edit Profile
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex items-center justify-between text-[#6A859B]">
                  <span className="text-[1rem] font-bold">{profileCompletion}% complete</span>
                  <span className="text-[1rem] font-black text-[#2F4054]">
                    {Object.values(profile).filter(Boolean).length}/{Object.keys(profile).length}
                  </span>
                </div>
                <div className="mt-3 h-4 overflow-hidden rounded-full bg-[#E2EAF1]">
                  <div
                    className="h-full rounded-full bg-[#2F4054]"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="px-8 py-8">
            <h3 className="text-[2rem] font-black tracking-[-0.04em] text-[#2F4054]">
              Workspace Activity
            </h3>
            <p className="mt-2 text-[1.02rem] font-medium text-[#6A859B]">
              A quick pulse on how much has been configured so far.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-[24px] border border-[#D9E4EC] bg-white/85 p-6">
                <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#6B88A0]">
                  Latest Report
                </p>
                <p className="mt-4 text-[1.3rem] font-black text-[#2F4054]">
                  {latestReport
                    ? latestReport.candidate_name || latestReport.resume_file_name
                    : "No ATS reports yet"}
                </p>
                <p className="mt-2 text-sm font-medium text-[#6A859B]">
                  {latestReport ? formatDate(latestReport.created_at) : "Run your first ATS check to populate this area."}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#D9E4EC] bg-white/85 p-6">
                <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#6B88A0]">
                  Latest Resume
                </p>
                <p className="mt-4 text-[1.3rem] font-black text-[#2F4054]">
                  {latestResume ? latestResume.file_name : "No resume stored yet"}
                </p>
                <p className="mt-2 text-sm font-medium text-[#6A859B]">
                  {latestResume ? formatDate(latestResume.updated_at) : "Upload a resume from Data Sources."}
                </p>
              </div>

              <div className="rounded-[24px] border border-[#D9E4EC] bg-white/85 p-6">
                <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#6B88A0]">
                  Latest JD
                </p>
                <p className="mt-4 text-[1.3rem] font-black text-[#2F4054]">
                  {latestJd ? latestJd.title : "No job description stored yet"}
                </p>
                <p className="mt-2 text-sm font-medium text-[#6A859B]">
                  {latestJd ? formatDate(latestJd.created_at) : "Upload a JD to support Resume + JD analysis."}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <ProgressRow
                label="Profile Completion"
                value={profileCompletion}
                detail={`${Object.values(profile).filter(Boolean).length} of ${Object.keys(profile).length} profile fields filled`}
              />
              <ProgressRow
                label="ATS Reports Coverage"
                value={reportReadiness}
                detail={`${reports.length} saved report${reports.length === 1 ? "" : "s"} available in My ATS Reports`}
              />
              <ProgressRow
                label="Data Sources Attached"
                value={sourceCoverage}
                detail={`${resumes.length + jobDescriptions.length} source file${resumes.length + jobDescriptions.length === 1 ? "" : "s"} stored in your workspace`}
              />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-8">
          <SectionCard className="px-8 py-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[1.8rem] font-black tracking-[-0.04em] text-[#2F4054]">
                Profile Snapshot
              </h3>
              <button
                type="button"
                onClick={() => onSelectSection("profile")}
                className="rounded-[16px] border border-[#CFE0EC] bg-white px-4 py-2 text-sm font-bold text-[#6A859B]"
              >
                Edit
              </button>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#D8E4EC] bg-white/84 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#DCE7F1] text-[#2F4054]">
                  <UserRound className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-[1.6rem] font-black text-[#2F4054]">
                    {profile.currentTitle || "Profile not completed"}
                  </p>
                  <p className="mt-1 text-[1rem] font-medium text-[#6A859B]">
                    {profile.location || "Add your city or location"}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="px-8 py-8">
            <h3 className="text-[1.8rem] font-black tracking-[-0.04em] text-[#2F4054]">
              System Metrics
            </h3>
            <div className="mt-8 space-y-7">
              <ProgressRow
                label="Profile Completeness"
                value={profileCompletion}
                detail={`${Object.values(profile).filter(Boolean).length} of ${Object.keys(profile).length} fields filled`}
              />
              <ProgressRow
                label="Workspace Activity"
                value={Math.min(100, Math.round(totalPoints / 40))}
                detail={`${formatPoints(totalPoints)} Career Sense Points estimated from ATS activity`}
              />
              <ProgressRow
                label="JD Readiness"
                value={jobDescriptions.length ? 100 : 0}
                detail={
                  jobDescriptions.length
                    ? "Resume + JD analysis is available."
                    : "Upload at least one job description to unlock full tailoring workflows."
                }
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function ReportsSection({ reports }) {
  return (
    <SectionCard className="px-10 py-8">
      <h2 className="text-[2.25rem] font-black tracking-[-0.04em] text-[#2F4054]">
        My ATS Reports
      </h2>
      <p className="mt-3 text-[1.05rem] font-medium text-[#6A859B]">
        Every ATS report you save is stored here so you can open it again anytime.
      </p>

      <div className="mt-8 space-y-4">
        {reports.length ? (
          reports.map((report) => (
            <div
              key={report.report_id}
              className="flex flex-wrap items-center justify-between gap-5 rounded-[24px] border border-[#D8E4EC] bg-white/86 px-6 py-5"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#EEF4F9] text-[#6A859B]">
                  <FileCheck2 className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[1.45rem] font-black tracking-[-0.03em] text-[#2F4054]">
                    {report.candidate_name || report.resume_file_name}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-[#8AA0B2]">
                    Resume file: {report.resume_file_name}
                  </p>
                  <p className="mt-1 text-[1rem] font-medium text-[#6A859B]">
                    {report.report_type === "resume_jd" ? "Resume + JD" : "Resume Only"} · Saved {formatDate(report.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-[#D0DDE8] bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#6B88A0]">
                  Score {report.overall_score}
                </div>
                <a
                  href={getSavedReportPdfUrl(report.report_id)}
                  className="inline-flex items-center gap-2 rounded-[16px] border border-[#CFE0EC] bg-white px-4 py-3 text-sm font-bold text-[#2F4054]"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </a>
                <Link
                  to={`/repository/report/${report.report_id}`}
                  className="inline-flex items-center gap-2 rounded-[16px] bg-[#2F4054] px-4 py-3 text-sm font-bold text-white"
                >
                  <Eye className="h-4 w-4" />
                  View Report
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[26px] border border-dashed border-[#D1DFE9] bg-white/70 px-8 py-16 text-center">
            <p className="text-[1.6rem] font-black text-[#2F4054]">No ATS reports saved yet.</p>
            <p className="mt-3 text-[1rem] font-medium text-[#6A859B]">
              Run an ATS check and save the report to make it available here for later review.
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

function DataSourcesSection({
  resumes,
  jobDescriptions,
  onUploadResumeClick,
  onUploadJdClick,
  isUploadingResume,
  isUploadingJd,
}) {
  return (
    <div className="space-y-8">
      <SectionCard className="px-10 py-8">
        <h2 className="text-[2.25rem] font-black tracking-[-0.04em] text-[#2F4054]">
          Data Sources
        </h2>
        <p className="mt-3 text-[1.05rem] font-medium text-[#6A859B]">
          Store resumes and job descriptions here, then reuse them during ATS checks anytime.
        </p>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <button
            type="button"
            onClick={onUploadResumeClick}
            disabled={isUploadingResume}
            className="flex items-center justify-between rounded-[24px] border border-[#D4E0EA] bg-white/86 px-6 py-6 text-left shadow-[0_14px_24px_rgba(21,46,84,0.04)] disabled:opacity-70"
          >
            <div>
              <p className="text-[1.65rem] font-black tracking-[-0.04em] text-[#2F4054]">
                Upload Resume
              </p>
              <p className="mt-2 text-[1rem] font-medium text-[#6A859B]">
                PDF, DOC, or DOCX resumes are stored with their upload date.
              </p>
            </div>
            <Upload className="h-7 w-7 text-[#6A859B]" />
          </button>

          <button
            type="button"
            onClick={onUploadJdClick}
            disabled={isUploadingJd}
            className="flex items-center justify-between rounded-[24px] border border-[#D4E0EA] bg-white/86 px-6 py-6 text-left shadow-[0_14px_24px_rgba(21,46,84,0.04)] disabled:opacity-70"
          >
            <div>
              <p className="text-[1.65rem] font-black tracking-[-0.04em] text-[#2F4054]">
                Upload Job Description
              </p>
              <p className="mt-2 text-[1rem] font-medium text-[#6A859B]">
                PDF, TXT, DOC, DOCX, or Markdown files are supported.
              </p>
            </div>
            <Upload className="h-7 w-7 text-[#6A859B]" />
          </button>
        </div>
      </SectionCard>

      <div className="grid gap-8 xl:grid-cols-2">
        <SectionCard className="px-8 py-8">
          <h3 className="text-[1.9rem] font-black tracking-[-0.04em] text-[#2F4054]">
            Stored Resumes
          </h3>
          <p className="mt-2 text-[1rem] font-medium text-[#6A859B]">
            Available in Resume Only and Resume + JD workflows.
          </p>

          <div className="mt-8 space-y-4">
            {resumes.length ? (
              resumes.map((resume) => (
                <div
                  key={resume.resume_id}
                  className="flex items-center justify-between gap-4 rounded-[22px] border border-[#D9E4EC] bg-white/84 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[1.25rem] font-black text-[#2F4054]">
                      {resume.file_name}
                    </p>
                    <p className="mt-1 text-[0.98rem] font-medium text-[#6A859B]">
                      Saved {formatShortDate(resume.updated_at)}
                    </p>
                  </div>
                  <div className="rounded-full border border-[#D5E2EC] bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.18em] text-[#6B88A0]">
                    Resume
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#D2DFE8] px-8 py-14 text-center">
                <FolderOpen className="mx-auto h-10 w-10 text-[#7C97AB]" />
                <p className="mt-4 text-[1.4rem] font-black text-[#2F4054]">
                  No resumes stored yet.
                </p>
                <p className="mt-2 text-[1rem] font-medium text-[#6A859B]">
                  Upload one and it becomes available across ATS workflows.
                </p>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard className="px-8 py-8">
          <h3 className="text-[1.9rem] font-black tracking-[-0.04em] text-[#2F4054]">
            Stored Job Descriptions
          </h3>
          <p className="mt-2 text-[1rem] font-medium text-[#6A859B]">
            Available when running ATS checks with Resume + JD matching.
          </p>

          <div className="mt-8 space-y-4">
            {jobDescriptions.length ? (
              jobDescriptions.map((jd) => (
                <div
                  key={jd.job_description_id}
                  className="rounded-[22px] border border-[#D9E4EC] bg-white/84 px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[1.25rem] font-black text-[#2F4054]">
                      {jd.title || "Untitled job description"}
                    </p>
                    <div className="rounded-full border border-[#D5E2EC] bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.18em] text-[#6B88A0]">
                      JD
                    </div>
                  </div>
                  <p className="mt-1 text-[0.98rem] font-medium text-[#6A859B]">
                    Saved {formatShortDate(jd.created_at)}
                  </p>
                  {jd.excerpt ? (
                    <p className="mt-3 text-sm leading-6 text-[#6A859B]">{jd.excerpt}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#D2DFE8] px-8 py-14 text-center">
                <BriefcaseBusiness className="mx-auto h-10 w-10 text-[#7C97AB]" />
                <p className="mt-4 text-[1.4rem] font-black text-[#2F4054]">
                  No job descriptions stored yet.
                </p>
                <p className="mt-2 text-[1rem] font-medium text-[#6A859B]">
                  Add a JD here and it becomes reusable inside Resume + JD analysis.
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function BillingSection({ totalPoints, estimatedCost, ledger }) {
  return (
    <div className="space-y-8">
      <SectionCard className="px-10 py-8">
        <p className="text-[13px] font-black uppercase tracking-[0.28em] text-[#6B88A0]">
          Platform Metrics
        </p>
        <h2 className="mt-3 text-[2.25rem] font-black tracking-[-0.04em] text-[#2F4054]">
          Usage & Billing Ledger
        </h2>
        <p className="mt-2 text-[1.05rem] font-medium text-[#6A859B]">
          Track ATS analysis activity through Career Sense Points. Estimated cost
          is calculated using your rule: $1 = 1,00,000 Career Sense Points.
        </p>

        <div className="mt-8 grid gap-5 xl:grid-cols-3">
          <SmallMetricCard
            label="Career Points Used"
            value={formatPoints(totalPoints)}
            subtext="Total ATS activity across saved operations"
          />
          <SmallMetricCard
            label="Estimated Cost"
            value={formatUsd(estimatedCost)}
            subtext="Based on current Career Sense Point conversion"
          />
          <SmallMetricCard
            label="Logged Actions"
            value={ledger.length}
            subtext="Saved ATS, resume, and JD events"
          />
        </div>
      </SectionCard>

      <SectionCard className="px-10 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[1.9rem] font-black tracking-[-0.04em] text-[#2F4054]">
              Transaction History
            </h3>
            <p className="mt-2 text-[1rem] font-medium text-[#6A859B]">
              Estimated ATS compute ledger built from saved reports and stored sources.
            </p>
          </div>
          <div className="rounded-full border border-[#CFE0EC] bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.18em] text-[#6B88A0]">
            System Logs
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-[#D7E3EC] bg-white/84">
          <div className="grid grid-cols-[1.35fr_1.25fr_1fr_0.6fr] gap-4 border-b border-[#E2EAF1] px-6 py-4 text-[12px] font-black uppercase tracking-[0.2em] text-[#6B88A0]">
            <span>Operation</span>
            <span>Resource</span>
            <span>Timestamp</span>
            <span className="text-right">Units</span>
          </div>

          <div className="divide-y divide-[#E8EEF3]">
            {ledger.length ? (
              ledger.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.35fr_1.25fr_1fr_0.6fr] gap-4 px-6 py-5"
                >
                  <div>
                    <p className="text-[1.08rem] font-black text-[#2F4054]">
                      {item.operation}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#6A859B]">
                      {item.detail}
                    </p>
                  </div>
                  <p className="text-[1rem] font-medium text-[#6A859B]">{item.resource}</p>
                  <p className="text-[1rem] font-medium text-[#6A859B]">{formatDate(item.timestamp)}</p>
                  <p className="text-right text-[1.08rem] font-black text-[#2F4054]">
                    {formatPoints(item.units)}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-[1rem] font-medium text-[#6A859B]">
                No ATS activity logged yet.
              </div>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function ProfileSection({ profileDraft, onChange, onSave }) {
  return (
    <SectionCard className="px-10 py-8">
      <h2 className="text-[2.25rem] font-black tracking-[-0.04em] text-[#2F4054]">
        Profile Settings
      </h2>
      <p className="mt-3 max-w-4xl text-[1.05rem] font-medium text-[#6A859B]">
        Save your profile details here so CareerSense can personalize your workspace and future builder sessions.
      </p>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Field
          label="Full Name"
          value={profileDraft.fullName}
          onChange={(value) => onChange("fullName", value)}
          placeholder="Full Name"
        />
        <Field
          label="Email Address"
          value={profileDraft.email}
          onChange={(value) => onChange("email", value)}
          placeholder="email@gmail.com"
        />
        <Field
          label="Phone Number"
          value={profileDraft.phone}
          onChange={(value) => onChange("phone", value)}
          placeholder="9999999999"
        />
        <Field
          label="Location / City"
          value={profileDraft.location}
          onChange={(value) => onChange("location", value)}
          placeholder="New York"
        />
        <Field
          label="LinkedIn / Portfolio"
          value={profileDraft.linkedin}
          onChange={(value) => onChange("linkedin", value)}
          placeholder="linkedin.com/in/your-name"
        />
        <Field
          label="Current Job Title"
          value={profileDraft.currentTitle}
          onChange={(value) => onChange("currentTitle", value)}
          placeholder="Director, CEO, VP, Analyst..."
        />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#DCE6EE] pt-6">
        <p className="text-[1rem] font-medium text-[#6A859B]">
          Changes are saved locally to prefill future ATS workspace sessions.
        </p>
        <button
          type="button"
          onClick={onSave}
          className="rounded-[20px] bg-[#2F4054] px-6 py-3.5 text-[1rem] font-black text-white shadow-[0_18px_30px_rgba(18,36,72,0.16)]"
        >
          Save Configuration
        </button>
      </div>
    </SectionCard>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-[12px] font-black uppercase tracking-[0.24em] text-[#6B88A0]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 h-[58px] w-full rounded-[20px] border border-[#CFE0EC] bg-white px-5 text-[1.05rem] font-medium text-[#2F4054] outline-none transition focus:border-[#AFC8DB] focus:ring-2 focus:ring-[#DCE7F1]"
      />
    </label>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [profileDraft, setProfileDraft] = useState(() => readStoredProfile());
  const [profile, setProfile] = useState(() => readStoredProfile());
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingJd, setIsUploadingJd] = useState(false);
  const resumeInputRef = useRef(null);
  const jdInputRef = useRef(null);

  const activeSection = searchParams.get("section") || "overview";
  const activeSectionMeta =
    SECTION_ITEMS.find((item) => item.id === activeSection) || SECTION_ITEMS[0];

  const loadWorkspace = async () => {
    setStatus("loading");
    setError("");
    try {
      const [resumeResult, reportResult, jdResult] = await Promise.allSettled([
        withTimeout(getResumes()),
        withTimeout(getSavedReports()),
        withTimeout(getJobDescriptions()),
      ]);

      setResumes(
        resumeResult.status === "fulfilled" ? resumeResult.value.data || [] : []
      );
      setReports(
        reportResult.status === "fulfilled" ? reportResult.value.data || [] : []
      );
      setJobDescriptions(
        jdResult.status === "fulfilled" ? jdResult.value.data || [] : []
      );

      const failedSources = [
        resumeResult.status === "rejected" ? "resumes" : null,
        reportResult.status === "rejected" ? "reports" : null,
        jdResult.status === "rejected" ? "job descriptions" : null,
      ].filter(Boolean);

      if (failedSources.length > 0) {
        setToast(`Some workspace data could not be loaded: ${failedSources.join(", ")}.`);
        setToastVariant("error");
      }

      setStatus("success");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.detail ||
        "Unable to load the CareerSense workspace right now."
      );
      setStatus("error");
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  const ledger = useMemo(() => {
    const reportEntries = reports.map((report) => ({
      id: `report-${report.report_id}`,
      operation: report.has_job_description ? "ATS + JD Report" : "ATS Report",
      resource: report.candidate_name || report.resume_file_name,
      timestamp: report.created_at,
      units: estimateReportPoints(report),
      detail: report.has_job_description ? "Saved ATS report with job description alignment" : "Saved ATS report generated from resume analysis",
    }));

    const resumeEntries = resumes.map((resume) => ({
      id: `resume-${resume.resume_id}`,
      operation: "Resume Upload",
      resource: resume.file_name,
      timestamp: resume.updated_at,
      units: estimateResumePoints(),
      detail: "Stored in Data Sources for reuse",
    }));

    const jdEntries = jobDescriptions.map((jd) => ({
      id: `jd-${jd.job_description_id}`,
      operation: "Job Description Upload",
      resource: jd.title || "Untitled job description",
      timestamp: jd.created_at,
      units: estimateJdPoints(),
      detail: "Stored in Data Sources for Resume + JD workflows",
    }));

    return [...reportEntries, ...resumeEntries, ...jdEntries].sort(
      (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
    );
  }, [jobDescriptions, reports, resumes]);

  const totalPoints = useMemo(
    () => ledger.reduce((total, item) => total + item.units, 0),
    [ledger]
  );

  const estimatedCost = totalPoints / 100000;

  const profileCompletion = useMemo(() => {
    const filled = Object.values(profile).filter(
      (value) => typeof value === "string" && value.trim()
    ).length;
    return Math.round((filled / Object.keys(profile).length) * 100);
  }, [profile]);

  const handleSectionChange = (sectionId) => {
    setSearchParams({ section: sectionId });
  };

  const handleProfileChange = (key, value) => {
    setProfileDraft((current) => ({ ...current, [key]: value }));
  };

  const pushToast = (message, variant = "success") => {
    setToast(message);
    setToastVariant(variant);
  };

  const handleProfileSave = () => {
    setProfile(profileDraft);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileDraft));
    }
    pushToast("Profile settings saved.", "success");
  };

  const handleResumeUpload = async (file) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadingResume(true);
    try {
      await uploadResume(formData);
      pushToast("Resume uploaded to Data Sources.", "success");
      await loadWorkspace();
    } catch (requestError) {
      pushToast(
        requestError?.response?.data?.detail || "Resume upload failed.",
        "error"
      );
    } finally {
      setIsUploadingResume(false);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
    }
  };

  const handleJdUpload = async (file) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadingJd(true);
    try {
      await uploadJobDescriptionFile(formData);
      pushToast("Job description uploaded to Data Sources.", "success");
      await loadWorkspace();
    } catch (requestError) {
      pushToast(
        requestError?.response?.data?.detail || "Job description upload failed.",
        "error"
      );
    } finally {
      setIsUploadingJd(false);
      if (jdInputRef.current) {
        jdInputRef.current.value = "";
      }
    }
  };

  const sectionSubtitleMap = {
    overview: "Track ATS activity, saved reports, data sources, billing estimates, and profile readiness from one place.",
    reports: "Access every ATS report that has been generated and saved to your workspace.",
    sources: "Store and reuse resumes and job descriptions without uploading them again.",
    billing: "Monitor Career Sense Points and estimated billing derived from ATS operations.",
    profile: "Save your basic workspace profile details for future sessions.",
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F6F1EA]">
      <input
        ref={resumeInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(event) => handleResumeUpload(event.target.files?.[0] || null)}
      />
      <input
        ref={jdInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md"
        className="hidden"
        onChange={(event) => handleJdUpload(event.target.files?.[0] || null)}
      />

      <div className="relative h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(233,241,247,0.58)_0%,rgba(246,241,234,0.92)_28%,rgba(246,241,234,1)_100%)]">
        <div
          style={{
            zoom: DASHBOARD_SCALE,
            height: `${100 / DASHBOARD_SCALE}vh`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(108,136,160,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(108,136,160,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="pointer-events-none absolute -left-24 bottom-[-120px] h-[460px] w-[900px] rounded-full border border-[#DCE6EF] opacity-70" />
          <div className="pointer-events-none absolute left-[280px] top-[72px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_72%)]" />

          <div className="relative z-10 flex flex-1 min-h-0 overflow-hidden">
            <DashboardSidebar
              activeSection={activeSection}
              onSelectSection={handleSectionChange}
            />

            <div className="min-w-0 flex-1 overflow-y-auto">
              <WorkspaceHeader
                title={activeSectionMeta.label}
                subtitle={sectionSubtitleMap[activeSection]}
                totalPoints={totalPoints}
                estimatedCost={estimatedCost}
                onStartBuilder={() => navigate("/check-ats")}
              />

              <div className="px-10 py-8">
                {status === "loading" ? (
                  <Loader label="Loading CareerSense workspace..." />
                ) : null}
                {error ? <Toast message={error} variant="error" /> : null}
                {toast ? <Toast message={toast} variant={toastVariant} /> : null}

                {status === "success" ? (
                  <>
                    {activeSection === "overview" ? (
                      <OverviewSection
                        profile={profile}
                        reports={reports}
                        resumes={resumes}
                        jobDescriptions={jobDescriptions}
                        profileCompletion={profileCompletion}
                        onSelectSection={handleSectionChange}
                        totalPoints={totalPoints}
                      />
                    ) : null}

                    {activeSection === "reports" ? (
                      <ReportsSection reports={reports} />
                    ) : null}

                    {activeSection === "sources" ? (
                      <DataSourcesSection
                        resumes={resumes}
                        jobDescriptions={jobDescriptions}
                        onUploadResumeClick={() => resumeInputRef.current?.click()}
                        onUploadJdClick={() => jdInputRef.current?.click()}
                        isUploadingResume={isUploadingResume}
                        isUploadingJd={isUploadingJd}
                      />
                    ) : null}

                    {activeSection === "billing" ? (
                      <BillingSection
                        totalPoints={totalPoints}
                        estimatedCost={estimatedCost}
                        ledger={ledger}
                      />
                    ) : null}

                    {activeSection === "profile" ? (
                      <ProfileSection
                        profileDraft={profileDraft}
                        onChange={handleProfileChange}
                        onSave={handleProfileSave}
                      />
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
