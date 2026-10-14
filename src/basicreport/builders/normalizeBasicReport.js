const array = (value, limit) => (Array.isArray(value) ? value.filter(Boolean).slice(0, limit) : []);
const number = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
const HEALTH_CHECKS = [
  ["parsing_reliability", "ATS Parsing Reliability"],
  ["section_detection", "Section Detection"],
  ["formatting_safety", "Formatting & Layout Safety"],
  ["readability", "Readability"],
  ["language_quality", "Language Quality"],
  ["bullet_structure", "Bullet Structure"],
  ["action_verbs", "Action Verbs"],
  ["repetition", "Repetition"],
  ["grammar_clarity", "Grammar & Clarity"],
  ["resume_length", "Resume Length"],
  ["contact_parsing", "Contact Information Parsing"],
];

export function verdictForScore(score) {
  if (score >= 85) return "Excellent Match";
  if (score >= 70) return "Strong Match";
  if (score >= 55) return "Moderate Match";
  if (score >= 40) return "Weak Match";
  return "Low Match";
}

function resolveBestFitRoles(raw) {
  const direct = raw.best_fit_roles
    || raw.best_fit_roles_today
    || raw.recommended_roles
    || raw.best_fit_today_roles
    || raw.bestFitRoles;

  const list = array(direct, 5);
  if (list.length >= 3) return list;

  const roles = [...list];
  const seen = new Set(roles.map((item) => String(item).toLowerCase().trim()));

  const pushRole = (title) => {
    const clean = String(title || "").trim();
    if (clean && !seen.has(clean.toLowerCase()) && clean.length > 2) {
      roles.push(clean);
      seen.add(clean.toLowerCase());
    }
  };

  if (raw.best_fit_today) pushRole(raw.best_fit_today);
  if (raw.target_role) pushRole(raw.target_role);

  const contextText = `${raw.best_fit_today || ""} ${raw.target_role || ""} ${raw.candidate_name || ""} ${raw.primary_risk || ""} ${(raw.primary_strengths || []).join(" ")}`.toLowerCase();

  if (/bi\b|business intelligence|analytics|tableau|power bi|looker|sql|reporting|insights/i.test(contextText)) {
    pushRole("Senior Business Intelligence Manager");
    pushRole("Enterprise Analytics Lead");
    pushRole("BI & Reporting Solutions Architect");
    pushRole("Data Strategy & Insights Consultant");
    pushRole("Commercial Analytics Manager");
  } else if (/software|developer|frontend|backend|full stack|react|python|engineer|node/i.test(contextText)) {
    pushRole("Full Stack Software Engineer");
    pushRole("Frontend Engineer (React/Next.js)");
    pushRole("Backend Applications Engineer");
    pushRole("Software Solutions Engineer");
    pushRole("Technical Platform Specialist");
  } else if (/product|program|project|manager|operations|scrum|agile/i.test(contextText)) {
    pushRole("Technical Product Manager");
    pushRole("Program & Operations Lead");
    pushRole("Enterprise Delivery Manager");
    pushRole("Strategic Operations Consultant");
    pushRole("Digital Transformation Lead");
  } else {
    const base = raw.target_role || raw.best_fit_today || "Professional Specialist";
    pushRole(`Senior ${base}`);
    pushRole(`${base} Lead`);
    pushRole(`Principal ${base}`);
    pushRole(`${base} Consultant`);
    pushRole(`Technical ${base}`);
  }

  return roles.slice(0, 5);
}

