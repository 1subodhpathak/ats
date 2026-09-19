import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import DownloadGateModal from "../components/common/DownloadGateModal";
import { checkDownloadPass } from "../services/downloadGateService";
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  FolderOpen,
  RefreshCw,
  Search,
  Target,
  Sparkles,
} from "lucide-react";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import ATSPrintReport from "../components/export/ATSPrintReport";
import {
  MethodologySection,
  ReportCoverHero,
  ReportSectionShell,
} from "../components/export/ReportTemplate";
import Ats from "../components/resume-editor/Ats";
import { analyzeLine } from "../services/aiApi";
import {
  getAnalysisReport,
  getSavedReport,
  saveAnalysisReport,
} from "../services/reportApi";
import {
  getResume,
  getResumeOriginalPreviewUrl,
} from "../services/resumeApi";
import { cleanCandidateName } from "../utils/resumeParser";
import reportBackground from "../assets/home/report.png";

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "your", "have",
  "has", "was", "are", "not", "but", "role", "resume", "candidate", "based",
  "more", "their", "they", "them", "will", "where", "using", "used", "when",
  "what", "need", "needs", "work", "skills", "experience", "match", "alignment",
  "check",
]);

const REPORT_SIDEBAR_ITEMS = [
  { id: "report-overview", label: "Overview" },
  { id: "report-methodology", label: "Methodology" },
  { id: "report-at-glance", label: "At a Glance" },
  { id: "report-jd-matrix", label: "Role Requirement Match" },
  { id: "report-jd-matrix-continuation", label: "Requirement Continuation" },
  { id: "report-ats-parsing", label: "ATS Parsing" },
  { id: "report-scorecard", label: "Scorecard" },
  { id: "report-visuals", label: "Dashboard" },
  { id: "report-quick-scan", label: "Quick Scan" },
  { id: "report-keywords", label: "Keyword Coverage" },
  { id: "report-risk-flags", label: "Risk Flags" },
  { id: "report-rewrites", label: "Rewrite Recommendations" },
  { id: "report-bi-reporting", label: "BI Reporting" },
  { id: "report-aiml", label: "Advanced Analytics" },
  { id: "report-governance", label: "Data Governance" },
  { id: "report-leadership", label: "Leadership Fit" },
  { id: "report-final-verdict", label: "Final Verdict" },
  { id: "report-detailed", label: "Analysis" },
  { id: "report-appendix", label: "Appendix" },
];

const REPORT_UI_STYLES = `
  .cs-report-page {
    --cs-navy: #0B3550;
    --cs-navy-deep: #062B43;
    --cs-blue: #567C8D;
    --cs-blue-soft: #7896A5;
    --cs-gold: #D79B2B;
    --cs-gold-soft: #F5E6BF;
    --cs-ivory: #F7F2E9;
    --cs-paper: #FFFDF8;
    --cs-paper-soft: #FBF8F1;
    --cs-line: #E2DBD0;
    --cs-green: #238C69;
    --cs-red: #D45E4E;
    --cs-amber: #D79B2B;
    background:
      radial-gradient(circle at 86% 4%, rgba(215,155,43,.09), transparent 27%),
      radial-gradient(circle at 6% 30%, rgba(86,124,141,.06), transparent 23%),
      linear-gradient(180deg, #FAF7F0 0%, #F6F0E7 100%);
  }

  .cs-report-page::before,
  .cs-report-page::after {
    content: "";
    position: fixed;
    pointer-events: none;
    z-index: 0;
    width: 560px;
    height: 180px;
    border: 1px solid rgba(215,155,43,.24);
    border-radius: 50%;
  }

  .cs-report-page::before {
    left: -300px;
    bottom: 80px;
    transform: rotate(-9deg);
  }

  .cs-report-page::after {
    right: -300px;
    bottom: -40px;
    transform: rotate(8deg);
  }

  .cs-report-page {
    position: relative;
    isolation: isolate;
  }

  .cs-report-page .cs-report-content {
    position: relative;
    z-index: 1;
  }

  .cs-report-page .cs-report-hero {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.11);
    box-shadow: 0 22px 50px rgba(6,43,67,.17);
  }

  .cs-report-page .cs-report-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(4,38,60,.98) 0%,
      rgba(5,43,67,.93) 37%,
      rgba(5,43,67,.62) 62%,
      rgba(5,43,67,.10) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  .cs-report-page .cs-report-hero-content {
    position: relative;
    z-index: 2;
  }

  .cs-report-page .cs-report-sidebar {
    background: rgba(255,253,248,.94) !important;
    border-color: #E5DDD1 !important;
    box-shadow: 0 16px 38px rgba(6,43,67,.065) !important;
  }

  .cs-report-page .cs-report-sidebar-header {
    margin: -14px -14px 12px;
    padding: 16px 15px;
    border: 0 !important;
    border-radius: 18px 18px 0 0;
    background: linear-gradient(135deg, #0A3A56, #082F49);
  }

  .cs-report-page .cs-report-sidebar-header .cs-sidebar-label {
    color: white !important;
    background: transparent !important;
    padding: 0 !important;
    letter-spacing: .16em;
  }

  .cs-report-page .cs-report-sidebar a:first-child {
    color: #0B3550 !important;
    background: #FBF6EB !important;
    box-shadow: inset 3px 0 0 #D79B2B;
  }

  .cs-report-page .cs-report-sidebar a:first-child > span:first-child {
    background: #FFF0C9 !important;
    color: #C88617 !important;
    border-color: #E9C77E !important;
  }

  .cs-report-page .cs-paper-card,
  .cs-report-page .bg-white {
    background-color: var(--cs-paper) !important;
  }

  .cs-report-page .border-slate-200,
  .cs-report-page .border-slate-150,
  .cs-report-page .border-slate-100 {
    border-color: var(--cs-line) !important;
  }

  .cs-report-page .bg-slate-50,
  .cs-report-page .bg-slate-50\/50,
  .cs-report-page .bg-slate-50\/60,
  .cs-report-page .bg-slate-50\/70 {
    background-color: #F8F4ED !important;
  }

  .cs-report-page .bg-slate-100 {
    background-color: #EFE8DC !important;
  }

  .cs-report-page .text-slate-400 { color: #8A9DA8 !important; }
  .cs-report-page .text-slate-500 { color: #6F8794 !important; }
  .cs-report-page .text-slate-600 { color: #526F80 !important; }
  .cs-report-page .text-slate-700 { color: #35586D !important; }
  .cs-report-page .text-slate-800,
  .cs-report-page .text-slate-900,
  .cs-report-page .text-slate-950 { color: var(--cs-navy-deep) !important; }

  .cs-report-page .text-amber-400,
  .cs-report-page .text-amber-500,
  .cs-report-page .text-amber-600,
  .cs-report-page .text-amber-700,
  .cs-report-page .text-amber-800,
  .cs-report-page .text-amber-900 { color: var(--cs-gold) !important; }

  .cs-report-page .bg-amber-400,
  .cs-report-page .bg-amber-500 { background-color: var(--cs-gold) !important; }

  .cs-report-page .bg-amber-50,
  .cs-report-page .bg-amber-50\/50,
  .cs-report-page .bg-amber-50\/60 { background-color: #FFF7E7 !important; }

  .cs-report-page .border-amber-100,
  .cs-report-page .border-amber-200,
  .cs-report-page .border-amber-300 { border-color: #E8C982 !important; }

  .cs-report-page .text-emerald-400,
  .cs-report-page .text-emerald-600,
  .cs-report-page .text-emerald-700,
  .cs-report-page .text-emerald-800,
  .cs-report-page .text-emerald-850,
  .cs-report-page .text-emerald-900 { color: var(--cs-green) !important; }

  .cs-report-page .bg-emerald-400,
  .cs-report-page .bg-emerald-500,
  .cs-report-page .bg-emerald-600 { background-color: var(--cs-green) !important; }

  .cs-report-page .bg-emerald-50,
  .cs-report-page .bg-emerald-50\/40,
  .cs-report-page .bg-emerald-50\/50,
  .cs-report-page .bg-emerald-50\/70 { background-color: #EEF8F4 !important; }

  .cs-report-page .border-emerald-100,
  .cs-report-page .border-emerald-200 { border-color: #BFDCCF !important; }

  .cs-report-page .text-rose-600,
  .cs-report-page .text-rose-700,
  .cs-report-page .text-rose-800 { color: var(--cs-red) !important; }

  .cs-report-page .bg-rose-500,
  .cs-report-page .bg-rose-600 { background-color: var(--cs-red) !important; }

  .cs-report-page .bg-rose-50,
  .cs-report-page .bg-rose-50\/40,
  .cs-report-page .bg-rose-50\/50 { background-color: #FDF2EF !important; }

  .cs-report-page .border-rose-100,
  .cs-report-page .border-rose-200 { border-color: #E7C0B8 !important; }

  .cs-report-page .text-blue-700,
  .cs-report-page .text-blue-800,
  .cs-report-page .text-blue-900,
  .cs-report-page .text-indigo-950,
  .cs-report-page .text-violet-800 { color: var(--cs-navy) !important; }

  .cs-report-page .bg-blue-50,
  .cs-report-page .bg-blue-50\/40,
  .cs-report-page .bg-blue-50\/50,
  .cs-report-page .bg-indigo-50,
  .cs-report-page .bg-indigo-50\/50,
  .cs-report-page .bg-violet-50 { background-color: #EEF4F6 !important; }

  .cs-report-page .border-blue-100,
  .cs-report-page .border-blue-200,
  .cs-report-page .border-indigo-100,
  .cs-report-page .border-violet-100 { border-color: #C8D9E0 !important; }

  .cs-report-page .rounded-3xl { border-radius: 20px !important; }
  .cs-report-page .rounded-2xl { border-radius: 15px !important; }

  .cs-report-page table thead { background: #F3EEE5 !important; }

  .cs-report-page table th {
    color: #6A8391 !important;
    font-size: 10px !important;
    letter-spacing: .11em !important;
  }

  .cs-report-page table tbody tr:hover { background: #FBF7F0 !important; }

  .cs-report-page select,
  .cs-report-page input {
    border-color: #CCD9DF !important;
    background-color: #FFFDF8 !important;
  }

  .cs-report-page button,
  .cs-report-page a { -webkit-tap-highlight-color: transparent; }

  .cs-report-page .shadow-xl,
  .cs-report-page .shadow-md,
  .cs-report-page .shadow-sm {
    box-shadow: 0 12px 30px rgba(6,43,67,.065) !important;
  }

  .cs-report-page .cs-summary-grid > * {
    min-width: 0;
  }

  @media (max-width: 1279px) {
    .cs-report-page::before,
    .cs-report-page::after { display: none; }
  }
`


function clampPercent(value) {
  return Math.max(0, Math.min(100, value || 0));
}

function normalizeAuditStatus(status) {
  const value = String(status || "").toLowerCase();
  if (["strong", "passed", "pass", "success"].includes(value)) {
    return "strong";
  }
  if (["partial", "needs_work", "warning", "needs improvement"].includes(value)) {
    return "partial";
  }
  if (["missing", "critical", "error", "gap", "not_applicable"].includes(value)) {
    return "gap";
  }
  return "partial";
}

function statusPillClass(status) {
  const normalized = normalizeAuditStatus(status);
  if (normalized === "strong") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }
  if (normalized === "gap") {
    return "bg-rose-50 text-rose-700 border border-rose-200";
  }
  return "bg-amber-50 text-amber-700 border border-amber-200";
}

function statusLabel(status) {
  const normalized = normalizeAuditStatus(status);
  if (normalized === "strong") {
    return "Strong";
  }
  if (normalized === "gap") {
    return "Gap";
  }
  return "Partial";
}

function averageScore(items) {
  if (!items.length) {
    return null;
  }
  return Math.round(items.reduce((sum, item) => sum + clampPercent(item), 0) / items.length);
}

function scoreLevel(score) {
  if (score >= 80) {
    return { label: "High", tone: "high", color: "#1E8F70" };
  }
  if (score >= 60) {
    return { label: "Med", tone: "med", color: "#D79B2B" };
  }
  return { label: "Low", tone: "low", color: "#C95A4C" };
}

function collectResumeLines(resume) {
  return (resume?.sections || []).flatMap((section) =>
    section.items.map((item) => ({
      line_id: item.line_id,
      text: item.text,
      original_text: item.original_text,
      score: item.score,
      section_name: section.section_name,
    }))
  );
}

function splitResumeBlock(line) {
  const rawText = (line?.text || "").replace(/\r/g, "\n").trim();
  if (!rawText) {
    return [];
  }

  const normalized = rawText
    .replace(/[•▪●◦]/g, "\n")
    .replace(/\s*\n+\s*/g, "\n")
    .trim();

  let segments = normalized
    .split("\n")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length <= 1) {
    segments = normalized
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  if (!segments.length) {
    segments = [rawText];
  }

  return segments.map((segment, index) => ({
    segment_id: `${line.line_id}::${index}`,
    line_id: line.line_id,
    section_name: line.section_name,
    text: segment,
    full_text: rawText,
    score: line.score,
  }));
}

