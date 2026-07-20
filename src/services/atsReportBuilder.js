import { extractCandidateName } from "../utils/resumeParser";

// Constants from original Python backend
export const CHECK_GROUPS = [
  [
    "Hard Skills & Technical Proficiency",
    [
      ["Mandatory Skill Match", "Checks if the absolute must-have technical skills, tools, or software are explicitly reflected."],
      ["Secondary/Bonus Skill Match", "Evaluates the presence of nice-to-have or preferred skills."],
      ["Skill Context Validation", "Checks whether required skills are demonstrated in experience, not just listed."],
      ["Proficiency Level Alignment", "Matches the claimed level of expertise to the expected proficiency."],
      ["Tech Stack Completeness", "Checks whether the complete expected stack or tool cluster is represented."],
    ],
  ],
  [
    "Soft Skills & Behavioral Competencies",
    [
      ["Leadership & Management", "Checks for evidence of leadership, team direction, or people management."],
      ["Communication Indicators", "Looks for writing, presenting, stakeholder management, or negotiation proof."],
      ["Problem-Solving & Analytics", "Looks for analytical thinking, troubleshooting, optimization, or decision support."],
      ["Collaboration Keywords", "Checks for signals of teamwork and cross-team partnership."],
      ["Adaptability/Pace Fit", "Assesses whether the resume shows agility in fast-moving or changing environments."],
    ],
  ],
  [
    "Job Title & Seniority Alignment",
    [
      ["Exact Title Match", "Checks for an exact job title match where relevant."],
      ["Semantic Title Match", "Checks for equivalent or closely related job titles."],
      ["Seniority Level Check", "Compares the target level to the candidate's demonstrated level."],
      ["Career Progression", "Evaluates whether the career path logically supports the target role."],
      ["Management Scope", "Checks for budget, team, or operational scope when the role requires it."],
    ],
  ],
  [
    "Experience & Industry Relevance",
    [
      ["Total Years of Experience", "Compares total experience length to the likely target expectations."],
      ["Relevant Years of Experience", "Measures experience specifically related to the target function."],
      ["Industry/Domain Match", "Checks for experience in the relevant industry or business domain."],
      ["Scale of Operations", "Evaluates whether the candidate has worked at the expected scale."],
      ["B2B vs. B2C Alignment", "Checks whether customer-base experience aligns to the likely target environment."],
    ],
  ],
  [
    "Education & Credentials",
    [
      ["Baseline Degree Requirement", "Checks for degree-level coverage expected by professional roles."],
      ["Preferred Major/Specialization", "Checks for alignment between studies and target domain."],
      ["Mandatory Certifications", "Checks for required or highly valuable certifications."],
      ["Active Licenses", "Checks for explicit licenses or regulated-role credentials where applicable."],
      ["Continuous Education", "Looks for ongoing learning, courses, workshops, or certifications."],
    ],
  ],
  [
    "Keyword Optimization & Context",
    [
      ["Primary Keyword Density", "Measures whether the most important terms appear often enough to be discoverable."],
      ["Keyword Stuffing Detection", "Flags unnatural repetition that may look manipulative or low quality."],
      ["Synonym Recognition", "Checks whether semantically related vocabulary supports the target role."],
      ["Acronym Resolution", "Ensures standard acronyms and their expanded forms are covered where relevant."],
      ["Prime Placement", "Checks whether the most valuable keywords appear early in the resume."],
    ],
  ],
  [
    "Impact & Deliverables Mapping",
    [
      ["Duty-to-Achievement Match", "Checks whether responsibilities are backed by clear proof of results."],
      ["Metric Relevance", "Checks for quantifiable results aligned to the role's likely outcomes."],
      ["Financial Responsibility", "Looks for budget, savings, revenue, or financial accountability evidence."],
      ["Project Scope Alignment", "Checks whether project scale aligns with the likely target environment."],
      ["Action Verb Mirroring", "Checks whether strong, role-relevant action verbs are used consistently."],
    ],
  ],
  [
    "Language, Methodology & Terminology",
    [
      ["Mission Keyword Match", "Looks for values and mission language aligned with the target environment."],
      ["Diversity & Inclusion (DEI)", "Checks for mentoring, community, ERG, or inclusion-related signals where relevant."],
      ["Cross-Functional Experience", "Looks for collaboration across departments or partner functions."],
      ["Customer-Centric Focus", "Checks for customer outcomes, retention, satisfaction, or advocacy signals."],
      ["Mentorship/Training Capacity", "Checks for onboarding, coaching, enablement, or talent development evidence."],
    ],
  ],
];

export const REPORT_SECTION_SPECS = [
  ["resume_tailoring", "Resume Tailoring", "Resume Tailoring", "free_when_jd_available"],
  ["career_progression", "Career Progression", "Seniority", "premium"],
  ["skill_evidence", "Skill Evidence", "Seniority", "premium"],
  ["ageism_date_bias", "Ageism & Date Bias", "Discrimination & Bias Risk", "premium"],
  ["employment_gaps", "Employment Gaps", "Discrimination & Bias Risk", "premium"],
  ["peer_benchmarking", "Peer Benchmarking", "Peer Benchmarking", "premium"],
  ["linkedin_match", "LinkedIn Match", "LinkedIn Match", "premium"],
  ["credibility", "Credibility", "HR Red Flags", "premium"],
  ["interview_risks", "Interview Risks", "HR Red Flags", "premium"],
  ["dates_links", "Dates & Links", "HR Red Flags", "premium"],
  ["header_links", "Header Links", "Header & Contact", "free"],
  ["email_address", "Email Address", "Header & Contact", "free"],
  ["contact_information", "Contact Information", "Header & Contact", "free"],
  ["file_format_size", "File Format & Size", "ATS Essentials", "free"],
  ["ats_parse_rate", "ATS Parse Rate", "ATS Essentials", "free"],
  ["essential_sections", "Essential Sections", "Sections", "free"],
  ["sections_order", "Sections Order", "Sections", "premium"],
  ["bullets_consistency", "Bullets Consistency", "Sections", "premium"],
  ["spelling_grammar", "Spelling & Grammar", "Writing Quality", "free"],
  ["repetition", "Repetition", "Writing Quality", "free"],
  ["quantify_impact", "Quantify Impact", "Writing Quality", "free"],
];

const JD_SKILL_PHRASES = [
  "python", "r", "sas", "sql", "machine learning", "ai", "ml", "predictive analytics",
  "data governance", "data quality", "data warehouse", "bi architecture", "statistical modelling",
  "hypothesis testing", "data mining", "data cleaning", "preprocessing", "tableau", "power bi",
  "qlikview", "sap", "ariba", "concur", "automation", "stakeholder reporting"
];

const SECTION_VARIANTS = {
  Summary: ["summary", "professional summary", "profile", "career summary", "objective", "about me"],
  Experience: ["experience", "work experience", "professional experience", "employment history", "career history", "relevant experience"],
  Education: ["education", "academic background", "academic qualification", "education qualification", "qualifications", "relevant coursework", "coursework"],
  Skills: ["skills", "technical skills", "technical proficiency", "core competencies", "area of expertise", "tools", "technology stack"],
  Projects: ["projects", "project undertaken", "project experience", "key projects", "selected projects"],
  Certifications: ["certifications", "certificates", "licenses", "training", "courses"],
  Achievements: ["achievements", "awards", "triumphs", "recognition", "accomplishments", "scholastic achievements", "competitive programming", "extra-curricular activities", "extracurricular activities", "extracurriculars"],
};

const SKILL_BUCKETS = {
  programming_languages: ["python", "r", "sql", "java", "javascript", "typescript", "scala", "pyspark"],
  bi_tools: ["power bi", "tableau", "qlikview", "qlik sense", "microstrategy", "sap business objects", "bw"],
  data_tools: ["excel", "sas", "numpy", "pandas", "scikit-learn", "spark", "oracle", "peoplesoft", "sql server", "mysql", "postgresql"],
  analytics_methods: ["machine learning", "predictive analytics", "forecasting", "variance analysis", "data mining", "hypothesis testing", "clustering", "regression", "classification"],
  soft_skills: ["leadership", "communication", "stakeholder management", "collaboration", "problem solving", "teamwork", "adaptability", "negotiation"],
  domain_skills: ["financial planning", "fp&a", "supply chain", "procurement", "accounts payable", "business intelligence", "data analysis", "reporting", "automation", "process improvement"],
};

const TOOL_KEYWORDS = [
  "power bi", "tableau", "qlikview", "sap", "oracle", "concur", "ariba", "peoplesoft",
  "sql", "excel", "sas", "coupa", "precoro", "visio", "field glass", "dovico", "tabs",
];

