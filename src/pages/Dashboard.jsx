import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

import {
  ArrowLeft,
  ArrowRight,
  Bolt,
  BriefcaseBusiness,
  Crown,
  Database,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Gauge,
  HelpCircle,
  LayoutDashboard,
  Menu,
  Sparkles,
  Star,
  Upload,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";

import CustomUserButton from "../components/common/CustomUserButton";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import DashboardTour from "../tours/DashboardTour";

import lightLogo from "../assets/logos/GoldenLogo.png";
import dashboardBackground from "../assets/home/dashboard.png";

import apiClient from "../services/apiClient";
import { calculateAtsUsage, POINTS_PER_USD } from "../services/subscriptionService";

import {
  uploadJobDescriptionFile,
  getJobDescriptions,
} from "../services/jobDescriptionApi";

import {
  getSavedReportPdfUrl,
  getSavedReports,
} from "../services/reportApi";

import {
  getResumes,
  uploadResume,
} from "../services/resumeApi";


/* =========================================================
   CONFIG
   ========================================================= */

const SECTION_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "reports",
    label: "My ATS Reports",
    icon: FileCheck2,
  },
  {
    id: "sources",
    label: "Data Sources",
    icon: Database,
  },
  {
    id: "billing",
    label: "Usage & Billing",
    icon: Gauge,
  },
  {
    id: "profile",
    label: "Profile Settings",
    icon: UserRound,
  },
];

const PROFILE_STORAGE_KEY =
  "careersense-dashboard-profile";

const REPORTS_CACHE_KEY = "careersense_ats_reports_cache";
const RESUMES_CACHE_KEY = "careersense_ats_resumes_cache";
const JD_CACHE_KEY = "careersense_ats_jd_cache";

function getCachedItems(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setCachedItems(key, items) {
  if (typeof window === "undefined" || !Array.isArray(items)) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // ignore
  }
}

const DEFAULT_PROFILE = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  currentTitle: "",
};


/* =========================================================
   HELPERS
   ========================================================= */

function readStoredProfile() {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(PROFILE_STORAGE_KEY) || "{}"
    );

    const master = JSON.parse(
      window.localStorage.getItem("careerSenseUser") || "{}"
    );

    return {
      fullName:
        parsed.fullName ||
        master.name ||
        master.fullName ||
        DEFAULT_PROFILE.fullName,

      email:
        parsed.email ||
        master.email ||
        DEFAULT_PROFILE.email,

      phone:
        parsed.phone ||
        master.phone ||
        DEFAULT_PROFILE.phone,

      location:
        parsed.location ||
        master.location ||
        DEFAULT_PROFILE.location,

      linkedin:
        parsed.linkedin ||
        master.linkedinPortfolio ||
        master.linkedin ||
        DEFAULT_PROFILE.linkedin,

      currentTitle:
        parsed.currentTitle ||
        master.currentRole ||
        master.currentJobTitle ||
        DEFAULT_PROFILE.currentTitle,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}


function formatDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}


function formatShortDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


function formatPoints(value) {
  return new Intl.NumberFormat().format(
    Math.max(0, Math.round(Number(value) || 0))
  );
}


function formatUsd(value) {
  return `$${Number(value || 0).toFixed(4)}`;
}


function withTimeout(promise, timeoutMs = 20000) {
  return Promise.race([
    promise,

    new Promise((_, reject) => {
      window.setTimeout(() => {
        reject(new Error("Request timed out"));
      }, timeoutMs);
    }),
  ]);
}


function getActualReportTokens(report) {
  if (
    report.tokens_cost ||
    report.careerPoints ||
    report.total_tokens ||
    report.tokensCost
  ) {
    return (
      report.tokens_cost ||
      report.careerPoints ||
      report.total_tokens ||
      report.tokensCost
    );
  }

  const base =
    report.has_job_description
      ? 1825
      : 1350;

  const scoreBonus =
    Math.round(
      (report.overall_score || 0) * 4.75
    );

  return base + scoreBonus;
}


function estimateResumePoints() {
  return 180;
}


function estimateJdPoints() {
  return 95;
}


/* =========================================================
   SHARED PANEL
   ========================================================= */

function Panel({
  children,
  className = "",
  ...props
}) {
  return (
    <section
      {...props}
      className={`
        rounded-[18px]
        border
        border-[#D9E2E7]
        bg-[#FFFDFC]/90
        shadow-[0_12px_32px_rgba(8,47,73,.055)]
        backdrop-blur-[5px]
        ${className}
      `}
    >
      {children}
    </section>
  );
}


/* =========================================================
   SCORE BADGE
   ========================================================= */

function ScoreBadge({
  score,
}) {
  const value =
    Number(score) || 0;

  let style =
    "bg-[#FCE7E3] text-[#C8463D]";

  if (value >= 75) {
    style =
      "bg-[#E5F4EA] text-[#16815C]";
  } else if (value >= 60) {
    style =
      "bg-[#FFF1D5] text-[#B77718]";
  }

  return (
    <span
      className={`
        inline-flex
        min-w-[46px]
        items-center
        justify-center
        rounded-full
        px-3
        py-1.5
        text-[10px]
        font-black
        ${style}
      `}
    >
      {value}
    </span>
  );
}


/* =========================================================
   NAVBAR
   ========================================================= */

