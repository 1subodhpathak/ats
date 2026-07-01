import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import backgroundMusic from "./Background.mp3";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  Award,
  Briefcase,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  Crown,
  FileText,
  GraduationCap,
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
  Zap,
} from "lucide-react";

const THEMES = {
  dark: {
    app: "bg-gray-950 text-cyan-50",
    panel: "bg-gray-900/70 border-cyan-900/60",
    panelStrong: "bg-gray-950/80 border-cyan-800/60",
    card: "bg-gray-950/70 border-gray-800 hover:border-cyan-700",
    staged: "border-cyan-400 bg-cyan-900/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]",
    iconShell: "bg-gray-800",
    iconShellActive: "bg-cyan-500/20",
    textMuted: "text-gray-400",
    textSoft: "text-gray-500",
    canvas: "bg-white text-gray-900",
    feedbackSuccess: "bg-emerald-100 text-emerald-800 border-emerald-400",
    feedbackError: "bg-red-100 text-red-800 border-red-400",
  },
  light: {
    app: "bg-slate-100 text-slate-900",
    panel: "bg-white/85 border-sky-200",
    panelStrong: "bg-white/95 border-sky-300",
    card: "bg-slate-50 border-slate-200 hover:border-sky-400",
    staged: "border-sky-500 bg-sky-50 shadow-[0_0_15px_rgba(14,165,233,0.15)]",
    iconShell: "bg-slate-100",
    iconShellActive: "bg-sky-100",
    textMuted: "text-slate-600",
    textSoft: "text-slate-500",
    canvas: "bg-white text-slate-900",
    feedbackSuccess: "bg-emerald-100 text-emerald-800 border-emerald-400",
    feedbackError: "bg-red-100 text-red-800 border-red-400",
  },
};

