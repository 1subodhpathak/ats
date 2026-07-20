// // import { useEffect, useMemo, useState } from "react";
// // import { Link, useParams } from "react-router-dom";
// // import {
// //   BarChart3,
// //   ChevronDown,
// //   ChevronLeft,
// //   ChevronRight,
// //   ChevronUp,
// //   Download,
// //   Eye,
// //   FolderOpen,
// //   RefreshCw,
// //   Search,
// //   Target,
// //   Sparkles,
// // } from "lucide-react";

// // import Button from "../components/common/Button";
// // import Card from "../components/common/Card";
// // import Loader from "../components/common/Loader";
// // import Modal from "../components/common/Modal";
// // import Toast from "../components/common/Toast";
// // import {
// //   MethodologySection,
// //   ReportCoverHero,
// //   ReportSectionShell,
// // } from "../components/export/ReportTemplate";
// // import Ats from "../components/resume-editor/Ats";
// // import { analyzeLine } from "../services/aiApi";
// // import {
// //   getAnalysisReport,
// //   getAnalysisReportPdfUrl,
// //   getAnalysisReportPreviewPages,
// //   getSavedReport,
// //   getSavedReportPdfUrl,
// //   getSavedReportPreviewPages,
// //   saveAnalysisReport,
// // } from "../services/reportApi";
// // import {
// //   getResume,
// //   getResumeOriginalPreviewUrl,
// // } from "../services/resumeApi";

// // const STOP_WORDS = new Set([
// //   "the",
// //   "and",
// //   "for",
// //   "with",
// //   "that",
// //   "this",
// //   "from",
// //   "into",
// //   "your",
// //   "have",
// //   "has",
// //   "was",
// //   "are",
// //   "not",
// //   "but",
// //   "role",
// //   "resume",
// //   "candidate",
// //   "based",
// //   "more",
// //   "their",
// //   "they",
// //   "them",
// //   "will",
// //   "where",
// //   "using",
// //   "used",
// //   "when",
// //   "what",
// //   "need",
// //   "needs",
// //   "work",
// //   "skills",
// //   "experience",
// //   "match",
// //   "alignment",
// //   "check",
// // ]);

// // const REPORT_SIDEBAR_ITEMS = [
// //   { id: "report-overview", label: "Overview" },
// //   { id: "report-methodology", label: "Methodology" },
// //   { id: "report-at-glance", label: "At a Glance" },
// //   { id: "report-jd-matrix", label: "Requirement Checker" },
// //   { id: "report-jd-matrix-continuation", label: "Requirement Continuation" },
// //   { id: "report-ats-parsing", label: "ATS Parsing" },
// //   { id: "report-scorecard", label: "Scorecard" },
// //   { id: "report-bi-reporting", label: "BI Reporting" },
// //   { id: "report-aiml", label: "Advanced Analytics" },
// //   { id: "report-governance", label: "Data Governance" },
// //   { id: "report-keywords", label: "Keyword Coverage" },
// //   { id: "report-leadership", label: "Leadership Fit" },
// //   { id: "report-experience-map", label: "Experience Map" },
// //   { id: "report-risk-flags", label: "Risk Flags" },
// //   { id: "report-rewrites", label: "Rewrite Recommendations" },
// //   { id: "report-final-verdict", label: "Final Verdict" },
// //   { id: "report-visuals", label: "Dashboard" },
// //   { id: "report-quick-scan", label: "Quick Scan" },
// //   { id: "report-detailed", label: "Analysis" },
// //   { id: "report-appendix", label: "Appendix" },
// // ];

// // function clampPercent(value) {
// //   return Math.max(0, Math.min(100, value || 0));
// // }

// // function normalizeAuditStatus(status) {
// //   const value = String(status || "").toLowerCase();
// //   if (["strong", "passed", "pass", "success"].includes(value)) {
// //     return "strong";
// //   }
// //   if (["partial", "needs_work", "warning", "needs improvement"].includes(value)) {
// //     return "partial";
// //   }
// //   if (["missing", "critical", "error", "gap", "not_applicable"].includes(value)) {
// //     return "gap";
// //   }
// //   return "partial";
// // }

// // function statusPillClass(status) {
// //   const normalized = normalizeAuditStatus(status);
// //   if (normalized === "strong") {
// //     return "bg-[#1EAD4E] text-white";
// //   }
// //   if (normalized === "gap") {
// //     return "bg-[#E52521] text-white";
// //   }
// //   return "bg-[#F5B800] text-white";
// // }

// // function statusLabel(status) {
// //   const normalized = normalizeAuditStatus(status);
// //   if (normalized === "strong") {
// //     return "Strong";
// //   }
// //   if (normalized === "gap") {
// //     return "Gap";
// //   }
// //   return "Partial";
// // }

// // function averageScore(items) {
// //   if (!items.length) {
// //     return null;
// //   }
// //   return Math.round(items.reduce((sum, item) => sum + clampPercent(item), 0) / items.length);
// // }

// // function scoreLevel(score) {
// //   if (score >= 80) {
// //     return { label: "High", tone: "high", color: "#1EAD4E" };
// //   }
// //   if (score >= 60) {
// //     return { label: "Med", tone: "med", color: "#F5B800" };
// //   }
// //   return { label: "Low", tone: "low", color: "#E52521" };
// // }

// // function collectResumeLines(resume) {
// //   return (resume?.sections || []).flatMap((section) =>
// //     section.items.map((item) => ({
// //       line_id: item.line_id,
// //       text: item.text,
// //       original_text: item.original_text,
// //       score: item.score,
// //       section_name: section.section_name,
// //     }))
// //   );
// // }

// // function splitResumeBlock(line) {
// //   const rawText = (line?.text || "").replace(/\r/g, "\n").trim();
// //   if (!rawText) {
// //     return [];
// //   }

// //   const normalized = rawText
// //     .replace(/[•▪●◦]/g, "\n")
// //     .replace(/\s*\n+\s*/g, "\n")
// //     .trim();

// //   let segments = normalized
// //     .split("\n")
// //     .map((segment) => segment.trim())
// //     .filter(Boolean);

// //   if (segments.length <= 1) {
// //     segments = normalized
// //       .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
// //       .map((segment) => segment.trim())
// //       .filter(Boolean);
// //   }

// //   if (!segments.length) {
// //     segments = [rawText];
// //   }

// //   return segments.map((segment, index) => ({
// //     segment_id: `${line.line_id}::${index}`,
// //     line_id: line.line_id,
// //     section_name: line.section_name,
// //     text: segment,
// //     full_text: rawText,
// //     score: line.score,
// //   }));
// // }

// // function tokenizeText(value = "") {
// //   return value
// //     .toLowerCase()
// //     .replace(/[^a-z0-9\s]/g, " ")
// //     .split(/\s+/)
// //     .map((token) => token.trim())
// //     .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
// // }

// // function buildKeywords(point) {
// //   return Array.from(
// //     new Set(
// //       tokenizeText(
// //         [
// //           point.title,
// //           point.category,
// //           point.affected_resume_area,
// //           point.improvement_suggestion,
// //           point.explanation,
// //         ]
// //           .filter(Boolean)
// //           .join(" ")
// //       )
// //     )
// //   );
// // }

// // function buildEvidenceForPoint(point, resumeLines) {
// //   const keywords = buildKeywords(point);
// //   const segments = resumeLines.flatMap((line) => splitResumeBlock(line));
// //   if (!segments.length) {
// //     return [];
// //   }

// //   const rankedSegments = segments
// //     .map((segment) => {
// //       const haystack = `${segment.section_name} ${segment.text}`.toLowerCase();
// //       const matches = keywords.filter((keyword) => haystack.includes(keyword)).length;
// //       const sectionBoost = keywords.some((keyword) =>
// //         segment.section_name.toLowerCase().includes(keyword)
// //       )
// //         ? 1
// //         : 0;
// //       const issueBoost =
// //         point.current_status === "Critical Fix"
// //           ? 0.8
// //           : point.current_status === "Needs Improvement"
// //             ? 0.35
// //             : 0;
// //       const scoreBoost =
// //         typeof segment.score === "number" ? Math.max(0, 100 - segment.score) / 100 : 0;

// //       return {
// //         ...segment,
// //         relevance: matches + sectionBoost + issueBoost + scoreBoost,
// //       };
// //     })
// //     .filter((segment) => segment.relevance > 0)
// //     .sort((a, b) => b.relevance - a.relevance);

// //   if (rankedSegments.length) {
// //     const uniqueSegments = [];
// //     const seen = new Set();
// //     for (const segment of rankedSegments) {
// //       if (seen.has(segment.segment_id)) {
// //         continue;
// //       }
// //       uniqueSegments.push(segment);
// //       seen.add(segment.segment_id);
// //       if (uniqueSegments.length >= 4) {
// //         break;
// //       }
// //     }
// //     return uniqueSegments;
// //   }

// //   const fallbackLines = resumeLines
// //     .map((line) => ({
// //       segment_id: `${line.line_id}::full`,
// //       line_id: line.line_id,
// //       section_name: line.section_name,
// //       text: line.text,
// //       full_text: line.text,
// //       score: line.score,
// //       relevance: 0,
// //       isFullArea: true,
// //     }))
// //     .slice(0, 2);

// //   return fallbackLines;
// // }

// // function StatusBar({ label, value, tone }) {
// //   const toneClasses = {
// //     green: "bg-emerald-500",
// //     amber: "bg-amber-500",
// //     rose: "bg-rose-500",
// //   };

// //   return (
// //     <div className="space-y-1">
// //       <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
// //         <span>{label}</span>
// //         <span>{value}</span>
// //       </div>
// //       <div className="h-2 overflow-hidden rounded-full bg-slate-100">
// //         <div
// //           className={`h-full rounded-full ${toneClasses[tone]}`}
// //           style={{ width: `${clampPercent(value)}%` }}
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // function getScoreTone(score) {
// //   if (score >= 80) {
// //     return {
// //       label: "ATS-ready",
// //       stroke: "#10b981",
// //       fill: "#dcfce7",
// //       text: "#065f46",
// //     };
// //   }
// //   if (score >= 41) {
// //     return {
// //       label: "Needs improvement",
// //       stroke: "#f59e0b",
// //       fill: "#fef3c7",
// //       text: "#92400e",
// //     };
// //   }
// //   return {
// //     label: "High risk",
// //     stroke: "#ef4444",
// //     fill: "#fee2e2",
// //     text: "#991b1b",
// //   };
// // }

// // function GaugeChart({ score }) {
// //   const clamped = clampPercent(score);
// //   const tone = getScoreTone(clamped);
// //   const radius = 62;
// //   const circumference = 2 * Math.PI * radius;
// //   const dashOffset = circumference * (1 - clamped / 100);

// //   return (
// //     <div className="flex flex-col items-center justify-center">
// //       <svg viewBox="0 0 180 180" className="h-44 w-44">
// //         <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
// //         <circle
// //           cx="90"
// //           cy="90"
// //           r={radius}
// //           fill="none"
// //           stroke={tone.stroke}
// //           strokeWidth="14"
// //           strokeLinecap="round"
// //           strokeDasharray={circumference}
// //           strokeDashoffset={dashOffset}
// //           transform="rotate(-90 90 90)"
// //         />
// //         <circle cx="90" cy="90" r="44" fill={tone.fill} />
// //         <text x="90" y="84" textAnchor="middle" className="fill-royalblue text-[12px] font-bold">
// //           ATS Score
// //         </text>
// //         <text x="90" y="104" textAnchor="middle" className="fill-royalblue text-[22px] font-black">
// //           {clamped}
// //         </text>
// //       </svg>
// //       <span
// //         className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]"
// //         style={{ backgroundColor: tone.fill, color: tone.text }}
// //       >
// //         {tone.label}
// //       </span>
// //     </div>
// //   );
// // }

// // function RadarChart({ items }) {
// //   const size = 300;
// //   const center = size / 2;
// //   const maxRadius = 105;
// //   const angleStep = (Math.PI * 2) / Math.max(items.length, 1);
// //   const levels = [20, 40, 60, 80, 100];

// //   const pointFor = (index, value, radiusScale = 1) => {
// //     const angle = -Math.PI / 2 + index * angleStep;
// //     const radius = (maxRadius * clampPercent(value) * radiusScale) / 100;
// //     return {
// //       x: center + Math.cos(angle) * radius,
// //       y: center + Math.sin(angle) * radius,
// //     };
// //   };

// //   const polygonPoints = items
// //     .map((item, index) => {
// //       const point = pointFor(index, item.score);
// //       return `${point.x},${point.y}`;
// //     })
// //     .join(" ");

// //   return (
// //     <svg viewBox={`0 0 ${size} ${size}`} className="h-[300px] w-full">
// //       {levels.map((level) => (
// //         <polygon
// //           key={level}
// //           points={items
// //             .map((_, index) => {
// //               const point = pointFor(index, level);
// //               return `${point.x},${point.y}`;
// //             })
// //             .join(" ")}
// //           fill="none"
// //           stroke="#dbe4f0"
// //           strokeWidth="1"
// //         />
// //       ))}
// //       {items.map((item, index) => {
// //         const outer = pointFor(index, 100, 1.1);
// //         const axisEnd = pointFor(index, 100);
// //         return (
// //           <g key={item.category}>
// //             <line
// //               x1={center}
// //               y1={center}
// //               x2={axisEnd.x}
// //               y2={axisEnd.y}
// //               stroke="#dbe4f0"
// //               strokeWidth="1"
// //             />
// //             <text
// //               x={outer.x}
// //               y={outer.y}
// //               textAnchor={outer.x >= center + 4 ? "start" : outer.x <= center - 4 ? "end" : "middle"}
// //               className="fill-slate-500 text-[9px] font-semibold"
// //             >
// //               {item.category.split(" & ")[0].slice(0, 16)}
// //             </text>
// //           </g>
// //         );
// //       })}
// //       <polygon points={polygonPoints} fill="rgba(31,77,189,0.16)" stroke="#1f4dbd" strokeWidth="2.5" />
// //       {items.map((item, index) => {
// //         const point = pointFor(index, item.score);
// //         return <circle key={`${item.category}-point`} cx={point.x} cy={point.y} r="3.5" fill="#1f4dbd" />;
// //       })}
// //     </svg>
// //   );
// // }

// // function DoughnutChart({ items, centerLabel, centerValue }) {
// //   const radius = 58;
// //   const circumference = 2 * Math.PI * radius;
// //   let cumulative = 0;

// //   return (
// //     <div className="flex items-center gap-4">
// //       <svg viewBox="0 0 180 180" className="h-40 w-40 shrink-0">
// //         <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="20" />
// //         {items.map((item) => {
// //           const segment = circumference * (item.value / 100);
// //           const dashOffset = circumference - cumulative;
// //           cumulative += segment;
// //           return (
// //             <circle
// //               key={item.label}
// //               cx="90"
// //               cy="90"
// //               r={radius}
// //               fill="none"
// //               stroke={item.color}
// //               strokeWidth="20"
// //               strokeDasharray={`${segment} ${circumference - segment}`}
// //               strokeDashoffset={dashOffset}
// //               transform="rotate(-90 90 90)"
// //               strokeLinecap="butt"
// //             />
// //           );
// //         })}
// //         <text x="90" y="84" textAnchor="middle" className="fill-slate-500 text-[10px] font-bold uppercase">
// //           {centerLabel}
// //         </text>
// //         <text x="90" y="104" textAnchor="middle" className="fill-royalblue text-[20px] font-black">
// //           {centerValue}
// //         </text>
// //       </svg>
// //       <div className="space-y-2">
// //         {items.map((item) => (
// //           <div key={item.label} className="flex items-center gap-2 text-sm text-slate-700">
// //             <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
// //             <span className="font-semibold">{item.label}</span>
// //             <span className="text-slate-500">{item.value}%</span>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // function TimelineChart({ items }) {
// //   if (!items.length) {
// //     return (
// //       <div className="rounded-2xl border border-dashed border-shellstone/80 bg-slate-50 p-4 text-sm text-slate-500">
// //         Career timeline data could not be extracted clearly from the uploaded resume.
// //       </div>
// //     );
// //   }

// //   const minYear = Math.min(...items.map((item) => item.start));
// //   const maxYear = Math.max(...items.map((item) => item.end));
// //   const totalRange = Math.max(maxYear - minYear, 1);

// //   return (
// //     <div className="space-y-3">
// //       {items.map((item) => {
// //         const left = ((item.start - minYear) / totalRange) * 100;
// //         const width = (Math.max(item.end - item.start, 0.3) / totalRange) * 100;
// //         return (
// //           <div key={`${item.label}-${item.start}`} className="space-y-1">
// //             <div className="flex items-center justify-between gap-2 text-xs">
// //               <p className="min-w-0 truncate font-semibold text-slate-700">{item.label}</p>
// //               <span className="shrink-0 text-slate-500">
// //                 {item.startLabel} - {item.endLabel}
// //               </span>
// //             </div>
// //             <div className="relative h-3 rounded-full bg-slate-100">
// //               <div
// //                 className="absolute top-0 h-3 rounded-full bg-gradient-to-r from-royalblue to-sapphire"
// //                 style={{ left: `${left}%`, width: `${Math.max(width, 8)}%` }}
// //               />
// //             </div>
// //           </div>
// //         );
// //       })}
// //       <div className="flex items-center justify-between text-[11px] text-slate-400">
// //         <span>{Math.floor(minYear)}</span>
// //         <span>{Math.ceil(maxYear)}</span>
// //       </div>
// //     </div>
// //   );
// // }

// // function KeywordProminenceChart({ items }) {
// //   if (!items.length) {
// //     return (
// //       <div className="rounded-3xl border border-dashed border-shellstone/80 bg-slate-50 p-5 text-sm text-slate-500">
// //         No strong keyword cluster was detected from the current resume text.
// //       </div>
// //     );
// //   }

// //   const topWeight = items[0]?.weight || 1;

// //   return (
// //     <div className="rounded-3xl bg-[linear-gradient(180deg,_#f8fbff,_#eef4ff)] p-3">
// //       <div className="grid gap-2">
// //         {items.slice(0, 6).map((item, index) => {
// //           const percent = Math.max(12, Math.round((item.weight / topWeight) * 100));
// //           const badgeTone =
// //             index === 0
// //               ? "bg-royalblue text-white"
// //               : index < 3
// //                 ? "bg-blue-100 text-royalblue"
// //                 : "bg-white text-slate-700";

// //           return (
// //             <div
// //               key={item.word}
// //               className="rounded-2xl border border-white/80 bg-white/85 p-2.5 shadow-sm"
// //             >
// //               <div className="flex items-center justify-between gap-3">
// //                 <div className="min-w-0">
// //                   <p className="truncate text-sm font-black text-royalblue">
// //                     {item.word}
// //                   </p>
// //                   <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
// //                     Prominence
// //                   </p>
// //                 </div>
// //                 <span
// //                   className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${badgeTone}`}
// //                 >
// //                   {percent}%
// //                 </span>
// //               </div>
// //               <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
// //                 <div
// //                   className="h-full rounded-full bg-gradient-to-r from-royalblue to-sapphire"
// //                   style={{ width: `${percent}%` }}
// //                 />
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }

// // function StackedBarChart({ items }) {
// //   const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
// //   return (
// //     <div className="space-y-4">
// //       <div className="flex h-5 overflow-hidden rounded-full bg-slate-100">
// //         {items.map((item) => (
// //           <div
// //             key={item.label}
// //             style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }}
// //           />
// //         ))}
// //       </div>
// //       <div className="space-y-2">
// //         {items.map((item) => (
// //           <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
// //             <div className="flex items-center gap-2">
// //               <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
// //               <span className="font-semibold text-slate-700">{item.label}</span>
// //             </div>
// //             <span className="text-slate-500">{item.value}</span>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // function ScoreBar({ label, value, tone }) {
// //   const toneMap = {
// //     blue: "from-[#10245A] to-[#365DA8]",
// //     green: "from-emerald-500 to-emerald-400",
// //     amber: "from-amber-500 to-amber-400",
// //     rose: "from-rose-500 to-rose-400",
// //   };

// //   return (
// //     <div className="space-y-1.5">
// //       <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-slate-600">
// //         <span>{label}</span>
// //         <span>{value}</span>
// //       </div>
// //       <div className="h-2.5 overflow-hidden rounded-full bg-[#E7EEF8]">
// //         <div
// //           className={`h-full rounded-full bg-gradient-to-r ${toneMap[tone] || toneMap.blue}`}
// //           style={{ width: `${clampPercent(value)}%` }}
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // function StatusPill({ status }) {
// //   return (
// //     <span
// //       className={`inline-flex min-w-[108px] justify-center rounded-full px-4 py-2 text-[12px] font-black uppercase tracking-[0.04em] ${statusPillClass(status)}`}
// //     >
// //       {statusLabel(status)}
// //     </span>
// //   );
// // }

// // function AnalysisTable({ columns, rows }) {
// //   if (!rows.length) {
// //     return null;
// //   }

