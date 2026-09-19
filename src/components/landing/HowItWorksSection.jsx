import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  Check,
  FileSearch,
  FileText,
  Search,
  Sparkles,
  Target,
} from "lucide-react";

import waysToStartBg from "../../assets/home/waystostart.png";

/* =========================================================
   DATA
========================================================= */

const modes = {
  mode_a: {
    number: "01",
    label: "QUICK ATS CHECK",
    shortTitle: "Resume Only",

    title: "50-Point Standalone Evaluation",

    description:
      "Get a complete ATS health check without a job description. CareerSense reviews structure, readability, keywords, impact, formatting, and recruiter readiness.",

    icon: FileText,

    badge: "FAST SCAN",

    route: "/check-ats/resume",

    cta: "Upload Resume",

    tone: "gold",

    highlights: [
      "No JD required",
      "50-point evaluation",
      "Instant roadmap",
    ],

    items: [
      {
        title: "Independent ATS Benchmark",
        copy:
          "Measure your resume against recruiter and ATS standards before applying.",
        icon: Target,
      },
      {
        title: "Actionable Fixes",
        copy:
          "See exactly what is weak, missing, unclear, or difficult for ATS systems to parse.",
        icon: Sparkles,
      },
    ],
  },

  mode_b: {
    number: "02",
    label: "DEEP MATCH ANALYSIS",
    shortTitle: "Resume + Job Description",

    title: "Job Description Match Analysis",

    description:
      "Add the target job description to measure how closely your resume matches the exact role, including keywords, skills, seniority, and recruiter expectations.",

    icon: FileSearch,

    badge: "BEST RESULT",

    route: "/check-ats/resume-jd",

    cta: "Check Resume + JD",

    tone: "blue",

    highlights: [
      "Keyword gap analysis",
      "Role alignment",
      "Job-specific tips",
    ],

    items: [
      {
        title: "Keyword Gap Analysis",
        copy:
          "Find important technologies, skills, and role language missing from your resume.",
        icon: Search,
      },
      {
        title: "Role-Specific Improvements",
        copy:
          "Get recommendations tailored to the exact job instead of generic resume advice.",
        icon: Sparkles,
      },
    ],
  },
};

/* =========================================================
   MODE CARD
========================================================= */