function tokenizeText(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function buildKeywords(point) {
  return Array.from(
    new Set(
      tokenizeText(
        [
          point.title,
          point.category,
          point.affected_resume_area,
          point.improvement_suggestion,
          point.explanation,
        ]
          .filter(Boolean)
          .join(" ")
      )
    )
  );
}

function buildEvidenceForPoint(point, resumeLines) {
  const keywords = buildKeywords(point);
  const segments = resumeLines.flatMap((line) => splitResumeBlock(line));
  if (!segments.length) {
    return [];
  }

  const rankedSegments = segments
    .map((segment) => {
      const haystack = `${segment.section_name} ${segment.text}`.toLowerCase();
      const matches = keywords.filter((keyword) => haystack.includes(keyword)).length;
      const sectionBoost = keywords.some((keyword) =>
        segment.section_name.toLowerCase().includes(keyword)
      )
        ? 1
        : 0;
      const issueBoost =
        point.current_status === "Critical Fix"
          ? 0.8
          : point.current_status === "Needs Improvement"
            ? 0.35
            : 0;
      const scoreBoost =
        typeof segment.score === "number" ? Math.max(0, 100 - segment.score) / 100 : 0;

      return {
        ...segment,
        relevance: matches + sectionBoost + issueBoost + scoreBoost,
      };
    })
    .filter((segment) => segment.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);

  if (rankedSegments.length) {
    const uniqueSegments = [];
    const seen = new Set();
    for (const segment of rankedSegments) {
      if (seen.has(segment.segment_id)) {
        continue;
      }
      uniqueSegments.push(segment);
      seen.add(segment.segment_id);
      if (uniqueSegments.length >= 4) {
        break;
      }
    }
    return uniqueSegments;
  }

  const fallbackLines = resumeLines
    .map((line) => ({
      segment_id: `${line.line_id}::full`,
      line_id: line.line_id,
      section_name: line.section_name,
      text: line.text,
      full_text: line.text,
      score: line.score,
      relevance: 0,
      isFullArea: true,
    }))
    .slice(0, 2);

  return fallbackLines;
}

function StatusBar({ label, value, tone }) {
  const toneClasses = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${toneClasses[tone]}`}
          style={{ width: `${clampPercent(value)}%` }}
        />
      </div>
    </div>
  );
}

function getScoreTone(score) {
  if (score >= 80) {
    return {
      label: "ATS-ready",
      stroke: "#1E8F70",
      fill: "#f0fdf4",
      text: "#166534",
    };
  }
  if (score >= 41) {
    return {
      label: "Needs improvement",
      stroke: "#D79B2B",
      fill: "#fffbeb",
      text: "#92400e",
    };
  }
  return {
    label: "High risk",
    stroke: "#C95A4C",
    fill: "#fff5f5",
    text: "#991b1b",
  };
}

function GaugeChart({ score }) {
  const clamped = clampPercent(score);
  const tone = getScoreTone(clamped);
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg viewBox="0 0 180 180" className="h-44 w-44">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={tone.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 90 90)"
        />
        <circle cx="90" cy="90" r="44" fill="#ffffff" />
        <text x="90" y="84" textAnchor="middle" className="fill-[#0B3550] text-[10px] font-bold uppercase tracking-wider">
          ATS Score
        </text>
        <text x="90" y="106" textAnchor="middle" className="fill-[#0B3550] text-[26px] font-black">
          {clamped}
        </text>
      </svg>
      <span
        className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border mt-2"
        style={{ backgroundColor: tone.fill, color: tone.text, borderColor: tone.stroke + "33" }}
      >
        {tone.label}
      </span>
    </div>
  );
}

function RadarChart({ items }) {
  const size = 300;
  const center = size / 2;
  const maxRadius = 105;
  const angleStep = (Math.PI * 2) / Math.max(items.length, 1);
  const levels = [20, 40, 60, 80, 100];

  const pointFor = (index, value, radiusScale = 1) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const radius = (maxRadius * clampPercent(value) * radiusScale) / 100;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  };

  const polygonPoints = items
    .map((item, index) => {
      const point = pointFor(index, item.score);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-[280px] w-full max-w-[300px]">
      {levels.map((level) => (
        <polygon
          key={level}
          points={items
            .map((_, index) => {
              const point = pointFor(index, level);
              return `${point.x},${point.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}
      {items.map((item, index) => {
        const outer = pointFor(index, 100, 1.15);
        const axisEnd = pointFor(index, 100);
        return (
          <g key={item.category}>
            <line
              x1={center}
              y1={center}
              x2={axisEnd.x}
              y2={axisEnd.y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={outer.x}
              y={outer.y}
              textAnchor={outer.x >= center + 4 ? "start" : outer.x <= center - 4 ? "end" : "middle"}
              className="fill-slate-600 text-[10px] font-bold"
            >
              {item.category.split(" & ")[0].slice(0, 16)}
            </text>
          </g>
        );
      })}
      <polygon points={polygonPoints} fill="rgba(11,33,70,0.08)" stroke="#0B3550" strokeWidth="2.5" />
      {items.map((item, index) => {
        const point = pointFor(index, item.score);
        return <circle key={`${item.category}-point`} cx={point.x} cy={point.y} r="3.5" fill="#0B3550" />;
      })}
    </svg>
  );
}

function DoughnutChart({ items, centerLabel, centerValue }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 180 180" className="h-36 w-36 shrink-0">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="16" />
        {items.map((item) => {
          const segment = circumference * (item.value / 100);
          const dashOffset = circumference - cumulative;
          cumulative += segment;
          return (
            <circle
              key={item.label}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="16"
              strokeDasharray={`${segment} ${circumference - segment}`}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 90 90)"
              strokeLinecap="butt"
            />
          );
        })}
        <text x="90" y="84" textAnchor="middle" className="fill-slate-400 text-[10px] font-bold uppercase tracking-wider">
          {centerLabel}
        </text>
        <text x="90" y="104" textAnchor="middle" className="fill-[#0B3550] text-[18px] font-black">
          {centerValue}
        </text>
      </svg>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs text-slate-700">
            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="font-bold">{item.label}</span>
            <span className="text-slate-400">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineChart({ items }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-500">
        Career timeline data could not be extracted clearly from the uploaded resume.
      </div>
    );
  }

  const minYear = Math.min(...items.map((item) => item.start));
  const maxYear = Math.max(...items.map((item) => item.end));
  const totalRange = Math.max(maxYear - minYear, 1);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const left = ((item.start - minYear) / totalRange) * 100;
        const width = (Math.max(item.end - item.start, 0.3) / totalRange) * 100;
        return (
          <div key={`${item.label}-${item.start}`} className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs">
              <p className="min-w-0 truncate font-bold text-slate-700">{item.label}</p>
              <span className="shrink-0 text-slate-400 font-medium">
                {item.startLabel} - {item.endLabel}
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-slate-100">
              <div
                className="absolute top-0 h-2.5 rounded-full bg-[#0B3550]"
                style={{ left: `${left}%`, width: `${Math.max(width, 8)}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>{Math.floor(minYear)}</span>
        <span>{Math.ceil(maxYear)}</span>
      </div>
    </div>
  );
}

function KeywordProminenceChart({ items }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        No strong keyword cluster was detected from the current resume text.
      </div>
    );
  }

  const topWeight = items[0]?.weight || 1;

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.slice(0, 6).map((item, index) => {
        const percent = Math.max(12, Math.round((item.weight / topWeight) * 100));
        return (
          <div
            key={item.word}
            className="rounded-xl border border-slate-100 bg-white p-2 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-black text-[#0B3550]">
                {item.word}
              </p>
              <span className="shrink-0 rounded bg-slate-100 px-1 py-0.5 text-[9px] font-bold text-slate-500">
                {percent}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0B3550]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StackedBarChart({ items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  return (
    <div className="space-y-4">
      <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
        {items.map((item) => (
          <div
            key={item.label}
            style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-bold text-slate-600 truncate">{item.label}</span>
            </div>
            <span className="font-black text-[#0B3550] ml-2">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ label, value, tone }) {
  const toneMap = {
    blue: "from-[#0B3550] to-[#2583CF]",
    green: "from-emerald-500 to-emerald-400",
    amber: "from-amber-500 to-amber-400",
    rose: "from-rose-500 to-rose-400",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-[11px] font-bold text-slate-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${toneMap[tone] || toneMap.blue}`}
          style={{ width: `${clampPercent(value)}%` }}
        />
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex min-w-[100px] justify-center rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${statusPillClass(status)}`}
    >
      {statusLabel(status)}
    </span>
  );
}

function AnalysisTable({ columns, rows }) {
  if (!rows.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-50/70"
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="align-top hover:bg-slate-50/40 transition">
                {columns.map((column) => (
                  <td
                    key={`${row.id || rowIndex}-${column.key}`}
                    className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-slate-700"
                  >
                    {column.key === "status" || column.key === "fit" || column.key === "severity" ? (
                      <StatusPill status={row[column.key]} />
                    ) : (
                      <span className={column.emphasis ? "font-black text-[#0B3550]" : "font-medium text-slate-600"}>
                        {row[column.key]}
                      </span>
                    )}
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

function IssueCountPill({ count, status }) {
  const styles = {
    passed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    needs_work: "bg-amber-50 text-amber-700 border-amber-200",
    critical: "bg-rose-50 text-rose-700 border-rose-200",
    not_applicable: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${styles[status] || styles.needs_work}`}>
      {count} issue{count === 1 ? "" : "s"}
    </span>
  );
}

function ScoreSummaryPanel({ score, label, title, summary, tone = "emerald" }) {
  const tones = {
    emerald: {
      badge: "bg-emerald-600 text-white",
      title: "text-[#0B3550]",
    },
    rose: {
      badge: "bg-rose-600 text-white",
      title: "text-[#0B3550]",
    },
    amber: {
      badge: "bg-amber-500 text-[#0B3550]",
      title: "text-[#0B3550]",
    },
  };

  const theme = tones[tone] || tones.emerald;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-150 bg-slate-50 p-4 shadow-sm sm:flex-row sm:items-center">
      <div className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl text-center font-black shadow-sm ${theme.badge}`}>
        <span className="text-lg leading-none">{score}%</span>
        <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] opacity-90">{label}</span>
      </div>
      <div className="space-y-1.5">
        <h4 className={`text-sm font-black ${theme.title}`}>{title}</h4>
        <p className="text-xs font-medium leading-relaxed text-slate-600">{summary}</p>
      </div>
    </div>
  );
}

function RequirementMatchTable({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">JD Requirement</th>
              <th className="px-4 py-3">Resume Evidence</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Recommended Fix</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={`${item.requirement}-${item.status}`} className="align-top hover:bg-slate-50/40 transition">
                <td className="px-4 py-3.5 font-black text-[#0B3550]">{item.requirement}</td>
                <td className="px-4 py-3.5 text-slate-600 font-medium">{item.resume_evidence}</td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
                    item.status === "strong"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : item.status === "partial"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : item.status === "missing"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}>
                    {item.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-medium">{item.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FAQCard({ items }) {
  if (!items?.length) {
    return null;
  }
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.question} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
          <p className="text-xs font-black text-[#0B3550]">{item.question}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

// Updated UI for Section Card
function ReportSectionCard({ section }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {section.group}
          </p>
          <h3 className="text-lg font-black tracking-tight text-[#0B3550]">{section.title}</h3>
          <p className="text-xs leading-relaxed text-slate-500 max-w-2xl">{section.summary}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {typeof section.score === "number" ? (
            <span className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-black text-[#0B3550]">
              {section.score}/100
            </span>
          ) : null}
          <IssueCountPill count={section.issue_count || 0} status={section.status} />
        </div>
      </div>

      <div className="grid gap-3">
        {(section.findings || []).map((finding, index) => (
          <div key={`${section.id}-${finding.title}-${index}`} className="rounded-xl border border-slate-150 bg-slate-50/60 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200/50 pb-2 mb-2">
              <div>
                <p className="text-xs font-black text-[#0B3550]">{finding.title}</p>
                <p className="mt-0.5 text-xs text-slate-500 font-medium italic">"{finding.evidence}"</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                finding.type === "success"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200/40"
                  : finding.type === "error"
                    ? "bg-rose-100 text-rose-800 border border-rose-200/40"
                    : finding.type === "warning"
                      ? "bg-amber-100 text-amber-800 border border-amber-200/40"
                      : "bg-slate-100 text-slate-600"
              }`}>
                {finding.type}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              <span className="font-bold text-slate-800">Recommendation:</span> {finding.recommendation}
            </p>
            {finding.rewrite ? (
              <div className="mt-2.5 rounded-lg border border-indigo-100 bg-indigo-50/50 p-2.5 text-xs text-slate-700">
                <span className="font-bold text-indigo-950">Suggested rewrite:</span> {finding.rewrite}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {(section.faq || []).length ? <div className="mt-4"><FAQCard items={section.faq} /></div> : null}
    </div>
  );
}

