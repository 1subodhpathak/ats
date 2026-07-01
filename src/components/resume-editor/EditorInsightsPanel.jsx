import { useState } from "react";
import {
  Bot,
  ChevronDown,
  FileSearch,
  LayoutTemplate,
  MessageSquareText,
  ScanText,
  Sparkles,
} from "lucide-react";

import Button from "../common/Button";
import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";

const insightMeta = [
  {
    key: "keyword_match",
    title: "Keyword Match",
    description: "Missing role terms and stack vocabulary.",
    icon: FileSearch,
  },
  {
    key: "role_relevance",
    title: "Role Relevance",
    description: "How tightly the resume aligns to the target role.",
    icon: ScanText,
  },
  {
    key: "clarity",
    title: "Language Improvement",
    description: "Sharper phrasing and cleaner sentence construction.",
    icon: MessageSquareText,
  },
  {
    key: "grammar",
    title: "Grammar Accuracy",
    description: "Grammar and sentence polish across sections.",
    icon: MessageSquareText,
  },
  {
    key: "impact",
    title: "Impact & Metrics",
    description: "Add measurable wins and business outcomes.",
    icon: Sparkles,
  },
  {
    key: "action_verbs",
    title: "Action Verbs",
    description: "Stronger verbs make bullets more convincing.",
    icon: Bot,
  },
  {
    key: "formatting",
    title: "Layout Improvement",
    description: "Scanning comfort, spacing, and visual structure.",
    icon: LayoutTemplate,
  },
  {
    key: "ats_readability",
    title: "ATS Readability",
    description: "Parser-friendly structure and plain-text resilience.",
    icon: ScanText,
  },
  {
    key: "section_completeness",
    title: "Section Completeness",
    description: "Coverage of core ATS sections and resume essentials.",
    icon: FileSearch,
  },
  {
    key: "jd_match_score",
    title: "Job Match",
    description: "Alignment against the pasted job description.",
    icon: Sparkles,
  },
];

function resolveValue(meta, atsResult, jdResult) {
  if (meta.key === "jd_match_score") {
    return jdResult?.jd_match_score ?? 0;
  }
  return atsResult?.breakdown?.[meta.key] ?? 0;
}

function getPriority(value) {
  if (value < 50) {
    return { label: "High Priority", tone: "bg-rose-100 text-rose-700" };
  }
  if (value < 70) {
    return { label: "Medium Priority", tone: "bg-amber-100 text-amber-700" };
  }
  return { label: "Healthy", tone: "bg-emerald-100 text-emerald-700" };
}

function getResumeLines(resume) {
  return (
    resume?.sections?.flatMap((section) =>
      section.items.map((item) => ({
        lineId: item.line_id,
        sectionId: section.section_id,
        section: section.section_name,
        text: item.text || item.original_text || "",
        score: item.score || 0,
        issues: item.issues || [],
      }))
    ) || []
  ).filter((line) => line.text.trim());
}

function shortLine(text) {
  if (!text) {
    return "Add a stronger resume line here.";
  }
  return text.length > 92 ? `${text.slice(0, 92)}...` : text;
}

const staticSectionPattern = /^(contact|personal|address|education|academic|certification|certifications)$/i;
const actionVerbPattern = /\b(achieved|analyzed|automated|built|created|delivered|designed|developed|drove|implemented|improved|increased|led|managed|optimized|reduced|resolved|streamlined|transformed)\b/i;
const staticContentPattern = /\b(address|phone|email|linkedin|github|portfolio|bachelor|master|university|college|school|education|gpa|stephenville|texas|usa|full time|part time|hybrid|remote|onsite)\b/i;

function cleanLineText(text = "") {
  return text
    .replace(/^[•*\-–—]\s*/, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.$/, "");
}

function startsWithActionVerb(text = "") {
  const firstWord = cleanLineText(text).split(/\s+/)[0] || "";
  return actionVerbPattern.test(firstWord);
}