// //   return (
// //     <div className="overflow-hidden rounded-[28px] border border-[#D8E5F0] bg-white">
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full table-fixed">
// //           <thead className="bg-[#EEF4FB]">
// //             <tr>
// //               {columns.map((column) => (
// //                 <th
// //                   key={column.key}
// //                   className="px-4 py-4 text-left text-[13px] font-bold text-[#627792]"
// //                   style={column.width ? { width: column.width } : undefined}
// //                 >
// //                   {column.label}
// //                 </th>
// //               ))}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {rows.map((row, rowIndex) => (
// //               <tr key={row.id || rowIndex} className="align-top">
// //                 {columns.map((column) => (
// //                   <td
// //                     key={`${row.id || rowIndex}-${column.key}`}
// //                     className="border-t border-[#D8E5F0] px-4 py-4 text-[14px] leading-6 text-slate-800"
// //                   >
// //                     {column.key === "status" ? (
// //                       <StatusPill status={row[column.key]} />
// //                     ) : (
// //                       <span className={column.emphasis ? "font-semibold text-slate-900" : ""}>
// //                         {row[column.key]}
// //                       </span>
// //                     )}
// //                   </td>
// //                 ))}
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

// // function IssueCountPill({ count, status }) {
// //   const styles = {
// //     passed: "bg-emerald-50 text-emerald-700 border-emerald-100",
// //     needs_work: "bg-amber-50 text-amber-700 border-amber-100",
// //     critical: "bg-rose-50 text-rose-700 border-rose-100",
// //     not_applicable: "bg-slate-100 text-slate-600 border-slate-200",
// //   };

// //   return (
// //     <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${styles[status] || styles.needs_work}`}>
// //       {count} issue{count === 1 ? "" : "s"}
// //     </span>
// //   );
// // }

// // function RequirementMatchTable({ items }) {
// //   if (!items.length) {
// //     return null;
// //   }

// //   return (
// //     <div className="overflow-hidden rounded-[28px] border border-shellstone/60 bg-white shadow-sm">
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full divide-y divide-slate-200 text-sm">
// //           <thead className="bg-[#EEF4FB] text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
// //             <tr>
// //               <th className="px-4 py-3">JD Requirement</th>
// //               <th className="px-4 py-3">Resume Evidence</th>
// //               <th className="px-4 py-3">Status</th>
// //               <th className="px-4 py-3">Recommended Fix</th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-slate-100">
// //             {items.map((item) => (
// //               <tr key={`${item.requirement}-${item.status}`} className="align-top">
// //                 <td className="px-4 py-3 font-semibold text-slate-900">{item.requirement}</td>
// //                 <td className="px-4 py-3 text-slate-600">{item.resume_evidence}</td>
// //                 <td className="px-4 py-3">
// //                   <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
// //                     item.status === "strong"
// //                       ? "bg-emerald-50 text-emerald-700"
// //                       : item.status === "partial"
// //                         ? "bg-amber-50 text-amber-700"
// //                         : item.status === "missing"
// //                           ? "bg-rose-50 text-rose-700"
// //                           : "bg-slate-100 text-slate-600"
// //                   }`}>
// //                     {item.status.replace("_", " ")}
// //                   </span>
// //                 </td>
// //                 <td className="px-4 py-3 text-slate-600">{item.recommendation}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

// // function FAQCard({ items }) {
// //   if (!items?.length) {
// //     return null;
// //   }
// //   return (
// //     <div className="space-y-2">
// //       {items.map((item) => (
// //         <div key={item.question} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
// //           <p className="text-sm font-bold text-slate-900">{item.question}</p>
// //           <p className="mt-1 text-sm leading-6 text-slate-600">{item.answer}</p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // function ReportSectionCard({ section }) {
// //   return (
// //     <div className="relative rounded-[28px] border border-shellstone/60 bg-white p-5 shadow-sm">
// //       <div className="flex flex-wrap items-start justify-between gap-3">
// //         <div className="space-y-1">
// //           <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
// //             {section.group}
// //           </p>
// //           <h3 className="text-xl font-black text-royalblue">{section.title}</h3>
// //           <p className="max-w-3xl text-sm leading-6 text-slate-600">{section.summary}</p>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           {typeof section.score === "number" ? (
// //             <span className="rounded-full bg-[#EEF4FB] px-3 py-1 text-[11px] font-black text-royalblue">
// //               {section.score}/100
// //             </span>
// //           ) : null}
// //           <IssueCountPill count={section.issue_count || 0} status={section.status} />
// //         </div>
// //       </div>

// //       <div className="mt-4 grid gap-3">
// //         {(section.findings || []).map((finding, index) => (
// //           <div key={`${section.id}-${finding.title}-${index}`} className="rounded-2xl border border-shellstone/50 bg-slate-50 p-4">
// //             <div className="flex flex-wrap items-start justify-between gap-3">
// //               <div>
// //                 <p className="text-sm font-black text-slate-900">{finding.title}</p>
// //                 <p className="mt-1 text-sm leading-6 text-slate-600">{finding.evidence}</p>
// //               </div>
// //               <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
// //                 finding.type === "success"
// //                   ? "bg-emerald-50 text-emerald-700"
// //                   : finding.type === "error"
// //                     ? "bg-rose-50 text-rose-700"
// //                     : finding.type === "warning"
// //                       ? "bg-amber-50 text-amber-700"
// //                       : "bg-slate-100 text-slate-600"
// //               }`}>
// //                 {finding.type}
// //               </span>
// //             </div>
// //             <p className="mt-3 text-sm leading-6 text-slate-700">
// //               <span className="font-bold text-slate-900">Recommendation:</span> {finding.recommendation}
// //             </p>
// //             {finding.rewrite ? (
// //               <div className="mt-3 rounded-2xl border border-violet-100 bg-violet-50 p-3 text-sm text-slate-700">
// //                 <span className="font-semibold text-violet-800">Suggested rewrite:</span> {finding.rewrite}
// //               </div>
// //             ) : null}
// //           </div>
// //         ))}
// //       </div>
// //       {(section.faq || []).length ? <div className="mt-4"><FAQCard items={section.faq} /></div> : null}
// //     </div>
// //   );
// // }

// // function ATSReportPage() {
// //   const { analysisId, reportId } = useParams();
// //   const [report, setReport] = useState(null);
// //   const [resume, setResume] = useState(null);
// //   const [status, setStatus] = useState("loading");
// //   const [error, setError] = useState("");
// //   const [saveStatus, setSaveStatus] = useState("idle");
// //   const [saveMessage, setSaveMessage] = useState("");
// //   const [highlightedLineId, setHighlightedLineId] = useState("");
// //   const [previewMode, setPreviewMode] = useState("ats");
// //   const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false);
// //   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
// //   const [originalSearchInput, setOriginalSearchInput] = useState("");
// //   const [originalSearchTerm, setOriginalSearchTerm] = useState("");
// //   const [aiLineInsights, setAiLineInsights] = useState({});
// //   const [selectedCategory, setSelectedCategory] = useState("All Categories");
// //   const [isQuickScanMinimized, setIsQuickScanMinimized] = useState(false);
// //   const [isVisualReportMinimized, setIsVisualReportMinimized] = useState(false);
// //   const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
// //   const [reportPreviewPages, setReportPreviewPages] = useState([]);
// //   const [reportPreviewPageIndex, setReportPreviewPageIndex] = useState(0);
// //   const [reportPreviewStatus, setReportPreviewStatus] = useState("idle");
// //   const [reportPreviewError, setReportPreviewError] = useState("");

// //   useEffect(() => {
// //     let active = true;

// //     async function loadReport() {
// //       setStatus("loading");
// //       setError("");
// //       try {
// //         const reportResponse = reportId
// //           ? await getSavedReport(reportId)
// //           : await getAnalysisReport(analysisId);

// //         if (!active) {
// //           return;
// //         }

// //         const nextReport = reportResponse.data;
// //         setReport(nextReport);

// //         const resumeResponse = await getResume(nextReport.resume_id);
// //         if (!active) {
// //           return;
// //         }

// //         setResume(resumeResponse.data);
// //         setStatus("success");
// //       } catch (requestError) {
// //         if (!active) {
// //           return;
// //         }
// //         setError(
// //           requestError?.response?.data?.detail ||
// //             "Unable to load the ATS analysis report."
// //         );
// //         setStatus("error");
// //       }
// //     }

// //     loadReport();
// //     return () => {
// //       active = false;
// //     };
// //   }, [analysisId, reportId]);

// //   const groupedPoints = useMemo(() => {
// //     if (!report?.analysis_points) {
// //       return [];
// //     }

// //     const map = new Map();
// //     report.analysis_points
// //       .filter((point) => !point.duplicate_of_pointer_id)
// //       .forEach((point) => {
// //       if (!map.has(point.category)) {
// //         map.set(point.category, []);
// //       }
// //       map.get(point.category).push(point);
// //       });

// //     return Array.from(map.entries());
// //   }, [report]);

// //   const categoryOptions = useMemo(() => {
// //     const categories = groupedPoints.map(([category]) => category);
// //     return ["All Categories", ...categories];
// //   }, [groupedPoints]);

// //   const filteredGroupedPoints = useMemo(() => {
// //     if (selectedCategory === "All Categories") {
// //       return groupedPoints;
// //     }
// //     return groupedPoints.filter(([category]) => category === selectedCategory);
// //   }, [groupedPoints, selectedCategory]);

// //   const visiblePointCount = useMemo(
// //     () => filteredGroupedPoints.reduce((count, [, points]) => count + points.length, 0),
// //     [filteredGroupedPoints]
// //   );

// //   const resumeLines = useMemo(() => collectResumeLines(resume), [resume]);

// //   const evidenceByPoint = useMemo(() => {
// //     const map = new Map();
// //     if (!report?.analysis_points?.length || !resumeLines.length) {
// //       return map;
// //     }

// //     report.analysis_points.forEach((point) => {
// //       map.set(point.pointer_id, buildEvidenceForPoint(point, resumeLines));
// //     });

// //     return map;
// //   }, [report, resumeLines]);

// //   const statusMetrics = useMemo(() => {
// //     const points = report?.analysis_points || [];
// //     const total = points.length || 1;
// //     const passed = points.filter((point) => point.current_status === "Passed").length;
// //     const needsImprovement = points.filter(
// //       (point) => point.current_status === "Needs Improvement"
// //     ).length;
// //     const criticalFix = points.filter(
// //       (point) => point.current_status === "Critical Fix"
// //     ).length;

// //     return {
// //       passed,
// //       needsImprovement,
// //       criticalFix,
// //       passedPercent: Math.round((passed / total) * 100),
// //       needsPercent: Math.round((needsImprovement / total) * 100),
// //       criticalPercent: Math.round((criticalFix / total) * 100),
// //     };
// //   }, [report]);

// //   const groupedAnalysisSections = useMemo(() => {
// //     const groups = new Map();
// //     (report?.analysis_sections || []).forEach((section) => {
// //       if (!groups.has(section.group)) {
// //         groups.set(section.group, []);
// //       }
// //       groups.get(section.group).push(section);
// //     });
// //     return Array.from(groups.entries());
// //   }, [report]);

// //   const requirementCheckerRows = useMemo(() => {
// //     return (report?.jd_match_matrix || [])
// //       .filter((item) => item.requirement && (item.resume_evidence || item.jd_evidence || item.recommendation || item.safe_rewrite))
// //       .map((item, index) => ({
// //         id: `req-${index}`,
// //         requirement: item.requirement,
// //         evidence: item.resume_evidence || item.jd_evidence || "",
// //         status: item.status,
// //         explanation: item.recommendation || item.safe_rewrite || "",
// //       }));
// //   }, [report]);

// //   const requirementCheckerPrimaryRows = useMemo(
// //     () => requirementCheckerRows.slice(0, 6),
// //     [requirementCheckerRows]
// //   );

// //   const requirementCheckerContinuationRows = useMemo(
// //     () => requirementCheckerRows.slice(6),
// //     [requirementCheckerRows]
// //   );

// //   const parsingHealthRows = useMemo(() => {
// //     if (!report) {
// //       return [];
// //     }

// //     const profile = report.extracted_resume_data?.candidate_profile || {};
// //     const formatting = report.ats_formatting || {};
// //     const workExperience = report.extracted_resume_data?.work_experience || [];
// //     const sectionsDetected = formatting.sections_detected || [];
// //     const sectionsMissing = formatting.sections_missing || [];
// //     const jdMatrix = report.jd_match_matrix || [];

// //     const strongMatches = jdMatrix.filter((item) => normalizeAuditStatus(item.status) === "strong").length;
// //     const partialMatches = jdMatrix.filter((item) => normalizeAuditStatus(item.status) === "partial").length;
// //     const nameContactStatus =
// //       profile.name && profile.email && profile.phone
// //         ? "strong"
// //         : profile.name && (profile.email || profile.phone)
// //           ? "partial"
// //           : "gap";

// //     const workHistoryWithDates = workExperience.filter(
// //       (item) => item.title && item.company && (item.start_date || item.end_date)
// //     ).length;
// //     const workHistoryStatus =
// //       workExperience.length && workHistoryWithDates === workExperience.length
// //         ? "strong"
// //         : workExperience.length
// //           ? "partial"
// //           : "gap";

// //     const sectionStatus =
// //       sectionsDetected.length >= 4 && sectionsMissing.length === 0
// //         ? "strong"
// //         : sectionsDetected.length >= 2
// //           ? "partial"
// //           : "gap";

// //     const formattingStatus =
// //       formatting.tables_detected || String(formatting.multi_column_risk || "").toLowerCase() === "high"
// //         ? "gap"
// //         : String(formatting.multi_column_risk || "").toLowerCase() === "medium"
// //           ? "partial"
// //           : "strong";

// //     const keywordStatus =
// //       jdMatrix.length === 0
// //         ? "partial"
// //         : strongMatches >= Math.max(2, Math.ceil(jdMatrix.length * 0.45))
// //           ? "strong"
// //           : strongMatches + partialMatches > 0
// //             ? "partial"
// //             : "gap";

// //     const parseRate = formatting.parse_rate;
// //     const parseRateStatus =
// //       typeof parseRate === "number"
// //         ? parseRate >= 85
// //           ? "strong"
// //           : parseRate >= 65
// //             ? "partial"
// //             : "gap"
// //         : "partial";

// //     return [
// //       {
// //         id: "name-contact",
// //         check: "Name and contact",
// //         finding: [
// //           profile.name ? `Name: ${profile.name}` : null,
// //           profile.email ? "Email detected" : null,
// //           profile.phone ? "Phone detected" : null,
// //           profile.linkedin ? "LinkedIn detected" : null,
// //         ].filter(Boolean).join(", ") || "Candidate name and contact details were not confidently extracted.",
// //         status: nameContactStatus,
// //         why: "ATS systems first need a clearly extractable profile header to identify and index the candidate.",
// //       },
// //       {
// //         id: "work-history",
// //         check: "Work history",
// //         finding:
// //           workExperience.length > 0
// //             ? `${workExperience.length} role${workExperience.length === 1 ? "" : "s"} extracted with ${workHistoryWithDates} role${workHistoryWithDates === 1 ? "" : "s"} showing readable title, company, and date evidence.`
// //             : "No structured work experience blocks were extracted from the resume.",
// //         status: workHistoryStatus,
// //         why: "Readable roles, employers, and dates help ATS systems map career progression and relevance.",
// //       },
// //       {
// //         id: "section-headings",
// //         check: "Section headings",
// //         finding:
// //           sectionsDetected.length > 0
// //             ? `Detected sections: ${sectionsDetected.join(", ")}${sectionsMissing.length ? `. Missing or weak: ${sectionsMissing.join(", ")}` : ""}.`
// //             : "No clear section structure was detected in the parsed output.",
// //         status: sectionStatus,
// //         why: "Clear section labels improve parsing accuracy for skills, experience, education, and summaries.",
// //       },
// //       {
// //         id: "formatting-complexity",
// //         check: "Formatting complexity",
// //         finding: [
// //           formatting.tables_detected ? "Tables detected" : "No table-heavy formatting detected",
// //           formatting.multi_column_risk ? `multi-column risk: ${formatting.multi_column_risk}` : null,
// //           formatting.file_type ? `file type: ${formatting.file_type}` : null,
// //         ].filter(Boolean).join(", "),
// //         status: formattingStatus,
// //         why: "Complex tables and multi-column layouts can cause older ATS parsers to misread content order or skill context.",
// //       },
// //       {
// //         id: "keyword-alignment",
// //         check: "Keyword alignment",
// //         finding:
// //           jdMatrix.length > 0
// //             ? `${strongMatches} strong and ${partialMatches} partial JD requirement match${jdMatrix.length === 1 ? "" : "es"} were found in the current resume.`
// //             : "No job description was supplied, so keyword alignment was assessed only from the resume itself.",
// //         status: keywordStatus,
// //         why: "Ranking depends on whether the resume uses role-relevant terms and proves them with matching evidence.",
// //       },
// //       {
// //         id: "parse-rate",
// //         check: "Parsing health",
// //         finding:
// //           typeof parseRate === "number"
// //             ? `Estimated ATS parse rate: ${parseRate}/100.`
// //             : "ATS parse rate was not available in the current report payload.",
// //         status: parseRateStatus,
// //         why: "A stronger parse rate usually means the resume can be read, indexed, and scored more reliably by ATS systems.",
// //       },
// //     ];
// //   }, [report]);

// //   const formattingRecommendations = useMemo(() => {
// //     const recommendations = [
// //       ...(report?.ats_formatting?.recommendations || []),
// //       ...((report?.executive_summary?.top_fixes || []).map((item) => item.recommended_action)),
// //     ]
// //       .filter(Boolean)
// //       .map((item) => String(item).trim());

// //     return Array.from(new Set(recommendations)).slice(0, 5);
// //   }, [report]);

// //   const requirementOutcomeSummary = useMemo(() => {
// //     if (!report?.jd_match_matrix?.length) {
// //       return report?.summary || "No JD requirement summary is available yet.";
// //     }

// //     const strongItems = report.jd_match_matrix.filter(
// //       (item) => normalizeAuditStatus(item.status) === "strong"
// //     );
// //     const gapItems = report.jd_match_matrix.filter(
// //       (item) => normalizeAuditStatus(item.status) === "gap"
// //     );
// //     const topStrengths = strongItems.map((item) => item.requirement).slice(0, 3);
// //     const topGaps = gapItems.map((item) => item.requirement).slice(0, 4);

// //     const strengthsText = topStrengths.length
// //       ? `The current resume is strongest for ${topStrengths.join(", ")}.`
// //       : "The current resume has some usable alignment, but the strongest proof is limited.";
// //     const gapsText = topGaps.length
// //       ? `The main risk areas are ${topGaps.join(", ")}.`
// //       : "There are no major missing JD requirement areas flagged in the current matrix.";

// //     return `${strengthsText} ${gapsText}`;
// //   }, [report]);

// //   const scorecardRows = useMemo(() => {
// //     if (!report) {
// //       return [];
// //     }

// //     const executive = report.executive_summary || {};
// //     const matrix = report.jd_match_matrix || [];
// //     const categories = report.category_scores || [];

// //     const matrixScoresFor = (patterns, fallback = null) => {
// //       const matched = matrix.filter((item) =>
// //         patterns.some((pattern) => {
// //           const haystack = `${item.requirement} ${item.jd_evidence} ${item.resume_evidence}`.toLowerCase();
// //           return haystack.includes(pattern);
// //         })
// //       );
// //       if (!matched.length) {
// //         return fallback;
// //       }
// //       const scores = matched.map((item) => {
// //         const normalized = normalizeAuditStatus(item.status);
// //         if (normalized === "strong") {
// //           return 86;
// //         }
// //         if (normalized === "partial") {
// //           return 68;
// //         }
// //         return 45;
// //       });
// //       return averageScore(scores);
// //     };

// //     const categoryScoreFor = (pattern) =>
// //       categories.find((item) => item.category.toLowerCase().includes(pattern))?.score ?? null;

// //     const rows = [
// //       {
// //         label: "ATS parsing and structure",
// //         score:
// //           executive.ats_parse_score ??
// //           report.ats_formatting?.parse_rate ??
// //           categoryScoreFor("ats"),
// //       },
// //       {
// //         label: "JD requirement coverage",
// //         score: executive.jd_match_score ?? report.jd_match_score,
// //       },
// //       {
// //         label: "Content quality and impact",
// //         score: executive.content_quality_score ?? categoryScoreFor("impact"),
// //       },
// //       {
// //         label: "Recruiter readiness",
// //         score: executive.recruiter_readiness_score,
// //       },
// //       {
// //         label: "BI dashboards and reporting",
// //         score: matrixScoresFor(["bi", "dashboard", "tableau", "power bi", "reporting"], categoryScoreFor("hard skills")),
// //       },
// //       {
// //         label: "SQL / SAS / BI tools",
// //         score: matrixScoresFor(["sql", "sas", "power bi", "tableau", "qlik", "tool"], categoryScoreFor("hard skills")),
// //       },
// //       {
// //         label: "Advanced analytics / AI-ML",
// //         score: matrixScoresFor(["ai", "ml", "advanced analytics", "predictive", "machine learning"], null),
// //       },
// //       {
// //         label: "Data governance and quality",
// //         score: matrixScoresFor(["data governance", "data quality", "governance", "quality"], null),
// //       },
// //       {
// //         label: "Data warehouse architecture",
// //         score: matrixScoresFor(["warehouse", "architecture", "dwh"], null),
// //       },
// //       {
// //         label: "Education / degree fit",
// //         score: matrixScoresFor(["degree", "education", "engineering", "technology"], null),
// //       },
// //     ];

