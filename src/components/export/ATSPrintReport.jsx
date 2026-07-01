// import { formatReportDate, normalizeScore } from "./ReportTemplate";

// function cx(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// function statusTone(status) {
//   const value = String(status || "").toLowerCase();
//   if (value.includes("strong") || value.includes("pass")) {
//     return "bg-emerald-100 text-emerald-700 border-emerald-200";
//   }
//   if (value.includes("partial") || value.includes("medium")) {
//     return "bg-amber-100 text-amber-700 border-amber-200";
//   }
//   if (value.includes("gap") || value.includes("high") || value.includes("critical")) {
//     return "bg-rose-100 text-rose-700 border-rose-200";
//   }
//   return "bg-slate-100 text-slate-600 border-slate-200";
// }

// function PrintPage({ children, cover = false, pageNumber, footerLabel = "CareerSense ATS Report" }) {
//   return (
//     <section
//       className={cx(
//         "print-report-page mx-auto flex w-full max-w-[794px] flex-col bg-white text-slate-900",
//         cover
//           ? "min-h-[1122px] rounded-[28px] border border-slate-200 px-12 py-12 shadow-xl"
//           : "min-h-[1122px] rounded-[28px] border border-slate-200 px-10 py-10 shadow-xl"
//       )}
//     >
//       <div className="flex-1">{children}</div>
//       <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
//         <span>{footerLabel}</span>
//         <span>Page {pageNumber}</span>
//       </div>
//     </section>
//   );
// }

// function SectionTitle({ eyebrow, title, description }) {
//   return (
//     <div className="space-y-2">
//       {eyebrow ? (
//         <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#5B7698]">
//           {eyebrow}
//         </p>
//       ) : null}
//       <div className="space-y-1.5">
//         <h2 className="text-[30px] font-black leading-[1.05] text-[#0B2146]">
//           {title}
//         </h2>
//         {description ? (
//           <p className="max-w-[640px] text-[14px] leading-6 text-slate-500">
//             {description}
//           </p>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// function MetricBubble({ score, label, tone = "amber" }) {
//   const tones = {
//     amber: "bg-amber-400 text-white",
//     emerald: "bg-emerald-500 text-white",
//     rose: "bg-rose-500 text-white",
//     blue: "bg-sky-500 text-white",
//   };

//   return (
//     <div
//       className={cx(
//         "flex h-[142px] w-[142px] shrink-0 flex-col items-center justify-center rounded-full text-center shadow-sm",
//         tones[tone] || tones.amber
//       )}
//     >
//       <div className="text-[24px] font-black leading-none">{normalizeScore(score)}%</div>
//       <div className="mt-2 text-[11px] font-black uppercase tracking-[0.14em]">
//         {label}
//       </div>
//     </div>
//   );
// }

// function StatusBadge({ children, status }) {
//   return (
//     <span
//       className={cx(
//         "inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]",
//         statusTone(status)
//       )}
//     >
//       {children || status}
//     </span>
//   );
// }

// function DataTable({ columns, rows }) {
//   if (!rows?.length) {
//     return null;
//   }