function DashboardNavbar({
  profile,
  tokensRemaining,
  estimatedCost,
  onMobileMenu,
  onHelp,
}) {
  const navigate =
    useNavigate();

  return (
    <header
      className="
        relative
        z-50
        flex
        h-[74px]
        shrink-0
        items-center
        bg-[#123A55]
        px-5
        text-white
        shadow-[0_5px_20px_rgba(4,35,54,.16)]
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1920px]
          items-center
          justify-between
          gap-6
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            items-center
            gap-5
          "
        >
          <button
            type="button"
            onClick={onMobileMenu}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/15
              bg-white/5
              lg:hidden
            "
          >
            <Menu size={18} />
          </button>


          <Link
            to="/"
            className="
              flex
              shrink-0
              items-center
              gap-3
            "
          >
            <img
              src={lightLogo}
              alt="CareerSense"
              className="
                h-[46px]
                w-[46px]
                object-contain
              "
            />

            <div>
              <div
                className="
                  font-serif
                  text-[24px]
                  font-semibold
                  leading-none
                  tracking-[-0.03em]
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Career
                <span
                  className="
                    text-[#E6B84F]
                  "
                >
                  Sense
                </span>
              </div>

              <p
                className="
                  mt-1
                  text-[7px]
                  font-black
                  uppercase
                  tracking-[0.26em]
                  text-[#A9C0CF]
                "
              >
                ATS Intelligence
              </p>
            </div>
          </Link>
        </div>


        {/* RIGHT */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <button
            type="button"
            onClick={onHelp}
            data-tour="dashboard-help"
            className="
              hidden
              items-center
              gap-2
              px-3
              text-[11px]
              font-medium
              text-[#D8E4EA]
              xl:flex
            "
          >
            <HelpCircle size={16} />
            Help
          </button>


          {/* TOKENS */}

          <div
            data-tour="dashboard-tokens"
            className="
              hidden
              min-w-[205px]
              items-center
              gap-3
              rounded-[12px]
              border
              border-white/15
              bg-white/[0.07]
              px-4
              py-2
              xl:flex
            "
          >
            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-[#FFF3D5]
                text-[#D9941B]
              "
            >
              <Star
                size={17}
                fill="currentColor"
              />
            </span>

            <div>
              <p
                className="
                  text-[7px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[#A9C0CF]
                "
              >
                AI Tokens Remaining
              </p>

              <p
                className="
                  mt-0.5
                  text-[12px]
                  font-black
                  text-white
                "
              >
                {Number(
                  tokensRemaining || 0
                ).toLocaleString()}
              </p>
            </div>
          </div>


          {/* BILL */}

          <div
            className="
              hidden
              min-w-[150px]
              items-center
              gap-3
              rounded-[12px]
              border
              border-white/15
              bg-white/[0.07]
              px-4
              py-2
              lg:flex
            "
          >
            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-[#E1F4E9]
                font-black
                text-[#14845A]
              "
            >
              $
            </span>

            <div>
              <p
                className="
                  text-[7px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[#A9C0CF]
                "
              >
                Bill
              </p>

              <p
                className="
                  mt-0.5
                  text-[12px]
                  font-black
                "
              >
                {formatUsd(
                  estimatedCost
                )}
              </p>
            </div>
          </div>


          <Link
            to="/dashboard"
            className="
              hidden
              h-[46px]
              items-center
              justify-center
              rounded-[10px]
              border
              border-white/16
              bg-white/[0.07]
              px-5
              text-[10px]
              font-black
              lg:flex
            "
          >
            Dashboard
          </Link>


          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              hidden
              h-[46px]
              items-center
              gap-2
              rounded-[10px]
              border
              border-white/16
              bg-white/[0.07]
              px-5
              text-[10px]
              font-black
              lg:flex
            "
          >
            <ArrowLeft size={14} />
            Back
          </button>


          <CustomUserButton />
        </div>
      </div>
    </header>
  );
}


/* =========================================================
   SIDEBAR
   ========================================================= */

function DashboardSidebar({
  activeSection,
  onSelectSection,
  profile,
  user,
  subData,
}) {
  const currentPlan = (subData?.plan || "free").toLowerCase();
  const hasPaidPlan = currentPlan !== "free";
  const planDisplayName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);
  return (
    <aside
      data-tour="dashboard-sidebar"
      className="
        relative
        z-30
        hidden
        w-[285px]
        shrink-0
        flex-col
        overflow-hidden
        bg-[linear-gradient(180deg,#062F49_0%,#052B43_100%)]
        px-5
        pb-6
        pt-7
        text-white
        lg:flex
      "
    >
      {/* PROFILE */}

      <div
        className="
          flex
          items-center
          gap-4
          px-2
        "
      >
        <div
          className="
            h-[50px]
            w-[50px]
            shrink-0
            overflow-hidden
            rounded-full
            border-2
            border-[#D6B46B]/60
            bg-[#174B68]
          "
        >
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt=""
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
              "
            >
              <UserRound size={22} />
            </div>
          )}
        </div>


        <div>
          <p
            className="
              text-[10px]
              font-medium
              text-[#C2D3DC]
            "
          >
            Welcome back,
          </p>

          <p
            className="
              mt-1
              font-serif
              text-[19px]
              font-semibold
              leading-none
              text-white
            "
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >
            {profile.fullName ||
              "CareerSense User"}
          </p>
        </div>
      </div>


      <p
        className="
          mt-7
          px-2
          text-[7px]
          font-black
          uppercase
          tracking-[0.32em]
          text-[#9CB5C4]
        "
      >
        Let's build your next opportunity
      </p>


      {/* NAV */}

      <nav
        className="
          mt-5
          space-y-2
        "
      >
        {SECTION_ITEMS.map(
          ({
            id,
            label,
            icon: Icon,
          }) => {
            const active =
              activeSection === id;

            return (
              <button
                key={id}
                type="button"
                data-tour={`dashboard-nav-${id}`}
                onClick={() =>
                  onSelectSection(id)
                }
                className={`
                  relative
                  flex
                  w-full
                  items-center
                  gap-4
                  rounded-[13px]
                  border
                  px-4
                  py-[15px]
                  text-left
                  transition-all

                  ${
                    active
                      ? `
                        border-[#D8B66A]/45
                        bg-[#D5B15B]/28
                        text-white
                        shadow-[0_0_0_5px_rgba(86,124,141,.16)]
                      `
                      : `
                        border-transparent
                        text-[#D2DEE4]
                        hover:bg-white/[0.05]
                        hover:text-white
                      `
                  }
                `}
              >
                <Icon
                  size={18}
                  className={
                    active
                      ? "text-[#F3BD3E]"
                      : "text-[#AFC4D0]"
                  }
                />

                <span
                  className="
                    text-[11px]
                    font-semibold
                  "
                >
                  {label}
                </span>
              </button>
            );
          }
        )}
      </nav>


      {/* UPGRADE */}

      <div
        className="
          mt-6
          rounded-[16px]
          border
          border-[#6D8DA0]/65
          bg-[#093650]/65
          p-4
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <span
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#F2BC3D]
              text-[#0B3651]
            "
          >
            <Crown size={18} />
          </span>

          <div>
            <p
              className="
                text-[11px]
                font-black
              "
            >
              {hasPaidPlan ? `${planDisplayName} Plan` : "Upgrade to Pro"}
            </p>

            <p
              className="
                mt-1
                text-[8.5px]
                font-medium
                leading-[1.5]
                text-[#BCD0DA]
              "
            >
              {hasPaidPlan
                ? "Active subscription with premium AI access & benefits."
                : "Higher limits, deeper analysis and premium features."}
            </p>
          </div>
        </div>


        <a
          href="https://careersenseai.com/pricing"
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-4
            flex
            h-[42px]
            w-full
            items-center
            justify-center
            gap-3
            rounded-[9px]
            bg-[#F1BD45]
            text-[9px]
            font-black
            text-[#123A55]
            shadow-[0_8px_20px_rgba(232,185,79,.18)]
            transition hover:brightness-105
          "
        >
          {hasPaidPlan ? "Manage Plan" : "Upgrade Now"}

          <ArrowRight size={13} />
        </a>
      </div>


      {/* SLOGAN */}

      <div
        className="
          mt-auto
          pb-1
          pt-6
          text-center
        "
      >
        <p
          className="
            font-serif
            text-[16px]
            italic
            leading-[1.2]
            text-[#DAE5EA]
          "
          style={{
            fontFamily:
              "Georgia, 'Times New Roman', serif",
          }}
        >
          Better Resumes.
          <br />
          Brighter Futures.
        </p>

        <span
          className="
            mx-auto
            mt-3
            block
            h-[2px]
            w-12
            rotate-[-5deg]
            bg-[#F2BB38]
          "
        />
      </div>
    </aside>
  );
}


/* =========================================================
   HEADING
   ========================================================= */

function DashboardHeading({
  profile,
}) {
  return (
    <div>
      <p
        className="
          text-[8px]
          font-black
          uppercase
          tracking-[0.28em]
          text-[#B5771A]
        "
      >
        Dashboard
      </p>

      <h1
        className="
          mt-2
          font-serif
          text-[34px]
          font-semibold
          leading-[1]
          tracking-[-0.035em]
          text-[#103650]
          xl:text-[39px]
        "
        style={{
          fontFamily:
            "Georgia, 'Times New Roman', serif",
        }}
      >
        Good to see you again,{" "}
        {profile.fullName
          ? profile.fullName.split(" ")[0]
          : "there"}
        !
      </h1>

      <p
        className="
          mt-2
          text-[10.5px]
          font-medium
          text-[#567C8D]
        "
      >
        Here's an overview of your ATS activity and everything you need to strengthen your next application.
      </p>
    </div>
  );
}


/* =========================================================
   STAT CARD
   ========================================================= */

function OverviewStatCard({
  title,
  value,
  footer,
  icon: Icon,
  tone,
  progress,
}) {
  const themes = {
    blue: {
      iconBg: "#E6F1FA",
      iconColor: "#126BC6",
      border: "#C9DDEB",
      bar: "#2387D5",
      track: "#E3EEF4",
    },

    green: {
      iconBg: "#E4F4EB",
      iconColor: "#11875C",
      border: "#C8E2D5",
      bar: "#16A36C",
      track: "#DCECE4",
    },

    gold: {
      iconBg: "#FFF0D3",
      iconColor: "#C38414",
      border: "#E9D5AB",
      bar: "#B67A12",
      track: "#EEE4CF",
    },

    purple: {
      iconBg: "#EEE7FF",
      iconColor: "#6440CA",
      border: "#DFD5F1",
      bar: "#6041B9",
      track: "#E5DFF1",
    },
  };

  const theme =
    themes[tone] ||
    themes.blue;

  return (
    <div
      className="
        min-h-[122px]
        rounded-[16px]
        border
        bg-[#FFFDFC]/92
        px-4
        py-4
        shadow-[0_10px_28px_rgba(8,47,73,.04)]
        backdrop-blur-[4px]
      "
      style={{
        borderColor:
          theme.border,
      }}
    >
      <div
        className="
          flex
          items-start
          gap-4
        "
      >
        <span
          className="
            flex
            h-[48px]
            w-[48px]
            shrink-0
            items-center
            justify-center
            rounded-full
          "
          style={{
            backgroundColor:
              theme.iconBg,

            color:
              theme.iconColor,
          }}
        >
          <Icon size={21} />
        </span>


        <div
          className="
            min-w-0
          "
        >
          <p
            className="
              text-[9px]
              font-medium
              text-[#31566D]
            "
          >
            {title}
          </p>

          <p
            className="
              mt-1
              font-serif
              text-[25px]
              font-semibold
              leading-none
              text-[#103650]
            "
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
            }}
          >
            {value}
          </p>
        </div>
      </div>


      {typeof progress ===
      "number" ? (
        <div
          className="
            mt-4
          "
        >
          <div
            className="
              h-[7px]
              overflow-hidden
              rounded-full
            "
            style={{
              backgroundColor:
                theme.track,
            }}
          >
            <div
              className="
                h-full
                rounded-full
              "
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    progress
                  )
                )}%`,

                backgroundColor:
                  theme.bar,
              }}
            />
          </div>

          <div
            className="
              mt-1.5
              text-right
              text-[7.5px]
              font-black
            "
            style={{
              color:
                theme.iconColor,
            }}
          >
            {progress}%
          </div>
        </div>
      ) : (
        <p
          className="
            mt-4
            text-[8px]
            font-medium
          "
          style={{
            color:
              theme.iconColor,
          }}
        >
          {footer}
        </p>
      )}
    </div>
  );
}


/* =========================================================
   ACTION CARDS
   ========================================================= */

function ActionCards({
  onUploadResume,
}) {
  return (
    <div
      data-tour="dashboard-actions"
      className="
        grid
        gap-3
        xl:grid-cols-2
      "
    >
      <Panel
        className="
          flex
          min-h-[104px]
          items-center
          justify-between
          gap-5
          px-5
          py-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <span
            className="
              flex
              h-[50px]
              w-[50px]
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FFF1D4]
              text-[#B97813]
            "
          >
            <FileCheck2 size={22} />
          </span>

          <div>
            <h3
              className="
                text-[14px]
                font-black
                text-[#103650]
              "
            >
              Run a New ATS Check
            </h3>

            <p
              className="
                mt-1
                text-[8.5px]
                font-medium
                text-[#7892A1]
              "
            >
              Compare your resume against ATS and a target role.
            </p>
          </div>
        </div>


        <Link
          to="/check-ats"
          className="
            flex
            h-[42px]
            shrink-0
            items-center
            gap-2
            rounded-[9px]
            bg-[#083B5B]
            px-5
            text-[9px]
            font-black
            text-white
            shadow-[0_8px_18px_rgba(8,59,91,.16)]
          "
        >
          Start Check
          <ArrowRight size={13} />
        </Link>
      </Panel>


      <Panel
        className="
          flex
          min-h-[104px]
          items-center
          justify-between
          gap-5
          px-5
          py-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <span
            className="
              flex
              h-[50px]
              w-[50px]
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#E7F1FA]
              text-[#236FC0]
            "
          >
            <UploadCloud size={22} />
          </span>

          <div>
            <h3
              className="
                text-[14px]
                font-black
                text-[#103650]
              "
            >
              Upload Resume
            </h3>

            <p
              className="
                mt-1
                text-[8.5px]
                font-medium
                text-[#7892A1]
              "
            >
              Add a resume to your CareerSense workspace.
            </p>
          </div>
        </div>


        <button
          type="button"
          onClick={
            onUploadResume
          }
          className="
            flex
            h-[42px]
            shrink-0
            items-center
            gap-2
            rounded-[9px]
            border
            border-[#B9D1E1]
            bg-white
            px-5
            text-[9px]
            font-black
            text-[#0B5DB0]
          "
        >
          Upload Resume

          <ArrowRight size={13} />
        </button>
      </Panel>
    </div>
  );
}


/* =========================================================
   RECENT REPORTS
   ========================================================= */

function RecentReports({
  reports,
  onViewAll,
}) {
  const visible =
    reports.slice(0, 4);

  return (
    <Panel
      data-tour="dashboard-recent-reports"
      className="
        min-h-[320px]
        px-4
        py-4
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#E2E8EB]
          pb-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <FileCheck2
            size={17}
            className="
              text-[#C58417]
            "
          />

          <h3
            className="
              text-[13px]
              font-black
              text-[#103650]
            "
          >
            Recent ATS Reports
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="
            flex
            items-center
            gap-2
            text-[8px]
            font-black
            text-[#0D60B2]
          "
        >
          View All

          <ArrowRight size={12} />
        </button>
      </div>


      <div
        className="
          mt-2
        "
      >
        {visible.length ? (
          visible.map(
            (report) => (
              <div
                key={
                  report.report_id
                }
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-[#E6EBED]
                  px-2
                  py-3
                  last:border-0
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#EDF4F7]
                      text-[#174B68]
                    "
                  >
                    <FileText size={15} />
                  </span>


                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        truncate
                        text-[9.5px]
                        font-black
                        text-[#103650]
                      "
                    >
                      {report.candidate_name ||
                        report.resume_file_name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[7.5px]
                        font-medium
                        text-[#7892A1]
                      "
                    >
                      {report.report_type ===
                      "resume_jd"
                        ? "Resume + JD"
                        : "Resume only"}

                      {" · "}

                      {report.report_level === "basic" ? "Basic" : "Detailed"}

                      {" · "}

                      {formatShortDate(
                        report.created_at
                      )}
                    </p>
                  </div>
                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <ScoreBadge
                    score={
                      report.overall_score
                    }
                  />


                  <Link
                    to={report.report_level === "basic" ? `/reports/basic/${report.report_id}` : `/repository/report/${report.report_id}`}
                    className="
                      flex
                      h-8
                      items-center
                      gap-1.5
                      rounded-[8px]
                      border
                      border-[#D8E1E5]
                      bg-white
                      px-3
                      text-[7.5px]
                      font-black
                      text-[#103650]
                    "
                  >
                    <Eye size={12} />
                    View
                  </Link>


                  <a
                    href={getSavedReportPdfUrl(
                      report.report_id
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-[8px]
                      border
                      border-[#D8E1E5]
                      bg-white
                      text-[#103650]
                    "
                  >
                    <Download size={12} />
                  </a>
                </div>
              </div>
            )
          )
        ) : (
          <div
            className="
              flex
              min-h-[210px]
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <FileCheck2
              size={28}
              className="
                text-[#AFC0C9]
              "
            />

            <p
              className="
                mt-3
                text-[10px]
                font-black
                text-[#103650]
              "
            >
              No ATS reports yet
            </p>

            <p
              className="
                mt-1
                text-[8px]
                text-[#7892A1]
              "
            >
              Run your first ATS check to see it here.
            </p>
          </div>
        )}
      </div>
    </Panel>
  );
}


/* =========================================================
   PLAN + USAGE
   ========================================================= */

function PlanUsageCard({
  subData,
  totalPoints,
}) {
  const tokenLimit =
    Math.max(
      Number(
        subData?.tokensRemaining || 0
      ) +
        Number(
          totalPoints || 0
        ),
      10000
    );


  const usedPercent =
    tokenLimit
      ? Math.min(
          100,
          Math.round(
            (
              Number(
                totalPoints || 0
              ) /
              tokenLimit
            ) * 100
          )
        )
      : 0;


  return (
    <Panel
      className="
        px-4
        py-4
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#E2E8EB]
          pb-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <Crown
            size={17}
            className="
              text-[#C58417]
            "
          />

          <h3
            className="
              text-[13px]
              font-black
              text-[#103650]
            "
          >
            Your Plan & Usage
          </h3>
        </div>


        <button
          type="button"
          className="
            flex
            items-center
            gap-2
            text-[8px]
            font-black
            text-[#0D60B2]
          "
        >
          Manage Plan

          <ArrowRight size={12} />
        </button>
      </div>


      <div
        className="
          mt-3
          flex
          items-center
          justify-between
          border-b
          border-[#E7EBED]
          pb-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[#F2F5F6]
              text-[#103650]
            "
          >
            <Crown size={17} />
          </span>

          <div>
            <p
              className="
                text-[9.5px]
                font-black
                text-[#103650]
              "
            >
              {(subData?.plan || "free")
                .replace(/_/g, " ")
                .replace(
                  /\b\w/g,
                  (c) =>
                    c.toUpperCase()
                )}{" "}
              Plan
            </p>

            <p
              className="
                mt-1
                text-[7px]
                text-[#7892A1]
              "
            >
              CareerSense subscription
            </p>
          </div>
        </div>


        <button
          type="button"
          className="
            rounded-[8px]
            bg-[#B77713]
            px-5
            py-2.5
            text-[8px]
            font-black
            text-white
          "
        >
          Upgrade
        </button>
      </div>


      <div
        className="
          mt-4
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#E7F1FA]
                text-[#286DC3]
              "
            >
              <Bolt size={17} />
            </span>

            <p
              className="
                text-[9px]
                font-black
                text-[#103650]
              "
            >
              AI Tokens Remaining
            </p>
          </div>


          <p
            className="
              text-[8px]
              font-black
              text-[#0C68CC]
            "
          >
            {Number(
              subData?.tokensRemaining || 0
            ).toLocaleString()}
          </p>
        </div>


        <div
          className="
            mt-3
            h-[7px]
            overflow-hidden
            rounded-full
            bg-[#E0ECE7]
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-[#179C69]
            "
            style={{
              width: `${Math.max(
                2,
                100 - usedPercent
              )}%`,
            }}
          />
        </div>


        <p
          className="
            mt-1
            text-right
            text-[7.5px]
            font-black
            text-[#169368]
          "
        >
          {Math.max(
            0,
            100 - usedPercent
          )}
          %
        </p>
      </div>
    </Panel>
  );
}


/* =========================================================
   PRO TIP
   ========================================================= */

function ProTip() {
  return (
    <div
      className="
        rounded-[15px]
        border
        border-[#E8BD67]
        bg-[#FFF7E8]/94
        px-4
        py-4
        backdrop-blur-[4px]
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <span
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#FBEBCB]
            text-[#BE7D17]
          "
        >
          <Sparkles size={17} />
        </span>

        <div>
          <p
            className="
              text-[9.5px]
              font-black
              text-[#9A6412]
            "
          >
            Pro Tip
          </p>

          <p
            className="
              mt-1
              text-[8px]
              font-medium
              leading-[1.55]
              text-[#536F7F]
            "
          >
            Upload both your resume and job description to get better keyword-gap analysis and more accurate role alignment.
          </p>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   OVERVIEW
   ========================================================= */

function OverviewSection({
  profile,
  reports,
  resumes,
  jobDescriptions,
  totalPoints,
  subData,
  onUploadResume,
  onSelectSection,
}) {
  const profileValues =
    Object.values(
      profile
    );

  const filled =
    profileValues.filter(
      (value) =>
        typeof value ===
          "string" &&
        value.trim()
    ).length;


  const profileCompletion =
    profileValues.length
      ? Math.round(
          (
            filled /
            profileValues.length
          ) * 100
        )
      : 0;


  const resumeCapacity = 10;
  const jdCapacity = 25;


  const resumePercent =
    Math.min(
      100,
      Math.round(
        (
          resumes.length /
          resumeCapacity
        ) * 100
      )
    );


  const jdPercent =
    Math.min(
      100,
      Math.round(
        (
          jobDescriptions.length /
          jdCapacity
        ) * 100
      )
    );


  return (
    <div
      data-tour="dashboard-overview"
      className="
        space-y-4
      "
    >
      <DashboardHeading
        profile={profile}
      />


      {/* STATS */}

      <div
        data-tour="dashboard-stats"
        className="
          grid
          gap-3
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        <OverviewStatCard
          title="ATS Reports Created"
          value={reports.length}
          footer="Saved in My ATS Reports"
          icon={FileCheck2}
          tone="blue"
        />

        <OverviewStatCard
          title="Resumes Stored"
          value={`${resumes.length} / ${resumeCapacity}`}
          icon={Database}
          tone="green"
          progress={resumePercent}
        />

        <OverviewStatCard
          title="Job Descriptions"
          value={`${jobDescriptions.length} / ${jdCapacity}`}
          icon={BriefcaseBusiness}
          tone="gold"
          progress={jdPercent}
        />

        <OverviewStatCard
          title="Profile Completeness"
          value={`${profileCompletion}%`}
          icon={UserRound}
          tone="purple"
          progress={
            profileCompletion
          }
        />
      </div>


      <ActionCards
        onUploadResume={
          onUploadResume
        }
      />


      {/* LOWER */}

      <div
        className="
          grid
          gap-4
          xl:grid-cols-[1.45fr_.95fr]
        "
      >
        <RecentReports
          reports={reports}
          onViewAll={() =>
            onSelectSection(
              "reports"
            )
          }
        />


        <div
          className="
            space-y-4
          "
        >
          <PlanUsageCard
            subData={subData}
            totalPoints={
              totalPoints
            }
          />

          <ProTip />
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   REPORTS SECTION
   ========================================================= */

function ReportsSection({
  reports,
}) {
  return (
    <Panel
      className="
        px-6
        py-6
      "
    >
      <p
        className="
          text-[8px]
          font-black
          uppercase
          tracking-[0.25em]
          text-[#B5771A]
        "
      >
        Saved Analysis
      </p>

      <h2
        className="
          mt-2
          font-serif
          text-[30px]
          font-semibold
          text-[#103650]
        "
        style={{
          fontFamily:
            "Georgia, 'Times New Roman', serif",
        }}
      >
        My ATS Reports
      </h2>

      <p
        className="
          mt-2
          text-[9px]
          text-[#7892A1]
        "
      >
        Open previous reports, review scores and download saved analysis.
      </p>


      <div
        className="
          mt-6
          space-y-2
        "
      >
        {reports.length ? (
          reports.map(
            (report) => (
              <div
                key={
                  report.report_id
                }
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                  rounded-[13px]
                  border
                  border-[#DEE5E8]
                  bg-white/92
                  px-4
                  py-3
                  backdrop-blur-[3px]
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#EDF4F7]
                      text-[#174B68]
                    "
                  >
                    <FileCheck2 size={17} />
                  </span>


                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        truncate
                        text-[10px]
                        font-black
                        text-[#103650]
                      "
                    >
                      {report.candidate_name ||
                        report.resume_file_name}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[7.5px]
                        text-[#7892A1]
                      "
                    >
                      {report.report_type ===
                      "resume_jd"
                        ? "Resume + JD"
                        : "Resume only"}

                      {" · "}

                      {report.report_level === "basic" ? "Basic" : "Detailed"}

                      {" · "}

                      {formatDate(
                        report.created_at
                      )}
                    </p>
                  </div>
                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <ScoreBadge
                    score={
                      report.overall_score
                    }
                  />

                  <a
                    href={report.report_level === "basic" ? `/reports/basic/${report.report_id}?printMode=1&autoPrint=1` : getSavedReportPdfUrl(report.report_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      h-9
                      items-center
                      gap-2
                      rounded-[8px]
                      border
                      border-[#D8E1E5]
                      bg-white
                      px-3
                      text-[8px]
                      font-black
                      text-[#103650]
                    "
                  >
                    <Download size={12} />
                    PDF
                  </a>


                  <Link
                    to={report.report_level === "basic" ? `/reports/basic/${report.report_id}` : `/repository/report/${report.report_id}`}
                    className="
                      flex
                      h-9
                      items-center
                      gap-2
                      rounded-[8px]
                      bg-[#083B5B]
                      px-4
                      text-[8px]
                      font-black
                      text-white
                    "
                  >
                    <Eye size={12} />
                    View
                  </Link>
                </div>
              </div>
            )
          )
        ) : (
          <div
            className="
              rounded-[15px]
              border
              border-dashed
              border-[#CEDDE4]
              bg-white/55
              py-16
              text-center
              backdrop-blur-[3px]
            "
          >
            <FileCheck2
              size={30}
              className="
                mx-auto
                text-[#9DB2BE]
              "
            />

            <p
              className="
                mt-3
                text-[10px]
                font-black
                text-[#103650]
              "
            >
              No ATS reports yet.
            </p>
          </div>
        )}
      </div>
    </Panel>
  );
}


/* =========================================================
   DATA SOURCES
   ========================================================= */

function DataSourcesSection({
  resumes,
  jobDescriptions,
  onUploadResumeClick,
  onUploadJdClick,
  isUploadingResume,
  isUploadingJd,
}) {
  return (
    <div
      className="
        space-y-4
      "
    >
      <Panel
        className="
          px-6
          py-6
        "
      >
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.25em]
            text-[#B5771A]
          "
        >
          Workspace Files
        </p>

        <h2
          className="
            mt-2
            font-serif
            text-[30px]
            font-semibold
            text-[#103650]
          "
          style={{
            fontFamily:
              "Georgia, 'Times New Roman', serif",
          }}
        >
          Data Sources
        </h2>

        <p
          className="
            mt-2
            text-[9px]
            text-[#7892A1]
          "
        >
          Store resumes and job descriptions and reuse them across ATS workflows.
        </p>


        <div
          className="
            mt-5
            grid
            gap-3
            md:grid-cols-2
          "
        >
          <button
            type="button"
            onClick={
              onUploadResumeClick
            }
            disabled={
              isUploadingResume
            }
            className="
              flex
              items-center
              justify-between
              rounded-[13px]
              border
              border-[#DDE5E8]
              bg-white/90
              px-5
              py-4
              text-left
              backdrop-blur-[3px]
              transition
              hover:-translate-y-0.5
              disabled:opacity-50
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-black
                  text-[#103650]
                "
              >
                Upload Resume
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  text-[#7892A1]
                "
              >
                PDF, DOC or DOCX
              </p>
            </div>

            <Upload
              size={20}
              className="
                text-[#C58417]
              "
            />
          </button>


          <button
            type="button"
            onClick={
              onUploadJdClick
            }
            disabled={
              isUploadingJd
            }
            className="
              flex
              items-center
              justify-between
              rounded-[13px]
              border
              border-[#DDE5E8]
              bg-white/90
              px-5
              py-4
              text-left
              backdrop-blur-[3px]
              transition
              hover:-translate-y-0.5
              disabled:opacity-50
            "
          >
            <div>
              <p
                className="
                  text-[11px]
                  font-black
                  text-[#103650]
                "
              >
                Upload Job Description
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  text-[#7892A1]
                "
              >
                PDF, DOC, TXT or MD
              </p>
            </div>

            <Upload
              size={20}
              className="
                text-[#C58417]
              "
            />
          </button>
        </div>
      </Panel>


      <div
        className="
          grid
          gap-4
          xl:grid-cols-2
        "
      >
        <Panel
          className="
            px-5
            py-5
          "
        >
          <h3
            className="
              text-[13px]
              font-black
              text-[#103650]
            "
          >
            Stored Resumes
          </h3>

          <div
            className="
              mt-4
              space-y-2
            "
          >
            {resumes.length ? (
              resumes.map(
                (resume) => (
                  <div
                    key={
                      resume.resume_id
                    }
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-[11px]
                      border
                      border-[#DFE6E9]
                      bg-white/90
                      px-3
                      py-3
                    "
                  >
                    <FileText
                      size={16}
                      className="
                        text-[#174B68]
                      "
                    />

                    <div
                      className="
                        min-w-0
                      "
                    >
                      <p
                        className="
                          truncate
                          text-[9px]
                          font-black
                          text-[#103650]
                        "
                      >
                        {resume.file_name}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[7px]
                          text-[#7892A1]
                        "
                      >
                        {formatShortDate(
                          resume.updated_at
                        )}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p
                className="
                  py-8
                  text-center
                  text-[8px]
                  text-[#7892A1]
                "
              >
                No resumes stored yet.
              </p>
            )}
          </div>
        </Panel>


        <Panel
          className="
            px-5
            py-5
          "
        >
          <h3
            className="
              text-[13px]
              font-black
              text-[#103650]
            "
          >
            Stored Job Descriptions
          </h3>

          <div
            className="
              mt-4
              space-y-2
            "
          >
            {jobDescriptions.length ? (
              jobDescriptions.map(
                (jd) => (
                  <div
                    key={
                      jd.job_description_id
                    }
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-[11px]
                      border
                      border-[#DFE6E9]
                      bg-white/90
                      px-3
                      py-3
                    "
                  >
                    <BriefcaseBusiness
                      size={16}
                      className="
                        text-[#C58417]
                      "
                    />

                    <div
                      className="
                        min-w-0
                      "
                    >
                      <p
                        className="
                          truncate
                          text-[9px]
                          font-black
                          text-[#103650]
                        "
                      >
                        {jd.title ||
                          "Untitled job description"}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[7px]
                          text-[#7892A1]
                        "
                      >
                        {formatShortDate(
                          jd.created_at
                        )}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p
                className="
                  py-8
                  text-center
                  text-[8px]
                  text-[#7892A1]
                "
              >
                No job descriptions stored yet.
              </p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}


/* =========================================================
   BILLING
   ========================================================= */

function BillingSection({
  totalPoints,
  estimatedCost,
  ledger,
  subData,
}) {
  return (
    <div
      className="
        space-y-4
      "
    >
      <Panel
        className="
          px-6
          py-6
        "
      >
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.25em]
            text-[#B5771A]
          "
        >
          Workspace Usage
        </p>

        <h2
          className="
            mt-2
            font-serif
            text-[30px]
            font-semibold
            text-[#103650]
          "
          style={{
            fontFamily:
              "Georgia, 'Times New Roman', serif",
          }}
        >
          Usage & Billing
        </h2>


        <div
          className="
            mt-5
            grid
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <OverviewStatCard
            title="AI Tokens Remaining"
            value={Number(
              subData?.tokensRemaining ?? 30000
            ).toLocaleString()}
            footer="CareerSense Reverse Balance"
            icon={Bolt}
            tone="blue"
          />

          <OverviewStatCard
            title="Lifetime tokens used"
            value={(totalPoints || 0).toLocaleString()}
            footer="Total Platform Consumption"
            icon={Gauge}
            tone="gold"
          />

          <OverviewStatCard
            title="Lifetime bills"
            value={formatUsd(
              estimatedCost
            )}
            footer="Bills are managed by careersenseAi, you dont need to pay"
            icon={Bolt}
            tone="green"
          />

          <a
            href="https://careersenseai.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-transform hover:-translate-y-0.5"
          >
            <OverviewStatCard
              title="Active Operational Tier"
              value={`${(
                subData?.plan ||
                "free"
              ).toUpperCase()} Plan`}
              footer="CareerSense Subscription ↗"
              icon={Crown}
              tone="gold"
            />
          </a>
        </div>
      </Panel>


      <Panel
        className="
          px-5
          py-5
        "
      >
        <h3
          className="
            text-[13px]
            font-black
            text-[#103650]
          "
        >
          Transaction History
        </h3>

        <div
          className="
            mt-4
            overflow-hidden
            rounded-[12px]
            border
            border-[#E0E6E9]
          "
        >
          <div
            className="
              grid
              grid-cols-[1.2fr_1fr_1fr_.4fr]
              gap-3
              bg-[#F7F5F0]/94
              px-4
              py-3
              text-[7px]
              font-black
              uppercase
              tracking-[0.15em]
              text-[#7892A1]
            "
          >
            <span>Operation</span>
            <span>Resource</span>
            <span>Date</span>

            <span
              className="
                text-right
              "
            >
              Units
            </span>
          </div>


          {ledger.length ? (
            ledger.map(
              (item) => (
                <div
                  key={item.id}
                  className="
                    grid
                    grid-cols-[1.2fr_1fr_1fr_.4fr]
                    gap-3
                    border-t
                    border-[#E7EBED]
                    bg-white/90
                    px-4
                    py-3
                    text-[8px]
                    text-[#536F7F]
                  "
                >
                  <strong
                    className="
                      text-[#103650]
                    "
                  >
                    {item.operation}
                  </strong>

                  <span>
                    {item.resource}
                  </span>

                  <span>
                    {formatDate(
                      item.timestamp
                    )}
                  </span>

                  <strong
                    className="
                      text-right
                      text-[#103650]
                    "
                  >
                    {formatPoints(
                      item.units
                    )}
                  </strong>
                </div>
              )
            )
          ) : (
            <div
              className="
                bg-white/80
                py-12
                text-center
                text-[8px]
                text-[#7892A1]
              "
            >
              No ATS activity logged yet.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}


/* =========================================================
   PROFILE
   ========================================================= */

function ProfileSection({
  profile,
}) {
  const fields = [
    [
      "Full Name",
      profile.fullName,
    ],
    [
      "Email",
      profile.email,
    ],
    [
      "Phone",
      profile.phone,
    ],
    [
      "Location",
      profile.location,
    ],
    [
      "LinkedIn / Portfolio",
      profile.linkedin,
    ],
    [
      "Current Job Title",
      profile.currentTitle,
    ],
  ];


  return (
    <Panel
      className="
        px-6
        py-6
      "
    >
      <p
        className="
          text-[8px]
          font-black
          uppercase
          tracking-[0.25em]
          text-[#B5771A]
        "
      >
        Personal Details
      </p>

      <h2
        className="
          mt-2
          font-serif
          text-[30px]
          font-semibold
          text-[#103650]
        "
        style={{
          fontFamily:
            "Georgia, 'Times New Roman', serif",
        }}
      >
        Profile Settings
      </h2>


      <div
        className="
          mt-6
          grid
          gap-4
          md:grid-cols-2
        "
      >
        {fields.map(
          ([label, value]) => (
            <div
              key={label}
            >
              <p
                className="
                  text-[7px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-[#7892A1]
                "
              >
                {label}
              </p>

              <div
                className="
                  mt-2
                  flex
                  h-[46px]
                  items-center
                  rounded-[10px]
                  border
                  border-[#DCE4E7]
                  bg-[#FAFCFC]/92
                  px-4
                  text-[9px]
                  font-bold
                  text-[#103650]
                  backdrop-blur-[3px]
                "
              >
                {value || "—"}
              </div>
            </div>
          )
        )}
      </div>


      <div
        className="
          mt-6
          flex
          justify-end
        "
      >
        <a
          href="https://careersenseai.com/dashboard?tab=My%20Profile"
          target="_blank"
          rel="noreferrer"
          className="
            flex
            h-[42px]
            items-center
            gap-2
            rounded-[9px]
            bg-[#083B5B]
            px-5
            text-[9px]
            font-black
            text-white
          "
        >
          Edit Profile

          <ArrowRight size={13} />
        </a>
      </div>
    </Panel>
  );
}


/* =========================================================
   MOBILE DRAWER
   ========================================================= */

function MobileDrawer({
  open,
  onClose,
  activeSection,
  onSelectSection,
}) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            lg:hidden
          "
        >
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="
              absolute
              inset-0
              bg-[#062F49]/55
              backdrop-blur-sm
            "
          />

          <motion.aside
            initial={{
              x: "-100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "-100%",
            }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 240,
            }}
            className="
              relative
              z-10
              flex
              h-full
              w-[285px]
              flex-col
              bg-[#062F49]
              p-5
              text-white
              shadow-2xl
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <p
                className="
                  font-serif
                  text-[20px]
                  font-semibold
                "
              >
                CareerSense
              </p>

              <button
                type="button"
                onClick={onClose}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/15
                "
              >
                <X size={16} />
              </button>
            </div>


            <nav
              className="
                mt-8
                space-y-2
              "
            >
              {SECTION_ITEMS.map(
                ({
                  id,
                  label,
                  icon: Icon,
                }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      onSelectSection(
                        id
                      );

                      onClose();
                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-[11px]
                      px-4
                      py-3
                      text-[10px]
                      font-bold

                      ${
                        activeSection ===
                        id
                          ? "bg-[#D5B15B]/25 text-white"
                          : "text-[#C5D5DE]"
                      }
                    `}
                  >
                    <Icon size={17} />

                    {label}
                  </button>
                )
              )}
            </nav>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}


/* =========================================================
   MAIN DASHBOARD
   ========================================================= */

const DASHBOARD_TYPE_STYLES = `
  .dashboard-type {
    --dashboard-text-caption: 0.75rem;
    --dashboard-text-secondary: 0.8125rem;
    --dashboard-text-body: 0.875rem;
    --dashboard-text-emphasis: 1rem;
    font-kerning: normal;
    font-feature-settings: "kern" 1, "liga" 1;
  }

  .dashboard-type [class~="text-[7px]"],
  .dashboard-type [class~="text-[7.5px]"],
  .dashboard-type [class~="text-[8px]"] {
    font-size: var(--dashboard-text-caption) !important;
    line-height: 1.4;
  }

  .dashboard-type [class~="text-[8.5px]"],
  .dashboard-type [class~="text-[9px]"],
  .dashboard-type [class~="text-[9.5px]"] {
    font-size: var(--dashboard-text-secondary) !important;
    line-height: 1.45;
  }

  .dashboard-type [class~="text-[10px]"],
  .dashboard-type [class~="text-[10.5px]"],
  .dashboard-type [class~="text-[11px]"] {
    font-size: var(--dashboard-text-body) !important;
    line-height: 1.5;
  }

  .dashboard-type [class~="text-[12px]"],
  .dashboard-type [class~="text-[13px]"],
  .dashboard-type [class~="text-[14px]"] {
    font-size: var(--dashboard-text-emphasis) !important;
    line-height: 1.5;
  }

  .dashboard-type table,
  .dashboard-type [data-dashboard-number] {
    font-variant-numeric: tabular-nums;
  }
`;

function Dashboard() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const { user } =
    useUser();

  const [
    reports,
    setReports,
  ] = useState(() => getCachedItems(REPORTS_CACHE_KEY));

  const [
    resumes,
    setResumes,
  ] = useState(() => getCachedItems(RESUMES_CACHE_KEY));

  const [
    jobDescriptions,
    setJobDescriptions,
  ] = useState(() => getCachedItems(JD_CACHE_KEY));

  const [
    status,
    setStatus,
  ] = useState(() => {
    const cachedR = getCachedItems(REPORTS_CACHE_KEY);
    const cachedRes = getCachedItems(RESUMES_CACHE_KEY);
    return cachedR.length > 0 || cachedRes.length > 0 ? "success" : "loading";
  });

  const [
    error,
    setError,
  ] = useState("");

  const [
    toast,
    setToast,
  ] = useState("");

  const [
    toastVariant,
    setToastVariant,
  ] = useState(
    "success"
  );


  const [
    profile,
    setProfile,
  ] = useState(() =>
    readStoredProfile()
  );


  const [
    isUploadingResume,
    setIsUploadingResume,
  ] = useState(false);


  const [
    isUploadingJd,
    setIsUploadingJd,
  ] = useState(false);


  const [
    subData,
    setSubData,
  ] = useState({
    plan: "free",
    tokensRemaining: 30000,
  });


  const [
    serverLedgerLogs,
    setServerLedgerLogs,
  ] = useState([]);


  const [
    mobileNavOpen,
    setMobileNavOpen,
  ] = useState(false);

  const [
    dashboardTourOpen,
    setDashboardTourOpen,
  ] = useState(false);


  const resumeInputRef =
    useRef(null);

  const jdInputRef =
    useRef(null);


  const activeSection =
    searchParams.get(
      "section"
    ) || "overview";


  /* =======================================================
     SUBSCRIPTION
     ======================================================= */

  useEffect(() => {
    if (!user?.id) return;

    async function fetchSubscription() {
      try {
        const apiBase =
          import.meta.env
            .VITE_API_URL ||
          import.meta.env
            .VITE_BACKEND_URL ||
          import.meta.env
            .VITE_API_BASE_URL ||
          "https://server.datasenseai.com";


        const backendUrl =
          apiBase.replace(
            /\/careersense\/ats\/?$/,
            ""
          );


        const statusResponse =
          await fetch(
            `${backendUrl}/careersense/subscription/status?clerkId=${user.id}`
          );


        const statusData =
          await statusResponse.json();


        if (
          statusData.success
        ) {
          setSubData({
            plan:
              statusData.plan ||
              "free",

            tokensRemaining:
              statusData.tokensRemaining ?? 30000,
          });
        }


        const ledgerResponse =
          await fetch(
            `${backendUrl}/careersense/subscription/ledger?clerkId=${user.id}`
          );


        if (
          ledgerResponse.ok
        ) {
          const ledgerData =
            await ledgerResponse.json();


          if (
            Array.isArray(
              ledgerData.ledger
            )
          ) {
            setServerLedgerLogs(
              ledgerData.ledger
            );
          }
        }
      } catch (err) {
        console.error(
          "Subscription load failed:",
          err
        );
      }
    }

    fetchSubscription();
  }, [user?.id]);


  /* =======================================================
     WORKSPACE
     ======================================================= */

  const loadWorkspace =
    async (isBackground = false) => {
      if (!isBackground && reports.length === 0 && resumes.length === 0) {
        setStatus("loading");
      }

      setError("");

      try {
        const [
          resumeResult,
          reportResult,
          jdResult,
        ] =
          await Promise.allSettled([
            withTimeout(
              getResumes()
            ),

            withTimeout(
              getSavedReports()
            ),

            withTimeout(
              getJobDescriptions()
            ),
          ]);

        if (
          resumeResult.status === "fulfilled" &&
          Array.isArray(resumeResult.value?.data)
        ) {
          setResumes(resumeResult.value.data);
          setCachedItems(RESUMES_CACHE_KEY, resumeResult.value.data);
        }

        if (
          reportResult.status === "fulfilled" &&
          Array.isArray(reportResult.value?.data)
        ) {
          setReports(reportResult.value.data);
          setCachedItems(REPORTS_CACHE_KEY, reportResult.value.data);
        }

        if (
          jdResult.status === "fulfilled" &&
          Array.isArray(jdResult.value?.data)
        ) {
          setJobDescriptions(jdResult.value.data);
          setCachedItems(JD_CACHE_KEY, jdResult.value.data);
        }

        setStatus("success");
      } catch (requestError) {
        console.warn("Workspace load warning:", requestError);
        if (reports.length === 0 && resumes.length === 0) {
          setError(
            requestError?.response?.data?.detail ||
              "Unable to load the CareerSense workspace."
          );
          setStatus("error");
        } else {
          setStatus("success");
        }
      }
    };


  /* =======================================================
     PROFILE
     ======================================================= */

  const loadMasterProfile =
    async () => {
      try {
        const apiBase =
          (
            import.meta.env
              .VITE_API_BASE_URL ||
            "http://localhost:4000/careersense/ats"
          ).replace(
            /\/careersense\/ats\/?$/,
            ""
          );


        const response =
          await apiClient.get(
            `${apiBase}/careersense/profile`
          );


        const data =
          response.data
            ?.profile ||
          response.data;


        if (!data) return;


        const mapped = {
          fullName:
            data.fullName ||
            data.name ||
            "",

          email:
            data.email ||
            "",

          phone:
            data.phone ||
            "",

          location:
            data.location ||
            "",

          linkedin:
            data.linkedinPortfolio ||
            data.linkedin ||
            "",

          currentTitle:
            data.currentJobTitle ||
            data.currentRole ||
            "",
        };


        setProfile(
          mapped
        );


        window.localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify(
            mapped
          )
        );
      } catch (err) {
        console.warn(
          "Profile load failed:",
          err
        );
      }
    };


  useEffect(() => {
    loadWorkspace(reports.length > 0 || resumes.length > 0);
    loadMasterProfile();
  }, [user?.id]);


  /* =======================================================
     LEDGER
     ======================================================= */

  const ledger =
    useMemo(() => {
      if (
        serverLedgerLogs.length
      ) {
        const filtered =
          serverLedgerLogs.filter(
            (log) =>
              log.amount < 0 &&
              (
                !log.serviceId ||
                log.serviceId
                  .toLowerCase()
                  .includes(
                    "ats"
                  ) ||
                log.serviceId ===
                  "career_tool"
              )
          );


        if (
          filtered.length
        ) {
          return filtered.map(
            (
              log,
              index
            ) => ({
              id:
                log._id ||
                `log-${index}`,

              operation:
                log.description
                  ?.includes(
                    "JD"
                  )
                  ? "ATS + JD Report"
                  : "ATS Report",

              resource:
                log.metadata
                  ?.resume_name ||
                log.metadata
                  ?.fileName ||
                reports[
                  index
                ]
                  ?.resume_file_name ||
                "Resume Analysis",

              timestamp:
                log.createdAt,

              units:
                Math.abs(
                  log.amount
                ),

              detail:
                log.description ||
                "CareerSense ATS analysis",
            })
          );
        }
      }


      const reportRows =
        reports.map(
          (report) => ({
            id:
              `report-${report.report_id}`,

            operation:
              report.has_job_description
                ? "ATS + JD Report"
                : "ATS Report",

            resource:
              report.candidate_name ||
              report.resume_file_name,

            timestamp:
              report.created_at,

            units:
              getActualReportTokens(
                report
              ),

            detail:
              "CareerSense ATS report",
          })
        );


      const resumeRows =
        resumes.map(
          (resume) => ({
            id:
              `resume-${resume.resume_id}`,

            operation:
              "Resume Upload",

            resource:
              resume.file_name,

            timestamp:
              resume.updated_at,

            units:
              estimateResumePoints(),

            detail:
              "Stored resume",
          })
        );


      const jdRows =
        jobDescriptions.map(
          (jd) => ({
            id:
              `jd-${jd.job_description_id}`,

            operation:
              "Job Description Upload",

            resource:
              jd.title ||
              "Untitled job description",

            timestamp:
              jd.created_at,

            units:
              estimateJdPoints(),

            detail:
              "Stored job description",
          })
        );


      return [
        ...reportRows,
        ...resumeRows,
        ...jdRows,
      ].sort(
        (a, b) =>
          new Date(
            b.timestamp
          ) -
          new Date(
            a.timestamp
          )
      );
    }, [
      serverLedgerLogs,
      reports,
      resumes,
      jobDescriptions,
    ]);


  const totalPoints =
    useMemo(
      () =>
        ledger.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.units ||
                0
            ),
          0
        ),
      [ledger]
    );


  const estimatedCost =
    totalPoints /
    POINTS_PER_USD;


  /* =======================================================
     HANDLERS
     ======================================================= */

  const handleSectionChange =
    (section) => {
      setSearchParams({
        section,
      });
    };


  const pushToast = (
    message,
    variant = "success"
  ) => {
    setToast(
      message
    );

    setToastVariant(
      variant
    );
  };


  const handleResumeUpload =
    async (file) => {
      if (!file) return;


      const formData =
        new FormData();


      formData.append(
        "file",
        file
      );


      setIsUploadingResume(
        true
      );


      try {
        await uploadResume(
          formData
        );


        pushToast(
          "Resume uploaded successfully."
        );


        await loadWorkspace();
      } catch (err) {
        pushToast(
          err?.response
            ?.data
            ?.detail ||
            "Resume upload failed.",
          "error"
        );
      } finally {
        setIsUploadingResume(
          false
        );


        if (
          resumeInputRef.current
        ) {
          resumeInputRef.current.value =
            "";
        }
      }
    };


  const handleJdUpload =
    async (file) => {
      if (!file) return;


      const formData =
        new FormData();


      formData.append(
        "file",
        file
      );


      setIsUploadingJd(
        true
      );


      try {
        await uploadJobDescriptionFile(
          formData
        );


        pushToast(
          "Job description uploaded successfully."
        );


        await loadWorkspace();
      } catch (err) {
        pushToast(
          err?.response
            ?.data
            ?.detail ||
            "Job description upload failed.",
          "error"
        );
      } finally {
        setIsUploadingJd(
          false
        );


        if (
          jdInputRef.current
        ) {
          jdInputRef.current.value =
            "";
        }
      }
    };


  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div
      className="
        brand-type
        flex
        h-screen
        flex-col
        overflow-hidden
        bg-[#F7F2E9]
      "
    >
      <style>{DASHBOARD_TYPE_STYLES}</style>

      {/* HIDDEN INPUTS */}

      <input
        ref={
          resumeInputRef
        }
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(
          event
        ) =>
          handleResumeUpload(
            event.target
              .files?.[0] ||
              null
          )
        }
      />


      <input
        ref={
          jdInputRef
        }
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md"
        className="hidden"
        onChange={(
          event
        ) =>
          handleJdUpload(
            event.target
              .files?.[0] ||
              null
          )
        }
      />


      {/* MOBILE NAV */}

      <MobileDrawer
        open={
          mobileNavOpen
        }
        onClose={() =>
          setMobileNavOpen(
            false
          )
        }
        activeSection={
          activeSection
        }
        onSelectSection={
          handleSectionChange
        }
      />


      {/* NAVBAR */}

      <DashboardNavbar
        profile={
          profile
        }
        tokensRemaining={
          subData
            .tokensRemaining
        }
        estimatedCost={
          estimatedCost
        }
        onMobileMenu={() =>
          setMobileNavOpen(
            true
          )
        }
        onHelp={() => {
          handleSectionChange("overview");
          setDashboardTourOpen(true);
        }}
      />

      <DashboardTour
        open={dashboardTourOpen}
        onClose={() => setDashboardTourOpen(false)}
      />


      {/* BODY */}

      <div
        className="
          flex
          min-h-0
          flex-1
        "
      >
        <DashboardSidebar
          activeSection={
            activeSection
          }
          onSelectSection={
            handleSectionChange
          }
          profile={
            profile
          }
          user={
            user
          }
          subData={
            subData
          }
        />


        {/* =================================================
            MAIN WORKSPACE
           ================================================= */}

        <main
          className="
            dashboard-type
            relative
            min-w-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            bg-[#F7F1E7]
          "
        >
          {/* FULL BACKGROUND IMAGE */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-0
              bg-cover
              bg-top
              bg-no-repeat
            "
            style={{
              backgroundImage:
                `url(${dashboardBackground})`,

              backgroundPosition:
                "center top",
            }}
          />


          {/* IVORY FILTER */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-[1]
              bg-[linear-gradient(90deg,rgba(250,247,240,0.90)_0%,rgba(250,247,240,0.81)_39%,rgba(250,247,240,0.65)_72%,rgba(250,247,240,0.52)_100%)]
            "
          />


          {/* TOP LIGHT */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-0
              top-0
              z-[2]
              h-[370px]
              w-[70%]
              bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.72),transparent_67%)]
            "
          />


          {/* LOWER FADE */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              z-[2]
              h-[300px]
              w-full
              bg-[linear-gradient(to_bottom,transparent,rgba(248,243,234,0.34))]
            "
          />


          {/* ACTUAL CONTENT */}

          <div
            className="
              relative
              z-10
              mx-auto
              w-full
              max-w-[1540px]
              px-5
              py-5
              xl:px-7
              xl:py-6
            "
          >
            {status ===
              "loading" && (
              <div className="flex min-h-[360px] w-full items-center justify-center">
                <Loader />
              </div>
            )}


            {error && (
              <Toast
                message={
                  error
                }
                variant="error"
              />
            )}


            {toast && (
              <Toast
                message={
                  toast
                }
                variant={
                  toastVariant
                }
              />
            )}


            {status ===
              "success" && (
              <>
                {activeSection ===
                  "overview" && (
                  <OverviewSection
                    profile={
                      profile
                    }
                    reports={
                      reports
                    }
                    resumes={
                      resumes
                    }
                    jobDescriptions={
                      jobDescriptions
                    }
                    totalPoints={
                      totalPoints
                    }
                    subData={
                      subData
                    }
                    onUploadResume={() =>
                      resumeInputRef.current?.click()
                    }
                    onSelectSection={
                      handleSectionChange
                    }
                  />
                )}


                {activeSection ===
                  "reports" && (
                  <ReportsSection
                    reports={
                      reports
                    }
                  />
                )}


                {activeSection ===
                  "sources" && (
                  <DataSourcesSection
                    resumes={
                      resumes
                    }
                    jobDescriptions={
                      jobDescriptions
                    }
                    onUploadResumeClick={() =>
                      resumeInputRef.current?.click()
                    }
                    onUploadJdClick={() =>
                      jdInputRef.current?.click()
                    }
                    isUploadingResume={
                      isUploadingResume
                    }
                    isUploadingJd={
                      isUploadingJd
                    }
                  />
                )}


                {activeSection ===
                  "billing" && (
                  <BillingSection
                    totalPoints={
                      totalPoints
                    }
                    estimatedCost={
                      estimatedCost
                    }
                    ledger={
                      ledger
                    }
                    subData={
                      subData
                    }
                  />
                )}


                {activeSection ===
                  "profile" && (
                  <ProfileSection
                    profile={
                      profile
                    }
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


export default Dashboard;