// //     return rows
// //       .filter((row) => typeof row.score === "number")
// //       .map((row) => ({ ...row, score: clampPercent(row.score) }));
// //   }, [report]);

// //   const biReportingSection = useMemo(() => {
// //     if (!report) {
// //       return null;
// //     }

// //     const matrix = report.jd_match_matrix || [];
// //     const workExperience = report.extracted_resume_data?.work_experience || [];
// //     const tools = report.extracted_resume_data?.skills?.tools || [];

// //     const biRows = matrix.filter((item) => {
// //       const haystack = `${item.requirement} ${item.jd_evidence} ${item.resume_evidence}`.toLowerCase();
// //       return ["bi", "dashboard", "reporting", "tableau", "power bi", "qlik", "visualization"].some((pattern) =>
// //         haystack.includes(pattern)
// //       );
// //     });

// //     const biScore =
// //       scorecardRows.find((row) => row.label === "BI dashboards and reporting")?.score ??
// //       averageScore(
// //         biRows.map((item) =>
// //           normalizeAuditStatus(item.status) === "strong"
// //             ? 86
// //             : normalizeAuditStatus(item.status) === "partial"
// //               ? 68
// //               : 45
// //         )
// //       );

// //     const evidenceFound = [];
// //     biRows.forEach((item) => {
// //       if (item.resume_evidence) {
// //         evidenceFound.push(item.resume_evidence);
// //       }
// //     });
// //     workExperience.forEach((item) => {
// //       item.bullets?.forEach((bullet) => {
// //         const lower = bullet.toLowerCase();
// //         if (["dashboard", "report", "kpi", "power bi", "tableau", "qlik", "automation"].some((pattern) => lower.includes(pattern))) {
// //           evidenceFound.push(bullet);
// //         }
// //       });
// //     });
// //     if (tools.length) {
// //       evidenceFound.push(`Tools already visible in the resume include ${tools.slice(0, 6).join(", ")}.`);
// //     }

// //     const improvements = Array.from(new Set(biRows.map((item) => item.recommendation).filter(Boolean))).slice(0, 5);

// //     const topEvidence = Array.from(new Set(evidenceFound.map((item) => String(item).trim()).filter(Boolean))).slice(0, 5);
// //     const positioning = report.rewrites?.find((item) =>
// //       (item.section || "").toLowerCase().includes("summary")
// //     )?.suggested_rewrite || null;

// //     if (!topEvidence.length || typeof biScore !== "number") {
// //       return null;
// //     }

// //     return {
// //       score: biScore,
// //       performance: biScore >= 80 ? "Strong performance" : biScore >= 60 ? "Usable performance" : "Needs stronger proof",
// //       summary: `${topEvidence.length} evidence point${topEvidence.length === 1 ? "" : "s"} in the resume align with BI, dashboarding, reporting, or reporting-tool requirements from the JD.`,
// //       evidence: topEvidence,
// //       improvements,
// //       positioning,
// //     };
// //   }, [report, scorecardRows]);

// //   const aiMlSection = useMemo(() => {
// //     if (!report) {
// //       return null;
// //     }

// //     const matrix = report.jd_match_matrix || [];
// //     const aiRows = matrix.filter((item) => {
// //       const haystack = `${item.requirement} ${item.jd_evidence} ${item.resume_evidence}`.toLowerCase();
// //       return [
// //         "ai",
// //         "ml",
// //         "advanced analytics",
// //         "predictive",
// //         "forecast",
// //         "clustering",
// //         "regression",
// //         "decision tree",
// //         "hypothesis",
// //         "statistical",
// //         "fraud",
// //         "risk",
// //         "recommendation",
// //       ].some((pattern) => haystack.includes(pattern));
// //     });

// //     const aiScore =
// //       scorecardRows.find((row) => row.label === "Advanced analytics / AI-ML")?.score ??
// //       averageScore(
// //         aiRows.map((item) =>
// //           normalizeAuditStatus(item.status) === "strong"
// //             ? 84
// //             : normalizeAuditStatus(item.status) === "partial"
// //               ? 58
// //               : 40
// //         )
// //       );

// //     const aiTableRows = aiRows.slice(0, 5).map((item, index) => ({
// //       id: `aiml-${index}`,
// //       requirement: item.requirement,
// //       evidence: item.resume_evidence || item.jd_evidence || "",
// //       status: item.status,
// //       add: item.recommendation || item.safe_rewrite || "",
// //     }));

// //     if (!aiTableRows.length || typeof aiScore !== "number") {
// //       return null;
// //     }

// //     const summary = `${aiTableRows.length} advanced analytics or AI/ML-related JD requirement${aiTableRows.length === 1 ? "" : "s"} were identified in the resume-to-JD comparison.`;
// //     const proofFormat = report.application_question_guidance?.[0]?.suggested_answer_guidance || null;

// //     return {
// //       score: aiScore,
// //       performance: aiScore >= 80 ? "Strong performance" : aiScore >= 60 ? "Partial performance" : "Partial performance",
// //       summary,
// //       rows: aiTableRows,
// //       proofFormat,
// //     };
// //   }, [report, scorecardRows]);

// //   const governanceSection = useMemo(() => {
// //     if (!report) {
// //       return null;
// //     }

// //     const matrix = report.jd_match_matrix || [];
// //     const governanceRows = matrix.filter((item) => {
// //       const haystack = `${item.requirement} ${item.jd_evidence} ${item.resume_evidence}`.toLowerCase();
// //       return [
// //         "data governance",
// //         "data quality",
// //         "quality",
// //         "warehouse",
// //         "architecture",
// //         "validation",
// //         "database performance",
// //         "tuning",
// //         "reconciliation",
// //       ].some((pattern) => haystack.includes(pattern));
// //     });

// //     const scoreFromLabel = (label) =>
// //       scorecardRows.find((row) => row.label === label)?.score ?? null;

// //     const cards = [
// //       {
// //         title: "Data Quality",
// //         score: scoreFromLabel("Data governance and quality"),
// //         summary:
// //           governanceRows.find((item) =>
// //             `${item.requirement} ${item.resume_evidence}`.toLowerCase().includes("quality")
// //           )?.resume_evidence || "",
// //       },
// //       {
// //         title: "Data Governance",
// //         score: scoreFromLabel("Data governance and quality"),
// //         summary:
// //           governanceRows.find((item) =>
// //             `${item.requirement} ${item.resume_evidence}`.toLowerCase().includes("governance")
// //           )?.resume_evidence || "",
// //       },
// //       {
// //         title: "DWH Architecture",
// //         score: scoreFromLabel("Data warehouse architecture"),
// //         summary:
// //           governanceRows.find((item) =>
// //             `${item.requirement} ${item.resume_evidence}`.toLowerCase().includes("warehouse")
// //           )?.resume_evidence || "",
// //       },
// //     ].filter((card) => typeof card.score === "number" && card.summary);

// //     const notes = Array.from(new Set(governanceRows.map((item) => item.recommendation).filter(Boolean))).slice(0, 4);

// //     const riskRows = governanceRows.slice(0, 4).map((item, index) => ({
// //       id: `gov-${index}`,
// //       phrase: item.requirement,
// //       signal: item.resume_evidence || item.jd_evidence || "",
// //       risk:
// //         normalizeAuditStatus(item.status) === "strong"
// //           ? "Low"
// //           : normalizeAuditStatus(item.status) === "partial"
// //             ? "Medium"
// //             : "High",
// //     }));

// //     if (!cards.length && !riskRows.length) {
// //       return null;
// //     }

// //     return { cards, notes, riskRows };
// //   }, [report, scorecardRows]);

// //   const keywordCoverageSection = useMemo(() => {
// //     if (!report) {
// //       return null;
// //     }

// //     const matchedKeywords = (report.jd_match_matrix || [])
// //       .filter((item) => normalizeAuditStatus(item.status) === "strong")
// //       .map((item) => item.requirement?.toUpperCase())
// //       .filter(Boolean)
// //       .slice(0, 22);

// //     const missingWeak = (report.jd_match_matrix || [])
// //       .filter((item) => normalizeAuditStatus(item.status) !== "strong")
// //       .map((item) => ({
// //         term: item.requirement.toUpperCase(),
// //         tone: normalizeAuditStatus(item.status) === "gap" ? "gap" : "partial",
// //       }))
// //       .slice(0, 20);

// //     if (!matchedKeywords.length && !missingWeak.length) {
// //       return null;
// //     }

// //     return {
// //       matchedKeywords,
// //       missingWeak,
// //     };
// //   }, [report]);

// //   const leadershipSection = useMemo(() => {
// //     if (!report) {
// //       return null;
// //     }

// //     const workExperience = report.extracted_resume_data?.work_experience || [];
// //     const jdMatrix = report.jd_match_matrix || [];

// //     const leadershipBullets = [];
// //     workExperience.forEach((role) => {
// //       (role.bullets || []).forEach((bullet) => {
// //         const lower = bullet.toLowerCase();
// //         if (
// //           [
// //             "stakeholder",
// //             "lead",
// //             "managed",
// //             "director",
// //             "vp",
// //             "transition",
// //             "client",
// //             "team",
// //             "leadership",
// //             "cross-functional",
// //           ].some((pattern) => lower.includes(pattern))
// //         ) {
// //           leadershipBullets.push(bullet);
// //         }
// //       });
// //     });

// //     const leadershipMatrix = jdMatrix.filter((item) => {
// //       const haystack = `${item.requirement} ${item.resume_evidence} ${item.jd_evidence}`.toLowerCase();
// //       return [
// //         "lead",
// //         "stakeholder",
// //         "management",
// //         "team",
// //         "liaison",
// //         "client",
// //         "director",
// //       ].some((pattern) => haystack.includes(pattern));
// //     });

// //     const score =
// //       scorecardRows.find((row) => row.label === "Recruiter readiness")?.score ??
// //       averageScore(
// //         leadershipMatrix.map((item) =>
// //           normalizeAuditStatus(item.status) === "strong"
// //             ? 84
// //             : normalizeAuditStatus(item.status) === "partial"
// //               ? 68
// //               : 48
// //         )
// //       );

// //     const evidence = Array.from(
// //       new Set(
// //         [
// //           ...leadershipBullets,
// //           ...leadershipMatrix.map((item) => item.resume_evidence).filter(Boolean),
// //         ].map((item) => String(item).trim())
// //       )
// //     ).slice(0, 5);

// //     const improvements = Array.from(new Set(leadershipMatrix.map((item) => item.recommendation).filter(Boolean))).slice(0, 5);

// //     if (!evidence.length || typeof score !== "number") {
// //       return null;
// //     }

// //     const verdict = `${evidence.length} leadership or stakeholder-related evidence point${evidence.length === 1 ? "" : "s"} were identified in the current resume.`;

// //     return {
// //       score,
// //       performance: score >= 80 ? "Strong performance" : score >= 60 ? "Usable performance" : "Needs stronger proof",
// //       summary:
// //         evidence.length > 0
// //           ? "The current resume already shows leadership, stakeholder-facing reporting, transitions, and cross-functional coordination."
// //           : "The resume has some leadership alignment, but leadership scope and stakeholder ownership need clearer proof.",
// //       evidence,
// //       improvements,
// //       verdict,
// //     };
// //   }, [report, scorecardRows]);

// //   const experienceEvidenceSection = useMemo(() => {
// //     if (!report) {
// //       return null;
// //     }

// //     const workExperience = report.extracted_resume_data?.work_experience || [];

// //     const fitLabelForRole = (role) => {
// //       const source = `${role.title} ${role.company} ${(role.skills_detected || []).join(" ")} ${(role.tools_detected || []).join(" ")} ${(role.bullets || []).join(" ")}`.toLowerCase();
// //       const strongHits = [
// //         "dashboard",
// //         "power bi",
// //         "tableau",
// //         "qlik",
// //         "analytics",
// //         "reporting",
// //         "automation",
// //         "stakeholder",
// //         "sql",
// //       ].filter((pattern) => source.includes(pattern)).length;
// //       if (strongHits >= 5) return "High";
// //       if (strongHits >= 3) return "Medium";
// //       return "Low-Med";
// //     };

// //     const rows = workExperience.slice(0, 6).map((role, index) => {
// //       const roleLabel = [role.title, role.company].filter(Boolean).join(", ") || `Role ${index + 1}`;
// //       const evidenceText = Array.from(
// //         new Set(
// //           [
// //             ...(role.tools_detected || []),
// //             ...(role.skills_detected || []),
// //             ...(role.bullets || []).slice(0, 2),
// //           ]
// //         )
// //       )
// //         .slice(0, 6)
// //         .join(", ");

// //       return {
// //         id: `exp-${index}`,
// //         role: roleLabel,
// //         evidence: evidenceText,
// //         fit: fitLabelForRole(role),
// //       };
// //     }).filter((row) => row.evidence);

// //     if (!rows.length) {
// //       return null;
// //     }

// //     const strategy =
// //       rows.length >= 2
// //         ? `Lead with ${rows[0].role} and ${rows[1].role} because they contain the strongest current evidence for this JD.`
// //         : `Lead with ${rows[0].role} because it contains the strongest current evidence for this JD.`;

// //     return { rows, strategy };
// //   }, [report]);

// //   const riskFlagsSection = useMemo(() => {
// //     if (!report) {
// //       return null;
// //     }

// //     const matrix = report.jd_match_matrix || [];
// //     const topFixes = report.executive_summary?.top_fixes || [];
// //     const rows = [];

// //     matrix
// //       .filter((item) => normalizeAuditStatus(item.status) !== "strong")
// //       .slice(0, 5)
// //       .forEach((item, index) => {
// //         rows.push({
// //           id: `risk-${index}`,
// //           flag: item.requirement || "JD risk area",
// //           severity:
// //             normalizeAuditStatus(item.status) === "gap"
// //               ? "High"
// //               : item.importance === "must_have"
// //                 ? "High"
// //                 : "Medium",
// //           why: item.jd_evidence || item.recommendation || "",
// //           handle:
// //             item.recommendation ||
// //             item.safe_rewrite ||
// //             "",
// //         });
// //       });

// //     if (report.ats_formatting?.recommendations?.length) {
// //       rows.push({
// //         id: "risk-formatting",
// //         flag: "ATS formatting and structure risk",
// //         severity:
// //           String(report.ats_formatting.multi_column_risk || "").toLowerCase() === "high"
// //             ? "High"
// //             : "Medium",
// //         why:
// //           report.ats_formatting.tables_detected
// //             ? "The current format may be table-heavy or harder for ATS systems to parse cleanly."
// //             : "",
// //         handle: report.ats_formatting.recommendations[0],
// //       });
// //     }

// //     topFixes.slice(0, 2).forEach((fix, index) => {
// //       rows.push({
// //         id: `risk-fix-${index}`,
// //         flag: fix.title,
// //         severity: fix.severity === "high" ? "High" : "Medium",
// //         why: fix.why_it_matters,
// //         handle: fix.recommended_action,
// //       });
// //     });

// //     return rows.filter((row) => row.flag && row.severity && row.handle).slice(0, 6);
// //   }, [report]);

// //   const rewriteSection = useMemo(() => {
// //     if (!report) {
// //       return null;
// //     }

// //     const summaryDraft =
// //       report.rewrites?.find((item) => item.section?.toLowerCase().includes("summary"))?.suggested_rewrite ||
// //       null;

// //     const bulletPairs = (report.rewrites || [])
// //       .filter((item) => item.original && item.suggested_rewrite)
// //       .slice(0, 3)
// //       .map((item, index) => ({
// //         id: `rewrite-${index}`,
// //         before: item.original,
// //         after: item.suggested_rewrite,
// //       }));

// //     if (!summaryDraft && !bulletPairs.length) {
// //       return null;
// //     }

// //     return {
// //       summaryDraft,
// //       bulletPairs,
// //     };
// //   }, [report]);

// //   const finalVerdictSection = useMemo(() => {
// //     if (!report) {
// //       return null;
// //     }

// //     const executive = report.executive_summary || {};
// //     const currentScore =
// //       executive.jd_match_score ??
// //       report.jd_match_score ??
// //       executive.overall_readiness_score ??
// //       report.overall_score;
// //     const potentialScore =
// //       executive.score_explanation?.estimated_potential_score_after_rewrite ??
// //       executive.overall_readiness_score ??
// //       report.overall_score ??
// //       currentScore;

// //     const verdictTitle =
// //       potentialScore >= 80
// //         ? "Apply after targeted rewrite"
// //         : currentScore >= 75
// //           ? "Apply with focused edits first"
// //           : executive.decision_signal || "Rewrite before applying";

// //     const verdictBody = executive.recommendation || report.summary;

// //     const planSource = [
// //       ...(report.final_action_plan || []),
// //       ...((executive.top_fixes || []).map((item) => item.recommended_action)),
// //     ].filter(Boolean);

// //     const uniquePlan = Array.from(new Set(planSource.map((item) => String(item).trim()))).slice(0, 5);

// //     const impactForIndex = (index) =>
// //       executive.top_fixes?.[index]?.expected_score_impact || "";

// //     const actionRows = uniquePlan.map((action, index) => ({
// //       id: `verdict-${index}`,
// //       priority: String(index + 1),
// //       action,
// //       impact: impactForIndex(index),
// //     }));

// //     if (!uniquePlan.length || typeof currentScore !== "number" || typeof potentialScore !== "number") {
// //       return null;
// //     }

// //     const disclaimer =
// //       "This report is a resume-to-JD fit analysis based only on the uploaded documents.";

// //     return {
// //       currentScore: clampPercent(currentScore),
// //       potentialScore: clampPercent(potentialScore),
// //       verdictTitle,
// //       verdictBody,
// //       actionRows,
// //       disclaimer,
// //     };
// //   }, [report]);

// //   const topKeywordSignals = useMemo(() => {
// //     if (!report?.analysis_points?.length) {
// //       return [];
// //     }

// //     return report.analysis_points
// //       .filter((point) => point.score < 85)
// //       .flatMap((point) => buildKeywords(point))
// //       .filter((token) => token.length > 3)
// //       .reduce((accumulator, keyword) => {
// //         accumulator[keyword] = (accumulator[keyword] || 0) + 1;
// //         return accumulator;
// //       }, {});
// //   }, [report]);

// //   const keywordChips = useMemo(() => {
// //     const entries = Object.entries(topKeywordSignals || {});
// //     return entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
// //   }, [topKeywordSignals]);

// //   const radarItems = useMemo(
// //     () =>
// //       (report?.category_scores || []).map((item) => ({
// //         category: item.category,
// //         score: item.score,
// //       })),
// //     [report]
// //   );

// //   const impactLanguageChart = useMemo(() => {
// //     const sourceText = (resume?.raw_text || resumeLines.map((line) => line.text).join(" ")).toLowerCase();
// //     const strongTokens = [
// //       "led",
// //       "managed",
// //       "directed",
// //       "spearheaded",
// //       "executed",
// //       "analyzed",
// //       "optimized",
// //       "delivered",
// //       "launched",
// //       "implemented",
// //       "improved",
// //       "designed",
// //       "drove",
// //       "mentored",
// //       "negotiated",
// //       "built",
// //     ];
// //     const weakTokens = [
// //       "responsible for",
// //       "worked on",
// //       "handled",
// //       "involved in",
// //       "being a part of",
// //       "helped",
// //       "assisted",
// //       "participated in",
// //       "supporting",
// //     ];

// //     const strongCount = strongTokens.reduce(
// //       (sum, token) => sum + (sourceText.match(new RegExp(`\\b${token.replace(/\s+/g, "\\s+")}\\b`, "g")) || []).length,
// //       0
// //     );
// //     const weakCount = weakTokens.reduce(
// //       (sum, token) => sum + (sourceText.match(new RegExp(token.replace(/\s+/g, "\\s+"), "g")) || []).length,
// //       0
// //     );
// //     const total = Math.max(strongCount + weakCount, 1);

// //     return {
// //       strongCount,
// //       weakCount,
// //       items: [
// //         {
// //           label: "Impact-driven",
// //           value: Math.round((strongCount / total) * 100),
// //           color: "#10b981",
// //         },
// //         {
// //           label: "Duty-driven",
// //           value: Math.round((weakCount / total) * 100),
// //           color: "#f59e0b",
// //         },
// //       ],
// //     };
// //   }, [resume, resumeLines]);

// //   const keywordCloudItems = useMemo(() => {
// //     const counts = {};
// //     tokenizeText(resume?.raw_text || resumeLines.map((line) => line.text).join(" ")).forEach((token) => {
// //       counts[token] = (counts[token] || 0) + 1;
// //     });
// //     const entries = Object.entries(counts)
// //       .filter(([, count]) => count > 1)
// //       .sort((a, b) => b[1] - a[1])
// //       .slice(0, 12);
// //     const top = entries[0]?.[1] || 1;
// //     return entries.map(([word, count]) => ({
// //       word,
// //       weight: Math.max(1, (count / top) * 8),
// //     }));
// //   }, [resume, resumeLines]);