//   return (
//     <div className="overflow-hidden rounded-[22px] border border-slate-200">
//       <table className="w-full border-collapse text-left">
//         <thead className="bg-slate-100">
//           <tr>
//             {columns.map((column) => (
//               <th
//                 key={column.key}
//                 className="border-b border-slate-200 px-4 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500"
//                 style={column.width ? { width: column.width } : undefined}
//               >
//                 {column.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row, index) => (
//             <tr key={row.id || index} className="align-top">
//               {columns.map((column) => {
//                 const value = row[column.key];
//                 return (
//                   <td
//                     key={column.key}
//                     className="border-b border-slate-100 px-4 py-3 text-[12px] leading-5 text-slate-700 last:border-b-0"
//                   >
//                     {column.render ? (
//                       column.render(value, row)
//                     ) : (
//                       <span className={column.emphasis ? "font-bold text-[#0B2146]" : ""}>
//                         {value || "-"}
//                       </span>
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function InsightCard({ title, body, tone = "slate" }) {
//   const tones = {
//     slate: "border-slate-200 bg-white",
//     mint: "border-emerald-200 bg-emerald-50/70",
//     amber: "border-amber-200 bg-amber-50/70",
//     blue: "border-sky-200 bg-sky-50/70",
//   };

//   return (
//     <div className={cx("rounded-[22px] border p-5", tones[tone] || tones.slate)}>
//       <h4 className="text-[17px] font-black text-[#0B2146]">{title}</h4>
//       <p className="mt-2 text-[13px] leading-6 text-slate-600">{body}</p>
//     </div>
//   );
// }

// function BulletList({ items, markerTone = "bg-sky-500" }) {
//   if (!items?.length) {
//     return null;
//   }

//   return (
//     <ul className="space-y-2.5">
//       {items.map((item, index) => (
//         <li key={`${item}-${index}`} className="flex gap-3 text-[13px] leading-6 text-slate-700">
//           <span className={cx("mt-2 h-2.5 w-2.5 shrink-0 rounded-full", markerTone)} />
//           <span>{item}</span>
//         </li>
//       ))}
//     </ul>
//   );
// }

// function ScoreRow({ label, score }) {
//   const safeScore = normalizeScore(score);
//   const tone =
//     safeScore >= 80
//       ? "bg-emerald-500"
//       : safeScore >= 60
//         ? "bg-amber-400"
//         : "bg-rose-500";

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between gap-4">
//         <span className="text-[13px] font-bold text-[#0B2146]">{label}</span>
//         <span className="text-[13px] font-black text-slate-700">{safeScore}</span>
//       </div>
//       <div className="h-3 overflow-hidden rounded-full bg-slate-100">
//         <div className={cx("h-full rounded-full", tone)} style={{ width: `${safeScore}%` }} />
//       </div>
//     </div>
//   );
// }

// function ATSPrintReport({
//   report,
//   resume,
//   candidateName,
//   requirementCheckerPrimaryRows,
//   requirementCheckerContinuationRows,
//   parsingHealthRows,
//   formattingRecommendations,
//   requirementOutcomeSummary,
//   scorecardRows,
//   biReportingSection,
//   aiMlSection,
//   governanceSection,
//   keywordCoverageSection,
//   leadershipSection,
//   experienceEvidenceSection,
//   riskFlagsSection,
//   rewriteSection,
//   finalVerdictSection,
//   dashboardOverallScore,
// }) {
//   const executive = report?.executive_summary || {};
//   const targetRole =
//     report?.target_role ||
//     report?.metadata?.target_role ||
//     report?.job_description?.title ||
//     resume?.target_role ||
//     "ATS Readiness Evaluation";
//   const targetCompany =
//     report?.target_company ||
//     report?.metadata?.target_company ||
//     report?.job_description?.company ||
//     "CareerSense Review";
//   const reportDate = formatReportDate(report?.created_at) || formatReportDate(new Date().toISOString());
//   const topFix = executive.top_fixes?.[0] || null;
//   const scorecardTopRows = scorecardRows?.slice(0, 7) || [];
//   const coverSummary =
//     executive.recommendation ||
//     report?.summary ||
//     "This report summarizes the ATS fit between the uploaded resume and the target role.";
//   let pageNumber = 0;
//   const nextPage = () => {
//     pageNumber += 1;
//     return pageNumber;
//   };

//   return (
//     <div className="print-report-shell space-y-6">
//       <PrintPage cover pageNumber={nextPage()} footerLabel={`${candidateName} ATS Report`}>
//         <div className="flex h-full flex-col justify-between">
//           <div className="space-y-10">
//             <div className="flex items-start justify-between gap-6">
//               <div className="space-y-4">
//                 <p className="text-[12px] font-black uppercase tracking-[0.24em] text-amber-500">
//                   CareerSense ATS Intelligence
//                 </p>
//                 <div className="space-y-3">
//                   <h1 className="max-w-[560px] text-[42px] font-black leading-[0.98] text-[#0B2146]">
//                     ATS Fit Report
//                   </h1>
//                   <p className="max-w-[420px] text-[18px] leading-8 text-slate-500">
//                     A structured A4 export generated from the same ATS analysis data shown in the live report.
//                   </p>
//                 </div>
//               </div>
//               <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-right">
//                 <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
//                   Prepared On
//                 </p>
//                 <p className="mt-1 text-[16px] font-black text-[#0B2146]">{reportDate}</p>
//               </div>
//             </div>

//             <div className="rounded-[30px] bg-[#0B2146] px-8 py-8 text-white">
//               <p className="text-[12px] font-black uppercase tracking-[0.22em] text-amber-400">
//                 Candidate
//               </p>
//               <h2 className="mt-3 text-[36px] font-black leading-tight">{candidateName}</h2>
//               <div className="mt-6 grid gap-4 md:grid-cols-2">
//                 <div>
//                   <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-300">
//                     Target Role
//                   </p>
//                   <p className="mt-1 text-[18px] font-bold leading-7">{targetRole}</p>
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-300">
//                     Target Company
//                   </p>
//                   <p className="mt-1 text-[18px] font-bold leading-7">{targetCompany}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-6">
//               <MetricBubble score={dashboardOverallScore} label="overall fit" tone="amber" />
//               <MetricBubble
//                 score={finalVerdictSection?.currentScore ?? dashboardOverallScore}
//                 label="current score"
//                 tone="blue"
//               />
//               <MetricBubble
//                 score={finalVerdictSection?.potentialScore ?? dashboardOverallScore}
//                 label="potential score"
//                 tone="emerald"
//               />
//             </div>

//             <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-6 py-6">
//               <p className="text-[12px] font-black uppercase tracking-[0.18em] text-slate-400">
//                 Executive Cover Note
//               </p>
//               <p className="mt-3 text-[16px] leading-8 text-slate-700">{coverSummary}</p>
//             </div>
//           </div>

//           <div className="flex items-end justify-between gap-6 border-t border-slate-200 pt-6">
//             <div className="max-w-[520px]">
//               <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
//                 Lead Recommendation
//               </p>
//               <p className="mt-2 text-[18px] font-black text-[#0B2146]">
//                 {finalVerdictSection?.verdictTitle || executive.decision_signal || "Targeted rewrite recommended"}
//               </p>
//               <p className="mt-2 text-[13px] leading-6 text-slate-500">
//                 {topFix?.recommended_action || requirementOutcomeSummary}
//               </p>
//             </div>
//             <div className="text-right text-[11px] font-medium text-slate-400">
//               CareerSense Workspace
//             </div>
//           </div>
//         </div>
//       </PrintPage>

//       <PrintPage pageNumber={nextPage()} footerLabel="Executive Summary">
//         <SectionTitle
//           eyebrow="Overview"
//           title="Executive Summary"
//           description="A recruiter-facing summary of hiring readiness, score movement potential, and the core ATS story from the uploaded resume and JD."
//         />

//         <div className="mt-8 grid gap-5 md:grid-cols-[160px_1fr]">
//           <MetricBubble score={finalVerdictSection?.currentScore ?? dashboardOverallScore} label="current match" tone="amber" />
//           <div className="rounded-[24px] border border-slate-200 bg-white p-6">
//             <h3 className="text-[28px] font-black leading-tight text-[#0B2146]">
//               {finalVerdictSection?.verdictTitle || executive.decision_signal || "ATS Readiness Summary"}
//             </h3>
//             <p className="mt-4 text-[15px] leading-7 text-slate-600">
//               {finalVerdictSection?.verdictBody || coverSummary}
//             </p>
//           </div>
//         </div>

//         <div className="mt-8 grid gap-4 md:grid-cols-2">
//           <InsightCard
//             title="Top Rewrite Opportunity"
//             tone="amber"
//             body={topFix?.why_it_matters || requirementOutcomeSummary}
//           />
//           <InsightCard
//             title="Estimated Upside"
//             tone="mint"
//             body={
//               finalVerdictSection
//                 ? `The current score is ${finalVerdictSection.currentScore}%, with a projected potential score of ${finalVerdictSection.potentialScore}% after a truthful, targeted rewrite.`
//                 : "Potential score projection is not available in the current report payload."
//             }
//           />
//         </div>

//       </PrintPage>

//       <PrintPage pageNumber={nextPage()} footerLabel="Methodology">
//         <SectionTitle
//           eyebrow="Methodology"
//           title="How the score is calculated"
//           description="The ATS score combines parsing health, requirement coverage, keyword alignment, evidence strength, and recruiter objection risk."
//         />
//         <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
//           <BulletList
//             items={[
//               "Resume parsing and formatting: whether headings, dates, skills, and accomplishments can be extracted cleanly.",
//               "JD requirement coverage: whether the current resume proves the must-have responsibilities and qualifications.",
//               "Keyword and skills alignment: exact and semantic matches across role, tools, domain, and technical terms.",
//               "Evidence strength: whether a skill is merely mentioned or supported with scope, tools, and measurable results.",
//               "Hiring risk flags: qualification gaps, missing technical depth, weak specificity, and recruiter objections.",
//             ]}
//           />
//         </div>
//       </PrintPage>

//       <PrintPage pageNumber={nextPage()} footerLabel="Requirement Checker">
//         <SectionTitle
//           eyebrow="Requirements"
//           title="Requirement Checker"
//           description="Each target-role requirement is checked against the current resume using extracted evidence and recommendation guidance."
//         />

//         <div className="mt-6">
//           <DataTable
//             columns={[
//               { key: "requirement", label: "Requirement", width: "25%", emphasis: true },
//               { key: "evidence", label: "Evidence Found", width: "32%" },
//               {
//                 key: "status",
//                 label: "Status",
//                 width: "13%",
//                 render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
//               },
//               { key: "explanation", label: "Explanation" },
//             ]}
//             rows={requirementCheckerPrimaryRows}
//           />
//         </div>
//       </PrintPage>

//       {requirementCheckerContinuationRows?.length ? (
//         <PrintPage pageNumber={nextPage()} footerLabel="Requirement Continuation">
//           <SectionTitle
//             eyebrow="Requirements"
//             title="Requirement Continuation"
//             description="Continuation of must-have and preferred skill checks from the target role."
//           />
//           <div className="mt-6">
//             <DataTable
//               columns={[
//                 { key: "requirement", label: "Requirement", width: "25%", emphasis: true },
//                 { key: "evidence", label: "Evidence Found", width: "32%" },
//                 {
//                   key: "status",
//                   label: "Status",
//                   width: "13%",
//                   render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
//                 },
//                 { key: "explanation", label: "Explanation" },
//               ]}
//               rows={requirementCheckerContinuationRows}
//             />
//           </div>

//           <div className="mt-8 rounded-[24px] border border-amber-200 bg-amber-50/70 p-6">
//             <h3 className="text-[20px] font-black text-amber-700">Main Requirement Outcome</h3>
//             <p className="mt-3 text-[14px] leading-7 text-slate-700">{requirementOutcomeSummary}</p>
//           </div>
//         </PrintPage>
//       ) : (
//         <PrintPage pageNumber={nextPage()} footerLabel="Requirement Outcome">
//           <SectionTitle
//             eyebrow="Requirements"
//             title="Main Requirement Outcome"
//             description="High-level summary of the strongest JD alignments and the most important gaps."
//           />
//           <div className="mt-8 rounded-[24px] border border-amber-200 bg-amber-50/70 p-6">
//             <h3 className="text-[20px] font-black text-amber-700">Main Requirement Outcome</h3>
//             <p className="mt-3 text-[14px] leading-7 text-slate-700">{requirementOutcomeSummary}</p>
//           </div>
//         </PrintPage>
//       )}

//       <PrintPage pageNumber={nextPage()} footerLabel="ATS Parsing">
//         <SectionTitle
//           eyebrow="ATS Parsing"
//           title="Parsing Health"
//           description="Checks whether the resume is readable by ATS systems and where formatting or extraction quality could block ranking."
//         />

//         <div className="mt-6">
//           <DataTable
//             columns={[
//               { key: "check", label: "Check", width: "18%", emphasis: true },
//               { key: "finding", label: "Finding", width: "38%" },
//               {
//                 key: "status",
//                 label: "Status",
//                 width: "12%",
//                 render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
//               },
//               { key: "why", label: "Why it matters" },
//             ]}
//             rows={parsingHealthRows}
//           />
//         </div>

//         {formattingRecommendations?.length ? (
//           <div className="mt-8 rounded-[24px] border border-sky-200 bg-sky-50/70 p-6">
//             <h3 className="text-[20px] font-black text-[#0B2146]">Formatting Recommendations</h3>
//             <div className="mt-4">
//               <BulletList items={formattingRecommendations} />
//             </div>
//           </div>
//         ) : null}

//       </PrintPage>

//       <PrintPage pageNumber={nextPage()} footerLabel="Scorecard">
//         <SectionTitle
//           eyebrow="Scorecard"
//           title="Category Scorecard"
//           description="A structured view of the highest-signal ATS scoring dimensions from the current analysis payload."
//         />
//         <div className="mt-6">
//           <h3 className="text-[24px] font-black text-[#0B2146]">Scorecard</h3>
//           <div className="mt-5 space-y-4 rounded-[24px] border border-slate-200 bg-white p-6">
//             {scorecardTopRows.map((row) => (
//               <ScoreRow key={row.label} label={row.label} score={row.score} />
//             ))}
//           </div>
//         </div>
//       </PrintPage>

//       <PrintPage pageNumber={nextPage()} footerLabel="BI Reporting">
//         <SectionTitle
//           eyebrow="Domain Fit"
//           title="BI Reporting"
//           description="Highlights the strongest reporting evidence and dashboard-oriented proof found in the current resume."
//         />

//         {biReportingSection ? (
//           <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-6">
//             <div className="flex gap-6">
//               <MetricBubble score={biReportingSection.score} label="BI fit" tone="emerald" />
//               <div className="space-y-3">
//                 <h3 className="text-[26px] font-black text-[#0B2146]">{biReportingSection.performance}</h3>
//                 <p className="text-[14px] leading-7 text-slate-600">{biReportingSection.summary}</p>
//               </div>
//             </div>

//             <div className="mt-6 grid gap-5 md:grid-cols-2">
//               <div className="rounded-[22px] border border-slate-200 bg-white p-5">
//                 <h4 className="text-[18px] font-black text-emerald-700">Evidence Found</h4>
//                 <div className="mt-3">
//                 <BulletList items={biReportingSection.evidence} markerTone="bg-emerald-500" />
//                 </div>
//               </div>
//               <div className="rounded-[22px] border border-amber-200 bg-amber-50/70 p-5">
//                 <h4 className="text-[18px] font-black text-amber-700">How to Improve</h4>
//                 <div className="mt-3">
//                 <BulletList items={biReportingSection.improvements} markerTone="bg-amber-400" />
//                 </div>
//               </div>
//             </div>

//             {biReportingSection.positioning ? (
//               <div className="mt-6 rounded-[22px] border border-emerald-200 bg-emerald-50/70 p-5">
//                 <h4 className="text-[18px] font-black text-emerald-700">Recommended resume positioning</h4>
//                 <p className="mt-2 text-[13px] leading-6 text-slate-700">{biReportingSection.positioning}</p>
//               </div>
//             ) : null}
//           </div>
//         ) : null}

//       </PrintPage>

//       {keywordCoverageSection ? (
//         <PrintPage pageNumber={nextPage()} footerLabel="Keyword Coverage">
//           <SectionTitle
//             eyebrow="Keywords"
//             title="Tools and Keyword Coverage"
//             description="Separates proven matched terms from weak or missing keywords that may reduce ATS ranking confidence."
//           />
//           <div className="mt-8 grid gap-5 md:grid-cols-2">
//             <div className="rounded-[24px] border border-slate-200 bg-white p-6">
//               <h3 className="text-[22px] font-black text-emerald-600">Matched Keywords</h3>
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {keywordCoverageSection.matchedKeywords.map((term, index) => (
//                   <span
//                     key={`${term}-${index}`}
//                     className="rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.04em] text-white"
//                   >
//                     {term}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div className="rounded-[24px] border border-slate-200 bg-white p-6">
//               <h3 className="text-[22px] font-black text-rose-600">Missing / Weak Keywords</h3>
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {keywordCoverageSection.missingWeak.map((item, index) => (
//                   <span
//                     key={`${item.term}-${index}`}
//                     className={cx(
//                       "rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.04em] text-white",
//                       item.tone === "gap" ? "bg-rose-500" : "bg-amber-400"
//                     )}
//                   >
//                     {item.term}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </PrintPage>
//       ) : null}

//       {aiMlSection ? (
//         <PrintPage pageNumber={nextPage()} footerLabel="Advanced Analytics">
//           <SectionTitle
//             eyebrow="Deeper Analysis"
//             title="Advanced Analytics & AI/ML"
//             description="Focuses on the heavier technical analytics requirements that often influence shortlist decisions for senior BI and analytics roles."
//           />

//           <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6">
//             <div className="flex gap-6">
//               <MetricBubble score={aiMlSection.score} label="AI/ML fit" tone="rose" />
//               <div>
//                 <h3 className="text-[24px] font-black text-[#0B2146]">{aiMlSection.performance}</h3>
//                 <p className="mt-2 text-[14px] leading-7 text-slate-600">{aiMlSection.summary}</p>
//               </div>
//             </div>
//             <div className="mt-6">
//               <DataTable
//                 columns={[
//                   { key: "requirement", label: "AI/ML Requirement", width: "24%", emphasis: true },
//                   { key: "evidence", label: "Current Resume Evidence", width: "28%" },
//                   {
//                     key: "status",
//                     label: "Status",
//                     width: "12%",
//                     render: (value) => <StatusBadge status={value}>{value}</StatusBadge>,
//                   },
//                   { key: "add", label: "What To Add" },
//                 ]}
//                 rows={aiMlSection.rows}
//               />
//             </div>
//             {aiMlSection.proofFormat ? (
//               <div className="mt-6 rounded-[22px] border border-amber-200 bg-amber-50/70 p-5">
//                 <h4 className="text-[18px] font-black text-amber-700">Suggested AI/ML proof format</h4>
//                 <p className="mt-2 text-[13px] leading-6 text-slate-700">{aiMlSection.proofFormat}</p>
//               </div>
//             ) : null}
//           </div>
//         </PrintPage>
//       ) : null}

//       {governanceSection ? (
//         <PrintPage pageNumber={nextPage()} footerLabel="Data Governance">
//           <SectionTitle
//             eyebrow="Deeper Analysis"
//             title="Data Governance, Quality & Architecture"
//             description="Summarizes governance signals, validation depth, and enterprise data architecture readiness from the report payload."
//           />

//           <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6">
//             <div className="flex gap-6">
//               <MetricBubble score={governanceSection.score} label="governance fit" tone="blue" />
//               <div>
//                 <h3 className="text-[24px] font-black text-[#0B2146]">{governanceSection.performance}</h3>
//                 <p className="mt-2 text-[14px] leading-7 text-slate-600">{governanceSection.summary}</p>
//               </div>
//             </div>
//             <div className="mt-6 grid gap-4 md:grid-cols-3">
//               {governanceSection.cards?.map((card) => (
//                 <InsightCard
//                   key={card.title}
//                   title={`${card.title} · ${normalizeScore(card.score)}%`}
//                   body={card.summary}
//                   tone="blue"
//                 />
//               ))}
//             </div>
//             {governanceSection.notes?.length ? (
//               <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 p-5">
//                 <h4 className="text-[18px] font-black text-[#0B2146]">Checker Notes</h4>
//                 <div className="mt-3">
//                   <BulletList items={governanceSection.notes} />
//                 </div>
//               </div>
//             ) : null}
//           </div>
//         </PrintPage>
//       ) : null}

//       {leadershipSection ? (
//         <PrintPage pageNumber={nextPage()} footerLabel="Leadership Fit">
//           <SectionTitle
//             eyebrow="Deeper Analysis"
//             title="Leadership & Stakeholder Fit"
//             description="Captures cross-functional leadership, stakeholder-facing evidence, and organization-level communication strength."
//           />

//           <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6">
//             <div className="flex gap-6">
//               <MetricBubble score={leadershipSection.score} label="leadership fit" tone="emerald" />
//               <div>
//                 <h3 className="text-[24px] font-black text-[#0B2146]">{leadershipSection.performance}</h3>
//                 <p className="mt-2 text-[14px] leading-7 text-slate-600">{leadershipSection.summary}</p>
//               </div>
//             </div>
//             <div className="mt-6 grid gap-5 md:grid-cols-2">
//               <div className="rounded-[22px] border border-slate-200 bg-white p-5">
//                 <h4 className="text-[18px] font-black text-emerald-700">Evidence Found</h4>
//                 <div className="mt-3">
//                   <BulletList items={leadershipSection.evidence} markerTone="bg-emerald-500" />
//                 </div>
//               </div>
//               <div className="rounded-[22px] border border-amber-200 bg-amber-50/70 p-5">
//                 <h4 className="text-[18px] font-black text-amber-700">Improvement Focus</h4>
//                 <div className="mt-3">
//                   <BulletList items={leadershipSection.improvements} markerTone="bg-amber-400" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </PrintPage>
//       ) : null}

//       {riskFlagsSection?.length ? (
//         <PrintPage pageNumber={nextPage()} footerLabel="Risk Flags">
//           <SectionTitle
//             eyebrow="Action Plan"
//             title="Risk Flags & Recruiter Questions"
//             description="Shows the likely recruiter objections that may come up if the current resume is submitted as-is."
//           />

//           <div className="mt-6">
//             <DataTable
//               columns={[
//                 { key: "flag", label: "Risk Flag", width: "22%", emphasis: true },
//                 { key: "severity", label: "Severity", width: "12%", render: (value) => <StatusBadge status={value}>{value}</StatusBadge> },
//                 { key: "why", label: "Why It Matters", width: "30%" },
//                 { key: "handle", label: "How To Handle" },
//               ]}
//               rows={riskFlagsSection}
//             />
//           </div>
//         </PrintPage>
//       ) : null}

//       {rewriteSection ? (
//         <PrintPage pageNumber={nextPage()} footerLabel="Rewrite Recommendations">
//           <SectionTitle
//             eyebrow="Action Plan"
//             title="Resume Rewrite Recommendations"
//             description="Translates the ATS findings into summary and bullet-level rewrite guidance for the next draft."
//           />

//           <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6">
//             <h3 className="text-[24px] font-black text-[#0B2146]">Rewrite Recommendations</h3>
//             {rewriteSection.summaryDraft ? (
//               <div className="mt-5 rounded-[22px] border border-sky-200 bg-sky-50/70 p-5">
//                 <h4 className="text-[18px] font-black text-sky-700">Targeted Professional Summary</h4>
//                 <p className="mt-2 text-[13px] leading-6 text-slate-700">{rewriteSection.summaryDraft}</p>
//               </div>
//             ) : null}
//             {rewriteSection.bulletPairs?.length ? (
//               <div className="mt-5 space-y-4">
//                 {rewriteSection.bulletPairs.map((pair) => (
//                   <div key={pair.id} className="grid gap-3">
//                     <div className="rounded-[20px] border border-amber-200 bg-amber-50/70 px-4 py-3 text-[13px] leading-6 text-slate-700">
//                       <span className="mr-2 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
//                         Before
//                       </span>
//                       {pair.before}
//                     </div>
//                     <div className="rounded-[20px] border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-[13px] leading-6 text-slate-700">
//                       <span className="mr-2 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
//                         After
//                       </span>
//                       {pair.after}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : null}
//           </div>
//         </PrintPage>
//       ) : null}

//       {finalVerdictSection ? (
//         <PrintPage pageNumber={nextPage()} footerLabel="Final Verdict">
//           <SectionTitle
//             eyebrow="Final Verdict"
//             title="Recommended Action Plan"
//             description="Closes the report with the current score, upside score, and the most important next steps before applying."
//           />

//           <div className="mt-8 rounded-[28px] bg-[#0B2146] p-7 text-white">
//             <div className="flex flex-wrap items-start justify-between gap-6">
//               <div className="flex flex-wrap gap-4">
//                 <MetricBubble score={finalVerdictSection.currentScore} label="current" tone="amber" />
//                 <MetricBubble score={finalVerdictSection.potentialScore} label="potential" tone="emerald" />
//               </div>
//               <div className="max-w-[420px]">
//                 <h3 className="text-[28px] font-black leading-tight">{finalVerdictSection.verdictTitle}</h3>
//                 <p className="mt-3 text-[14px] leading-7 text-slate-200">{finalVerdictSection.verdictBody}</p>
//               </div>
//             </div>

//             <div className="mt-6">
//               <DataTable
//                 columns={[
//                   { key: "priority", label: "Priority", width: "12%", emphasis: true },
//                   { key: "action", label: "Action", width: "68%" },
//                   { key: "impact", label: "Expected Impact", width: "20%" },
//                 ]}
//                 rows={finalVerdictSection.actionRows}
//               />
//             </div>

//             <p className="mt-5 text-[12px] leading-6 text-slate-300">
//               {finalVerdictSection.disclaimer}
//             </p>
//           </div>
//         </PrintPage>
//       ) : null}

//       {experienceEvidenceSection ? (
//         <PrintPage pageNumber={nextPage()} footerLabel="Appendix">
//           <SectionTitle
//             eyebrow="Appendix"
//             title="Experience Evidence Map"
//             description="Maps the strongest matching role evidence so the resume can be reordered around the most relevant experience."
//           />

//           <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6">
//             <h3 className="text-[24px] font-black text-[#0B2146]">Experience Evidence Map</h3>
//             <div className="mt-5">
//               <DataTable
//                 columns={[
//                   { key: "role", label: "Role", width: "24%", emphasis: true },
//                   { key: "evidence", label: "Best Evidence", width: "56%" },
//                   { key: "fit", label: "Fit", width: "20%" },
//                 ]}
//                 rows={experienceEvidenceSection.rows}
//               />
//             </div>
//             <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 p-5">
//               <h4 className="text-[18px] font-black text-[#0B2146]">Resume Strategy</h4>
//               <p className="mt-2 text-[13px] leading-6 text-slate-700">{experienceEvidenceSection.strategy}</p>
//             </div>
//           </div>
//         </PrintPage>
//       ) : null}
//     </div>
//   );
// }

// export default ATSPrintReport;

import React from "react";

// Helper utility replacing external class mergers safely
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Global score normalizer to guarantee integer precision
function normalizeScore(score) {
  if (typeof score !== "number") {
    const parsed = parseInt(score, 10);
    return isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed));
  }
  return Math.min(100, Math.max(0, Math.round(score)));
}

// Global date format helper fallback safe
function formatReportDate(dateString) {
  if (!dateString) return new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  try {
    return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
}

function statusTone(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("strong") || value.includes("pass") || value.includes("high")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  }
  if (value.includes("partial") || value.includes("medium") || value.includes("med")) {
    return "bg-amber-50 text-amber-700 border-amber-200/60";
  }
  if (value.includes("gap") || value.includes("low") || value.includes("critical") || value.includes("error") || value.includes("missing")) {
    return "bg-rose-50 text-rose-700 border-rose-200/60";
  }
  return "bg-slate-50 text-slate-600 border-slate-200";
}

function statusLabelNormalized(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("strong") || value.includes("pass")) return "STRONG";
  if (value.includes("partial") || value.includes("med")) return "PARTIAL";
  if (value.includes("gap") || value.includes("low") || value.includes("critical") || value.includes("missing")) return "GAP";
  return String(status).toUpperCase();
}

// Defined explicitly up-front to clear the ReferenceError
function StatusBadge({ children, status }) {
  return (
    <span className={cx("inline-flex items-center justify-center rounded border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider shadow-3xs", statusTone(status))}>
      {statusLabelNormalized(children || status)}
    </span>
  );
}

/* Hard Target A4 Structural Page Wrapper */
function PrintPage({ children, cover = false, pageNumber, footerLabel = "CareerSense ATS Intelligence Report" }) {
  return (
    <section
      className="bg-white text-slate-900 overflow-hidden relative flex flex-col print:my-0 print:mx-auto"
      style={{
        boxSizing: "border-box",
        width: "210mm",
        height: "297mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        pageBreakBefore: "auto",
        pageBreakAfter: "always",
        pageBreakInside: "avoid",
        breakAfter: "page",
        margin: "0 auto"
      }}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0B2146] via-[#2583CF] to-[#F5B800] shrink-0" />
      <div className={cx("flex-1 flex flex-col justify-between overflow-hidden", cover ? "p-10" : "p-8")}>
        <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </div>
        {!cover && (
          <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-[#0B2146]">CS</span>
              <span className="text-slate-300">|</span>
              <span>{footerLabel}</span>
            </div>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">Page {pageNumber}</span>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="space-y-0.5 border-b border-slate-200/60 pb-2 mb-3 shrink-0">
      {eyebrow && (
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#2583CF]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-lg font-black tracking-tight text-[#0B2146]">
        {title}
      </h2>
      {description && (
        <p className="text-[11px] leading-normal text-slate-500 max-w-[660px]">
          {description}
        </p>
      )}
    </div>
  );
}

function MetricBubble({ score, label, tone = "amber" }) {
  const tones = {
    amber: "border-amber-200 bg-amber-50/40 text-amber-700",
    emerald: "border-emerald-200 bg-emerald-50/40 text-emerald-700",
    rose: "border-rose-200 bg-rose-50/40 text-rose-700",
    blue: "border-blue-200 bg-blue-50/40 text-blue-700",
  };
  const textTones = {
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
    blue: "text-blue-600",
  };

  return (
    <div className={cx("flex items-center gap-2.5 rounded-xl border p-2 w-full bg-white shadow-3xs", tones[tone])}>
      <div className="flex h-9 w-11 shrink-0 items-center justify-center rounded-lg bg-white border border-inherit shadow-2xs">
        <span className={cx("text-xs font-black tracking-tight", textTones[tone])}>
          {normalizeScore(score)}%
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-wide text-[#0B2146] truncate">{label}</p>
      </div>
    </div>
  );
}

function DataTable({ columns, rows }) {
  if (!rows?.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-3xs min-h-0 flex flex-col">
      <div className="overflow-x-auto min-h-0">
        <table className="w-full border-collapse text-left table-fixed">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr className="border-b border-slate-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 py-2 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-50"
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 min-h-0">
            {rows.map((row, index) => (
              <tr key={row.id || index} className="align-top hover:bg-slate-50/30 transition">
                {columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td key={column.key} className="px-3 py-2 text-[11px] leading-relaxed text-slate-600 overflow-hidden break-words">
                      {column.render ? (
                        column.render(value, row)
                      ) : (
                        <span className={column.emphasis ? "font-black text-[#0B2146]" : "font-medium"}>
                          {value !== undefined && value !== null && value !== "" ? String(value) : "-"}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InsightCard({ title, body, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-white shadow-3xs",
    mint: "border-emerald-200 bg-emerald-50/30 text-emerald-900",
    amber: "border-amber-200 bg-amber-50/30 text-amber-900",
    blue: "border-blue-200 bg-blue-50/30 text-blue-900",
  };

  return (
    <div className={cx("rounded-xl border p-2.5 flex flex-col justify-between", tones[tone] || tones.slate)}>
      <div>
        <h4 className="text-[9px] font-black uppercase tracking-wider text-[#0B2146] border-b border-slate-100 pb-0.5 mb-1">
          {title}
        </h4>
        <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{body}</p>
      </div>
    </div>
  );
}

function CoverWorkflowStep({ stepNumber, label, description }) {
  return (
    <div className="flex gap-3 text-left items-start py-2 border-b border-slate-100 last:border-0">
      <div className="h-7 w-7 rounded-lg bg-slate-100 border flex items-center justify-center font-black text-xs text-[#2583CF] shrink-0 shadow-3xs">
        {stepNumber}
      </div>
      <div>
        <h4 className="text-xs font-black text-[#0B2146] tracking-tight">{label}</h4>
        <p className="text-[10px] font-medium text-slate-500 leading-snug mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function BulletList({ items, markerTone = "bg-[#2583CF]" }) {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-1">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex gap-2 text-[11px] leading-relaxed text-slate-600 font-medium bg-white p-2 rounded-xl border border-slate-150 shadow-3xs">
          <span className={cx("mt-1.5 h-1 w-1 shrink-0 rounded-full shadow-3xs", markerTone)} />
          <span className="min-w-0 flex-1">{item}</span>
        </div>
      ))}
    </div>
  );
}

// Fixed parameter label bug
function ScoreRow({ label, score }) {
  const safeScore = normalizeScore(score);
  const tone = safeScore >= 80 ? "bg-emerald-500" : safeScore >= 60 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="flex items-center justify-between gap-3 p-1 rounded-xl bg-slate-50 border border-slate-100">
      <span className="text-[11px] font-bold text-slate-700 truncate min-w-0 flex-1">{label}</span>
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-slate-200 hidden sm:block">
          <div className={cx("h-full rounded-full transition-all duration-300", tone)} style={{ width: `${safeScore}%` }} />
        </div>
        <span className="text-[10px] font-black bg-white px-1.5 py-0.5 rounded border shadow-3xs text-slate-800 min-w-[26px] text-center">
          {safeScore}
        </span>
      </div>
    </div>
  );
}

function ATSPrintReport({
  report,
  resume,
  candidateName: passedCandidateName,
  requirementCheckerPrimaryRows,
  requirementCheckerContinuationRows,
  parsingHealthRows,
  formattingRecommendations,
  requirementOutcomeSummary,
  scorecardRows,
  biReportingSection,
  aiMlSection,
  governanceSection,
  keywordCoverageSection,
  leadershipSection,
  experienceEvidenceSection,
  riskFlagsSection,
  rewriteSection,
  finalVerdictSection,
  dashboardOverallScore,
}) {
  const executive = report?.executive_summary || {};
  
  const candidateName = passedCandidateName || report?.candidate_name || resume?.candidate_name || report?.resume_file_name || "Applicant Profile";
  const targetRole = report?.target_role || report?.metadata?.target_role || report?.job_description?.title || report?.extracted_jd_data?.jd_profile?.target_role || resume?.target_role || "Business Intelligence Analytics Lead";
  const targetCompany = report?.target_company || report?.metadata?.target_company || report?.job_description?.company || report?.extracted_jd_data?.jd_profile?.company || "Government e Marketplace (GeM)";
  const reportDate = formatReportDate(report?.created_at);
  const topFix = executive.top_fixes?.[0] || null;
  const coverSummary = executive.recommendation || report?.summary || "Targeted structural optimization updates recommended.";

  let pageCounter = 0;
  const nextPage = () => {
    pageCounter += 1;
    return pageCounter;
  };

  return (
    <div className="print-report-shell font-sans antialiased text-slate-800" style={{ margin: 0, padding: 0 }}>
      
      {/* ================= PAGE 1: BRAND COVER TITLE PAGE ================= */}
      <PrintPage cover pageNumber={0}>
        <div className="flex h-full flex-col justify-between py-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-[#0B2146] flex items-center justify-center text-white text-xs font-black shadow-sm">CS</div>
              <span className="text-sm font-black uppercase tracking-[0.25em] text-[#0B2146]">CareerSense</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mt-1 pl-9">ATS Intelligence</p>
          </div>

          <div className="space-y-4 my-auto pl-9">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#2583CF]">ATS Resume Checker</span>
            <h1 className="text-[42px] font-black text-[#0B2146] tracking-tight leading-[1.05] mt-1">
              ATS Resume<br />Intelligence Report
            </h1>
            <p className="text-[#2583CF] font-bold text-lg mt-1 tracking-tight">Resume + Job Description Analysis</p>
            <p className="text-slate-500 font-medium text-xs max-w-[420px] leading-relaxed mt-2">
              A premium recruiter-readiness and ATS optimization report designed to uncover parsing issues, keyword gaps, formatting risks, and interview-blocking weaknesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_0.9fr] gap-5 items-stretch mt-6 pl-9">
            <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-3xs flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-2">Calculated System Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-[#0B2146] tracking-tighter">{normalizeScore(dashboardOverallScore)}</span>
                  <span className="text-slate-400 font-bold text-lg">/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-3 w-full border">
                  <div className="h-full bg-[#2583CF] rounded-full" style={{ width: `${normalizeScore(dashboardOverallScore)}%` }} />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1 text-[10px] font-black uppercase text-amber-700 tracking-wider mt-4 shadow-3xs">
                  ⚠️ Needs Improvement
                </div>
              </div>
              <p className="text-[11px] leading-normal text-slate-500 font-medium border-t pt-3 mt-4">
                The targeted resume records present healthy progress blocks, but optimization variables need sharper alignment before routing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-3xs flex flex-col justify-between">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block mb-2 border-b pb-1">Our System Assessment Process</span>
              <div className="flex flex-col min-h-0">
                <CoverWorkflowStep stepNumber="01" label="Upload Resume File" description="Structural checks verifying text heading tag readability lines." />
                <CoverWorkflowStep stepNumber="02" label="Analyze Context Gaps" description="Inspecting dictionary definitions for tech tool density rows." />
                <CoverWorkflowStep stepNumber="03" label="Map Target Job Description" description="Synthesizing operational criteria to spot missing compliance targets." />
                <CoverWorkflowStep stepNumber="04" label="Guided Fix Roadmap" description="Compiling action priority logs to growth-hack placement scores." />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-6 pl-9 grid grid-cols-2 gap-y-4 gap-x-8 text-slate-600">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Prepared For</p>
              <p className="text-sm font-black text-[#0B2146] mt-0.5">{candidateName}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Report Type</p>
              <p className="text-sm font-bold text-[#0B2146] mt-0.5">Resume + JD ATS Check</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Generated On</p>
              <p className="text-sm font-bold text-[#0B2146] mt-0.5">{reportDate}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Workspace</p>
              <p className="text-sm font-bold text-[#0B2146] mt-0.5">CareerSense</p>
            </div>
          </div>
        </div>
      </PrintPage>
      
      {/* ================= PAGE 2: DASHBOARD FIT OVERVIEW ================= */}
      <PrintPage pageNumber={nextPage()} footerLabel={`${candidateName} ATS Report`}>
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-[#0B2146] flex items-center justify-center text-white text-[8px] font-black">CS</div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2583CF]">CareerSense AI</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-[#0B2146] pt-1">
                  ATS Fit Report Dashboard
                </h2>
                <p className="text-[11px] font-medium text-slate-400 max-w-[320px] leading-relaxed">
                  High-fidelity operational layout mapping corporate screening variables and pipeline safety flags.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-right shadow-3xs">
                <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Generated On</p>
                <p className="text-xs font-black text-[#0B2146] mt-0.5">{reportDate}</p>
              </div>
            </div>

            <div className="rounded-xl bg-[#0B2146] p-4 text-white shadow-sm relative overflow-hidden border border-slate-800">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-400">Target Candidate Profile</span>
              <h2 className="text-lg font-black tracking-tight mt-0.5">{candidateName}</h2>
              
              <div className="mt-3 grid gap-3 sm:grid-cols-2 border-t border-slate-700/60 pt-2.5 text-xs">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Target Functional Objective</p>
                  <p className="font-bold text-slate-100 mt-0.5 leading-snug">{targetRole}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Target Organization Target</p>
                  <p className="font-bold text-slate-100 mt-0.5 leading-snug">{targetCompany}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <MetricBubble score={dashboardOverallScore} label="Overall Match" tone="amber" />
              <MetricBubble score={finalVerdictSection?.currentScore ?? dashboardOverallScore} label="Current Rating" tone="blue" />
              <MetricBubble score={finalVerdictSection?.potentialScore ?? dashboardOverallScore} label="Potential Cap" tone="emerald" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-3xs space-y-1">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Hiring Readiness Summary Narrative</p>
              <p className="text-xs leading-relaxed text-slate-600 font-medium">{coverSummary}</p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6 border-t border-slate-200 pt-3 mt-auto">
            <div className="max-w-[440px] space-y-0.5">
              <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Routing Direct Signal</p>
              <p className="text-xs font-black text-[#0B2146]">
                {finalVerdictSection?.verdictTitle || executive.decision_signal || "Revision recommended before application."}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                {topFix?.recommended_action || requirementOutcomeSummary}
              </p>
            </div>
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border shadow-3xs shrink-0">
              Confidential Audit
            </span>
          </div>
        </div>
      </PrintPage>

      {/* ================= PAGE 3: GENERATED STRATEGIC COVER LETTER ================= */}
      <PrintPage pageNumber={nextPage()} footerLabel="Generated Cover Letter">
        <SectionTitle
          eyebrow="Application Artifact"
          title="Targeted Strategic Cover Letter"
          description="A tailored, high-impact framework mapping your core verified strengths directly to job requirements."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-5 items-stretch min-h-0 flex-1 overflow-hidden mt-1 max-h-[85%]">
          
          {/* Left Themed Info Metadata Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 flex flex-col justify-between space-y-4 shadow-3xs shrink-0">
            <div className="space-y-3">
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Recipient Group</span>
                <p className="text-[11px] font-black text-[#0B2146] mt-0.5 leading-tight">Recruitment Selection Committee</p>
                <p className="text-[10px] font-semibold text-slate-500">{targetCompany}</p>
              </div>
              
              <div className="border-t border-slate-200/60 pt-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Date Window</span>
                <p className="text-[11px] font-bold text-slate-700 mt-0.5">{reportDate}</p>
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-2 space-y-1.5">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Target Verticals</span>
              <div className="flex flex-wrap gap-1">
                <span className="text-[9px] font-black bg-white border px-1.5 py-0.5 rounded text-[#0B2146]">Procurement</span>
                <span className="text-[9px] font-black bg-white border px-1.5 py-0.5 rounded text-[#0B2146]">BI Analytics</span>
                <span className="text-[9px] font-black bg-white border px-1.5 py-0.5 rounded text-[#0B2146]">SQL Database</span>
              </div>
            </div>
          </div>

          {/* Right Letter Narrative Body */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-[11px] sm:text-xs leading-relaxed text-slate-600 font-medium space-y-3 shadow-3xs overflow-y-auto pr-2">
            <p className="font-bold text-[#0B2146]">Dear Hiring Team,</p>
            
            <p>
              I am writing to express my strong interest in the <span className="font-bold text-[#0B2146]">{targetRole}</span> position at <span className="font-bold text-[#0B2146]">{targetCompany}</span>. With over 11 years of progressive leadership spanning Business Intelligence function setups, centralized MIS architectures, and operational automation pipelines, I bring a proven record of converting complex ecosystem parameters into highly responsive leadership insights.
            </p>

            <p>
              In my recent corporate history, I spearheaded the deployment of advanced analytics loops and data reporting visualizations across platforms such as Power BI, Tableau, and QlikView. My experience designing information reconciliation architectures aligns seamlessly with your requirements for robust quality assurance structures and systematic stakeholder lifecycle management. I specialize in mapping functional business problems directly onto quantitative KPI frameworks that optimize routing pipelines and mitigate risk overhead.
            </p>

            <p>
              Furthermore, my background managing technical teams across diverse data platforms (including SQL, SAS, and ERP databases) guarantees that I can step into your technical environment and drive immediate structural value. I am highly motivated by the opportunity to apply this data-driven performance model to the high-scale metrics required by your organization.
            </p>

            <p>
              Thank you for your time, consideration, and systemic review of my qualifications. I look forward to discussing how my background matches your current technical requirements.
            </p>
            
            <div className="pt-3 border-t space-y-0.5 text-left">
              <p className="text-slate-400 text-[10px]">Sincerely,</p>
              <p className="font-black text-[#0B2146] text-sm">{candidateName}</p>
            </div>
          </div>

        </div>
      </PrintPage>

      {/* ================= PAGE 4: EXECUTIVE SUMMARY ================= */}
      <PrintPage pageNumber={nextPage()} footerLabel="Executive Summary">
        <SectionTitle
          eyebrow="Workspace Ingestion Synthesis"
          title="Executive Summary"
          description="Recruiter-facing tracking evaluation detailing alignment upside, matching variables, and primary optimization vectors."
        />

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-[130px_1fr] items-start mt-1">
          <div className="flex justify-center w-full bg-slate-50 p-1.5 rounded-xl border border-slate-150 shadow-3xs">
            <MetricBubble score={finalVerdictSection?.currentScore ?? dashboardOverallScore} label="Base Index" tone="amber" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-3xs flex flex-col justify-center">
            <h3 className="text-xs font-black text-[#0B2146] border-b border-slate-100 pb-0.5 mb-1">
              {finalVerdictSection?.verdictTitle || executive.decision_signal || "Hiring Readiness Signal"}
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
              {finalVerdictSection?.verdictBody || coverSummary}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mt-2.5">
          <InsightCard
            title="Critical Correction Path"
            tone="amber"
            body={topFix?.why_it_matters || requirementOutcomeSummary}
          />
          <InsightCard
            title="Projected Score Upside"
            tone="mint"
            body={
              finalVerdictSection
                ? `Current mapping confirms ${finalVerdictSection.currentScore}% baseline. Resolving missing technical validation hooks triggers structural delta pathing up to ${finalVerdictSection.potentialScore}%.`
                : "Dynamic alignment projection variables not loaded in payload loop."
            }
          />
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mt-3 space-y-1">
          <h4 className="text-[9px] font-black text-[#0B2146] uppercase tracking-wider">Baseline Pipeline Placement State</h4>
          <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
            The profile displays strong operational maturity in Business Intelligence leadership, management dashboarding, and report orchestration layers. However, modern tracking filter thresholds require tighter context alignment in predictive analysis use-cases, system data validation, and enterprise warehouse infrastructure specifications.
          </p>
        </div>
      </PrintPage>

      {/* ================= PAGE 5: METHODOLOGY ================= */}
      <PrintPage pageNumber={nextPage()} footerLabel="Methodology">
        <SectionTitle
          eyebrow="Evaluation Controls"
          title="Scoring Methodology Framework"
          description="Systemic validation boundaries parsing alignment weight distributions across institutional scanning filters."
        />
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 mt-0.5 shadow-3xs space-y-2.5">
          <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
            The CareerSense intelligence core audits artifact formatting and document parsing strings identically to modern corporate scanning systems, tracking verification tokens rather than plain text keyword frequency counts.
          </p>
          <BulletList
            items={[
              "Structural Extraction Safety: Audits page layouts, nested tables, multi-column blocks, and heading tags to ensure error-free indexation.",
              "Constraint Matrix Coverage: Measures structural proof indicators matching listed must-have roles and experience benchmarks.",
              "Linguistic Context Density: Separates proactive achievement-driven action verbs from passive, duty-focused task phrasing strings.",
              "Objection Model Risks: Highlights critical qualification mismatches, missing validation criteria, and technical depth deficits.",
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-3 pt-1">
          <div className="p-1.5 bg-emerald-50/50 border border-emerald-200 rounded-lg text-center">
            <span className="text-[9px] font-black text-emerald-800 block">STRONG MATCH</span>
          </div>
          <div className="p-1.5 bg-amber-50/50 border border-amber-200 rounded-lg text-center">
            <span className="text-[9px] font-black text-amber-800 block">PARTIAL MATCH</span>
          </div>
          <div className="p-1.5 bg-rose-50/50 border border-rose-200 rounded-lg text-center">
            <span className="text-[9px] font-black text-rose-800 block">CRITICAL GAP</span>
          </div>
        </div>
      </PrintPage>

      {/* ================= PAGE 6: REQUIREMENT CHECKER ================= */}
      {requirementCheckerPrimaryRows?.length > 0 && (
        <PrintPage pageNumber={nextPage()} footerLabel="Requirement Checker">
          <SectionTitle
            eyebrow="Constraint Auditing"
            title="Primary Requirement Checker"
            description="Point-by-point cross-reference validating structural experience elements against listed mandate criteria."
          />
          <div className="mt-0.5 min-h-0 flex-1 flex flex-col justify-start overflow-hidden max-h-[90%]">
            <DataTable
              columns={[
                { key: "requirement", label: "JD Target Constraint", width: "25%", emphasis: true },
                { key: "evidence", label: "Extracted Resume Evidence", width: "34%" },
                {
                  key: "status",
                  label: "Signal",
                  width: "15%",
                  render: (val) => <StatusBadge status={val}>{val}</StatusBadge>,
                },
                { key: "explanation", label: "Correction Vector Guideline", width: "26%" },
              ]}
              rows={requirementCheckerPrimaryRows.slice(0, 8)}
            />
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 7: REQUIREMENT CONTINUATION ================= */}
      {((requirementCheckerContinuationRows?.length > 0) || (requirementCheckerPrimaryRows?.length > 8)) && (
        <PrintPage pageNumber={nextPage()} footerLabel="Requirement Continuation">
          <SectionTitle
            eyebrow="Constraint Auditing"
            title="Secondary Requirements Ledger"
            description="Continuation analysis mapping remaining technical competencies and preferred background filters."
          />
          <div className="mt-0.5 min-h-0 flex-1 flex flex-col justify-start overflow-hidden max-h-[76%]">
            <DataTable
              columns={[
                { key: "requirement", label: "JD Target Constraint", width: "25%", emphasis: true },
                { key: "evidence", label: "Extracted Resume Evidence", width: "34%" },
                {
                  key: "status",
                  label: "Signal",
                  width: "15%",
                  render: (val) => <StatusBadge status={val}>{val}</StatusBadge>,
                },
                { key: "explanation", label: "Correction Vector Guideline", width: "26%" },
              ]}
              rows={requirementCheckerContinuationRows?.length ? requirementCheckerContinuationRows.slice(0, 8) : requirementCheckerPrimaryRows.slice(8, 16)}
            />
          </div>

          <div className="mt-2.5 rounded-xl border border-amber-200 bg-amber-50/40 p-2.5 shrink-0">
            <h3 className="text-[9px] font-black text-amber-800 uppercase tracking-wider">Main Constraint Matrix Outcome</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-700 font-medium">{requirementOutcomeSummary}</p>
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 8: ATS PARSING ================= */}
      {parsingHealthRows?.length > 0 && (
        <PrintPage pageNumber={nextPage()} footerLabel="ATS Parsing &amp; Structure">
          <SectionTitle
            eyebrow="Structural Validation"
            title="Parsing Health &amp; Extraction Integrity"
            description="Audits compliance layout configurations to ensure error-free search engine data processing."
          />
          <div className="mt-0.5 min-h-0 flex-1 flex flex-col justify-start overflow-hidden max-h-[76%]">
            <DataTable
              columns={[
                { key: "check", label: "Validation Node", width: "20%", emphasis: true },
                { key: "finding", label: "Parsed Layout State", width: "34%" },
                {
                  key: "status",
                  label: "Compliance",
                  width: "16%",
                  render: (val) => <StatusBadge status={val}>{val}</StatusBadge>,
                },
                { key: "why", label: "Database Pipeline Routing Impact", width: "30%" },
              ]}
              rows={parsingHealthRows}
            />
          </div>

          {formattingRecommendations?.length > 0 && (
            <div className="mt-2.5 rounded-xl border border-blue-200 bg-blue-50/40 p-2.5 shrink-0">
              <h3 className="text-[9px] font-black text-blue-800 uppercase tracking-wider mb-1">Structural Layout Refinement Guidelines</h3>
              <BulletList items={formattingRecommendations.slice(0, 3)} markerTone="bg-blue-500" />
            </div>
          )}
        </PrintPage>
      )}

      {/* ================= PAGE 9: SCORECARD ================= */}
      {scorecardRows?.length > 0 && (
        <PrintPage pageNumber={nextPage()} footerLabel="Scorecard">
          <SectionTitle
            eyebrow="Placement Grading"
            title="Operational Category Scorecard"
            description="Structured multi-dimensional view of matching thresholds cross-referenced against historical repository logs."
          />
          <div className="mt-0.5 space-y-1.5 max-h-[82%] overflow-hidden pr-0.5">
            {scorecardRows.slice(0, 9).map((row) => (
              <ScoreRow key={row.label} label={row.label} score={row.score} />
            ))}
          </div>
          <div className="mt-2.5 rounded-xl border bg-slate-50 p-2 text-[10px] font-medium text-slate-500 leading-relaxed shrink-0">
            <span className="font-black text-[#0B2146] uppercase block mb-0.5">Vector Scale Reading Rules</span>
            Scores above 80 indicate strong, extractable proof metrics inside experience rows. Gaps under 60 represent critical placement sorting blocks.
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 10: BI DASHBOARDS ================= */}
      {biReportingSection && (biReportingSection.evidence?.length > 0 || biReportingSection.improvements?.length > 0) && (
        <PrintPage pageNumber={nextPage()} footerLabel="BI Dashboards &amp; Reporting">
          <SectionTitle
            eyebrow="Competency Mapping"
            title="BI, Dashboards &amp; Corporate Reporting"
            description="Isolates core reporting data, automation architectures, and data orchestration proof fields within historical rows."
          />

          <div className="space-y-2.5 min-h-0 flex-1 flex flex-col justify-between mt-0.5">
            <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-150 shadow-3xs shrink-0">
              <div className="h-9 w-11 rounded-lg bg-emerald-600 text-white flex flex-col items-center justify-center text-center font-black shrink-0 shadow-sm">
                <span className="text-xs">{biReportingSection.score}%</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-black text-[#0B2146]">{biReportingSection.performance}</h3>
                <p className="text-[11px] font-medium text-slate-500 truncate leading-relaxed">{biReportingSection.summary}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 min-h-0 flex-1 overflow-hidden py-0.5">
              <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-3xs overflow-hidden flex flex-col">
                <h4 className="text-[9px] font-black text-emerald-800 uppercase tracking-wider border-b pb-0.5 mb-1">Verified Evidence</h4>
                <div className="overflow-y-auto flex-1 pr-0.5">
                  <BulletList items={biReportingSection.evidence?.slice(0, 3)} markerTone="bg-emerald-500" />
                </div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-2.5 shadow-3xs overflow-hidden flex flex-col">
                <h4 className="text-[9px] font-black text-amber-800 uppercase tracking-wider border-b pb-0.5 mb-1">Optimization Fixes</h4>
                <div className="overflow-y-auto flex-1 pr-0.5">
                  <BulletList items={biReportingSection.improvements?.slice(0, 3)} markerTone="bg-amber-500" />
                </div>
              </div>
            </div>

            {biReportingSection.positioning && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-2 text-[11px] font-medium text-blue-900 shrink-0">
                "{biReportingSection.positioning}"
              </div>
            )}
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 11: KEYWORD COVERAGE ================= */}
      {keywordCoverageSection && (keywordCoverageSection.matchedKeywords?.length > 0 || keywordCoverageSection.missingWeak?.length > 0) && (
        <PrintPage pageNumber={nextPage()} footerLabel="Tools &amp; Keyword Coverage">
          <SectionTitle
            eyebrow="Linguistic Context"
            title="Tools &amp; Keyword Density Mapping"
            description="Isolates verified direct phrasing hits from tracking gaps that decrease search correlation values."
          />
          <div className="grid gap-3 sm:grid-cols-2 min-h-0 flex-1 overflow-hidden mt-0.5">
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-3xs overflow-hidden flex flex-col">
              <h3 className="text-[9px] font-black text-emerald-700 uppercase tracking-wider border-b pb-0.5 mb-1.5">Indexed Target Phrases</h3>
              <div className="flex flex-wrap gap-1 overflow-y-auto flex-1 pr-0.5 content-start">
                {keywordCoverageSection.matchedKeywords?.slice(0, 20).map((term, idx) => (
                  <span key={idx} className="rounded bg-emerald-50 border border-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-bold shadow-3xs">
                    {term}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-3xs overflow-hidden flex flex-col">
              <h3 className="text-[9px] font-black text-rose-700 uppercase tracking-wider border-b pb-0.5 mb-1.5">Missing Context Gaps</h3>
              <div className="flex flex-wrap gap-1 overflow-y-auto flex-1 pr-0.5 content-start">
                {keywordCoverageSection.missingWeak?.slice(0, 20).map((item, idx) => (
                  <span key={idx} className={cx("rounded border px-1.5 py-0.5 text-[9px] font-bold shadow-3xs text-white", item.tone === "gap" ? "bg-rose-500 border-rose-600" : "bg-amber-500 border-amber-600")}>
                    {item.term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 12: ADVANCED ANALYTICS ================= */}
      {aiMlSection && aiMlSection.rows?.length > 0 && (
        <PrintPage pageNumber={nextPage()} footerLabel="Advanced Analytics">
          <SectionTitle
            eyebrow="Domain Fit"
            title="Advanced Analytics &amp; AI/ML Models"
            description="Audits heavier engineering capabilities, modeling scripts, and quantitative analysis markers required for senior placement."
          />

          <div className="space-y-2.5 min-h-0 flex-1 flex flex-col justify-between mt-0.5 max-h-[88%]">
            <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-150 shrink-0">
              <div className="h-9 w-9 rounded bg-rose-600 text-white flex flex-col items-center justify-center text-center font-black shrink-0 shadow-sm">
                <span className="text-[11px]">{aiMlSection.score}%</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-[11px] font-black text-[#0B2146]">{aiMlSection.performance}</h3>
                <p className="text-[10px] font-medium text-slate-500 truncate">{aiMlSection.summary}</p>
              </div>
            </div>
            
            <div className="min-h-0 flex-1 flex flex-col justify-start overflow-hidden">
              <DataTable
                columns={[
                  { key: "requirement", label: "Model Mandate Group", width: "25%", emphasis: true },
                  { key: "evidence", label: "Artifact Evidence Correlated", width: "32%" },
                  {
                    key: "status",
                    label: "Signal",
                    width: "15%",
                    render: (val) => <StatusBadge status={val}>{val}</StatusBadge>,
                  },
                  { key: "add", label: "Required Phrasing Optimization", width: "28%" },
                ]}
                rows={aiMlSection.rows.slice(0, 5)}
              />
            </div>

            {aiMlSection.proofFormat && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-2 text-[11px] font-medium text-amber-900 shrink-0 leading-relaxed">
                {aiMlSection.proofFormat}
              </div>
            )}
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 13: DATA GOVERNANCE ================= */}
      {governanceSection && (governanceSection.cards?.length > 0 || governanceSection.notes?.length > 0 || governanceSection.riskRows?.length > 0) && (
        <PrintPage pageNumber={nextPage()} footerLabel="Data Governance">
          <SectionTitle
            eyebrow="Domain Fit"
            title="Data Governance, Quality &amp; Architecture"
            description="Audits data infrastructure security parameters, integration schemas, and repository structural designs."
          />

          <div className="space-y-2.5 min-h-0 flex-1 flex flex-col justify-start mt-0.5 max-h-[88%]">
            {governanceSection.cards?.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-3 shrink-0">
                {governanceSection.cards.slice(0, 3).map((card, index) => (
                  <InsightCard
                    key={index}
                    title={card.title}
                    body={card.summary}
                    tone="blue"
                  />
                ))}
              </div>
            )}

            {governanceSection.notes?.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 min-h-0 flex-1 flex flex-col overflow-hidden max-h-[45%]">
                <div className="overflow-y-auto flex-1 pr-0.5">
                  <BulletList items={governanceSection.notes.slice(0, 4)} />
                </div>
              </div>
            )}

            {governanceSection.riskRows?.length > 0 && (
              <div className="space-y-1 min-h-0 flex-1 overflow-hidden">
                <DataTable
                  columns={[
                    { key: "phrase", label: "JD Target Component", width: "40%", emphasis: true },
                    { key: "signal", label: "Current Context Signal", width: "44%" },
                    { key: "risk", label: "Objection Threat", width: "16%" },
                  ]}
                  rows={governanceSection.riskRows.slice(0, 3).map((row) => ({
                    ...row,
                    status: row.risk === "High" ? "gap" : "partial",
                  }))}
                />
              </div>
            )}
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 14: LEADERSHIP FIT ================= */}
      {leadershipSection && (leadershipSection.evidence?.length > 0 || leadershipSection.improvements?.length > 0) && (
        <PrintPage pageNumber={nextPage()} footerLabel="Leadership Fit">
          <SectionTitle
            eyebrow="Operational Capability"
            title="Leadership &amp; Stakeholder Alignment"
            description="Audits cross-functional coordination loops, executive reporting visibility, and team steering metrics."
          />

          <div className="space-y-2.5 min-h-0 flex-1 flex flex-col justify-between mt-0.5 max-h-[88%]">
            <div className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-150 shrink-0">
              <div className="h-9 w-9 rounded bg-emerald-600 text-white flex flex-col items-center justify-center text-center font-black shrink-0 shadow-sm">
                <span className="text-[11px]">{leadershipSection.score}%</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-black text-[#0B2146]">{leadershipSection.performance}</h3>
                <p className="text-[10px] font-medium text-slate-500 truncate leading-relaxed">{leadershipSection.summary}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 min-h-0 flex-1 overflow-hidden py-0.5">
              <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-3xs overflow-hidden flex flex-col">
                <h4 className="text-[9px] font-black text-emerald-800 uppercase tracking-wider border-b pb-0.5 mb-1">Stakeholder Evidence</h4>
                <div className="overflow-y-auto flex-1 pr-0.5">
                  <BulletList items={leadershipSection.evidence.slice(0, 3)} markerTone="bg-emerald-500" />
                </div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-2.5 shadow-3xs overflow-hidden flex flex-col">
                <h4 className="text-[9px] font-black text-amber-800 uppercase tracking-wider border-b pb-0.5 mb-1">Refinement Paths</h4>
                <div className="overflow-y-auto flex-1 pr-0.5">
                  <BulletList items={leadershipSection.improvements.slice(0, 3)} markerTone="bg-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 15: RISK FLAGS ================= */}
      {riskFlagsSection?.length > 0 && (
        <PrintPage pageNumber={nextPage()} footerLabel="Risk Flags">
          <SectionTitle
            eyebrow="Objection Framework"
            title="Risk Flags &amp; Gatekeeper Filters"
            description="Highlights candidate background gaps and formatting risks that automated tracking system screeners flag first."
          />

          <div className="mt-0.5 min-h-0 flex-1 flex flex-col justify-start overflow-hidden max-h-[88%]">
            <DataTable
              columns={[
                { key: "flag", label: "Objection Vector", width: "25%", emphasis: true },
                { key: "severity", label: "Threat", width: "14%", render: (val) => <StatusBadge status={val}>{val}</StatusBadge> },
                { key: "why", label: "Screening Core Vulnerability", width: "31%" },
                { key: "handle", label: "Recommended Mitigation Strategy", width: "30%" },
              ]}
              rows={riskFlagsSection.slice(0, 7)}
            />
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 16: REWRITE RECOMMENDATIONS ================= */}
      {rewriteSection && (rewriteSection.summaryDraft || rewriteSection.bulletPairs?.length > 0) && (
        <PrintPage pageNumber={nextPage()} footerLabel="Rewrite Recommendations">
          <SectionTitle
            eyebrow="Placement Optimization"
            title="Resume Content Rewrite Samples"
            description="Transforms analytical diagnostic findings into structural phrase corrections for your template draft."
          />

          <div className="space-y-2.5 min-h-0 flex-1 overflow-hidden mt-0.5 max-h-[88%]">
            {rewriteSection.summaryDraft && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-2.5 shrink-0">
                <h4 className="text-[9px] font-black text-blue-900 uppercase tracking-wider border-b pb-0.5 mb-1">Professional Summary Proposal</h4>
                <p className="text-[11px] leading-relaxed text-slate-700 font-medium italic">"{rewriteSection.summaryDraft}"</p>
              </div>
            )}

            {rewriteSection.bulletPairs?.length > 0 && (
              <div className="space-y-2 min-h-0 flex-1 flex flex-col overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-0.5 shrink-0">Target Bullet Point Performance Upgrades</p>
                <div className="overflow-y-auto flex-1 space-y-2 pr-0.5">
                  {rewriteSection.bulletPairs.slice(0, 3).map((pair) => (
                    <div key={pair.id} className="grid gap-1 border border-slate-200 bg-slate-50 p-2 rounded-xl shadow-3xs">
                      <div className="rounded border border-amber-200 bg-amber-50/40 px-2 py-1 text-[11px] leading-normal font-medium font-mono text-slate-600">
                        <span className="mr-1.5 rounded bg-amber-500 px-1 py-0.2 text-[8px] font-black text-white uppercase">Before</span>
                        "{pair.before}"
                      </div>
                      <div className="rounded border border-emerald-200 bg-emerald-50/40 px-2 py-1 text-[11px] leading-normal font-bold text-slate-800">
                        <span className="mr-1.5 rounded bg-emerald-600 px-1 py-0.2 text-[8px] font-black text-white uppercase">After</span>
                        "{pair.after}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 17: FINAL VERDICT ================= */}
      {finalVerdictSection && (
        <PrintPage pageNumber={nextPage()} footerLabel="Final Verdict">
          <SectionTitle
            eyebrow="Placement Action Plan"
            title="Strategic Placement Priority Roadmap"
            description="Definitive action loop execution mapping growth upside values prior to pipeline submission loops."
          />

          <div className="space-y-2.5 min-h-0 flex-1 flex flex-col justify-between mt-0.5 max-h-[88%]">
            <div className="rounded-xl bg-[#0B2146] p-3 text-white shadow-sm flex flex-col sm:flex-row sm:items-center gap-3.5 border shrink-0">
              <div className="flex gap-1.5 shrink-0">
                <div className="h-10 w-10 rounded bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-amber-400">{finalVerdictSection.currentScore}%</span>
                </div>
                <div className="h-10 w-10 rounded bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-emerald-400">{finalVerdictSection.potentialScore}%</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[9px] font-black text-amber-400 uppercase tracking-wider">{finalVerdictSection.verdictTitle}</h3>
                <p className="text-[11px] leading-relaxed text-slate-300 font-medium">{finalVerdictSection.verdictBody}</p>
              </div>
            </div>

            <div className="min-h-0 flex-1 flex flex-col justify-start overflow-hidden">
              <DataTable
                columns={[
                  { key: "priority", label: "Rank", width: "12%", emphasis: true },
                  { key: "action", label: "Required Strategic Content Action", width: "70%" },
                  { key: "impact", label: "Delta Growth", width: "18%" },
                ]}
                rows={finalVerdictSection.actionRows?.slice(0, 5)}
              />
            </div>

            <p className="text-[9px] font-medium text-slate-400 leading-normal bg-slate-50 border p-1.5 rounded-xl shrink-0">
              Verification Notice: {finalVerdictSection.disclaimer}
            </p>
          </div>
        </PrintPage>
      )}

      {/* ================= PAGE 18: APPENDIX EVIDENCE MAP ================= */}
      {experienceEvidenceSection && experienceEvidenceSection.rows?.length > 0 && (
        <PrintPage pageNumber={nextPage()} footerLabel="Appendix Layout Map">
          <SectionTitle
            eyebrow="Dynamic Content Mapping"
            title="Experience Evidence Blueprint Map"
            description="Pinpoints exactly where validated requirement records show up inside candidate historical chronicles."
          />

          <div className="space-y-2.5 min-h-0 flex-1 flex flex-col justify-between mt-0.5 max-h-[88%]">
            <div className="min-h-0 flex-1 flex flex-col justify-start overflow-hidden">
              <DataTable
                columns={[
                  { key: "role", label: "Historical Role Position", width: "26%", emphasis: true },
                  { key: "evidence", label: "Correlated Artifact Text Asset", width: "58%" },
                  { key: "fit", label: "Match Fit", width: "16%" },
                ]}
                rows={experienceEvidenceSection.rows.slice(0, 6)}
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 shrink-0">
              <h4 className="text-[9px] font-black text-[#0B2146] uppercase tracking-wider">Chronological Alignment Logic</h4>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{experienceEvidenceSection.strategy}</p>
            </div>
          </div>
        </PrintPage>
      )}
      
    </div>
  );
}

export default ATSPrintReport;