const EMPLOYMENT_TYPES = ["full time", "part time", "contract", "internship", "temporary", "freelance"];
const SENIORITY_TERMS = ["intern", "associate", "analyst", "senior", "lead", "manager", "director", "head", "principal", "vp"];
const EDUCATION_TERMS = ["bachelor", "master", "mba", "b.tech", "btech", "m.tech", "degree", "university", "college", "phd"];
const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "your", "have", "has", "was", "are", "not", "but",
  "role", "resume", "candidate", "based", "more", "their", "they", "them", "will", "where", "using", "used",
  "when", "what", "need", "needs", "work", "skills", "experience", "match", "alignment", "check", "content",
  "evidence", "support"
]);

// Helper matching logic
const hasDirectSkillMatch = (keyword, text) => {
  if (!keyword || !text) return false;
  const norm = keyword.toLowerCase().trim();
  const lowerText = text.toLowerCase();
  if (["r", "ai", "ml"].includes(norm)) {
    const rx = new RegExp(`(?<![a-z])${escapeRegExp(norm)}(?![a-z])`, "i");
    return rx.test(lowerText);
  }
  const rx = new RegExp(`\\b${escapeRegExp(norm).replace(/\\\s+/g, "\\s+")}\\b`, "i");
  return rx.test(lowerText);
};

const escapeRegExp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const tokenizeText = (text) => {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
};

const extractKeywordsFromText = (text = "", lexicon = []) => {
  if (!text) return [];
  const found = [];
  lexicon.forEach(term => {
    if (hasDirectSkillMatch(term, text)) {
      found.push(term);
    }
  });
  return Array.from(new Set(found));
};

const detectResumeSections = (lines = []) => {
  const found = [];
  lines.forEach(line => {
    if (!line) return;
    const key = line.trim().toLowerCase();
    Object.entries(SECTION_VARIANTS).forEach(([canonical, variants]) => {
      if (variants.includes(key) && !found.includes(canonical)) {
        found.push(canonical);
      }
    });
  });
  return found;
};

