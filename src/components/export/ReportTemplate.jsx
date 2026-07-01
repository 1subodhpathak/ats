import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileSearch,
  Gauge,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  Medal,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

import Card from "../common/Card";

export const REPORT_NAV_SECTIONS = [
  { id: "report-overview", label: "Overview", icon: ClipboardCheck },
  { id: "report-methodology", label: "Methodology", icon: ShieldCheck },
  { id: "report-jd-matrix", label: "JD Match", icon: Target },
  { id: "report-visuals", label: "Dashboard", icon: LayoutDashboard },
  { id: "report-quick-scan", label: "Quick Scan", icon: FileSearch },
  { id: "report-detailed", label: "Analysis", icon: BarChart3 },
  { id: "report-appendix", label: "Appendix", icon: ScrollText },
];

const COLORS = {
  navy: "#10245A",
  deep: "#07182F",
  dark: "#2F4054",
  muted: "#5C8194",
  border: "#CFE0EC",
  softBlue: "#E7F0F8",
  cream: "#F6F1EA",
  paper: "#FBF8F2",
  gold: "#FFB04A",
  success: "#2DBE8D",
  warning: "#FFB04A",
  danger: "#FF5A6E",
  purple: "#5D45D6",
};

const STATUS_STYLES = {
  passed: {
    label: "Passed",
    color: COLORS.success,
    bg: "rgba(45,190,141,0.12)",
    border: "rgba(45,190,141,0.26)",
  },
  strong: {
    label: "Strong",
    color: COLORS.success,
    bg: "rgba(45,190,141,0.12)",
    border: "rgba(45,190,141,0.26)",
  },
  good: {
    label: "Good",
    color: "#2F80ED",
    bg: "rgba(47,128,237,0.12)",
    border: "rgba(47,128,237,0.24)",
  },
  partial: {
    label: "Partial",
    color: COLORS.warning,
    bg: "rgba(255,176,74,0.14)",
    border: "rgba(255,176,74,0.28)",
  },
  needs_work: {
    label: "Needs Work",
    color: COLORS.warning,
    bg: "rgba(255,176,74,0.14)",
    border: "rgba(255,176,74,0.28)",
  },
  missing: {
    label: "Missing",
    color: COLORS.danger,
    bg: "rgba(255,90,110,0.12)",
    border: "rgba(255,90,110,0.26)",
  },
  critical: {
    label: "Critical",
    color: COLORS.danger,
    bg: "rgba(255,90,110,0.12)",
    border: "rgba(255,90,110,0.26)",
  },
  not_applicable: {
    label: "Not Applicable",
    color: "#64748B",
    bg: "rgba(100,116,139,0.10)",
    border: "rgba(100,116,139,0.18)",
  },
  not_enough_evidence: {
    label: "Not Enough Evidence",
    color: COLORS.muted,
    bg: "rgba(92,129,148,0.10)",
    border: "rgba(92,129,148,0.18)",
  },
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getNestedValue(obj, paths, fallback = null) {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, key) => acc?.[key], obj);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

export function normalizeScore(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numberValue)));
}

export function formatReportDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getScoreBand(score) {
  const safeScore = normalizeScore(score);

  if (safeScore >= 85) {
    return {
      label: "Strong",
      color: COLORS.success,
      bg: "rgba(45,190,141,0.12)",
    };
  }

  if (safeScore >= 70) {
    return {
      label: "Good",
      color: "#2F80ED",
      bg: "rgba(47,128,237,0.12)",
    };
  }

  if (safeScore >= 45) {
    return {
      label: "Needs Work",
      color: COLORS.warning,
      bg: "rgba(255,176,74,0.14)",
    };
  }

  return {
    label: "Critical",
    color: COLORS.danger,
    bg: "rgba(255,90,110,0.12)",
  };
}

export function getReportScores(report) {
  return {
    overall: normalizeScore(
      getNestedValue(report, [
        "scores.overall_resume_readiness",
        "executive_summary.overall_readiness_score",
        "overall_score",
      ])
    ),
    atsParse: getNestedValue(report, [
      "scores.ats_parse_rate",
      "executive_summary.ats_parse_score",
      "ats_essentials.parse_rate",
    ]),
    jdMatch: getNestedValue(report, [
      "scores.jd_match_score",
      "executive_summary.jd_match_score",
    ]),
    contentQuality: getNestedValue(report, [
      "scores.content_quality",
      "executive_summary.content_quality_score",
    ]),
    recruiterRisk: getNestedValue(report, [
      "scores.recruiter_risk",
      "executive_summary.risk_score",
    ]),
  };
}