// //   const skillMixChart = useMemo(() => {
// //     const tokens = tokenizeText(resume?.raw_text || resumeLines.map((line) => line.text).join(" "));
// //     const hardSkillLexicon = new Set([
// //       "sql",
// //       "python",
// //       "power",
// //       "tableau",
// //       "excel",
// //       "analytics",
// //       "analysis",
// //       "modeling",
// //       "automation",
// //       "etl",
// //       "dashboard",
// //       "forecasting",
// //       "reporting",
// //       "database",
// //       "visualization",
// //       "kpi",
// //       "bi",
// //       "warehouse",
// //     ]);
// //     const softSkillLexicon = new Set([
// //       "leadership",
// //       "communication",
// //       "stakeholder",
// //       "collaboration",
// //       "mentoring",
// //       "training",
// //       "negotiation",
// //       "teamwork",
// //       "problem",
// //       "ownership",
// //       "planning",
// //     ]);
// //     const toolLexicon = new Set([
// //       "sap",
// //       "jira",
// //       "confluence",
// //       "excel",
// //       "powerbi",
// //       "power",
// //       "sql",
// //       "python",
// //       "oracle",
// //       "snowflake",
// //       "github",
// //       "figma",
// //       "aws",
// //       "gcp",
// //       "looker",
// //     ]);

// //     let hardSkills = 0;
// //     let softSkills = 0;
// //     let tools = 0;

// //     tokens.forEach((token) => {
// //       if (hardSkillLexicon.has(token)) {
// //         hardSkills += 1;
// //       }
// //       if (softSkillLexicon.has(token)) {
// //         softSkills += 1;
// //       }
// //       if (toolLexicon.has(token)) {
// //         tools += 1;
// //       }
// //     });

// //     return [
// //       { label: "Technical / Hard Skills", value: hardSkills || 1, color: "#1f4dbd" },
// //       { label: "Soft Skills", value: softSkills || 1, color: "#f59e0b" },
// //       { label: "Tools / Software", value: tools || 1, color: "#10b981" },
// //     ];
// //   }, [resume, resumeLines]);

// //   const tenureTimeline = useMemo(() => {
// //     const sourceLines = resumeLines.filter((line) =>
// //       /experience|employment|career|professional/i.test(line.section_name || "")
// //     );
// //     const datePattern =
// //       /(?<start>(?:0?[1-9]|1[0-2])\/\d{4}|\d{4})\s*(?:to|-|–|—)\s*(?<end>current|present|(?:0?[1-9]|1[0-2])\/\d{4}|\d{4})/i;

// //     const toYearValue = (value) => {
// //       if (!value) return null;
// //       const lowered = value.toLowerCase();
// //       if (lowered === "current" || lowered === "present") {
// //         return new Date().getFullYear() + 0.4;
// //       }
// //       if (value.includes("/")) {
// //         const [month, year] = value.split("/");
// //         return Number(year) + (Number(month) - 1) / 12;
// //       }
// //       return Number(value);
// //     };

// //     return sourceLines
// //       .map((line) => {
// //         const match = line.text.match(datePattern);
// //         if (!match?.groups) {
// //           return null;
// //         }
// //         const start = toYearValue(match.groups.start);
// //         const end = toYearValue(match.groups.end);
// //         if (!start || !end) {
// //           return null;
// //         }
// //         const label = line.text
// //           .replace(match[0], "")
// //           .replace(/\s+/g, " ")
// //           .replace(/[-|–—]+/g, " ")
// //           .trim()
// //           .slice(0, 56);

// //         return {
// //           label: label || "Role",
// //           start,
// //           end,
// //           startLabel: match.groups.start,
// //           endLabel: match.groups.end,
// //         };
// //       })
// //       .filter(Boolean)
// //       .slice(0, 8)
// //       .sort((a, b) => a.start - b.start);
// //   }, [resumeLines]);

// //   const analyzeEvidenceLine = async (segment) => {
// //     const insightKey = segment.segment_id;
// //     setAiLineInsights((current) => ({
// //       ...current,
// //       [insightKey]: {
// //         status: "loading",
// //         error: "",
// //       },
// //     }));

// //     try {
// //       const response = await analyzeLine({
// //         resume_id: report.resume_id,
// //         line_id: segment.line_id,
// //         line_text: segment.text,
// //       });

// //       setAiLineInsights((current) => ({
// //         ...current,
// //         [insightKey]: {
// //           status: "success",
// //           data: response.data,
// //           error: "",
// //         },
// //       }));
// //     } catch (requestError) {
// //       setAiLineInsights((current) => ({
// //         ...current,
// //         [insightKey]: {
// //           status: "error",
// //           error:
// //             requestError?.response?.data?.detail ||
// //             "Unable to analyze this line with AI right now.",
// //         },
// //       }));
// //     }
// //   };

// //   const focusResumeArea = (line) => {
// //     if (!line) {
// //       return;
// //     }
// //     setHighlightedLineId(line.line_id);
// //     setOriginalSearchInput(line.text || "");
// //     setOriginalSearchTerm(line.text || "");
// //   };

// //   const applyOriginalSearch = () => {
// //     setOriginalSearchTerm(originalSearchInput.trim());
// //   };

// //   const clearPreviewFocus = () => {
// //     setHighlightedLineId("");
// //     setOriginalSearchInput("");
// //     setOriginalSearchTerm("");
// //   };

// //   const originalPreviewUrl = useMemo(() => {
// //     if (!report?.resume_id) {
// //       return "";
// //     }

// //     return getResumeOriginalPreviewUrl(
// //       report.resume_id,
// //       report.saved_report_id || report.analysis_id || "",
// //       highlightedLineId || "",
// //       originalSearchTerm || ""
// //     );
// //   }, [highlightedLineId, originalSearchTerm, report]);

// //   const handleSave = async () => {
// //     if (!report?.analysis_id || report?.saved_report_id) {
// //       return;
// //     }

// //     setSaveStatus("loading");
// //     setSaveMessage("");
// //     try {
// //       const response = await saveAnalysisReport(report.analysis_id);
// //       setReport((current) =>
// //         current
// //           ? {
// //               ...current,
// //               saved_report_id: response.data.report_id,
// //             }
// //           : current
// //       );
// //       setSaveMessage("Report saved to the repository.");
// //       setSaveStatus("success");
// //     } catch (requestError) {
// //       setSaveMessage(
// //         requestError?.response?.data?.detail ||
// //           "Unable to save the report right now."
// //       );
// //       setSaveStatus("error");
// //     }
// //   };

// //   const handleDownloadPdf = () => {
// //     if (!report) {
// //       return;
// //     }
// //     const url = report.saved_report_id
// //       ? getSavedReportPdfUrl(report.saved_report_id)
// //       : getAnalysisReportPdfUrl(report.analysis_id);
// //     const anchor = document.createElement("a");
// //     anchor.href = url;
// //     anchor.target = "_blank";
// //     anchor.rel = "noopener noreferrer";
// //     document.body.appendChild(anchor);
// //     anchor.click();
// //     anchor.remove();
// //   };

// //   const currentReportPreviewPage = reportPreviewPages[reportPreviewPageIndex];

// //   const openReportPreview = async () => {
// //     if (!report) {
// //       return;
// //     }

// //     setIsReportPreviewOpen(true);
// //     setReportPreviewStatus("loading");
// //     setReportPreviewError("");

// //     try {
// //       const response = report.saved_report_id
// //         ? await getSavedReportPreviewPages(report.saved_report_id)
// //         : await getAnalysisReportPreviewPages(report.analysis_id);
// //       setReportPreviewPages(response.data.pages || []);
// //       setReportPreviewPageIndex(0);
// //       setReportPreviewStatus("success");
// //     } catch (requestError) {
// //       setReportPreviewPages([]);
// //       setReportPreviewStatus("error");
// //       setReportPreviewError(
// //         requestError?.response?.data?.detail ||
// //           "Unable to prepare the report preview right now."
// //       );
// //     }
// //   };

// //   if (status === "loading") {
// //     return (
// //       <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
// //         <Loader label="Loading ATS analysis report..." />
// //       </div>
// //     );
// //   }

// //   if (status === "error") {
// //     return (
// //       <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
// //         <Toast message={error} variant="error" />
// //       </div>
// //     );
// //   }

// //   const candidateName =
// //     report?.candidate_name ||
// //     resume?.candidate_name ||
// //     report?.resume_file_name ||
// //     "Candidate";

// //   return (
// //     <div className="mx-auto max-w-[1500px] space-y-4 px-3 py-4 md:px-4">
// //       <ReportCoverHero
// //         report={report}
// //         actions={
// //           <>
// //             <Button
// //               variant={report.saved_report_id ? "outline" : "primary"}
// //               onClick={handleSave}
// //               disabled={Boolean(report.saved_report_id) || saveStatus === "loading"}
// //               className="min-w-[160px] rounded-2xl border-white/20 px-5 py-3 text-sm font-black shadow-[0_16px_30px_rgba(7,24,47,0.28)]"
// //               style={
// //                 report.saved_report_id
// //                   ? {
// //                       borderColor: "rgba(255,255,255,0.28)",
// //                       backgroundColor: "rgba(255,255,255,0.12)",
// //                       color: "#FFFFFF",
// //                     }
// //                   : undefined
// //               }
// //             >
// //               <FolderOpen className="mr-2 h-4 w-4" />
// //               {report.saved_report_id
// //                 ? "Saved"
// //                 : saveStatus === "loading"
// //                   ? "Saving..."
// //                   : "Save"}
// //             </Button>
// //             <Button
// //               variant="ghost"
// //               onClick={openReportPreview}
// //               className="min-w-[190px] rounded-2xl px-5 py-3 text-sm font-black text-white backdrop-blur-sm hover:bg-white/14"
// //               style={{
// //                 border: "1px solid rgba(255,255,255,0.3)",
// //                 backgroundColor: "rgba(255,255,255,0.1)",
// //                 color: "#FFFFFF",
// //               }}
// //             >
// //               Preview Report
// //             </Button>
// //             <Button
// //               variant="ghost"
// //               onClick={handleDownloadPdf}
// //               className="min-w-[190px] rounded-2xl px-5 py-3 text-sm font-black text-white backdrop-blur-sm hover:bg-white/14"
// //               style={{
// //                 border: "1px solid rgba(255,255,255,0.3)",
// //                 backgroundColor: "rgba(255,255,255,0.1)",
// //                 color: "#FFFFFF",
// //               }}
// //             >
// //               <Download className="mr-2 h-4 w-4" />
// //               Download PDF
// //             </Button>
// //             <Link to="/check-ats">
// //               <Button
// //                 variant="ghost"
// //                 className="rounded-2xl px-5 py-3 text-sm font-black text-white hover:bg-white/10"
// //               >
// //                 <RefreshCw className="mr-2 h-4 w-4" />
// //                 New Check
// //               </Button>
// //             </Link>
// //           </>
// //         }
// //       />
// //       <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
// //         <aside className="min-w-0">
// //           <div className="xl:sticky xl:top-24">
// //             <Card
// //               className={`rounded-[30px] border border-shellstone/60 bg-white p-3 shadow-[0_18px_50px_rgba(16,36,90,0.09)] transition-all duration-200 ${
// //                 isSidebarMinimized ? "xl:w-[86px]" : ""
// //               }`}
// //             >
// //               <div className="flex items-center justify-between gap-2">
// //                 {!isSidebarMinimized ? (
// //                   <div className="rounded-full bg-[#E7F0F8] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#10245A]">
// //                     Report Sections
// //                   </div>
// //                 ) : (
// //                   <div className="h-10" />
// //                 )}
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsSidebarMinimized((value) => !value)}
// //                   aria-label={isSidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
// //                   className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#DDEAF3] bg-[#F8FBFD] text-[#2F4054] transition hover:bg-white"
// //                 >
// //                   {isSidebarMinimized ? (
// //                     <ChevronRight className="h-4 w-4" />
// //                   ) : (
// //                     <ChevronLeft className="h-4 w-4" />
// //                   )}
// //                 </button>
// //               </div>

// //               <div className="mt-3 space-y-2">
// //                 {REPORT_SIDEBAR_ITEMS.map((item, index) => (
// //                   <a
// //                     key={item.id}
// //                     href={`#${item.id}`}
// //                     title={item.label}
// //                     className={`flex items-center rounded-2xl border border-[#DDEAF3] bg-[#F8FBFD] text-[#2F4054] transition hover:bg-white hover:text-[#143552] ${
// //                       isSidebarMinimized
// //                         ? "justify-center px-2 py-3"
// //                         : "gap-3 px-3 py-2.5"
// //                     }`}
// //                   >
// //                     <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-black text-[#143552] shadow-[0_4px_10px_rgba(16,36,90,0.08)]">
// //                       {index + 1}
// //                     </span>
// //                     {!isSidebarMinimized ? (
// //                       <span className="truncate text-[12px] font-black tracking-[0.01em]">
// //                         {item.label}
// //                       </span>
// //                     ) : null}
// //                   </a>
// //                 ))}
// //               </div>

// //               <div className="mt-3">
// //                 <Button
// //                   type="button"
// //                   variant="outline"
// //                   onClick={() => setIsResumeViewerOpen(true)}
// //                   className={`w-full rounded-2xl border-[#DDEAF3] bg-[#F8FBFD] text-[11px] font-black uppercase tracking-[0.08em] text-[#2F4054] hover:bg-white ${
// //                     isSidebarMinimized ? "px-2 py-3" : "px-4 py-2.5"
// //                   }`}
// //                   title="View Resume"
// //                 >
// //                   <Eye className={`${isSidebarMinimized ? "" : "mr-2 "}h-3.5 w-3.5`} />
// //                   {!isSidebarMinimized ? "View Resume" : null}
// //                 </Button>
// //               </div>
// //             </Card>
// //           </div>
// //         </aside>

// //         <div className="min-w-0 space-y-4">
// //           <div id="report-overview" className="grid gap-3 md:grid-cols-4">
            
// //           </div>

// //           <ReportSectionShell
// //             eyebrow="Report Summary"
// //             title={`${candidateName} Summary`}
// //             description={report.summary}
// //           >
// //             <div className="grid gap-3 md:grid-cols-[auto_minmax(0,1fr)]">
// //               <div className="min-w-0 space-y-2">
// //                 <span className="inline-flex rounded-full border border-shellstone/60 bg-swanwing px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sapphire">
// //                   {report.analysis_type === "resume_jd"
// //                     ? "Resume + JD Analysis"
// //                     : "Resume Analysis"}
// //                 </span>
// //               </div>

// //               <div className="min-w-0 space-y-2">
// //                 <p className="text-sm font-semibold text-slate-600">
// //                   <span className="font-black text-slate-800">Candidate:</span>{" "}
// //                   {candidateName}
// //                 </p>
// //                 <p className="text-sm font-semibold text-slate-600">
// //                   <span className="font-black text-slate-800">Resume file:</span>{" "}
// //                   {report.resume_file_name}
// //                 </p>
// //                 {report.job_description_excerpt ? (
// //                   <p className="max-w-4xl text-sm leading-6 text-slate-500">
// //                     <span className="font-bold text-slate-700">JD context:</span>{" "}
// //                     {report.job_description_excerpt}
// //                   </p>
// //                 ) : null}
// //               </div>
// //             </div>

// //             {saveMessage ? (
// //               <div className="mt-3">
// //                 <Toast
// //                   message={saveMessage}
// //                   variant={saveStatus === "error" ? "error" : "success"}
// //                 />
// //               </div>
// //             ) : null}
// //           </ReportSectionShell>

// //           <MethodologySection report={report} />

// //           {report.executive_summary ? (
// //             <Card id="report-at-glance" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   At a Glance
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   A one-page summary of the candidate, target role and overall hiring-readiness signal.
// //                 </p>
// //               </div>

// //               <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
// //                 <div className="flex justify-center lg:justify-start">
// //                   <div className="flex h-[188px] w-[188px] flex-col items-center justify-center rounded-full bg-[#F7B500] text-center text-white shadow-[0_16px_34px_rgba(247,181,0,0.22)]">
// //                     <p className="text-[26px] font-black tracking-[-0.04em]">
// //                       {report.executive_summary.jd_match_score ?? report.executive_summary.overall_readiness_score}/100
// //                     </p>
// //                     <p className="mt-1 text-[12px] font-black uppercase tracking-[0.06em]">
// //                       {report.executive_summary.jd_match_score !== null ? "Match" : "Current"}
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="space-y-3">
// //                   <h3 className="text-[clamp(1.3rem,1.75vw,1.6rem)] font-black tracking-[-0.03em] text-[#143552]">
// //                     {report.executive_summary.decision_signal}
// //                   </h3>
// //                   <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                     {report.executive_summary.recommendation}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="mt-8 grid gap-4 md:grid-cols-2">
// //                 {report?.extracted_resume_data?.candidate_profile?.current_title ? (
// //                 <div className="rounded-[28px] border border-shellstone/60 bg-white p-5 shadow-[0_10px_24px_rgba(16,36,90,0.04)]">
// //                   <div className="flex items-start justify-between gap-3">
// //                     <div>
// //                       <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#6A7D98]">
// //                         Candidate
// //                       </p>
// //                       <h3 className="mt-3 text-[clamp(1.15rem,1.55vw,1.45rem)] font-black tracking-[-0.025em] leading-[1.22] text-[#143552]">
// //                         {candidateName}
// //                       </h3>
// //                       <p className="mt-2 text-[15px] leading-7 text-[#667999]">
// //                         {report?.extracted_resume_data?.candidate_profile?.current_title}
// //                         {report?.extracted_resume_data?.candidate_profile?.total_experience
// //                           ? ` / ${report.extracted_resume_data.candidate_profile.total_experience}`
// //                           : ""}
// //                       </p>
// //                     </div>
// //                     <span className="rounded-full bg-[#2583CF] px-6 py-2 text-[12px] font-black uppercase tracking-[0.04em] text-white">
// //                       Info
// //                     </span>
// //                   </div>
// //                 </div>
// //                 ) : null}

// //                 {report?.extracted_jd_data?.jd_profile?.target_role ? (
// //                 <div className="rounded-[28px] border border-shellstone/60 bg-white p-5 shadow-[0_10px_24px_rgba(16,36,90,0.04)]">
// //                   <div className="flex items-start justify-between gap-3">
// //                     <div>
// //                       <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#6A7D98]">
// //                         Target Role
// //                       </p>
// //                       <h3 className="mt-3 text-[clamp(1.15rem,1.55vw,1.45rem)] font-black tracking-[-0.025em] leading-[1.22] text-[#143552]">
// //                         {report?.extracted_jd_data?.jd_profile?.target_role}
// //                       </h3>
// //                       {report?.extracted_jd_data?.jd_profile?.company ? (
// //                         <p className="mt-2 text-[15px] leading-7 text-[#667999]">
// //                           {report?.extracted_jd_data?.jd_profile?.company}
// //                         </p>
// //                       ) : null}
// //                     </div>
// //                     <span className="rounded-full bg-[#2583CF] px-6 py-2 text-[12px] font-black uppercase tracking-[0.04em] text-white">
// //                       Info
// //                     </span>
// //                   </div>
// //                 </div>
// //                 ) : null}

// //                 {report.category_scores?.[0]?.category ? (
// //                 <div className="rounded-[28px] border border-shellstone/60 bg-white p-5 shadow-[0_10px_24px_rgba(16,36,90,0.04)]">
// //                   <div className="flex items-start justify-between gap-3">
// //                     <div>
// //                       <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#6A7D98]">
// //                         Strongest Fit
// //                       </p>
// //                       <h3 className="mt-3 text-[clamp(1.15rem,1.55vw,1.45rem)] font-black tracking-[-0.025em] leading-[1.22] text-[#143552]">
// //                         {report.category_scores?.[0]?.category}
// //                       </h3>
// //                       {report?.extracted_resume_data?.skills?.tools?.length ? (
// //                         <p className="mt-2 text-[15px] leading-7 text-[#667999]">
// //                           {report.extracted_resume_data.skills.tools.slice(0, 5).join(", ")}
// //                         </p>
// //                       ) : null}
// //                     </div>
// //                     <span className="rounded-full bg-[#1EAD4E] px-6 py-2 text-[12px] font-black uppercase tracking-[0.04em] text-white">
// //                       Good
// //                     </span>
// //                   </div>
// //                 </div>
// //                 ) : null}

// //                 {report.executive_summary.top_fixes?.[0]?.title ? (
// //                 <div className="rounded-[28px] border border-shellstone/60 bg-white p-5 shadow-[0_10px_24px_rgba(16,36,90,0.04)]">
// //                   <div className="flex items-start justify-between gap-3">
// //                     <div>
// //                       <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#6A7D98]">
// //                         Biggest Risk
// //                       </p>
// //                       <h3 className="mt-3 text-[clamp(1.15rem,1.55vw,1.45rem)] font-black tracking-[-0.025em] leading-[1.22] text-[#143552]">
// //                         {report.executive_summary.top_fixes?.[0]?.title}
// //                       </h3>
// //                       {report.executive_summary.top_fixes?.[0]?.why_it_matters ? (
// //                         <p className="mt-2 text-[15px] leading-7 text-[#667999]">
// //                           {report.executive_summary.top_fixes?.[0]?.why_it_matters}
// //                         </p>
// //                       ) : null}
// //                     </div>
// //                     <span className="rounded-full bg-[#E52521] px-6 py-2 text-[12px] font-black uppercase tracking-[0.04em] text-white">
// //                       Gap
// //                     </span>
// //                   </div>
// //                 </div>
// //                 ) : null}
// //               </div>