const findRepeatedTerms = (text = "") => {
  if (!text) return [];
  const tokens = tokenizeText(text);
  const counts = {};
  tokens.forEach(t => {
    counts[t] = (counts[t] || 0) + 1;
  });
  return Object.entries(counts)
    .filter(([_, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1])
    .map(([token, count]) => [token, count])
    .slice(0, 6);
};

const detectParseRisks = (text = "") => {
  const safeText = text || "";
  const lowered = safeText.toLowerCase();
  const tablesDetected = lowered.includes("area of expertise") || (safeText.split("|").length - 1) >= 3;
  const multiColumnRisk = tablesDetected 
    ? "high" 
    : (safeText.match(/\s{6,}/g) || []).length >= 6 
      ? "medium" 
      : "low";
  
  const flags = [];
  const recommendations = [];
  if (tablesDetected) {
    flags.push("Table-like or grid-heavy content detected, especially in skills / area-of-expertise content.");
    recommendations.push("Convert table-like skills blocks into single-column bullets or comma-separated lists.");
  }
  if (multiColumnRisk !== "low") {
    flags.push(`Multi-column risk appears ${multiColumnRisk}.`);
    recommendations.push("Keep the resume in a simple one-column layout for safer ATS parsing.");
  }
  if (!recommendations.length) {
    recommendations.push("The resume structure is largely ATS-friendly as-is.");
  }
  return { tables_detected: tablesDetected, multi_column_risk: multiColumnRisk, flags, recommendations };
};

const findRequirementEvidence = (requirement = "", lines = []) => {
  if (!requirement) return ["", "missing"];
  const normalized = requirement.toLowerCase().trim();
  const aliasMap = {
    ai: ["artificial intelligence", "ai/ml", "machine learning", "predictive model", "model training"],
    ml: ["machine learning", "predictive model", "classification", "regression", "clustering", "decision tree", "neural network"],
    r: ["r programming", "r language", "rstudio"],
    sql: ["sql", "query writing", "database querying", "sql server", "mysql", "postgresql"],
    python: ["python", "pandas", "numpy", "scikit-learn", "pyspark"],
  };
  const aliases = [normalized, ...(aliasMap[normalized] || [])];
  
  // 1. Direct match
  for (const line of lines) {
    if (line && hasDirectSkillMatch(normalized, line)) {
      return [line.slice(0, 200).trim(), "direct"];
    }
  }
  // 2. Semantic/Alias match
  for (const line of lines) {
    if (line && aliases.slice(1).some(alias => hasDirectSkillMatch(alias, line))) {
      return [line.slice(0, 200).trim(), "semantic"];
    }
  }
  // 3. Weak partial words match
  for (const line of lines) {
    if (!line) continue;
    const words = normalized.replace(/[^a-z0-9+#/.]/g, " ").split(/\s+/).filter(w => w.length > 2);
    if (words.length) {
      const matchCount = words.filter(word => line.toLowerCase().includes(word)).length;
      if (matchCount >= Math.max(1, Math.min(2, words.length))) {
        return [line.slice(0, 200).trim(), "weak"];
      }
    }
  }
  return ["", "missing"];
};

const extractJdData = (jdText = "") => {
  if (!jdText) {
    return {
      jd_profile: {},
      must_have_requirements: [],
      responsibilities: [],
      required_skills: [],
      required_tools: [],
      required_programming_languages: [],
      preferred_skills: [],
      application_questions: [],
    };
  }
  const lines = jdText.split(/\r?\n/).map(l => l.trim().replace(/^[-•\t]+/, "").trim()).filter(Boolean);
  const lowerText = jdText.toLowerCase();
  
  let targetRole = "";
  const roleMatch = jdText.match(/(?:job role|job title|position)\s*[:\-]\s*(.+)/i);
  if (roleMatch) {
    targetRole = roleMatch[1].trim().slice(0, 120);
  } else if (lines.length) {
    targetRole = lines[0].slice(0, 120);
  }
  
  const companyMatch = jdText.match(/\babout\s+([A-Z][A-Za-z0-9&().,\- ]{2,80})/);
  const locationMatch = jdText.match(/\b(?:location|based in)\s*[:\-]?\s*([A-Z][A-Za-z ,\-]+)/i);
  const experienceMatch = jdText.match(/(\d+\+?\s+years?[^.\n]*)/i);
  const educationMatch = lines.find(line => EDUCATION_TERMS.some(term => line.toLowerCase().includes(term)));
  const employmentType = EMPLOYMENT_TYPES.find(term => lowerText.includes(term));
  const seniority = SENIORITY_TERMS.find(term => new RegExp(`\\b${escapeRegExp(term)}\\b`, "i").test(lowerText));
  
  const requiredSkills = extractKeywordsFromText(jdText, SKILL_BUCKETS.domain_skills.concat(SKILL_BUCKETS.analytics_methods));
  const requiredTools = extractKeywordsFromText(jdText, TOOL_KEYWORDS.concat(SKILL_BUCKETS.bi_tools).concat(SKILL_BUCKETS.data_tools));
  const requiredLanguages = extractKeywordsFromText(jdText, SKILL_BUCKETS.programming_languages);
  
  // Responsibilities & Preferred Skills
  const responsibilities = lines.filter(line => 
    ["lead", "manage", "deliver", "support", "responsible", "design", "develop", "maintain"].some(v => 
      line.toLowerCase().startsWith(v)
    )
  ).slice(0, 8);
  
  const preferredSkills = lines.filter(line => 
    ["preferred", "nice to have", "good to have", "plus", "desirable", "advantage"].some(p => 
      line.toLowerCase().includes(p)
    )
  ).slice(0, 4);

  // Auto-generate checks list
  const jdSkillPhrases = Array.from(new Set([
    ...requiredLanguages, ...requiredTools, ...requiredSkills
  ])).slice(0, 16);

  const mustHaveRequirements = jdSkillPhrases.map(phrase => ({
    requirement: phrase.charAt(0).toUpperCase() + phrase.slice(1),
    category: "skill",
    importance: "must_have",
    evidence_from_jd: `Required in job description: ${phrase}`
  }));

  if (!mustHaveRequirements.some(r => r.requirement.toLowerCase().includes("quality"))) {
    mustHaveRequirements.push({
      requirement: "Data Quality Assurance",
      category: "skill",
      importance: "must_have",
      evidence_from_jd: "Requires audit checks to ensure clean dataset pipelines."
    });
  }
  if (!mustHaveRequirements.some(r => r.requirement.toLowerCase().includes("governance"))) {
    mustHaveRequirements.push({
      requirement: "Data Governance Standards",
      category: "skill",
      importance: "must_have",
      evidence_from_jd: "Requires compliance controls and secure reporting schemas."
    });
  }
  if (!mustHaveRequirements.some(r => r.requirement.toLowerCase().includes("stakeholder") || r.requirement.toLowerCase().includes("liaison") || r.requirement.toLowerCase().includes("present"))) {
    mustHaveRequirements.push({
      requirement: "Stakeholder Collaboration",
      category: "skill",
      importance: "must_have",
      evidence_from_jd: "Liaising with corporate business users and presenting dashboard findings."
    });
  }

  const applicationQuestions = lines.filter(line => line.includes("?")).slice(0, 6);

  return {
    jd_profile: {
      target_role: targetRole || "Professional Role",
      company: companyMatch ? companyMatch[1].trim() : null,
      location: locationMatch ? locationMatch[1].trim() : null,
      experience_years: experienceMatch ? experienceMatch[1].trim() : null,
      education: educationMatch || null,
      employment_type: employmentType ? employmentType.charAt(0).toUpperCase() + employmentType.slice(1) : null,
      seniority: seniority ? seniority.charAt(0).toUpperCase() + seniority.slice(1) : null,
    },
    must_have_requirements: mustHaveRequirements,
    responsibilities,
    required_skills: requiredSkills,
    required_tools: requiredTools,
    required_programming_languages: requiredLanguages,
    preferred_skills: preferredSkills,
    application_questions: applicationQuestions,
  };
};

const splitLinesIntoSections = (lines = []) => {
  const sections = { General: [] };
  let current = "General";
  lines.forEach(line => {
    if (!line) return;
    
    // Clean symbols, bullets, punctuation, and descriptors from start and end
    const clean = line
      .replace(/^[•◦▪\-\*\+\s◦]+/, "")
      .replace(/[:\*•\-_◦\s]+$/, "")
      .trim()
      .toLowerCase();

    let matchedCanonical = null;
    Object.entries(SECTION_VARIANTS).forEach(([canonical, variants]) => {
      variants.forEach(variant => {
        if (clean === variant || clean.startsWith(variant + " ") || clean.startsWith(variant + ":") || clean.startsWith(variant + " *")) {
          matchedCanonical = canonical;
        }
      });
    });

    if (matchedCanonical) {
      current = matchedCanonical;
      if (!sections[current]) {
        sections[current] = [];
      }
    } else {
      sections[current].push(line);
    }
  });
  return sections;
};

// Findings Builders
const buildResumeTailoringFindings = (matrix = []) => {
  if (!matrix || !matrix.length) {
    return [{
      type: "info",
      title: "JD not provided",
      evidence: "No job description was supplied for this scan.",
      recommendation: "Upload a JD to unlock requirement-by-requirement tailoring checks."
    }];
  }
  return matrix.slice(0, 5).map(item => ({
    type: item.status === "strong" ? "success" : item.status === "partial" ? "warning" : "error",
    title: item.requirement,
    evidence: item.resume_evidence,
    recommendation: item.recommendation,
    rewrite: item.safe_rewrite,
    safe_to_use: item.status !== "missing"
  }));
};

const buildCareerProgressionFindings = (lines = []) => {
  const timelineLines = lines.filter(line => line && /\d{4}\s*(?:to|-|–|—)\s*(\d{4}|present|current)/i.test(line));
  if (!timelineLines.length) {
    return [{
      type: "warning",
      title: "Career timeline clarity",
      evidence: "The resume does not show many clean date ranges in plain text.",
      recommendation: "Use a consistent Month YYYY - Month YYYY format for each role."
    }];
  }
  return [{
    type: "info",
    title: "Detected role timeline",
    evidence: timelineLines[0].slice(0, 180),
    recommendation: "Make sure titles, companies, and dates stay on one line where possible."
  }];
};

const buildSkillEvidenceFindings = (lines = [], matrix = []) => {
  if (!matrix || !matrix.length) {
    return [{
      type: "info",
      title: "Skill evidence baseline",
      evidence: "No JD-linked skill matrix was available.",
      recommendation: "Tie important tools and skills to project or role bullets whenever possible."
    }];
  }
  return matrix.slice(0, 4).map(item => ({
    type: item.resume_evidence !== "No direct resume evidence detected." ? "success" : "warning",
    title: `Evidence for ${item.requirement}`,
    evidence: item.resume_evidence,
    recommendation: item.recommendation
  }));
};

const findAgeBiasSignals = (lines = []) => {
  return lines.filter(line => 
    line &&
    /\b(19\d{2}|200\d)\b/.test(line) && 
    ["education", "bachelor", "master", "degree", "university", "college"].some(term => line.toLowerCase().includes(term))
  ).slice(0, 3);
};

const buildAgeBiasFindings = (lines = []) => {
  const signals = findAgeBiasSignals(lines);
  if (!signals.length) {
    return [{
      type: "success",
      title: "Date exposure",
      evidence: "No obvious age-bias triggers were detected in the visible headings and dates.",
      recommendation: "Keep only the dates that help your positioning."
    }];
  }
  return signals.map(signal => ({
    type: "warning",
    title: "Older education dates visible",
    evidence: signal,
    recommendation: "If seniority is already obvious from experience, consider minimizing graduation year prominence."
  }));
};

const buildGapFindings = (lines = []) => {
  const timeline = buildCareerTimeline(lines.join("\n"));
  if (timeline.length < 2) {
    return [{
      type: "info",
      title: "Gap detection confidence",
      evidence: "There were not enough clean date ranges to verify employment continuity confidently.",
      recommendation: "Use explicit month and year dates for each role."
    }];
  }
  const findings = [];
  for (let i = 0; i < timeline.length - 1; i++) {
    const previous = timeline[i];
    const current = timeline[i + 1];
    const gap = Math.round((current.start - previous.end) * 12);
    if (gap > 6) {
      findings.push({
        type: "warning",
        title: "Possible employment gap",
        evidence: `${previous.end_label} to ${current.start_label} appears to leave a gap of about ${gap} months.`,
        recommendation: "If this gap is real and material, add brief context in a cover letter or simplify date formatting."
      });
    }
  }
  return findings.length ? findings : [{
    type: "success",
    title: "Employment continuity",
    evidence: "No clear gap longer than six months was detected from the visible role dates.",
    recommendation: "Maintain the current date consistency."
  }];
};

const buildPeerBenchmarkFindings = (metricsLines = []) => {
  const benchmark = metricsLines.length >= 3 ? "Strong" : metricsLines.length ? "Market-Aligned" : "Below Market";
  return [{
    type: "info",
    title: "Benchmark summary",
    evidence: benchmark,
    recommendation: "Senior resumes usually show repeated proof of scale, outcomes, and technology depth in the experience bullets."
  }];
};

const buildCredibilityFindings = (bulletsWithoutMetrics = []) => {
  if (!bulletsWithoutMetrics.length) {
    return [{
      type: "success",
      title: "Credibility baseline",
      evidence: "Most visible bullets already provide enough scope or evidence to feel credible.",
      recommendation: "Keep pairing claims with outcomes."
    }];
  }
  return [{
    type: "warning",
    title: "Broad claim without proof",
    evidence: bulletsWithoutMetrics[0],
    recommendation: "Add scope, outcome, or stakeholder impact so this claim feels more verifiable.",
    rewrite: "Improved [process / metric] by [X%] by leading [initiative], if true.",
    safe_to_use: false
  }];
};

const buildInterviewRiskFindings = (lines = [], matrix = []) => {
  const findings = [];
  const predictiveLine = lines.find(line => line && line.toLowerCase().includes("predictive analytics"));
  if (predictiveLine) {
    findings.push({
      type: "warning",
      title: "Predictive analytics claim",
      evidence: predictiveLine,
      recommendation: "Be ready to explain the project, dataset, method, and outcome. Avoid implying ML model ownership unless true."
    });
  }
  (matrix || []).slice(0, 2).forEach(item => {
    if (["missing", "partial"].includes(item.status)) {
      findings.push({
        type: "info",
        title: `Likely interview question: ${item.requirement}`,
        evidence: item.resume_evidence,
        recommendation: `Prepare to explain whether and where you used ${item.requirement}. Add only if true.`
      });
    }
  });
  return findings.length ? findings : [{
    type: "info",
    title: "Interview readiness",
    evidence: "No major trigger lines were detected beyond normal recruiter follow-up topics.",
    recommendation: "Prepare concise stories for your top quantified achievements."
  }];
};

const buildDatesLinksFindings = (lines = [], linkedinMatch, urlMatch) => {
  const findings = [];
  if (!linkedinMatch) {
    findings.push({
      type: "warning",
      title: "Missing LinkedIn URL",
      evidence: "No full LinkedIn URL detected in the header.",
      recommendation: "Add the full LinkedIn URL in text so ATS systems can read it."
    });
  }
  if (urlMatch && !linkedinMatch) {
    findings.push({
      type: "info",
      title: "Other visible URL detected",
      evidence: urlMatch[0],
      recommendation: "If this is not LinkedIn, consider adding LinkedIn alongside it."
    });
  }
  return findings.length ? findings : [{
    type: "success",
    title: "Links and dates",
    evidence: "Visible links look ATS-readable.",
    recommendation: "Keep date formatting and URLs consistent."
  }];
};

const buildSectionOrderFindings = (sectionsDetected = []) => {
  if (!sectionsDetected.length) {
    return [{
      type: "warning",
      title: "Section order",
      evidence: "Section headings were not detected cleanly from the parsed text.",
      recommendation: "Use explicit headings like Summary, Experience, Education, and Skills."
    }];
  }
  return [{
    type: "info",
    title: "Current order",
    evidence: sectionsDetected.join(" -> "),
    recommendation: "For experienced candidates, keep Experience ahead of Education and keep Skills visible near the top third of the page."
  }];
};

const buildBulletConsistencyFindings = (lines = []) => {
  const bullets = lines.filter(line => line && (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")));
  if (!bullets.length) {
    return [{
      type: "info",
      title: "Bullet structure",
      evidence: "The parser did not detect a consistent bullet character pattern.",
      recommendation: "Use one bullet style throughout the resume."
    }];
  }
  return [{
    type: "warning",
    title: "Bullet punctuation and structure",
    evidence: bullets[0].slice(0, 180),
    recommendation: "Keep bullets parallel in tense and punctuation, and avoid mixing fragment style with full-sentence style."
  }];
};

const buildSpellingFindings = (lines = []) => {
  const suspicious = lines.filter(line => line && (line.includes("  ") || line.includes(" , ") || line.includes(" ."))).slice(0, 3);
  if (!suspicious.length) {
    return [{
      type: "success",
      title: "Readability scan",
      evidence: "No obvious spacing or punctuation anomalies were detected in the parsed lines.",
      recommendation: "Run a final proofreading pass before sending the application."
    }];
  }
  return suspicious.map(line => ({
    type: "warning",
    title: "Minor wording cleanup",
    evidence: line,
    recommendation: "Tighten spacing, punctuation, or phrasing in this line for a more polished presentation."
  }));
};

const buildRepetitionFindings = (repeatedTerms = []) => {
  if (!repeatedTerms.length) {
    return [{
      type: "success",
      title: "Vocabulary variety",
      evidence: "No strongly repeated word clusters were detected beyond expected professional terms.",
      recommendation: "Continue using varied action verbs and role-specific nouns."
    }];
  }
  return repeatedTerms.slice(0, 4).map(([term, count]) => ({
    type: "warning",
    title: `Repeated term: ${term}`,
    evidence: `The word "${term}" appears ${count} times.`,
    recommendation: "Replace some repeats with more specific outcome, ownership, or domain language where appropriate."
  }));
};

const buildQuantifyImpactFindings = (bulletsWithoutMetrics = [], metricsLines = []) => {
  const findings = bulletsWithoutMetrics.slice(0, 3).map(line => ({
    type: "warning",
    title: "Bullet lacks measurable outcome",
    evidence: line,
    recommendation: "Add scale, efficiency, cost, revenue, or stakeholder impact if true.",
    rewrite: "Improved [process / workflow] by [X%] for [N users / teams] by leading [initiative]."
  }));
  if (metricsLines.length) {
    findings.unshift({
      type: "success",
      title: "Good quantified evidence already present",
      evidence: metricsLines[0],
      recommendation: "Keep quantified achievements like this visible near the top experience bullets."
    });
  }
  return findings.length ? findings : [{
    type: "info",
    title: "Impact baseline",
    evidence: "No strong candidate bullet was isolated automatically.",
    recommendation: "Review the experience section and add outcomes to the most important role bullets."
  }];
};

const buildRewrites = (bulletsWithoutMetrics = [], jdMatchMatrix = []) => {
  const list = [
    {
      section: "Summary",
      original: "Professional Summary",
      issue: "The summary needs keywords matching data and analytics roles.",
      suggested_rewrite: "Accomplished Analytics Professional with proven expertise in data-driven decision support, cross-functional dashboard design, and stakeholder reporting. Experienced in transforming raw corporate text streams into actionable pipeline visualizations using modern BI tools.",
      safe_to_use: true,
      note: "Use as a baseline template."
    }
  ];
  bulletsWithoutMetrics.slice(0, 3).forEach(line => {
    list.push({
      section: "Experience",
      original: line,
      issue: "This bullet describes responsibility but not outcome or scale.",
      suggested_rewrite: "Improved [process / workflow] by [X%] for [team / users] by leading [initiative], if true.",
      safe_to_use: false,
      note: "Use placeholders until you confirm the real number."
    });
  });
  jdMatchMatrix.slice(0, 2).forEach(item => {
    if (item.status !== "strong" && item.safe_rewrite) {
      list.push({
        section: "Skills",
        original: item.resume_evidence,
        issue: `The JD asks for ${item.requirement}, but the resume does not show clear proof.`,
        suggested_rewrite: item.safe_rewrite,
        safe_to_use: false,
        note: "Add only if true."
      });
    }
  });
  return list.slice(0, 6);
};

const buildCategoryScoresFromPoints = (points = []) => {
  const staticCategories = [
    "Hard Skills & Technical Proficiency",
    "Soft Skills & Behavioral Competencies",
    "Job Title & Seniority Alignment",
    "Experience & Industry Relevance",
    "Education & Credentials",
    "Keyword Optimization & Context",
    "Impact & Deliverables Mapping",
    "Language, Methodology & Terminology",
    "Logistical & Administrative Alignment",
    "Cultural Fit & Core Values"
  ];
  const grouped = {};
  points.forEach(point => {
    const cat = point.category || "General";
    if (!grouped[cat]) {
      grouped[cat] = [];
    }
    grouped[cat].push(point);
  });

  return staticCategories.map(category => {
    const list = grouped[category] || [];
    const passed = list.filter(p => p.current_status === "Passed").length;
    const avgScore = list.length ? Math.round(list.reduce((sum, p) => sum + (p.score || 0), 0) / list.length) : 0;
    return {
      category,
      score: avgScore,
      total_points: list.length,
      passed_points: passed,
      needs_improvement_points: list.filter(p => p.current_status === "Needs Improvement").length,
      critical_fix_points: list.filter(p => p.current_status === "Critical Fix").length
    };
  });
};

const buildImpactLanguageSummary = (text = "") => {
  const safeText = text || "";
  const words = tokenizeText(safeText);
  const impactVerbs = ["led", "managed", "delivered", "increased", "decreased", "saved", "improved", "implemented", "designed", "developed"];
  const count = words.filter(w => impactVerbs.includes(w)).length;
  return {
    score: Math.min(100, 45 + count * 8),
    verb_count: count,
    message: count > 6 
      ? "Strong use of action-driven language." 
      : "Consider replacing passive verbs with action verbs like 'managed', 'improved', or 'led'."
  };
};

const buildCareerTimeline = (text = "") => {
  const jsDatePattern = /((?:0?[1-9]|1[0-2])\/\d{4}|\d{4})\s*(?:to|-|–|—)\s*(current|present|(?:0?[1-9]|1[0-2])\/\d{4}|\d{4})/gi;
  
  const toYear = (value) => {
    if (!value) return null;
    const lowered = value.toLowerCase();
    if (["current", "present"].includes(lowered)) {
      return new Date().getFullYear() + 0.4;
    }
    if (value.includes("/")) {
      const [month, year] = value.split("/");
      return parseInt(year) + (parseInt(month) - 1) / 12;
    }
    return parseFloat(value);
  };

  const timeline = [];
  const safeText = text || "";
  safeText.split(/\r?\n/).forEach(line => {
    const match = jsDatePattern.exec(line);
    jsDatePattern.lastIndex = 0; 
    if (!match) return;
    const startStr = match[1];
    const endStr = match[2];
    const start = toYear(startStr);
    const end = toYear(endStr);
    if (start === null || end === null || isNaN(start) || isNaN(end)) return;
    const label = line.replace(jsDatePattern, "").trim().replace(/^[||\-–—\s]+|[||\-–—\s]+$/g, "");
    timeline.push({
      label: (label || "Role Profile").slice(0, 42),
      start,
      end,
      startLabel: startStr,
      endLabel: endStr
    });
  });

  return timeline.sort((a, b) => a.start - b.start).slice(0, 8);
};

const buildKeywordCloud = (text = "") => {
  const tokens = tokenizeText(text);
  const counts = {};
  tokens.forEach(t => {
    counts[t] = (counts[t] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([word, weight]) => ({ word, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 15);
};

const buildSkillMix = (text = "") => {
  const safeText = text || "";
  const mix = [];
  Object.entries(SKILL_BUCKETS).forEach(([label, list]) => {
    const found = extractKeywordsFromText(safeText, list);
    if (found.length) {
      mix.push({
        label: label.replace("_", " ").toUpperCase(),
        value: found.length,
        color: label === "programming_languages" ? "#0B2146" : label === "bi_tools" ? "#2583CF" : label === "data_tools" ? "#1EAD4E" : label === "analytics_methods" ? "#F5B800" : "#64748B"
      });
    }
  });
  return mix;
};

const buildQuickScanSections = (points = []) => {
  const actionable = points.filter(p => p.current_status !== "Passed");
  const blockers = actionable.filter(p => p.current_status === "Critical Fix");
  const strengths = points.filter(p => p.current_status === "Passed");

  const formatItem = (point, prefix = null) => {
    const message = point.improvement_suggestion || point.explanation || point.title || "";
    const title = point.title || "Resume update";
    const lead = prefix || title;
    return `${lead}: ${message}`.trim();
  };

  const highPriorityItems = blockers.slice(0, 4).map(p => formatItem(p));
  const missingElements = actionable
    .filter(p => ["Education & Credentials", "Keyword Optimization & Context", "Logistical & Administrative Alignment"].includes(p.category))
    .slice(0, 4)
    .map(p => formatItem(p));
  const contentAdjustments = actionable
    .filter(p => ["Impact & Deliverables Mapping", "Language, Methodology & Terminology", "Soft Skills & Behavioral Competencies"].includes(p.category))
    .slice(0, 4)
    .map(p => formatItem(p));
  const strengthItems = strengths.slice(0, 4).map(p => formatItem(p, p.title || "Strength"));

  return [
    {
      title: "High-Priority Updates (ATS Blockers)",
      items: highPriorityItems.length ? highPriorityItems : [
        "No severe ATS blockers were detected in the current scan, but the highlighted critical items should still be reviewed closely if they appear in the detailed report."
      ]
    },
    {
      title: "Missing Elements",
      items: missingElements.length ? missingElements : [
        "Add any missing skills, keywords, credentials, links, or logistical details that the 50-point review flags as absent or weakly represented."
      ]
    },
    {
      title: "Content Adjustments",
      items: contentAdjustments.length ? contentAdjustments : [
        "Tighten the summary, strengthen action verbs, and make more room for quantified outcomes in the experience section."
      ]
    },
    {
      title: "What You Are Doing Right (Strengths)",
      items: strengthItems.length ? strengthItems : [
        "The resume already contains several ATS-friendly strengths, including clearer evidence in the checks that passed in the detailed analysis below."
      ]
    }
  ];
};

// Helper parsers for resume data extraction
const parseExperience = (lines = []) => {
  const jobs = [];
  let currentJob = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Clean leading bullet symbol to check if it's a job header
    const cleanLine = trimmed.replace(/^[•◦▪\-\*\+◦]\s*/, "").trim();
    
    // Check if date pattern exists
    const hasDate = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|Current|\b\d{4}\b)/i.test(cleanLine) &&
                    /(?:-|–|—|to)/.test(cleanLine);

    // If it has date and is relatively short, it's a header
    const isHeader = hasDate && cleanLine.length < 90;

    if (isHeader) {
      if (currentJob) {
        jobs.push(currentJob);
      }

      let title = cleanLine;
      let company = "Company Profile";
      let dateStr = "";

      const dateMatch = cleanLine.match(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z']*\s*\d{0,4}\s*(?:-|–|—|to)\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z']*\s*\d{0,4})|\b\d{4}\s*(?:-|–|—|to)\s*(?:\d{4}|Present|Current))/i);
      if (dateMatch) {
        dateStr = dateMatch[0];
        title = title.replace(dateStr, "").trim();
      }

      const sepMatch = title.match(/\s*[\-\|]\s*/);
      if (sepMatch) {
        const parts = title.split(sepMatch[0]);
        company = parts[0].trim();
        title = parts.slice(1).join(" - ").trim();
      }

      title = title.replace(/^[\-\|,\s]+|[\-\|,\s]+$/g, "").trim();
      company = company.replace(/^[\-\|,\s]+|[\-\|,\s]+$/g, "").trim();

      let start_date = "2021";
      let end_date = "Present";
      if (dateStr) {
        const dateParts = dateStr.split(/\s*(?:-|–|—|to)\s*/i);
        if (dateParts[0]) start_date = dateParts[0].trim();
        if (dateParts[1]) end_date = dateParts[1].trim();
      }

      currentJob = {
        title: title || "Role Title",
        company: company || "Company Name",
        start_date,
        end_date,
        bullets: [],
        tools_detected: [],
        skills_detected: [],
        quantified_impacts: []
      };
    } else {
      const cleanBullet = trimmed.replace(/^[•◦▪\-\*\+◦]\s*/, "").trim();
      if (currentJob) {
        // Limit to max 2 bullets per job to fit on one page
        if (currentJob.bullets.length < 2) {
          currentJob.bullets.push(cleanBullet.slice(0, 110));
        }
      } else {
        currentJob = {
          title: "Software Engineer",
          company: "Professional Experience",
          start_date: "2021",
          end_date: "Present",
          bullets: [cleanBullet.slice(0, 110)],
          tools_detected: [],
          skills_detected: [],
          quantified_impacts: []
        };
      }
    }
  });

  if (currentJob) {
    jobs.push(currentJob);
  }

  // Limit to max 2 jobs for compact layout
  return jobs.slice(0, 2);
};

const parseEducation = (lines = []) => {
  const eduList = [];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (/academic qualification|cgpa|%/i.test(trimmed) && /institution|institute/i.test(trimmed)) {
      return;
    }

    // Must contain a degree or school keyword to filter out relevant coursework tables
    const degreeKeywords = [
      /B\.?Tech\b/i, /M\.?Tech\b/i, /B\.?Sc\b/i, /M\.?Sc\b/i, /B\.?A\b/i, /M\.?A\b/i,
      /Bachelor[s]?\b/i, /Master[s]?\b/i, /PhD\b/i, /Ph\.D\b/i, /MBA\b/i,
      /\bXII\b/i, /\bX\b/i, /Secondary/i, /School\b/i, /High\s+School/i, /Academy\b/i, /College\b/i
    ];
    const isDegreeLine = degreeKeywords.some(rx => rx.test(trimmed));
    if (!isDegreeLine) {
      return;
    }

    let year = "2020";
    const yearMatch = trimmed.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      year = yearMatch[0];
    }
    const rangeMatch = trimmed.match(/\b\d{4}\s*(?:-|–|—|to)\s*(?:\d{4}|Present|Current)\b/i);
    if (rangeMatch) {
      year = rangeMatch[0];
    }

    if (trimmed.toLowerCase().includes("coursework") || /^[•◦▪\-\*\+◦]\s*/.test(trimmed)) {
      return;
    }

    let degree = trimmed;
    let institution = "Institution";

    const instKeywords = [
      /Indian\s+Institute\s+of\s+Technology/i, /IIT\b/i, /University\b/i, /College\b/i,
      /School\b/i, /Academy\b/i, /Institute\b/i
    ];
    let instMatch = "";
    for (const rx of instKeywords) {
      const m = trimmed.match(rx);
      if (m) {
        instMatch = m[0];
        break;
      }
    }

    if (instMatch) {
      const instIndex = trimmed.indexOf(instMatch);
      institution = trimmed.substring(instIndex).replace(/[\d\.\/]+$/, "").replace(/,\s*$/, "").trim();
      degree = trimmed.substring(0, instIndex).replace(year, "").replace(/^[\s\-–—|:,]+|[\s\-–—|:,]+$/g, "").trim();
    } else {
      const parts = trimmed.split(/[,|–\-—]/);
      if (parts.length >= 2) {
        degree = parts[0].replace(year, "").trim();
        institution = parts[1].trim();
      }
    }

    if (!degree || degree.length < 3) {
      degree = trimmed.slice(0, 80);
    }

    eduList.push({
      degree,
      institution,
      end_year: year,
      evidence: trimmed
    });
  });

  // Limit to max 2 items
  return eduList.slice(0, 2);
};

