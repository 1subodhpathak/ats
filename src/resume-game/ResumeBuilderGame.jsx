import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import backgroundMusic from "./Background.mp3";
import blueLogo from "../assets/logos/BlueLogo.png";
import goldenLogo from "../assets/logos/GoldenLogo.png";
import ResumeGameTour from "./ResumeGameTour";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  Award,
  Briefcase,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Code2,
  Crown,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  HeartPulse,
  Linkedin,
  LineChart,
  Mail,
  MapPin,
  MoonStar,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Trophy,
  User,
  Volume2,
  VolumeX,
  Wrench,
} from "lucide-react";

const THEMES = {
  dark: {
    app: "bg-transparent text-white",
    panel: "bg-[#0B3A57] border-[#2C6079] shadow-[0_18px_40px_rgba(5,35,54,.16)]",
    panelStrong: "bg-[#082F48] border-[#44677A]",
    card: "bg-[#124866] border-[#2B607B] text-white hover:border-[#D2A044] hover:bg-[#15506F]",
    staged: "border-[#D49A2E] bg-[#173F59] shadow-[0_0_0_1px_rgba(212,154,46,.10),0_10px_24px_rgba(4,29,45,.16)]",
    iconShell: "bg-[#1C536F] text-[#93AFC0]",
    iconShellActive: "bg-[#FFF0C9] text-[#C48615]",
    textMuted: "text-[#B5C8D3]",
    textSoft: "text-[#88A5B6]",
    canvas: "bg-white text-[#263845]",
    feedbackSuccess: "bg-[#EAF7F2] text-[#11735D] border-[#5AB79B]",
    feedbackError: "bg-[#FDEDEC] text-[#B54743] border-[#E28B87]",
  },
  light: {
    app: "bg-transparent text-[#123A54]",
    panel: "bg-[#FFFEFC] border-[#D8E2E7] shadow-[0_16px_36px_rgba(18,58,84,.06)]",
    panelStrong: "bg-[#FBF6ED] border-[#DFC99E]",
    card: "bg-white border-[#D8E2E7] text-[#123A54] hover:border-[#C98A1D]",
    staged: "border-[#C98A1D] bg-[#FFF5DE] shadow-[0_8px_20px_rgba(201,138,29,.08)]",
    iconShell: "bg-[#EEF4F7] text-[#7191A4]",
    iconShellActive: "bg-[#FFF0CC] text-[#C48615]",
    textMuted: "text-[#688394]",
    textSoft: "text-[#86A0AE]",
    canvas: "bg-white text-[#263845]",
    feedbackSuccess: "bg-[#EAF7F2] text-[#11735D] border-[#5AB79B]",
    feedbackError: "bg-[#FDEDEC] text-[#B54743] border-[#E28B87]",
  },
};

const RESUME_REWARD_TOKENS = 500;
const MAX_RESUME_REWARD_TOKENS = 3500;

function getGameStorageKey(userId) {
  return `careersense:resume-quest:${userId}`;
}

