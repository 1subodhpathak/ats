import React from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileCheck2,
  Gauge,
  Lightbulb,
  Search,
  ScanText,
} from "lucide-react";

import breakdownBg from "../../assets/home/breakdown.png";

/* =========================================================
   DATA
========================================================= */

const reportItems = [
  {
    number: "01",
    title: "Overall Score",
    copy: "Your ATS readiness score and role fit analysis.",
    action: "Know where you stand",
    icon: Gauge,
    tone: "blue",
  },
  {
    number: "02",
    title: "Job Match Analysis",
    copy: "See how well your resume aligns with the target job description.",
    action: "Find the gaps",
    icon: FileCheck2,
    tone: "green",
  },
  {
    number: "03",
    title: "Keyword Coverage",
    copy: "Find missing and weak keywords with smart suggestions.",
    action: "Add the right keywords",
    icon: Search,
    tone: "purple",
  },
  {
    number: "04",
    title: "Parsing & Structure",
    copy: "Identify formatting issues that may confuse ATS systems.",
    action: "Fix structure issues",
    icon: ScanText,
    tone: "red",
  },
  {
    number: "05",
    title: "Actionable Recommendations",
    copy: "Get AI-powered rewrite suggestions and examples.",
    action: "Improve with confidence",
    icon: Lightbulb,
    tone: "gold",
  },
];

const toneStyles = {
  blue: {
    card: "border-[#D6E4F0]",
    number: "bg-[#EAF3FF] text-[#2367BE]",
    iconBg: "bg-[#E2F0FF]",
    icon: "text-[#1964D8]",
    pill: "bg-[#E9F3FF] text-[#1661C8]",
  },

  green: {
    card: "border-[#CEE5DC]",
    number: "bg-[#E3F6EF] text-[#128D71]",
    iconBg: "bg-[#DCF5EC]",
    icon: "text-[#0AA77A]",
    pill: "bg-[#E4F8F1] text-[#08966E]",
  },

  purple: {
    card: "border-[#DED8EE]",
    number: "bg-[#F0ECFF] text-[#6856CB]",
    iconBg: "bg-[#ECE7FF]",
    icon: "text-[#6752D8]",
    pill: "bg-[#F0EBFF] text-[#654BC8]",
  },

  red: {
    card: "border-[#F0D4D1]",
    number: "bg-[#FFF0EE] text-[#C84D47]",
    iconBg: "bg-[#FCE8E5]",
    icon: "text-[#C04B45]",
    pill: "bg-[#FDEAE7] text-[#B7443F]",
  },

  gold: {
    card: "border-[#ECD8A9]",
    number: "bg-[#FFF3D6] text-[#B67910]",
    iconBg: "bg-[#FFF1CF]",
    icon: "text-[#D49213]",
    pill: "bg-[#FFF2D2] text-[#A86C08]",
  },
};

/* =========================================================
   REPORT CARD
========================================================= */