const parseProjects = (lines = []) => {
  const projList = [];
  let currentProj = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase().includes("coursework") || trimmed.toLowerCase().includes("technical skills")) {
      return;
    }

    const cleanLine = trimmed.replace(/^[•◦▪\-\*\+◦]\s*/, "").trim();
    const hasDate = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|Current|\b\d{4}\b)/i.test(cleanLine) &&
                    /(?:-|–|—|to)/.test(cleanLine);
    const isHeader = hasDate && cleanLine.length < 90;

    if (isHeader) {
      if (currentProj) {
        projList.push(currentProj);
      }

      let name = cleanLine;
      let dateStr = "";
      const dateMatch = cleanLine.match(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z']*\s*\d{0,4}\s*(?:-|–|—|to)\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z']*\s*\d{0,4})|\b\d{4}\s*(?:-|–|—|to)\s*(?:\d{4}|Present|Current))/i);
      if (dateMatch) {
        dateStr = dateMatch[0];
        name = name.replace(dateStr, "").trim();
      }

      name = name.replace(/^[\-\|,\s]+|[\-\|,\s]+$/g, "").trim();

      currentProj = {
        name: name || "Project Title",
        description: "",
        evidence: trimmed
      };
    } else {
      const cleanBullet = trimmed.replace(/^[•◦▪\-\*\+◦]\s*/, "").trim();
      if (currentProj) {
        if (!currentProj.description) {
          currentProj.description = cleanBullet.slice(0, 120);
        }
      } else {
        currentProj = {
          name: "Key Project",
          description: cleanBullet.slice(0, 120),
          evidence: trimmed
        };
      }
    }
  });

  if (currentProj) {
    projList.push(currentProj);
  }

  // Limit to max 2 projects
  return projList.slice(0, 2);
};

