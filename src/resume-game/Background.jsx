import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import backgroundMusic from "./Background.mp3";
import gameBackground from "../assets/home/game.png";
import careerSenseLogo from "../assets/logos/BlueLogo.png";
import {
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
  Sun,
  Search,
  Gamepad2,
  Lightbulb,
  Trophy,
  User,
  Volume2,
  VolumeX,
  Wrench,
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
    pageClass: "bg-[#fffefd]",
    headingSlash: "text-[#c98a1d]",
    titleClass: "text-[#0d3557]",
    timelineClass: "bg-[#d2aa5b]",
    timelineDotClass: "border-[#c98a1d]",
    panelBorderClass: "border-[#cfdee6]",
    photoBgClass: "bg-[#eef5f8]",
    photoPlaceholderClass: "text-[#6f8ea0]",
    dividerClass: "border-[#dce5e9]",
    namePrimaryClass: "text-[#0d3557]",
    nameSecondaryClass: "text-[#6f8796]",
    fontClass: "font-sans",
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
  const [themeMode, setThemeMode] = useState("light");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.45);
  const [activeProfileId, setActiveProfileId] = useState(PROFILE_DATA[0].id);
  const [inventory, setInventory] = useState(PROFILE_DATA[0].items);
  const [stagedItem, setStagedItem] = useState(null);
  const [canvasZones, setCanvasZones] = useState(cloneZoneTemplate);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryCategory, setInventoryCategory] = useState("All");

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
  const placedCount = activeProfile.items.length - inventory.length;

  const inventoryFilters = ["All", "Identity", "Contact", "Experience", "Education", "Skills", "Other"];

  const filteredInventory = useMemo(() => {
    const normalizedSearch = inventorySearch.trim().toLowerCase();

    return inventory.filter((item) => {
      const categoryMatches =
        inventoryCategory === "All" ||
        (inventoryCategory === "Other"
          ? !["Identity", "Contact", "Experience", "Education", "Skills"].includes(item.category)
          : item.category === inventoryCategory);

      const searchMatches =
        !normalizedSearch ||
        item.label.toLowerCase().includes(normalizedSearch) ||
        item.preview.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      return categoryMatches && searchMatches;
    });
  }, [inventory, inventoryCategory, inventorySearch]);

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
      className={`relative h-screen min-h-[760px] overflow-hidden bg-[#f6efe4] text-[#123a54] selection:bg-[#f0c56a]/30 ${theme.shell}`}
    >
      {/* =====================================================
          CAREERSENSE WORKSPACE BACKGROUND
      ====================================================== */}
      <img
        src={gameBackground}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[1] ${
          themeMode === "dark"
            ? "bg-[linear-gradient(180deg,rgba(5,31,48,.46),rgba(5,31,48,.56))]"
            : "bg-[linear-gradient(180deg,rgba(255,250,242,.22),rgba(250,243,232,.14))]"
        }`}
      />

      {!reduceMotion ? (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-[7%] top-[9%] z-[2] h-[180px] w-[180px] rounded-full bg-[#fff4d5]/25 blur-[80px]"
            animate={{ x: [0, 22, 0], y: [0, 16, 0], opacity: [0.22, 0.42, 0.22] }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[8%] right-[12%] z-[2] h-[150px] w-[150px] rounded-full bg-[#d6a94a]/12 blur-[70px]"
            animate={{ x: [0, -18, 0], y: [0, -12, 0], opacity: [0.14, 0.28, 0.14] }}
            transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </>
      ) : null}

      {/* =====================================================
          MAIN APP SHELL
      ====================================================== */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1740px] flex-col px-5 py-4 lg:px-7 xl:px-9">
        {/* ===================================================
            TOP BAR
        =================================================== */}
        <header className="mb-4 flex shrink-0 items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={careerSenseLogo}
              alt="CareerSense ATS Intelligence"
              className="h-auto w-[210px] object-contain object-left xl:w-[230px]"
            />
          </div>

          <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <div className="flex items-center gap-3 rounded-[22px] border border-[#eadfc9] bg-[#fffaf1] px-7 py-3 shadow-[0_12px_30px_rgba(38,62,78,.08)]">
              <Gamepad2 className="h-5 w-5 text-[#b87a14]" />
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#b87a14]">Resume Builder Game</p>
                <p className="mt-0.5 text-[10px] font-extrabold text-[#234d67]">Drag. Sort. Build. Get Hired.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setThemeMode((current) => (current === "dark" ? "light" : "dark"))}
              className="flex h-11 items-center gap-1 rounded-full border border-[#e3dccf] bg-white px-2 shadow-[0_8px_20px_rgba(27,52,69,.06)]"
              aria-label="Toggle theme"
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-full transition ${
                  themeMode === "light" ? "bg-[#fff0cb] text-[#bf8012]" : "text-[#7890a0]"
                }`}
              >
                <Sun className="h-4 w-4" />
              </span>
              <span
                className={`grid h-8 w-8 place-items-center rounded-full transition ${
                  themeMode === "dark" ? "bg-[#0d3a58] text-white" : "text-[#7890a0]"
                }`}
              >
                <MoonStar className="h-4 w-4" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#e3dccf] bg-white text-[#123a54] shadow-[0_8px_20px_rgba(27,52,69,.06)] transition hover:-translate-y-0.5"
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="group inline-flex h-11 items-center gap-3 rounded-full border border-[#e3dccf] bg-white px-5 text-[11px] font-black text-[#123a54] shadow-[0_8px_20px_rgba(27,52,69,.06)] transition hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Home
            </button>
          </div>
        </header>

        {/* ===================================================
            GAME GRID
        =================================================== */}
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[330px_minmax(0,1fr)_300px] xl:grid-cols-[360px_minmax(0,1fr)_320px] 2xl:grid-cols-[380px_minmax(0,1fr)_340px]">
          {/* =================================================
              LEFT: RESUME ELEMENTS
          ================================================= */}
          <section className="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-[#1d5877] bg-[#073b5a] p-4 text-white shadow-[0_18px_42px_rgba(8,52,79,.18)] xl:p-5">
            <div className="shrink-0 border-b border-white/35 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[20px] font-black tracking-[-0.035em]">Resume Elements</h2>
                  <p className="mt-1 text-[10px] font-medium text-white/72">Drag these into the correct sections</p>
                </div>
                <Archive className="mt-1 h-5 w-5 text-[#f0c667]" />
              </div>

              <label className="relative mt-4 block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/65" />
                <input
                  value={inventorySearch}
                  onChange={(event) => setInventorySearch(event.target.value)}
                  placeholder="Search elements..."
                  className="h-10 w-full rounded-full border border-white/10 bg-white/10 pl-11 pr-4 text-[11px] font-medium text-white outline-none placeholder:text-white/45 focus:border-[#f0c667]/55 focus:bg-white/14"
                />
              </label>

              <div className="mt-3 flex flex-wrap gap-2">
                {inventoryFilters.map((filter) => {
                  const active = filter === inventoryCategory;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setInventoryCategory(filter)}
                      className={`rounded-full px-3 py-1.5 text-[8px] font-black transition ${
                        active
                          ? "bg-[#2d9ff0] text-white shadow-[0_5px_14px_rgba(45,159,240,.22)]"
                          : "bg-white/10 text-white/82 hover:bg-white/16"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-white/8 px-3 py-2">
                <span className="text-[8px] font-black uppercase tracking-[0.16em] text-white/55">Profile</span>
                <select
                  value={activeProfileId}
                  onChange={(event) => setActiveProfileId(event.target.value)}
                  className="max-w-[200px] bg-transparent text-right text-[10px] font-black text-white outline-none"
                >
                  {PROFILE_DATA.map((profile) => (
                    <option key={profile.id} value={profile.id} className="text-[#123a54]">
                      {profile.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {filteredInventory.map((item) => {
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
                    className={`group w-full rounded-[13px] border px-3 py-2.5 text-left transition-all ${
                      isStaged
                        ? "border-[#f0c667] bg-[#fff7df] text-[#123a54] shadow-[0_8px_18px_rgba(0,0,0,.10)]"
                        : "border-[#d9e3e8] bg-[#fbfdfe] text-[#123a54] hover:-translate-y-0.5 hover:border-[#9fc2d3] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] ${
                          isStaged ? "bg-[#fff0c7] text-[#ae7410]" : "bg-[#eaf2f6] text-[#174867]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10.5px] font-black">{item.preview}</p>
                        <p className={`mt-0.5 text-[8px] font-semibold ${isStaged ? "text-[#7a8790]" : "text-[#7b93a2]"}`}>{item.label}</p>
                      </div>

                      <div className={`grid grid-cols-2 gap-[2px] ${isStaged ? "text-[#b27a16]" : "text-[#39677f]"}`} aria-hidden="true">
                        {[0, 1, 2, 3, 4, 5].map((dot) => (
                          <span key={dot} className="h-[2px] w-[2px] rounded-full bg-current" />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredInventory.length === 0 && inventory.length > 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center">
                  <Search className="mx-auto h-6 w-6 text-white/40" />
                  <p className="mt-3 text-[10px] font-bold text-white/60">No matching resume elements.</p>
                </div>
              ) : null}

              {inventory.length === 0 ? (
                <div className="mt-4 flex flex-col items-center rounded-[18px] border border-[#3a806d] bg-[#0e5d50] px-5 py-7 text-center">
                  <ShieldCheck className="h-9 w-9 text-[#7ce0bd]" />
                  <p className="mt-3 text-[12px] font-black">All fields placed!</p>
                  <p className="mt-1 text-[9px] font-medium text-white/70">Your resume is ready for review.</p>
                </div>
              ) : null}
            </div>

            {stagedItem ? (
              <div className="mt-3 shrink-0 rounded-[14px] border border-[#f0c667]/55 bg-[#fff7df] p-3 text-[#123a54]">
                <p className="text-[7px] font-black uppercase tracking-[0.18em] text-[#b2740b]">Selected Element</p>
                <p className="mt-1 truncate text-[10px] font-black">{stagedItem.label}</p>
                <p className="mt-1 line-clamp-2 text-[8px] font-medium leading-4 text-[#647e8e]">Click the matching resume section or drag this block onto it.</p>
              </div>
            ) : null}
          </section>

          {/* =================================================
              CENTER: RESUME CANVAS
          ================================================= */}
          <section className="flex min-h-0 flex-col overflow-hidden rounded-[26px] border border-[#dce4e8] bg-[#fbfdfd] shadow-[0_18px_44px_rgba(25,52,68,.10)]">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e5e9eb] px-5 py-4 xl:px-6">
              <div>
                <h2 className="text-[22px] font-black tracking-[-0.04em] text-[#123a54]">Your Resume</h2>
                <p className="mt-1 text-[10px] font-medium text-[#6d8798]">Drag the right elements into each section</p>
              </div>

              <div className="hidden items-start gap-2 xl:flex">
                <div className="mr-1 text-right">
                  <p className="text-[7px] font-black uppercase tracking-[0.14em] text-[#667f8f]">Choose a Profile</p>
                  <p className="mt-1 text-[8px] font-semibold text-[#9aabb5]">Each role has its own resume style</p>
                </div>

                {PROFILE_DATA.map((profile) => {
                  const Icon = PROFILE_ICONS[profile.id];
                  const active = profile.id === activeProfileId;

                  return (
                    <button
                      key={profile.id}
                      type="button"
                      title={profile.label}
                      onClick={() => setActiveProfileId(profile.id)}
                      className={`grid h-12 w-10 place-items-center rounded-[9px] border bg-white shadow-sm transition ${
                        active
                          ? "border-[#2b98e3] ring-2 ring-[#2b98e3]/20"
                          : "border-[#dce4e8] hover:border-[#a9c6d4]"
                      }`}
                    >
                      {Icon ? <Icon className={`h-4 w-4 ${active ? "text-[#17648b]" : "text-[#7d94a2]"}`} /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-0 flex-1 overflow-auto bg-[#f8fbfc] px-4 py-4 custom-scrollbar xl:px-6">
              <AnimatePresence>
                {feedback ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -10, x: "-50%" }}
                    className={`absolute left-1/2 top-4 z-50 rounded-full border px-5 py-2 text-[9px] font-black uppercase tracking-[0.12em] shadow-xl ${
                      feedback.type === "success"
                        ? "border-[#80c8ad] bg-[#e9f8f2] text-[#14745b]"
                        : "border-[#e7a29e] bg-[#fff0ef] text-[#b8403a]"
                    }`}
                  >
                    {feedback.message}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="mx-auto w-full max-w-[820px]">
                {renderResumePage(false)}
              </div>
            </div>
          </section>

          {/* =================================================
              RIGHT: GAME STATUS
          ================================================= */}
          <aside className="flex min-h-0 flex-col gap-3">
            {/* progress */}
            <section className="rounded-[22px] border border-[#1d5877] bg-[#073b5a] p-5 text-white shadow-[0_18px_42px_rgba(8,52,79,.16)]">
              <h2 className="text-[17px] font-black tracking-[-0.025em]">Game Progress</h2>

              <div className="mt-4 flex items-center gap-5">
                <div
                  className="grid h-[118px] w-[118px] shrink-0 place-items-center rounded-full p-[9px]"
                  style={{
                    background: `conic-gradient(#f0c667 ${progress * 3.6}deg, rgba(255,255,255,.14) 0deg)`,
                  }}
                >
                  <div className="grid h-full w-full place-items-center rounded-full bg-[#073b5a]">
                    <span className="text-[28px] font-black">{progress}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-[21px] font-black">{placedCount} / {activeProfile.items.length}</p>
                  <p className="mt-1 text-[10px] font-medium text-white/74">Elements Placed</p>
                </div>
              </div>

              <div className="mt-4 border-t border-white/20 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="max-w-[210px] text-[10px] font-medium leading-4 text-white/82">
                    {completed ? "Perfect build! Your resume is ready to review." : "Build a complete, ATS-friendly resume to win!"}
                  </p>
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#f0c667] text-[#f0c667]">
                    <Trophy className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </section>

            {/* tip */}
            <section className="rounded-[20px] border border-[#efd697] bg-[#fff6df] p-4 shadow-[0_12px_28px_rgba(65,54,32,.07)]">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ffebbd] text-[#b67810]">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-[#ae7410]">Pro Tip</h3>
                  <p className="mt-1 text-[9.5px] font-medium leading-[1.5] text-[#4f6573]">
                    Include quantifiable achievements (e.g. “Improved efficiency by 30%”) to make your resume stand out.
                  </p>
                </div>
              </div>
            </section>

            {/* score */}
            <section className="rounded-[22px] border border-[#1d5877] bg-[#073b5a] p-5 text-white shadow-[0_18px_42px_rgba(8,52,79,.16)]">
              <p className="text-center text-[16px] font-black">Your Score</p>

              <div className="mt-3 flex items-center justify-center gap-5">
                <div className="grid h-[78px] w-[78px] place-items-center rounded-full border border-[#b98321] bg-[#0b4666] text-[#f0c667] shadow-[0_0_24px_rgba(240,198,103,.12)]">
                  <Award className="h-9 w-9" />
                </div>

                <div>
                  <p className="text-[43px] font-black leading-none text-[#f0c667]">{score}</p>
                  <p className="mt-2 text-[11px] font-black">{completed ? "Excellent Build!" : "Good Luck!"}</p>
                </div>
              </div>
            </section>

            {/* actions */}
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="group inline-flex h-[54px] items-center justify-center gap-3 rounded-[18px] border border-[#dce4e8] bg-white text-[12px] font-black text-[#0d4262] shadow-[0_10px_26px_rgba(27,52,69,.08)] transition hover:-translate-y-0.5 hover:border-[#b9d0db]"
            >
              <Wrench className="h-4 w-4 transition-transform group-hover:rotate-12" />
              Check Resume
            </button>

            <button
              type="button"
              onClick={resetGame}
              disabled={placedCount === 0}
              className="inline-flex h-[52px] items-center justify-center gap-3 rounded-[18px] border border-[#d6d4cc] bg-[#e9e4da] text-[11px] font-black text-[#7f939e] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[#efeae0] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Game
            </button>

            <div className="mt-auto hidden rounded-[18px] border border-[#e7dcc5] bg-[#fffaf2] px-4 py-3 2xl:block">
              <p className="text-right font-serif text-[11px] italic leading-4 text-[#5f7b8c]">Same skills.<br />Bigger opportunities.</p>
              <div className="ml-auto mt-2 h-px w-16 bg-[#c98a1d]" />
            </div>
          </aside>
        </div>
      </div>

      {/* =====================================================
          A4 PREVIEW MODAL
      ====================================================== */}
      <AnimatePresence>
        {previewOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#08283e]/70 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              className="relative flex h-full max-h-[96vh] w-full max-w-5xl flex-col rounded-[28px] border border-[#d9e2e6] bg-[#f8f4ed] p-5 shadow-[0_30px_100px_rgba(7,33,49,.35)]"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#b67810]">CareerSense Resume Builder</p>
                  <h2 className="mt-1 text-[20px] font-black tracking-[-0.035em] text-[#123a54]">A4 Resume Preview</h2>
                  <p className="mt-1 text-[9px] font-medium text-[#718998]">Review your assembled resume before continuing.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-full border border-[#d4dfe4] bg-white px-5 py-2.5 text-[10px] font-black text-[#123a54] transition hover:border-[#b9cdd6]"
                >
                  Close
                </button>
              </div>

              <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto rounded-[22px] bg-[#edf2f4] p-6 custom-scrollbar">
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