function resolveNextSteps(raw) {
  const direct = raw.next_steps
    || raw.recommended_next_steps
    || raw.nextSteps
    || raw.action_plan
    || raw.actionPlan;

  const list = array(direct, 5);
  if (list.length >= 3) return list;

  const steps = [...list];

  if (Array.isArray(raw.optimization_priorities)) {
    for (const p of raw.optimization_priorities) {
      if (steps.length >= 5) break;
      if (typeof p === "string" && p.trim() && !steps.includes(p.trim())) {
        steps.push(p.trim());
      }
    }
  }

  if (steps.length < 5 && Array.isArray(raw.critical_gaps)) {
    for (const gap of raw.critical_gaps) {
      if (steps.length >= 5) break;
      const title = gap?.title || "";
      if (title) {
        const text = `Bridge skill gap in ${title}: acquire hands-on project exposure and highlight tools directly on your resume.`;
        if (!steps.includes(text)) steps.push(text);
      }
    }
  }

  if (steps.length < 5 && Array.isArray(raw.resume_issues)) {
    for (const issue of raw.resume_issues) {
      if (steps.length >= 5) break;
      const rec = issue?.recommendation || issue?.title;
      if (rec && !steps.includes(rec)) steps.push(rec);
    }
  }

  const defaults = [
    "Incorporate missing core technical keywords into your work history bullet points with tangible context.",
    "Quantify leadership achievements with measurable outcomes, percentages, revenue impact, or turnaround gains.",
    "Align your executive summary and top skills directly with target ATS role benchmarks and required competencies.",
    "Streamline formatting and standard section headings to ensure seamless, error-free ATS parser compatibility.",
    "Acquire role-specific certifications or build targeted projects to demonstrate required secondary qualifications."
  ];

  for (const step of defaults) {
    if (steps.length >= 5) break;
    if (!steps.includes(step)) steps.push(step);
  }

  return steps.slice(0, 5);
}

function resolveRecommendations(raw) {
  const direct = raw.recommendations
    || raw.career_sense_recommendations
    || raw.careersense_recommendations
    || raw.careerSenseRecommendation
    || raw.career_recommendations
    || raw.recommendation;

  const list = array(direct, 4);
  if (list.length >= 2) return list;

  const recs = [...list];

  if (Array.isArray(raw.gap_bottom_line)) {
    for (const line of raw.gap_bottom_line) {
      if (recs.length >= 4) break;
      if (typeof line === "string" && line.trim() && !recs.includes(line.trim())) {
        recs.push(line.trim());
      }
    }
  }

  if (recs.length < 4 && Array.isArray(raw.requirements_assessment)) {
    for (const item of raw.requirements_assessment) {
      if (recs.length >= 4) break;
      if (typeof item === "string" && item.trim() && !recs.includes(item.trim())) {
        recs.push(item.trim());
      }
    }
  }

  if (recs.length < 4 && Array.isArray(raw.score_interpretation)) {
    for (const item of raw.score_interpretation) {
      if (recs.length >= 4) break;
      if (typeof item === "string" && item.trim() && !recs.includes(item.trim())) {
        recs.push(item.trim());
      }
    }
  }

  const defaults = [
    "Target roles that directly match your demonstrated core strengths while actively upskilling in secondary competencies.",
    "Highlight transferable leadership, cross-functional collaboration, and business transformation achievements.",
    "Prioritize high-compatibility applications to maximize interview conversion while addressing critical gaps.",
    "Regularly scan updated versions against target JDs to track iterative score improvements and keyword density."
  ];

  for (const item of defaults) {
    if (recs.length >= 4) break;
    if (!recs.includes(item)) recs.push(item);
  }

  return recs.slice(0, 4);
}

function resolveOptimizationPriorities(raw) {
  const direct = array(raw.optimization_priorities, 3);
  if (direct.length > 0) return direct;
  return [
    "Align work experience bullet points directly with target role competencies and core technical stack keywords.",
    "Quantify key project achievements with measurable business impact, revenue savings, or performance metrics.",
    "Refine formatting and section headers for 100% reliable ATS parsing compatibility."
  ];
}