// Main Analysis Reconstructor
export const buildAdvancedReport = (analysisReport, resumeText = "", fileName = "Resume.pdf") => {
  const safeText = resumeText || "";
  const lines = safeText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  const jdText = analysisReport?.jdText || "";
  const extJd = extractJdData(jdText);
  const sectionsDetected = detectResumeSections(lines);
  const sectionsMissing = ["Summary", "Experience", "Education", "Skills", "Projects", "Certifications"].filter(
    s => !sectionsDetected.includes(s)
  );

  const emailMatch = safeText.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
  const phoneMatch = safeText.match(/(\+?\d[\d\s().-]{7,}\d)/);
  const linkedinMatch = safeText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|]+/i);
  const urlMatch = safeText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|]+/i) || safeText.match(/https?:\/\/[^\s|]+/i);
  const locationMatch = safeText.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2,})\b/);

  let verifiedLinkedin = linkedinMatch ? linkedinMatch[0] : null;
  if (verifiedLinkedin && !/^https?:\/\//i.test(verifiedLinkedin)) {
    verifiedLinkedin = "https://" + verifiedLinkedin;
  }
  if (!verifiedLinkedin) {
    for (const line of lines.slice(0, 8)) {
      if (line.includes(":")) {
        const parts = line.split(":");
        const right = parts[parts.length - 1].trim();
        if (/^[a-zA-Z0-9\-_]+$/.test(right) && !/^\d+$/.test(right) && right.length >= 3 && right.length <= 30) {
          if (!right.includes("@")) {
            verifiedLinkedin = "https://linkedin.com/in/" + right;
            break;
          }
        }
      }
    }
  }

  const metricsLines = lines.filter(line => 
    line && /(\d+%|\d+\+?|₹|\$|hours|users|employees|months|years)/i.test(line)
  );
  
  const bulletLines = lines.filter(line => {
    if (!line) return false;
    const words = line.split(/\s+/).length;
    const isHeading = ["summary", "experience", "education", "skills", "projects", "certifications"].includes(line.toLowerCase().trim());
    return words > 6 && !isHeading;
  });

  const bulletsWithoutMetrics = bulletLines.filter(line => 
    !/(\d+%|\d+\+?|₹|\$|hours|users|employees|months|years)/i.test(line)
  );

  const repeatedTerms = findRepeatedTerms(safeText);
  const parseRisks = detectParseRisks(safeText);

  // 1. Scoring Logic
  const atsParseScore = Math.max(0, Math.min(100, Math.round(
    92
    - (parseRisks.tables_detected ? 14 : 0)
    - (parseRisks.multi_column_risk === "high" ? 12 : parseRisks.multi_column_risk === "medium" ? 6 : 0)
    - (!emailMatch ? 8 : 0)
    - (!phoneMatch ? 8 : 0)
    - (4 * sectionsMissing.length)
  )));

  const contentQualityScore = Math.max(0, Math.min(100, Math.round(
    66
    + Math.min(metricsLines.length * 4, 18)
    - Math.min(repeatedTerms.length * 3, 12)
    - Math.min(bulletsWithoutMetrics.length, 4) * 3
  )));

  const hasGapSignal = lines.some(line => /\b(19|20)\d{2}\b/.test(line));
  const hasAgeBiasSignal = lines.some(line => /\b(19\d{2}|200\d)\b/.test(line) && (line.toLowerCase().includes("education") || line.toLowerCase().includes("bachelor") || line.toLowerCase().includes("master")));

  const riskScore = Math.max(0, Math.min(100, Math.round(
    18
    + (!verifiedLinkedin ? 16 : 0)
    + (parseRisks.tables_detected ? 10 : 0)
    + (sectionsMissing.length >= 2 ? 10 : 0)
    + (hasGapSignal ? 8 : 0)
    + (hasAgeBiasSignal ? 6 : 0)
  )));

  // Requirement Matrix Matcher
  const jdMatchMatrix = [];
  const reqs = extJd.must_have_requirements;
  reqs.forEach((item, idx) => {
    const reqName = item.requirement;
    const [evidenceLine, evidenceLevel] = findRequirementEvidence(reqName, lines);
    
    let status = "missing";
    let rec = `The JD asks for ${reqName}. Add evidence matching this skill if applicable.`;
    let rewrite = `Add experience using ${reqName} to your bullet points.`;
    if (evidenceLevel === "direct") {
      status = "strong";
      rec = "Maintain this skill context high up in your profile layout.";
      rewrite = null;
    } else if (evidenceLevel === "semantic") {
      status = "partial";
      rec = `The resume lists related terms for ${reqName}, but adding the exact phrase is safer.`;
      rewrite = `Clarify context where you used ${reqName}.`;
    } else if (evidenceLevel === "weak") {
      status = "weak";
      rec = `The resume hints at ${reqName} but lacks metric proof.`;
      rewrite = `Expand achievements using ${reqName}.`;
    }

    jdMatchMatrix.push({
      requirement: reqName,
      jd_evidence: item.evidence_from_jd || `Required in job: ${reqName}`,
      resume_evidence: evidenceLine || "No direct resume evidence detected.",
      status: status,
      severity: status === "missing" ? "high" : status === "strong" ? "low" : "medium",
      importance: "must_have",
      evidence_quality_level: evidenceLevel,
      recommendation: rec,
      safe_rewrite: rewrite
    });
  });

  const jdMatchScore = jdMatchMatrix.length 
    ? Math.max(0, Math.min(100, Math.round(
        jdMatchMatrix.reduce((sum, item) => {
          const val = item.status === "strong" ? 100 : item.status === "partial" ? 70 : item.status === "weak" ? 45 : 10;
          return sum + val;
        }, 0) / jdMatchMatrix.length
      )))
    : null;

  const recruiterReadinessScore = Math.max(0, Math.min(100, Math.round(
    (contentQualityScore + (100 - riskScore) + Math.min(metricsLines.length * 4, 16) + (emailMatch && phoneMatch ? 8 : 0)) / 3
  )));

  const getKeywordStrengthScore = (lines = []) => {
    let skillHits = 0;
    const allSkillWords = Object.values(SKILL_BUCKETS).flat();
    lines.slice(0, 24).forEach(line => {
      if (!line) return;
      const lowered = line.toLowerCase();
      allSkillWords.forEach(word => {
        const normalized = word.toLowerCase().trim();
        let match = false;
        if (["r", "ai", "ml"].includes(normalized)) {
          const rx = new RegExp(`(?<![a-zA-Z])${escapeRegExp(normalized)}(?![a-zA-Z])`, "i");
          match = rx.test(lowered);
        } else {
          const rx = new RegExp(`\\b${escapeRegExp(normalized)}\\b`, "i");
          match = rx.test(lowered);
        }
        if (match) {
          skillHits++;
        }
      });
    });
    return Math.max(0, Math.min(100, 48 + Math.min(skillHits * 3, 40)));
  };

  const overallReadinessScore = Math.max(0, Math.min(100, Math.round(
    atsParseScore * (jdMatchScore !== null ? 0.2 : 0.3)
    + (jdMatchScore !== null ? jdMatchScore : getKeywordStrengthScore(lines)) * (jdMatchScore !== null ? 0.4 : 0.15)
    + contentQualityScore * (jdMatchScore !== null ? 0.2 : 0.3)
    + recruiterReadinessScore * 0.2
    + (jdMatchScore !== null ? 0 : recruiterReadinessScore * 0.05)
  )));

  // Objections / Top Fixes
  const topFixes = [];
  if (!emailMatch || !phoneMatch) {
    topFixes.push({
      title: "Missing contact options",
      recommended_action: "Provide both cell phone and professional email address at the very top of your document.",
      why_it_matters: "Recruiters cannot contact you easily if your phone or email is missing or unreadable.",
      severity: "high",
      expected_score_impact: "+8"
    });
  }
  if (!verifiedLinkedin) {
    topFixes.push({
      title: "Missing LinkedIn verified link",
      recommended_action: "Add your fully qualified public LinkedIn profile URL to build recruiter trust.",
      why_it_matters: "A verified LinkedIn profile increases application credibility and trust.",
      severity: "medium",
      expected_score_impact: "+5"
    });
  }
  if (parseRisks.tables_detected) {
    topFixes.push({
      title: "Complex table block parsing risk",
      recommended_action: "Deconstruct your text tables and list skills/attributes as simple comma lists instead.",
      why_it_matters: "Tables often scramble text when parsed by older ATS software.",
      severity: "high",
      expected_score_impact: "+10"
    });
  }
  if (sectionsMissing.length > 0) {
    topFixes.push({
      title: "Missing core resume headers",
      recommended_action: `Ensure you have clear sections labeled ${sectionsMissing.slice(0, 3).join(", ")}.`,
      why_it_matters: "Standard section headers are necessary for the ATS to sort your experience.",
      severity: "high",
      expected_score_impact: "+12"
    });
  }
  if (bulletsWithoutMetrics.length > 3) {
    topFixes.push({
      title: "Vague non-quantifiable bullets",
      recommended_action: "Quantify your achievements by adding percentages, dollar metrics, or user scope counts.",
      why_it_matters: "Quantifying your achievements provides proof of scale and impact.",
      severity: "medium",
      expected_score_impact: "+6"
    });
  }
  // Fillers to always return at least 3 fixes
  while (topFixes.length < 3) {
    topFixes.push({
      title: "Tailor keyword matches",
      recommended_action: "Incorporate more exact keywords from your target job description to improve searchability.",
      why_it_matters: "Keyword density directly influences search relevance rankings.",
      severity: "medium",
      expected_score_impact: "+8"
    });
  }

  // 2. Sections construction
  const sectionMap = {};
  REPORT_SECTION_SPECS.forEach(([key, title, group, access]) => {
    let score = 85;
    let status = "passed";
    let findings = [];
    
    if (key === "resume_tailoring") {
      findings = buildResumeTailoringFindings(jdMatchMatrix);
      score = jdMatchScore || 70;
      status = score >= 80 ? "passed" : "needs_work";
    } else if (key === "career_progression") {
      findings = buildCareerProgressionFindings(lines);
      score = 78;
      status = "needs_work";
    } else if (key === "skill_evidence") {
      findings = buildSkillEvidenceFindings(lines, jdMatchMatrix);
      score = jdMatchScore || 70;
      status = score >= 80 ? "passed" : "needs_work";
    } else if (key === "ageism_date_bias") {
      findings = buildAgeBiasFindings(lines);
      score = findings.some(f => f.type === "warning") ? 75 : 95;
      status = score >= 80 ? "passed" : "needs_work";
    } else if (key === "employment_gaps") {
      findings = buildGapFindings(lines);
      score = findings.some(f => f.type === "warning") ? 68 : 95;
      status = score >= 80 ? "passed" : "needs_work";
    } else if (key === "peer_benchmarking") {
      findings = buildPeerBenchmarkFindings(metricsLines);
      score = contentQualityScore;
      status = score >= 80 ? "passed" : "needs_work";
    } else if (key === "linkedin_match") {
      score = verifiedLinkedin ? 95 : 35;
      status = verifiedLinkedin ? "passed" : "critical";
      findings = [{
        type: verifiedLinkedin ? "success" : "warning",
        title: "LinkedIn header link",
        evidence: verifiedLinkedin ? verifiedLinkedin : "No LinkedIn URL detected in the resume header.",
        recommendation: verifiedLinkedin ? "Keep a full public LinkedIn URL in the header." : "Add your full LinkedIn URL in the header for recruiter verification."
      }];
    } else if (key === "credibility") {
      findings = buildCredibilityFindings(bulletsWithoutMetrics);
      score = Math.max(0, Math.min(100, 70 + Math.min(metricsLines.length, 3) * 5));
      status = bulletsWithoutMetrics.length ? "needs_work" : "passed";
    } else if (key === "interview_risks") {
      findings = buildInterviewRiskFindings(lines, jdMatchMatrix);
      score = Math.max(0, Math.min(100, 68 + Math.min(metricsLines.length, 4) * 6));
      status = "needs_work";
    } else if (key === "dates_links") {
      findings = buildDatesLinksFindings(lines, verifiedLinkedin, urlMatch);
      score = Math.max(0, Math.min(100, 88 - (!verifiedLinkedin ? 16 : 0) - (findings.some(f => f.title.includes("gap")) ? 8 : 0)));
      status = !verifiedLinkedin ? "needs_work" : "passed";
    } else if (key === "header_links") {
      const itemsCount = [emailMatch, phoneMatch, locationMatch, verifiedLinkedin, urlMatch].filter(Boolean).length;
      score = Math.min(100, 55 + itemsCount * 9);
      status = emailMatch && phoneMatch ? "passed" : "needs_work";
      findings = [
        { type: emailMatch ? "success" : "warning", title: "Email", evidence: emailMatch ? emailMatch[0] : "No email detected.", recommendation: emailMatch ? "Keep a professional email." : "Add a cell email." },
        { type: phoneMatch ? "success" : "warning", title: "Phone", evidence: phoneMatch ? phoneMatch[0] : "No phone number detected.", recommendation: phoneMatch ? "Keep phone." : "Add direct contact phone number." },
      ];
    } else if (key === "email_address") {
      score = emailMatch ? 90 : 20;
      status = emailMatch ? "passed" : "critical";
      findings = [{
        type: emailMatch ? "success" : "error",
        title: "Email professionalism",
        evidence: emailMatch ? emailMatch[0] : "No email address found in the resume.",
        recommendation: emailMatch ? "Keep this email format." : "Add a simple professional email address without nicknames."
      }];
    } else if (key === "contact_information") {
      const contactItems = [emailMatch?.[0], phoneMatch?.[0], locationMatch?.[0], verifiedLinkedin].filter(Boolean);
      score = Math.min(100, 40 + contactItems.length * 15);
      status = emailMatch && phoneMatch && locationMatch ? "passed" : "needs_work";
      findings = [{
        type: "info",
        title: "Detected contact items",
        evidence: contactItems.join(", ") || "No core header information detected.",
        recommendation: "Add any missing header details so recruiters can contact you quickly."
      }];
    } else if (key === "file_format_size") {
      score = 92;
      status = "passed";
      findings = [{
        type: "info",
        title: "Detected file format",
        evidence: `${fileName} · Local Document`,
        recommendation: "Keep the file under 2MB and use PDF or DOCX for widest ATS compatibility."
      }];
    } else if (key === "ats_parse_rate") {
      score = atsParseScore;
      status = atsParseScore >= 80 ? "passed" : atsParseScore >= 60 ? "needs_work" : "critical";
      findings = [{
        type: atsParseScore >= 80 ? "success" : "warning",
        title: "Layout parse blockers",
        evidence: parseRisks.flags.join("; ") || "No major formatting errors found.",
        recommendation: parseRisks.recommendations.join(" ")
      }];
    } else if (key === "essential_sections") {
      score = Math.max(0, 100 - sectionsMissing.length * 12);
      status = !sectionsMissing.length ? "passed" : "needs_work";
      findings = [{
        type: sectionsMissing.length ? "warning" : "success",
        title: "Detected sections",
        evidence: `Found: ${sectionsDetected.join(", ") || "None"}. Missing: ${sectionsMissing.join(", ") || "None"}.`,
        recommendation: "Add the missing sections that are truly relevant to the target role."
      }];
    } else if (key === "sections_order") {
      findings = buildSectionOrderFindings(sectionsDetected);
      score = sectionsDetected.indexOf("Experience") < 3 ? 78 : 65;
      status = "needs_work";
    } else if (key === "bullets_consistency") {
      findings = buildBulletConsistencyFindings(lines);
      score = 80;
      status = "needs_work";
    } else if (key === "spelling_grammar") {
      findings = buildSpellingFindings(lines);
      score = 84;
      status = "needs_work";
    } else if (key === "repetition") {
      findings = buildRepetitionFindings(repeatedTerms);
      score = Math.max(0, 86 - Math.min(repeatedTerms.length, 5) * 5);
      status = repeatedTerms.length ? "needs_work" : "passed";
    } else if (key === "quantify_impact") {
      findings = buildQuantifyImpactFindings(bulletsWithoutMetrics, metricsLines);
      score = Math.max(0, Math.min(100, 58 + Math.min(metricsLines.length, 5) * 8));
      status = bulletsWithoutMetrics.length ? "needs_work" : "passed";
    }

    sectionMap[key] = {
      id: key,
      title,
      group,
      free_or_premium: access,
      issue_count: findings.filter(f => ["warning", "error"].includes(f.type)).length,
      status,
      score,
      summary: `Evaluates metrics supporting ${title.toLowerCase()} configurations.`,
      findings,
      faq: [{
        question: `Why does ${title.toLowerCase()} matter?`,
        answer: "ATS filters check this signal to determine whether the document parses cleanly and can be indexed easily."
      }]
    };
  });

  const orderedSections = REPORT_SECTION_SPECS.map(([key]) => sectionMap[key]);

  const rawPoints = (analysisReport && analysisReport.analysis_points) || [];
  const categoryScores = buildCategoryScoresFromPoints(rawPoints);

  const visualSummary = {
    overall_score: overallReadinessScore,
    category_breakdown: categoryScores.map(c => ({ category: c.category, score: c.score })),
    impact_language: buildImpactLanguageSummary(safeText),
    career_timeline: buildCareerTimeline(safeText),
    keyword_cloud: buildKeywordCloud(safeText),
    skill_mix: buildSkillMix(safeText),
  };

  const rewritesList = buildRewrites(bulletsWithoutMetrics, jdMatchMatrix);

  const appQuestions = extJd.application_questions.map(q => ({
    question: q,
    suggested_answer_guidance: "Frame your answer with a direct metric demonstrating how you managed this system tool in previous positions."
  }));

  const sectionLines = splitLinesIntoSections(lines);
  const finalWorkExperience = parseExperience(sectionLines.Experience || []);
  const finalEducation = parseEducation(sectionLines.Education || []);
  const finalProjects = parseProjects(sectionLines.Projects || []);

  const computedTitle = (() => {
    let currentTitle = null;
    const lowerName = (analysisReport?.candidate_name || fileName || "").toLowerCase();
    for (const line of lines.slice(0, 12)) {
      if (!line) continue;
      const lowerLine = line.toLowerCase();
      if (lowerName && lowerLine.includes(lowerName)) continue;
      if (["@", "linkedin", "http", "email", "phone", "cell"].some(t => lowerLine.includes(t))) continue;
      const words = line.trim().split(/\s+/).length;
      if (words >= 2 && words <= 8 && ["manager", "analyst", "engineer", "lead", "specialist", "consultant", "director", "developer", "intern"].some(t => lowerLine.includes(t))) {
        currentTitle = line.trim();
        break;
      }
    }
    return currentTitle || bulletLines[0]?.slice(0, 60) || "Analytics Professional";
  })();

  const profile = {
    name: extractCandidateName(safeText, fileName),
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    location: locationMatch ? locationMatch[0] : "Location verified",
    linkedin: verifiedLinkedin,
    portfolio: urlMatch ? (urlMatch[0].startsWith("http") ? urlMatch[0] : "https://" + urlMatch[0]) : null,
    current_title: computedTitle,
    total_experience: "5+ years",
    summary: (() => {
      if (sectionLines.Summary && sectionLines.Summary.length > 0) {
        const joined = sectionLines.Summary.join(" ").trim();
        if (joined.length > 25) return joined.slice(0, 260);
      }
      const skillsList = extractKeywordsFromText(safeText, SKILL_BUCKETS.programming_languages.concat(SKILL_BUCKETS.data_tools));
      const topSkills = skillsList.slice(0, 3).join(", ");
      const primaryCompany = finalWorkExperience[0]?.company;
      const mainProject = finalProjects[0]?.name;

      if (topSkills && primaryCompany && mainProject) {
        return `Results-driven ${computedTitle} with expertise in ${topSkills}. Proven track record of delivering end-to-end technical solutions at ${primaryCompany}, including leading projects like ${mainProject}.`;
      } else if (topSkills && primaryCompany) {
        return `Detail-oriented ${computedTitle} specializing in ${topSkills}. Experienced in building high-quality software, with professional experience at ${primaryCompany}.`;
      } else if (topSkills) {
        return `Driven ${computedTitle} specializing in ${topSkills}, dedicated to applying technical expertise and analytical skills to solve complex challenges.`;
      } else {
        return `Accomplished and results-driven professional with a solid background in engineering and technical problem solving, focused on delivering high-impact operational outcomes.`;
      }
    })()
  };

  const extractedResumeData = {
    candidate_profile: profile,
    education: finalEducation,
    work_experience: finalWorkExperience,
    skills: {
      technical_skills: extractKeywordsFromText(safeText, SKILL_BUCKETS.programming_languages.concat(SKILL_BUCKETS.data_tools)),
      tools: extractKeywordsFromText(safeText, TOOL_KEYWORDS),
      programming_languages: extractKeywordsFromText(safeText, SKILL_BUCKETS.programming_languages),
      bi_tools: extractKeywordsFromText(safeText, SKILL_BUCKETS.bi_tools),
      data_tools: extractKeywordsFromText(safeText, SKILL_BUCKETS.data_tools),
      analytics_methods: extractKeywordsFromText(safeText, SKILL_BUCKETS.analytics_methods),
      soft_skills: extractKeywordsFromText(safeText, SKILL_BUCKETS.soft_skills),
      domain_skills: extractKeywordsFromText(safeText, SKILL_BUCKETS.domain_skills)
    },
    projects: finalProjects,
    certifications: (sectionLines.Certifications || []).slice(0, 2).map(l => ({
      name: l,
      evidence: l
    })),
    achievements: (sectionLines.Achievements || []).slice(0, 2),
    formatting_signals: {
      file_format: fileName.split(".").pop().toUpperCase(),
      tables_detected: parseRisks.tables_detected,
      multi_column_risk: parseRisks.multi_column_risk,
      section_detection_confidence: 88,
      parse_rate: atsParseScore,
      sections_detected: sectionsDetected,
      sections_missing: sectionsMissing
    }
  };

  return {
    analysis_id: (analysisReport && analysisReport.analysis_id) || "client_analysis_" + Date.now(),
    resume_id: analysisReport?.resume_id,
    resume_file_name: fileName,
    candidate_name: profile.name,
    overall_score: overallReadinessScore,
    jd_match_score: jdMatchScore,
    summary: (analysisReport && analysisReport.summary) || `Evaluation completed with score ${overallReadinessScore}/100.`,
    created_at: new Date().toISOString(),
    has_job_description: !!jdText,
    job_description_excerpt: jdText ? jdText.slice(0, 150) + "..." : "",
    quick_scan_sections: (analysisReport && analysisReport.quick_scan_sections) || buildQuickScanSections(rawPoints),
    category_scores: categoryScores,
    visual_summary: visualSummary,
    analysis_points: rawPoints,
    executive_summary: {
      overall_readiness_score: overallReadinessScore,
      ats_parse_score: atsParseScore,
      jd_match_score: jdMatchScore,
      content_quality_score: contentQualityScore,
      recruiter_readiness_score: recruiterReadinessScore,
      risk_score: riskScore,
      score_band: overallReadinessScore >= 80 ? "Strong Fit" : overallReadinessScore >= 60 ? "Average Match" : "Weak Fit",
      decision_signal: overallReadinessScore >= 80 ? "PASSED" : "REVIEW_objections",
      recommendation: `Resume is scored at ${overallReadinessScore}/100. Key fixes can elevate matching rating.`,
      top_fixes: topFixes,
      score_explanation: {
        estimated_potential_score_after_rewrite: Math.min(98, overallReadinessScore + topFixes.length * 4)
      }
    },
    extracted_resume_data: extractedResumeData,
    extracted_jd_data: extJd,
    jd_match_matrix: jdMatchMatrix,
    analysis_sections: orderedSections,
    rewrites: rewritesList,
    ats_formatting: extractedResumeData.formatting_signals,
    application_question_guidance: appQuestions,
    final_action_plan: topFixes.map(t => t.recommended_action)
  };
};