async function claimResumeQuestReward({ userId, profileId }) {
  const apiBase =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://server.datasenseai.com";
  const backendUrl = apiBase.replace(/\/careersense\/ats\/?$/, "");
  const token =
    typeof window.clerkGetToken === "function"
      ? await window.clerkGetToken()
      : null;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);
  let response;
  try {
    response = await fetch(
      `${backendUrl}/careersense/subscription/resume-quest/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ clerkId: userId, profileId }),
        signal: controller.signal,
      }
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Your reward could not be added right now.");
  }
  return data;
}

const PROFILE_ICONS = {
  "data-analyst": LineChart,
  "data-engineer": Archive,
  "business-analyst": BriefcaseBusiness,
  "software-developer": Code2,
  ceo: Crown,
  "financial-analyst": LineChart,
  doctor: HeartPulse,
};

const BASE_ZONES = [
  { id: "name", title: "Name", accepts: "name", type: "header" },
  { id: "title", title: "Title", accepts: "title", type: "header" },
  { id: "phone", title: "Phone", accepts: "phone", type: "contact" },
  { id: "email", title: "Email", accepts: "email", type: "contact" },
  { id: "linkedin", title: "LinkedIn", accepts: "linkedin", type: "contact" },
  { id: "location", title: "Location", accepts: "location", type: "contact" },
  { id: "summary", title: "Summary", accepts: "summary", type: "section" },
  { id: "job1-title", title: "Role 1", accepts: "jobTitle1", type: "section" },
  { id: "job1-dates", title: "Role 1 Dates", accepts: "jobDates1", type: "section" },
  { id: "job1-desc", title: "Role 1 Highlights", accepts: "jobDesc1", type: "section" },
  { id: "job2-title", title: "Role 2", accepts: "jobTitle2", type: "section" },
  { id: "job2-dates", title: "Role 2 Dates", accepts: "jobDates2", type: "section" },
  { id: "job2-desc", title: "Role 2 Highlights", accepts: "jobDesc2", type: "section" },
  { id: "education1", title: "Education 1", accepts: "education1", type: "section" },
  { id: "education2", title: "Education 2", accepts: "education2", type: "section" },
  { id: "skills", title: "Skills", accepts: "skills", type: "section" },
  { id: "certificate", title: "Certificate", accepts: "certificate", type: "section" },
  { id: "award", title: "Award", accepts: "award", type: "section" },
  { id: "photo", title: "Photo", accepts: "photo", type: "photo" },
];

const PROFILE_DATA = [
  {
    id: "data-analyst",
    label: "Data Analyst",
    templateName: "ATS Classic",
    accent: "indigo",
    headerTitle: "Data Analyst Resume",
    items: [
      { id: "da-name", kind: "name", category: "Identity", label: "Full Name", icon: User, preview: "PRIYA SHARMA" },
      { id: "da-title", kind: "title", category: "Identity", label: "Professional Title", icon: LineChart, preview: "Senior Data Analyst" },
      { id: "da-phone", kind: "phone", category: "Contact", label: "Phone Number", icon: Phone, preview: "+91 98760 12458" },
      { id: "da-email", kind: "email", category: "Contact", label: "Email Address", icon: Mail, preview: "priya.sharma.analytics@email.com" },
      { id: "da-linkedin", kind: "linkedin", category: "Contact", label: "LinkedIn", icon: Linkedin, preview: "linkedin.com/in/priyasharma-data" },
      { id: "da-location", kind: "location", category: "Contact", label: "Location", icon: MapPin, preview: "Hyderabad, India" },
      { id: "da-summary", kind: "summary", category: "Summary", label: "Professional Summary", icon: FileText, preview: "Data analyst with 5 years of experience turning complex product and customer data into dashboards, experiments, and decisions for cross-functional teams." },
      { id: "da-job1-title", kind: "jobTitle1", category: "Experience", label: "Latest Job Title", icon: Briefcase, preview: "Senior Data Analyst | InsightLoop" },
      { id: "da-job1-dates", kind: "jobDates1", category: "Experience", label: "Latest Job Dates", icon: CalendarDays, preview: "Mar 2021 - Present" },
      { id: "da-job1-desc", kind: "jobDesc1", category: "Experience", label: "Latest Job Highlights", icon: Briefcase, preview: "Built a customer-retention dashboard combining 8 data sources, helping product teams reduce monthly churn by 14%." },
      { id: "da-job2-title", kind: "jobTitle2", category: "Experience", label: "Previous Job Title", icon: Briefcase, preview: "Data Analyst | MarketBridge Technologies" },
      { id: "da-job2-dates", kind: "jobDates2", category: "Experience", label: "Previous Job Dates", icon: CalendarDays, preview: "Jul 2018 - Feb 2021" },
      { id: "da-job2-desc", kind: "jobDesc2", category: "Experience", label: "Previous Job Highlights", icon: Briefcase, preview: "Automated weekly sales reporting with SQL and Power BI, reducing preparation time from 7 hours to 40 minutes." },
      { id: "da-education1", kind: "education1", category: "Education", label: "Master's Degree", icon: GraduationCap, preview: "M.Sc., Data Science - University of Hyderabad | 2016 - 2018" },
      { id: "da-education2", kind: "education2", category: "Education", label: "Bachelor's Degree", icon: GraduationCap, preview: "B.Sc., Statistics - University of Delhi | 2013 - 2016" },
      { id: "da-skills", kind: "skills", category: "Skills", label: "Skills", icon: Wrench, preview: "SQL, Python, Power BI, Tableau, Excel, Statistics, A/B Testing, Data Visualization" },
      { id: "da-certificate", kind: "certificate", category: "Certificates", label: "Certificate", icon: ShieldCheck, preview: "Google Advanced Data Analytics Professional Certificate" },
      { id: "da-award", kind: "award", category: "Awards", label: "Award", icon: Trophy, preview: "Analytics Impact Award 2023 for customer retention insights" },
      { id: "da-photo", kind: "photo", category: "Identity", label: "Profile Photo", icon: User, preview: "Professional analyst headshot", visual: "photo", photoUrl: "https://randomuser.me/api/portraits/women/65.jpg" },
    ],
  },
  {
    id: "data-engineer",
    label: "Data Engineer",
    templateName: "Systems Sidebar",
    accent: "teal",
    headerTitle: "Data Engineer Resume",
    items: [
      { id: "de-name", kind: "name", category: "Identity", label: "Full Name", icon: User, preview: "VIKRAM RAO" },
      { id: "de-title", kind: "title", category: "Identity", label: "Professional Title", icon: Archive, preview: "Senior Data Engineer" },
      { id: "de-phone", kind: "phone", category: "Contact", label: "Phone Number", icon: Phone, preview: "+91 98204 77316" },
      { id: "de-email", kind: "email", category: "Contact", label: "Email Address", icon: Mail, preview: "vikram.rao.engineering@email.com" },
      { id: "de-linkedin", kind: "linkedin", category: "Contact", label: "LinkedIn", icon: Linkedin, preview: "linkedin.com/in/vikramrao-data" },
      { id: "de-location", kind: "location", category: "Contact", label: "Location", icon: MapPin, preview: "Bengaluru, India" },
      { id: "de-summary", kind: "summary", category: "Summary", label: "Professional Summary", icon: FileText, preview: "Data engineer with 6 years of experience designing reliable batch and streaming pipelines, cloud data platforms, and analytics-ready data models." },
      { id: "de-job1-title", kind: "jobTitle1", category: "Experience", label: "Latest Job Title", icon: Briefcase, preview: "Senior Data Engineer | CloudMetric" },
      { id: "de-job1-dates", kind: "jobDates1", category: "Experience", label: "Latest Job Dates", icon: CalendarDays, preview: "Jan 2021 - Present" },
      { id: "de-job1-desc", kind: "jobDesc1", category: "Experience", label: "Latest Job Highlights", icon: Briefcase, preview: "Rebuilt a Spark-based ingestion platform processing 4 TB daily, improving pipeline reliability to 99.9% and cutting compute cost by 28%." },
      { id: "de-job2-title", kind: "jobTitle2", category: "Experience", label: "Previous Job Title", icon: Briefcase, preview: "Data Engineer | StreamForge Labs" },
      { id: "de-job2-dates", kind: "jobDates2", category: "Experience", label: "Previous Job Dates", icon: CalendarDays, preview: "Jun 2017 - Dec 2020" },
      { id: "de-job2-desc", kind: "jobDesc2", category: "Experience", label: "Previous Job Highlights", icon: Briefcase, preview: "Developed Airflow pipelines and dimensional models that reduced finance data delivery latency from 12 hours to 90 minutes." },
      { id: "de-education1", kind: "education1", category: "Education", label: "Master's Degree", icon: GraduationCap, preview: "M.Tech, Data Engineering - IIIT Bangalore | 2015 - 2017" },
      { id: "de-education2", kind: "education2", category: "Education", label: "Bachelor's Degree", icon: GraduationCap, preview: "B.E., Computer Science - Pune University | 2011 - 2015" },
      { id: "de-skills", kind: "skills", category: "Skills", label: "Skills", icon: Wrench, preview: "Python, SQL, Spark, Kafka, Airflow, dbt, Snowflake, AWS, Docker, Data Modeling" },
      { id: "de-certificate", kind: "certificate", category: "Certificates", label: "Certificate", icon: ShieldCheck, preview: "Google Cloud Professional Data Engineer" },
      { id: "de-award", kind: "award", category: "Awards", label: "Award", icon: Trophy, preview: "Platform Reliability Award for modernizing enterprise data pipelines" },
      { id: "de-photo", kind: "photo", category: "Identity", label: "Profile Photo", icon: User, preview: "Professional engineering headshot", visual: "photo", photoUrl: "https://randomuser.me/api/portraits/men/46.jpg" },
    ],
  },
  {
    id: "business-analyst",
    label: "Business Analyst",
    templateName: "Modern Timeline",
    accent: "cyan",
    headerTitle: "Business Analyst Resume",
    items: [
      { id: "ba-name", kind: "name", category: "Identity", label: "Full Name", icon: User, preview: "AARAV MEHTA" },
      { id: "ba-title", kind: "title", category: "Identity", label: "Professional Title", icon: BriefcaseBusiness, preview: "Senior Business Analyst" },
      { id: "ba-phone", kind: "phone", category: "Contact", label: "Phone Number", icon: Phone, preview: "+91 98765 43210" },
      { id: "ba-email", kind: "email", category: "Contact", label: "Email Address", icon: Mail, preview: "aarav.mehta@email.com" },
      { id: "ba-linkedin", kind: "linkedin", category: "Contact", label: "LinkedIn", icon: Linkedin, preview: "linkedin.com/in/aaravmehta" },
      { id: "ba-location", kind: "location", category: "Contact", label: "Location", icon: MapPin, preview: "Bengaluru, India" },
      { id: "ba-summary", kind: "summary", category: "Summary", label: "Professional Summary", icon: FileText, preview: "Business analyst with 6 years of experience translating stakeholder needs into process maps, dashboards, and product requirements for banking and retail teams." },
      { id: "ba-job1-title", kind: "jobTitle1", category: "Experience", label: "Latest Job Title", icon: Briefcase, preview: "Senior Business Analyst | FinEdge Solutions" },
      { id: "ba-job1-dates", kind: "jobDates1", category: "Experience", label: "Latest Job Dates", icon: CalendarDays, preview: "Jan 2021 - Present" },
      { id: "ba-job1-desc", kind: "jobDesc1", category: "Experience", label: "Latest Job Highlights", icon: Briefcase, preview: "Mapped a loan-origination workflow across 7 teams, cutting approval turnaround time by 22% after identifying 3 manual bottlenecks." },
      { id: "ba-job2-title", kind: "jobTitle2", category: "Experience", label: "Previous Job Title", icon: Briefcase, preview: "Business Analyst | AxisCore Consulting" },
      { id: "ba-job2-dates", kind: "jobDates2", category: "Experience", label: "Previous Job Dates", icon: CalendarDays, preview: "Jul 2018 - Dec 2020" },
      { id: "ba-job2-desc", kind: "jobDesc2", category: "Experience", label: "Previous Job Highlights", icon: Briefcase, preview: "Built a KPI exception dashboard for a lending ops team that reduced weekly reporting effort from 6 hours to 45 minutes." },
      { id: "ba-education1", kind: "education1", category: "Education", label: "Master's Degree", icon: GraduationCap, preview: "MBA, Business Analytics - Christ University | 2016 - 2018" },
      { id: "ba-education2", kind: "education2", category: "Education", label: "Bachelor's Degree", icon: GraduationCap, preview: "B.Com - St. Xavier's College | 2013 - 2016" },
      { id: "ba-skills", kind: "skills", category: "Skills", label: "Skills", icon: Wrench, preview: "SQL, Power BI, Tableau, BRD/FRD, Jira, User Stories, Process Mapping, UAT, Excel" },
      { id: "ba-certificate", kind: "certificate", category: "Certificates", label: "Certificate", icon: ShieldCheck, preview: "CBAP - Certified Business Analysis Professional" },
      { id: "ba-award", kind: "award", category: "Awards", label: "Award", icon: Trophy, preview: "Spotlight Excellence Award 2023 for process transformation delivery" },
      { id: "ba-photo", kind: "photo", category: "Identity", label: "Profile Photo", icon: User, preview: "Professional headshot with clean background", visual: "photo", photoUrl: "https://randomuser.me/api/portraits/men/32.jpg" },
    ],
  },
  {
    id: "software-developer",
    label: "Software Developer",
    templateName: "Technical Profile",
    accent: "blue",
    headerTitle: "Software Developer Resume",
    items: [
      { id: "sd-name", kind: "name", category: "Identity", label: "Full Name", icon: User, preview: "NEHA SINHA" },
      { id: "sd-title", kind: "title", category: "Identity", label: "Professional Title", icon: Code2, preview: "Full Stack Software Developer" },
      { id: "sd-phone", kind: "phone", category: "Contact", label: "Phone Number", icon: Phone, preview: "+91 98111 22334" },
      { id: "sd-email", kind: "email", category: "Contact", label: "Email Address", icon: Mail, preview: "neha.sinha.dev@gmail.com" },
      { id: "sd-linkedin", kind: "linkedin", category: "Contact", label: "LinkedIn", icon: Linkedin, preview: "linkedin.com/in/nehasinha" },
      { id: "sd-location", kind: "location", category: "Contact", label: "Location", icon: MapPin, preview: "Pune, India" },
      { id: "sd-summary", kind: "summary", category: "Summary", label: "Professional Summary", icon: FileText, preview: "Software developer with 5 years of experience building React, Node.js, and cloud-native products for high-volume customer workflows." },
      { id: "sd-job1-title", kind: "jobTitle1", category: "Experience", label: "Latest Job Title", icon: Briefcase, preview: "Senior Software Engineer | ByteNova" },
      { id: "sd-job1-dates", kind: "jobDates1", category: "Experience", label: "Latest Job Dates", icon: CalendarDays, preview: "Feb 2021 - Present" },
      { id: "sd-job1-desc", kind: "jobDesc1", category: "Experience", label: "Latest Job Highlights", icon: Briefcase, preview: "Optimized a billing API used by 2.3M monthly requests, reducing average response time from 420ms to 170ms." },
      { id: "sd-job2-title", kind: "jobTitle2", category: "Experience", label: "Previous Job Title", icon: Briefcase, preview: "Software Engineer | CloudMint Labs" },
      { id: "sd-job2-dates", kind: "jobDates2", category: "Experience", label: "Previous Job Dates", icon: CalendarDays, preview: "Aug 2018 - Jan 2021" },
      { id: "sd-job2-desc", kind: "jobDesc2", category: "Experience", label: "Previous Job Highlights", icon: Briefcase, preview: "Built a collaborative code review assistant with Next.js and OpenAI APIs that cut review turnaround by 34% for a student team." },
      { id: "sd-education1", kind: "education1", category: "Education", label: "Bachelor's Degree", icon: GraduationCap, preview: "B.Tech, Computer Science - VIT Vellore | 2014 - 2018" },
      { id: "sd-education2", kind: "education2", category: "Education", label: "Additional Education", icon: GraduationCap, preview: "AWS Certified Developer - Associate" },
      { id: "sd-skills", kind: "skills", category: "Skills", label: "Skills", icon: Wrench, preview: "React, Node.js, TypeScript, PostgreSQL, Redis, AWS, Docker, REST APIs, CI/CD" },
      { id: "sd-certificate", kind: "certificate", category: "Certificates", label: "Certificate", icon: ShieldCheck, preview: "Meta Front-End Developer Certificate" },
      { id: "sd-award", kind: "award", category: "Awards", label: "Award", icon: Trophy, preview: "Engineering Excellence Award for performance optimization work" },
      { id: "sd-photo", kind: "photo", category: "Identity", label: "Profile Photo", icon: User, preview: "Professional headshot with clean background", visual: "photo", photoUrl: "https://randomuser.me/api/portraits/women/44.jpg" },
    ],
  },
  {
    id: "ceo",
    label: "CEO",
    templateName: "Ivy League Executive",
    accent: "amber",
    headerTitle: "CEO Resume",
    items: [
      { id: "ceo-name", kind: "name", category: "Identity", label: "Full Name", icon: User, preview: "ROHAN KAPOOR" },
      { id: "ceo-title", kind: "title", category: "Identity", label: "Professional Title", icon: Crown, preview: "Chief Executive Officer" },
      { id: "ceo-phone", kind: "phone", category: "Contact", label: "Phone Number", icon: Phone, preview: "+91 99880 44551" },
      { id: "ceo-email", kind: "email", category: "Contact", label: "Email Address", icon: Mail, preview: "rohan@kapoorventures.com" },
      { id: "ceo-linkedin", kind: "linkedin", category: "Contact", label: "LinkedIn", icon: Linkedin, preview: "linkedin.com/in/rohankapoor" },
      { id: "ceo-location", kind: "location", category: "Contact", label: "Location", icon: MapPin, preview: "Mumbai, India" },
      { id: "ceo-summary", kind: "summary", category: "Summary", label: "Executive Summary", icon: FileText, preview: "Growth-focused CEO with 14 years leading SaaS and commerce businesses through market expansion, fundraising, and operating model redesign." },
      { id: "ceo-job1-title", kind: "jobTitle1", category: "Experience", label: "Latest Role", icon: Briefcase, preview: "CEO | Horizon Commerce" },
      { id: "ceo-job1-dates", kind: "jobDates1", category: "Experience", label: "Latest Role Dates", icon: CalendarDays, preview: "Apr 2020 - Present" },
      { id: "ceo-job1-desc", kind: "jobDesc1", category: "Experience", label: "Leadership Highlights", icon: Briefcase, preview: "Scaled annual recurring revenue from $11M to $43M in 3 years while expanding into 4 international markets." },
      { id: "ceo-job2-title", kind: "jobTitle2", category: "Experience", label: "Previous Role", icon: Briefcase, preview: "COO | RetailSync" },
      { id: "ceo-job2-dates", kind: "jobDates2", category: "Experience", label: "Previous Role Dates", icon: CalendarDays, preview: "Jan 2016 - Mar 2020" },
      { id: "ceo-job2-desc", kind: "jobDesc2", category: "Experience", label: "Previous Role Highlights", icon: Briefcase, preview: "Led post-acquisition integration across 3 product lines and improved gross margin by 9 points." },
      { id: "ceo-education1", kind: "education1", category: "Education", label: "MBA", icon: GraduationCap, preview: "MBA - INSEAD | 2010 - 2012" },
      { id: "ceo-education2", kind: "education2", category: "Education", label: "Bachelor's Degree", icon: GraduationCap, preview: "B.E., Mechanical Engineering - BITS Pilani | 2004 - 2008" },
      { id: "ceo-skills", kind: "skills", category: "Skills", label: "Operating Strengths", icon: Wrench, preview: "P&L Ownership, Fundraising, GTM Strategy, Org Design, Board Reporting, M&A, Pricing" },
      { id: "ceo-certificate", kind: "certificate", category: "Certificates", label: "Certificate", icon: ShieldCheck, preview: "Executive Leadership Program - Wharton" },
      { id: "ceo-award", kind: "award", category: "Awards", label: "Award", icon: Trophy, preview: "Fortune India 40 Under 40 - Business Leadership" },
      { id: "ceo-photo", kind: "photo", category: "Identity", label: "Profile Photo", icon: User, preview: "Professional executive portrait", visual: "photo", photoUrl: "https://randomuser.me/api/portraits/men/75.jpg" },
    ],
  },
  {
    id: "financial-analyst",
    label: "Financial Analyst",
    templateName: "Financial Ledger",
    accent: "emerald",
    headerTitle: "Financial Analyst Resume",
    items: [
      { id: "fa-name", kind: "name", category: "Identity", label: "Full Name", icon: User, preview: "ISHITA NAIR" },
      { id: "fa-title", kind: "title", category: "Identity", label: "Professional Title", icon: LineChart, preview: "Financial Analyst" },
      { id: "fa-phone", kind: "phone", category: "Contact", label: "Phone Number", icon: Phone, preview: "+91 98192 55231" },
      { id: "fa-email", kind: "email", category: "Contact", label: "Email Address", icon: Mail, preview: "ishita.nair@financepro.com" },
      { id: "fa-linkedin", kind: "linkedin", category: "Contact", label: "LinkedIn", icon: Linkedin, preview: "linkedin.com/in/ishitanair" },
      { id: "fa-location", kind: "location", category: "Contact", label: "Location", icon: MapPin, preview: "Gurugram, India" },
      { id: "fa-summary", kind: "summary", category: "Summary", label: "Professional Summary", icon: FileText, preview: "Financial analyst experienced in FP&A, variance analysis, and forecasting for consumer and enterprise business units." },
      { id: "fa-job1-title", kind: "jobTitle1", category: "Experience", label: "Latest Job Title", icon: Briefcase, preview: "Senior Financial Analyst | PrimeLedger" },
      { id: "fa-job1-dates", kind: "jobDates1", category: "Experience", label: "Latest Job Dates", icon: CalendarDays, preview: "Mar 2021 - Present" },
      { id: "fa-job1-desc", kind: "jobDesc1", category: "Experience", label: "Latest Job Highlights", icon: Briefcase, preview: "Built a rolling revenue forecast model that improved quarterly prediction accuracy from 81% to 94% across 5 product categories." },
      { id: "fa-job2-title", kind: "jobTitle2", category: "Experience", label: "Previous Job Title", icon: Briefcase, preview: "Financial Planning Analyst | GrowthCapital" },
      { id: "fa-job2-dates", kind: "jobDates2", category: "Experience", label: "Previous Job Dates", icon: CalendarDays, preview: "Jun 2018 - Feb 2021" },
      { id: "fa-job2-desc", kind: "jobDesc2", category: "Experience", label: "Previous Job Highlights", icon: Briefcase, preview: "Developed a pricing sensitivity model for 3-market expansion worth $8M in projected revenue." },
      { id: "fa-education1", kind: "education1", category: "Education", label: "Bachelor's Degree", icon: GraduationCap, preview: "B.Com (Hons.) - Shri Ram College of Commerce | 2013 - 2016" },
      { id: "fa-education2", kind: "education2", category: "Education", label: "Professional Qualification", icon: GraduationCap, preview: "CFA Level II Candidate" },
      { id: "fa-skills", kind: "skills", category: "Skills", label: "Skills", icon: Wrench, preview: "Excel, PowerPoint, SQL, Financial Modeling, Budgeting, Forecasting, Power BI, SAP" },
      { id: "fa-certificate", kind: "certificate", category: "Certificates", label: "Certificate", icon: ShieldCheck, preview: "Financial Modeling & Valuation Analyst (FMVA)" },
      { id: "fa-award", kind: "award", category: "Awards", label: "Award", icon: Trophy, preview: "Quarterly Finance Excellence Award for forecasting accuracy" },
      { id: "fa-photo", kind: "photo", category: "Identity", label: "Profile Photo", icon: User, preview: "Professional analyst headshot", visual: "photo", photoUrl: "https://randomuser.me/api/portraits/women/68.jpg" },
    ],
  },
  {
    id: "doctor",
    label: "Doctor",
    templateName: "Clinical Profile",
    accent: "rose",
    headerTitle: "Doctor Resume",
    items: [
      { id: "dr-name", kind: "name", category: "Identity", label: "Full Name", icon: User, preview: "DR. SANA QURESHI" },
      { id: "dr-title", kind: "title", category: "Identity", label: "Professional Title", icon: HeartPulse, preview: "Internal Medicine Specialist" },
      { id: "dr-phone", kind: "phone", category: "Contact", label: "Phone Number", icon: Phone, preview: "+91 98712 44567" },
      { id: "dr-email", kind: "email", category: "Contact", label: "Email Address", icon: Mail, preview: "drsanaq@gmail.com" },
      { id: "dr-linkedin", kind: "linkedin", category: "Contact", label: "LinkedIn", icon: Linkedin, preview: "linkedin.com/in/drsanaq" },
      { id: "dr-location", kind: "location", category: "Contact", label: "Location", icon: MapPin, preview: "New Delhi, India" },
      { id: "dr-summary", kind: "summary", category: "Summary", label: "Clinical Profile", icon: FileText, preview: "Internal medicine physician with 8 years of hospital experience managing acute care, chronic disease pathways, and resident teaching." },
      { id: "dr-job1-title", kind: "jobTitle1", category: "Experience", label: "Latest Role", icon: Briefcase, preview: "Consultant Physician | MetroCare Hospital" },
      { id: "dr-job1-dates", kind: "jobDates1", category: "Experience", label: "Latest Role Dates", icon: CalendarDays, preview: "Jan 2020 - Present" },
      { id: "dr-job1-desc", kind: "jobDesc1", category: "Experience", label: "Latest Role Highlights", icon: Briefcase, preview: "Managed 25+ inpatients per shift in a tertiary care unit while improving discharge documentation turnaround by 30%." },
      { id: "dr-job2-title", kind: "jobTitle2", category: "Experience", label: "Previous Role", icon: Briefcase, preview: "Senior Resident | City Medical Institute" },
      { id: "dr-job2-dates", kind: "jobDates2", category: "Experience", label: "Previous Role Dates", icon: CalendarDays, preview: "Jul 2016 - Dec 2019" },
      { id: "dr-job2-desc", kind: "jobDesc2", category: "Experience", label: "Previous Role Highlights", icon: Briefcase, preview: "Co-authored a diabetes care pathway study and implemented a follow-up checklist that reduced missed post-discharge reviews." },
      { id: "dr-education1", kind: "education1", category: "Education", label: "MD", icon: GraduationCap, preview: "MD, Internal Medicine - AIIMS New Delhi | 2013 - 2016" },
      { id: "dr-education2", kind: "education2", category: "Education", label: "MBBS", icon: GraduationCap, preview: "MBBS - King George's Medical University | 2007 - 2013" },
      { id: "dr-skills", kind: "skills", category: "Skills", label: "Core Skills", icon: Wrench, preview: "Acute Care, EMR Documentation, Patient Counseling, Clinical Audits, ICU Coordination, Resident Mentorship" },
      { id: "dr-certificate", kind: "certificate", category: "Certificates", label: "Certificate", icon: ShieldCheck, preview: "Advanced Cardiac Life Support (ACLS)" },
      { id: "dr-award", kind: "award", category: "Awards", label: "Award", icon: Trophy, preview: "Best Clinical Audit Initiative - Annual Medical Summit" },
      { id: "dr-photo", kind: "photo", category: "Identity", label: "Profile Photo", icon: User, preview: "Professional physician portrait", visual: "photo", photoUrl: "https://randomuser.me/api/portraits/women/52.jpg" },
    ],
  },
];

const RESUME_CANVAS_THEMES = {
  "data-analyst": {
    pageClass: "bg-[#fbfcff]",
    headingSlash: "text-[#4f5f9f]",
    titleClass: "text-[#40518f]",
    timelineClass: "bg-[#9aa7cf]",
    timelineDotClass: "border-[#9aa7cf]",
    panelBorderClass: "border-[#d7dcef]",
    photoBgClass: "bg-[#f0f2fa]",
    photoPlaceholderClass: "text-[#7d89ad]",
    dividerClass: "border-[#e2e5f2]",
    namePrimaryClass: "text-[#17223b]",
    nameSecondaryClass: "text-[#939bb4]",
    fontClass: "font-sans",
  },
  "data-engineer": {
    pageClass: "bg-[#fbfefd]",
    headingSlash: "text-[#28776f]",
    titleClass: "text-[#216b64]",
    timelineClass: "bg-[#82b6ae]",
    timelineDotClass: "border-[#82b6ae]",
    panelBorderClass: "border-[#cfe3df]",
    photoBgClass: "bg-[#edf7f5]",
    photoPlaceholderClass: "text-[#6f9993]",
    dividerClass: "border-[#dcebe8]",
    namePrimaryClass: "text-[#16322f]",
    nameSecondaryClass: "text-[#8ba5a1]",
    fontClass: "font-sans",
  },
  "business-analyst": {
    pageClass: "bg-[#fffdfc]",
    headingSlash: "text-[#9e2f2f]",
    titleClass: "text-[#9b2d2d]",
    timelineClass: "bg-[#b38b8b]",
    timelineDotClass: "border-[#b38b8b]",
    panelBorderClass: "border-[#d8cece]",
    photoBgClass: "bg-[#f6f0f0]",
    photoPlaceholderClass: "text-[#9f8585]",
    dividerClass: "border-[#e6dfdf]",
    namePrimaryClass: "text-[#1e1e1e]",
    nameSecondaryClass: "text-[#a7a7a7]",
    fontClass: "font-serif",
  },
  "software-developer": {
    pageClass: "bg-[#fbfdff]",
    headingSlash: "text-[#1d5fa8]",
    titleClass: "text-[#1857aa]",
    timelineClass: "bg-[#8ab1d8]",
    timelineDotClass: "border-[#8ab1d8]",
    panelBorderClass: "border-[#cfdceb]",
    photoBgClass: "bg-[#eef5fb]",
    photoPlaceholderClass: "text-[#6d8fb3]",
    dividerClass: "border-[#dce7f2]",
    namePrimaryClass: "text-[#132033]",
    nameSecondaryClass: "text-[#8ea4bf]",
    fontClass: "font-sans",
  },
  ceo: {
    pageClass: "bg-[#fffdfa]",
    headingSlash: "text-[#916c23]",
    titleClass: "text-[#8b6620]",
    timelineClass: "bg-[#c1aa74]",
    timelineDotClass: "border-[#c1aa74]",
    panelBorderClass: "border-[#e4d8bb]",
    photoBgClass: "bg-[#f8f1e3]",
    photoPlaceholderClass: "text-[#a58f5d]",
    dividerClass: "border-[#ece3d1]",
    namePrimaryClass: "text-[#241f16]",
    nameSecondaryClass: "text-[#b4a58a]",
    fontClass: "font-sans font-light",
  },
  "financial-analyst": {
    pageClass: "bg-[#fbfffd]",
    headingSlash: "text-[#1d7a55]",
    titleClass: "text-[#176748]",
    timelineClass: "bg-[#7fb8a0]",
    timelineDotClass: "border-[#7fb8a0]",
    panelBorderClass: "border-[#cce3d8]",
    photoBgClass: "bg-[#eef8f3]",
    photoPlaceholderClass: "text-[#6f9f8d]",
    dividerClass: "border-[#dceee5]",
    namePrimaryClass: "text-[#163126]",
    nameSecondaryClass: "text-[#97b4a7]",
    fontClass: "font-sans",
  },
  doctor: {
    pageClass: "bg-[#fffdfd]",
    headingSlash: "text-[#a0465e]",
    titleClass: "text-[#8f3650]",
    timelineClass: "bg-[#d1a1b0]",
    timelineDotClass: "border-[#d1a1b0]",
    panelBorderClass: "border-[#ead0d7]",
    photoBgClass: "bg-[#fbf0f3]",
    photoPlaceholderClass: "text-[#af7989]",
    dividerClass: "border-[#f0dde2]",
    namePrimaryClass: "text-[#2f1820]",
    nameSecondaryClass: "text-[#bc9ca7]",
    fontClass: "font-sans",
  },
};

const INITIAL_ZONE_TEMPLATE = Object.fromEntries(
  BASE_ZONES.map((zone) => [
    zone.id,
    {
      title: zone.title.toUpperCase(),
      accepts: zone.accepts,
      type: zone.type,
      content: null,
    },
  ])
);

function cloneZoneTemplate() {
  return Object.fromEntries(
    Object.entries(INITIAL_ZONE_TEMPLATE).map(([key, value]) => [key, { ...value }])
  );
}

function useGameAudio(enabled) {
  const audioContextRef = useRef(null);
  const backgroundAudioRef = useRef(null);
  const armedRef = useRef(false);
  const lastVolumeRef = useRef(0.15);

  function getContext() {
    if (typeof window === "undefined") {
      return null;
    }

    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }

    const context = audioContextRef.current ?? new AudioContextCtor();
    audioContextRef.current = context;

    if (context.state === "suspended") {
      context.resume();
    }

    return context;
  }

  function playTone(context, frequency, startTime, duration, type = "triangle", gainValue = 0.024) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(gainValue, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  }

  function armMusic() {
    if (typeof window === "undefined") {
      return;
    }

    if (!backgroundAudioRef.current) {
      const audio = new Audio(backgroundMusic);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = lastVolumeRef.current;
      backgroundAudioRef.current = audio;
    }

    if (!enabled) {
      return;
    }

    const audio = backgroundAudioRef.current;
    if (!audio) {
      return;
    }

    if (!armedRef.current) {
      audio
        .play()
        .then(() => {
          armedRef.current = true;
        })
        .catch(() => {});
      return;
    }

    if (audio.paused) {
      audio.play().catch(() => {});
    }
  }

  function stopMusic() {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
  }

  function setMusicVolume(nextVolume) {
    const safeVolume = Math.max(0, Math.min(1, nextVolume));
    lastVolumeRef.current = safeVolume;

    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = safeVolume;
    }
  }

  useEffect(() => {
    if (!enabled) {
      stopMusic();
    }

    return () => stopMusic();
  }, [enabled]);

  useEffect(
    () => () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.src = "";
        backgroundAudioRef.current = null;
      }
    },
    []
  );

  return {
    armMusic,
    setMusicVolume,
    play(eventName) {
      if (!enabled) {
        return;
      }

      const context = getContext();
      if (!context) {
        return;
      }

      armMusic();

      if (eventName === "success") {
        [392, 523.25, 659.25].forEach((frequency, index) => {
          playTone(context, frequency, context.currentTime + index * 0.04, 0.12, "triangle", 0.028);
        });
      }

      if (eventName === "error") {
        [293.66, 246.94].forEach((frequency, index) => {
          playTone(context, frequency, context.currentTime + index * 0.05, 0.15, "sawtooth", 0.022);
        });
      }
    },
  };
}

function getThemeStyles(themeMode) {
  const theme = THEMES[themeMode];

  return {
    shell: theme.app,
    panel: theme.panel,
    panelStrong: theme.panelStrong,
    card: theme.card,
    staged: theme.staged,
    iconShell: theme.iconShell,
    iconShellActive: theme.iconShellActive,
    textMuted: theme.textMuted,
    textSoft: theme.textSoft,
    canvas: theme.canvas,
    feedbackSuccess: theme.feedbackSuccess,
    feedbackError: theme.feedbackError,
  };
}

function getResumeCanvasTheme(profileId) {
  return RESUME_CANVAS_THEMES[profileId] ?? RESUME_CANVAS_THEMES["business-analyst"];
}

export default function ResumeBuilderGame({ onBackToEntry, audioActive = true }) {
  const { user } = useUser();
  const reduceMotion = useReducedMotion();
  const [themeMode, setThemeMode] = useState("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.15);
  const [activeProfileId, setActiveProfileId] = useState(PROFILE_DATA[0].id);
  const [inventory, setInventory] = useState(PROFILE_DATA[0].items);
  const [stagedItem, setStagedItem] = useState(null);
  const [canvasZones, setCanvasZones] = useState(cloneZoneTemplate);
  const [score, setScore] = useState(0);
  const [completedProfileIds, setCompletedProfileIds] = useState([]);
  const [gameProgressLoaded, setGameProgressLoaded] = useState(false);
  const [gameProgressUserId, setGameProgressUserId] = useState(null);
  const [rewardDialog, setRewardDialog] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const feedbackTimer = useRef(null);
  const completionInFlightRef = useRef(null);
  const sounds = useGameAudio(soundEnabled && audioActive);
  const theme = getThemeStyles(themeMode);

  const activeProfile = useMemo(
    () => PROFILE_DATA.find((profile) => profile.id === activeProfileId) ?? PROFILE_DATA[0],
    [activeProfileId]
  );
  const resumeTheme = getResumeCanvasTheme(activeProfile.id);
  const handleBack = () => {
    if (typeof onBackToEntry === "function") {
      onBackToEntry();
      return;
    }

    window.history.back();
  };

  useEffect(() => {
    sounds.setMusicVolume(musicVolume);
  }, [musicVolume, sounds]);

  useEffect(() => {
    if (soundEnabled && audioActive) {
      sounds.armMusic();
    }
  }, [audioActive, soundEnabled, sounds]);

  useEffect(() => {
    setInventory(activeProfile.items);
    setStagedItem(null);
    setCanvasZones(cloneZoneTemplate());
    clearTimeout(feedbackTimer.current);
    setFeedback(null);
  }, [activeProfile]);

  useEffect(() => {
    if (!user?.id) return;
    setGameProgressLoaded(false);
    try {
      const saved = JSON.parse(localStorage.getItem(getGameStorageKey(user.id)) || "{}");
      const completedIds = Array.isArray(saved.completedProfileIds)
        ? saved.completedProfileIds.filter((id) => PROFILE_DATA.some((profile) => profile.id === id))
        : [];
      setCompletedProfileIds(completedIds);
      setScore(Number.isFinite(saved.score) ? saved.score : 0);
      if (completedIds.includes(activeProfileId)) {
        const nextProfile = PROFILE_DATA.find((profile) => !completedIds.includes(profile.id));
        if (nextProfile) setActiveProfileId(nextProfile.id);
      }
    } catch {
      setCompletedProfileIds([]);
      setScore(0);
    } finally {
      setGameProgressUserId(user.id);
      setGameProgressLoaded(true);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !gameProgressLoaded || gameProgressUserId !== user.id) return;
    localStorage.setItem(
      getGameStorageKey(user.id),
      JSON.stringify({ completedProfileIds, score })
    );
  }, [completedProfileIds, gameProgressLoaded, gameProgressUserId, score, user?.id]);

  useEffect(
    () => () => {
      clearTimeout(feedbackTimer.current);
    },
    []
  );

  const completed = inventory.length === 0;
  const progress = Math.round(((activeProfile.items.length - inventory.length) / activeProfile.items.length) * 100);

  function showFeedback(message, type) {
    setFeedback({ message, type });
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 2000);
  }

  function handleInventoryDragStart(event, item) {
    sounds.armMusic();
    event.dataTransfer.setData("itemId", item.id);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function placeItem(item, zoneId) {
    if (!item || completedProfileIds.includes(activeProfile.id)) {
      return;
    }

    const zone = canvasZones[zoneId];
    if (!zone || zone.content) {
      return;
    }

    if (item.kind !== zone.accepts) {
      showFeedback("Wrong section! Try again.", "error");
      setScore((current) => Math.max(0, current - 35));
      sounds.play("error");
      return;
    }

    setCanvasZones((current) => ({
      ...current,
      [zoneId]: {
        ...current[zoneId],
        content: item,
      },
    }));
    setInventory((current) => current.filter((entry) => entry.id !== item.id));
    setStagedItem((current) => (current?.id === item.id ? null : current));
    setScore((current) => current + 150);
    sounds.play("success");

    const nextRemaining = inventory.length - 1;
    if (nextRemaining === 0) {
      completeActiveResume();
    } else {
      showFeedback("Perfect placement! +150", "success");
    }
  }

  async function completeActiveResume() {
    const profileId = activeProfile.id;
    if (
      completedProfileIds.includes(profileId) ||
      completionInFlightRef.current === profileId
    ) {
      return;
    }

    completionInFlightRef.current = profileId;
    setCompletedProfileIds((current) => [...new Set([...current, profileId])]);
    setPreviewOpen(false);
    setRewardDialog({ status: "claiming", profileLabel: activeProfile.label });
    showFeedback(`Congratulations! You completed the ${activeProfile.label} resume.`, "success");

    await submitRewardClaim(profileId, activeProfile.label);
  }

  async function submitRewardClaim(profileId, profileLabel) {
    completionInFlightRef.current = profileId;
    setRewardDialog({ status: "claiming", profileLabel });
    try {
      if (!user?.id) throw new Error("Please sign in again to claim your token reward.");
      const reward = await claimResumeQuestReward({ userId: user.id, profileId });
      setRewardDialog({
        status: "success",
        profileLabel,
        tokensAwarded: reward.tokensAwarded ?? RESUME_REWARD_TOKENS,
        tokensRemaining: reward.tokensRemaining,
      });
      window.dispatchEvent(new CustomEvent("careersense:tokens-updated"));
    } catch (error) {
      setRewardDialog({
        status: "error",
        profileLabel,
        message: error.message,
      });
    } finally {
      if (completionInFlightRef.current === profileId) {
        completionInFlightRef.current = null;
      }
    }
  }

  function handleDrop(event, zoneId) {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("itemId");
    const droppedItem = inventory.find((entry) => entry.id === itemId) ?? stagedItem;
    placeItem(droppedItem, zoneId);
  }

  function handleZoneClick(zoneId) {
    if (!stagedItem) {
      return;
    }

    placeItem(stagedItem, zoneId);
  }

  function resetGame() {
    if (completedProfileIds.includes(activeProfile.id)) return;
    setInventory(activeProfile.items);
    setStagedItem(null);
    setCanvasZones(cloneZoneTemplate());
    showFeedback(`${activeProfile.headerTitle} reset`, "success");
  }

  function renderResumePage(previewMode = false) {
    const sectionHeading = (label, centered = false) => (
      <div className={`mb-3 flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <h2 className={`text-[13px] font-black uppercase tracking-[0.16em] ${resumeTheme.titleClass}`}>{label}</h2>
        {!centered ? <span className={`h-px min-w-8 flex-1 ${resumeTheme.timelineClass}`} /> : null}
      </div>
    );

    const zoneCard = (zoneId, className = "", renderFilled) => {
      const content = canvasZones[zoneId].content;
      return (
        <div
          key={zoneId}
          className={`rounded-sm border transition-colors ${
            content
              ? "border-transparent"
              : `border-dashed ${resumeTheme.panelBorderClass} bg-white/45`
          } ${className}`}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, zoneId)}
          onClick={() => handleZoneClick(zoneId)}
        >
          {content ? (
            renderFilled(content)
          ) : (
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#9aa4ad]">{canvasZones[zoneId].title}</p>
          )}
        </div>
      );
    };

    const photoZone = (className = "h-[154px]") => (
      <div
        className={`flex items-center justify-center overflow-hidden border transition-colors ${
          canvasZones.photo.content ? "border-transparent" : `border-dashed ${resumeTheme.panelBorderClass}`
        } ${resumeTheme.photoBgClass} ${className}`}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, "photo")}
        onClick={() => handleZoneClick("photo")}
      >
        {canvasZones.photo.content ? (
          <img
            src={canvasZones.photo.content.photoUrl}
            alt={canvasZones.name.content?.preview || "Resume profile"}
            className="h-full w-full object-cover"
          />
        ) : (
          <p className={`text-center text-[11px] font-bold uppercase tracking-[0.32em] ${resumeTheme.photoPlaceholderClass}`}>{canvasZones.photo.title}</p>
        )}
      </div>
    );

    const nameBlock = (className = "text-[46px]") => (
      <div
        className={`rounded-sm border px-1 py-1 transition-colors ${canvasZones.name.content ? "border-transparent" : "border-dashed border-[#d8dde1]"}`}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, "name")}
        onClick={() => handleZoneClick("name")}
      >
        {canvasZones.name.content ? (
          <h1 className={`${className} font-semibold leading-none tracking-[-0.035em] text-[#272727]`}>
            {(() => {
              const parts = canvasZones.name.content.preview.split(" ");
              const first = parts[0] ?? "";
              const rest = parts.slice(1).join(" ");

              return (
                <>
                  <span className={`font-normal ${resumeTheme.namePrimaryClass}`}>{first}</span>
                  {rest ? <span className={`ml-2 ${resumeTheme.namePrimaryClass}`}>{rest}</span> : null}
                </>
              );
            })()}
          </h1>
        ) : (
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#b9a7a7]">{canvasZones.name.title}</p>
        )}
      </div>
    );

    const titleBlock = (className = "") => (
      <div
        className={`rounded-sm border px-1 py-1 transition-colors ${canvasZones.title.content ? "border-transparent" : "border-dashed border-[#d8dde1]"} ${className}`}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, "title")}
        onClick={() => handleZoneClick("title")}
      >
        {canvasZones.title.content ? (
          <p className={`text-[15px] font-bold uppercase tracking-[0.08em] ${resumeTheme.titleClass}`}>{canvasZones.title.content.preview}</p>
        ) : (
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#b9a7a7]">{canvasZones.title.title}</p>
        )}
      </div>
    );

    const contactZone = (zoneId, className = "") => (
      <div
        key={zoneId}
        className={`min-w-0 rounded-md border border-dashed border-transparent px-1 py-1 transition-colors hover:border-[#dbcfcf] ${className}`}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, zoneId)}
        onClick={() => handleZoneClick(zoneId)}
      >
        {canvasZones[zoneId].content ? (
          <p className="break-words">{canvasZones[zoneId].content.preview}</p>
        ) : (
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b9a7a7]">{canvasZones[zoneId].title}</p>
        )}
      </div>
    );

    const experienceStack = () => (
      <>
        {[
          ["job1-title", "job1-dates", "job1-desc"],
          ["job2-title", "job2-dates", "job2-desc"],
        ].map(([titleZone, dateZone, descZone]) => (
          <div key={titleZone} className="mb-5">
            {zoneCard(titleZone, "px-4 py-3", (content) => (
              <p className="whitespace-pre-line text-[15px] font-bold leading-6 text-[#202020]">{content.preview}</p>
            ))}
            {zoneCard(dateZone, "mt-2 px-4 py-2", (content) => (
              <p className={`text-[12px] font-bold uppercase tracking-[0.05em] ${resumeTheme.titleClass}`}>{content.preview}</p>
            ))}
            {zoneCard(descZone, "mt-3 px-4 py-3", (content) => (
              <ul className="space-y-1.5 text-[13px] leading-6 text-[#4a4a4a]">
                {content.preview
                  .split(/(?<=\.)\s+/)
                  .filter(Boolean)
                  .map((point, index) => (
                    <li key={`${descZone}-${index}`} className="flex gap-3">
                      <span className={`mt-[9px] inline-block h-1.5 w-1.5 rounded-full ${resumeTheme.timelineClass}`} />
                      <span>{point}</span>
                    </li>
                  ))}
              </ul>
            ))}
          </div>
        ))}
      </>
    );

    const dataAnalystLayout = (
      <div>
        <header className={`border-b-2 pb-5 ${resumeTheme.dividerClass}`}>
          <div className="grid grid-cols-[1fr_92px] items-center gap-6">
            <div>
              {nameBlock("text-[38px]")}
              {titleBlock("mt-1")}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[#46546b]">
                {["phone", "email", "linkedin", "location"].map((zoneId) => contactZone(zoneId))}
              </div>
            </div>
            {photoZone("h-[92px] rounded-sm")}
          </div>
        </header>
        <main className="mt-6 space-y-6">
          <section>
            {sectionHeading("Professional Summary")}
            {zoneCard("summary", "px-2 py-2", (content) => <p className="text-[13px] leading-6 text-[#394354]">{content.preview}</p>)}
          </section>
          <section>
            {sectionHeading("Professional Experience")}
            {experienceStack()}
          </section>
          <div className={`grid grid-cols-[1.15fr_.85fr] gap-8 border-t pt-5 ${resumeTheme.dividerClass}`}>
            <section>
              {sectionHeading("Education")}
              {["education1", "education2"].map((zoneId) =>
                zoneCard(zoneId, "mb-2 px-2 py-2", (content) => <p className="text-[12px] font-medium leading-5 text-[#394354]">{content.preview}</p>)
              )}
            </section>
            <section>
              {sectionHeading("Analytics Toolkit")}
              {zoneCard("skills", "px-2 py-2", (content) => <p className="text-[12px] leading-5 text-[#394354]">{content.preview}</p>)}
            </section>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {zoneCard("certificate", "px-2 py-2", (content) => <p className="text-[12px] leading-5 text-[#394354]"><strong className={resumeTheme.titleClass}>Certification:</strong> {content.preview}</p>)}
            {zoneCard("award", "px-2 py-2", (content) => <p className="text-[12px] leading-5 text-[#394354]"><strong className={resumeTheme.titleClass}>Recognition:</strong> {content.preview}</p>)}
          </div>
        </main>
      </div>
    );

    const dataEngineerLayout = (
      <div className="grid grid-cols-[1fr_210px] gap-8">
        <main>
          <header className={`border-b-[3px] pb-5 ${resumeTheme.dividerClass}`}>
            {nameBlock("text-[39px]")}
            {titleBlock("mt-1")}
          </header>
          <section className="mt-6">
            {sectionHeading("Engineering Profile")}
            {zoneCard("summary", "px-2 py-2", (content) => <p className="text-[13px] leading-6 text-[#354d4a]">{content.preview}</p>)}
          </section>
          <section className="mt-7">
            {sectionHeading("Data Platform Experience")}
            {experienceStack()}
          </section>
          <section className="mt-7">
            {sectionHeading("Education")}
            <div className="grid grid-cols-2 gap-4">
              {["education1", "education2"].map((zoneId) =>
                zoneCard(zoneId, "px-2 py-2", (content) => <p className="text-[12px] leading-5 text-[#354d4a]">{content.preview}</p>)
              )}
            </div>
          </section>
        </main>
        <aside className={`min-h-[900px] border-l px-5 ${resumeTheme.dividerClass} ${resumeTheme.photoBgClass}`}>
          <div className="pt-5">{photoZone("h-[170px] rounded-sm")}</div>
          <section className="mt-6 text-[11px] leading-5 text-[#355b56]">
            {sectionHeading("Contact")}
            <div className="space-y-2">{["phone", "email", "linkedin", "location"].map((zoneId) => contactZone(zoneId))}</div>
          </section>
          <section className="mt-7">
            {sectionHeading("Technology Stack")}
            {zoneCard("skills", "px-2 py-2", (content) => (
              <div className="flex flex-wrap gap-1.5">
                {content.preview.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill) => (
                  <span key={skill} className="rounded-sm border border-[#b8d4cf] bg-white/70 px-2 py-1 text-[10px] font-semibold text-[#216b64]">{skill}</span>
                ))}
              </div>
            ))}
          </section>
          <section className="mt-7">
            {sectionHeading("Credentials")}
            {zoneCard("certificate", "px-2 py-2", (content) => <p className="text-[11px] leading-5 text-[#354d4a]">{content.preview}</p>)}
            {zoneCard("award", "mt-3 px-2 py-2", (content) => <p className="text-[11px] leading-5 text-[#354d4a]">{content.preview}</p>)}
          </section>
        </aside>
      </div>
    );

    const businessAnalystLayout = (
      <>
        <div className={`grid grid-cols-[154px_1fr] gap-10 border-b pb-8 ${resumeTheme.dividerClass}`}>
          {photoZone()}
          <div className="flex min-h-[154px] flex-col justify-center">
            {nameBlock()}
            {titleBlock("mt-2")}
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[13px] text-[#444]">
              {["phone", "email", "linkedin", "location"].map((zoneId) => contactZone(zoneId))}
            </div>
          </div>
        </div>

        <div className="relative mt-9 grid grid-cols-[0.84fr_34px_1.38fr] gap-0">
          <div className="space-y-8 pr-6">
            <section>
              {sectionHeading("Certifications")}
              {zoneCard("certificate", "px-3 py-3", (content) => <p className="whitespace-pre-line text-[13px] leading-7 text-[#4a4a4a]">{content.preview}</p>)}
              {zoneCard("award", "mt-3 px-3 py-3", (content) => <p className="whitespace-pre-line text-[13px] leading-7 text-[#4a4a4a]">{content.preview}</p>)}
            </section>
            <section>
              {sectionHeading("Education")}
              {["education1", "education2"].map((zoneId) =>
                zoneCard(zoneId, "mb-3 px-3 py-3", (content) => <p className="whitespace-pre-line text-[13px] font-medium leading-7 text-[#363636]">{content.preview}</p>)
              )}
            </section>
            <section>
              {sectionHeading("Skills")}
              {zoneCard("skills", "px-3 py-3", (content) => (
                <ul className="space-y-2 text-[13px] leading-7 text-[#4a4a4a]">
                  {content.preview
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill, index) => (
                    <li key={`skills-${index}-${skill}`} className="flex gap-2">
                      <span className="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-[#7d7d7d]" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </section>
          </div>
          <div className="relative flex justify-center">
            <div className={`absolute bottom-0 top-0 w-px ${resumeTheme.timelineClass}`} />
            <div className={`absolute top-[32%] h-3.5 w-3.5 rounded-full border bg-white ${resumeTheme.timelineDotClass}`} />
            <div className={`absolute top-[71%] h-3.5 w-3.5 rounded-full border bg-white ${resumeTheme.timelineDotClass}`} />
          </div>
          <div className="space-y-8 pl-6">
            <section>
              {sectionHeading("Summary")}
              {zoneCard("summary", "px-4 py-3", (content) => <p className="text-[14px] leading-8 text-[#4a4a4a]">{content.preview}</p>)}
            </section>
            <section>
              {sectionHeading("Experience")}
              {experienceStack()}
            </section>
          </div>
        </div>
      </>
    );

    const softwareDeveloperLayout = (
      <div className="grid grid-cols-[220px_1fr] gap-8">
        <aside className={`border-r pr-6 ${resumeTheme.dividerClass}`}>
          {photoZone("h-[180px]")}
          <div className="mt-6 space-y-4 text-[12px] text-[#314762]">
            {sectionHeading("Contact")}
            {["phone", "email", "linkedin", "location"].map((zoneId) => contactZone(zoneId))}
          </div>
          <div className="mt-8">
            {sectionHeading("Skills")}
            {zoneCard("skills", "px-3 py-3", (content) => (
              <div className="flex flex-wrap gap-2 text-[12px]">
                {content.preview
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill, index) => (
                  <span key={`skills-chip-${index}-${skill}`} className="rounded-full bg-[#eef5fb] px-2 py-1 text-[#1857aa]">
                    {skill}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-8">
            {sectionHeading("Proof")}
            {zoneCard("certificate", "px-3 py-3 text-[13px] leading-6", (content) => <p>{content.preview}</p>)}
            {zoneCard("award", "mt-3 px-3 py-3 text-[13px] leading-6", (content) => <p>{content.preview}</p>)}
          </div>
        </aside>
        <main>
          <div className={`border-b pb-5 ${resumeTheme.dividerClass}`}>
            {nameBlock("text-[40px]")}
            {titleBlock("mt-1")}
          </div>
          <section className="mt-6">
            {sectionHeading("Summary")}
            {zoneCard("summary", "px-4 py-4 text-[13px] leading-7", (content) => <p>{content.preview}</p>)}
          </section>
          <section className="mt-8">
            {sectionHeading("Experience")}
            {experienceStack()}
          </section>
          <section className="mt-8">
            {sectionHeading("Education")}
            <div className="grid grid-cols-2 gap-4">
              {["education1", "education2"].map((zoneId) =>
                zoneCard(zoneId, "px-3 py-3", (content) => <p className="whitespace-pre-line text-[13px] leading-6">{content.preview}</p>)
              )}
            </div>
          </section>
        </main>
      </div>
    );

    const ceoLayout = (
      <div className="px-4">
        <div className={`border-b pb-8 text-center ${resumeTheme.dividerClass}`}>
          <div className="mx-auto w-[136px]">{photoZone("h-[136px]")}</div>
          <div className="mt-5">{nameBlock("text-[42px]")}</div>
          <div className="mx-auto mt-2 max-w-xl">{titleBlock()}</div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-[#5a5348]">
            {["phone", "email", "linkedin", "location"].map((zoneId) => contactZone(zoneId))}
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-3xl space-y-8">
          <section>
            {sectionHeading("Executive Summary", true)}
            {zoneCard("summary", "px-5 py-4 text-center text-[15px] leading-8", (content) => <p>{content.preview}</p>)}
          </section>
          <section>
            {sectionHeading("Leadership Experience", true)}
            {experienceStack()}
          </section>
          <section>
            {sectionHeading("Education", true)}
            <div className="grid grid-cols-2 gap-5">
              {["education1", "education2"].map((zoneId) =>
                zoneCard(zoneId, "px-4 py-4 text-center", (content) => <p className="whitespace-pre-line text-[14px] leading-7">{content.preview}</p>)
              )}
            </div>
          </section>
          <section>
            {sectionHeading("Leadership Profile", true)}
            <div className="grid grid-cols-3 gap-4">
              {zoneCard("skills", "px-4 py-4", (content) => <p className="text-[13px] leading-7">{content.preview}</p>)}
              {zoneCard("certificate", "px-4 py-4", (content) => <p className="text-[13px] leading-7">{content.preview}</p>)}
              {zoneCard("award", "px-4 py-4", (content) => <p className="text-[13px] leading-7">{content.preview}</p>)}
            </div>
          </section>
        </div>
      </div>
    );

    const financialAnalystLayout = (
      <>
        <div className={`grid grid-cols-[1fr_160px] items-center border-b-[3px] pb-4 ${resumeTheme.dividerClass}`}>
          <div>
            {nameBlock("text-[38px]")}
            {titleBlock("mt-1")}
          </div>
          <div>{photoZone("h-[150px]")}</div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3 text-[12px] text-[#385448]">
          {["phone", "email", "linkedin", "location"].map((zoneId) => contactZone(zoneId, "bg-[#eef8f3] px-2 py-2"))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
          <section>
            {sectionHeading("Summary")}
            {zoneCard("summary", "px-4 py-4 text-[13px] leading-7", (content) => <p>{content.preview}</p>)}
          </section>
          <section>
            {sectionHeading("Core Skills")}
            {zoneCard("skills", "px-4 py-4", (content) => <p className="text-[13px] leading-7">{content.preview}</p>)}
          </section>
          <section className="col-span-2">
            {sectionHeading("Experience")}
            <div className="grid grid-cols-2 gap-6">{experienceStack()}</div>
          </section>
          <section>
            {sectionHeading("Education")}
            {["education1", "education2"].map((zoneId) =>
              zoneCard(zoneId, "mb-3 px-3 py-3", (content) => <p className="whitespace-pre-line text-[13px] leading-6">{content.preview}</p>)
            )}
          </section>
          <section>
            {sectionHeading("Credentials")}
            {zoneCard("certificate", "px-3 py-3 text-[13px] leading-6", (content) => <p>{content.preview}</p>)}
            {zoneCard("award", "mt-3 px-3 py-3 text-[13px] leading-6", (content) => <p>{content.preview}</p>)}
          </section>
        </div>
      </>
    );

    const doctorLayout = (
      <div className="grid grid-cols-[1fr_200px] gap-6">
        <div className={`col-span-2 flex items-center gap-6 border-b pb-6 ${resumeTheme.dividerClass}`}>
          <div className="w-[148px] shrink-0">{photoZone("h-[148px]")}</div>
          <div className="flex-1">
            {nameBlock("text-[38px]")}
            {titleBlock("mt-1")}
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] text-[#5a4350]">
              {["phone", "email", "linkedin", "location"].map((zoneId) => contactZone(zoneId))}
            </div>
          </div>
        </div>
        <main className="space-y-7">
          <section>
            {sectionHeading("Clinical Profile")}
            {zoneCard("summary", "px-4 py-4 text-[14px] leading-8", (content) => <p>{content.preview}</p>)}
          </section>
          <section>
            {sectionHeading("Clinical Experience")}
            {experienceStack()}
          </section>
          <section>
            {sectionHeading("Education")}
            <div className="grid grid-cols-2 gap-4">
              {["education1", "education2"].map((zoneId) =>
                zoneCard(zoneId, "px-3 py-3", (content) => <p className="whitespace-pre-line text-[13px] leading-6">{content.preview}</p>)
              )}
            </div>
          </section>
        </main>
        <aside className={`border-l pl-5 ${resumeTheme.dividerClass}`}>
          <section>
            {sectionHeading("Skills")}
            {zoneCard("skills", "px-3 py-3", (content) => <p className="text-[13px] leading-7">{content.preview}</p>)}
          </section>
          <section className="mt-7">
            {sectionHeading("Certificates")}
            {zoneCard("certificate", "px-3 py-3 text-[13px] leading-6", (content) => <p>{content.preview}</p>)}
          </section>
          <section className="mt-7">
            {sectionHeading("Awards")}
            {zoneCard("award", "px-3 py-3 text-[13px] leading-6", (content) => <p>{content.preview}</p>)}
          </section>
        </aside>
      </div>
    );

    const resumeLayouts = {
      "data-analyst": dataAnalystLayout,
      "data-engineer": dataEngineerLayout,
      "business-analyst": businessAnalystLayout,
      "software-developer": softwareDeveloperLayout,
      ceo: ceoLayout,
      "financial-analyst": financialAnalystLayout,
      doctor: doctorLayout,
    };

    return (
      <div
        className={`mx-auto bg-white text-[#2f2f2f] ${
          previewMode
            ? "w-full max-w-[210mm] rounded-sm shadow-[0_30px_90px_rgba(15,23,42,0.22)]"
            : "min-h-[297mm] max-w-[210mm]"
        } ${resumeTheme.pageClass} ${resumeTheme.fontClass} px-11 py-10`}
      >
        {resumeLayouts[activeProfile.id] ?? businessAnalystLayout}
      </div>
    );
  }

  return (
    <div
      className={`relative h-[100dvh] min-h-0 overflow-hidden bg-transparent p-0 selection:bg-[#F0C15B]/35 ${theme.shell}`}
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://d7exlrhix3get.cloudfront.net/ats-background.mp4" type="video/mp4" />
      </video>
      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-[-12%] z-10 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,138,29,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(13,53,87,0.05) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
          animate={{
            x: [0, 36, 0],
            y: [0, 22, 0],
            opacity: [0.16, 0.28, 0.16],
          }}
          transition={{
            duration: 24,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ) : null}
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-[-14%] z-10 h-full w-[46%] bg-[radial-gradient(circle_at_center,rgba(201,138,29,0.15),rgba(201,138,29,0.025)_54%,transparent_74%)] blur-3xl"
        animate={
          reduceMotion
            ? {}
            : {
                x: ["0%", "12%", "-5%", "0%"],
                y: ["0%", "-5%", "5%", "0%"],
                opacity: [0.26, 0.48, 0.3, 0.26],
              }
        }
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-[-12%] z-10 h-full w-[42%] bg-[radial-gradient(circle_at_center,rgba(37,105,137,0.17),rgba(37,105,137,0.025)_52%,transparent_74%)] blur-3xl"
        animate={
          reduceMotion
            ? {}
            : {
                x: ["0%", "-10%", "6%", "0%"],
                y: ["0%", "5%", "-3%", "0%"],
                opacity: [0.22, 0.4, 0.28, 0.22],
              }
        }
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-[-8%] top-[11%] z-10 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(201,138,29,0.42),transparent)] shadow-[0_0_26px_rgba(201,138,29,0.18)]"
        animate={
          reduceMotion
            ? {}
            : {
                x: ["-10%", "12%", "-3%", "-10%"],
                opacity: [0.34, 0.82, 0.44, 0.34],
              }
        }
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-[-8%] bottom-[16%] z-10 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(37,105,137,0.38),transparent)] shadow-[0_0_26px_rgba(37,105,137,0.16)]"
        animate={
          reduceMotion
            ? {}
            : {
                x: ["10%", "-12%", "4%", "10%"],
                opacity: [0.28, 0.72, 0.38, 0.28],
              }
        }
        transition={{
          duration: 16,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      {!reduceMotion ? (
        <>
          {[
            { left: "14%", top: "18%", delay: 0, size: "h-3 w-3" },
            { left: "76%", top: "24%", delay: 1.2, size: "h-2.5 w-2.5" },
            { left: "68%", top: "72%", delay: 2.1, size: "h-3.5 w-3.5" },
            { left: "22%", top: "78%", delay: 0.8, size: "h-2.5 w-2.5" },
            { left: "49%", top: "14%", delay: 1.6, size: "h-4 w-4" },
            { left: "58%", top: "84%", delay: 2.8, size: "h-3 w-3" },
          ].map((orb) => (
            <motion.div
              key={`${orb.left}-${orb.top}`}
              className={`pointer-events-none absolute z-10 rounded-full border border-[#E3B14C]/30 bg-[#E3B14C]/20 shadow-[0_0_22px_rgba(227,177,76,.22)] ${orb.size}`}
              style={{ left: orb.left, top: orb.top }}
              animate={{
                y: [0, -22, 8, 0],
                x: [0, 10, -8, 0],
                opacity: [0.4, 1, 0.58, 0.4],
                scale: [1, 1.18, 0.94, 1],
              }}
              transition={{
                duration: 8.5,
                delay: orb.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      ) : null}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_top,rgba(201,138,29,0.07),transparent_30%),radial-gradient(circle_at_bottom,rgba(22,83,113,0.10),transparent_28%),linear-gradient(180deg,rgba(8,40,61,0.18),rgba(8,40,61,0.30))]" />

      <div className="relative z-30 flex h-full min-h-0 w-full flex-col px-4 py-3">
        <div className="order-2 mb-3 flex shrink-0 flex-nowrap items-center justify-between gap-4 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[10px] border border-[#D7E1E6] bg-white/95 px-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#123A54] shadow-[0_6px_16px_rgba(18,58,84,.07)] transition hover:border-[#C98A1D] hover:text-[#A96E10]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div data-tour="game-profiles" className="ml-auto flex min-w-max flex-none flex-nowrap items-center justify-end gap-1.5">
            {PROFILE_DATA.map((profile) => {
              const Icon = PROFILE_ICONS[profile.id];
              const active = profile.id === activeProfileId;
              const profileCompleted = completedProfileIds.includes(profile.id);

              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => {
                    if (!profileCompleted) setActiveProfileId(profile.id);
                  }}
                  disabled={profileCompleted}
                  aria-label={profileCompleted ? `${profile.label} completed` : `Build ${profile.label} resume`}
                  className={`h-10 min-w-0 whitespace-nowrap rounded-[10px] border px-3 text-[10px] font-bold uppercase tracking-[0.08em] transition ${
                    profileCompleted
                      ? "cursor-not-allowed border-[#47A184] bg-[#E8F6F0] text-[#1A735A]"
                      : active
                      ? "border-[#C98A1D] bg-[#FFF4D8] text-[#8C5C0B] shadow-[0_7px_18px_rgba(201,138,29,.10)]"
                      : themeMode === "dark"
                      ? "border-[#52758A] bg-[#0E405D] text-[#D6E3EA] hover:border-[#D2A044] hover:text-[#F2C667]"
                      : "border-[#D8E2E7] bg-white/95 text-[#476779] hover:border-[#C98A1D]"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {profileCompleted ? <Check className="h-3.5 w-3.5" /> : Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                    <span>{profile.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`order-1 mb-3 flex shrink-0 items-center justify-between rounded-2xl border px-4 py-3 ${theme.panelStrong}`}>
          <div className="flex items-center gap-3">
            <img
              src={themeMode === "dark" ? goldenLogo : blueLogo}
              alt="CareerSense"
              className="h-10 w-10 shrink-0 object-contain"
            />
            <div>
              <h1
                className={`text-xl font-black tracking-[0.08em] ${
                  themeMode === "dark" ? "text-white" : "text-[#123A54]"
                }`}
              >
                RESUME <span className="text-[#C98A1D]">BUILDER</span>
              </h1>
              <p className={`text-[10px] uppercase tracking-[0.18em] ${theme.textMuted}`}>Construct from Scratch</p>
            </div>
          </div>

          <a
            data-tour="game-create-cv"
            href="https://resume.careersenseai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`mx-auto inline-flex min-h-10 shrink-0 items-center gap-2 rounded-[10px] border px-4 text-[11px] font-black uppercase tracking-[0.08em] transition hover:-translate-y-0.5 ${
              themeMode === "dark"
                ? "border-[#D4A13D] bg-[#FFF1CB] text-[#80530B] hover:bg-[#FFE5A8]"
                : "border-[#C98A1D] bg-[#083650] text-white hover:bg-[#124A68]"
            }`}
          >
            <FileText className="h-4 w-4" />
            Generate ATS-Friendly CV
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>

          <div data-tour="game-tools" className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTourOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-[9px] border px-3 py-2 text-[10px] font-black uppercase tracking-[.08em] transition ${themeMode === "dark" ? "border-[#52758A] text-[#E1EAF0] hover:border-[#D2A044] hover:text-[#F1C56B]" : "border-[#D8C49B] text-[#476779] hover:border-[#C98A1D]"}`}
              aria-label="Start Resume Quest tour"
            >
              <HelpCircle className="h-4 w-4" /> Help
            </button>
            <div data-tour="game-progress" className="flex items-center gap-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-widest ${theme.textSoft}`}>Progress</p>
              <p className="text-xl font-black text-[#2EB58B]">{progress}%</p>
            </div>
            <div className="border-l border-[#D8C49B]/50 pl-4 text-center">
              <p className={`text-[10px] uppercase tracking-widest ${theme.textSoft}`}>Total Score</p>
              <p className="text-xl font-black text-[#D6A033]">{score}</p>
            </div>
            <div className="border-l border-[#D8C49B]/50 pl-4 text-center">
              <p className={`text-[10px] uppercase tracking-widest ${theme.textSoft}`}>Tokens Won</p>
              <p className="text-xl font-black text-[#2EB58B]">
                {Math.min(completedProfileIds.length * RESUME_REWARD_TOKENS, MAX_RESUME_REWARD_TOKENS).toLocaleString()}
              </p>
            </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                themeMode === "dark"
                  ? "border-[#58798D] text-[#E3EDF2] hover:border-[#D2A044] hover:text-[#F1C56B]"
                  : "border-[#D8C49B] text-[#476779] hover:border-[#C98A1D]"
              }`}
            >
              Preview A4
            </button>
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className={`rounded-full border p-2 transition ${
                themeMode === "dark"
                  ? "border-[#52758A] text-[#F0C05A] hover:border-[#D6A13A] hover:bg-[#164A66]"
                  : "border-[#D8C49B] text-[#B97B12] hover:bg-[#FFF4DD]"
              }`}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-2 ${
                themeMode === "dark"
                  ? "border-[#52758A] text-[#D8E6ED]"
                  : "border-[#D8C49B] text-[#476779]"
              }`}
            >
              <button
                type="button"
                onClick={() => setMusicVolume((current) => Math.max(0, Number((current - 0.1).toFixed(2))))}
                className="text-sm font-black text-[#D39A2D] transition hover:text-[#F0C15E]"
                aria-label="Decrease music volume"
              >
                -
              </button>
              <span
                className={`min-w-[52px] text-center text-[10px] font-bold uppercase tracking-widest ${
                  themeMode === "dark" ? "text-[#C6D7E0]" : "text-[#607D8D]"
                }`}
              >
                Vol {Math.round(musicVolume * 100)}
              </span>
              <button
                type="button"
                onClick={() => setMusicVolume((current) => Math.min(1, Number((current + 0.1).toFixed(2))))}
                className="text-sm font-black text-[#D39A2D] transition hover:text-[#F0C15E]"
                aria-label="Increase music volume"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => setThemeMode((current) => (current === "dark" ? "light" : "dark"))}
              className={`rounded-full border p-2 transition ${
                themeMode === "dark"
                  ? "border-[#52758A] text-[#F0C05A] hover:border-[#D6A13A] hover:bg-[#164A66]"
                  : "border-[#D8C49B] text-[#B97B12] hover:bg-[#FFF4DD]"
              }`}
              aria-label="Toggle theme"
            >
              {themeMode === "dark" ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={resetGame}
              disabled={completedProfileIds.includes(activeProfile.id)}
              className={`rounded-full border p-2 transition ${
                completedProfileIds.includes(activeProfile.id)
                  ? "cursor-not-allowed border-[#52758A]/50 text-[#78909E] opacity-50"
                  : themeMode === "dark"
                  ? "border-[#52758A] text-[#F0C05A] hover:border-[#D6A13A] hover:bg-[#164A66]"
                  : "border-[#D8C49B] text-[#B97B12] hover:bg-[#FFF4DD]"
              }`}
              aria-label="Reset game"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="order-3 grid min-h-0 flex-1 grid-cols-[270px_240px_minmax(0,1fr)] gap-4">
          <div data-tour="game-inventory" className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border p-3 shadow-[0_18px_36px_rgba(5,35,54,.10)] ${theme.panel}`}>
            <h2 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#E2AC43]">1. Data Inventory</h2>
            <div className="flex-1 space-y-2 overflow-y-auto pr-2">
              {inventory.map((item) => {
                const Icon = item.icon;
                const isStaged = stagedItem?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={(event) => handleInventoryDragStart(event, item)}
                    onClick={() => {
                      sounds.armMusic();
                      setStagedItem(item);
                    }}
                    className={`w-full rounded-xl border p-2.5 text-left transition ${isStaged ? theme.staged : theme.card}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${isStaged ? theme.iconShellActive : theme.iconShell}`}>
                        <Icon
                          className={`h-4 w-4 ${
                            isStaged
                              ? "text-[#C98A1D]"
                              : themeMode === "dark"
                              ? "text-[#88A8BA]"
                              : "text-[#7191A4]"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            isStaged
                              ? themeMode === "dark"
                                ? "text-[#F4C664]"
                                : "text-[#B77812]"
                              : themeMode === "dark"
                              ? "text-white"
                              : "text-[#153D56]"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p className={`text-[10px] uppercase tracking-wider ${theme.textSoft}`}>{item.category}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
              {inventory.length === 0 && (
                <div className="mt-10 flex flex-col items-center text-center font-semibold text-[#35B18B]">
                  <ShieldCheck className="mb-2 h-10 w-10" />
                  All fields placed!
                </div>
              )}
            </div>
          </div>

          <div data-tour="game-staging" className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border p-3 shadow-[0_18px_36px_rgba(5,35,54,.10)] ${theme.panel}`}>
            <h2 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#E2AC43]">2. Prep & Staging</h2>

            <AnimatePresence mode="wait">
              {stagedItem ? (
                <motion.div
                  key={stagedItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="flex h-full flex-col"
                >
                  <div className={`mb-4 flex-1 rounded-xl border p-5 ${theme.panelStrong}`}>
                    <div className="mb-4 flex items-center gap-2 border-b border-[#59798A]/45 pb-2">
                      <stagedItem.icon className="h-5 w-5 text-[#D39A2D]" />
                      <h3
                        className={`font-black ${
                          themeMode === "dark" ? "text-[#F0B94D]" : "text-[#B87911]"
                        }`}
                      >
                        {stagedItem.category} Block
                      </h3>
                    </div>
                    <p className={`mb-2 text-xs ${theme.textMuted}`}>Compiled Data Preview:</p>
                    <div className="min-h-[110px] rounded-lg bg-white p-4 text-sm font-medium text-[#273A47] shadow-inner whitespace-pre-line">
                      {stagedItem.preview}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <p className="mb-2 text-center text-xs uppercase tracking-widest text-[#D7A038] animate-pulse">
                      Drag block below to canvas →
                    </p>
                    <motion.div
                      draggable
                      onDragStart={(event) => handleInventoryDragStart(event, stagedItem)}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ scale: 1.05, rotate: 2 }}
                      className="cursor-grab rounded-xl border border-[#D39A2D] bg-[#104867] p-4 text-center shadow-[0_10px_24px_rgba(4,37,57,.20)] transition hover:bg-[#155572] active:cursor-grabbing"
                    >
                      <p className="font-black uppercase tracking-widest text-white">{stagedItem.label}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <div className={`flex flex-1 flex-col items-center justify-center ${theme.textSoft}`}>
                  <AlertCircle className="mb-3 h-12 w-12 opacity-50" />
                  <p className="px-6 text-center text-sm">
                    Select any field from the inventory or drag it directly to the blank resume.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div data-tour="game-canvas" className={`relative h-full overflow-y-auto rounded-lg p-8 shadow-2xl custom-scrollbar ${theme.canvas}`}>
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -20, x: "-50%" }}
                  animate={{ opacity: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, y: -20, x: "-50%" }}
                  className={`absolute left-1/2 top-4 z-50 rounded-full border-2 px-6 py-2 text-sm font-black uppercase tracking-widest shadow-xl ${
                    feedback.type === "success" ? theme.feedbackSuccess : theme.feedbackError
                  }`}
                >
                  {feedback.message}
                </motion.div>
              )}
            </AnimatePresence>

            {renderResumePage(false)}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {tourOpen ? <ResumeGameTour open={tourOpen} onClose={() => setTourOpen(false)} /> : null}
        {rewardDialog ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-[#041E30]/85 p-5 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-reward-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#E0B75F] bg-[#FFFDF8] text-center shadow-[0_32px_100px_rgba(2,25,39,.45)]"
            >
              <div className="bg-[#083650] px-7 py-7 text-white">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#F2C967] bg-[#FFF1C9] text-[#B9780E] shadow-[0_10px_28px_rgba(0,0,0,.18)]">
                  <Trophy className="h-8 w-8" />
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#F1C665]">
                  Resume Quest Complete
                </p>
                <h2 id="resume-reward-title" className="mt-2 text-2xl font-black tracking-[-0.03em]">
                  {rewardDialog.status === "claiming"
                    ? "Adding your reward…"
                    : rewardDialog.status === "success"
                    ? "You won 500 tokens!"
                    : "Resume completed"}
                </h2>
                <p className="mt-2 text-sm font-medium text-[#C8D9E2]">
                  {rewardDialog.profileLabel} has been marked as completed.
                </p>
              </div>

              <div className="px-7 py-6">
                {rewardDialog.status === "claiming" ? (
                  <div className="space-y-3">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-[#E6D4AE] border-t-[#C98A1D]" />
                    <p className="text-sm font-semibold text-[#607D8D]">Securely adding 500 tokens to your CareerSense balance.</p>
                  </div>
                ) : rewardDialog.status === "success" ? (
                  <>
                    <div className="rounded-2xl border border-[#B9DDCF] bg-[#EDF8F3] px-5 py-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#27745D]">Added to main system tokens</p>
                      <p className="mt-1 text-3xl font-black text-[#12634D]">+{Number(rewardDialog.tokensAwarded || 500).toLocaleString()}</p>
                      {Number.isFinite(rewardDialog.tokensRemaining) ? (
                        <p className="mt-1 text-xs font-semibold text-[#52766B]">New balance: {rewardDialog.tokensRemaining.toLocaleString()} tokens</p>
                      ) : null}
                    </div>
                    <p className="mt-4 text-xs font-semibold text-[#6D8492]">
                      {completedProfileIds.length} of {PROFILE_DATA.length} resumes completed · Up to {MAX_RESUME_REWARD_TOKENS.toLocaleString()} tokens available
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const nextProfile = PROFILE_DATA.find((profile) => !completedProfileIds.includes(profile.id));
                        setRewardDialog(null);
                        if (nextProfile) setActiveProfileId(nextProfile.id);
                      }}
                      className="mt-5 min-h-11 w-full rounded-xl bg-[#083650] px-5 text-sm font-black text-white transition hover:bg-[#124A68]"
                    >
                      {completedProfileIds.length === PROFILE_DATA.length ? "Finish Quest" : "Build Next Resume"}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold leading-6 text-[#9A4B45]">
                      {rewardDialog.message || "Your reward could not be added right now."}
                    </p>
                    <p className="mt-2 text-xs text-[#6D8492]">Your completed resume is saved. Retry to add the reward to your system balance.</p>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setRewardDialog(null)} className="min-h-11 rounded-xl border border-[#C9D7DF] bg-white text-sm font-black text-[#31566C]">Close</button>
                      <button
                        type="button"
                        onClick={() => submitRewardClaim(activeProfile.id, rewardDialog.profileLabel)}
                        className="min-h-11 rounded-xl bg-[#083650] text-sm font-black text-white transition hover:bg-[#124A68]"
                      >
                        Retry Reward
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {previewOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#041E30]/82 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative flex h-full max-h-[96vh] w-full max-w-5xl flex-col rounded-3xl border border-[#31566C] bg-[#082F48] p-5 shadow-[0_30px_120px_rgba(15,23,42,0.55)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-[0.28em] text-white">A4 Preview</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#9BB1BE]">Final resume page at A4 ratio</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-full border border-[#52758A] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#E7F0F4] transition hover:border-[#D2A044] hover:text-[#F0C566]"
                >
                  Close
                </button>
              </div>

              <div className="flex flex-1 items-start justify-center overflow-auto rounded-2xl bg-[#062840] p-6">
                <div className="flex min-h-full w-full items-start justify-center">
                  {renderResumePage(true)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