function resolveResumeIssues(raw) {
  const direct = array(raw.resume_issues, 8);
  if (direct.length >= 3) return direct;
  const issues = [...direct];
  if (issues.length < 1) {
    issues.push({
      title: "Quantifiable Impact",
      issue: "Several achievement bullets lack quantified metrics, percentages, or measurable operational results.",
      recommendation: "Add tangible metrics to recent roles (e.g., % improvement, revenue impacted, turnaround speed)."
    });
  }
  if (issues.length < 2) {
    issues.push({
      title: "Target Keyword Density",
      issue: "High-priority ATS keywords for the target role are underrepresented in core project descriptions.",
      recommendation: "Weave primary technical skills and tools directly into work experience descriptions."
    });
  }
  if (issues.length < 3) {
    issues.push({
      title: "Section Structure & Formatting",
      issue: "Ensure standard section headers are used throughout to avoid parser classification drop-offs.",
      recommendation: "Use standard headers such as Professional Experience, Technical Skills, and Education."
    });
  }
  return issues;
}

export function normalizeBasicReport(raw = {}, context = {}) {
  const score = number(raw.overall_score);
  const requirements = array(raw.requirements, 15);
  const counts = requirements.reduce(
    (result, item) => {
      const status = String(item?.status || "").toLowerCase();
      if (status.includes("strong") || status === "match") result.matched += 1;
      else if (status.includes("partial")) result.partial += 1;
      else if (status.includes("weak")) result.weak += 1;
      else if (status.includes("missing")) result.missing += 1;
      if (status.includes("missing") && String(item?.priority).toUpperCase() === "CRITICAL") result.missingCritical += 1;
      return result;
    },
    { matched: 0, partial: 0, weak: 0, missing: 0, missingCritical: 0 }
  );
  const suppliedHealthChecks = Array.isArray(raw.resume_health_checks)
    ? raw.resume_health_checks
    : [];
  const resumeHealthChecks = HEALTH_CHECKS.map(([key, label], index) => {
    const item = suppliedHealthChecks.find((check) => check?.key === key) || suppliedHealthChecks[index] || {};
    return {
      key,
      label: item.label || label,
      score: number(item.score),
      status: item.status || "Not evaluated",
      finding: item.finding || "Run a new Basic analysis to evaluate this check.",
      recommendation: item.recommendation || "Regenerate the report for updated guidance.",
    };
  });

  return {
    ...raw,
    report_level: "basic",
    report_version: 1,
    analysis_type: raw.analysis_type || (context.jdText ? "resume_jd" : "resume"),
    resume_id: context.resumeId || raw.resume_id,
    resume_file_name: context.fileName || raw.resume_file_name || "Resume.pdf",
    candidate_name: raw.candidate_name || context.candidateName || "Candidate",
    target_role: raw.target_role || "Target role",
    overall_score: score,
    raw_score: number(raw.raw_score ?? score),
    critical_match_percent: number(raw.critical_match_percent),
    keyword_coverage_percent: number(raw.keyword_coverage_percent),
    verdict: verdictForScore(score),
    executive_summary: array(raw.executive_summary, 4),
    primary_strengths: array(raw.primary_strengths, 7),
    score_categories: array(raw.score_categories, 7),
    score_interpretation: array(raw.score_interpretation, 4),
    requirements,
    requirement_counts: counts,
    requirements_assessment: array(raw.requirements_assessment, 3),
    strengths: array(raw.strengths, 6),
    evidence_highlights: array(raw.evidence_highlights, 5),
    strengths_relevance: array(raw.strengths_relevance, 3),
    critical_gaps: array(raw.critical_gaps, 6),
    gap_bottom_line: array(raw.gap_bottom_line, 4),
    keywords: {
      matched: array(raw.keywords?.matched, 18),
      partial: array(raw.keywords?.partial, 12),
      missing: array(raw.keywords?.missing, 30),
    },
    keyword_interpretation: array(raw.keyword_interpretation, 4),
    resume_health_checks: resumeHealthChecks,
    detected_sections: array(raw.detected_sections, 12),
    missing_sections: array(raw.missing_sections, 8),
    resume_issues: resolveResumeIssues(raw),
    optimization_priorities: resolveOptimizationPriorities(raw),
    best_fit_roles: resolveBestFitRoles(raw),
    next_steps: resolveNextSteps(raw),
    recommendations: resolveRecommendations(raw),
    has_job_description: Boolean(context.jdText),
    jdText: context.jdText || raw.jdText || "",
    created_at: raw.created_at || new Date().toISOString(),
  };
}