const PROFILE_ICONS = {
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
    id: "business-analyst",
    label: "Business Analyst",
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
    fontClass: "font-mono tracking-tight",
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
    fontClass: "font-sans text-[0.94em]",
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
  const lastVolumeRef = useRef(0.45);

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

export default function ResumeBuilderGame({ onBackToEntry }) {
  const reduceMotion = useReducedMotion();
  const [themeMode, setThemeMode] = useState("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.45);
  const [activeProfileId, setActiveProfileId] = useState(PROFILE_DATA[0].id);
  const [inventory, setInventory] = useState(PROFILE_DATA[0].items);
  const [stagedItem, setStagedItem] = useState(null);
  const [canvasZones, setCanvasZones] = useState(cloneZoneTemplate);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const feedbackTimer = useRef(null);
  const sounds = useGameAudio(soundEnabled);
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
    if (soundEnabled) {
      sounds.armMusic();
    }
  }, [soundEnabled, sounds]);

  useEffect(() => {
    setInventory(activeProfile.items);
    setStagedItem(null);
    setCanvasZones(cloneZoneTemplate());
    setScore(0);
    clearTimeout(feedbackTimer.current);
    setFeedback(null);
  }, [activeProfile]);

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
    if (!item) {
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
      showFeedback(`Congratulations! You built a perfect ${activeProfile.label} resume.`, "success");
      setPreviewOpen(true);
    } else {
      showFeedback("Perfect placement! +150", "success");
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
    setInventory(activeProfile.items);
    setStagedItem(null);
    setCanvasZones(cloneZoneTemplate());
    setScore(0);
    showFeedback(`${activeProfile.headerTitle} reset`, "success");
  }

  function renderResumePage(previewMode = false) {
    const sectionHeading = (label, centered = false) => (
      <div className={`mb-4 flex items-center gap-2 ${centered ? "justify-center" : ""}`}>
        <span className={`text-[26px] font-light leading-none ${resumeTheme.headingSlash}`}>/</span>
        <h2 className="text-[20px] font-medium text-[#222]">{label}</h2>
      </div>
    );

    const zoneCard = (zoneId, className = "", renderFilled) => (
      <div
        key={zoneId}
        className={`rounded-md border border-dashed transition-colors ${resumeTheme.panelBorderClass} ${className}`}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, zoneId)}
        onClick={() => handleZoneClick(zoneId)}
      >
        {canvasZones[zoneId].content ? (
          renderFilled(canvasZones[zoneId].content)
        ) : (
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b9a7a7]">{canvasZones[zoneId].title}</p>
        )}
      </div>
    );

    const photoZone = (className = "h-[154px]") => (
      <div
        className={`flex items-center justify-center overflow-hidden border border-dashed transition-colors ${resumeTheme.panelBorderClass} ${resumeTheme.photoBgClass} ${className}`}
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
        className="rounded-md border border-dashed border-transparent px-1 py-1 transition-colors hover:border-[#dbcfcf]"
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, "name")}
        onClick={() => handleZoneClick("name")}
      >
        {canvasZones.name.content ? (
          <h1 className={`${className} font-light leading-none tracking-[-0.045em] text-[#272727]`}>
            {(() => {
              const parts = canvasZones.name.content.preview.split(" ");
              const first = parts[0] ?? "";
              const rest = parts.slice(1).join(" ");

              return (
                <>
                  <span className={`font-normal ${resumeTheme.namePrimaryClass}`}>{first}</span>
                  {rest ? <span className={`ml-3 ${resumeTheme.nameSecondaryClass}`}>{rest}</span> : null}
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
        className={`rounded-md border border-dashed border-transparent px-1 py-1 transition-colors hover:border-[#dbcfcf] ${className}`}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, "title")}
        onClick={() => handleZoneClick("title")}
      >
        {canvasZones.title.content ? (
          <p className={`text-[17px] font-semibold tracking-[0.01em] ${resumeTheme.titleClass}`}>{canvasZones.title.content.preview}</p>
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
          <div key={titleZone} className="mb-7">
            {zoneCard(titleZone, "px-4 py-3", (content) => (
              <p className="whitespace-pre-line text-[16px] font-semibold leading-6 text-[#202020]">{content.preview}</p>
            ))}
            {zoneCard(dateZone, "mt-2 px-4 py-2", (content) => (
              <p className={`text-[14px] font-semibold ${resumeTheme.titleClass}`}>{content.preview}</p>
            ))}
            {zoneCard(descZone, "mt-3 px-4 py-3", (content) => (
              <ul className="space-y-2 text-[14px] leading-8 text-[#4a4a4a]">
                {content.preview
                  .split(/(?<=\.)\s+/)
                  .filter(Boolean)
                  .map((point, index) => (
                    <li key={`${descZone}-${index}`} className="flex gap-3">
                      <span className="mt-[11px] inline-block h-1.5 w-1.5 rounded-full bg-[#7d7d7d]" />
                      <span>{point}</span>
                    </li>
                  ))}
              </ul>
            ))}
          </div>
        ))}
      </>
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
      className={`relative min-h-screen overflow-hidden bg-transparent p-0 selection:bg-cyan-100 ${theme.shell}`}
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/Background1.mp4" type="video/mp4" />
      </video>
      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-[-12%] z-10 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(103,232,249,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,0.08) 1px, transparent 1px)",
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
        className="pointer-events-none absolute inset-y-0 left-[-14%] z-10 h-full w-[46%] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.28),rgba(34,211,238,0.05)_54%,transparent_74%)] blur-3xl"
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
        className="pointer-events-none absolute inset-y-0 right-[-12%] z-10 h-full w-[42%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),rgba(59,130,246,0.04)_52%,transparent_74%)] blur-3xl"
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
        className="pointer-events-none absolute inset-x-[-8%] top-[11%] z-10 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(125,211,252,0.7),transparent)] shadow-[0_0_34px_rgba(56,189,248,0.48)]"
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
        className="pointer-events-none absolute inset-x-[-8%] bottom-[16%] z-10 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(251,146,60,0.6),transparent)] shadow-[0_0_34px_rgba(251,146,60,0.34)]"
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
              className={`pointer-events-none absolute z-10 rounded-full border border-cyan-300/25 bg-cyan-300/18 shadow-[0_0_30px_rgba(56,189,248,0.34)] ${orb.size}`}
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
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.1),transparent_30%),radial-gradient(circle_at_bottom,rgba(37,99,235,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.45),rgba(2,6,23,0.56))]" />

      <div className="relative z-30 w-full px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-800/80 bg-slate-950/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-100 transition hover:border-cyan-500 hover:bg-cyan-950/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {PROFILE_DATA.map((profile) => {
              const Icon = PROFILE_ICONS[profile.id];
              const active = profile.id === activeProfileId;

              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setActiveProfileId(profile.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
                    active ? "border-cyan-400 bg-cyan-900/50 text-cyan-100" : "border-cyan-900/60 bg-gray-950/50 text-cyan-300 hover:border-cyan-700"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {profile.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`mb-6 flex items-center justify-between rounded-2xl border p-4 ${theme.panelStrong}`}>
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                RESUME BUILDER
              </h1>
              <p className={`text-xs uppercase tracking-widest ${theme.textMuted}`}>Construct from Scratch</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-widest ${theme.textSoft}`}>Progress</p>
              <p className="text-2xl font-bold text-emerald-400">{progress}%</p>
            </div>
            <div className="border-l border-cyan-800/50 pl-4 text-center">
              <p className={`text-[10px] uppercase tracking-widest ${theme.textSoft}`}>Score</p>
              <p className="text-2xl font-bold text-orange-400">{score}</p>
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="rounded-full border border-cyan-800 px-3 py-2 text-xs font-bold uppercase tracking-widest text-cyan-200 transition hover:bg-cyan-900/50"
            >
              Preview A4
            </button>
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className="rounded-full border border-cyan-800 p-2 transition hover:bg-cyan-900/50"
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-cyan-400" />}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-cyan-800 px-3 py-2">
              <button
                type="button"
                onClick={() => setMusicVolume((current) => Math.max(0, Number((current - 0.1).toFixed(2))))}
                className="text-sm font-black text-cyan-300 transition hover:text-cyan-100"
                aria-label="Decrease music volume"
              >
                -
              </button>
              <span className="min-w-[52px] text-center text-[10px] font-bold uppercase tracking-widest text-cyan-200">
                Vol {Math.round(musicVolume * 100)}
              </span>
              <button
                type="button"
                onClick={() => setMusicVolume((current) => Math.min(1, Number((current + 0.1).toFixed(2))))}
                className="text-sm font-black text-cyan-300 transition hover:text-cyan-100"
                aria-label="Increase music volume"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => setThemeMode((current) => (current === "dark" ? "light" : "dark"))}
              className="rounded-full border border-cyan-800 p-2 transition hover:bg-cyan-900/50"
              aria-label="Toggle theme"
            >
              {themeMode === "dark" ? <Sun className="h-4 w-4 text-cyan-400" /> : <MoonStar className="h-4 w-4 text-cyan-400" />}
            </button>
            <button
              type="button"
              onClick={resetGame}
              className="rounded-full border border-cyan-800 p-2 transition hover:bg-cyan-900/50"
              aria-label="Reset game"
            >
              <RotateCcw className="h-4 w-4 text-cyan-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[300px_270px_1fr] gap-6 h-[80vh]">
          <div className={`flex h-full flex-col overflow-hidden rounded-2xl border p-4 shadow-xl shadow-cyan-900/10 ${theme.panel}`}>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-cyan-200">1. Data Inventory</h2>
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
                    className={`w-full rounded-xl border p-3 text-left transition ${isStaged ? theme.staged : theme.card}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${isStaged ? theme.iconShellActive : theme.iconShell}`}>
                        <Icon className={`h-4 w-4 ${isStaged ? "text-cyan-400" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isStaged ? "text-cyan-100" : ""}`}>{item.label}</p>
                        <p className={`text-[10px] uppercase tracking-wider ${theme.textSoft}`}>{item.category}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
              {inventory.length === 0 && (
                <div className="mt-10 flex flex-col items-center text-center font-semibold text-emerald-400">
                  <ShieldCheck className="mb-2 h-10 w-10" />
                  All fields placed!
                </div>
              )}
            </div>
          </div>

          <div className={`relative flex h-full flex-col rounded-2xl border p-4 shadow-xl shadow-cyan-900/10 ${theme.panel}`}>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-cyan-200">2. Prep & Staging</h2>

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
                    <div className="mb-4 flex items-center gap-2 border-b border-cyan-900 pb-2">
                      <stagedItem.icon className="h-5 w-5 text-cyan-400" />
                      <h3 className="font-bold text-cyan-100">{stagedItem.category} Block</h3>
                    </div>
                    <p className={`mb-2 text-xs ${theme.textMuted}`}>Compiled Data Preview:</p>
                    <div className="min-h-[110px] rounded-lg bg-white p-4 text-sm text-gray-900 shadow-inner whitespace-pre-line">
                      {stagedItem.preview}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <p className="mb-2 text-center text-xs uppercase tracking-widest text-orange-400 animate-pulse">
                      Drag block below to canvas →
                    </p>
                    <motion.div
                      draggable
                      onDragStart={(event) => handleInventoryDragStart(event, stagedItem)}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ scale: 1.05, rotate: 2 }}
                      className="cursor-grab rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-center shadow-lg shadow-cyan-900/50 active:cursor-grabbing"
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

          <div className={`relative h-full overflow-y-auto rounded-lg p-8 shadow-2xl custom-scrollbar ${theme.canvas}`}>
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
        {previewOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative flex h-full max-h-[96vh] w-full max-w-5xl flex-col rounded-3xl border border-slate-700 bg-slate-950 p-5 shadow-[0_30px_120px_rgba(15,23,42,0.55)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-[0.28em] text-cyan-100">A4 Preview</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">Final resume page at A4 ratio</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-full border border-cyan-800 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-100 transition hover:bg-cyan-900/50"
                >
                  Close
                </button>
              </div>

              <div className="flex flex-1 items-start justify-center overflow-auto rounded-2xl bg-slate-900/70 p-6">
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