function ReportCard({
  number,
  title,
  copy,
  action,
  icon: Icon,
  tone,
}) {
  const styles = toneStyles[tone];

  return (
    <article
      className={`
        group
        relative
        flex
        min-h-[210px]
        flex-col
        rounded-[20px]
        border
        bg-white/72
        p-4
        shadow-[0_9px_28px_rgba(28,44,58,0.045)]
        backdrop-blur-[5px]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-white/82
        hover:shadow-[0_16px_38px_rgba(28,44,58,0.075)]
        lg:min-h-[218px]
        xl:min-h-[225px]
        ${styles.card}
      `}
    >
      {/* step number */}
      <div
        className={`
          flex
          h-[27px]
          w-[27px]
          items-center
          justify-center
          rounded-full
          text-[10px]
          font-black
          ${styles.number}
        `}
      >
        {number}
      </div>

      {/* icon */}
      <div
        className={`
          mt-2
          flex
          h-[46px]
          w-[46px]
          items-center
          justify-center
          rounded-[15px]
          ${styles.iconBg}
          ${styles.icon}
        `}
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={2.15} />
      </div>

      {/* title */}
      <h3
        className="
          mt-3
          text-[13.5px]
          font-black
          leading-[1.12]
          tracking-[-0.02em]
          text-[#0E3151]
        "
      >
        {title}
      </h3>

      {/* copy */}
      <p
        className="
          mt-2
          text-[10px]
          font-medium
          leading-[1.45]
          text-[#627E91]
        "
      >
        {copy}
      </p>

      {/* action pill */}
      <div className="mt-auto pt-3">
        <span
          className={`
            inline-flex
            rounded-full
            px-3
            py-[6px]
            text-[8px]
            font-extrabold
            leading-none
            ${styles.pill}
          `}
        >
          {action}
        </span>
      </div>
    </article>
  );
}

/* =========================================================
   MAIN SECTION
========================================================= */

function ReportBreakdownSection() {
  return (
    <section
      aria-labelledby="report-breakdown-heading"
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-[#E8E0D5]
      "
      style={{
        backgroundImage: `url(${breakdownBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* soft readability overlay */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(90deg,rgba(255,252,246,0.13),rgba(255,255,255,0.02),rgba(255,252,246,0.09))]
        "
      />

      {/* =====================================================
          TOP RIGHT HANDWRITTEN NOTE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[3.8%]
          top-[22px]
          z-[2]
          hidden
          rotate-[-5deg]
          text-right
          font-serif
          text-[12px]
          italic
          leading-[1.25]
          text-[#53758B]
          opacity-80
          xl:block
        "
      >
        A clearer resume.
        <br />
        a brighter future.

        <svg
          width="50"
          height="45"
          viewBox="0 0 50 45"
          fill="none"
          className="ml-auto mt-1"
        >
          <path
            d="M11 3C30 8 39 21 38 35"
            stroke="#57798D"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M32 30L38 36L44 29"
            stroke="#57798D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
          max-w-[1560px]
          px-6
          py-8
          sm:px-8
          lg:px-12
          lg:py-8
          xl:px-16
          xl:py-9
        "
      >
        <div
          className="
            grid
            gap-7
            lg:grid-cols-[320px_minmax(0,1fr)]
            lg:items-center
            xl:grid-cols-[335px_minmax(0,1fr)]
            xl:gap-8
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="relative">
            {/* eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#C88A22]" />

              <p
                className="
                  text-[8.5px]
                  font-black
                  uppercase
                  tracking-[0.28em]
                  text-[#B4761D]
                "
              >
                Your ATS Report Breakdown
              </p>
            </div>

            {/* heading */}
            <h2
              id="report-breakdown-heading"
              className="
                mt-4
                max-w-[335px]
                text-[35px]
                font-semibold
                leading-[0.98]
                tracking-[-0.055em]
                text-[#0D3152]
                sm:text-[38px]
                lg:text-[38px]
                xl:text-[40px]
              "
            >
              More than a score.
              <br />
              A complete{" "}
              <span className="text-[#C88A22]">
                roadmap.
              </span>
            </h2>

            {/* supporting text */}
            <p
              className="
                mt-4
                max-w-[325px]
                text-[11.5px]
                font-medium
                leading-[1.5]
                text-[#617C8F]
              "
            >
              Get a detailed analysis of your resume with actionable
              insights to improve your chances.
            </p>

            {/* CTA */}
            <a
              href="/ATS%20Resume%20Checker.pdf"
              target="_blank"
              rel="noreferrer"
              className="
                group
                mt-5
                inline-flex
                h-[46px]
                min-w-[218px]
                items-center
                justify-between
                gap-6
                rounded-[9px]
                bg-[#073F60]
                px-5
                text-[10.5px]
                font-extrabold
                text-white
                shadow-[0_9px_20px_rgba(7,63,96,0.15)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#052F49]
                hover:shadow-[0_13px_28px_rgba(7,63,96,0.19)]
              "
            >
              <span>View Sample Report</span>

              <ArrowRight
                className="
                  h-4
                  w-4
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </a>

            {/* trust row */}
            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2
              "
            >
              {[
                "No sign up required",
                "Instant preview",
                "Real ATS analysis",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[8px]
                    font-bold
                    text-[#294B64]
                  "
                >
                  <span
                    className="
                      flex
                      h-[13px]
                      w-[13px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#C98A1C]
                      text-white
                    "
                  >
                    <Check className="h-[7px] w-[7px]" strokeWidth={3} />
                  </span>

                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              RIGHT ROADMAP
          ================================================= */}

          <div className="relative">
            {/* connecting roadmap path */}
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 140"
              preserveAspectRatio="none"
              className="
                pointer-events-none
                absolute
                left-0
                top-[45%]
                z-0
                hidden
                h-[110px]
                w-full
                -translate-y-1/2
                xl:block
              "
            >
              <path
                d="
                  M0 72
                  C65 20 125 20 195 72
                  S325 125 395 72
                  S525 20 595 72
                  S725 125 795 72
                  S920 20 1000 72
                "
                fill="none"
                stroke="#AEC1CA"
                strokeWidth="1.35"
                strokeDasharray="4 7"
                opacity="0.62"
              />
            </svg>

            {/* report cards */}
            <div
              className="
                relative
                z-10
                grid
                gap-3.5
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-5
              "
            >
              {reportItems.map((item) => (
                <ReportCard key={item.title} {...item} />
              ))}
            </div>

            {/* =================================================
                BOTTOM RIGHT INSIGHT CARD
            ================================================= */}

            <div className="mt-4 flex justify-end">
              <div
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-[15px]
                  border
                  border-white/70
                  bg-white/62
                  px-4
                  py-2.5
                  shadow-[0_9px_26px_rgba(30,45,57,0.045)]
                  backdrop-blur-[7px]
                "
              >
                <div
                  className="
                    flex
                    h-[38px]
                    w-[38px]
                    items-center
                    justify-center
                    rounded-[11px]
                    bg-[#FFF1D1]
                    text-[#CB8612]
                  "
                >
                  <BarChart3
                    className="h-[19px] w-[19px]"
                    strokeWidth={2.2}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-extrabold
                      text-[#153955]
                    "
                  >
                    Data-driven insights.
                  </p>

                  <p
                    className="
                      mt-[2px]
                      text-[8px]
                      font-medium
                      text-[#6A8294]
                    "
                  >
                    Real improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM LEFT HANDWRITTEN NOTE
        ====================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[15px]
            left-[72px]
            hidden
            rotate-[-6deg]
            font-serif
            text-[11px]
            italic
            leading-[1.15]
            text-[#54758A]
            opacity-75
            2xl:block
          "
        >
          Turn insights
          <br />
          into opportunities.

          <svg
            width="66"
            height="35"
            viewBox="0 0 66 35"
            fill="none"
            className="absolute left-[88px] top-[5px]"
          >
            <path
              d="M2 27C24 31 48 22 58 5"
              stroke="#56788B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M51 9L59 4L60 13"
              stroke="#56788B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default ReportBreakdownSection;