function getReportMeta(report) {
  const analysisType =
    getNestedValue(report, ["metadata.analysis_type", "analysis_type"]) ===
    "resume_jd"
      ? "Resume + JD"
      : "Resume Only";

  const targetRole =
    getNestedValue(report, ["metadata.target_role", "target_role"]) ||
    "ATS Readiness";

  const jdMatchScore = getNestedValue(report, [
    "scores.jd_match_score",
    "executive_summary.jd_match_score",
  ]);

  return [
    analysisType,
    targetRole,
    jdMatchScore !== null && jdMatchScore !== undefined
      ? "JD Matching Enabled"
      : "General Resume Audit",
  ].filter(Boolean);
}

function getStatusStyle(status) {
  const normalized = String(status || "")
    .toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");

  return STATUS_STYLES[normalized] || STATUS_STYLES.not_enough_evidence;
}

function getSeverityStyle(severity) {
  const value = String(severity || "medium").toLowerCase();

  if (value === "high" || value === "critical") {
    return {
      label: "High",
      color: COLORS.danger,
      bg: "rgba(255,90,110,0.12)",
      border: "rgba(255,90,110,0.28)",
    };
  }

  if (value === "low") {
    return {
      label: "Low",
      color: COLORS.success,
      bg: "rgba(45,190,141,0.12)",
      border: "rgba(45,190,141,0.24)",
    };
  }

  return {
    label: "Medium",
    color: COLORS.warning,
    bg: "rgba(255,176,74,0.14)",
    border: "rgba(255,176,74,0.28)",
  };
}

export function StatusBadge({ status }) {
  const style = getStatusStyle(status);

  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em]"
      style={{
        color: style.color,
        backgroundColor: style.bg,
        borderColor: style.border,
      }}
    >
      {style.label}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const style = getSeverityStyle(severity);

  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em]"
      style={{
        color: style.color,
        backgroundColor: style.bg,
        borderColor: style.border,
      }}
    >
      {style.label}
    </span>
  );
}

export function ScorePill({ score, label = "Score" }) {
  const safeScore = normalizeScore(score);
  const band = getScoreBand(safeScore);

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black"
      style={{
        color: band.color,
        backgroundColor: band.bg,
      }}
    >
      <span>{label}</span>
      <span>{safeScore}/100</span>
    </span>
  );
}

export function ScoreRing({ score, size = 132 }) {
  const safeScore = normalizeScore(score);
  const band = getScoreBand(safeScore);
  const innerSize = size - 26;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${band.color} ${safeScore * 3.6}deg, rgba(226,236,243,0.88) 0deg)`,
        boxShadow: "0 20px 42px rgba(0,0,0,0.14)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full bg-white text-center"
        style={{
          width: innerSize,
          height: innerSize,
        }}
      >
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.16em]"
            style={{ color: COLORS.muted }}
          >
            Score
          </p>

          <p
            className="mt-1 text-[42px] font-black leading-none tracking-[-0.08em]"
            style={{ color: COLORS.navy }}
          >
            {safeScore}
          </p>

          <p
            className="mt-1 text-[10px] font-black uppercase tracking-[0.08em]"
            style={{ color: band.color }}
          >
            {band.label}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProgressBar({ value, label, rightLabel }) {
  const safeValue = normalizeScore(value);
  const band = getScoreBand(safeValue);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-black" style={{ color: COLORS.dark }}>
          {label}
        </p>
        <p className="text-xs font-black" style={{ color: COLORS.muted }}>
          {rightLabel || `${safeValue}%`}
        </p>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[#E8EEF4]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${safeValue}%`,
            backgroundColor: band.color,
          }}
        />
      </div>
    </div>
  );
}