function isStaticLine(line) {
  const sectionName = `${line.sectionId || ""} ${line.section || ""}`.toLowerCase();
  const text = line.text.toLowerCase();
  const commaCount = (line.text.match(/,/g) || []).length;
  const hasSentenceVerb = actionVerbPattern.test(text) || /\b(perform|present|support|create|fix|schedule|analyze|manage|lead|build|develop|design)\b/i.test(text);

  return (
    staticSectionPattern.test(sectionName.trim()) ||
    /\b(address|phone|email|linkedin|github|portfolio)\b/.test(sectionName) ||
    /\b(stephenville|texas|usa|full time|part time|hybrid|remote|onsite)\b/.test(text) ||
    /\b\d{5,6}\b/.test(text) ||
    /@/.test(text) ||
    /linkedin\.com|github\.com|mailto:|www\./.test(text) ||
    staticContentPattern.test(text) ||
    /\b(bachelor|master|university|college|school|education|gpa)\b/.test(text) ||
    (commaCount >= 3 && !hasSentenceVerb)
  );
}

function isActionableResumeLine(line) {
  const text = line.text.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (isStaticLine(line)) {
    return false;
  }

  if (wordCount < 6) {
    return false;
  }

  if (text.length < 38) {
    return false;
  }

  if (/^[A-Z\s&/.-]+$/.test(text) && wordCount <= 5) {
    return false;
  }

  if (text.includes("|") && wordCount < 10) {
    return false;
  }

  if (!/[.!?]$/.test(text) && !startsWithActionVerb(text) && wordCount < 12) {
    return false;
  }

  return true;
}

function getEditableResumeLines(resume) {
  return getResumeLines(resume).filter(isActionableResumeLine);
}