function ReportDashboardOverview({
  report,
  dashboardOverallScore,
  finalVerdictSection,
  keywordCoverageSection,
  riskFlagsSection,
  scorecardRows,
  onOpenResume,
  onDownloadPdf,
}) {
  const strongRequirements = (report?.jd_match_matrix || [])
    .filter((item) => normalizeAuditStatus(item.status) === "strong")
    .map((item) => item.requirement)
    .filter(Boolean)
    .slice(0, 4);

  const improvementItems = (riskFlagsSection || [])
    .map((item) => item.flag)
    .filter(Boolean)
    .slice(0, 4);

  const matchedCount = keywordCoverageSection?.matchedKeywords?.length || strongRequirements.length;
  const missingWeak = keywordCoverageSection?.missingWeak || [];
  const missingCount = missingWeak.filter((item) => item.tone === "gap").length;
  const partialCount = Math.max(0, missingWeak.length - missingCount);
  const keywordTotal = Math.max(matchedCount + partialCount + missingCount, 1);
  const matchedPct = Math.round((matchedCount / keywordTotal) * 100);
  const partialPct = Math.round((partialCount / keywordTotal) * 100);
  const missingPct = Math.max(0, 100 - matchedPct - partialPct);

  const currentScore = clampPercent(dashboardOverallScore);
  const projectedScore = clampPercent(
    finalVerdictSection?.potentialScore ??
      report?.executive_summary?.score_explanation?.estimated_potential_score_after_rewrite ??
      currentScore
  );

  const scoreMessage =
    currentScore >= 80
      ? "Your Resume Shows Strong Potential"
      : currentScore >= 65
        ? "Your Resume Is Competitive"
        : "Your Resume Needs Targeted Improvements";

  const scoreSummary =
    report?.executive_summary?.recommendation ||
    report?.summary ||
    "Review the report below for the strongest evidence, important gaps, and the next improvements to make.";

  return (
    <section id="report-at-glance" className="scroll-mt-28 space-y-4">
      <div className="rounded-[18px] border border-[#E3DDD3] bg-[#FFFDF8] p-4 shadow-[0_12px_30px_rgba(6,43,67,.065)] sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[190px_minmax(0,1fr)_250px] xl:items-center">
          <div className="flex flex-col items-center justify-center border-b border-[#ECE5DA] pb-5 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-5">
            <div
              className="relative flex h-[145px] w-[145px] items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#2B966F ${currentScore * 3.6}deg, #EEE8DD 0deg)`,
              }}
            >
              <div className="flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full bg-[#FFFDF8] shadow-[inset_0_0_0_1px_#EFE7DB]">
                <span className="font-serif text-[40px] font-semibold leading-none text-[#0B3550]">{currentScore}</span>
                <span className="mt-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#567C8D]">ATS Score</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] font-black text-[#238C69]">
              {currentScore >= 80 ? "Strong Match" : currentScore >= 60 ? "Good Match" : "Needs Work"}
            </p>
          </div>

          <div className="min-w-0 xl:px-2">
            <h2 className="font-serif text-[24px] font-semibold tracking-[-0.025em] text-[#0B3550] sm:text-[27px]">
              {scoreMessage}
            </h2>
            <p className="mt-2 max-w-2xl text-[12px] font-medium leading-[1.6] text-[#607F90]">
              {scoreSummary}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-[12px] border border-[#E8E1D6] bg-[#FBF8F2] px-3 py-3">
                <p className="font-serif text-[22px] font-semibold leading-none text-[#0B3550]">{matchedCount}</p>
                <p className="mt-1 text-[8px] font-black uppercase tracking-[0.12em] text-[#7896A5]">Matched Keywords</p>
              </div>
              <div className="rounded-[12px] border border-[#E8E1D6] bg-[#FBF8F2] px-3 py-3">
                <p className="font-serif text-[22px] font-semibold leading-none text-[#D45E4E]">{riskFlagsSection?.length || 0}</p>
                <p className="mt-1 text-[8px] font-black uppercase tracking-[0.12em] text-[#7896A5]">Areas to Improve</p>
              </div>
              <div className="rounded-[12px] border border-[#E8E1D6] bg-[#FBF8F2] px-3 py-3">
                <p className="font-serif text-[22px] font-semibold leading-none text-[#D79B2B]">{report?.analysis_points?.length || scorecardRows.length}</p>
                <p className="mt-1 text-[8px] font-black uppercase tracking-[0.12em] text-[#7896A5]">Report Insights</p>
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#D7E4DE] bg-[#F1F8F4] px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDF1E8] text-[#238C69]">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-[34px] font-semibold leading-none text-[#18785A]">{projectedScore}</p>
                <p className="mt-1 text-[11px] font-black text-[#0B3550]">Projected Score</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] font-bold text-[#238C69]">+{Math.max(0, projectedScore - currentScore)} potential improvement</p>
            <p className="mt-3 text-[10px] font-medium leading-[1.5] text-[#668496]">After applying the highest-priority recommendations in this report.</p>
          </div>
        </div>
      </div>

      <div className="cs-summary-grid grid gap-4 xl:grid-cols-[1fr_1fr_260px]">
        <div className="rounded-[17px] border border-[#E3DDD3] bg-[#FFFDF8] p-5 shadow-[0_10px_28px_rgba(6,43,67,.055)]">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F4EE] text-[#238C69]">
              <Target className="h-4.5 w-4.5" />
            </span>
            <div>
              <h3 className="font-serif text-[18px] font-semibold text-[#0B3550]">ATS Category Scores</h3>
              <p className="text-[9px] font-medium text-[#7896A5]">Performance across the key areas reviewed.</p>
            </div>
          </div>
          <div className="space-y-3">
            {scorecardRows.slice(0, 5).map((row) => (
              <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_minmax(110px,180px)_34px] items-center gap-3 text-[10px]">
                <span className="truncate font-bold text-[#45697D]">{row.label}</span>
                <div className="h-2 overflow-hidden rounded-full bg-[#ECE7DE]">
                  <div
                    className={`h-full rounded-full ${row.score >= 75 ? "bg-[#2A8C70]" : row.score >= 60 ? "bg-[#D79B2B]" : "bg-[#D45E4E]"}`}
                    style={{ width: `${clampPercent(row.score)}%` }}
                  />
                </div>
                <span className="text-right font-black text-[#0B3550]">{row.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[17px] border border-[#E3DDD3] bg-[#FFFDF8] p-5 shadow-[0_10px_28px_rgba(6,43,67,.055)]">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0D1] text-[#D79B2B]">
              <Search className="h-4.5 w-4.5" />
            </span>
            <div>
              <h3 className="font-serif text-[18px] font-semibold text-[#0B3550]">Keyword Coverage</h3>
              <p className="text-[9px] font-medium text-[#7896A5]">How the resume aligns with the target terminology.</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div
              className="relative flex h-[138px] w-[138px] shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#2B966F 0 ${matchedPct}%, #E6A72B ${matchedPct}% ${matchedPct + partialPct}%, #D45E4E ${matchedPct + partialPct}% 100%)`,
              }}
            >
              <div className="flex h-[93px] w-[93px] flex-col items-center justify-center rounded-full bg-[#FFFDF8]">
                <span className="font-serif text-[30px] font-semibold text-[#0B3550]">{keywordTotal}</span>
                <span className="text-[8px] font-black uppercase tracking-[0.1em] text-[#7896A5]">Keywords</span>
              </div>
            </div>

            <div className="min-w-[150px] space-y-2 text-[10px]">
              <div className="flex items-center justify-between gap-5"><span className="flex items-center gap-2 font-bold text-[#45697D]"><span className="h-2.5 w-2.5 rounded-full bg-[#2B966F]" />Matched</span><span className="font-black text-[#0B3550]">{matchedCount} ({matchedPct}%)</span></div>
              <div className="flex items-center justify-between gap-5"><span className="flex items-center gap-2 font-bold text-[#45697D]"><span className="h-2.5 w-2.5 rounded-full bg-[#E6A72B]" />Partial</span><span className="font-black text-[#0B3550]">{partialCount} ({partialPct}%)</span></div>
              <div className="flex items-center justify-between gap-5"><span className="flex items-center gap-2 font-bold text-[#45697D]"><span className="h-2.5 w-2.5 rounded-full bg-[#D45E4E]" />Missing</span><span className="font-black text-[#0B3550]">{missingCount} ({missingPct}%)</span></div>
            </div>
          </div>
        </div>

        <div className="rounded-[17px] border border-[#E3DDD3] bg-[#FFFDF8] p-5 shadow-[0_10px_28px_rgba(6,43,67,.055)]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDF3F6] text-[#0B3550]">
              <Eye className="h-4.5 w-4.5" />
            </span>
            <h3 className="font-serif text-[18px] font-semibold text-[#0B3550]">Resume Preview</h3>
          </div>

          <div className="mt-4 flex h-[125px] items-center justify-center rounded-[12px] border border-[#DDE3E4] bg-[#FAFCFC] p-4">
            <div className="w-full space-y-2 opacity-70">
              <div className="h-2 w-1/3 rounded bg-[#B7C6CE]" />
              <div className="h-px w-full bg-[#CFD9DE]" />
              <div className="h-1.5 w-5/6 rounded bg-[#D6DFE3]" />
              <div className="h-1.5 w-full rounded bg-[#D6DFE3]" />
              <div className="h-1.5 w-4/5 rounded bg-[#D6DFE3]" />
              <div className="h-1.5 w-3/4 rounded bg-[#D6DFE3]" />
            </div>
          </div>

          <p className="mt-3 truncate text-[10px] font-black text-[#0B3550]">{report?.resume_file_name}</p>
          <div className="mt-3 grid gap-2">
            <button type="button" onClick={onOpenResume} className="rounded-[9px] border border-[#D8E1E4] bg-white px-3 py-2 text-[9px] font-black text-[#0B3550] transition hover:bg-[#F7F2EA]">View Resume</button>
            <button type="button" onClick={onDownloadPdf} className="rounded-[9px] border border-[#D8E1E4] bg-white px-3 py-2 text-[9px] font-black text-[#0B3550] transition hover:bg-[#F7F2EA]">Download Report</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_260px]">
        <div className="rounded-[17px] border border-[#E3DDD3] bg-[#FFFDF8] p-5 shadow-[0_10px_28px_rgba(6,43,67,.055)]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F4EE] text-[#238C69]">✓</span>
            <div><h3 className="font-serif text-[18px] font-semibold text-[#0B3550]">Top Strengths</h3><p className="text-[9px] text-[#7896A5]">What is already working well.</p></div>
          </div>
          <div className="mt-4 space-y-2">
            {(strongRequirements.length ? strongRequirements : scorecardRows.filter((row) => row.score >= 75).map((row) => row.label)).slice(0, 4).map((item) => (
              <div key={item} className="flex items-start gap-2 text-[10.5px] font-medium leading-[1.45] text-[#526F80]"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DDF1E8] text-[9px] font-black text-[#238C69]">✓</span>{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-[17px] border border-[#E3DDD3] bg-[#FFFDF8] p-5 shadow-[0_10px_28px_rgba(6,43,67,.055)]">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0D1] text-[#D79B2B]">!</span><div><h3 className="font-serif text-[18px] font-semibold text-[#0B3550]">Key Areas to Improve</h3><p className="text-[9px] text-[#7896A5]">Focus on these first.</p></div></div>
          <div className="mt-4 space-y-2">
            {(improvementItems.length ? improvementItems : (report?.executive_summary?.top_fixes || []).map((item) => item.title).filter(Boolean)).slice(0, 4).map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-start gap-2 text-[10.5px] font-medium leading-[1.45] text-[#526F80]"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF0D1] text-[9px] font-black text-[#B97918]">{index + 1}</span>{item}</div>
            ))}
          </div>
        </div>

        <div className="hidden rounded-[17px] border border-transparent bg-transparent p-5 xl:block">
          <div className="pt-6 text-center">
            <p className="font-serif text-[33px] leading-[1.02] italic text-[#45697D]">“A stronger<br/>resume opens<br/>a brighter<br/>tomorrow.”</p>
            <span className="mx-auto mt-5 block h-[2px] w-12 bg-[#D79B2B]" />
            <p className="mt-3 font-serif text-[14px] text-[#0B3550]">CareerSense</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ATSReportPage() {
  const { user } = useUser();
  const { analysisId, reportId } = useParams();
  const [report, setReport] = useState(null);
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [highlightedLineId, setHighlightedLineId] = useState("");
  const [previewMode, setPreviewMode] = useState("original");
  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [originalSearchInput, setOriginalSearchInput] = useState("");
  const [originalSearchTerm, setOriginalSearchTerm] = useState("");
  const navigate = useNavigate();
  const [aiLineInsights, setAiLineInsights] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isQuickScanMinimized, setIsQuickScanMinimized] = useState(false);
  const [isVisualReportMinimized, setIsVisualReportMinimized] = useState(false);
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
  const [isDownloadGateOpen, setIsDownloadGateOpen] = useState(false);
  const reportViewParams = useMemo(() => {
    if (typeof window === "undefined") {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
  }, []);
  const isEmbeddedPreview = reportViewParams.get("embeddedPreview") === "1";
  const isPdfPrintMode = reportViewParams.get("printMode") === "1";
  const shouldAutoPrint = reportViewParams.get("autoPrint") === "1";
  const isChromeHidden = isEmbeddedPreview || isPdfPrintMode;

  useEffect(() => {
    let active = true;

    async function loadReport() {
      setStatus("loading");
      setError("");
      setReport(null);
      setResume(null);
      try {
        const reportResponse = reportId
          ? await getSavedReport(reportId)
          : await getAnalysisReport(analysisId);

        if (!active) {
          return;
        }

        const nextReport = reportResponse.data;
        if (nextReport?.report_level === "basic" || Array.isArray(nextReport?.score_categories)) {
          navigate(`/reports/basic/${nextReport.resume_id || analysisId || reportId}`, {
            replace: true,
            state: { basicReport: nextReport },
          });
          return;
        }
        setReport(nextReport);

        const resumeResponse = await getResume(nextReport.resume_id);
        if (!active) {
          return;
        }

        setResume(resumeResponse.data);
        setStatus("success");
      } catch (requestError) {
        if (!active) {
          return;
        }
        setError(
          requestError?.response?.data?.detail ||
            "Unable to load the ATS analysis report."
        );
        setStatus("error");
      }
    }

    loadReport();
    return () => {
      active = false;
    };
  }, [analysisId, reportId]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      status !== "success" ||
      !isPdfPrintMode ||
      !shouldAutoPrint
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      window.print();
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isPdfPrintMode, shouldAutoPrint, status]);

  const groupedPoints = useMemo(() => {
    if (!report?.analysis_points) {
      return [];
    }

    const map = new Map();
    report.analysis_points
      .filter((point) => !point.duplicate_of_pointer_id)
      .forEach((point) => {
      if (!map.has(point.category)) {
        map.set(point.category, []);
      }
      map.get(point.category).push(point);
      });

    return Array.from(map.entries());
  }, [report]);

  const categoryOptions = useMemo(() => {
    const categories = groupedPoints.map(([category]) => category);
    return ["All Categories", ...categories];
  }, [groupedPoints]);

  const filteredGroupedPoints = useMemo(() => {
    if (selectedCategory === "All Categories") {
      return groupedPoints;
    }
    return groupedPoints.filter(([category]) => category === selectedCategory);
  }, [groupedPoints, selectedCategory]);

  const visiblePointCount = useMemo(
    () => filteredGroupedPoints.reduce((count, [, points]) => count + points.length, 0),
    [filteredGroupedPoints]
  );

  const resumeLines = useMemo(() => collectResumeLines(resume), [resume]);

  const evidenceByPoint = useMemo(() => {
    const map = new Map();
    if (!report?.analysis_points?.length || !resumeLines.length) {
      return map;
    }

    report.analysis_points.forEach((point) => {
      map.set(point.pointer_id, buildEvidenceForPoint(point, resumeLines));
    });

    return map;
  }, [report, resumeLines]);

  const statusMetrics = useMemo(() => {
    const points = report?.analysis_points || [];
    const total = points.length || 1;
    const passed = points.filter((point) => point.current_status === "Passed").length;
    const needsImprovement = points.filter(
      (point) => point.current_status === "Needs Improvement"
    ).length;
    const criticalFix = points.filter(
      (point) => point.current_status === "Critical Fix"
    ).length;

    return {
      passed,
      needsImprovement,
      criticalFix,
      passedPercent: Math.round((passed / total) * 100),
      needsPercent: Math.round((needsImprovement / total) * 100),
      criticalPercent: Math.round((criticalFix / total) * 100),
    };
  }, [report]);

  const groupedAnalysisSections = useMemo(() => {
    const groups = new Map();
    (report?.analysis_sections || []).forEach((section) => {
      if (!groups.has(section.group)) {
        groups.set(section.group, []);
      }
      groups.get(section.group).push(section);
    });
    return Array.from(groups.entries());
  }, [report]);

  const requirementCheckerRows = useMemo(() => {
    return (report?.jd_match_matrix || [])
      .filter((item) => item.requirement && (item.resume_evidence || item.jd_evidence || item.recommendation || item.safe_rewrite))
      .map((item, index) => ({
        id: `req-${index}`,
        requirement: item.requirement,
        evidence: item.resume_evidence || item.jd_evidence || "",
        status: item.status,
        explanation: item.recommendation || item.safe_rewrite || "",
      }));
  }, [report]);

  const requirementCheckerPrimaryRows = useMemo(
    () => requirementCheckerRows.slice(0, 6),
    [requirementCheckerRows]
  );

  const requirementCheckerContinuationRows = useMemo(
    () => requirementCheckerRows.slice(6),
    [requirementCheckerRows]
  );

  const parsingHealthRows = useMemo(() => {
    if (!report) {
      return [];
    }

    const profile = report.extracted_resume_data?.candidate_profile || {};
    const formatting = report.ats_formatting || {};
    const workExperience = report.extracted_resume_data?.work_experience || [];
    const sectionsDetected = formatting.sections_detected || [];
    const sectionsMissing = formatting.sections_missing || [];
    const jdMatrix = report.jd_match_matrix || [];

    const strongMatches = jdMatrix.filter((item) => normalizeAuditStatus(item.status) === "strong").length;
    const partialMatches = jdMatrix.filter((item) => normalizeAuditStatus(item.status) === "partial").length;
    const nameContactStatus =
      profile.name && profile.email && profile.phone
        ? "strong"
        : profile.name && (profile.email || profile.phone)
          ? "partial"
          : "gap";

    const workHistoryWithDates = workExperience.filter(
      (item) => item.title && item.company && (item.start_date || item.end_date)
    ).length;
    const workHistoryStatus =
      workExperience.length && workHistoryWithDates === workExperience.length
        ? "strong"
        : workExperience.length
          ? "partial"
          : "gap";

    const sectionStatus =
      sectionsDetected.length >= 4 && sectionsMissing.length === 0
        ? "strong"
        : sectionsDetected.length >= 2
          ? "partial"
          : "gap";

    const formattingStatus =
      formatting.tables_detected || String(formatting.multi_column_risk || "").toLowerCase() === "high"
        ? "gap"
        : String(formatting.multi_column_risk || "").toLowerCase() === "medium"
          ? "partial"
          : "strong";

    const keywordStatus =
      jdMatrix.length === 0
        ? "partial"
        : strongMatches >= Math.max(2, Math.ceil(jdMatrix.length * 0.45))
          ? "strong"
          : strongMatches + partialMatches > 0
            ? "partial"
            : "gap";

    const parseRate = formatting.parse_rate;
    const parseRateStatus =
      typeof parseRate === "number"
        ? parseRate >= 85
          ? "strong"
          : parseRate >= 65
            ? "partial"
            : "gap"
        : "partial";

    return [
      {
        id: "name-contact",
        check: "Name and contact",
        finding: [
          profile.name ? `Name: ${profile.name}` : null,
          profile.email ? "Email detected" : null,
          profile.phone ? "Phone detected" : null,
          profile.linkedin ? "LinkedIn detected" : null,
        ].filter(Boolean).join(", ") || "Candidate name and contact details were not confidently extracted.",
        status: nameContactStatus,
        why: "ATS systems first need a clearly extractable profile header to identify and index the candidate.",
      },
      {
        id: "work-history",
        check: "Work history",
        finding:
          workExperience.length > 0
            ? `${workExperience.length} role${workExperience.length === 1 ? "" : "s"} extracted with ${workHistoryWithDates} role${workHistoryWithDates === 1 ? "" : "s"} showing readable title, company, and date evidence.`
            : "No structured work experience blocks were extracted from the resume.",
        status: workHistoryStatus,
        why: "Readable roles, employers, and dates help ATS systems map career progression and relevance.",
      },
      {
        id: "section-headings",
        check: "Section headings",
        finding:
          sectionsDetected.length > 0
            ? `Detected sections: ${sectionsDetected.join(", ")}${sectionsMissing.length ? `. Missing or weak: ${sectionsMissing.join(", ")}` : ""}.`
            : "No clear section structure was detected in the parsed output.",
        status: sectionStatus,
        why: "Clear section labels improve parsing accuracy for skills, experience, education, and summaries.",
      },
      {
        id: "formatting-complexity",
        check: "Formatting complexity",
        finding: [
          formatting.tables_detected ? "Tables detected" : "No table-heavy formatting detected",
          formatting.multi_column_risk ? `multi-column risk: ${formatting.multi_column_risk}` : null,
          formatting.file_type ? `file type: ${formatting.file_type}` : null,
        ].filter(Boolean).join(", "),
        status: formattingStatus,
        why: "Complex tables and multi-column layouts can cause older ATS parsers to misread content order or skill context.",
      },
      {
        id: "keyword-alignment",
        check: "Keyword alignment",
        finding:
          jdMatrix.length > 0
            ? `${strongMatches} strong and ${partialMatches} partial JD requirement match${jdMatrix.length === 1 ? "" : "es"} were found in the current resume.`
            : "No job description was supplied, so keyword alignment was assessed only from the resume itself.",
        status: keywordStatus,
        why: "Ranking depends on whether the resume uses role-relevant terms and proves them with matching evidence.",
      },
      {
        id: "parse-rate",
        check: "Parsing health",
        finding:
          typeof parseRate === "number"
            ? `Estimated ATS parse rate: ${parseRate}/100.`
            : "ATS parse rate was not available in the current report payload.",
        status: parseRateStatus,
        why: "A stronger parse rate usually means the resume can be read, indexed, and scored more reliably by ATS systems.",
      },
    ];
  }, [report]);

  const formattingRecommendations = useMemo(() => {
    const recommendations = [
      ...(report?.ats_formatting?.recommendations || []),
      ...((report?.executive_summary?.top_fixes || []).map((item) => item.recommended_action)),
    ]
      .filter(Boolean)
      .map((item) => String(item).trim());

    return Array.from(new Set(recommendations)).slice(0, 5);
  }, [report]);

  const requirementOutcomeSummary = useMemo(() => {
    if (!report?.jd_match_matrix?.length) {
      return report?.summary || "No JD requirement summary is available yet.";
    }

    const strongItems = report.jd_match_matrix.filter(
      (item) => normalizeAuditStatus(item.status) === "strong"
    );
    const gapItems = report.jd_match_matrix.filter(
      (item) => normalizeAuditStatus(item.status) === "gap"
    );
    const topStrengths = strongItems.map((item) => item.requirement).slice(0, 3);
    const topGaps = gapItems.map((item) => item.requirement).slice(0, 4);

    const strengthsText = topStrengths.length
      ? `The current resume is strongest for ${topStrengths.join(", ")}.`
      : "The current resume has some usable alignment, but the strongest proof is limited.";
    const gapsText = topGaps.length
      ? `The main risk areas are ${topGaps.join(", ")}.`
      : "There are no major missing JD requirement areas flagged in the current matrix.";

    return `${strengthsText} ${gapsText}`;
  }, [report]);

  const scorecardRows = useMemo(() => {
    if (!report) {
      return [];
    }

    const executive = report.executive_summary || {};
    const matrix = report.jd_match_matrix || [];
    const categories = report.category_scores || [];

    const matrixScoresFor = (patterns, fallback = null) => {
      const matched = matrix.filter((item) =>
        patterns.some((pattern) => {
          const haystack = `${item.requirement} ${item.jd_evidence} ${item.resume_evidence}`.toLowerCase();
          return haystack.includes(pattern);
        })
      );
      if (!matched.length) {
        return fallback;
      }
      const scores = matched.map((item) => {
        const normalized = normalizeAuditStatus(item.status);
        if (normalized === "strong") {
          return 86;
        }
        if (normalized === "partial") {
          return 68;
        }
        return 45;
      });
      return averageScore(scores);
    };

    const categoryScoreFor = (pattern) =>
      categories.find((item) => item.category.toLowerCase().includes(pattern))?.score ?? null;

    const rows = [
      {
        label: "ATS parsing and structure",
        score:
          executive.ats_parse_score ??
          report.ats_formatting?.parse_rate ??
          categoryScoreFor("ats"),
      },
      {
        label: "JD requirement coverage",
        score: executive.jd_match_score ?? report.jd_match_score,
      },
      {
        label: "Content quality and impact",
        score: executive.content_quality_score ?? categoryScoreFor("impact"),
      },
      {
        label: "Recruiter readiness",
        score: executive.recruiter_readiness_score,
      },
      {
        label: "BI dashboards and reporting",
        score: matrixScoresFor(["bi", "dashboard", "tableau", "power bi", "reporting"], categoryScoreFor("hard skills")),
      },
      {
        label: "SQL / SAS / BI tools",
        score: matrixScoresFor(["sql", "sas", "power bi", "tableau", "qlik", "tool"], categoryScoreFor("hard skills")),
      },
      {
        label: "Advanced analytics / AI-ML",
        score: matrixScoresFor(["ai", "ml", "advanced analytics", "predictive", "machine learning"], null),
      },
      {
        label: "Data governance and quality",
        score: matrixScoresFor(["data governance", "data quality", "governance", "quality"], null),
      },
      {
        label: "Data warehouse architecture",
        score: matrixScoresFor(["warehouse", "architecture", "dwh"], null),
      },
      {
        label: "Education / degree fit",
        score: matrixScoresFor(["degree", "education", "engineering", "technology"], null),
      },
    ];

    return rows
      .filter((row) => typeof row.score === "number")
      .map((row) => ({ ...row, score: clampPercent(row.score) }));
  }, [report]);

  const biReportingSection = useMemo(() => {
    if (!report) {
      return null;
    }

    const matrix = report.jd_match_matrix || [];
    const workExperience = report.extracted_resume_data?.work_experience || [];
    const tools = report.extracted_resume_data?.skills?.tools || [];
    const isJd = report.analysis_type === "resume_jd" || !!report.job_description_excerpt || report.jd_match_score !== null;

    const biRows = matrix.filter((item) => {
      const haystack = `${item.requirement} ${item.jd_evidence} ${item.resume_evidence}`.toLowerCase();
      return ["bi", "dashboard", "reporting", "tableau", "power bi", "qlik", "visualization"].some((pattern) =>
        haystack.includes(pattern)
      );
    });

    const biKeywords = ["bi", "dashboard", "reporting", "tableau", "power bi", "qlik", "visualization", "kpi", "report"];

    let biScore = null;
    if (isJd) {
      biScore =
        scorecardRows.find((row) => row.label === "BI dashboards and reporting")?.score ??
        averageScore(
          biRows.map((item) =>
            normalizeAuditStatus(item.status) === "strong"
              ? 86
              : normalizeAuditStatus(item.status) === "partial"
                ? 68
                : 45
          )
        );
    } else {
      const matchedTools = tools.filter(t => biKeywords.some(kw => String(t).toLowerCase().includes(kw)));
      const matchedBulletsCount = workExperience.reduce((count, job) => {
        return count + (job.bullets || []).filter(b => biKeywords.some(kw => String(b).toLowerCase().includes(kw))).length;
      }, 0);
      const totalHits = matchedTools.length + matchedBulletsCount;
      biScore = totalHits > 0 ? Math.min(100, 50 + totalHits * 12) : 40;
    }

    const evidenceFound = [];
    biRows.forEach((item) => {
      if (item.resume_evidence) {
        evidenceFound.push(item.resume_evidence);
      }
    });
    workExperience.forEach((item) => {
      item.bullets?.forEach((bullet) => {
        const lower = bullet.toLowerCase();
        if (["dashboard", "report", "kpi", "power bi", "tableau", "qlik", "automation"].some((pattern) => lower.includes(pattern))) {
          evidenceFound.push(bullet);
        }
      });
    });
    if (tools.length) {
      evidenceFound.push(`Tools already visible in the resume include ${tools.slice(0, 6).join(", ")}.`);
    }

    let improvements = Array.from(new Set(biRows.map((item) => item.recommendation).filter(Boolean))).slice(0, 5);
    let topEvidence = Array.from(new Set(evidenceFound.map((item) => String(item).trim()).filter(Boolean))).slice(0, 5);

    if (!isJd) {
      if (!topEvidence.length) {
        topEvidence = ["No BI, dashboarding, or corporate reporting evidence detected in the resume."];
      }
      if (!improvements.length) {
        improvements = [
          "Add BI dashboards and corporate reporting tools (e.g., Tableau, Power BI) to your skills list.",
          "Incorporate KPI dashboarding experience and outcomes in your work experience bullets."
        ];
      }
    }

    const positioning = report.rewrites?.find((item) =>
      (item.section || "").toLowerCase().includes("summary")
    )?.suggested_rewrite || null;

    if (!topEvidence.length || typeof biScore !== "number") {
      return null;
    }

    return {
      score: biScore,
      performance: biScore >= 80 ? "Strong performance" : biScore >= 60 ? "Usable performance" : "Needs stronger proof",
      summary: isJd 
        ? `${topEvidence.length} evidence point${topEvidence.length === 1 ? "" : "s"} in the resume align with BI, dashboarding, reporting, or reporting-tool requirements from the JD.`
        : `${topEvidence.length} BI-related evidence point${topEvidence.length === 1 ? "" : "s"} detected in the resume.`,
      evidence: topEvidence,
      improvements,
      positioning,
    };
  }, [report, scorecardRows]);

  const aiMlSection = useMemo(() => {
    if (!report) {
      return null;
    }

    const matrix = report.jd_match_matrix || [];
    const aiRows = matrix.filter((item) => {
      const haystack = `${item.requirement} ${item.jd_evidence} ${item.resume_evidence}`.toLowerCase();
      return [
        "ai",
        "ml",
        "advanced analytics",
        "predictive",
        "forecast",
        "clustering",
        "regression",
        "decision tree",
        "hypothesis",
        "statistical",
        "fraud",
        "risk",
        "recommendation",
      ].some((pattern) => haystack.includes(pattern));
    });

    const aiScore =
      scorecardRows.find((row) => row.label === "Advanced analytics / AI-ML")?.score ??
      averageScore(
        aiRows.map((item) =>
          normalizeAuditStatus(item.status) === "strong"
            ? 84
            : normalizeAuditStatus(item.status) === "partial"
              ? 58
              : 40
        )
      );

    const aiTableRows = aiRows.slice(0, 5).map((item, index) => ({
      id: `aiml-${index}`,
      requirement: item.requirement,
      evidence: item.resume_evidence || item.jd_evidence || "",
      status: item.status,
      add: item.recommendation || item.safe_rewrite || "",
    }));

    if (!aiTableRows.length || typeof aiScore !== "number") {
      return null;
    }

    const summary = `${aiTableRows.length} advanced analytics or AI/ML-related JD requirement${aiTableRows.length === 1 ? "" : "s"} were identified in the resume-to-JD comparison.`;
    const proofFormat = report.application_question_guidance?.[0]?.suggested_answer_guidance || null;

    return {
      score: aiScore,
      performance: aiScore >= 80 ? "Strong performance" : aiScore >= 60 ? "Partial performance" : "Partial performance",
      summary,
      rows: aiTableRows,
      proofFormat,
    };
  }, [report, scorecardRows]);

  const governanceSection = useMemo(() => {
    if (!report) {
      return null;
    }

    const matrix = report.jd_match_matrix || [];
    const governanceRows = matrix.filter((item) => {
      const haystack = `${item.requirement} ${item.jd_evidence} ${item.resume_evidence}`.toLowerCase();
      return [
        "data governance",
        "data quality",
        "quality",
        "warehouse",
        "architecture",
        "validation",
        "database performance",
        "tuning",
        "reconciliation",
      ].some((pattern) => haystack.includes(pattern));
    });

    const scoreFromLabel = (label) =>
      scorecardRows.find((row) => row.label === label)?.score ?? null;

    const cards = [
      {
        title: "Data Quality",
        score: scoreFromLabel("Data governance and quality"),
        summary:
          governanceRows.find((item) =>
            `${item.requirement} ${item.resume_evidence}`.toLowerCase().includes("quality")
          )?.resume_evidence || "",
      },
      {
        title: "Data Governance",
        score: scoreFromLabel("Data governance and quality"),
        summary:
          governanceRows.find((item) =>
            `${item.requirement} ${item.resume_evidence}`.toLowerCase().includes("governance")
          )?.resume_evidence || "",
      },
      {
        title: "DWH Architecture",
        score: scoreFromLabel("Data warehouse architecture"),
        summary:
          governanceRows.find((item) =>
            `${item.requirement} ${item.resume_evidence}`.toLowerCase().includes("warehouse")
          )?.resume_evidence || "",
      },
    ].filter((card) => typeof card.score === "number" && card.summary);

    const notes = Array.from(new Set(governanceRows.map((item) => item.recommendation).filter(Boolean))).slice(0, 4);

    const riskRows = governanceRows.slice(0, 4).map((item, index) => ({
      id: `gov-${index}`,
      phrase: item.requirement,
      signal: item.resume_evidence || item.jd_evidence || "",
      risk:
        normalizeAuditStatus(item.status) === "strong"
          ? "Low"
          : normalizeAuditStatus(item.status) === "partial"
            ? "Medium"
            : "High",
    }));

    if (!cards.length && !riskRows.length) {
      return null;
    }

    const governanceScore =
      cards.length > 0
        ? clampPercent(averageScore(cards.map((card) => card.score)))
        : clampPercent(
            averageScore(
              riskRows.map((row) => (row.risk === "Low" ? 82 : row.risk === "Medium" ? 62 : 42))
            )
          );

    return {
      cards,
      notes,
      riskRows,
      score: governanceScore,
      performance:
        governanceScore >= 80 ? "Strong performance" : governanceScore >= 60 ? "Usable performance" : "Needs stronger proof",
      summary: `${cards.length || riskRows.length} governance, quality, or architecture checkpoints were mapped from the JD-to-resume comparison.`,
    };
  }, [report, scorecardRows]);

  const keywordCoverageSection = useMemo(() => {
    if (!report) {
      return null;
    }

    const matchedKeywords = (report.jd_match_matrix || [])
      .filter((item) => normalizeAuditStatus(item.status) === "strong")
      .map((item) => item.requirement?.toUpperCase())
      .filter(Boolean)
      .slice(0, 22);

    const missingWeak = (report.jd_match_matrix || [])
      .filter((item) => normalizeAuditStatus(item.status) !== "strong")
      .map((item) => ({
        term: item.requirement.toUpperCase(),
        tone: normalizeAuditStatus(item.status) === "gap" ? "gap" : "partial",
      }))
      .slice(0, 20);

    if (!matchedKeywords.length && !missingWeak.length) {
      return null;
    }

    return {
      matchedKeywords,
      missingWeak,
    };
  }, [report]);

  const leadershipSection = useMemo(() => {
    if (!report) {
      return null;
    }

    const workExperience = report.extracted_resume_data?.work_experience || [];
    const jdMatrix = report.jd_match_matrix || [];

    const leadershipBullets = [];
    workExperience.forEach((role) => {
      (role.bullets || []).forEach((bullet) => {
        const lower = bullet.toLowerCase();
        if (
          [
            "stakeholder", "lead", "managed", "director", "vp",
            "transition", "client", "team", "leadership", "cross-functional",
          ].some((pattern) => lower.includes(pattern))
        ) {
          leadershipBullets.push(bullet);
        }
      });
    });

    const leadershipMatrix = jdMatrix.filter((item) => {
      const haystack = `${item.requirement} ${item.resume_evidence} ${item.jd_evidence}`.toLowerCase();
      return [
        "lead", "stakeholder", "management", "team", "liaison", "client", "director",
      ].some((pattern) => haystack.includes(pattern));
    });

    const score =
      scorecardRows.find((row) => row.label === "Recruiter readiness")?.score ??
      averageScore(
        leadershipMatrix.map((item) =>
          normalizeAuditStatus(item.status) === "strong"
            ? 84
            : normalizeAuditStatus(item.status) === "partial"
              ? 68
              : 48
        )
      );

    const evidence = Array.from(
      new Set(
        [
          ...leadershipBullets,
          ...leadershipMatrix.map((item) => item.resume_evidence).filter(Boolean),
        ].map((item) => String(item).trim())
      )
    ).slice(0, 5);

    const improvements = Array.from(new Set(leadershipMatrix.map((item) => item.recommendation).filter(Boolean))).slice(0, 5);

    if (!evidence.length || typeof score !== "number") {
      return null;
    }

    const verdict = `${evidence.length} leadership or stakeholder-related evidence point${evidence.length === 1 ? "" : "s"} were identified in the current resume.`;

    return {
      score,
      performance: score >= 80 ? "Strong performance" : score >= 60 ? "Usable performance" : "Needs stronger proof",
      summary:
        evidence.length > 0
          ? "The current resume already shows leadership, stakeholder-facing reporting, transitions, and cross-functional coordination."
          : "The resume has some leadership alignment, but leadership scope and stakeholder ownership need clearer proof.",
      evidence,
      improvements,
      verdict,
    };
  }, [report, scorecardRows]);

  const experienceEvidenceSection = useMemo(() => {
    if (!report) {
      return null;
    }

    const workExperience = report.extracted_resume_data?.work_experience || [];

    const fitLabelForRole = (role) => {
      const source = `${role.title} ${role.company} ${(role.skills_detected || []).join(" ")} ${(role.tools_detected || []).join(" ")} ${(role.bullets || []).join(" ")}`.toLowerCase();
      const strongHits = [
        "dashboard", "power bi", "tableau", "qlik", "analytics",
        "reporting", "automation", "stakeholder", "sql",
      ].filter((pattern) => source.includes(pattern)).length;
      if (strongHits >= 5) return "High";
      if (strongHits >= 3) return "Medium";
      return "Low-Med";
    };

    const rows = workExperience.slice(0, 6).map((role, index) => {
      const roleLabel = [role.title, role.company].filter(Boolean).join(", ") || `Role ${index + 1}`;
      const evidenceText = Array.from(
        new Set(
          [
            ...(role.tools_detected || []),
            ...(role.skills_detected || []),
            ...(role.bullets || []).slice(0, 2),
          ]
        )
      )
        .slice(0, 6)
        .join(", ");

      return {
        id: `exp-${index}`,
        role: roleLabel,
        evidence: evidenceText,
        fit: fitLabelForRole(role),
      };
    }).filter((row) => row.evidence);

    if (!rows.length) {
      return null;
    }

    const strategy =
      rows.length >= 2
        ? `Lead with ${rows[0].role} and ${rows[1].role} because they contain the strongest current evidence for this JD.`
        : `Lead with ${rows[0].role} because it contains the strongest current evidence for this JD.`;

    return { rows, strategy };
  }, [report]);

  const riskFlagsSection = useMemo(() => {
    if (!report) {
      return null;
    }

    const matrix = report.jd_match_matrix || [];
    const topFixes = report.executive_summary?.top_fixes || [];
    const rows = [];

    matrix
      .filter((item) => normalizeAuditStatus(item.status) !== "strong")
      .slice(0, 5)
      .forEach((item, index) => {
        rows.push({
          id: `risk-${index}`,
          flag: item.requirement || "JD risk area",
          severity:
            normalizeAuditStatus(item.status) === "gap"
              ? "High"
              : item.importance === "must_have"
                ? "High"
                : "Medium",
          why: item.jd_evidence || item.recommendation || "",
          handle: item.recommendation || item.safe_rewrite || "",
        });
      });

    if (report.ats_formatting?.recommendations?.length) {
      rows.push({
        id: "risk-formatting",
        flag: "ATS formatting and structure risk",
        severity:
          String(report.ats_formatting.multi_column_risk || "").toLowerCase() === "high"
            ? "High"
            : "Medium",
        why:
          report.ats_formatting.tables_detected
            ? "The current format may be table-heavy or harder for ATS systems to parse cleanly."
            : "",
        handle: report.ats_formatting.recommendations[0],
      });
    }

    topFixes.slice(0, 2).forEach((fix, index) => {
      rows.push({
        id: `risk-fix-${index}`,
        flag: fix.title,
        severity: fix.severity === "high" ? "High" : "Medium",
        why: fix.why_it_matters,
        handle: fix.recommended_action,
      });
    });

    return rows.filter((row) => row.flag && row.severity && row.handle).slice(0, 6);
  }, [report]);

  const rewriteSection = useMemo(() => {
    if (!report) {
      return null;
    }

    const summaryDraft =
      report.rewrites?.find((item) => item.section?.toLowerCase().includes("summary"))?.suggested_rewrite ||
      null;

    const bulletPairs = (report.rewrites || [])
      .filter((item) => item.original && item.suggested_rewrite)
      .slice(0, 3)
      .map((item, index) => ({
        id: `rewrite-${index}`,
        before: item.original,
        after: item.suggested_rewrite,
      }));

    if (!summaryDraft && !bulletPairs.length) {
      return null;
    }

    return {
      summaryDraft,
      bulletPairs,
    };
  }, [report]);

  const finalVerdictSection = useMemo(() => {
    if (!report) {
      return null;
    }

    const executive = report.executive_summary || {};
    const currentScore =
      executive.jd_match_score ??
      report.jd_match_score ??
      executive.overall_readiness_score ??
      report.overall_score;
    const potentialScore =
      executive.score_explanation?.estimated_potential_score_after_rewrite ??
      executive.overall_readiness_score ??
      report.overall_score ??
      currentScore;

    const verdictTitle =
      potentialScore >= 80
        ? "Apply after targeted rewrite"
        : currentScore >= 75
          ? "Apply with focused edits first"
          : executive.decision_signal || "Rewrite before applying";

    const verdictBody = executive.recommendation || report.summary;

    const planSource = [
      ...(report.final_action_plan || []),
      ...((executive.top_fixes || []).map((item) => item.recommended_action)),
    ].filter(Boolean);

    const uniquePlan = Array.from(new Set(planSource.map((item) => String(item).trim()))).slice(0, 5);

    const impactForIndex = (index) =>
      executive.top_fixes?.[index]?.expected_score_impact || "";

    const actionRows = uniquePlan.map((action, index) => ({
      id: `verdict-${index}`,
      priority: String(index + 1),
      action,
      impact: impactForIndex(index),
    }));

    if (!uniquePlan.length || typeof currentScore !== "number" || typeof potentialScore !== "number") {
      return null;
    }

    const disclaimer =
      "This report is a resume-to-JD fit analysis based only on the uploaded documents.";

    return {
      currentScore: clampPercent(currentScore),
      potentialScore: clampPercent(potentialScore),
      verdictTitle,
      verdictBody,
      actionRows,
      disclaimer,
    };
  }, [report]);

  const topKeywordSignals = useMemo(() => {
    if (!report?.analysis_points?.length) {
      return [];
    }

    return report.analysis_points
      .filter((point) => point.score < 85)
      .flatMap((point) => buildKeywords(point))
      .filter((token) => token.length > 3)
      .reduce((accumulator, keyword) => {
        accumulator[keyword] = (accumulator[keyword] || 0) + 1;
        return accumulator;
      }, {});
  }, [report]);

  const keywordChips = useMemo(() => {
    const entries = Object.entries(topKeywordSignals || {});
    return entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [topKeywordSignals]);

  const dashboardSourceText = useMemo(() => {
    const workExperience = report?.extracted_resume_data?.work_experience || [];
    const skillGroups = report?.extracted_resume_data?.skills || {};
    const candidateProfile = report?.extracted_resume_data?.candidate_profile || {};

    const structuredText = [
      candidateProfile.summary,
      candidateProfile.current_title,
      candidateProfile.total_experience,
      ...(skillGroups.tools || []),
      ...(skillGroups.technical || []),
      ...(skillGroups.soft || []),
      ...workExperience.flatMap((role) => [
        role.title,
        role.company,
        ...(role.bullets || []),
        ...((role.skills_detected || []).map(String)),
        ...((role.tools_detected || []).map(String)),
      ]),
    ]
      .filter(Boolean)
      .join(" ");

    return (resume?.raw_text || structuredText || resumeLines.map((line) => line.text).join(" ")).toLowerCase();
  }, [report, resume, resumeLines]);

  const dashboardOverallScore = useMemo(() => {
    const executive = report?.executive_summary || {};
    const fallbackFromRows =
      scorecardRows.length > 0 ? averageScore(scorecardRows.map((row) => row.score)) : 0;

    return clampPercent(
      report?.scores?.overall_resume_readiness ??
        executive.overall_readiness_score ??
        report?.overall_score ??
        report?.scores?.jd_match_score ??
        executive.jd_match_score ??
        executive.ats_parse_score ??
        fallbackFromRows
    );
  }, [report, scorecardRows]);

  const radarItems = useMemo(() => {
    const categoryItems = (report?.category_scores || [])
      .filter((item) => typeof item.score === "number")
      .map((item) => ({
        category: item.category,
        score: clampPercent(item.score),
      }));

    if (categoryItems.length) {
      return categoryItems.slice(0, 6);
    }

    return scorecardRows.slice(0, 6).map((item) => ({
      category: item.label,
      score: clampPercent(item.score),
    }));
  }, [report, scorecardRows]);

  const impactLanguageChart = useMemo(() => {
    const strongTokens = [
      "led", "managed", "directed", "spearheaded", "executed", "analyzed",
      "optimized", "delivered", "launched", "implemented", "improved",
      "designed", "drove", "mentored", "negotiated", "built",
    ];
    const weakTokens = [
      "responsible for", "worked on", "handled", "involved in",
      "being a part of", "helped", "assisted", "participated in", "supporting",
    ];

    const strongCount = strongTokens.reduce(
      (sum, token) => sum + (dashboardSourceText.match(new RegExp(`\\b${token.replace(/\s+/g, "\\s+")}\\b`, "g")) || []).length,
      0
    );
    const weakCount = weakTokens.reduce(
      (sum, token) => sum + (dashboardSourceText.match(new RegExp(token.replace(/\s+/g, "\\s+"), "g")) || []).length,
      0
    );
    const total = Math.max(strongCount + weakCount, 1);

    return {
      strongCount,
      weakCount,
      items: [
        {
          label: "Impact-driven",
          value: Math.round((strongCount / total) * 100),
          color: "#0B3550",
        },
        {
          label: "Duty-driven",
          value: Math.round((weakCount / total) * 100),
          color: "#D79B2B",
        },
      ],
    };
  }, [dashboardSourceText]);

  const keywordCloudItems = useMemo(() => {
    const structuredEntries = Object.entries(topKeywordSignals || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    if (structuredEntries.length) {
      const top = structuredEntries[0]?.[1] || 1;
      return structuredEntries.map(([word, count]) => ({
        word,
        weight: Math.max(1, (count / top) * 8),
      }));
    }

    const counts = {};
    tokenizeText(dashboardSourceText).forEach((token) => {
      counts[token] = (counts[token] || 0) + 1;
    });
    const entries = Object.entries(counts)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
    const top = entries[0]?.[1] || 1;
    return entries.map(([word, count]) => ({
      word,
      weight: Math.max(1, (count / top) * 8),
    }));
  }, [dashboardSourceText, topKeywordSignals]);

  const skillMixChart = useMemo(() => {
    const tokens = tokenizeText(dashboardSourceText);
    const hardSkillLexicon = new Set([
      "sql", "python", "power", "tableau", "excel", "analytics", "analysis",
      "modeling", "automation", "etl", "dashboard", "forecasting", "reporting",
      "database", "visualization", "kpi", "bi", "warehouse",
    ]);
    const softSkillLexicon = new Set([
      "leadership", "communication", "stakeholder", "collaboration", "mentoring",
      "training", "negotiation", "teamwork", "problem", "ownership", "planning",
    ]);
    const toolLexicon = new Set([
      "sap", "jira", "confluence", "excel", "powerbi", "power", "sql", "python",
      "oracle", "snowflake", "github", "figma", "aws", "gcp", "looker",
    ]);

    let hardSkills = 0;
    let softSkills = 0;
    let tools = 0;

    tokens.forEach((token) => {
      if (hardSkillLexicon.has(token)) {
        hardSkills += 1;
      }
      if (softSkillLexicon.has(token)) {
        softSkills += 1;
      }
      if (toolLexicon.has(token)) {
        tools += 1;
      }
    });

    return [
      { label: "Technical / Hard Skills", value: hardSkills, color: "#0B3550" },
      { label: "Soft Skills", value: softSkills, color: "#f59e0b" },
      { label: "Tools / Software", value: tools, color: "#1E8F70" },
    ];
  }, [dashboardSourceText]);

  const tenureTimeline = useMemo(() => {
    const toYearValue = (value) => {
      if (!value) return null;
      const lowered = String(value).toLowerCase();
      if (lowered === "current" || lowered === "present") {
        return new Date().getFullYear() + 0.4;
      }
      if (String(value).includes("/")) {
        const [month, year] = String(value).split("/");
        return Number(year) + (Number(month) - 1) / 12;
      }
      const yearMatch = String(value).match(/\d{4}/);
      return yearMatch ? Number(yearMatch[0]) : Number(value);
    };

    const workExperience = (report?.extracted_resume_data?.work_experience || [])
      .map((line) => {
        const startLabel = line.start_date || line.start || line.from;
        const endLabel = line.end_date || line.end || line.to || "Present";
        const start = toYearValue(startLabel);
        const end = toYearValue(endLabel);
        if (!start || !end) {
          return null;
        }
        const label = [line.title, line.company].filter(Boolean).join(", ").slice(0, 56);

        return {
          label: label || "Role",
          start,
          end,
          startLabel,
          endLabel,
        };
      })
      .filter(Boolean)
      .slice(0, 8)
      .sort((a, b) => a.start - b.start);

    if (workExperience.length) {
      return workExperience;
    }

    const sourceLines = resumeLines.filter((line) =>
      /experience|employment|career|professional/i.test(line.section_name || "")
    );
    const datePattern =
      /(?<start>(?:0?[1-9]|1[0-2])\/\d{4}|\d{4})\s*(?:to|-|–|—)\s*(?<end>current|present|(?:0?[1-9]|1[0-2])\/\d{4}|\d{4})/i;

    return sourceLines
      .map((line) => {
        const match = line.text.match(datePattern);
        if (!match?.groups) {
          return null;
        }
        const start = toYearValue(match.groups.start);
        const end = toYearValue(match.groups.end);
        if (!start || !end) {
          return null;
        }
        const label = line.text
          .replace(match[0], "")
          .replace(/\s+/g, " ")
          .replace(/[-|–—]+/g, " ")
          .trim()
          .slice(0, 56);

        return {
          label: label || "Role",
          start,
          end,
          startLabel: match.groups.start,
          endLabel: match.groups.end,
        };
      })
      .filter(Boolean)
      .slice(0, 8)
      .sort((a, b) => a.start - b.start);
  }, [report, resumeLines]);

  const analyzeEvidenceLine = async (segment) => {
    const insightKey = segment.segment_id;
    setAiLineInsights((current) => ({
      ...current,
      [insightKey]: {
        status: "loading",
        error: "",
      },
    }));

    try {
      const response = await analyzeLine({
        resume_id: report.resume_id,
        line_id: segment.line_id,
        line_text: segment.text,
      });

      setAiLineInsights((current) => ({
        ...current,
        [insightKey]: {
          status: "success",
          data: response.data,
          error: "",
        },
      }));
    } catch (requestError) {
      setAiLineInsights((current) => ({
        ...current,
        [insightKey]: {
          status: "error",
          error:
            requestError?.response?.data?.detail ||
            "Unable to analyze this line with AI right now.",
        },
      }));
    }
  };

  const focusResumeArea = (line) => {
    if (!line) {
      return;
    }
    setHighlightedLineId(line.line_id);
    setOriginalSearchInput(line.text || "");
    setOriginalSearchTerm(line.text || "");
  };

  const applyOriginalSearch = () => {
    setOriginalSearchTerm(originalSearchInput.trim());
  };

  const clearPreviewFocus = () => {
    setHighlightedLineId("");
    setOriginalSearchInput("");
    setOriginalSearchTerm("");
  };

  const handleSidebarNavigate = (event, sectionId) => {
    event.preventDefault();
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    window.history.replaceState(null, "", `#${sectionId}`);
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  const originalPreviewUrl = useMemo(() => {
    if (!report?.resume_id) {
      return "";
    }

    return getResumeOriginalPreviewUrl(
      report.resume_id,
      report.saved_report_id || report.analysis_id || "",
      highlightedLineId || "",
      originalSearchTerm || ""
    );
  }, [highlightedLineId, originalSearchTerm, report]);

  const filteredSidebarItems = useMemo(() => {
    if (!report) return REPORT_SIDEBAR_ITEMS;
    const isJd = report.analysis_type === "resume_jd" || !!report.job_description_excerpt || report.jd_match_score !== null;
    
    if (isJd) {
      return REPORT_SIDEBAR_ITEMS;
    } else {
      const excludedIds = [
        "report-jd-matrix",
        "report-jd-matrix-continuation",
        "report-keywords",
        "report-aiml",
        "report-governance",
        "report-leadership"
      ];
      return REPORT_SIDEBAR_ITEMS.filter(item => !excludedIds.includes(item.id));
    }
  }, [report]);

  const handleSave = async () => {
    if (!report?.analysis_id || report?.saved_report_id) {
      return;
    }

    setSaveStatus("loading");
    setSaveMessage("");
    try {
      const response = await saveAnalysisReport(report.analysis_id);
      setReport((current) =>
        current
          ? {
              ...current,
              saved_report_id: response.data.report_id,
            }
          : current
      );
      setSaveMessage("Report saved to the repository.");
      setSaveStatus("success");
    } catch (requestError) {
      setSaveMessage(
        requestError?.response?.data?.detail ||
          "Unable to save the report right now."
      );
      setSaveStatus("error");
    }
  };

  const printFriendlyUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    const path = reportId
      ? `/repository/report/${reportId}`
      : `/reports/analysis/${analysisId}`;
    return `${window.location.origin}${path}?printMode=1`;
  }, [analysisId, reportId]);

  const executeDownloadPdf = () => {
    if (!report || typeof window === "undefined") {
      return;
    }
    const printWindow = window.open(
      `${printFriendlyUrl}&autoPrint=1`,
      "_blank",
      "noopener,noreferrer"
    );
    if (printWindow) {
      printWindow.opener = null;
    }
  };

  const handleDownloadPdf = async () => {
    if (!report || typeof window === "undefined") return;

    if (user?.id) {
      try {
        const passCheck = await checkDownloadPass(user.id, "ats_report", reportId || analysisId || "default");
        if (!passCheck.canDownload) {
          setIsDownloadGateOpen(true);
          return;
        }
      } catch (e) {
        console.warn("Download pass verification check error:", e);
      }
    }

    executeDownloadPdf();
  };

  const openReportPreview = () => {
    if (!report) {
      return;
    }
    setIsReportPreviewOpen(true);
  };

  if (status === "loading") {
    return (
      <div className="brand-type mx-auto max-w-5xl px-4 py-8 md:px-6">
        <Loader label="Loading ATS analysis report..." />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="brand-type mx-auto max-w-5xl px-4 py-8 md:px-6">
        <Toast message={error} variant="error" />
      </div>
    );
  }



  const candidateName =
    cleanCandidateName(report?.candidate_name) ||
    cleanCandidateName(resume?.candidate_name) ||
    cleanCandidateName(report?.resume_file_name) ||
    "Candidate";

  if (isPdfPrintMode) {
    return (
      <div className="brand-type min-h-screen bg-white px-4 py-5">
        <ATSPrintReport
          report={report}
          resume={resume}
          candidateName={candidateName}
          requirementCheckerPrimaryRows={requirementCheckerPrimaryRows}
          requirementCheckerContinuationRows={requirementCheckerContinuationRows}
          parsingHealthRows={parsingHealthRows}
          formattingRecommendations={formattingRecommendations}
          requirementOutcomeSummary={requirementOutcomeSummary}
          scorecardRows={scorecardRows}
          biReportingSection={biReportingSection}
          aiMlSection={aiMlSection}
          governanceSection={governanceSection}
          keywordCoverageSection={keywordCoverageSection}
          leadershipSection={leadershipSection}
          experienceEvidenceSection={experienceEvidenceSection}
          riskFlagsSection={riskFlagsSection}
          rewriteSection={rewriteSection}
          finalVerdictSection={finalVerdictSection}
          dashboardOverallScore={dashboardOverallScore}
        />
      </div>
    );
  }

  return (
    <div
      className={`brand-type cs-report-page min-h-screen text-slate-900 tracking-tight antialiased ${
        isPdfPrintMode ? "bg-white" : "bg-[#F8F3EA]"
      }`}
    >
      {!isPdfPrintMode ? <style>{REPORT_UI_STYLES}</style> : null}
      <div
        className={`cs-report-content mx-auto space-y-6 ${
          isPdfPrintMode
            ? "max-w-[980px] px-4 py-5 sm:px-5"
            : "max-w-[1680px] px-4 py-5 sm:px-5 lg:px-6"
        }`}
      >
        {!isChromeHidden ? (
          <div
            className="cs-report-hero min-h-[235px] rounded-[20px] bg-cover bg-center text-white"
            style={{ backgroundImage: `url(${reportBackground})` }}
          >
            <div className="cs-report-hero-content flex min-h-[235px] flex-col justify-between gap-4 p-5 sm:p-6 lg:flex-row lg:items-end lg:p-7">
              <div className="max-w-[720px]">
                <Link
                  to="/repository"
                  className="inline-flex items-center gap-2 text-[9px] font-bold text-[#D6E2E8] transition hover:text-white"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back to Reports
                </Link>

                <div className="mt-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#E8B94F]" />
                  <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#E8B94F]">Report</span>
                </div>

                <h1
                  className="mt-2 font-serif text-[32px] font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-[38px] lg:text-[42px]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  ATS Analysis Report
                </h1>

                <p className="mt-2 max-w-[650px] text-[11.5px] font-medium leading-[1.55] text-[#D1DEE5] sm:text-[12px]">
                  A detailed evaluation of your resume&apos;s ATS compatibility, strengths, and opportunities for improvement.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-medium text-[#D5E1E7]">
                  <span className="inline-flex items-center gap-2"><span className="text-[#E8B94F]">▣</span>Generated {new Date(report?.generated_at || report?.created_at || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className="hidden h-4 w-px bg-white/20 sm:block" />
                  <span className="inline-flex items-center gap-2"><span className="text-[#E8B94F]">◇</span>for {report?.extracted_jd_data?.jd_profile?.target_role || "your target role"}</span>
                  <span className="hidden h-4 w-px bg-white/20 sm:block" />
                  <span className="inline-flex items-center gap-2"><span className="text-[#E8B94F]">▤</span>Using {report.resume_file_name}</span>
                </div>
              </div>

              <div className="flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 lg:justify-end">
                <Button
                  variant={report.saved_report_id ? "outline" : "primary"}
                  onClick={handleSave}
                  disabled={Boolean(report.saved_report_id) || saveStatus === "loading"}
                  className="shrink-0 whitespace-nowrap rounded-[9px] border border-white/20 bg-white/10 px-3 py-2 text-[9px] font-black text-white backdrop-blur-sm transition hover:bg-white/15"
                  style={{ borderColor: "rgba(255,255,255,.2)", backgroundColor: "rgba(255,255,255,.09)", color: "#fff" }}
                >
                  <FolderOpen className="mr-1.5 h-3.5 w-3.5" />
                  {report.saved_report_id ? "Saved" : saveStatus === "loading" ? "Saving..." : "Save"}
                </Button>

                <Button
                  variant="outline"
                  onClick={openReportPreview}
                  className="shrink-0 whitespace-nowrap rounded-[9px] border border-white/20 bg-white/10 px-3 py-2 text-[9px] font-black text-white backdrop-blur-sm transition hover:bg-white/15"
                  style={{ borderColor: "rgba(255,255,255,.2)", backgroundColor: "rgba(255,255,255,.09)", color: "#fff" }}
                >
                  Preview PDF
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDownloadPdf}
                  className="shrink-0 whitespace-nowrap rounded-[9px] border border-white/20 bg-white/10 px-3 py-2 text-[9px] font-black text-white backdrop-blur-sm transition hover:bg-white/15"
                  style={{ borderColor: "rgba(255,255,255,.2)", backgroundColor: "rgba(255,255,255,.09)", color: "#fff" }}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </Button>

                <Link to="/check-ats" className="shrink-0">
                  <Button
                    variant="outline"
                    className="whitespace-nowrap rounded-[9px] border border-[#E8B94F] bg-[#E8B94F] px-3 py-2 text-[9px] font-black text-[#062B43] transition hover:bg-[#F1C65D]"
                    style={{ borderColor: "#E8B94F", backgroundColor: "#E8B94F", color: "#062B43" }}
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                    New Check
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div
          className={`grid gap-6 ${
            isChromeHidden ? "" : "xl:grid-cols-[255px_minmax(0,1fr)]"
          }`}
        >
          {/* Enhanced Sidebar Navigation Component */}
          {!isChromeHidden ? (
          <aside className="hidden xl:block min-w-0">
            <div className="xl:sticky xl:top-6 space-y-4">
              <Card
                className={`cs-report-sidebar rounded-3xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-300 ${
                  isSidebarMinimized ? "xl:w-[86px]" : ""
                }`}
              >
                <div className="cs-report-sidebar-header flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                  {!isSidebarMinimized ? (
                    <div className="cs-sidebar-label rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#0B3550]">
                      Report Sections
                    </div>
                  ) : (
                    <div className="h-8" />
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSidebarMinimized((value) => !value)}
                    aria-label={isSidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white transition ml-auto"
                  >
                    {isSidebarMinimized ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="space-y-1 max-h-[64vh] overflow-y-auto pr-1">
                  {filteredSidebarItems.map((item, index) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(event) => handleSidebarNavigate(event, item.id)}
                      title={item.label}
                      className={`flex items-center rounded-xl p-2 text-xs font-bold transition hover:bg-slate-50 text-slate-600 hover:text-[#0B3550] ${
                        isSidebarMinimized
                          ? "justify-center px-2 py-3"
                          : "gap-3 px-3 py-2.5"
                      }`}
                    >
                      <span className="h-6 w-6 inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-600 shadow-sm border border-slate-200/40">
                        {index + 1}
                      </span>
                      {!isSidebarMinimized ? (
                        <span className="truncate tracking-tight">
                          {item.label}
                        </span>
                      ) : null}
                    </a>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsResumeViewerOpen(true)}
                    className={`w-full rounded-xl border-slate-200 bg-slate-50 text-[11px] font-black uppercase text-slate-700 hover:bg-white transition py-2 ${
                      isSidebarMinimized ? "px-2" : "px-4"
                    }`}
                    title="Open Resume"
                  >
                    <Eye className={`${isSidebarMinimized ? "" : "mr-2 "}h-3.5 w-3.5`} />
                    {!isSidebarMinimized ? "Open Resume" : null}
                  </Button>
                </div>
              </Card>
            </div>
          </aside>
          ) : null}

          {/* Main Main-flow Grid Container Blocks */}
          <div className="min-w-0 space-y-6">
            
            {!isChromeHidden ? (
              <ReportDashboardOverview
                report={report}
                dashboardOverallScore={dashboardOverallScore}
                finalVerdictSection={finalVerdictSection}
                keywordCoverageSection={keywordCoverageSection}
                riskFlagsSection={riskFlagsSection}
                scorecardRows={scorecardRows}
                onOpenResume={() => setIsResumeViewerOpen(true)}
                onDownloadPdf={handleDownloadPdf}
              />
            ) : null}

            {/* Core Overview Summary Panel */}
            <ReportSectionShell
              id="report-overview"
              eyebrow="Report Overview"
              title={`${candidateName} Report Summary`}
              description={report.summary}
            >
              <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] bg-white rounded-2xl p-4 border border-slate-200">
                <div className="min-w-0 space-y-2">
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B3550]">
                    {report.analysis_type === "resume_jd"
                      ? "Resume + Job Alignment Mode"
                      : "Resume Standard Scan"}
                  </span>
                </div>

                <div className="min-w-0 space-y-1.5 sm:pl-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600">
                    <span className="font-bold text-slate-800">Target Candidate:</span>{" "}
                    {candidateName}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-600">
                    <span className="font-bold text-slate-800">Uploaded File:</span>{" "}
                    {report.resume_file_name}
                  </p>
                  {report.job_description_excerpt ? (
                    <p className="max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                      <span className="font-bold text-slate-700 block mb-0.5">Job Excerpt Snapshot:</span>{" "}
                      {report.job_description_excerpt}
                    </p>
                  ) : null}
                </div>
              </div>

              {saveMessage ? (
                <div className="mt-3">
                  <Toast
                    message={saveMessage}
                    variant={saveStatus === "error" ? "error" : "success"}
                  />
                </div>
              ) : null}
            </ReportSectionShell>

            <MethodologySection report={report} />

            {/* At a Glance One-pager Layout Section */}
            {report.executive_summary ? (
              <Card id="report-at-glance-details" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-6">
                  <h2 className="text-xl font-black text-[#0B3550]">At a Glance</h2>
                  <p className="text-xs text-slate-500 font-medium">A quick view of your current readiness, strongest areas, and highest-priority fixes.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] items-center bg-slate-50/60 p-5 rounded-2xl border border-slate-150">
                  <div className="flex justify-center">
                    <div className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full bg-amber-400 text-center text-[#0B3550] shadow-md border-4 border-white">
                      <p className="text-2xl font-black">
                        {report.executive_summary.jd_match_score ?? report.executive_summary.overall_readiness_score}/100
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-wider mt-0.5">
                        {report.executive_summary.jd_match_score !== null ? "Match Rating" : "Base Score"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-black text-[#0B3550]">
                      {report.executive_summary.decision_signal}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                      {report.executive_summary.recommendation}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {report?.extracted_jd_data?.jd_profile?.target_role ? (
                    <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Role</p>
                        <h4 className="mt-2 text-sm font-black text-[#0B3550] leading-snug">
                          {report?.extracted_jd_data?.jd_profile?.target_role}
                        </h4>
                      </div>
                      {report?.extracted_jd_data?.jd_profile?.company && (
                        <span className="mt-3 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-fit truncate max-w-full">
                          {report?.extracted_jd_data?.jd_profile?.company}
                        </span>
                      )}
                    </div>
                  ) : null}

                  {report.category_scores?.[0]?.category ? (
                    <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Strongest Area</p>
                        <h4 className="mt-2 text-sm font-black text-emerald-700 leading-snug">
                          {report.category_scores?.[0]?.category}
                        </h4>
                      </div>
                      <span className="mt-3 text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                        Validated Strong
                      </span>
                    </div>
                  ) : null}

                  {report.executive_summary.top_fixes?.[0]?.title ? (
                    <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Priority Risk</p>
                        <h4 className="mt-2 text-sm font-black text-rose-700 leading-snug line-clamp-2">
                          {report.executive_summary.top_fixes?.[0]?.title}
                        </h4>
                      </div>
                      <span className="mt-3 text-[10px] font-black uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 w-fit">
                        Requires Action
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <h4 className="text-xs font-black text-[#0B3550] uppercase tracking-wider">Report Summary</h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700">{report.summary}</p>
                  {report.executive_summary.score_explanation?.estimated_potential_score_after_rewrite && (
                    <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold text-emerald-800">Estimated potential score post targeted rewrite optimization:</span>
                      <span className="font-black text-[#0B3550] bg-white border px-2 py-0.5 rounded-md shadow-sm ml-2 shrink-0">
                        {report.executive_summary.score_explanation.estimated_potential_score_after_rewrite}/100
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ) : null}

            {/* Role Requirement Match Core Table Component */}
            {requirementCheckerPrimaryRows.length ? (
              <Card id="report-jd-matrix" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0B3550]">Role Requirement Match</h2>
                  <p className="text-xs text-slate-500 font-medium">How the resume supports the most important requirements in the target role.</p>
                </div>
                <AnalysisTable
                  columns={[
                    { key: "requirement", label: "JD Requirement", width: "24%", emphasis: true },
                    { key: "evidence", label: "Resume Evidence Found", width: "32%" },
                    { key: "status", label: "Status Flag", width: "16%" },
                    { key: "explanation", label: "Recommended Optimization Fix", width: "28%" },
                  ]}
                  rows={requirementCheckerPrimaryRows}
                />
              </Card>
            ) : null}

            {/* Requirement Matrix Continuation Table Component */}
            {requirementCheckerContinuationRows.length ? (
              <Card id="report-jd-matrix-continuation" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0B3550]">Additional Requirement Match</h2>
                  <p className="text-xs text-slate-500 font-medium">Additional requirements and supporting evidence from the resume.</p>
                </div>
                <AnalysisTable
                  columns={[
                    { key: "requirement", label: "JD Requirement", width: "24%", emphasis: true },
                    { key: "evidence", label: "Resume Evidence Found", width: "32%" },
                    { key: "status", label: "Status Flag", width: "16%" },
                    { key: "explanation", label: "Recommended Optimization Fix", width: "28%" },
                  ]}
                  rows={requirementCheckerContinuationRows}
                />
                <div className="rounded-2xl bg-amber-50/50 border border-amber-200 p-4 text-xs font-medium text-amber-900 leading-relaxed">
                  <span className="font-black text-amber-800 uppercase block mb-1">Requirement Summary</span>
                  {requirementOutcomeSummary}
                </div>
              </Card>
            ) : null}

            {/* ATS Parsing Health Overview Dashboard Grid */}
            {parsingHealthRows.length ? (
              <Card id="report-ats-parsing" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0B3550]">ATS Parsing &amp; Structural Health</h2>
                  <p className="text-xs text-slate-500 font-medium">Checks whether ATS systems can reliably read your contact details, experience, sections, and formatting.</p>
                </div>
                <AnalysisTable
                  columns={[
                    { key: "check", label: "Structural Audit Check", width: "22%", emphasis: true },
                    { key: "finding", label: "Extracted State Result", width: "34%" },
                    { key: "status", label: "Compliance", width: "16%" },
                    { key: "why", label: "Why it matters", width: "28%" },
                  ]}
                  rows={parsingHealthRows}
                />
                {formattingRecommendations.length ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                    <h4 className="text-xs font-black text-[#0B3550] uppercase tracking-wider">Formatting Recommendations</h4>
                    <div className="grid gap-2">
                      {formattingRecommendations.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                          <p className="font-medium">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Card>
            ) : null}

            {/* Scorecard Visual Layout Matrix */}
            {scorecardRows.length ? (
              <Card id="report-scorecard" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-5">
                  <h2 className="text-xl font-black text-[#0B3550]">Scorecard</h2>
                  <p className="text-xs text-slate-500 font-medium">A clear breakdown of the areas that most affect ATS and recruiter readiness.</p>
                </div>
                <div className="space-y-4">
                  {scorecardRows.map((row) => {
                    const level = scoreLevel(row.score);
                    return (
                      <div key={row.label} className="bg-slate-50/50 rounded-2xl p-3 border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-800">{row.label}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden max-w-md">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${row.score}%`, backgroundColor: level.color }} />
                            </div>
                            <span className="text-xs font-black text-slate-900 shrink-0">{row.score}%</span>
                          </div>
                        </div>
                        <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white text-center w-fit shrink-0 shadow-sm" style={{ backgroundColor: level.color }}>
                          {level.label} Match
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs text-slate-500 leading-relaxed font-medium">
                  <span className="font-black text-[#0B3550] uppercase block mb-1">How to read the scores</span>
                  Scores &ge; 80% confirm high operational confidence data signals. Scores 60-79% identify functional values that require tactical phrase expanding enhancements. Scores below 60% represent critical routing risks.
                </div>
              </Card>
            ) : null}

            {/* Charts Graphics Layout Block Container */}
            <div id="report-visuals" className="scroll-mt-28">
              <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0B3550]">Report Visuals</span>
                    <h2 className="text-xl font-black text-[#0B3550]">Resume Performance</h2>
                    <p className="text-xs text-slate-500 font-medium">A visual summary of the strongest and weakest signals in the current resume.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVisualReportMinimized((val) => !val)}
                    className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-white transition"
                  >
                    {isVisualReportMinimized ? <><ChevronDown className="mr-1.5 h-3.5 w-3.5" />Expand Graphs</> : <><ChevronUp className="mr-1.5 h-3.5 w-3.5" />Minimize Graphs</>}
                  </button>
                </div>

                {!isVisualReportMinimized && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-between shadow-xs">
                      <div className="w-full text-left border-b border-slate-100 pb-2 mb-2">
                        <p className="text-xs font-black text-[#0B3550]">ATS Readiness</p>
                      </div>
                      <GaugeChart score={dashboardOverallScore} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-between shadow-xs">
                      <div className="w-full text-left border-b border-slate-100 pb-2 mb-2">
                        <p className="text-xs font-black text-[#0B3550]">Category Balance</p>
                      </div>
                      <RadarChart items={radarItems} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
                      <div className="text-left border-b border-slate-100 pb-2 mb-4">
                        <p className="text-xs font-black text-[#0B3550]">Impact Language</p>
                      </div>
                      <DoughnutChart
                        items={impactLanguageChart.items}
                        centerLabel="Phrases"
                        centerValue={`${impactLanguageChart.strongCount}/${impactLanguageChart.weakCount}`}
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
                      <div className="text-left border-b border-slate-100 pb-2 mb-4">
                        <p className="text-xs font-black text-[#0B3550]">Career Timeline</p>
                      </div>
                      <TimelineChart items={tenureTimeline} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
                      <div className="text-left border-b border-slate-100 pb-2 mb-4">
                        <p className="text-xs font-black text-[#0B3550]">Keyword Prominence</p>
                      </div>
                      <KeywordProminenceChart items={keywordCloudItems} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
                      <div className="text-left border-b border-slate-100 pb-2 mb-4">
                        <p className="text-xs font-black text-[#0B3550]">Skill Mix</p>
                      </div>
                      <StackedBarChart items={skillMixChart} />
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Quick First Upload Scan Pointers Section */}
            {report.quick_scan_sections?.length ? (
              <div id="report-quick-scan" className="scroll-mt-28">
                <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Review</span>
                      <h2 className="text-xl font-black text-[#0B3550] mt-1">First-Pass Findings</h2>
                      <p className="text-xs text-slate-500 font-medium">The main observations surfaced during the first review of the resume.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsQuickScanMinimized((v) => !v)}
                      className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-white transition"
                    >
                      {isQuickScanMinimized ? <><ChevronDown className="mr-1.5 h-3.5 w-3.5" />Expand Pointers</> : <><ChevronUp className="mr-1.5 h-3.5 w-3.5" />Minimize Pointers</>}
                    </button>
                  </div>

                  {!isQuickScanMinimized && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {report.quick_scan_sections.map((section) => (
                        <div key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                          <h3 className="text-xs font-black text-[#0B3550] border-b border-slate-200 pb-1.5 mb-2 uppercase tracking-wide">
                            {section.title}
                          </h3>
                          <div className="space-y-1.5">
                            {section.items?.length ? (
                              section.items.map((item, idx) => (
                                <div key={idx} className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs font-medium leading-relaxed text-slate-600 shadow-xs">
                                  {item}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-400 italic font-medium p-1">No dynamic points matched for this matrix class.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            ) : null}

            {/* Keyword Density Coverage chips matrix layout */}
            {keywordCoverageSection ? (
              <Card id="report-keywords" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xl font-black text-[#0B3550]">Keyword Coverage</h2>
                  <p className="text-xs text-slate-500 font-medium">Shows which target-role terms are already supported and which still need stronger evidence.</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm space-y-3">
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider border-b border-slate-100 pb-2">Matched Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {keywordCoverageSection.matchedKeywords.map((item, idx) => (
                        <span key={idx} className="inline-flex rounded-lg bg-emerald-50 text-emerald-850 px-2.5 py-1 text-[11px] font-bold border border-emerald-200/60 shadow-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm space-y-3">
                    <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider border-b border-slate-100 pb-2">Missing or Weak Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {keywordCoverageSection.missingWeak.map((item, idx) => (
                        <span key={idx} className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-bold border shadow-xs ${
                          item.tone === "gap" ? "bg-rose-50 text-rose-800 border-rose-200/60" : "bg-amber-50 text-amber-800 border-amber-200/60"
                        }`}>
                          {item.term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-[#F4F1EA] p-4 text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="font-black text-[#0B3550] uppercase block mb-1">Keyword guidance</span>
                  System processes classify attributes into precise coverage bounds: exact data matches, contextual semantics, and systemic missing deficits. Bullet point integration requires clear verification tokens rather than plain frequency accumulation text loops.
                </div>
              </Card>
            ) : null}

            {/* Risk Flags & objections matrix table component */}
            {riskFlagsSection?.length ? (
              <Card id="report-risk-flags" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0B3550]">Risk Flags &amp; Objection Analysis</h2>
                  <p className="text-xs text-slate-500 font-medium">Highlights the issues most likely to weaken ATS ranking or raise recruiter questions.</p>
                </div>
                <AnalysisTable
                  columns={[
                    { key: "flag", label: "Risk area", width: "24%", emphasis: true },
                    { key: "severity", label: "Severity", width: "14%" },
                    { key: "why", label: "Why it matters", width: "30%" },
                    { key: "handle", label: "Recommended fix", width: "32%" },
                  ]}
                  rows={riskFlagsSection.map((row) => ({
                    ...row,
                    status: row.severity === "High" ? "gap" : "partial",
                  }))}
                />
              </Card>
            ) : null}

            {/* Resume Upgrade Recommendations before and after text blocks layout */}
            {rewriteSection ? (
              <Card id="report-rewrites" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div>
                  <h2 className="text-xl font-black text-[#0B3550]">Rewrite Recommendations</h2>
                  <p className="text-xs text-slate-500 font-medium">Practical before-and-after examples to strengthen wording without changing the underlying experience.</p>
                </div>

                {rewriteSection.summaryDraft && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-2">
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider border-b border-blue-100 pb-1.5">Suggested Professional Summary</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium italic">"{rewriteSection.summaryDraft}"</p>
                  </div>
                )}

                {rewriteSection.bulletPairs.length ? (
                  <div className="space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Bullet Improvements</p>
                    {rewriteSection.bulletPairs.map((pair) => (
                      <div key={pair.id} className="grid gap-3 sm:grid-cols-2 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2 flex flex-col justify-between">
                          <div>
                            <span className="inline-flex rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white mb-2">Before</span>
                            <p className="text-xs leading-relaxed text-slate-600 font-medium font-mono">"{pair.before}"</p>
                          </div>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-2 flex flex-col justify-between">
                          <div>
                            <span className="inline-flex rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white mb-2">After</span>
                            <p className="text-xs leading-relaxed text-slate-700 font-bold">"{pair.after}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card>
            ) : null}

            {/* Functional BI Reporting deep section card */}
            {biReportingSection ? (
              <Card id="report-bi-reporting" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Domain Review</span>
                  <h2 className="text-xl font-black text-[#0B3550] mt-2">BI, Dashboards &amp; Corporate Reporting</h2>
                  <p className="text-xs text-slate-500 font-medium">Reviews the evidence already present for BI, dashboarding, reporting, and related tools.</p>
                </div>

                <ScoreSummaryPanel
                  score={biReportingSection.score}
                  label="Fit Rating"
                  title={biReportingSection.performance}
                  summary={biReportingSection.summary}
                  tone="emerald"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm">
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-3">Extracted Asset Evidence</h4>
                    <div className="space-y-2">
                      {biReportingSection.evidence.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50/50 p-2 rounded-lg border border-slate-100 font-medium">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm">
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-3">Target Improvement Actions</h4>
                    <div className="space-y-2">
                      {biReportingSection.improvements.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50/50 p-2 rounded-lg border border-slate-100 font-medium">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {biReportingSection.positioning && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs font-medium text-blue-900">
                    <span className="font-black text-blue-800 block mb-1 uppercase tracking-wider">Strategic Resume Positioning Draft</span>
                    "{biReportingSection.positioning}"
                  </div>
                )}
              </Card>
            ) : null}

            {/* Advanced Analytics / AI-ML Core Registry Panel */}
            {aiMlSection?.rows?.length ? (
              <Card id="report-aiml" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xl font-black text-[#0B3550]">Advanced Analytics &amp; AI/ML Verification</h2>
                  <p className="text-xs text-slate-500 font-medium">{aiMlSection.summary}</p>
                </div>

                <ScoreSummaryPanel
                  score={aiMlSection.score}
                  label="Fit Score"
                  title={aiMlSection.performance}
                  summary={aiMlSection.summary}
                  tone="rose"
                />

                <AnalysisTable
                  columns={[
                    { key: "requirement", label: "Requirement", width: "25%", emphasis: true },
                    { key: "evidence", label: "Resume Evidence", width: "32%" },
                    { key: "status", label: "Status Flag", width: "15%" },
                    { key: "add", label: "Recommended Addition", width: "28%" },
                  ]}
                  rows={aiMlSection.rows}
                />

                {aiMlSection.proofFormat && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs font-medium text-amber-900 leading-relaxed">
                    <span className="font-black text-amber-800 uppercase block mb-1">Suggested Evidence Pattern</span>
                    {aiMlSection.proofFormat}
                  </div>
                )}
              </Card>
            ) : null}

            {/* Data Governance, Quality & Architecture section */}
            {governanceSection && (governanceSection.cards?.length || governanceSection.riskRows?.length) ? (
              <Card id="report-governance" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xl font-black text-[#0B3550]">Data Governance, Quality &amp; Architecture Matrix</h2>
                  <p className="text-xs text-slate-500 font-medium">Reviews evidence related to governance, data quality, architecture, and validation responsibilities.</p>
                </div>

                <ScoreSummaryPanel
                  score={governanceSection.score}
                  label="Fit Score"
                  title={governanceSection.performance}
                  summary={governanceSection.summary}
                  tone={governanceSection.score >= 80 ? "emerald" : governanceSection.score >= 60 ? "amber" : "rose"}
                />

                {governanceSection.cards?.length ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {governanceSection.cards.map((card, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm space-y-3 flex min-h-[182px] flex-col justify-between">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <h4 className="text-xs font-black text-[#0B3550]">{card.title}</h4>
                          <span className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-black text-[#0B3550] shadow-2xs">{card.score}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{card.summary}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {governanceSection.notes?.length ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <h4 className="text-xs font-black text-[#0B3550] uppercase tracking-wider">Improvement Notes</h4>
                    <div className="space-y-1">
                      {governanceSection.notes.map((note, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                          <p>{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {governanceSection.riskRows?.length ? (
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Evidence Gaps</p>
                    <AnalysisTable
                      columns={[
                        { key: "phrase", label: "Target Requirement", width: "40%", emphasis: true },
                        { key: "signal", label: "Resume Evidence", width: "44%" },
                        { key: "risk", label: "Risk", width: "16%" },
                      ]}
                      rows={governanceSection.riskRows.map((row) => ({
                        ...row,
                        status: row.risk === "High" ? "gap" : row.risk === "Medium" ? "partial" : "strong",
                      }))}
                    />
                  </div>
                ) : null}
              </Card>
            ) : null}

            {/* Leadership section */}
            {leadershipSection ? (
              <Card id="report-leadership" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xl font-black text-[#0B3550]">Leadership &amp; Stakeholder Fit</h2>
                  <p className="text-xs text-slate-500 font-medium">Reviews leadership scope, stakeholder exposure, team ownership, and cross-functional evidence.</p>
                </div>
                <ScoreSummaryPanel
                  score={leadershipSection.score}
                  label="Fit"
                  title={leadershipSection.performance}
                  summary={leadershipSection.summary}
                  tone="emerald"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm">
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">Leadership Evidence</h4>
                    <div className="space-y-1.5">
                      {leadershipSection.evidence.map((item, idx) => (
                        <p key={idx} className="text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">&bull; {item}</p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm">
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2">Recommended Improvements</h4>
                    <div className="space-y-1.5">
                      {leadershipSection.improvements.map((item, idx) => (
                        <p key={idx} className="text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">&bull; {item}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs font-medium text-emerald-900">
                  <span className="font-bold block mb-0.5">Leadership Summary:</span> {leadershipSection.verdict}
                </div>
              </Card>
            ) : null}

            {/* Operational Verdict Plan Block Panel */}
            {finalVerdictSection ? (
              <Card id="report-final-verdict" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-[#0B3550]">Final Verdict</h2>
                  <p className="text-xs text-slate-500 font-medium">A practical recommendation on whether to apply now or strengthen the resume first.</p>
                </div>

                <div className="rounded-2xl bg-[#0B3550] text-white p-5 flex flex-col sm:flex-row items-center gap-6 shadow-md border border-slate-800">
                  <div className="flex gap-3 shrink-0">
                    <div className="h-16 w-16 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center">
                      <span className="text-base font-black text-amber-400">{finalVerdictSection.currentScore}%</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Current</span>
                    </div>
                    <div className="h-16 w-16 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center">
                      <span className="text-base font-black text-emerald-400">{finalVerdictSection.potentialScore}%</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Potential</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-base font-black text-amber-400">{finalVerdictSection.verdictTitle}</h3>
                    <p className="text-xs leading-relaxed text-slate-300 font-medium">{finalVerdictSection.verdictBody}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Priority Action Plan</p>
                  <AnalysisTable
                    columns={[
                      { key: "priority", label: "Rank", width: "12%", emphasis: true },
                      { key: "action", label: "Action", width: "70%" },
                      { key: "impact", label: "Expected Impact", width: "18%" },
                    ]}
                    rows={finalVerdictSection.actionRows}
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-[11px] font-bold text-slate-400">
                  Disclaimer Notice: {finalVerdictSection.disclaimer}
                </div>
              </Card>
            ) : null}

            {/* Complete Grouped Structural Analysis Blocks Sections */}
            {groupedAnalysisSections.length ? (
              <div id="report-detailed" className="scroll-mt-28 space-y-6">
                {groupedAnalysisSections.map(([group, sections]) => (
                  <Card key={group} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Review</span>
                        <h2 className="text-xl font-black text-[#0B3550] mt-1">{group}</h2>
                      </div>
                      <span className="rounded-full bg-slate-100 border px-3 py-1 text-[11px] font-black text-[#0B3550] shadow-2xs">
                        {sections.reduce((cnt, s) => cnt + (s.issue_count || 0), 0)} review points
                      </span>
                    </div>
                    <div className="grid gap-4">
                      {sections.map((section) => (
                        <ReportSectionCard key={section.id} section={section} />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}

            {/* Granular Ledger Checklist Slicer */}
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-black text-[#0B3550]">Full ATS Audit</h2>
                  <p className="text-xs text-slate-500 font-medium">Detailed review of the ATS checks applied to the uploaded resume.</p>
                </div>
                <div className="w-full sm:w-64 shrink-0">
                  <select
                    id="analysis-category-slicer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none transition focus:border-[#0B3550] focus:bg-white"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1">Showing: {visiblePointCount} checks</span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1">50 ATS checks completed</span>
              </div>

              <div className="space-y-4 mt-2">
                {filteredGroupedPoints.map(([category, points]) => (
                  <div key={category} className="space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 pt-1">{category}</p>
                    {points.map((point) => {
                      const evidenceLines = evidenceByPoint.get(point.pointer_id) || [];
                      const primaryLine = evidenceLines[0];

                      return (
                        <div key={point.pointer_id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
                          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-black text-[#0B3550] leading-snug">
                                {point.pointer_id}. {point.title}
                              </p>
                              <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
                                <span className="bg-white border px-1.5 py-0.5 rounded shadow-2xs text-slate-600">{point.current_status}</span>
                                <span className="bg-white border px-1.5 py-0.5 rounded shadow-2xs text-slate-600">Grade: {point.score}</span>
                                <span className="bg-white border px-1.5 py-0.5 rounded shadow-2xs text-slate-600">Priority: {point.severity}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed text-slate-600 mb-2 font-medium">{point.explanation}</p>
                          <p className="text-xs leading-relaxed text-slate-700 font-bold bg-white p-2.5 rounded-xl border border-slate-150">
                            <span className="font-black text-slate-950 uppercase tracking-wider text-[10px] block mb-0.5 text-blue-800">Recommendation:</span>
                            {point.improvement_suggestion}
                          </p>

                          {point.related_titles?.length ? (
                            <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50/60 p-2.5 text-[11px] font-medium text-slate-600">
                              <span className="font-bold text-amber-800">Cascade fixes improve remaining:</span>{" "}
                              {point.related_titles.join(", ")}
                              {point.related_categories?.length && ` across ${point.related_categories.join(", ")}`}
                            </div>
                          ) : null}

                          {evidenceLines.length ? (
                            <div className="mt-3.5 space-y-2 border-l-2 border-slate-200 pl-3">
                              <div className="flex items-center gap-1.5 pl-1 mb-1">
                                <Target className="h-3.5 w-3.5 text-blue-700" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Resume Evidence</span>
                              </div>
                              {evidenceLines.map((line) => (
                                <div key={line.segment_id} className="rounded-xl border border-slate-150 bg-white p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      <button type="button" onClick={() => focusResumeArea(line)} className="min-w-0 flex-1 text-left group">
                                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block group-hover:text-blue-700 transition">
                                          {line.section_name} &middot; {line.isFullArea ? "Section context" : "Matched text"}
                                        </span>
                                        <p className="mt-0.5 text-xs font-semibold text-slate-700 leading-normal break-words">"{line.text}"</p>
                                      </button>
                                      <Button
                                        variant="outline"
                                        className="rounded-lg px-2.5 py-1 text-[10px] font-black bg-slate-50 shrink-0"
                                        onClick={() => analyzeEvidenceLine(line)}
                                      >
                                        <Sparkles className="mr-1.5 h-3 w-3 text-amber-500 fill-amber-400 inline" />
                                        {aiLineInsights[line.segment_id]?.status === "loading" ? "Reviewing..." : "Improve Wording"}
                                      </Button>
                                    </div>

                                    {line.full_text && line.full_text !== line.text ? (
                                      <p className="mt-2 text-[11px] leading-5 text-slate-500 break-words">
                                        Parent area: {line.full_text}
                                      </p>
                                    ) : null}

                                    {aiLineInsights[line.segment_id]?.error ? (
                                      <div className="mt-3">
                                        <Toast
                                          message={aiLineInsights[line.segment_id].error}
                                          variant="error"
                                        />
                                      </div>
                                    ) : null}

                                    {aiLineInsights[line.segment_id]?.data ? (
                                      <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50 p-3 text-xs text-slate-700 leading-relaxed">
                                        <p className="font-bold text-violet-800 uppercase tracking-wide text-[10px]">
                                          Line Review
                                        </p>
                                        {aiLineInsights[line.segment_id].data.issues?.length ? (
                                          <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px]">
                                            {aiLineInsights[line.segment_id].data.issues.map((issue) => (
                                              <li key={issue}>{issue}</li>
                                            ))}
                                          </ul>
                                        ) : null}
                                        {aiLineInsights[line.segment_id].data.suggested_line ? (
                                          <p className="mt-2 text-[11px]">
                                            <span className="font-bold text-slate-900">Suggested wording:</span>{" "}
                                            {aiLineInsights[line.segment_id].data.suggested_line}
                                          </p>
                                        ) : null}
                                        {aiLineInsights[line.segment_id].data.reason ? (
                                          <p className="mt-2 text-[11px] text-slate-600">
                                            {aiLineInsights[line.segment_id].data.reason}
                                          </p>
                                        ) : null}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-2 text-[10px] font-bold text-slate-400 pl-1 italic">
                              Target element scope block: {point.affected_resume_area}
                            </div>
                          )}

                          {point.recommended_rewrite && (
                            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs font-medium text-slate-700 leading-relaxed">
                              <span className="font-bold text-emerald-800 block mb-0.5">Suggested Rewrite:</span>
                              "{point.recommended_rewrite}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>

            {/* Experience Match Section */}
            {experienceEvidenceSection?.rows?.length ? (
              <Card id="report-experience-map" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0B3550]">Experience Match</h2>
                  <p className="text-xs text-slate-500 font-medium">Shows which roles and achievements provide the strongest evidence for the target position.</p>
                </div>
                <AnalysisTable
                  columns={[
                    { key: "role", label: "Role", width: "26%", emphasis: true },
                    { key: "evidence", label: "Relevant Evidence", width: "58%" },
                    { key: "fit", label: "Fit", width: "16%" },
                  ]}
                  rows={experienceEvidenceSection.rows.map((row) => ({
                    ...row,
                    status: row.fit === "High" ? "strong" : row.fit === "Medium" ? "partial" : "gap",
                  }))}
                />
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="font-black text-[#0B3550] block mb-1 uppercase tracking-wider">Positioning Strategy</span>
                  {experienceEvidenceSection.strategy}
                </div>
              </Card>
            ) : null}

            {/* Appendix Summary Panels Section */}
            <div id="report-appendix" className="scroll-mt-28 grid gap-4 lg:grid-cols-2">
              <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <BarChart3 className="h-4 w-4 text-[#0B3550]" />
                  <h3 className="text-sm font-black text-[#0B3550] uppercase tracking-wider">Score Snapshot</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3.5">
                    <StatusBar label="Passed" value={statusMetrics.passedPercent} tone="green" />
                    <StatusBar label="Needs Improvement" value={statusMetrics.needsPercent} tone="amber" />
                    <StatusBar label="Critical Gaps" value={statusMetrics.criticalPercent} tone="rose" />
                  </div>
                  <div className="space-y-3.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                    {report.category_scores.slice(0, 4).map((category) => (
                      <StatusBar
                        key={category.category}
                        label={category.category}
                        value={category.score}
                        tone={category.score >= 80 ? "green" : category.score >= 50 ? "amber" : "rose"}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Search className="h-4 w-4 text-[#0B3550]" />
                  <h3 className="text-sm font-black text-[#0B3550] uppercase tracking-wider">Keyword Signals</h3>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Select a keyword to locate matching evidence in the original resume.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {keywordChips.length ? (
                    keywordChips.map(([keyword, count]) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => {
                          const match = resumeLines.find((line) =>
                            `${line.section_name} ${line.text}`.toLowerCase().includes(keyword.toLowerCase())
                          );
                          if (match) focusResumeArea(match);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#0B3550] hover:bg-white shadow-2xs"
                      >
                        {keyword} <span className="text-[#0B3550] font-black ml-1">({count})</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 font-medium italic">No repeated keyword signals found.</p>
                  )}
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>

      {isReportPreviewOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-3 sm:p-6 pointer-events-auto">
          <div className="flex h-[96vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <h2 className="text-lg font-black text-[#0B3550]">A4 Report Preview</h2>
                <p className="text-xs font-medium text-slate-500">
                  This preview shows the exact PDF document that will be downloaded.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  className="rounded-xl px-4 text-xs font-bold"
                  onClick={() => {
                    setIsReportPreviewOpen(false);
                  }}
                >
                  Close Preview
                </Button>
                <button
                  type="button"
                  className="rounded-xl bg-[#0B3550] px-4 py-2.5 text-xs font-black text-white hover:bg-[#062B43] transition shadow-md"
                  onClick={handleDownloadPdf}
                >
                  Download PDF
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-200/70 p-4 sm:p-6">
              <div className="mx-auto w-full max-w-[900px]">
                <div className="overflow-hidden rounded-[24px] border border-slate-300 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    A4 Portrait Preview
                  </div>
                  <iframe
                    key={printFriendlyUrl}
                    src={printFriendlyUrl}
                    title="A4 PDF preview"
                    className="h-[78vh] w-full bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Slide-Over Content Viewer Frame Panel Sandbox */}
      {isResumeViewerOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-xs p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-150 pointer-events-auto">
          <div className="h-full w-full max-w-[1300px] flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl scale-in-95 duration-200">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="min-w-0">
                <h3 className="text-base font-black text-[#0B3550]">Resume Viewer</h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-xl">Review the original uploaded resume and locate supporting evidence.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="flex rounded-xl bg-slate-200/70 p-1 border border-slate-300/40 text-xs font-bold">
                  {/* <button
                    type="button"
                    onClick={() => setPreviewMode("ats")}
                    className={`rounded-lg px-3 py-1.5 transition ${previewMode === "ats" ? "bg-white text-[#0B3550] shadow-2xs" : "text-slate-600 hover:text-slate-950"}`}
                  >
                    ATS Extracted Matrix Map
                  </button> */}
                  <button
                    type="button"
                    onClick={() => setPreviewMode("original")}
                    className={`rounded-lg px-3 py-1.5 transition ${previewMode === "original" ? "bg-white text-[#0B3550] shadow-2xs" : "text-slate-600 hover:text-slate-950"}`}
                  >
                    Original Resume
                  </button>
                </div>
                {(highlightedLineId || originalSearchTerm) ? (
                  <button
                    type="button"
                    onClick={clearPreviewFocus}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 shadow-2xs"
                  >
                    Clear Highlight
                  </button>
                ) : null}
                <Button variant="outline" className="rounded-xl px-4 py-2 text-xs font-black bg-white" onClick={() => setIsResumeViewerOpen(false)}>
                  Close Viewer
                </Button>
              </div>
            </div>

            {previewMode === "original" ? (
              <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-3.5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <input
                      id="original-preview-search"
                      type="text"
                      value={originalSearchInput}
                      onChange={(e) => setOriginalSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyOriginalSearch()}
                      placeholder="Search text in the original resume..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-[#0B3550] shadow-2xs"
                    />
                  </div>
                  <Button variant="outline" className="rounded-xl px-4 py-2 text-xs font-black bg-white shrink-0 shadow-2xs" onClick={applyOriginalSearch}>
                    <Search className="mr-1.5 h-3.5 w-3.5 inline" />
                    Search Resume
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-4 flex justify-center">
              {/* {previewMode === "ats" ? (
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <Ats resume={resume} report={report} />
                </div>
              ) : ( */}
                <iframe
                  key={originalPreviewUrl}
                  src={originalPreviewUrl}
                  title="Original uploaded resume"
                  className="w-full max-w-4xl h-full min-h-[66vh] rounded-xl bg-white shadow-md border"
                />
              {/* )} */}
            </div>
          </div>
        </div>
      )}

      <DownloadGateModal
        isOpen={isDownloadGateOpen}
        onClose={() => setIsDownloadGateOpen(false)}
        clerkUser={user}
        resourceType="ats_report"
        resourceId={reportId || analysisId || "default"}
        resourceName="ATS Analysis Report PDF"
        onSuccessDownload={executeDownloadPdf}
      />
    </div>
  );
}

export default ATSReportPage;