// //               <div className="mt-8 rounded-[30px] border border-shellstone/60 bg-white p-6 shadow-[0_10px_24px_rgba(16,36,90,0.04)]">
// //                 <h3 className="text-[clamp(1.2rem,1.6vw,1.45rem)] font-black tracking-[-0.025em] text-[#F39A06]">
// //                   ATS Report Summary
// //                 </h3>
// //                 <p className="mt-5 text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                   {report.summary}
// //                 </p>
// //                 <div className="mt-6 rounded-[22px] border border-emerald-200 bg-emerald-50 px-6 py-5">
// //                   <p className="text-[clamp(1.05rem,1.45vw,1.35rem)] font-black tracking-[-0.02em] text-emerald-600">
// //                     Estimated score after targeted rewrite:{" "}
// //                     <span className="text-[#143552]">
// //                       {report.executive_summary.score_explanation?.estimated_potential_score_after_rewrite ??
// //                         report.executive_summary.overall_readiness_score}
// //                       /100
// //                     </span>
// //                   </p>
// //                 </div>
// //               </div>
// //             </Card>
// //           ) : null}

// //           {requirementCheckerPrimaryRows.length ? (
// //             <Card id="report-jd-matrix" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Requirement Checker
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   Each JD requirement is checked against the current resume with extracted evidence and explanation.
// //                 </p>
// //               </div>

// //               <div className="mt-8">
// //                 <AnalysisTable
// //                   columns={[
// //                     { key: "requirement", label: "Requirement", width: "23%", emphasis: true },
// //                     { key: "evidence", label: "Evidence found in resume", width: "32%" },
// //                     { key: "status", label: "Status", width: "13%" },
// //                     { key: "explanation", label: "Explanation", width: "32%" },
// //                   ]}
// //                   rows={requirementCheckerPrimaryRows}
// //                 />
// //               </div>
// //             </Card>
// //           ) : null}

// //           {requirementCheckerContinuationRows.length ? (
// //             <Card id="report-jd-matrix-continuation" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Requirement Checker
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   Continuation of must-have and desired skill checks from the target job description.
// //                 </p>
// //               </div>

// //               <div className="mt-8">
// //                 <AnalysisTable
// //                   columns={[
// //                     { key: "requirement", label: "Requirement", width: "23%", emphasis: true },
// //                     { key: "evidence", label: "Evidence found in resume", width: "32%" },
// //                     { key: "status", label: "Status", width: "13%" },
// //                     { key: "explanation", label: "Explanation", width: "32%" },
// //                   ]}
// //                   rows={requirementCheckerContinuationRows}
// //                 />
// //               </div>

// //               <div className="mt-8 rounded-[28px] border border-[#F6C58A] bg-[#FFF6EA] px-6 py-5">
// //                 <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-black tracking-[-0.02em] text-[#F39A06]">
// //                   Main Checker Outcome
// //                 </h3>
// //                 <p className="mt-4 text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                   {requirementOutcomeSummary}
// //                 </p>
// //               </div>
// //             </Card>
// //           ) : null}

// //           {parsingHealthRows.length ? (
// //             <Card id="report-ats-parsing" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   ATS Parsing &amp; Structure
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   Checks whether the resume is easy for an applicant tracking system to read, extract, and rank.
// //                 </p>
// //               </div>

// //               <div className="mt-8 flex items-center gap-4">
// //                 <div
// //                   className="h-[52px] w-[52px] rounded-full border bg-white"
// //                   style={{ borderColor: "#D8E5F0" }}
// //                 />
// //                 <h3 className="text-[clamp(1.35rem,1.85vw,1.75rem)] font-black tracking-[-0.03em] text-[#143552]">
// //                   Parsing Health
// //                 </h3>
// //               </div>

// //               <div className="mt-6">
// //                 <AnalysisTable
// //                   columns={[
// //                     { key: "check", label: "Check", width: "23%", emphasis: true },
// //                     { key: "finding", label: "Finding", width: "33%" },
// //                     { key: "status", label: "Status", width: "14%" },
// //                     { key: "why", label: "Why it matters", width: "30%" },
// //                   ]}
// //                   rows={parsingHealthRows}
// //                 />
// //               </div>

// //               {formattingRecommendations.length ? (
// //                 <div
// //                   className="mt-8 rounded-[28px] border bg-white px-6 py-5"
// //                   style={{
// //                     borderColor: "#D8E5F0",
// //                     boxShadow: "0 16px 36px rgba(16,36,90,0.04)",
// //                   }}
// //                 >
// //                   <h3 className="text-[clamp(1.2rem,1.65vw,1.55rem)] font-black tracking-[-0.025em] text-[#143552]">
// //                     Formatting Recommendations
// //                   </h3>
// //                   <div className="mt-5 space-y-2">
// //                     {formattingRecommendations.map((item) => (
// //                       <div key={item} className="flex items-start gap-3">
// //                         <span
// //                           className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
// //                           style={{ backgroundColor: "#2583CF" }}
// //                         />
// //                         <p className="text-[15px] leading-7 text-slate-800">{item}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               ) : null}
// //             </Card>
// //           ) : null}

// //           {scorecardRows.length ? (
// //             <Card id="report-scorecard" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Scorecard
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   Category-wise scoring helps explain the overall match rather than giving a black-box score.
// //                 </p>
// //               </div>

// //               <div className="mt-8 space-y-7">
// //                 {scorecardRows.map((row) => {
// //                   const level = scoreLevel(row.score);
// //                   return (
// //                     <div key={row.label}>
// //                       <div className="mb-2 flex items-end justify-between gap-4">
// //                         <p className="text-[15px] font-medium leading-6 text-slate-900 md:text-[16px]">
// //                           {row.label}
// //                         </p>
// //                         <span className="text-[14px] font-black text-slate-900">
// //                           {row.score}
// //                         </span>
// //                       </div>
// //                       <div className="flex items-center gap-5">
// //                         <div className="h-[28px] flex-1 overflow-hidden rounded-full bg-[#DCE9F5]">
// //                           <div
// //                             className="h-full rounded-full"
// //                             style={{
// //                               width: `${row.score}%`,
// //                               backgroundColor: level.color,
// //                             }}
// //                           />
// //                         </div>
// //                         <span
// //                           className="inline-flex min-w-[104px] justify-center rounded-full px-4 py-2 text-[12px] font-black uppercase tracking-[0.04em] text-white"
// //                           style={{ backgroundColor: level.color }}
// //                         >
// //                           {level.label}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>

// //               <div
// //                 className="mt-10 rounded-[28px] border bg-white px-6 py-5"
// //                 style={{
// //                   borderColor: "#D8E5F0",
// //                   boxShadow: "0 16px 36px rgba(16,36,90,0.04)",
// //                 }}
// //               >
// //                 <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-black tracking-[-0.02em] text-[#143552]">
// //                   Reading the Score
// //                 </h3>
// //                 <p className="mt-4 text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   Scores above 80 indicate clear proof in the resume. Scores between 60-79 are usable but should be strengthened with sharper bullets. Scores below 60 are current-resume risks and should be addressed before applying.
// //                 </p>
// //               </div>
// //             </Card>
// //           ) : null}

// //           {biReportingSection ? (
// //             <Card id="report-bi-reporting" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   BI, Dashboards &amp; Reporting
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   This is one of the candidate&apos;s stronger areas against the target role.
// //                 </p>
// //               </div>

// //               <div className="mt-8 grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-center">
// //                 <div className="flex justify-center lg:justify-start">
// //                   <div className="flex h-[176px] w-[176px] flex-col items-center justify-center rounded-full bg-[#1EAD4E] text-center text-white">
// //                     <p className="text-[28px] font-black tracking-[-0.04em]">
// //                       {biReportingSection.score}/100
// //                     </p>
// //                     <p className="mt-1 text-[12px] font-black uppercase tracking-[0.06em]">
// //                       BI Fit
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="space-y-3">
// //                   <h3 className="text-[clamp(1.55rem,2.15vw,2rem)] font-black tracking-[-0.035em] text-[#143552]">
// //                     {biReportingSection.performance}
// //                   </h3>
// //                   <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                     {biReportingSection.summary}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="mt-8 grid gap-5 md:grid-cols-2">
// //                 <div
// //                   className="rounded-[28px] border bg-white px-6 py-5"
// //                   style={{ borderColor: "#D8E5F0", boxShadow: "0 16px 36px rgba(16,36,90,0.04)" }}
// //                 >
// //                   <h3 className="text-[clamp(1.3rem,1.8vw,1.75rem)] font-black tracking-[-0.025em] text-[#1EAD4E]">
// //                     Evidence Found
// //                   </h3>
// //                   <div className="mt-5 space-y-2">
// //                     {biReportingSection.evidence.map((item) => (
// //                       <div key={item} className="flex items-start gap-3">
// //                         <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1EAD4E]" />
// //                         <p className="text-[15px] leading-7 text-slate-800">{item}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {biReportingSection.improvements.length ? (
// //                   <div
// //                     className="rounded-[28px] border bg-white px-6 py-5"
// //                     style={{ borderColor: "#D8E5F0", boxShadow: "0 16px 36px rgba(16,36,90,0.04)" }}
// //                   >
// //                     <h3 className="text-[clamp(1.3rem,1.8vw,1.75rem)] font-black tracking-[-0.025em] text-[#F39A06]">
// //                       How to Improve
// //                     </h3>
// //                     <div className="mt-5 space-y-2">
// //                       {biReportingSection.improvements.map((item) => (
// //                         <div key={item} className="flex items-start gap-3">
// //                           <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F39A06]" />
// //                           <p className="text-[15px] leading-7 text-slate-800">{item}</p>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ) : null}
// //               </div>

// //               {biReportingSection.positioning ? (
// //                 <div className="mt-8 rounded-[28px] border border-emerald-200 bg-emerald-50 px-6 py-5">
// //                   <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-black tracking-[-0.02em] text-[#1EAD4E]">
// //                     Recommended resume positioning
// //                   </h3>
// //                   <p className="mt-4 text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                     {biReportingSection.positioning}
// //                   </p>
// //                 </div>
// //               ) : null}
// //             </Card>
// //           ) : null}

// //           {aiMlSection?.rows?.length ? (
// //             <Card id="report-aiml" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Advanced Analytics &amp; AI/ML
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   {aiMlSection.summary}
// //                 </p>
// //               </div>

// //               <div className="mt-8 grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-center">
// //                 <div className="flex justify-center lg:justify-start">
// //                   <div className="flex h-[176px] w-[176px] flex-col items-center justify-center rounded-full bg-[#E52521] text-center text-white">
// //                     <p className="text-[28px] font-black tracking-[-0.04em]">
// //                       {aiMlSection.score}/100
// //                     </p>
// //                     <p className="mt-1 text-[12px] font-black uppercase tracking-[0.06em]">
// //                       AI/ML
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="space-y-3">
// //                   <h3 className="text-[clamp(1.55rem,2.15vw,2rem)] font-black tracking-[-0.035em] text-[#143552]">
// //                     {aiMlSection.performance}
// //                   </h3>
// //                   <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                     {aiMlSection.summary}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="mt-8">
// //                 <AnalysisTable
// //                   columns={[
// //                     { key: "requirement", label: "AI/ML requirement", width: "25%", emphasis: true },
// //                     { key: "evidence", label: "Current resume evidence", width: "30%" },
// //                     { key: "status", label: "Status", width: "13%" },
// //                     { key: "add", label: "What to add", width: "32%" },
// //                   ]}
// //                   rows={aiMlSection.rows}
// //                 />
// //               </div>

// //               {aiMlSection.proofFormat ? (
// //                 <div className="mt-8 rounded-[28px] border border-[#F6C58A] bg-[#FFF6EA] px-6 py-5">
// //                   <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-black tracking-[-0.02em] text-[#F39A06]">
// //                     Suggested AI/ML proof format
// //                   </h3>
// //                   <p className="mt-4 text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                     {aiMlSection.proofFormat}
// //                   </p>
// //                 </div>
// //               ) : null}
// //             </Card>
// //           ) : null}

// //           {governanceSection ? (
// //             <Card id="report-governance" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Data Governance, Quality &amp; Architecture
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   The JD asks for quality controls, data governance, and enterprise data warehouse or reporting architecture proof.
// //                 </p>
// //               </div>

// //               <div className="mt-8 grid gap-5 md:grid-cols-3">
// //                 {governanceSection.cards.map((card) => (
// //                   <div
// //                     key={card.title}
// //                     className="rounded-[28px] border bg-white px-6 py-5"
// //                     style={{ borderColor: "#D8E5F0", boxShadow: "0 16px 36px rgba(16,36,90,0.04)" }}
// //                   >
// //                     <div className="flex items-start gap-4">
// //                       <div className="flex h-[114px] w-[114px] shrink-0 flex-col items-center justify-center rounded-full bg-[#E52521] text-center text-white">
// //                         <p className="text-[18px] font-black tracking-[-0.04em]">{card.score}/100</p>
// //                         <p className="mt-1 text-[10px] font-black uppercase tracking-[0.06em]">Score</p>
// //                       </div>
// //                       <div className="min-w-0">
// //                         <h3 className="text-[clamp(1.2rem,1.55vw,1.5rem)] font-black tracking-[-0.025em] text-[#143552]">
// //                           {card.title}
// //                         </h3>
// //                         <p className="mt-3 text-[15px] leading-7 text-[#667999]">
// //                           {card.summary}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {governanceSection.notes.length ? (
// //                 <>
// //                   <div className="mt-8 flex items-center gap-4">
// //                     <div
// //                       className="h-[52px] w-[52px] rounded-full border bg-white"
// //                       style={{ borderColor: "#D8E5F0" }}
// //                     />
// //                     <h3 className="text-[clamp(1.35rem,1.85vw,1.75rem)] font-black tracking-[-0.03em] text-[#143552]">
// //                       Checker Notes
// //                     </h3>
// //                   </div>

// //                   <div className="mt-5 space-y-2">
// //                     {governanceSection.notes.map((item) => (
// //                       <div key={item} className="flex items-start gap-3">
// //                         <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2583CF]" />
// //                         <p className="text-[15px] leading-7 text-slate-800">{item}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </>
// //               ) : null}

// //               {governanceSection.riskRows.length ? (
// //                 <div className="mt-8">
// //                   <AnalysisTable
// //                     columns={[
// //                       { key: "phrase", label: "JD phrase", width: "40%", emphasis: true },
// //                       { key: "signal", label: "Current signal", width: "44%" },
// //                       { key: "risk", label: "Risk level", width: "16%" },
// //                     ]}
// //                     rows={governanceSection.riskRows.map((row) => ({
// //                       ...row,
// //                       status: row.risk === "High" ? "gap" : row.risk === "Medium" ? "partial" : "strong",
// //                     }))}
// //                   />
// //                 </div>
// //               ) : null}
// //             </Card>
// //           ) : null}

// //           {keywordCoverageSection ? (
// //             <Card id="report-keywords" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Tools &amp; Keyword Coverage
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   Keyword matching matters because ATS systems and recruiters search for exact phrases from the job description.
// //                 </p>
// //               </div>

// //               <div className="mt-8 grid gap-5 md:grid-cols-2">
// //                 <div
// //                   className="rounded-[28px] border bg-white px-6 py-5"
// //                   style={{ borderColor: "#D8E5F0", boxShadow: "0 16px 36px rgba(16,36,90,0.04)" }}
// //                 >
// //                   <h3 className="text-[clamp(1.3rem,1.8vw,1.75rem)] font-black tracking-[-0.025em] text-[#1EAD4E]">
// //                     Matched Keywords
// //                   </h3>
// //                   <div className="mt-5 flex flex-wrap gap-3">
// //                     {keywordCoverageSection.matchedKeywords.map((item) => (
// //                       <span
// //                         key={item}
// //                         className="inline-flex rounded-full bg-[#1EAD4E] px-4 py-2 text-[12px] font-black uppercase tracking-[0.02em] text-white"
// //                       >
// //                         {item}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div
// //                   className="rounded-[28px] border bg-white px-6 py-5"
// //                   style={{ borderColor: "#D8E5F0", boxShadow: "0 16px 36px rgba(16,36,90,0.04)" }}
// //                 >
// //                   <h3 className="text-[clamp(1.3rem,1.8vw,1.75rem)] font-black tracking-[-0.025em] text-[#E52521]">
// //                     Missing / Weak Keywords
// //                   </h3>
// //                   <div className="mt-5 flex flex-wrap gap-3">
// //                     {keywordCoverageSection.missingWeak.map((item) => (
// //                       <span
// //                         key={`${item.term}-${item.tone}`}
// //                         className="inline-flex rounded-full px-4 py-2 text-[12px] font-black uppercase tracking-[0.02em] text-white"
// //                         style={{ backgroundColor: item.tone === "gap" ? "#E52521" : "#F5B800" }}
// //                       >
// //                         {item.term}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="mt-8 rounded-[28px] border border-[#CFE1F5] bg-[#EEF5FD] px-6 py-5">
// //                 <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-black tracking-[-0.02em] text-[#2583CF]">
// //                   Keyword rule for your ATS report tool
// //                 </h3>
// //                 <p className="mt-4 text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                   Separate keywords into four buckets: exact match, semantic match, present but weak, and missing. A strong ATS report should not just count terms; it should explain whether the resume actually proves the skill with evidence.
// //                 </p>
// //               </div>
// //             </Card>
// //           ) : null}

// //           {leadershipSection ? (
// //             <Card id="report-leadership" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Leadership &amp; Stakeholder Fit
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   The JD requires leadership, stakeholder alignment, and visible ownership of reporting or analytics delivery.
// //                 </p>
// //               </div>

// //               <div className="mt-8 grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-center">
// //                 <div className="flex justify-center lg:justify-start">
// //                   <div className="flex h-[176px] w-[176px] flex-col items-center justify-center rounded-full bg-[#1EAD4E] text-center text-white">
// //                     <p className="text-[28px] font-black tracking-[-0.04em]">
// //                       {leadershipSection.score}/100
// //                     </p>
// //                     <p className="mt-1 text-[12px] font-black uppercase tracking-[0.06em]">
// //                       Leader
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="space-y-3">
// //                   <h3 className="text-[clamp(1.55rem,2.15vw,2rem)] font-black tracking-[-0.035em] text-[#143552]">
// //                     {leadershipSection.performance}
// //                   </h3>
// //                   <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                     {leadershipSection.summary}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="mt-8 grid gap-5 md:grid-cols-2">
// //                 <div
// //                   className="rounded-[28px] border bg-white px-6 py-5"
// //                   style={{ borderColor: "#D8E5F0", boxShadow: "0 16px 36px rgba(16,36,90,0.04)" }}
// //                 >
// //                   <h3 className="text-[clamp(1.3rem,1.8vw,1.75rem)] font-black tracking-[-0.025em] text-[#1EAD4E]">
// //                     Evidence Found
// //                   </h3>
// //                   <div className="mt-5 space-y-2">
// //                     {leadershipSection.evidence.map((item) => (
// //                       <div key={item} className="flex items-start gap-3">
// //                         <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1EAD4E]" />
// //                         <p className="text-[15px] leading-7 text-slate-800">{item}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {leadershipSection.improvements.length ? (
// //                   <div
// //                     className="rounded-[28px] border bg-white px-6 py-5"
// //                     style={{ borderColor: "#D8E5F0", boxShadow: "0 16px 36px rgba(16,36,90,0.04)" }}
// //                   >
// //                     <h3 className="text-[clamp(1.3rem,1.8vw,1.75rem)] font-black tracking-[-0.025em] text-[#F39A06]">
// //                       Improve for JD Fit
// //                     </h3>
// //                     <div className="mt-5 space-y-2">
// //                       {leadershipSection.improvements.map((item) => (
// //                         <div key={item} className="flex items-start gap-3">
// //                           <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#F39A06]" />
// //                           <p className="text-[15px] leading-7 text-slate-800">{item}</p>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ) : null}
// //               </div>

// //               <div className="mt-8 rounded-[28px] border border-emerald-200 bg-emerald-50 px-6 py-5">
// //                 <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-black tracking-[-0.02em] text-[#1EAD4E]">
// //                   Leadership Verdict
// //                 </h3>
// //                 <p className="mt-4 text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                   {leadershipSection.verdict}
// //                 </p>
// //               </div>
// //             </Card>
// //           ) : null}

// //           {experienceEvidenceSection?.rows?.length ? (
// //             <Card id="report-experience-map" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.9rem,3vw,2.8rem)] font-black tracking-[-0.045em] text-[#143552]">
// //                   Experience Evidence Map
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   Where the strongest matching evidence appears in the candidate&apos;s career history.
// //                 </p>
// //               </div>

