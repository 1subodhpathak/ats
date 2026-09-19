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
    resume_issues: array(raw.resume_issues, 8),
    optimization_priorities: array(raw.optimization_priorities, 3),
    best_fit_roles: array(raw.best_fit_roles, 5),
    next_steps: array(raw.next_steps, 5),
    recommendations: array(raw.recommendations, 4),
    has_job_description: Boolean(context.jdText),
    jdText: context.jdText || raw.jdText || "",
    created_at: raw.created_at || new Date().toISOString(),
  };
}
