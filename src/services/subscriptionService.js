export const POINTS_PER_USD = 20000;

export const formatUsd = (value = 0) => `$${Number(value || 0).toFixed(4)}`;

export const isResumeBuilderService = (serviceId = '') => {
  if (!serviceId) return false;
  const s = String(serviceId).toLowerCase().trim();
  if (
    s.startsWith('ats_resume_scan') ||
    s.startsWith('ats_scan') ||
    s.startsWith('ats_report') ||
    s.startsWith('ats_analysis') ||
    s.startsWith('ats_job_match') ||
    s.startsWith('cover_letter') ||
    s.startsWith('coverletter') ||
    s === 'cover letter' ||
    s.startsWith('certifi') ||
    s.startsWith('razorpay') ||
    s.startsWith('upgrade') ||
    s === 'onboarding' ||
    s === 'monthly_renewal'
  ) {
    return false;
  }
  return (
    s === 'calculate_ats_score' ||
    s === 'ats_score_analysis' ||
    s === 'ats score analysis' ||
    s === 'generate_interview_prep' ||
    s === 'interview_prep' ||
    s === 'interview prep generation' ||
    s === 'job_description_analysis' ||
    s === 'job description analysis' ||
    s === 'cora_career_assistant' ||
    s === 'cora career assistant' ||
    s === 'tailor_resume' ||
    s === 'extract_resume' ||
    s === 'generate_resume' ||
    s.includes('bullet') ||
    s.includes('builder')
  );
};

export const isAtsCheckerLedgerService = (serviceId = '') => {
  if (!serviceId) return false;
  const s = String(serviceId).toLowerCase().trim();
  if (isResumeBuilderService(s)) return false;
  if (
    s.startsWith('cover_letter') ||
    s.startsWith('coverletter') ||
    s === 'cover letter' ||
    s.startsWith('certifi') ||
    s.startsWith('razorpay') ||
    s.startsWith('upgrade') ||
    s === 'onboarding' ||
    s === 'monthly_renewal'
  ) {
    return false;
  }
  return (
    s.startsWith('ats_') ||
    s.includes('ats checker') ||
    s === 'ats scan' ||
    s === 'ats report' ||
    s === 'ats analysis' ||
    s === 'ats job match' ||
    s === 'career_tool'
  );
};

export const getActualReportTokens = (report = {}) => {
  if (report.tokens_cost || report.careerPoints || report.total_tokens || report.tokensCost) {
    return Number(report.tokens_cost || report.careerPoints || report.total_tokens || report.tokensCost) || 0;
  }
  const base = report.has_job_description ? 1825 : 1350;
  const scoreBonus = Math.round((report.overall_score || 0) * 4.75);
  return base + scoreBonus;
};

export const estimateResumePoints = () => 180;
export const estimateJdPoints = () => 95;

export const calculateAtsUsage = (ledger = [], reports = [], resumes = [], jobDescriptions = []) => {
  const validLedger = (ledger || []).filter(
    (log) => log.amount < 0 && isAtsCheckerLedgerService(log.serviceId)
  );

  if (validLedger.length > 0) {
    const totalPoints = validLedger.reduce((sum, log) => sum + Math.abs(log.amount || 0), 0);
    return {
      totalPoints,
      estimatedCost: totalPoints / POINTS_PER_USD,
      hasLedger: true
    };
  }

  // Fallback to reports + resumes + JDs
  const reportUnits = (reports || []).reduce((total, r) => total + getActualReportTokens(r), 0);
  const resumeUnits = (resumes || []).length * estimateResumePoints();
  const jdUnits = (jobDescriptions || []).length * estimateJdPoints();
  const totalPoints = reportUnits + resumeUnits + jdUnits;

  return {
    totalPoints,
    estimatedCost: totalPoints / POINTS_PER_USD,
    hasLedger: false
  };
};

export const isPaidPlan = (plan = '') => {
  if (!plan) return false;
  const p = String(plan).toLowerCase().trim();
  return p !== 'free';
};

export const fetchSubscriptionStatus = async (clerkId) => {
  if (!clerkId) return { plan: 'free', tokensRemaining: 30000 };
  try {
    const apiBase =
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      "https://server.datasenseai.com";
    const backendUrl = apiBase.replace(/\/careersense\/ats\/?$/, "");
    const res = await fetch(`${backendUrl}/careersense/subscription/status?clerkId=${clerkId}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.success) {
        return {
          plan: data.plan || 'free',
          tokensRemaining: data.tokensRemaining ?? 30000,
        };
      }
    }
  } catch (err) {
    console.error("Error fetching subscription status in subscriptionService:", err);
  }
  return { plan: 'free', tokensRemaining: 30000 };
};