// //               <div className="mt-8">
// //                 <AnalysisTable
// //                   columns={[
// //                     { key: "role", label: "Role", width: "26%", emphasis: true },
// //                     { key: "evidence", label: "Best evidence for this JD", width: "58%" },
// //                     { key: "fit", label: "Fit", width: "16%" },
// //                   ]}
// //                   rows={experienceEvidenceSection.rows.map((row) => ({
// //                     ...row,
// //                     status:
// //                       row.fit === "High"
// //                         ? "strong"
// //                         : row.fit === "Medium"
// //                           ? "partial"
// //                           : "gap",
// //                   }))}
// //                 />
// //               </div>

// //               <div
// //                 className="mt-8 rounded-[28px] border bg-white px-6 py-5"
// //                 style={{
// //                   borderColor: "#D8E5F0",
// //                   boxShadow: "0 16px 36px rgba(16,36,90,0.04)",
// //                 }}
// //               >
// //                 <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-black tracking-[-0.02em] text-[#143552]">
// //                   Resume strategy
// //                 </h3>
// //                 <p className="mt-4 text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                   {experienceEvidenceSection.strategy}
// //                 </p>
// //               </div>
// //             </Card>
// //           ) : null}

// //           {riskFlagsSection?.length ? (
// //             <Card id="report-risk-flags" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Risk Flags &amp; Recruiter Questions
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   These are the likely objections a recruiter or selection committee may raise from the current resume.
// //                 </p>
// //               </div>

// //               <div className="mt-8">
// //                 <AnalysisTable
// //                   columns={[
// //                     { key: "flag", label: "Risk flag", width: "24%", emphasis: true },
// //                     { key: "severity", label: "Severity", width: "13%" },
// //                     { key: "why", label: "Why it matters", width: "31%" },
// //                     { key: "handle", label: "How to handle", width: "32%" },
// //                   ]}
// //                   rows={riskFlagsSection.map((row) => ({
// //                     ...row,
// //                     status: row.severity === "High" ? "gap" : "partial",
// //                   }))}
// //                 />
// //               </div>
// //             </Card>
// //           ) : null}

// //           {rewriteSection ? (
// //             <Card id="report-rewrites" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Resume Rewrite Recommendations
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   Use this as the output section in your ATS report tool: exact fixes with before and after direction.
// //                 </p>
// //               </div>

// //               {rewriteSection.summaryDraft ? (
// //                 <div className="mt-8 rounded-[28px] border border-[#B7D8FF] bg-[#EEF5FD] px-6 py-5">
// //                   <h3 className="text-[clamp(1.3rem,1.8vw,1.75rem)] font-black tracking-[-0.025em] text-[#2583CF]">
// //                     Targeted Professional Summary - Draft
// //                   </h3>
// //                   <p className="mt-4 text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                     {rewriteSection.summaryDraft}
// //                   </p>
// //                 </div>
// //               ) : null}

// //               {rewriteSection.bulletPairs.length ? (
// //                 <>
// //               <div className="mt-8 flex items-center gap-4">
// //                 <div
// //                   className="h-[52px] w-[52px] rounded-full border bg-white"
// //                   style={{ borderColor: "#D8E5F0" }}
// //                 />
// //                 <h3 className="text-[clamp(1.2rem,1.6vw,1.55rem)] font-black tracking-[-0.03em] text-[#143552]">
// //                   Bullet Upgrade Examples
// //                 </h3>
// //               </div>

// //               <div className="mt-5 space-y-4">
// //                 {rewriteSection.bulletPairs.map((pair) => (
// //                   <div key={pair.id} className="space-y-4">
// //                     <div className="rounded-[22px] border border-[#F6C58A] bg-[#FFF6EA] px-5 py-4">
// //                       <div className="flex items-start gap-4">
// //                         <span className="inline-flex min-w-[108px] justify-center rounded-full bg-[#F5B800] px-4 py-2 text-[12px] font-black uppercase tracking-[0.04em] text-white">
// //                           Before
// //                         </span>
// //                         <p className="text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                           {pair.before}
// //                         </p>
// //                       </div>
// //                     </div>

// //                     <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-5 py-4">
// //                       <div className="flex items-start gap-4">
// //                         <span className="inline-flex min-w-[108px] justify-center rounded-full bg-[#1EAD4E] px-4 py-2 text-[12px] font-black uppercase tracking-[0.04em] text-white">
// //                           After
// //                         </span>
// //                         <p className="text-[15px] leading-7 text-slate-800 md:text-[16px]">
// //                           {pair.after}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //                 </>
// //               ) : null}
// //             </Card>
// //           ) : null}

// //           {finalVerdictSection ? (
// //             <Card id="report-final-verdict" className="rounded-[34px] border border-shellstone/60 bg-white p-6 md:p-7">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.65rem,2.25vw,2.1rem)] font-black tracking-[-0.04em] text-[#143552]">
// //                   Final Verdict
// //                 </h2>
// //                 <p className="max-w-4xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   Recommended action plan for the candidate and the report-generation workflow.
// //                 </p>
// //               </div>

// //               <div
// //                 className="mt-8 rounded-[28px] border bg-white px-6 py-6"
// //                 style={{ borderColor: "#D8E5F0", boxShadow: "0 16px 36px rgba(16,36,90,0.04)" }}
// //               >
// //                 <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
// //                   <div className="flex flex-wrap justify-center gap-6 lg:justify-start">
// //                     <div className="flex h-[182px] w-[182px] flex-col items-center justify-center rounded-full bg-[#F5B800] text-center text-white">
// //                       <p className="text-[28px] font-black tracking-[-0.04em]">
// //                         {finalVerdictSection.currentScore}/100
// //                       </p>
// //                       <p className="mt-1 text-[12px] font-black uppercase tracking-[0.06em]">
// //                         Current
// //                       </p>
// //                     </div>

// //                     <div className="flex h-[182px] w-[182px] flex-col items-center justify-center rounded-full bg-[#F5B800] text-center text-white">
// //                       <p className="text-[28px] font-black tracking-[-0.04em]">
// //                         {finalVerdictSection.potentialScore}/100
// //                       </p>
// //                       <p className="mt-1 text-[12px] font-black uppercase tracking-[0.06em]">
// //                         Potential
// //                       </p>
// //                     </div>
// //                   </div>

// //                   <div className="space-y-4">
// //                     <h3 className="text-[clamp(1.6rem,2.2vw,2.2rem)] font-black tracking-[-0.035em] text-[#143552]">
// //                       {finalVerdictSection.verdictTitle}
// //                     </h3>
// //                     <p className="max-w-3xl text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                       {finalVerdictSection.verdictBody}
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="mt-8 flex items-center gap-4">
// //                 <div
// //                   className="h-[52px] w-[52px] rounded-full border bg-white"
// //                   style={{ borderColor: "#D8E5F0" }}
// //                 />
// //                 <h3 className="text-[clamp(1.2rem,1.6vw,1.55rem)] font-black tracking-[-0.03em] text-[#143552]">
// //                   Priority Action Plan
// //                 </h3>
// //               </div>

// //               <div className="mt-6">
// //                 <AnalysisTable
// //                   columns={[
// //                     { key: "priority", label: "Priority", width: "12%", emphasis: true },
// //                     { key: "action", label: "Action", width: "70%" },
// //                     { key: "impact", label: "Expected impact", width: "18%" },
// //                   ]}
// //                   rows={finalVerdictSection.actionRows}
// //                 />
// //               </div>

// //               <div
// //                 className="mt-8 rounded-[28px] border bg-white px-6 py-5"
// //                 style={{
// //                   borderColor: "#D8E5F0",
// //                   boxShadow: "0 16px 36px rgba(16,36,90,0.04)",
// //                 }}
// //               >
// //                 <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-black tracking-[-0.02em] text-[#143552]">
// //                   Disclaimer
// //                 </h3>
// //                 <p className="mt-4 text-[15px] leading-7 text-[#667999] md:text-[16px]">
// //                   {finalVerdictSection.disclaimer}
// //                 </p>
// //               </div>
// //             </Card>
// //           ) : null}

// //           <div id="report-visuals">
// //           <Card className="rounded-3xl border border-shellstone/60 bg-white p-4">
// //             <div className="flex flex-wrap items-start justify-between gap-3">
// //               <div className="space-y-1">
// //                 <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
// //                   Visual Report
// //                 </p>
// //                 <h2 className="text-[clamp(1.45rem,1.8vw,1.7rem)] font-black tracking-[-0.03em] text-royalblue">
// //                   Professional ATS Analytics
// //                 </h2>
// //                 <p className="text-sm leading-6 text-slate-600">
// //                   These visuals turn the ATS analysis into an executive-style report that is
// //                   easier to review with candidates, recruiters, or clients.
// //                 </p>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={() => setIsVisualReportMinimized((value) => !value)}
// //                 className="inline-flex items-center rounded-full border border-shellstone/70 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
// //               >
// //                 {isVisualReportMinimized ? (
// //                   <>
// //                     <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
// //                     Expand visuals
// //                   </>
// //                 ) : (
// //                   <>
// //                     <ChevronUp className="mr-1.5 h-3.5 w-3.5" />
// //                     Minimize visuals
// //                   </>
// //                 )}
// //               </button>
// //             </div>

// //             {!isVisualReportMinimized ? (
// //               <div className="mt-4 grid gap-4 xl:grid-cols-2">
// //               <div className="rounded-3xl border border-shellstone/60 bg-slate-50 p-4">
// //                 <p className="text-sm font-black text-royalblue">
// //                   Overall ATS Compatibility Score
// //                 </p>
// //                 <p className="mt-1 text-xs leading-5 text-slate-500">
// //                   A traffic-light health indicator for the overall ATS readiness of the
// //                   resume.
// //                 </p>
// //                 <div className="mt-3 flex justify-center">
// //                   <GaugeChart score={report.overall_score} />
// //                 </div>
// //               </div>

// //               <div className="rounded-3xl border border-shellstone/60 bg-slate-50 p-4">
// //                 <p className="text-sm font-black text-royalblue">
// //                   Category Performance Breakdown
// //                 </p>
// //                 <p className="mt-1 text-xs leading-5 text-slate-500">
// //                   The radar chart shows where the ATS profile is strong and where the
// //                   report still has visible dents.
// //                 </p>
// //                 <div className="mt-2 flex justify-center">
// //                   <RadarChart items={radarItems} />
// //                 </div>
// //               </div>

// //               <div className="rounded-3xl border border-shellstone/60 bg-slate-50 p-4">
// //                 <p className="text-sm font-black text-royalblue">
// //                   Impact vs. Duty-Driven Language
// //                 </p>
// //                 <p className="mt-1 text-xs leading-5 text-slate-500">
// //                   This compares proactive achievement language against passive task-based
// //                   phrasing.
// //                 </p>
// //                 <div className="mt-3">
// //                   <DoughnutChart
// //                     items={impactLanguageChart.items}
// //                     centerLabel="Language"
// //                     centerValue={`${impactLanguageChart.strongCount}/${impactLanguageChart.weakCount}`}
// //                   />
// //                 </div>
// //               </div>

// //               <div className="rounded-3xl border border-shellstone/60 bg-slate-50 p-4">
// //                 <p className="text-sm font-black text-royalblue">
// //                   Career Progression & Tenure
// //                 </p>
// //                 <p className="mt-1 text-xs leading-5 text-slate-500">
// //                   A timeline view of the work history extracted from the resume for tenure
// //                   and progression review.
// //                 </p>
// //                 <div className="mt-4">
// //                   <TimelineChart items={tenureTimeline} />
// //                 </div>
// //               </div>

// //               <div className="rounded-3xl border border-shellstone/60 bg-slate-50 p-4">
// //                 <p className="text-sm font-black text-royalblue">
// //                   Keyword & Skill Prominence
// //                 </p>
// //                 <p className="mt-1 text-xs leading-5 text-slate-500">
// //                   A ranked view of the most repeated resume terms so users can quickly see
// //                   what themes dominate the document today.
// //                 </p>
// //                 <div className="mt-4">
// //                   <KeywordProminenceChart items={keywordCloudItems} />
// //                 </div>
// //               </div>

// //               <div className="rounded-3xl border border-shellstone/60 bg-slate-50 p-4">
// //                 <p className="text-sm font-black text-royalblue">
// //                   Hard Skills vs. Soft Skills Ratio
// //                 </p>
// //                 <p className="mt-1 text-xs leading-5 text-slate-500">
// //                   This stacked view helps show whether the resume is weighted more toward
// //                   technical proof, tools, or softer competency language.
// //                 </p>
// //                 <div className="mt-5">
// //                   <StackedBarChart items={skillMixChart} />
// //                 </div>
// //               </div>
// //               </div>
// //             ) : null}
// //           </Card>
// //           </div>

// //           {report.quick_scan_sections?.length ? (
// //             <div id="report-quick-scan">
// //             <Card className="rounded-3xl border border-shellstone/60 bg-white p-4">
// //               <div className="flex flex-wrap items-start justify-between gap-3">
// //                 <div className="space-y-1">
// //                   <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
// //                     AI First Scan
// //                   </p>
// //                   <h2 className="text-[clamp(1.45rem,1.8vw,1.7rem)] font-black tracking-[-0.03em] text-royalblue">
// //                     Basic ATS Pointers From Your Upload
// //                   </h2>
// //                   <p className="max-w-4xl text-sm leading-6 text-slate-600">
// //                     These are the quick recruiter-style observations generated at upload
// //                     time before the user digs into the full 50-point analysis.
// //                   </p>
// //                 </div>
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsQuickScanMinimized((value) => !value)}
// //                   className="inline-flex items-center rounded-full border border-shellstone/70 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
// //                 >
// //                   {isQuickScanMinimized ? (
// //                     <>
// //                       <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
// //                       Expand pointers
// //                     </>
// //                   ) : (
// //                     <>
// //                       <ChevronUp className="mr-1.5 h-3.5 w-3.5" />
// //                       Minimize pointers
// //                     </>
// //                   )}
// //                 </button>
// //               </div>

// //               {!isQuickScanMinimized ? (
// //                 <div className="mt-4 grid gap-3 md:grid-cols-2">
// //                   {report.quick_scan_sections.map((section) => (
// //                     <div
// //                       key={section.title}
// //                       className="rounded-2xl border border-shellstone/60 bg-slate-50 p-4"
// //                     >
// //                       <h3 className="text-sm font-black text-royalblue">
// //                         {section.title}
// //                       </h3>
// //                       <div className="mt-3 space-y-2">
// //                         {section.items?.length ? (
// //                           section.items.map((item) => (
// //                             <div
// //                               key={`${section.title}-${item}`}
// //                               className="rounded-2xl border border-white/70 bg-white px-3 py-2 text-sm leading-6 text-slate-700"
// //                             >
// //                               {item}
// //                             </div>
// //                           ))
// //                         ) : (
// //                           <p className="text-sm text-slate-500">
// //                             No quick pointers were generated for this section.
// //                           </p>
// //                         )}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               ) : null}
// //             </Card>
// //             </div>
// //           ) : null}

// //           {groupedAnalysisSections.length ? (
// //             <div id="report-detailed" className="space-y-4">
// //               {groupedAnalysisSections.map(([group, sections]) => (
// //                 <Card key={group} className="rounded-3xl border border-shellstone/60 bg-white p-4">
// //                   <div className="flex flex-wrap items-start justify-between gap-3">
// //                     <div className="space-y-1">
// //                       <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
// //                         Detailed Analysis
// //                       </p>
// //                       <h2 className="text-[clamp(1.45rem,1.8vw,1.7rem)] font-black tracking-[-0.03em] text-royalblue">
// //                         {group}
// //                       </h2>
// //                     </div>
// //                     <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
// //                       {sections.reduce((count, section) => count + (section.issue_count || 0), 0)} total issues
// //                     </span>
// //                   </div>
// //                   <div className="mt-4 grid gap-4">
// //                     {sections.map((section) => (
// //                       <ReportSectionCard
// //                         key={section.id}
// //                         section={section}
// //                       />
// //                     ))}
// //                   </div>
// //                 </Card>
// //               ))}
// //             </div>
// //           ) : null}

// //           <div id="report-appendix" className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
// //             <Card className="rounded-3xl border border-shellstone/60 bg-white p-4">
// //               <div className="flex items-center gap-2">
// //                 <BarChart3 className="h-4 w-4 text-royalblue" />
// //                 <h2 className="text-base font-black text-royalblue">
// //                   Analysis Snapshot
// //                 </h2>
// //               </div>
// //               <div className="mt-4 grid gap-4 md:grid-cols-2">
// //                 <div className="space-y-3">
// //                   <StatusBar
// //                     label="Passed checks"
// //                     value={statusMetrics.passedPercent}
// //                     tone="green"
// //                   />
// //                   <StatusBar
// //                     label="Needs improvement"
// //                     value={statusMetrics.needsPercent}
// //                     tone="amber"
// //                   />
// //                   <StatusBar
// //                     label="Critical fixes"
// //                     value={statusMetrics.criticalPercent}
// //                     tone="rose"
// //                   />
// //                 </div>
// //                 <div className="space-y-3">
// //                   {report.category_scores.slice(0, 5).map((category) => (
// //                     <StatusBar
// //                       key={category.category}
// //                       label={category.category}
// //                       value={category.score}
// //                       tone={
// //                         category.score >= 80
// //                           ? "green"
// //                           : category.score >= 60
// //                             ? "amber"
// //                             : "rose"
// //                       }
// //                     />
// //                   ))}
// //                 </div>
// //               </div>
// //             </Card>

// //             <Card className="rounded-3xl border border-shellstone/60 bg-white p-4">
// //               <div className="flex items-center gap-2">
// //                 <Search className="h-4 w-4 text-royalblue" />
// //                 <h2 className="text-base font-black text-royalblue">
// //                   Keyword Signals
// //                 </h2>
// //               </div>
// //               <p className="mt-2 text-xs leading-5 text-slate-500">
// //                 These recurring terms appear across lower-scoring findings and are good
// //                 candidates to verify in the resume content.
// //               </p>
// //               <div className="mt-4 flex flex-wrap gap-2">
// //                 {keywordChips.length ? (
// //                   keywordChips.map(([keyword, count]) => (
// //                     <button
// //                       key={keyword}
// //                       type="button"
// //                       onClick={() => {
// //                         const match = resumeLines.find((line) =>
// //                           `${line.section_name} ${line.text}`
// //                             .toLowerCase()
// //                             .includes(keyword.toLowerCase())
// //                         );
// //                         if (match) {
// //                           focusResumeArea(match);
// //                         }
// //                       }}
// //                       className="rounded-full border border-shellstone/60 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-royalblue hover:text-royalblue"
// //                     >
// //                       {keyword} · {count}
// //                     </button>
// //                   ))
// //                 ) : (
// //                   <p className="text-sm text-slate-600">
// //                     No strong keyword clusters were detected in the current report.
// //                   </p>
// //                 )}
// //               </div>
// //             </Card>
// //           </div>

// //           <Card className="rounded-3xl border border-shellstone/60 bg-white p-4">
// //             <div className="flex flex-wrap items-start justify-between gap-3">
// //               <div className="space-y-1">
// //                 <h2 className="text-[clamp(1.45rem,1.8vw,1.7rem)] font-black tracking-[-0.03em] text-royalblue">
// //                   50 Pointer Analysis
// //                 </h2>
// //                 <p className="text-sm leading-6 text-slate-600">
// //                   Review the ATS findings by category. Repeated line-level issues are merged
// //                   into one smarter recommendation, with notes on which other checks improve
// //                   alongside it.
// //                 </p>
// //               </div>
// //               <div className="min-w-[240px]">
// //                 <label
// //                   htmlFor="analysis-category-slicer"
// //                   className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500"
// //                 >
// //                   Review Category
// //                 </label>
// //                 <select
// //                   id="analysis-category-slicer"
// //                   value={selectedCategory}
// //                   onChange={(event) => setSelectedCategory(event.target.value)}
// //                   className="mt-1 w-full rounded-2xl border border-shellstone/80 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-royalblue"
// //                 >
// //                   {categoryOptions.map((category) => (
// //                     <option key={category} value={category}>
// //                       {category}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>
// //             <div className="mt-3 flex flex-wrap items-center gap-2">
// //               <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
// //                 Showing {visiblePointCount} actionable review items
// //               </span>
// //               <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
// //                 Based on all 50 ATS checks
// //               </span>
// //             </div>
// //           </Card>

// //           <div className="space-y-4">
// //             {filteredGroupedPoints.map(([category, points]) => (
// //               <Card
// //                 key={category}
// //                 className="rounded-3xl border border-shellstone/60 bg-white p-4"
// //               >
// //                 <div className="flex flex-wrap items-center justify-between gap-3">
// //                   <h2 className="text-lg font-black text-royalblue">{category}</h2>
// //                   <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
// //                     {points.length} checks
// //                   </span>
// //                 </div>
// //                 <div className="mt-4 space-y-3">
// //                   {points.map((point) => {
// //                     const evidenceLines = evidenceByPoint.get(point.pointer_id) || [];
// //                     const primaryLine = evidenceLines[0];