function normalizeForMatch(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function findLineIdForEvidence(resume, evidence = "") {
  const normalizedEvidence = normalizeForMatch(evidence);
  if (!normalizedEvidence) {
    return null;
  }

  const lines = getEditableResumeLines(resume);
  const exact = lines.find((line) => {
    const normalizedLine = normalizeForMatch(line.text);
    return normalizedLine.includes(normalizedEvidence) || normalizedEvidence.includes(normalizedLine);
  });

  return exact?.lineId || null;
}

function getResumeText(resume) {
  return getResumeLines(resume)
    .map((line) => line.text)
    .join(" ")
    .toLowerCase();
}

function getSectionNames(resume) {
  return (resume?.sections || [])
    .map((section) => `${section.section_id || ""} ${section.section_name || ""}`.toLowerCase())
    .join(" ");
}

function getMissingProfileChecks(resume) {
  const text = getResumeText(resume);
  const sections = getSectionNames(resume);
  const checks = [
    {
      missing: !/linkedin\.com|linkedin/.test(text),
      title: "Add LinkedIn profile",
      detail: "Add a clean LinkedIn URL in the contact header so recruiters can verify professional history quickly.",
      suggestion: "Use format: linkedin.com/in/your-name. Keep it on the same line as email/phone if space allows.",
    },
    {
      missing: !/github\.com|github|portfolio|behance|dribbble|personal website|website/.test(text),
      title: "Add portfolio or proof-of-work link",
      detail: "If relevant to the role, add GitHub, portfolio, dashboard, case study, or project links.",
      suggestion: "Add one high-signal link near contact details or under Projects, not several low-value links.",
    },
    {
      missing: !/certification|certifications|certificate|certified|aws|azure|google cloud|pmp|scrum|tableau|power bi/i.test(`${text} ${sections}`),
      title: "Add certifications section if applicable",
      detail: "No certification area was detected. Certifications can strengthen ATS completeness for technical, BI, PM, and operations roles.",
      suggestion: "Add a Certifications section with credential name, issuer, and year. Skip this only if you truly have none.",
    },
    {
      missing: !/summary|profile|professional summary/i.test(sections),
      title: "Add a focused professional summary",
      detail: "A concise summary helps ATS and recruiters understand target role, experience level, and strongest skills immediately.",
      suggestion: "Write 2-3 lines: target role + years/domain + top tools + measurable business strength.",
    },
    {
      missing: !/skills|technical skills|core competencies|area of expertise/i.test(sections),
      title: "Add a skills or core competencies section",
      detail: "A dedicated skills area improves keyword discovery and makes the resume easier to scan.",
      suggestion: "Group skills by category: Tools, Analytics, Domain, Leadership, Methods.",
    },
    {
      missing: !/project|projects|portfolio/i.test(sections),
      title: "Add projects only if they prove role fit",
      detail: "A project section can help when experience bullets do not fully show target-role skills.",
      suggestion: "Add 1-3 projects with tool, problem, action, and measurable result.",
    },
  ];

  return checks.filter((check) => check.missing);
}

function getDetectedKeywordGaps(resume) {
  const text = getResumeText(resume);
  const sections = getSectionNames(resume);
  const gaps = [
    {
      missing: !/linkedin\.com|linkedin/.test(text),
      keyword: "LinkedIn profile",
      detail: "Recruiters expect a LinkedIn URL in the contact area for verification and credibility.",
      suggestion: "Add linkedin.com/in/your-name beside email and phone.",
    },
    {
      missing: !/certification|certifications|certificate|certified/i.test(`${text} ${sections}`),
      keyword: "certifications",
      detail: "No certification keywords were detected. This can weaken ATS completeness for tool-heavy roles.",
      suggestion: "Add relevant credentials such as Power BI, Tableau, SQL, AWS, Azure, PMP, Scrum, or domain certifications if you have them.",
    },
    {
      missing: !/sql|python|power bi|tableau|excel|dashboard|analytics|automation|reporting/i.test(text),
      keyword: "technical/tool keywords",
      detail: "The resume needs searchable tool and platform terms connected to work examples.",
      suggestion: "Add tools inside achievement lines, for example: Automated reporting in Power BI/SQL to reduce manual effort by X%.",
    },
    {
      missing: !/stakeholder|cross-functional|leadership|managed|led|team/i.test(text),
      keyword: "leadership and stakeholder keywords",
      detail: "Leadership and collaboration keywords help match management and senior analyst roles.",
      suggestion: "Add a bullet showing who you worked with, what you led, and what changed because of it.",
    },
    {
      missing: !/reduced|improved|increased|saved|optimized|delivered|accelerated|automated/i.test(text),
      keyword: "impact verbs",
      detail: "ATS and recruiters look for result-oriented verbs, not only responsibility terms.",
      suggestion: "Rewrite passive bullets to start with Improved, Reduced, Automated, Optimized, Delivered, or Led.",
    },
    {
      missing: !/%|\b\d+x\b|\b\d+\+?\b/.test(text),
      keyword: "metrics",
      detail: "Few measurable outcomes were detected.",
      suggestion: "Add numbers for cost savings, cycle-time reduction, report volume, team size, users supported, or accuracy gains.",
    },
  ];

  return gaps.filter((gap) => gap.missing);
}

function inferActionContext(text = "") {
  const cleaned = cleanLineText(text);
  const lower = cleaned.toLowerCase();

  if (/financial statement|finance|account/i.test(cleaned)) {
    return {
      action: "Analyzed",
      object: "financial statements and accounting data",
      outcome: "improve reporting accuracy and support faster business decisions",
    };
  }

  if (/appointment|schedule|timetable|professor/i.test(cleaned)) {
    return {
      action: "Coordinated",
      object: "appointment scheduling and professor timetable workflows",
      outcome: "improve scheduling accuracy and reduce administrative follow-up",
    };
  }

  if (/dashboard|report|mis|analytics|data/i.test(cleaned)) {
    return {
      action: "Built",
      object: "reporting dashboards and analytics workflows",
      outcome: "improve visibility into business performance and reduce manual reporting effort",
    };
  }

  if (/process|automation|optimization|operation/i.test(cleaned)) {
    return {
      action: "Optimized",
      object: "business processes and automation workflows",
      outcome: "reduce manual effort and improve operational consistency",
    };
  }

  if (/stakeholder|client|customer|vendor|team/i.test(cleaned)) {
    return {
      action: "Managed",
      object: "cross-functional stakeholder coordination",
      outcome: "accelerate issue resolution and improve delivery alignment",
    };
  }

  if (lower.startsWith("perform ")) {
    return {
      action: "Performed",
      object: cleaned.replace(/^perform\s+/i, ""),
      outcome: "support accurate reporting and decision-making",
    };
  }

  return {
    action: startsWithActionVerb(cleaned) ? cleaned.split(/\s+/)[0] : "Delivered",
    object: cleaned.replace(/^\w+\s+/, "") || "business-critical work",
    outcome: "create measurable business impact",
  };
}

function buildExampleRewrite(line, metric = "X%") {
  if (!line?.text) {
    return "Add a bullet in the format: Led [work] using [tool/process] to improve [business outcome] by [metric].";
  }

  const context = inferActionContext(line.text);
  return `${context.action} ${context.object} to ${context.outcome}; quantify with ${metric} once verified.`;
}

function buildSpecificSuggestion(categoryKey, line, keyword) {
  const example = buildExampleRewrite(line);
  const original = line?.text ? cleanLineText(line.text) : "";

  if (categoryKey === "clarity") {
    return `Suggested rewrite: "${example}" This is clearer than "${shortLine(original)}" because it states action, work area, and outcome.`;
  }

  if (categoryKey === "impact") {
    return `Suggested rewrite: "${example}" Replace the placeholder with a real metric such as time saved, reports automated, users supported, cost reduced, or accuracy improved.`;
  }

  if (categoryKey === "action_verbs") {
    const context = inferActionContext(original);
    return `Start with "${context.action}" and rewrite as: "${buildExampleRewrite(line)}"`;
  }

  if (categoryKey === "role_relevance") {
    return `Tie this line to the target role: "${example}" If the role is analytics/BI/operations, mention the relevant tool, process, stakeholder, or business function.`;
  }

  if (categoryKey === "grammar") {
    return `Cleaned version: "${example}" Keep one tense, remove filler, and avoid sentence fragments.`;
  }

  if (categoryKey === "formatting") {
    return `Keep this as one concise bullet under ${line?.section || "the relevant section"} and avoid splitting it across table cells or visual-only formatting.`;
  }

  if (categoryKey === "ats_readability") {
    return `Make this parser-friendly: keep the line as selectable text, use a standard bullet, and write it as "${example}"`;
  }

  if (categoryKey === "jd_match_score" && keyword) {
    return `Suggested rewrite: "${buildExampleRewrite(line).replace(" to ", ` using ${keyword} to `)}" Only use "${keyword}" if it is truthful.`;
  }

  return `Suggested rewrite: "${example}"`;
}

const categoryTemplates = {
  keyword_match: [
    "Add role-specific keywords directly from the job description.",
    "Use exact tool names, platforms, and domain terms instead of broad wording.",
    "Repeat critical keywords naturally across summary, skills, and experience.",
    "Add missing hard skills to the most relevant project or experience line.",
    "Avoid keyword stuffing; each keyword should be attached to proof.",
    "Mirror seniority terms from the target role when truthful.",
    "Add industry terms that match the target company or function.",
    "Strengthen section headings so ATS parsers classify content correctly.",
    "Move important keywords out of tables if parser readability is weak.",
    "Prioritize missing JD keywords with measurable examples.",
  ],
  role_relevance: [
    "Make the opening summary match the target role more directly.",
    "Move the most relevant achievements higher in each section.",
    "Reduce lines that read outside the target role.",
    "Connect responsibilities to the business problems in the JD.",
    "Use target-role language in experience titles and bullet framing.",
    "Show domain depth instead of generic ownership.",
    "Add examples that prove readiness for the exact role.",
    "Trim older or less relevant details if they distract from fit.",
    "Match seniority by showing scope, stakeholders, or scale.",
    "Make each section answer why you are a fit for this job.",
  ],
  clarity: [
    "Replace vague verbs with precise actions.",
    "Make each bullet one clear idea instead of multiple mixed ideas.",
    "Remove filler phrases and passive wording.",
    "Start bullets with outcomes or strong action verbs.",
    "Clarify who benefited from the work.",
    "Simplify long sentences for faster recruiter scanning.",
    "Use consistent tense across current and past roles.",
    "Replace internal jargon with externally understandable wording.",
    "Make technical details readable to non-technical screeners.",
    "End bullets with a clear result when possible.",
  ],
  grammar: [
    "Check subject-verb agreement and sentence fragments.",
    "Keep punctuation consistent across bullet points.",
    "Use parallel grammar for lists and responsibilities.",
    "Avoid unnecessary capitalization inside sentences.",
    "Fix spacing around symbols, dates, and separators.",
    "Use past tense for previous roles and present tense for current work.",
    "Remove duplicate words and repeated phrases.",
    "Keep bullet endings consistent with or without periods.",
    "Proofread technical acronyms for consistent spelling.",
    "Shorten awkward phrases into direct business language.",
  ],
  impact: [
    "Add measurable outcomes such as revenue, cost, time, quality, or adoption.",
    "Attach numbers to scope: users, teams, data size, budget, or volume.",
    "Convert responsibilities into achievements.",
    "Show before-and-after improvement where possible.",
    "Name the business problem solved by the work.",
    "Add metrics to project and dashboard bullets.",
    "Mention operational efficiency, automation, or risk reduction.",
    "Quantify leadership, stakeholder, or delivery scope.",
    "Use outcome-first phrasing for high-value bullets.",
    "Replace generic success claims with evidence.",
  ],
  action_verbs: [
    "Start more bullets with decisive verbs.",
    "Replace weak verbs like worked, helped, handled, or responsible.",
    "Use verbs that match seniority: led, owned, architected, optimized.",
    "Use delivery verbs for execution achievements.",
    "Use analysis verbs for BI, reporting, and data accomplishments.",
    "Avoid repeating the same verb across nearby bullets.",
    "Pair each verb with a result or artifact.",
    "Use collaborative verbs only when teamwork is the key point.",
    "Make project bullets sound like achievements, not tasks.",
    "Use active voice throughout experience sections.",
  ],
  formatting: [
    "Keep spacing and section hierarchy consistent.",
    "Use simple section names that ATS parsers recognize.",
    "Avoid complex tables for critical content when possible.",
    "Use a clean single-column structure for important experience text.",
    "Keep dates, titles, and company names consistently positioned.",
    "Make bullets visually scannable at normal zoom.",
    "Avoid dense paragraphs inside experience sections.",
    "Keep font sizes readable and consistent.",
    "Use separators sparingly so parsers do not misread content.",
    "Ensure contact details are selectable text, not image-only content.",
  ],
  ats_readability: [
    "Use standard headings like Summary, Experience, Skills, Education.",
    "Avoid placing essential content in headers or footers only.",
    "Keep links and contact information parser-friendly.",
    "Reduce special characters that may parse incorrectly.",
    "Use plain bullets rather than custom symbols.",
    "Avoid text embedded in images.",
    "Make acronyms searchable by spelling out important terms once.",
    "Use consistent date formats.",
    "Keep line lengths reasonable for parser extraction.",
    "Test exports as both DOCX and PDF for text selectability.",
  ],
  section_completeness: [
    "Add a focused summary if the resume does not open with one.",
    "Ensure skills are grouped by category for faster review.",
    "Include education, certifications, and relevant training where applicable.",
    "Add projects only when they prove target-role skills.",
    "Make experience bullets stronger than responsibility lists.",
    "Include tools and technologies in context, not just a skills list.",
    "Add awards or recognitions if they support credibility.",
    "Clarify employment dates and role progression.",
    "Add leadership, stakeholder, or collaboration proof where relevant.",
    "Remove sections that do not support the target role.",
  ],
  jd_match_score: [
    "Paste a job description to calculate stronger match details.",
    "Add missing JD keywords where they naturally fit.",
    "Prioritize required skills over nice-to-have skills.",
    "Use the JD title language in the summary when accurate.",
    "Map each required responsibility to a resume proof point.",
    "Add missing tools from the JD to relevant experience lines.",
    "Include domain keywords from the JD in summary or skills.",
    "Use similar phrasing for critical competencies.",
    "Avoid adding keywords you cannot support with evidence.",
    "Refresh the match score after edits.",
  ],
};

function buildImprovementPoints(meta, value, resume, jdResult, atsResult) {
  const backendInsight = atsResult?.analysis?.find((item) => item.category === meta.key);
  if (backendInsight) {
    const maxLength = Math.max(
      backendInsight.issues?.length || 0,
      backendInsight.suggestions?.length || 0,
      backendInsight.evidence?.length || 0,
      1
    );
    return Array.from({ length: maxLength }, (_, index) => {
      const issue = backendInsight.issues?.[index] || backendInsight.issues?.[0] || "Review this category for improvement.";
      const suggestion = backendInsight.suggestions?.[index] || backendInsight.suggestions?.[0] || "Improve this area using the resume evidence below.";
      const evidence = backendInsight.evidence?.[index] || backendInsight.evidence?.[0] || "";
      return {
        title: issue,
        detail: evidence ? `Evidence: "${shortLine(evidence)}"` : "This is a resume-level recommendation, not tied to one exact line.",
        suggestion,
        lineId: findLineIdForEvidence(resume, evidence),
      };
    }).filter((point, index, points) => {
      const fingerprint = `${point.title}|${point.detail}|${point.suggestion}`;
      return points.findIndex((candidate) => `${candidate.title}|${candidate.detail}|${candidate.suggestion}` === fingerprint) === index;
    });
  }

  const lines = getEditableResumeLines(resume);
  const weakLines = [...lines]
    .sort((a, b) => (a.score || 100) - (b.score || 100))
    .slice(0, 10);
  const templates = categoryTemplates[meta.key] || categoryTemplates.clarity;
  const missingKeywords = jdResult?.missing_keywords || jdResult?.recommended_keywords || [];
  const detectedKeywordGaps = getDetectedKeywordGaps(resume);
  const missingProfileChecks = getMissingProfileChecks(resume);
  const points = [];

  for (let index = 0; index < 10; index += 1) {
    const line = weakLines[index];
    const keyword = missingKeywords[index];
    const keywordGap = detectedKeywordGaps[index];
    const missingCheck = missingProfileChecks[index];
    const base = templates[index] || templates[index % templates.length];
    const status =
      value >= 85 && index < 3 ? "Fine tune" : value >= 70 ? "Improve" : "Priority fix";

    if (meta.key === "section_completeness" && missingCheck) {
      points.push({
        title: `${status}: ${missingCheck.title}`,
        detail: missingCheck.detail,
        suggestion: missingCheck.suggestion,
        lineId: null,
      });
      continue;
    }

    if (meta.key === "keyword_match" && keyword) {
      points.push({
        title: `${status}: add "${keyword}" naturally`,
        detail: `Use this keyword in ${line?.section || "the most relevant section"} and connect it to evidence, not a standalone keyword list.`,
        suggestion: line
          ? `Suggested rewrite: "${buildExampleRewrite(line).replace(" to ", ` using ${keyword} to `)}" Only include "${keyword}" if it accurately reflects your work.`
          : `Add "${keyword}" to Summary, Skills, or Experience only where you can support it with proof.`,
        lineId: line?.lineId || null,
      });
      continue;
    }

    if (meta.key === "keyword_match" && keywordGap) {
      points.push({
        title: `${status}: strengthen ${keywordGap.keyword}`,
        detail: keywordGap.detail,
        suggestion: keywordGap.suggestion,
        lineId: null,
      });
      continue;
    }

    const suggestionTargets = {
      role_relevance: line
        ? buildSpecificSuggestion("role_relevance", line, keyword)
        : "Add a role-focused achievement under Experience or Projects.",
      clarity: line
        ? buildSpecificSuggestion("clarity", line, keyword)
        : "Add clearer achievement bullets under Experience.",
      grammar: line
        ? buildSpecificSuggestion("grammar", line, keyword)
        : "Review grammar in experience bullets first, not contact or education details.",
      impact: line
        ? buildSpecificSuggestion("impact", line, keyword)
        : "Add measurable achievements under Experience.",
      action_verbs: line
        ? buildSpecificSuggestion("action_verbs", line, keyword)
        : "Convert responsibility statements into achievement bullets with strong verbs.",
      formatting:
        buildSpecificSuggestion("formatting", line, keyword),
      ats_readability:
        buildSpecificSuggestion("ats_readability", line, keyword),
      jd_match_score: keyword
        ? buildSpecificSuggestion("jd_match_score", line, keyword)
        : "Paste a JD, then add the missing required skills to relevant experience lines.",
    };

    points.push({
      title: `${status}: ${base}`,
      detail: line
        ? `${line.section}: "${shortLine(line.text)}"`
        : "No additional high-impact resume line matched this check. Static content like education, address, contact details, and company/location metadata is intentionally ignored.",
      suggestion:
        suggestionTargets[meta.key] ||
        "Improve this point by making it specific, evidence-backed, and aligned with the target role.",
      lineId: line?.lineId || null,
    });
  }

  const seen = new Set();
  return points.filter((point) => {
    const fingerprint = `${point.title}|${point.detail}|${point.suggestion}`;
    if (seen.has(fingerprint)) {
      return false;
    }
    seen.add(fingerprint);
    return true;
  });
}

function EditorInsightsPanel({ resume, atsResult, jdResult, onRefreshScore, onSelectLine, loading = false }) {
  const [expandedKey, setExpandedKey] = useState(null);

  return (
    <Card className="p-3">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Improvement Board
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-950">
              100-point audit
            </h3>
          </div>
          <Button variant="outline" onClick={onRefreshScore} disabled={loading} className="px-3 py-2">
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-slate-950 px-4 py-3 text-white">
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Overall score</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div className="text-4xl font-semibold">
            {atsResult?.overall_score ?? 0}
          </div>
          <div className="max-w-xl text-sm leading-5 text-slate-300">
            {atsResult?.summary || "Run ATS analysis to populate the audit board."}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {insightMeta.map((meta) => {
          const value = resolveValue(meta, atsResult, jdResult);
          const priority = getPriority(value);
          const Icon = meta.icon;

          return (
            <div
              key={meta.key}
              className="rounded-md border border-slate-200 bg-white transition hover:border-[#0a66c2]/40 hover:bg-slate-50"
            >
              <button
                type="button"
                onClick={() => setExpandedKey((current) => (current === meta.key ? null : meta.key))}
                className="w-full px-3 py-2.5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold leading-4 text-slate-900">{meta.title}</h4>
                      <p className="mt-1 text-xs leading-4 text-slate-500">{meta.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-slate-950">{value}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition ${
                        expandedKey === meta.key ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  <ProgressBar value={value} />
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${priority.tone}`}>
                    {priority.label}
                  </span>
                </div>
              </button>
              {expandedKey === meta.key ? (
                <div className="border-t border-slate-200 px-3 pb-3 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    How this score is calculated
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Score {value}/100 is estimated from 10 checks for {meta.title.toLowerCase()}.
                    Focus on these resume lines and keyword gaps first.
                  </p>
                  <ol className="mt-3 space-y-2">
                    {buildImprovementPoints(meta, value, resume, jdResult, atsResult).map((point, index) => (
                      <li
                        key={`${meta.key}-${point.title}-${index}`}
                        className="rounded-md bg-slate-50 px-3 py-2"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectLine?.(point.lineId)}
                          disabled={!point.lineId}
                          className={[
                            "flex w-full gap-2 text-left",
                            point.lineId ? "cursor-pointer rounded transition hover:bg-blue-50" : "cursor-default",
                          ].join(" ")}
                          title={point.lineId ? "Click to highlight this line in the live editor" : undefined}
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#0a66c2] ring-1 ring-slate-200">
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{point.title}</p>
                            <p className="mt-0.5 text-xs leading-5 text-slate-500">{point.detail}</p>
                            <p className="mt-1 rounded border-l-2 border-[#0a66c2] bg-white px-2 py-1 text-xs leading-5 text-slate-700">
                              <span className="font-semibold text-slate-900">Suggestion: </span>
                              {point.suggestion}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default EditorInsightsPanel;