function ModeCard({
  id,
  mode,
  active,
  onSelect,
}) {
  const Icon = mode.icon;
  const isGold = mode.tone === "gold";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onSelect(id)}
      className={`
        group
        relative
        w-full
        overflow-hidden
        rounded-[22px]
        border
        px-5
        py-4
        text-left
        outline-none
        transition-all
        duration-300
        ease-out

        hover:-translate-y-[4px]

        focus:outline-none
        focus-visible:outline-none

        ${
          isGold
            ? active
              ? `
                  border-[#DEA32A]
                  bg-[#FFFDF8]/94
                  shadow-[0_16px_40px_rgba(157,106,15,.12)]

                  hover:border-[#C98A16]
                  hover:bg-[#FFFDF8]
                  hover:shadow-[0_24px_52px_rgba(157,106,15,.20)]
                `
              : `
                  border-[#E7CE96]
                  bg-[#FFFDF8]/80
                  shadow-[0_8px_24px_rgba(60,47,30,.045)]

                  hover:border-[#D59A26]
                  hover:bg-[#FFFDF8]/96
                  hover:shadow-[0_20px_44px_rgba(157,106,15,.13)]
                `
            : active
            ? `
                border-[#91C8DE]
                bg-[#F8FDFF]/94
                shadow-[0_16px_40px_rgba(34,101,132,.11)]

                hover:border-[#70B5D2]
                hover:bg-[#F8FDFF]
                hover:shadow-[0_24px_52px_rgba(34,101,132,.17)]
              `
            : `
                border-[#B7D9E9]
                bg-[#F8FDFF]/86
                shadow-[0_8px_24px_rgba(34,79,102,.045)]

                hover:border-[#8EC6DD]
                hover:bg-[#F8FDFF]/97
                hover:shadow-[0_20px_44px_rgba(34,101,132,.13)]
              `
        }
      `}
    >
      {/* hover highlight */}
      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          inset-0
          opacity-70
          transition-opacity
          duration-300

          group-hover:opacity-100

          ${
            isGold
              ? `
                  bg-[radial-gradient(circle_at_7%_10%,rgba(232,178,65,.14),transparent_45%)]
                `
              : `
                  bg-[radial-gradient(circle_at_7%_10%,rgba(91,166,202,.14),transparent_45%)]
                `
          }
        `}
      />

      {/* animated top accent */}
      <div
        aria-hidden="true"
        className={`
          absolute
          left-[24px]
          right-[24px]
          top-0
          h-[2px]
          origin-left
          scale-x-0
          rounded-full
          transition-transform
          duration-300

          group-hover:scale-x-100

          ${
            isGold
              ? "bg-[#D99A20]"
              : "bg-[#4C9FC4]"
          }
        `}
      />

      <div
        className="
          relative
          z-10
          grid
          items-center
          gap-4

          sm:grid-cols-[88px_minmax(0,1fr)]
        "
      >
        {/* number + icon */}
        <div>
          <div
            className={`
              flex
              h-[34px]
              w-[34px]
              items-center
              justify-center
              rounded-full
              text-[11px]
              font-black
              transition-transform
              duration-300

              group-hover:scale-105

              ${
                isGold
                  ? "bg-[#FFF2D4] text-[#9F6810]"
                  : "bg-[#E3F2F9] text-[#286785]"
              }
            `}
          >
            {mode.number}
          </div>

          <div
            className={`
              mt-2
              flex
              h-[52px]
              w-[52px]
              items-center
              justify-center
              rounded-[14px]
              transition-all
              duration-300

              group-hover:scale-[1.06]

              ${
                isGold
                  ? `
                      bg-[#FFF0C9]
                      text-[#8C5C09]
                      group-hover:bg-[#FFE8AC]
                    `
                  : `
                      bg-[#DDF0F8]
                      text-[#17597B]
                      group-hover:bg-[#CEEAF6]
                    `
              }
            `}
          >
            <Icon
              className="
                h-[24px]
                w-[24px]
                transition-transform
                duration-300

                group-hover:rotate-[-3deg]
              "
              strokeWidth={2}
            />
          </div>
        </div>

        {/* content */}
        <div className="min-w-0">
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
            "
          >
            <p
              className={`
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]

                ${
                  isGold
                    ? "text-[#B97813]"
                    : "text-[#34799B]"
                }
              `}
            >
              {mode.label}
            </p>

            <span
              className={`
                rounded-full
                px-3
                py-1.5
                text-[7px]
                font-black
                uppercase
                tracking-[0.10em]
                transition-transform
                duration-300

                group-hover:scale-105

                ${
                  isGold
                    ? "bg-[#FFF3D8] text-[#99650F]"
                    : "bg-[#E3F3FA] text-[#286D8C]"
                }
              `}
            >
              {mode.badge}
            </span>
          </div>

          <h3
            className="
              mt-2
              text-[19px]
              font-black
              leading-[1.12]
              tracking-[-0.03em]
              text-[#102F4C]
              transition-colors
              duration-300

              xl:text-[21px]
            "
          >
            {mode.shortTitle}
          </h3>

          <p
            className="
              mt-1.5
              max-w-[470px]
              text-[10px]
              font-medium
              leading-[1.45]
              text-[#688497]
            "
          >
            {isGold
              ? "Check your resume independently against ATS and recruiter standards."
              : "Compare your resume against a specific role for deeper insights and better alignment."}
          </p>

          {/* highlights */}
          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-x-5
              gap-y-2
            "
          >
            {mode.highlights.map((item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[8.5px]
                  font-bold
                  text-[#294F68]
                "
              >
                <span
                  className={`
                    flex
                    h-[17px]
                    w-[17px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-white
                    transition-transform
                    duration-300

                    group-hover:scale-110

                    ${
                      isGold
                        ? "bg-[#DE9E25]"
                        : "bg-[#2683AF]"
                    }
                  `}
                >
                  <Check
                    className="h-[9px] w-[9px]"
                    strokeWidth={3}
                  />
                </span>

                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  item,
  tone,
}) {
  const Icon = item.icon;
  const isGold = tone === "gold";

  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-[15px]
        border
        border-[#E7DED3]
        bg-white/78
        px-4
        py-3
        shadow-[0_7px_20px_rgba(40,46,50,.035)]
        backdrop-blur-[7px]
      "
    >
      <div
        className={`
          flex
          h-[44px]
          w-[44px]
          shrink-0
          items-center
          justify-center
          rounded-[12px]

          ${
            isGold
              ? "bg-[#FFF0CC] text-[#95610A]"
              : "bg-[#E2F1F7] text-[#286C88]"
          }
        `}
      >
        <Icon
          className="h-[20px] w-[20px]"
          strokeWidth={2}
        />
      </div>

      <div className="min-w-0">
        <h4
          className="
            text-[11px]
            font-black
            text-[#123653]
          "
        >
          {item.title}
        </h4>

        <p
          className="
            mt-1
            text-[8.5px]
            font-medium
            leading-[1.4]
            text-[#71899B]
          "
        >
          {item.copy}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN SECTION
========================================================= */

function HowItWorksSection() {
  const [
    activeTab,
    setActiveTab,
  ] = useState("mode_a");

  const mode =
    modes[activeTab];

  const isGold =
    mode.tone === "gold";

  return (
    <section
      id="how-it-works"
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-[#E8DED0]
        scroll-mt-20
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <img
        src={waysToStartBg}
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
        "
      />

      {/* very subtle overall wash */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[rgba(255,250,243,0.11)]
        "
      />

      {/* center readability glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[45%]
          h-[610px]
          w-[1120px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#FFF9F0]/30
          blur-[82px]
        "
      />

      {/* =====================================================
          EDITORIAL DETAILS
      ====================================================== */}

      {/* left handwritten note */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[16px]
          left-[4.5%]
          z-[2]
          hidden
          rotate-[-7deg]

          2xl:block
        "
      >
        <div
          className="
            font-serif
            text-[12px]
            italic
            leading-[1.13]
            text-[#52728B]/75
          "
        >
          Get your
          <br />
          ATS score now
        </div>

        <svg
          className="
            absolute
            -top-[42px]
            left-[16px]
          "
          width="46"
          height="42"
          viewBox="0 0 46 42"
          fill="none"
        >
          <path
            d="M5 38C7 20 16 10 35 6"
            stroke="#52728B"
            strokeWidth="1.3"
            strokeLinecap="round"
          />

          <path
            d="M29 3L36 6L32 13"
            stroke="#52728B"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* right handwritten note */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[14px]
          right-[5%]
          z-[2]
          hidden
          rotate-[-5deg]
          text-right

          2xl:block
        "
      >
        <p
          className="
            font-serif
            text-[11px]
            italic
            leading-[1.18]
            text-[#52728B]/68
          "
        >
          Better resumes.
          <br />
          Brighter opportunities.
        </p>

        <span
          className="
            ml-auto
            mt-2
            block
            h-px
            w-[66px]
            bg-[#CE8E1C]/75
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          landing-container
          relative
          z-10
          mx-auto
          w-full
          max-w-[1420px]
          px-6
          py-9

          sm:px-8

          lg:px-12
          lg:py-10

          xl:px-14
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mx-auto
            max-w-[760px]
            text-center
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span
              className="
                h-px
                w-8
                bg-[#C88717]
              "
            />

            <p
              className="
                text-[8.5px]
                font-black
                uppercase
                tracking-[0.27em]
                text-[#A96D10]
              "
            >
              Two Ways To Check Your ATS Score
            </p>

            <span
              className="
                h-px
                w-8
                bg-[#C88717]
              "
            />
          </div>

          <h2
            className="
              mt-3
              text-[33px]
              font-semibold
              leading-[1.02]
              tracking-[-0.052em]
              text-[#10335A]

              sm:text-[38px]

              lg:text-[41px]
            "
          >
            Choose how you want
            <br />
            to{" "}
            <span className="text-[#C98A1C]">
              check your resume.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-[650px]
              text-[11px]
              font-medium
              leading-[1.5]
              text-[#5E7B91]
            "
          >
            Run a quick standalone ATS audit, or add the job description
            for deeper role-specific matching.
          </p>
        </div>

        {/* =================================================
            MODE CARDS
        ================================================= */}

        <div
          className="
            mx-auto
            mt-[30px]
            grid
            max-w-[1120px]
            gap-4

            md:grid-cols-2
          "
          role="tablist"
          aria-label="ATS checking modes"
        >
          {Object.entries(
            modes
          ).map(
            ([
              id,
              currentMode,
            ]) => (
              <ModeCard
                key={id}
                id={id}
                mode={
                  currentMode
                }
                active={
                  activeTab ===
                  id
                }
                onSelect={
                  setActiveTab
                }
              />
            )
          )}
        </div>

        {/* =================================================
            ACTIVE MODE DETAILS
        ================================================= */}

        <div
          className="
            relative
            mx-auto
            mt-3
            max-w-[1100px]
            overflow-hidden
            rounded-[23px]
            border
            border-white/80
            bg-white/90
            shadow-[0_18px_45px_rgba(41,48,52,.075)]
            backdrop-blur-[10px]
          "
        >
          {/* mode glow */}
          <div
            aria-hidden="true"
            className={`
              pointer-events-none
              absolute
              inset-0

              ${
                isGold
                  ? `
                      bg-[radial-gradient(circle_at_0%_0%,rgba(225,170,50,.07),transparent_44%)]
                    `
                  : `
                      bg-[radial-gradient(circle_at_0%_0%,rgba(87,158,191,.08),transparent_44%)]
                    `
              }
            `}
          />

          <div
            className="
              relative
              z-10
              grid
              gap-5
              px-6
              py-[18px]

              lg:grid-cols-[1.12fr_.88fr]

              xl:px-7
            "
          >
            {/* =============================================
                LEFT DETAILS
            ============================================= */}

            <div
              className="
                flex
                flex-col
                justify-center
              "
            >
              <p
                className={`
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  ${
                    isGold
                      ? "text-[#B47410]"
                      : "text-[#467991]"
                  }
                `}
              >
                {activeTab ===
                "mode_a"
                  ? "Mode A Details"
                  : "Mode B Details"}
              </p>

              <h3
                className="
                  mt-1.5
                  text-[23px]
                  font-black
                  leading-[1.12]
                  tracking-[-0.04em]
                  text-[#12345A]

                  lg:text-[25px]
                "
              >
                {mode.title}
              </h3>

              <p
                className="
                  mt-2
                  max-w-[590px]
                  text-[10px]
                  font-medium
                  leading-[1.5]
                  text-[#668397]
                "
              >
                {mode.description}
              </p>

              {/* CTA */}
              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-4
                "
              >
                <Link
                  to={mode.route}
                  className="
                    group
                    inline-flex
                    h-[46px]
                    min-w-[270px]
                    items-center
                    justify-between
                    gap-5
                    rounded-[11px]
                    bg-[#123675]
                    px-5
                    text-[11px]
                    font-black
                    text-white
                    shadow-[0_12px_24px_rgba(16,46,101,.19)]
                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:bg-[#0B295C]
                    hover:shadow-[0_16px_32px_rgba(16,46,101,.24)]
                  "
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <FileText
                      className="
                        h-[16px]
                        w-[16px]
                      "
                    />

                    {mode.cta}
                  </span>

                  <span
                    className="
                      flex
                      h-[29px]
                      w-[29px]
                      items-center
                      justify-center
                      rounded-full
                      bg-white/10
                    "
                  >
                    <ArrowRight
                      className="
                        h-[14px]
                        w-[14px]
                        transition-transform
                        duration-300

                        group-hover:translate-x-0.5
                      "
                    />
                  </span>
                </Link>

                <p
                  className="
                    text-[8.5px]
                    font-medium
                    text-[#72899A]
                  "
                >
                  Takes less than a minute to start.
                </p>
              </div>
            </div>

            {/* =============================================
                RIGHT FEATURE CARDS
            ============================================= */}

            <div
              className="
                grid
                content-center
                gap-3
              "
            >
              {mode.items.map(
                (item) => (
                  <DetailItem
                    key={
                      item.title
                    }
                    item={
                      item
                    }
                    tone={
                      mode.tone
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;