// //                     return (
// //                       <div
// //                         key={point.pointer_id}
// //                         className="rounded-2xl border border-shellstone/60 bg-slate-50 p-4"
// //                       >
// //                         <div className="flex flex-wrap items-start justify-between gap-3">
// //                           <div className="min-w-0 space-y-1">
// //                             <p className="text-sm font-black text-royalblue">
// //                               {point.pointer_id}. {point.title}
// //                             </p>
// //                             <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
// //                               {point.current_status} · Score {point.score} · Severity{" "}
// //                               {point.severity}
// //                             </p>
// //                           </div>
// //                           {primaryLine ? (
// //                             <button
// //                               type="button"
// //                               onClick={() => focusResumeArea(primaryLine)}
// //                               className="rounded-full border border-royalblue/20 bg-royalblue/10 px-3 py-1 text-[11px] font-semibold text-royalblue transition hover:bg-royalblue/15"
// //                             >
// //                               Highlight in Preview
// //                             </button>
// //                           ) : null}
// //                         </div>

// //                         <p className="mt-3 text-sm leading-6 text-slate-700">
// //                           {point.explanation}
// //                         </p>
// //                         <p className="mt-3 text-sm font-semibold text-slate-900">
// //                           Recommendation:{" "}
// //                           <span className="font-normal text-slate-700">
// //                             {point.improvement_suggestion}
// //                           </span>
// //                         </p>

// //                         {point.related_titles?.length ? (
// //                           <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm text-slate-700">
// //                             <span className="font-semibold text-amber-800">
// //                               Also improves:
// //                             </span>{" "}
// //                             {point.related_titles.join(", ")}
// //                             {point.related_categories?.length ? (
// //                               <span className="text-slate-600">
// //                                 {" "}
// //                                 across {point.related_categories.join(", ")}.
// //                               </span>
// //                             ) : (
// //                               "."
// //                             )}
// //                           </div>
// //                         ) : null}

// //                         {evidenceLines.length ? (
// //                           <div className="mt-4 space-y-2 rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
// //                             <div className="flex items-center gap-2">
// //                               <Target className="h-4 w-4 text-royalblue" />
// //                               <p className="text-xs font-bold uppercase tracking-[0.16em] text-royalblue">
// //                                 Resume lines to review
// //                               </p>
// //                             </div>
// //                             {evidenceLines.map((line) => (
// //                               <div
// //                                 key={line.segment_id}
// //                                 className="rounded-xl border border-blue-100 bg-white p-3"
// //                               >
// //                                 <div className="flex flex-wrap items-start justify-between gap-2">
// //                                   <button
// //                                     type="button"
// //                                     onClick={() => focusResumeArea(line)}
// //                                     className="min-w-0 flex-1 text-left"
// //                                   >
// //                                     <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
// //                                       {line.section_name}
// //                                       {line.isFullArea ? " · Area to expand" : " · Specific line"}
// //                                     </p>
// //                                     <p className="mt-1 text-sm leading-5 text-slate-700">
// //                                       {line.text}
// //                                     </p>
// //                                   </button>
// //                                   <Button
// //                                     variant="outline"
// //                                     className="rounded-xl px-3 py-1.5 text-[11px]"
// //                                     onClick={() => analyzeEvidenceLine(line)}
// //                                   >
// //                                     <Sparkles className="mr-1.5 h-3.5 w-3.5" />
// //                                     {aiLineInsights[line.segment_id]?.status === "loading"
// //                                       ? "Analyzing..."
// //                                       : "Analyze with AI"}
// //                                   </Button>
// //                                 </div>

// //                                 {line.full_text && line.full_text !== line.text ? (
// //                                   <p className="mt-2 text-[11px] leading-5 text-slate-500">
// //                                     Parent area: {line.full_text}
// //                                   </p>
// //                                 ) : null}

// //                                 {aiLineInsights[line.segment_id]?.error ? (
// //                                   <div className="mt-3">
// //                                     <Toast
// //                                       message={aiLineInsights[line.segment_id].error}
// //                                       variant="error"
// //                                     />
// //                                   </div>
// //                                 ) : null}

// //                                 {aiLineInsights[line.segment_id]?.data ? (
// //                                   <div className="mt-3 rounded-2xl border border-violet-100 bg-violet-50 p-3 text-sm text-slate-700">
// //                                     <p className="font-semibold text-violet-800">
// //                                       AI findings
// //                                     </p>
// //                                     {aiLineInsights[line.segment_id].data.issues?.length ? (
// //                                       <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px]">
// //                                         {aiLineInsights[line.segment_id].data.issues.map((issue) => (
// //                                           <li key={issue}>{issue}</li>
// //                                         ))}
// //                                       </ul>
// //                                     ) : null}
// //                                     <p className="mt-3 text-[13px] leading-5">
// //                                       <span className="font-semibold text-slate-900">
// //                                         Suggested improvement:
// //                                       </span>{" "}
// //                                       {aiLineInsights[line.segment_id].data.suggested_line}
// //                                     </p>
// //                                     <p className="mt-2 text-[12px] leading-5 text-slate-600">
// //                                       {aiLineInsights[line.segment_id].data.reason}
// //                                     </p>
// //                                   </div>
// //                                 ) : null}
// //                               </div>
// //                             ))}
// //                           </div>
// //                         ) : (
// //                           <p className="mt-3 text-xs text-slate-500">
// //                             Affected area: {point.affected_resume_area}
// //                           </p>
// //                         )}

// //                         {point.recommended_rewrite ? (
// //                           <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-slate-700">
// //                             <span className="font-semibold text-emerald-700">
// //                               Suggested rewrite:
// //                             </span>{" "}
// //                             {point.recommended_rewrite}
// //                           </div>
// //                         ) : null}
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </Card>
// //             ))}
// //             {!filteredGroupedPoints.length ? (
// //               <Card className="rounded-3xl border border-shellstone/60 bg-white p-6">
// //                 <p className="text-sm text-slate-600">
// //                   No analysis items are available for this category selection yet.
// //                 </p>
// //               </Card>
// //             ) : null}
// //           </div>
// //         </div>
// //       </div>

// //       <Modal title="Report PDF Preview" open={isReportPreviewOpen}>
// //         <div className="space-y-4">
// //           <p className="text-sm leading-6 text-slate-600">
// //             Review the final ATS report before downloading the PDF.
// //           </p>
// //           {reportPreviewStatus === "loading" ? (
// //             <Loader label="Preparing report preview..." />
// //           ) : null}
// //           {reportPreviewStatus === "error" ? (
// //             <Toast message={reportPreviewError} variant="error" />
// //           ) : null}
// //           {reportPreviewStatus === "success" && currentReportPreviewPage ? (
// //             <div className="space-y-3">
// //               <div className="flex items-center justify-between rounded-2xl border border-shellstone/70 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
// //                 <button
// //                   type="button"
// //                   onClick={() => setReportPreviewPageIndex((index) => Math.max(index - 1, 0))}
// //                   disabled={reportPreviewPageIndex === 0}
// //                   className="rounded-full border border-shellstone/70 px-3 py-1 transition hover:bg-white disabled:opacity-40"
// //                 >
// //                   Previous
// //                 </button>
// //                 <span>
// //                   Page {reportPreviewPageIndex + 1} of {reportPreviewPages.length}
// //                 </span>
// //                 <button
// //                   type="button"
// //                   onClick={() =>
// //                     setReportPreviewPageIndex((index) =>
// //                       Math.min(index + 1, reportPreviewPages.length - 1)
// //                     )
// //                   }
// //                   disabled={reportPreviewPageIndex >= reportPreviewPages.length - 1}
// //                   className="rounded-full border border-shellstone/70 px-3 py-1 transition hover:bg-white disabled:opacity-40"
// //                 >
// //                   Next
// //                 </button>
// //               </div>
// //               <div className="flex justify-center overflow-auto rounded-2xl border border-shellstone/70 bg-slate-100 p-3">
// //                 <img
// //                   src={`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}${currentReportPreviewPage.image_url}`}
// //                   alt={`Report preview page ${currentReportPreviewPage.page_number}`}
// //                   className="h-[72vh] w-auto rounded-sm bg-white shadow-md"
// //                 />
// //               </div>
// //             </div>
// //           ) : null}
// //           <div className="flex flex-wrap justify-end gap-2">
// //             <Button
// //               variant="ghost"
// //               className="rounded-xl px-3 py-2 text-xs"
// //               onClick={() => {
// //                 setIsReportPreviewOpen(false);
// //                 setReportPreviewStatus("idle");
// //               }}
// //             >
// //               Close
// //             </Button>
// //             <Button
// //               variant="outline"
// //               className="rounded-xl px-3 py-2 text-xs"
// //               onClick={handleDownloadPdf}
// //             >
// //               <Download className="mr-2 h-4 w-4" />
// //               Download PDF
// //             </Button>
// //           </div>
// //         </div>
// //       </Modal>

// //       {isResumeViewerOpen ? (
// //         <div className="fixed inset-0 z-50 bg-slate-950/45 p-4">
// //           <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col overflow-hidden rounded-[32px] border border-shellstone/60 bg-white shadow-[0_25px_80px_rgba(7,24,47,0.28)]">
// //             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
// //               <div className="min-w-0">
// //                 <h2 className="text-lg font-black text-royalblue">Resume Viewer</h2>
// //                 <p className="text-sm text-slate-500">
// //                   View the ATS-friendly resume or the original uploaded file without leaving the report.
// //                 </p>
// //               </div>
// //               <div className="flex flex-wrap items-center gap-2">
// //                 <div className="flex rounded-full bg-slate-100 p-1">
// //                   <button
// //                     type="button"
// //                     onClick={() => setPreviewMode("ats")}
// //                     className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
// //                       previewMode === "ats"
// //                         ? "bg-white text-royalblue shadow-sm"
// //                         : "text-slate-600 hover:text-slate-900"
// //                     }`}
// //                   >
// //                     ATS Resume
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={() => setPreviewMode("original")}
// //                     className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
// //                       previewMode === "original"
// //                         ? "bg-white text-royalblue shadow-sm"
// //                         : "text-slate-600 hover:text-slate-900"
// //                     }`}
// //                   >
// //                     Uploaded Original
// //                   </button>
// //                 </div>
// //                 {(highlightedLineId || originalSearchTerm) ? (
// //                   <button
// //                     type="button"
// //                     onClick={clearPreviewFocus}
// //                     className="rounded-full border border-shellstone/60 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50"
// //                   >
// //                     Clear highlight
// //                   </button>
// //                 ) : null}
// //                 <Button
// //                   type="button"
// //                   variant="outline"
// //                   onClick={() => setIsResumeViewerOpen(false)}
// //                   className="rounded-full px-4 py-2 text-xs font-black"
// //                 >
// //                   Close
// //                 </Button>
// //               </div>
// //             </div>

// //             {previewMode === "original" ? (
// //               <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
// //                 <div className="flex flex-col gap-2 md:flex-row md:items-center">
// //                   <div className="min-w-0 flex-1">
// //                     <label
// //                       htmlFor="original-preview-search"
// //                       className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500"
// //                     >
// //                       Search inside original upload
// //                     </label>
// //                     <input
// //                       id="original-preview-search"
// //                       type="text"
// //                       value={originalSearchInput}
// //                       onChange={(event) => setOriginalSearchInput(event.target.value)}
// //                       onKeyDown={(event) => {
// //                         if (event.key === "Enter") {
// //                           applyOriginalSearch();
// //                         }
// //                       }}
// //                       placeholder="Find a line, keyword, or phrase from the uploaded document"
// //                       className="mt-1 w-full rounded-2xl border border-shellstone/80 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-royalblue"
// //                     />
// //                   </div>
// //                   <div className="flex items-center gap-2">
// //                     <Button
// //                       variant="outline"
// //                       className="rounded-xl px-3 py-2 text-xs"
// //                       onClick={applyOriginalSearch}
// //                     >
// //                       <Search className="mr-1.5 h-3.5 w-3.5" />
// //                       Find in Original
// //                     </Button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ) : null}

// //             <div className="min-h-0 flex-1 overflow-auto bg-slate-200 px-3 py-3">
// //               {previewMode === "ats" ? (
// //                 <div className="min-h-full">
// //                   <Ats resume={resume} />
// //                 </div>
// //               ) : (
// //                 <div className="flex justify-center">
// //                   <iframe
// //                     key={originalPreviewUrl}
// //                     src={originalPreviewUrl}
// //                     title="Original uploaded resume preview"
// //                     className="aspect-[210/297] h-[calc(100vh-180px)] min-h-[720px] w-full max-w-[820px] rounded-sm bg-white shadow-md"
// //                   />
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       ) : null}
// //     </div>
// //   );
// // }

// // export default ATSReportPage;