function SnapshotMetric({ label, value, suffix = "/100" }) {
  const displayValue =
    value === null || value === undefined || value === "" ? "N/A" : value;

  return (
    <div
      className="rounded-2xl border px-4 py-3"
      style={{
        borderColor: "#DDEAF3",
        backgroundColor: "#F8FBFD",
      }}
    >
      <p
        className="text-[10px] font-black uppercase tracking-[0.14em]"
        style={{ color: COLORS.muted }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-lg font-black tracking-[-0.03em]"
        style={{ color: COLORS.dark }}
      >
        {displayValue}
        {displayValue !== "N/A" && suffix ? (
          <span className="ml-0.5 text-xs font-bold text-slate-400">
            {suffix}
          </span>
        ) : null}
      </p>
    </div>
  );
}

export function ReportCoverHero({ report, actions }) {
  const meta = getReportMeta(report);
  const scores = getReportScores(report);
  const scoreBand = getScoreBand(scores.overall);

  const candidateName =
    getNestedValue(report, ["metadata.candidate_name", "candidate_name"]) ||
    "Candidate";

  const resumeFileName =
    getNestedValue(report, ["metadata.resume_file_name", "resume_file_name"]) ||
    "Resume file";

  const createdAt = formatReportDate(
    getNestedValue(report, ["metadata.created_at", "created_at"])
  );

  const recommendation =
    getNestedValue(report, [
      "summary.recommendation",
      "executive_summary.recommendation",
      "final_recommendation.summary",
    ]) || "Review the priority fixes before applying.";

  const topFixes =
    getNestedValue(report, ["priority_fixes", "summary.top_fixes", "executive_summary.top_fixes"], []) ||
    [];

  return (
    <section
      className="relative overflow-hidden rounded-[40px] border px-7 py-8 text-white shadow-[0_28px_90px_rgba(16,36,90,0.22)] md:px-10 md:py-10"
      style={{
        borderColor: "rgba(255,255,255,0.14)",
        background:
          "radial-gradient(circle at 82% 18%, rgba(50,176,245,0.28), transparent 32%), linear-gradient(135deg, #07182F 0%, #10245A 42%, #0C385D 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,36,64,0) 0%, rgba(23,121,184,0.24) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-36"
        style={{
          clipPath: "polygon(0 42%, 100% 100%, 0 100%)",
          backgroundColor: "#1779B8",
          opacity: 0.88,
        }}
      />

      <div
        className="pointer-events-none absolute bottom-8 left-0 right-0 h-20"
        style={{
          clipPath: "polygon(0 0, 100% 38%, 100% 100%, 0 100%)",
          backgroundColor: "#2491D3",
          opacity: 0.72,
        }}
      />

      <div className="pointer-events-none absolute right-10 top-8 h-36 w-36 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute right-24 top-20 h-20 w-20 rounded-full border border-white/10" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-2xl font-black shadow-[0_18px_36px_rgba(0,0,0,0.18)]">
                <span style={{ color: COLORS.navy }}>CS</span>
              </div>

              <div>
                <p className="text-3xl font-black tracking-tight">CareerSense</p>
                <p className="mt-1 text-sm font-black uppercase tracking-[0.2em] text-[#80D4FF]">
                  ATS Intelligence
                </p>
              </div>
            </div>

            <div className="mt-9">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
                style={{
                  borderColor: "rgba(255,255,255,0.16)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              >
                <ShieldCheck className="h-4 w-4 text-[#FFB04A]" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#BFDDEE]">
                  Premium Diagnostic Report
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-[clamp(2.75rem,5.4vw,5.4rem)] font-black leading-[0.9] tracking-[-0.065em] text-white">
                ATS Analysis
                <br />
                Report
              </h1>

              <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-white/78 md:text-lg">
                A recruiter-ready diagnostic review of resume structure, ATS
                parsing, writing quality, keyword evidence, and application risk.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {meta.map((item) => (
                  <span
                    key={item}
                    className="rounded-full px-3.5 py-2 text-xs font-black uppercase tracking-[0.12em]"
                    style={{
                      backgroundColor: "rgba(255,176,74,0.14)",
                      color: "#FFD08A",
                      border: "1px solid rgba(255,176,74,0.25)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              {actions ? (
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {actions}
                </div>
              ) : null}
            </div>
          </div>

          <Card className="w-full max-w-[420px] rounded-[30px] border border-white/16 bg-white/95 p-5 text-[#2F4054] shadow-[0_22px_48px_rgba(9,18,36,0.28)] backdrop-blur-xl">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-5">
                <ScoreRing score={scores.overall} />

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#6F8CA2]">
                    Report Snapshot
                  </p>

                  <p className="mt-2 truncate text-2xl font-black tracking-[-0.04em] text-[#2F4054]">
                    {candidateName}
                  </p>

                  {resumeFileName && resumeFileName !== candidateName ? (
                    <p className="mt-1 truncate text-xs font-semibold text-[#6F8CA2]">
                      Resume file: {resumeFileName}
                    </p>
                  ) : null}

                  <div
                    className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black"
                    style={{
                      color: scoreBand.color,
                      backgroundColor: scoreBand.bg,
                    }}
                  >
                    {scoreBand.label}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SnapshotMetric label="ATS Parse" value={scores.atsParse} />
                <SnapshotMetric label="Content" value={scores.contentQuality} />
                <SnapshotMetric label="Risk" value={scores.recruiterRisk} />
                <SnapshotMetric label="Fixes" value={topFixes.length} suffix="" />
              </div>

              {scores.jdMatch !== null && scores.jdMatch !== undefined ? (
                <SnapshotMetric label="JD Match" value={scores.jdMatch} />
              ) : null}

              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: "#DDEAF3",
                  backgroundColor: "#F8FBFD",
                }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6F8CA2]">
                  Recommendation
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-[#2F4054]">
                  {recommendation}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/14 pt-5 text-sm font-bold text-white/88">
          <div className="flex flex-wrap items-center gap-4">
            <p>
              Prepared for: <span className="font-black">{candidateName}</span>
            </p>

            <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />

            <p>
              Resume: <span className="font-black">{resumeFileName}</span>
            </p>
          </div>

          {createdAt ? <p className="text-white/64">{createdAt}</p> : null}
        </div>
      </div>
    </section>
  );
}

export function ReportSectionShell({
  id,
  eyebrow,
  title,
  description,
  actions,
  children,
  status,
  score,
  issueCount,
  icon: Icon = ListChecks,
}) {
  const numericScore =
    score !== undefined && score !== null ? normalizeScore(score) : null;

  return (
    <Card
      id={id}
      className="scroll-mt-28 rounded-[32px] border bg-white p-5 shadow-[0_18px_46px_rgba(16,36,90,0.06)] md:p-6"
      style={{
        borderColor: COLORS.border,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                color: COLORS.navy,
                backgroundColor: COLORS.softBlue,
              }}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>

            {eyebrow ? (
              <p
                className="text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: COLORS.muted }}
              >
                {eyebrow}
              </p>
            ) : null}
          </div>

          <h2
            className="mt-3 text-2xl font-black tracking-[-0.04em] md:text-3xl"
            style={{ color: COLORS.dark }}
          >
            {title}
          </h2>

          {description ? (
            <p
              className="mt-2 max-w-4xl text-sm font-medium leading-6 md:text-[15px]"
              style={{ color: COLORS.muted }}
            >
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {numericScore !== null ? (
            <ScorePill score={numericScore} />
          ) : null}

          {issueCount !== undefined && issueCount !== null ? (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
              {issueCount} {issueCount === 1 ? "issue" : "issues"}
            </span>
          ) : null}

          {status ? <StatusBadge status={status} /> : null}

          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </Card>
  );
}

export function ReportNavigation({ actions = null }) {
  return (
    <div
      className="sticky top-3 z-20 rounded-[28px] border p-3 shadow-[0_18px_50px_rgba(16,36,90,0.09)] backdrop-blur-xl"
      style={{
        borderColor: COLORS.border,
        backgroundColor: "rgba(255,255,255,0.9)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
        <div
          className="mr-1 hidden items-center gap-2 rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] md:flex"
          style={{
            color: COLORS.navy,
            backgroundColor: COLORS.softBlue,
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Report Sections
        </div>

        {REPORT_NAV_SECTIONS.map((item) => {
          const Icon = item.icon || ListChecks;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-black transition hover:-translate-y-0.5"
              style={{
                borderColor: "#DDEAF3",
                backgroundColor: "#F8FBFD",
                color: COLORS.dark,
              }}
            >
              <Icon className="h-3.5 w-3.5 transition group-hover:text-[#10245A]" />
              {item.label}
            </a>
          );
        })}
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export function ReportMiniMetaBar({ report }) {
  const candidateName =
    getNestedValue(report, ["metadata.candidate_name", "candidate_name"]) ||
    "Candidate";

  const analysisType =
    getNestedValue(report, ["metadata.analysis_type", "analysis_type"]) ===
    "resume_jd"
      ? "Resume + JD"
      : "Resume Only";

  const createdAt = formatReportDate(
    getNestedValue(report, ["metadata.created_at", "created_at"])
  );

  const items = [
    { label: "Candidate", value: candidateName, icon: UserRound },
    { label: "Analysis", value: analysisType, icon: FileSearch },
    { label: "Generated", value: createdAt || "Today", icon: ClipboardCheck },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-2xl border bg-white px-4 py-3 shadow-[0_12px_30px_rgba(16,36,90,0.05)]"
          style={{ borderColor: COLORS.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: COLORS.softBlue,
                color: COLORS.navy,
              }}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p
                className="text-[10px] font-black uppercase tracking-[0.14em]"
                style={{ color: COLORS.muted }}
              >
                {label}
              </p>

              <p
                className="mt-1 truncate text-sm font-black"
                style={{ color: COLORS.dark }}
              >
                {value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MethodologySection({ report }) {
  const analysisType =
    getNestedValue(report, ["metadata.analysis_type", "analysis_type"]) ===
    "resume_jd"
      ? "resume_jd"
      : "resume_only";

  const methodologyBullets =
    analysisType === "resume_jd"
      ? [
          "Resume parsing and formatting: whether headings, roles, dates, tools and accomplishments can be extracted cleanly by ATS systems.",
          "JD requirement coverage: whether the resume proves the must-have responsibilities and qualifications from the target job description.",
          "Keyword and skills alignment: exact and semantic matches across role, tools, domain, and technical terms.",
          "Evidence strength: whether the resume merely mentions a skill or proves it with project scope, tools, impact and measurable results.",
          "Hiring risk flags: qualification gaps, missing technical depth, weak project specificity and recruiter objections.",
        ]
      : [
          "Resume parsing and formatting: whether headings, roles, dates, tools and accomplishments can be extracted cleanly by ATS systems.",
          "Content quality and impact: whether the resume shows outcomes, measurable results and recruiter-friendly language.",
          "Keyword and skill clarity: whether the role signal, toolset and functional strengths are obvious without guesswork.",
          "Evidence strength: whether important claims are backed by project scope, context and results instead of broad statements.",
          "Hiring risk flags: missing links, weak specificity, formatting issues and proof gaps that can slow down shortlisting.",
        ];

  const methodCards = [
    {
      number: "1",
      title: "Reliable Analysis",
      body:
        analysisType === "resume_jd"
          ? "Uses only the uploaded resume and current job description. No external assumptions are treated as facts."
          : "Uses only the uploaded resume and the evidence visible in its current wording, structure, and formatting.",
      tone: "#2583CF",
    },
    {
      number: "2",
      title: "Point-by-Point Checks",
      body:
        analysisType === "resume_jd"
          ? "Each major JD requirement is marked Strong, Partial or Gap with a short explanation."
          : "Each ATS and recruiter-readiness signal is checked with a clear score, status and explanation.",
      tone: "#F6A20A",
    },
    {
      number: "3",
      title: "Actionable Output",
      body:
        analysisType === "resume_jd"
          ? "The report ends with rewrite guidance, evidence notes and the highest-value changes to improve fit."
          : "The report ends with rewrite guidance and practical fixes to improve ATS safety and recruiter confidence.",
      tone: "#1EAD4E",
    },
  ];

  const legendItems = [
    {
      label: "STRONG",
      description: "Resume clearly proves the requirement.",
      bg: "#16A34A",
    },
    {
      label: "PARTIAL",
      description: "Some evidence exists but it needs stronger wording or proof.",
      bg: "#F5B800",
    },
    {
      label: "GAP",
      description: "No clear evidence found in the current resume.",
      bg: "#E52521",
    },
  ];

  return (
    <ReportSectionShell
      id="report-methodology"
      eyebrow="Scoring Logic"
      title="Methodology"
      description="The report checks the same way a professional inspection report works: first the big picture, then detailed checks with evidence, status and explanation."
      icon={ShieldCheck}
    >
      <div className="space-y-6">
        <div
          className="rounded-[30px] border px-6 py-6 md:px-8"
          style={{
            borderColor: "#D8E5F0",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 18px 40px rgba(16,36,90,0.04)",
          }}
        >
          <h3
            className="max-w-4xl text-[clamp(1.15rem,1.45vw,1.45rem)] font-extrabold tracking-[-0.03em] leading-[1.18]"
            style={{ color: "#143552" }}
          >
            How the CareerSense score is calculated
          </h3>

          <div className="mt-5 space-y-4">
            {methodologyBullets.map((item) => {
              const parts = item.split(":");
              const lead = parts.shift();
              const rest = parts.join(":");
              return (
                <div key={item} className="flex items-start gap-4">
                  <span
                    className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "#2583CF" }}
                  />
                  <p className="text-[14px] font-medium leading-6 text-slate-700 md:text-[15px]">
                    {lead ? <span className="font-bold text-[#1A3550]">{lead}:</span> : null}{" "}
                    {rest.trim()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {methodCards.map((card) => (
            <div
              key={card.number}
              className="rounded-[28px] border bg-white px-5 py-6"
              style={{
                borderColor: "#D8E5F0",
                boxShadow: "0 16px 36px rgba(16,36,90,0.04)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full text-[20px] font-black text-white"
                  style={{ backgroundColor: card.tone }}
                >
                  {card.number}
                </div>

                <div className="min-w-0">
                  <h4
                    className="text-[clamp(1rem,1.25vw,1.25rem)] font-black tracking-[-0.025em] leading-[1.15]"
                    style={{ color: "#163653" }}
                  >
                    {card.title}
                  </h4>
                  <p className="mt-3 text-[15px] font-medium leading-7 text-[#657B99]">
                    {card.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-4">
            <div
              className="h-[52px] w-[52px] rounded-full border bg-white"
              style={{ borderColor: "#D8E5F0" }}
            />
            <h3
              className="text-[clamp(1.35rem,1.85vw,1.75rem)] font-black tracking-[-0.03em]"
              style={{ color: "#143552" }}
            >
              Indicator Legend
            </h3>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-5">
                <span
                  className="inline-flex min-w-[116px] justify-center rounded-full px-5 py-2.5 text-[13px] font-black text-white"
                  style={{ backgroundColor: item.bg }}
                >
                  {item.label}
                </span>
                <p className="text-[15px] font-medium leading-7 text-[#657B99]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReportSectionShell>
  );
}

export function PriorityFixCards({ fixes = [] }) {
  const normalizedFixes = Array.isArray(fixes) ? fixes.slice(0, 5) : [];

  if (normalizedFixes.length === 0) {
    return (
      <EmptyState
        title="No priority fixes available"
        description="The report did not return priority fixes yet. Check the analysis generation payload."
      />
    );
  }

  return (
    <div className="space-y-3">
      {normalizedFixes.map((fix, index) => {
        const severity = fix.severity || fix.priority || "medium";

        return (
          <div
            key={`${fix.title || "fix"}-${index}`}
            className="rounded-2xl border bg-white p-4 shadow-[0_10px_28px_rgba(16,36,90,0.05)]"
            style={{ borderColor: COLORS.border }}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                style={{
                  background:
                    index < 2
                      ? COLORS.navy
                      : "linear-gradient(180deg,#FFBF5A,#FF9F2F)",
                }}
              >
                {fix.rank || index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className="text-base font-black"
                    style={{ color: COLORS.dark }}
                  >
                    {fix.title || "Priority fix"}
                  </h3>

                  <SeverityBadge severity={severity} />
                </div>

                {fix.evidence ? (
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    <span className="font-black text-slate-700">Evidence:</span>{" "}
                    {fix.evidence}
                  </p>
                ) : null}

                {fix.why_it_matters ? (
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    <span className="font-black text-slate-700">
                      Why it matters:
                    </span>{" "}
                    {fix.why_it_matters}
                  </p>
                ) : null}

                {fix.action || fix.recommended_action ? (
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    <span className="font-black text-slate-700">Action:</span>{" "}
                    {fix.action || fix.recommended_action}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function JdMatchMatrixCards({ rows = [] }) {
  const items = Array.isArray(rows) ? rows : [];

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No JD matrix available"
        description="Upload a job description to generate requirement-by-requirement matching."
      />
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((row, index) => (
        <div
          key={`${row.requirement || "requirement"}-${index}`}
          className="rounded-2xl border bg-white p-4 shadow-[0_10px_28px_rgba(16,36,90,0.045)]"
          style={{ borderColor: COLORS.border }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.14em]"
                style={{ color: COLORS.muted }}
              >
                JD Requirement
              </p>

              <h3
                className="mt-1 text-lg font-black tracking-[-0.03em]"
                style={{ color: COLORS.dark }}
              >
                {row.requirement || "Requirement"}
              </h3>
            </div>

            <StatusBadge status={row.status} />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div
              className="rounded-2xl border p-4"
              style={{
                borderColor: "#DDEAF3",
                backgroundColor: "#F8FBFD",
              }}
            >
              <p
                className="text-[10px] font-black uppercase tracking-[0.14em]"
                style={{ color: COLORS.muted }}
              >
                Resume Evidence
              </p>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                {row.resume_evidence ||
                  row.evidence ||
                  "No direct resume evidence detected."}
              </p>
            </div>

            <div
              className="rounded-2xl border p-4"
              style={{
                borderColor: "#DDEAF3",
                backgroundColor: "#FFFFFF",
              }}
            >
              <p
                className="text-[10px] font-black uppercase tracking-[0.14em]"
                style={{ color: COLORS.muted }}
              >
                Recommended Fix
              </p>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">
                {row.recommended_fix ||
                  row.recommendation ||
                  "Add direct evidence only if this requirement is true for your experience."}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReportDataTable({ columns = [], rows = [] }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: COLORS.border }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse text-left">
          <thead>
            <tr style={{ backgroundColor: COLORS.softBlue }}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.12em]"
                  style={{
                    color: COLORS.dark,
                    width: column.width,
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-t"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: rowIndex % 2 === 0 ? "#FFFFFF" : "#F8FBFD",
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-normal break-words px-4 py-3 align-top text-sm font-medium leading-6 text-slate-700"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CareerTimeline({ items = [] }) {
  const timeline = Array.isArray(items) ? items : [];

  if (timeline.length === 0) {
    return (
      <EmptyState
        icon={BriefcaseBusiness}
        title="No career timeline extracted"
        description="The report needs actual title, company, and date data from the experience section."
      />
    );
  }

  return (
    <div className="space-y-3">
      {timeline.map((item, index) => (
        <div key={`${item.title || "role"}-${index}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="mt-1 h-3 w-3 rounded-full"
              style={{
                backgroundColor:
                  index === timeline.length - 1 ? COLORS.success : "#A7B9C8",
              }}
            />
            {index < timeline.length - 1 ? (
              <div className="mt-1 h-full min-h-8 w-px bg-[#DDEAF3]" />
            ) : null}
          </div>

          <div className="min-w-0 pb-2">
            <p className="text-sm font-black" style={{ color: COLORS.dark }}>
              {item.title || "Role title missing"}
            </p>

            <p className="mt-0.5 text-xs font-bold" style={{ color: COLORS.muted }}>
              {item.company || "Company missing"}
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              {item.date_range ||
                [item.start_date, item.end_date].filter(Boolean).join(" - ") ||
                "Dates missing"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function InsightCard({
  type = "info",
  title,
  evidence,
  recommendation,
  rewrite,
}) {
  const config =
    type === "success"
      ? { icon: CheckCircle2, color: COLORS.success, bg: "rgba(45,190,141,0.08)" }
      : type === "error" || type === "critical"
        ? { icon: AlertTriangle, color: COLORS.danger, bg: "rgba(255,90,110,0.08)" }
        : type === "warning"
          ? { icon: AlertTriangle, color: COLORS.warning, bg: "rgba(255,176,74,0.10)" }
          : { icon: Sparkles, color: COLORS.muted, bg: "rgba(92,129,148,0.08)" };

  const Icon = config.icon;

  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: COLORS.border,
        backgroundColor: config.bg,
      }}
    >
      <div className="flex gap-3">
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white"
          style={{ color: config.color }}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-black" style={{ color: COLORS.dark }}>
            {title || "Insight"}
          </h3>

          {evidence ? (
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
              <span className="font-black text-slate-700">Evidence:</span>{" "}
              {evidence}
            </p>
          ) : null}

          {recommendation ? (
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
              <span className="font-black text-slate-700">Recommendation:</span>{" "}
              {recommendation}
            </p>
          ) : null}

          {rewrite ? (
            <div
              className="mt-3 rounded-xl border bg-white p-3"
              style={{ borderColor: COLORS.border }}
            >
              <p
                className="text-[10px] font-black uppercase tracking-[0.14em]"
                style={{ color: COLORS.muted }}
              >
                Suggested Rewrite
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                {rewrite}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PremiumLockedInsight({
  title = "This insight is available with PRO",
  description = "Upgrade to unlock the full analysis and see what recruiters and ATS see in your resume.",
}) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border p-6"
      style={{
        borderColor: COLORS.border,
        backgroundColor: "#F7F9FC",
      }}
    >
      <div className="pointer-events-none absolute inset-0 blur-sm">
        <div className="mx-auto mt-4 h-8 w-3/4 rounded-full bg-slate-200/70" />
        <div className="mx-auto mt-6 h-5 w-2/3 rounded-full bg-slate-200/60" />
        <div className="mx-auto mt-5 h-5 w-4/5 rounded-full bg-slate-200/60" />
        <div className="mx-auto mt-5 h-5 w-2/3 rounded-full bg-slate-200/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-md rounded-3xl border bg-white p-6 text-center shadow-[0_18px_44px_rgba(16,36,90,0.12)]">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(255,176,74,0.16)", color: COLORS.gold }}
        >
          <LockKeyhole className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-lg font-black" style={{ color: COLORS.dark }}>
          {title}
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
          {description}
        </p>

        <button
          type="button"
          className="mt-5 rounded-xl px-5 py-3 text-sm font-black text-white"
          style={{ backgroundColor: COLORS.purple }}
        >
          Upgrade to PRO
        </button>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon = FileSearch,
  title = "No data available",
  description = "This section does not have enough structured data yet.",
}) {
  return (
    <div
      className="rounded-2xl border p-6 text-center"
      style={{
        borderColor: COLORS.border,
        backgroundColor: "#F8FBFD",
      }}
    >
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{
          color: COLORS.navy,
          backgroundColor: COLORS.softBlue,
        }}
      >
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-base font-black" style={{ color: COLORS.dark }}>
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

export function ReportCTA({
  title = "Create ATS-safe version",
  description = "Turn this diagnostic report into a cleaner resume version before applying.",
  actionLabel = "Open Editor",
  onClick,
}) {
  return (
    <div
      className="rounded-3xl border p-5"
      style={{
        borderColor: "rgba(255,176,74,0.28)",
        background:
          "linear-gradient(135deg, rgba(255,176,74,0.16), rgba(231,240,248,0.58))",
      }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ color: COLORS.navy, backgroundColor: "#FFFFFF" }}
          >
            <Medal className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-lg font-black" style={{ color: COLORS.dark }}>
              {title}
            </h3>

            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(16,36,90,0.16)]"
          style={{ backgroundColor: COLORS.navy }}
        >
          {actionLabel}
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ReportPageShell({
  label,
  title,
  description,
  children,
  footerLeft = "CareerSense ATS Intelligence",
  footerCenter = "ATS Analysis Report",
  pageNumber,
}) {
  return (
    <section
      className="relative min-h-[1123px] overflow-hidden bg-[#FBF8F2] px-12 py-10 text-[#2F4054]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(16,36,90,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(16,36,90,0.045) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white"
            style={{ backgroundColor: COLORS.navy }}
          >
            CS
          </div>

          <div>
            <p className="text-sm font-black tracking-tight" style={{ color: COLORS.navy }}>
              CareerSense
            </p>
            <p
              className="text-[8px] font-black uppercase tracking-[0.18em]"
              style={{ color: COLORS.muted }}
            >
              ATS Intelligence
            </p>
          </div>
        </div>

        {label ? (
          <p
            className="text-[9px] font-black uppercase tracking-[0.2em]"
            style={{ color: COLORS.muted }}
          >
            {label}
          </p>
        ) : null}
      </header>

      <main className="relative z-10 mt-12">
        {title ? (
          <div className="mb-7">
            <h2
              className="text-[42px] font-black leading-none tracking-[-0.05em]"
              style={{ color: COLORS.navy }}
            >
              {title}
            </h2>

            {description ? (
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        {children}
      </main>

      <footer className="absolute bottom-8 left-12 right-12 flex items-center justify-between border-t border-[#DDEAF3] pt-3 text-[9px] font-semibold text-slate-400">
        <span>{footerLeft}</span>
        <span>{footerCenter}</span>
        <span>{pageNumber ? `Page ${pageNumber}` : ""}</span>
      </footer>
    </section>
  );
}

export function SectionHeaderLine({ label, title, icon: Icon = Gauge }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: COLORS.muted }} />

          {label ? (
            <p
              className="text-[10px] font-black uppercase tracking-[0.18em]"
              style={{ color: COLORS.muted }}
            >
              {label}
            </p>
          ) : null}
        </div>

        <h3
          className="mt-2 text-2xl font-black tracking-[-0.04em]"
          style={{ color: COLORS.dark }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}

export function RecommendationBlock({ title, children, tone = "blue" }) {
  const isWarning = tone === "warning";
  const isDanger = tone === "danger";

  return (
    <div
      className="rounded-3xl border p-5"
      style={{
        borderColor: isDanger
          ? "rgba(255,90,110,0.22)"
          : isWarning
            ? "rgba(255,176,74,0.28)"
            : COLORS.border,
        backgroundColor: isDanger
          ? "rgba(255,90,110,0.08)"
          : isWarning
            ? "rgba(255,176,74,0.10)"
            : "#F8FBFD",
      }}
    >
      <div className="flex gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white"
          style={{
            color: isDanger
              ? COLORS.danger
              : isWarning
                ? COLORS.warning
                : COLORS.navy,
          }}
        >
          {isDanger || isWarning ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </div>

        <div>
          <h3 className="text-base font-black" style={{ color: COLORS.dark }}>
            {title}
          </h3>

          <div className="mt-2 text-sm font-medium leading-6 text-slate-600">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NextStepBar({
  label = "Next Step",
  title = "Create an ATS-safe version",
  description = "Use the priority fixes and rewrite lab to create a cleaner resume before applying.",
}) {
  return (
    <div
      className="rounded-3xl px-5 py-4"
      style={{
        backgroundColor: COLORS.navy,
        color: "#FFFFFF",
      }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/58">
            {label}
          </p>

          <h3 className="mt-1 text-lg font-black">{title}</h3>

          <p className="mt-1 text-sm font-medium leading-6 text-white/70">
            {description}
          </p>
        </div>

        <ChevronRight className="hidden h-6 w-6 shrink-0 text-white/60 md:block" />
      </div>
    </div>
  );
}