import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  { id: "report-at-glance", label: "At a Glance Dashboard" },
  { id: "report-jd-matrix", label: "Requirement Checker" },
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
    return { label: "High", tone: "high", color: "#1EAD4E" };
  }
  if (score >= 60) {
    return { label: "Med", tone: "med", color: "#F5B800" };
  }
  return { label: "Low", tone: "low", color: "#E52521" };
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
      stroke: "#1EAD4E",
      fill: "#f0fdf4",
      text: "#166534",
    };
  }
  if (score >= 41) {
    return {
      label: "Needs improvement",
      stroke: "#F5B800",
      fill: "#fffbeb",
      text: "#92400e",
    };
  }
  return {
    label: "High risk",
    stroke: "#E52521",
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
        <text x="90" y="84" textAnchor="middle" className="fill-[#0B2146] text-[10px] font-bold uppercase tracking-wider">
          ATS Score
        </text>
        <text x="90" y="106" textAnchor="middle" className="fill-[#0B2146] text-[26px] font-black">
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
      <polygon points={polygonPoints} fill="rgba(11,33,70,0.08)" stroke="#0B2146" strokeWidth="2.5" />
      {items.map((item, index) => {
        const point = pointFor(index, item.score);
        return <circle key={`${item.category}-point`} cx={point.x} cy={point.y} r="3.5" fill="#0B2146" />;
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
        <text x="90" y="104" textAnchor="middle" className="fill-[#0B2146] text-[18px] font-black">
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
                className="absolute top-0 h-2.5 rounded-full bg-[#0B2146]"
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
              <p className="truncate text-xs font-black text-[#0B2146]">
                {item.word}
              </p>
              <span className="shrink-0 rounded bg-slate-100 px-1 py-0.5 text-[9px] font-bold text-slate-500">
                {percent}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0B2146]"
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
            <span className="font-black text-[#0B2146] ml-2">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ label, value, tone }) {
  const toneMap = {
    blue: "from-[#0B2146] to-[#2583CF]",
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
                      <span className={column.emphasis ? "font-black text-[#0B2146]" : "font-medium text-slate-600"}>
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
      title: "text-[#0B2146]",
    },
    rose: {
      badge: "bg-rose-600 text-white",
      title: "text-[#0B2146]",
    },
    amber: {
      badge: "bg-amber-500 text-[#0B2146]",
      title: "text-[#0B2146]",
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
                <td className="px-4 py-3.5 font-black text-[#0B2146]">{item.requirement}</td>
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
          <p className="text-xs font-black text-[#0B2146]">{item.question}</p>
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
          <h3 className="text-lg font-black tracking-tight text-[#0B2146]">{section.title}</h3>
          <p className="text-xs leading-relaxed text-slate-500 max-w-2xl">{section.summary}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {typeof section.score === "number" ? (
            <span className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-black text-[#0B2146]">
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
                <p className="text-xs font-black text-[#0B2146]">{finding.title}</p>
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

function ATSReportPage() {
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
  const [aiLineInsights, setAiLineInsights] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isQuickScanMinimized, setIsQuickScanMinimized] = useState(false);
  const [isVisualReportMinimized, setIsVisualReportMinimized] = useState(false);
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
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
          color: "#0B2146",
        },
        {
          label: "Duty-driven",
          value: Math.round((weakCount / total) * 100),
          color: "#F5B800",
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
      { label: "Technical / Hard Skills", value: hardSkills, color: "#0B2146" },
      { label: "Soft Skills", value: softSkills, color: "#f59e0b" },
      { label: "Tools / Software", value: tools, color: "#1EAD4E" },
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

  const handleDownloadPdf = () => {
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

  const openReportPreview = () => {
    if (!report) {
      return;
    }
    setIsReportPreviewOpen(true);
  };

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <Loader label="Loading ATS analysis report..." />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
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
      <div className="min-h-screen bg-white px-4 py-5">
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
      className={`min-h-screen font-sans text-slate-900 tracking-tight antialiased ${
        isPdfPrintMode ? "bg-white" : "bg-[#FAF7F2]"
      }`}
    >
      <div
        className={`mx-auto space-y-6 ${
          isPdfPrintMode
            ? "max-w-[980px] px-4 py-5 sm:px-5"
            : "max-w-[1540px] px-4 py-6"
        }`}
      >
        {!isChromeHidden ? (
        <div className="rounded-3xl bg-[#0B2146] p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">CareerSense Workspace</span>
            <h1 className="text-2xl font-black tracking-tight">{candidateName} Evaluation Report</h1>
            <p className="text-xs text-slate-300 max-w-xl">Fully detailed analysis checking keywords, formatting parsing bugs, and recruiter readiness.</p>
          </div>
          <div className="flex flex-col items-center gap-3 md:items-end">
            {finalVerdictSection ? (
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
                <div className="min-w-[128px] rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center shadow-sm backdrop-blur-sm">
                  <p className="text-2xl font-black leading-none text-amber-400">{finalVerdictSection.currentScore}%</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">Current</p>
                </div>
                <div className="min-w-[128px] rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center shadow-sm backdrop-blur-sm">
                  <p className="text-2xl font-black leading-none text-emerald-400">{finalVerdictSection.potentialScore}%</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">Potential</p>
                </div>
              </div>
            ) : null}
          <div className="flex flex-wrap justify-center items-center gap-2.5">
            <Button
              variant={report.saved_report_id ? "outline" : "primary"}
              onClick={handleSave}
              disabled={Boolean(report.saved_report_id) || saveStatus === "loading"}
              className="rounded-xl border-slate-700 bg-slate-800/40 text-xs font-black text-white hover:bg-slate-800 transition px-4 py-2.5"
              style={
                report.saved_report_id
                  ? {
                      borderColor: "rgba(255,255,255,0.2)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "#FFFFFF",
                    }
                  : undefined
              }
            >
              <FolderOpen className="mr-2 h-3.5 w-3.5" />
              {report.saved_report_id
                ? "Saved"
                : saveStatus === "loading"
                  ? "Saving..."
                  : "Save to Repo"}
            </Button>
            <Button
              variant="outline"
              onClick={openReportPreview}
              className="rounded-xl border-slate-700 bg-slate-800/40 text-xs font-black text-white hover:bg-slate-800 transition px-4 py-2.5"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "#FFFFFF",
              }}
            >
              Preview PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
              className="rounded-xl border-slate-700 bg-slate-800/40 text-xs font-black text-white hover:bg-slate-800 transition px-4 py-2.5"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "#FFFFFF",
              }}
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              Download PDF
            </Button>
            <Link to="/check-ats">
              <Button
                variant="outline"
                className="rounded-xl border-amber-300 bg-amber-400 text-[#0B2146] text-xs font-black hover:bg-amber-300 transition px-4 py-2.5 shadow-md"
                style={{
                  border: "1px solid rgba(251,191,36,0.45)",
                  backgroundColor: "#FBBF24",
                  color: "#0B2146",
                }}
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                New Scan
              </Button>
            </Link>
          </div>
          </div>
        </div>
        ) : null}

        <div
          className={`grid gap-6 ${
            isChromeHidden ? "" : "xl:grid-cols-[280px_minmax(0,1fr)]"
          }`}
        >
          {/* Enhanced Sidebar Navigation Component */}
          {!isChromeHidden ? (
          <aside className="hidden xl:block min-w-0">
            <div className="xl:sticky xl:top-6 space-y-4">
              <Card
                className={`rounded-3xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-300 ${
                  isSidebarMinimized ? "xl:w-[86px]" : ""
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                  {!isSidebarMinimized ? (
                    <div className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#0B2146]">
                      Report Chapters
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
                      className={`flex items-center rounded-xl p-2 text-xs font-bold transition hover:bg-slate-50 text-slate-600 hover:text-[#0B2146] ${
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
                    title="View Resume"
                  >
                    <Eye className={`${isSidebarMinimized ? "" : "mr-2 "}h-3.5 w-3.5`} />
                    {!isSidebarMinimized ? "View Resume" : null}
                  </Button>
                </div>
              </Card>
            </div>
          </aside>
          ) : null}

          {/* Main Main-flow Grid Container Blocks */}
          <div className="min-w-0 space-y-6">
            
            {/* Core Overview Summary Panel */}
            <ReportSectionShell
              id="report-overview"
              eyebrow="Verification Core Context"
              title={`${candidateName} Summary Blueprint`}
              description={report.summary}
            >
              <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] bg-white rounded-2xl p-4 border border-slate-200">
                <div className="min-w-0 space-y-2">
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B2146]">
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
              <Card id="report-at-glance" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-6">
                  <h2 className="text-xl font-black text-[#0B2146]">At a Glance Dashboard</h2>
                  <p className="text-xs text-slate-500 font-medium">A unified structural layout mapping hiring readiness scores.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] items-center bg-slate-50/60 p-5 rounded-2xl border border-slate-150">
                  <div className="flex justify-center">
                    <div className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full bg-amber-400 text-center text-[#0B2146] shadow-md border-4 border-white">
                      <p className="text-2xl font-black">
                        {report.executive_summary.jd_match_score ?? report.executive_summary.overall_readiness_score}/100
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-wider mt-0.5">
                        {report.executive_summary.jd_match_score !== null ? "Match Rating" : "Base Score"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-black text-[#0B2146]">
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
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Role Core</p>
                        <h4 className="mt-2 text-sm font-black text-[#0B2146] leading-snug">
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
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Strongest Element</p>
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
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Highest Risk Flag</p>
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
                  <h4 className="text-xs font-black text-[#0B2146] uppercase tracking-wider">ATS System Executive Narrative</h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700">{report.summary}</p>
                  {report.executive_summary.score_explanation?.estimated_potential_score_after_rewrite && (
                    <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold text-emerald-800">Estimated potential score post targeted rewrite optimization:</span>
                      <span className="font-black text-[#0B2146] bg-white border px-2 py-0.5 rounded-md shadow-sm ml-2 shrink-0">
                        {report.executive_summary.score_explanation.estimated_potential_score_after_rewrite}/100
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ) : null}

            {/* Requirement Checker Core Table Component */}
            {requirementCheckerPrimaryRows.length ? (
              <Card id="report-jd-matrix" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0B2146]">Requirement Checker</h2>
                  <p className="text-xs text-slate-500 font-medium">Core must-have variables extracted from job metrics verified line-by-line.</p>
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
                  <h2 className="text-xl font-black text-[#0B2146]">Requirement Continuation Matrix</h2>
                  <p className="text-xs text-slate-500 font-medium">Extended validation index auditing desired competencies and auxiliary context.</p>
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
                  <span className="font-black text-amber-800 uppercase block mb-1">Matrix Outcome Aggregation</span>
                  {requirementOutcomeSummary}
                </div>
              </Card>
            ) : null}

            {/* ATS Parsing Health Overview Dashboard Grid */}
            {parsingHealthRows.length ? (
              <Card id="report-ats-parsing" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0B2146]">ATS Parsing &amp; Structural Health</h2>
                  <p className="text-xs text-slate-500 font-medium">Validates indexing reliability to prevent data truncation errors inside enterprise software pipelines.</p>
                </div>
                <AnalysisTable
                  columns={[
                    { key: "check", label: "Structural Audit Check", width: "22%", emphasis: true },
                    { key: "finding", label: "Extracted State Result", width: "34%" },
                    { key: "status", label: "Compliance", width: "16%" },
                    { key: "why", label: "Why it matters in database routing", width: "28%" },
                  ]}
                  rows={parsingHealthRows}
                />
                {formattingRecommendations.length ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                    <h4 className="text-xs font-black text-[#0B2146] uppercase tracking-wider">Formatting Recommendations Index</h4>
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
                  <h2 className="text-xl font-black text-[#0B2146]">Category Scorecard Breakdown</h2>
                  <p className="text-xs text-slate-500 font-medium">Detailed grading indices separating core competencies from operational layout frameworks.</p>
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
                  <span className="font-black text-[#0B2146] uppercase block mb-1">Methodology Reading Rule</span>
                  Scores &ge; 80% confirm high operational confidence data signals. Scores 60-79% identify functional values that require tactical phrase expanding enhancements. Scores below 60% represent critical routing risks.
                </div>
              </Card>
            ) : null}

            {/* Charts Graphics Layout Block Container */}
            <div id="report-visuals" className="scroll-mt-28">
              <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0B2146]">Visual Analytics</span>
                    <h2 className="text-xl font-black text-[#0B2146]">Systemic Execution Metrics</h2>
                    <p className="text-xs text-slate-500 font-medium">Turns unstructured text scoring evaluations into an easily scannable dashboard summary layout.</p>
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
                        <p className="text-xs font-black text-[#0B2146]">ATS Compatibility Factor</p>
                      </div>
                      <GaugeChart score={dashboardOverallScore} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-between shadow-xs">
                      <div className="w-full text-left border-b border-slate-100 pb-2 mb-2">
                        <p className="text-xs font-black text-[#0B2146]">Core Domain Matrix Balance</p>
                      </div>
                      <RadarChart items={radarItems} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
                      <div className="text-left border-b border-slate-100 pb-2 mb-4">
                        <p className="text-xs font-black text-[#0B2146]">Linguistic Statement Phrasing Type</p>
                      </div>
                      <DoughnutChart
                        items={impactLanguageChart.items}
                        centerLabel="Phrases"
                        centerValue={`${impactLanguageChart.strongCount}/${impactLanguageChart.weakCount}`}
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
                      <div className="text-left border-b border-slate-100 pb-2 mb-4">
                        <p className="text-xs font-black text-[#0B2146]">Extracted Chronicles Career Path</p>
                      </div>
                      <TimelineChart items={tenureTimeline} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
                      <div className="text-left border-b border-slate-100 pb-2 mb-4">
                        <p className="text-xs font-black text-[#0B2146]">Keyword Repetition Clusters</p>
                      </div>
                      <KeywordProminenceChart items={keywordCloudItems} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
                      <div className="text-left border-b border-slate-100 pb-2 mb-4">
                        <p className="text-xs font-black text-[#0B2146]">Technical vs. Structural Distribution Ratio</p>
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
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Quick Assessment</span>
                      <h2 className="text-xl font-black text-[#0B2146] mt-1">Operational Screening First Scan Pointers</h2>
                      <p className="text-xs text-slate-500 font-medium">Core observations generated during document ingestion workflow routing checks.</p>
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
                          <h3 className="text-xs font-black text-[#0B2146] border-b border-slate-200 pb-1.5 mb-2 uppercase tracking-wide">
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
                  <h2 className="text-xl font-black text-[#0B2146]">Core Keyword Coverage Mapping</h2>
                  <p className="text-xs text-slate-500 font-medium">Validates indexing tags cross-referenced from target description parameters.</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm space-y-3">
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider border-b border-slate-100 pb-2">Indexed Competency Matches</h4>
                    <div className="flex flex-wrap gap-2">
                      {keywordCoverageSection.matchedKeywords.map((item, idx) => (
                        <span key={idx} className="inline-flex rounded-lg bg-emerald-50 text-emerald-850 px-2.5 py-1 text-[11px] font-bold border border-emerald-200/60 shadow-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm space-y-3">
                    <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider border-b border-slate-100 pb-2">Missing Context Deficits</h4>
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
                  <span className="font-black text-[#0B2146] uppercase block mb-1">ATS Operational Slicer Rule</span>
                  System processes classify attributes into precise coverage bounds: exact data matches, contextual semantics, and systemic missing deficits. Bullet point integration requires clear verification tokens rather than plain frequency accumulation text loops.
                </div>
              </Card>
            ) : null}

            {/* Risk Flags & objections matrix table component */}
            {riskFlagsSection?.length ? (
              <Card id="report-risk-flags" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0B2146]">Risk Flags &amp; Objection Analysis</h2>
                  <p className="text-xs text-slate-500 font-medium">Isolates high-probability screening blocks that manual corporate filtering algorithms typically exclude first.</p>
                </div>
                <AnalysisTable
                  columns={[
                    { key: "flag", label: "Risk Flag Category", width: "24%", emphasis: true },
                    { key: "severity", label: "Threat Rank", width: "14%" },
                    { key: "why", label: "Screening Core Vulnerability", width: "30%" },
                    { key: "handle", label: "Correction Mitigation Steps", width: "32%" },
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
                  <h2 className="text-xl font-black text-[#0B2146]">Resume Content Rewrite Recommendations</h2>
                  <p className="text-xs text-slate-500 font-medium">Actionable template samples comparing current phrasing deficits with context optimization fixes.</p>
                </div>

                {rewriteSection.summaryDraft && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-2">
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider border-b border-blue-100 pb-1.5">Optimized Professional Summary Proposal</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium italic">"{rewriteSection.summaryDraft}"</p>
                  </div>
                )}

                {rewriteSection.bulletPairs.length ? (
                  <div className="space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Target Bullet Performance Upgrades</p>
                    {rewriteSection.bulletPairs.map((pair) => (
                      <div key={pair.id} className="grid gap-3 sm:grid-cols-2 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2 flex flex-col justify-between">
                          <div>
                            <span className="inline-flex rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white mb-2">Legacy Phrasing</span>
                            <p className="text-xs leading-relaxed text-slate-600 font-medium font-mono">"{pair.before}"</p>
                          </div>
                        </div>
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-2 flex flex-col justify-between">
                          <div>
                            <span className="inline-flex rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white mb-2">Enhanced Output</span>
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Competency Domain Analysis</span>
                  <h2 className="text-xl font-black text-[#0B2146] mt-2">BI, Dashboards &amp; Corporate Reporting</h2>
                  <p className="text-xs text-slate-500 font-medium">Quantifies verified candidate performance across modern information dashboarding matrices.</p>
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
                  <h2 className="text-xl font-black text-[#0B2146]">Advanced Analytics &amp; AI/ML Verification</h2>
                  <p className="text-xs text-slate-500 font-medium">{aiMlSection.summary}</p>
                </div>

                <ScoreSummaryPanel
                  score={aiMlSection.score}
                  label="Algos Score"
                  title={aiMlSection.performance}
                  summary={aiMlSection.summary}
                  tone="rose"
                />

                <AnalysisTable
                  columns={[
                    { key: "requirement", label: "Model / Skill Constraint", width: "25%", emphasis: true },
                    { key: "evidence", label: "Current Document Evidence", width: "32%" },
                    { key: "status", label: "Status Flag", width: "15%" },
                    { key: "add", label: "Required Integration Field", width: "28%" },
                  ]}
                  rows={aiMlSection.rows}
                />

                {aiMlSection.proofFormat && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs font-medium text-amber-900 leading-relaxed">
                    <span className="font-black text-amber-800 uppercase block mb-1">Suggested AI/ML Proof Delivery Pattern</span>
                    {aiMlSection.proofFormat}
                  </div>
                )}
              </Card>
            ) : null}

            {/* Data Governance, Quality & Architecture section */}
            {governanceSection && (governanceSection.cards?.length || governanceSection.riskRows?.length) ? (
              <Card id="report-governance" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xl font-black text-[#0B2146]">Data Governance, Quality &amp; Architecture Matrix</h2>
                  <p className="text-xs text-slate-500 font-medium">Audits data infrastructure security checks, integration controls, and repository schemas.</p>
                </div>

                <ScoreSummaryPanel
                  score={governanceSection.score}
                  label="Gov Score"
                  title={governanceSection.performance}
                  summary={governanceSection.summary}
                  tone={governanceSection.score >= 80 ? "emerald" : governanceSection.score >= 60 ? "amber" : "rose"}
                />

                {governanceSection.cards?.length ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {governanceSection.cards.map((card, idx) => (
                      <div key={idx} className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm space-y-3 flex min-h-[182px] flex-col justify-between">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <h4 className="text-xs font-black text-[#0B2146]">{card.title}</h4>
                          <span className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-black text-[#0B2146] shadow-2xs">{card.score}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{card.summary}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {governanceSection.notes?.length ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <h4 className="text-xs font-black text-[#0B2146] uppercase tracking-wider">Infrastructure Engineering Validation Notes</h4>
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
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Compliance Phrasing Risk Log</p>
                    <AnalysisTable
                      columns={[
                        { key: "phrase", label: "JD Target Component", width: "40%", emphasis: true },
                        { key: "signal", label: "Current Document Context", width: "44%" },
                        { key: "risk", label: "Objection Threat Level", width: "16%" },
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
                  <h2 className="text-xl font-black text-[#0B2146]">Leadership &amp; Stakeholder Fit</h2>
                  <p className="text-xs text-slate-500 font-medium">Audits metrics on executive presentation, cross-functional project execution, and organizational visibility.</p>
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
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">Leadership Assets Found</h4>
                    <div className="space-y-1.5">
                      {leadershipSection.evidence.map((item, idx) => (
                        <p key={idx} className="text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">&bull; {item}</p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm">
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2">Enhancement Action Items</h4>
                    <div className="space-y-1.5">
                      {leadershipSection.improvements.map((item, idx) => (
                        <p key={idx} className="text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">&bull; {item}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs font-medium text-emerald-900">
                  <span className="font-bold block mb-0.5">Leadership Verdict Summary:</span> {leadershipSection.verdict}
                </div>
              </Card>
            ) : null}

            {/* Operational Verdict Plan Block Panel */}
            {finalVerdictSection ? (
              <Card id="report-final-verdict" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-[#0B2146]">Final Operational Routing Verdict</h2>
                  <p className="text-xs text-slate-500 font-medium">Definitive priority matrix roadmap evaluating artifact submittal parameters.</p>
                </div>

                <div className="rounded-2xl bg-[#0B2146] text-white p-5 flex flex-col sm:flex-row items-center gap-6 shadow-md border border-slate-800">
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
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Priority Content Correction Roadmap</p>
                  <AnalysisTable
                    columns={[
                      { key: "priority", label: "Rank", width: "12%", emphasis: true },
                      { key: "action", label: "Structural Action Item", width: "70%" },
                      { key: "impact", label: "Estimated Score Growth", width: "18%" },
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
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Comprehensive Check Chapters</span>
                        <h2 className="text-xl font-black text-[#0B2146] mt-1">{group}</h2>
                      </div>
                      <span className="rounded-full bg-slate-100 border px-3 py-1 text-[11px] font-black text-[#0B2146] shadow-2xs">
                        {sections.reduce((cnt, s) => cnt + (s.issue_count || 0), 0)} operational review points
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
                  <h2 className="text-xl font-black text-[#0B2146]">Full 50-Pointer Audit Registry</h2>
                  <p className="text-xs text-slate-500 font-medium">Deep filter processing tool checking strict code elements block-by-block.</p>
                </div>
                <div className="w-full sm:w-64 shrink-0">
                  <select
                    id="analysis-category-slicer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none transition focus:border-[#0B2146] focus:bg-white"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1">Active Set: {visiblePointCount} check pointers loaded</span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1">Scans: All 50 ATS Compliance Rules Checked</span>
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
                              <p className="text-xs sm:text-sm font-black text-[#0B2146] leading-snug">
                                {point.pointer_id}. {point.title}
                              </p>
                              <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
                                <span className="bg-white border px-1.5 py-0.5 rounded shadow-2xs text-slate-600">{point.current_status}</span>
                                <span className="bg-white border px-1.5 py-0.5 rounded shadow-2xs text-slate-600">Grade: {point.score}</span>
                                <span className="bg-white border px-1.5 py-0.5 rounded shadow-2xs text-slate-600">Threat: {point.severity}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed text-slate-600 mb-2 font-medium">{point.explanation}</p>
                          <p className="text-xs leading-relaxed text-slate-700 font-bold bg-white p-2.5 rounded-xl border border-slate-150">
                            <span className="font-black text-slate-950 uppercase tracking-wider text-[10px] block mb-0.5 text-blue-800">Operational Guideline Rule:</span>
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
                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Matched Source Segments</span>
                              </div>
                              {evidenceLines.map((line) => (
                                <div key={line.segment_id} className="rounded-xl border border-slate-150 bg-white p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      <button type="button" onClick={() => focusResumeArea(line)} className="min-w-0 flex-1 text-left group">
                                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block group-hover:text-blue-700 transition">
                                          {line.section_name} &middot; {line.isFullArea ? "Section context area" : "Specific string"}
                                        </span>
                                        <p className="mt-0.5 text-xs font-semibold text-slate-700 leading-normal break-words">"{line.text}"</p>
                                      </button>
                                      <Button
                                        variant="outline"
                                        className="rounded-lg px-2.5 py-1 text-[10px] font-black bg-slate-50 shrink-0"
                                        onClick={() => analyzeEvidenceLine(line)}
                                      >
                                        <Sparkles className="mr-1.5 h-3 w-3 text-amber-500 fill-amber-400 inline" />
                                        {aiLineInsights[line.segment_id]?.status === "loading" ? "Optimizing..." : "AI Optimize"}
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
                                          AI findings
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
                                            <span className="font-bold text-slate-900">Suggested improvement:</span>{" "}
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
                              <span className="font-bold text-emerald-800 block mb-0.5">Optimized Context Upgrade Draft Proposal:</span>
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

            {/* Experience Evidence Map Section */}
            {experienceEvidenceSection?.rows?.length ? (
              <Card id="report-experience-map" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0B2146]">Experience Evidence Map</h2>
                  <p className="text-xs text-slate-500 font-medium">Visual tracking path isolating exactly where historical profile milestones map to target description fields.</p>
                </div>
                <AnalysisTable
                  columns={[
                    { key: "role", label: "Historical Role Position", width: "26%", emphasis: true },
                    { key: "evidence", label: "Extracted Field Assets", width: "58%" },
                    { key: "fit", label: "Scored Fit", width: "16%" },
                  ]}
                  rows={experienceEvidenceSection.rows.map((row) => ({
                    ...row,
                    status: row.fit === "High" ? "strong" : row.fit === "Medium" ? "partial" : "gap",
                  }))}
                />
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="font-black text-[#0B2146] block mb-1 uppercase tracking-wider">Historical Alignment Strategy</span>
                  {experienceEvidenceSection.strategy}
                </div>
              </Card>
            ) : null}

            {/* Appendix Summary Panels Section */}
            <div id="report-appendix" className="scroll-mt-28 grid gap-4 lg:grid-cols-2">
              <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <BarChart3 className="h-4 w-4 text-[#0B2146]" />
                  <h3 className="text-sm font-black text-[#0B2146] uppercase tracking-wider">Metric Snapshot Aggregation</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3.5">
                    <StatusBar label="Passed Indicators" value={statusMetrics.passedPercent} tone="green" />
                    <StatusBar label="Enhancement Triggers" value={statusMetrics.needsPercent} tone="amber" />
                    <StatusBar label="Objection Gap Errors" value={statusMetrics.criticalPercent} tone="rose" />
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
                  <Search className="h-4 w-4 text-[#0B2146]" />
                  <h3 className="text-sm font-black text-[#0B2146] uppercase tracking-wider">Dynamic Interactive Signal Chips</h3>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Triggers filtered mapping highlights inside original document viewer nodes upon interaction.
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
                        className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#0B2146] hover:bg-white shadow-2xs"
                      >
                        {keyword} <span className="text-[#0B2146] font-black ml-1">({count})</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 font-medium italic">No frequent tokens registered.</p>
                  )}
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>

      {isReportPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-6">
          <div className="flex h-[96vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <h2 className="text-lg font-black text-[#0B2146]">A4 Report Preview</h2>
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
                  className="rounded-xl bg-[#0b1042] px-4 py-2.5 text-xs font-black text-white hover:bg-[#070b2e] transition shadow-md"
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
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-150">
          <div className="h-full w-full max-w-[1300px] flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl scale-in-95 duration-200">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="min-w-0">
                <h3 className="text-base font-black text-[#0B2146]">Live Verification Content Sandbox</h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-xl">Inspect exact string elements parsed inside parsing models.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="flex rounded-xl bg-slate-200/70 p-1 border border-slate-300/40 text-xs font-bold">
                  {/* <button
                    type="button"
                    onClick={() => setPreviewMode("ats")}
                    className={`rounded-lg px-3 py-1.5 transition ${previewMode === "ats" ? "bg-white text-[#0B2146] shadow-2xs" : "text-slate-600 hover:text-slate-950"}`}
                  >
                    ATS Extracted Matrix Map
                  </button> */}
                  <button
                    type="button"
                    onClick={() => setPreviewMode("original")}
                    className={`rounded-lg px-3 py-1.5 transition ${previewMode === "original" ? "bg-white text-[#0B2146] shadow-2xs" : "text-slate-600 hover:text-slate-950"}`}
                  >
                    Original Upload Blueprint
                  </button>
                </div>
                {(highlightedLineId || originalSearchTerm) ? (
                  <button
                    type="button"
                    onClick={clearPreviewFocus}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 shadow-2xs"
                  >
                    Clear Focus Highlight
                  </button>
                ) : null}
                <Button variant="outline" className="rounded-xl px-4 py-2 text-xs font-black bg-white" onClick={() => setIsResumeViewerOpen(false)}>
                  Close Sandbox
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
                      placeholder="Execute text highlight query inside original file sandbox frame..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-[#0B2146] shadow-2xs"
                    />
                  </div>
                  <Button variant="outline" className="rounded-xl px-4 py-2 text-xs font-black bg-white shrink-0 shadow-2xs" onClick={applyOriginalSearch}>
                    <Search className="mr-1.5 h-3.5 w-3.5 inline" />
                    Query String Match
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
                  title="Original uploaded file asset panel frame window viewport context"
                  className="w-full max-w-4xl h-full min-h-[66vh] rounded-xl bg-white shadow-md border"
                />
              {/* )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ATSReportPage;
