import React from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileText,
  Search,
  TrendingUp,
  X,
} from "lucide-react";

import problemBg from "../../assets/home/problem.png";

/* =========================================================
   DATA
========================================================= */

const problemSignals = [
  {
    label: "Missing keywords",
    icon: Search,
  },
  {
    label: "Weak impact",
    icon: BarChart3,
  },
  {
    label: "Hard to scan",
    icon: FileText,
  },
];

const beforePoints = [
  "Managed team and improved process",
  "Worked on data analysis and reporting",
  "Responsible for client communication",
];

const afterPoints = [
  <>
    Led a <strong>12-member team</strong>, improving process efficiency by{" "}
    <strong>31%</strong>
  </>,
  <>
    Used <strong>SQL and Tableau</strong> to drive data-backed decisions
  </>,
  <>
    Strengthened client relationships, increasing retention by{" "}
    <strong>29%</strong>
  </>,
];

const beforeIssues = ["Missing keywords", "No measurable impact"];

const afterWins = ["Relevant skills", "Measurable impact", "ATS-ready"];

/* =========================================================
   SCORE RING
========================================================= */

function ScoreRing({ value, type = "good" }) {
  const isGood = type === "good";

  return (
    <div
      className="
        relative
        flex
        h-[62px]
        w-[62px]
        shrink-0
        items-center
        justify-center
        rounded-full
      "
      style={{
        background: isGood
          ? `conic-gradient(
              #23B47E 0deg,
              #23B47E ${value * 3.6}deg,
              #E5EEE9 ${value * 3.6}deg,
              #E5EEE9 360deg
            )`
          : `conic-gradient(
              #F05D62 0deg,
              #F05D62 ${value * 3.6}deg,
              #E8ECEF ${value * 3.6}deg,
              #E8ECEF 360deg
            )`,
      }}
    >
      <div
        className="
          flex
          h-[46px]
          w-[46px]
          items-center
          justify-center
          rounded-full
          bg-white
        "
      >
        <span
          className="
            text-[15px]
            font-black
            tracking-[-0.04em]
            text-[#0F3556]
          "
        >
          {value}%
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   BEFORE CARD
========================================================= */

function BeforeCard() {
  return (
    <article
      className="
        group
        relative
        flex
        min-h-[310px]
        flex-col
        overflow-hidden
        rounded-[22px]
        border
        border-[#F1D5D2]
        bg-white/80
        p-5
        shadow-[0_14px_45px_rgba(31,47,61,0.065)]
        backdrop-blur-[7px]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_55px_rgba(31,47,61,0.09)]
      "
    >
      {/* soft red wash */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_12%_15%,rgba(246,95,95,0.055),transparent_42%)]
        "
      />

      {/* header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span
          className="
            rounded-[9px]
            border
            border-[#F8DDDA]
            bg-[#FFF3F1]
            px-4
            py-2
            text-[11px]
            font-extrabold
            text-[#EF4F56]
          "
        >
          Before
        </span>

        <ScoreRing value={48} type="bad" />
      </div>

      {/* role */}
      <div className="relative z-10 mt-5">
        <h3
          className="
            text-[16px]
            font-extrabold
            tracking-[-0.025em]
            text-[#0D3152]
          "
        >
          Operations Manager
        </h3>

        <p
          className="
            mt-0.5
            text-[11px]
            font-medium
            text-[#6D879B]
          "
        >
          XYZ Corporation | 2020 – 2023
        </p>
      </div>

      {/* separator */}
      <div className="relative z-10 my-3.5 h-px bg-[#E9E5E0]" />

      {/* bullets */}
      <ul className="relative z-10 space-y-3">
        {beforePoints.map((point) => (
          <li
            key={point}
            className="
              flex
              gap-3
              text-[12px]
              font-medium
              leading-[1.42]
              text-[#284B66]
            "
          >
            <span
              className="
                mt-[7px]
                h-[4px]
                w-[4px]
                shrink-0
                rounded-full
                bg-[#173A5C]
              "
            />

            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* issue tags */}
      <div className="relative z-10 mt-auto pt-4">
        <div className="flex flex-wrap gap-2">
          {beforeIssues.map((issue) => (
            <span
              key={issue}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#FFF0EF]
                px-3
                py-1.5
                text-[9px]
                font-bold
                text-[#E64D52]
              "
            >
              <span
                className="
                  flex
                  h-[17px]
                  w-[17px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F45A60]
                  text-white
                "
              >
                <X size={9} strokeWidth={3} />
              </span>

              {issue}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   AFTER CARD
========================================================= */

function AfterCard() {
  return (
    <article
      className="
        group
        relative
        flex
        min-h-[310px]
        flex-col
        overflow-visible
        rounded-[22px]
        border
        border-[#C8E2D9]
        bg-white/80
        p-5
        shadow-[0_14px_45px_rgba(31,47,61,0.065)]
        backdrop-blur-[7px]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_55px_rgba(31,47,61,0.09)]
      "
    >
      {/* soft green wash */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
          rounded-[22px]
          bg-[radial-gradient(circle_at_83%_12%,rgba(35,180,126,0.075),transparent_45%)]
        "
      />

      {/* comparison arrow */}
      <div
        aria-hidden="true"
        className="
          absolute
          -left-[24px]
          top-1/2
          z-30
          hidden
          h-[48px]
          w-[48px]
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-[#DFE3E4]
          bg-[#FFFEFB]
          text-[#0F3556]
          shadow-[0_8px_26px_rgba(15,53,86,0.10)]
          md:flex
        "
      >
        <ArrowRight size={21} strokeWidth={2.2} />
      </div>

      {/* header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span
          className="
            rounded-[9px]
            border
            border-[#D9EFE7]
            bg-[#EDF8F3]
            px-4
            py-2
            text-[11px]
            font-extrabold
            text-[#087D68]
          "
        >
          With CareerSense
        </span>

        <ScoreRing value={92} type="good" />
      </div>

      {/* role */}
      <div className="relative z-10 mt-5">
        <h3
          className="
            text-[16px]
            font-extrabold
            tracking-[-0.025em]
            text-[#0D3152]
          "
        >
          Operations Manager
        </h3>

        <p
          className="
            mt-0.5
            text-[11px]
            font-medium
            text-[#6D879B]
          "
        >
          XYZ Corporation | 2020 – 2023
        </p>
      </div>

      {/* separator */}
      <div className="relative z-10 my-3.5 h-px bg-[#DDE8E4]" />

      {/* bullets */}
      <ul className="relative z-10 space-y-3">
        {afterPoints.map((point, index) => (
          <li
            key={index}
            className="
              flex
              gap-3
              text-[12px]
              font-medium
              leading-[1.42]
              text-[#234861]
              [&_strong]:font-extrabold
              [&_strong]:text-[#087D68]
            "
          >
            <span
              className="
                mt-[7px]
                h-[4px]
                w-[4px]
                shrink-0
                rounded-full
                bg-[#173A5C]
              "
            />

            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* win tags */}
      <div className="relative z-10 mt-auto pt-4">
        <div className="flex flex-wrap gap-2">
          {afterWins.map((win) => (
            <span
              key={win}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#ECF8F3]
                px-3
                py-1.5
                text-[9px]
                font-bold
                text-[#087D68]
              "
            >
              <span
                className="
                  flex
                  h-[17px]
                  w-[17px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#078C76]
                  text-white
                "
              >
                <Check size={9} strokeWidth={3} />
              </span>

              {win}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MAIN SECTION
========================================================= */

function WhyCareerSenseSection() {
  return (
    <section
      id="why-careersense"
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-[#E8E0D5]
        scroll-mt-20
      "
      style={{
        backgroundImage: `url(${problemBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* =====================================================
          BACKGROUND READABILITY
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(90deg,rgba(255,252,246,0.38)_0%,rgba(255,252,246,0.10)_48%,rgba(255,255,255,0.04)_100%)]
        "
      />

      {/* subtle center warmth */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[40%]
          top-1/2
          h-[430px]
          w-[760px]
          -translate-y-1/2
          rounded-full
          bg-[#FFF7E7]/20
          blur-[80px]
        "
      />

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
          py-9
          sm:px-8
          sm:py-10
          lg:px-12
          lg:py-10
          xl:px-16
        "
      >
        <div
          className="
            grid
            items-center
            gap-9
            lg:grid-cols-[0.76fr_1.55fr]
            xl:gap-11
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="relative">
            {/* eyebrow */}
            <div className="flex items-center gap-4">
              <span className="h-px w-9 bg-[#C68A24]" />

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.30em]
                  text-[#B67A1F]
                "
              >
                Why great resumes get missed
              </p>
            </div>

            {/* headline */}
            <h2
              className="
                mt-4
                max-w-[525px]
                text-[38px]
                font-semibold
                leading-[0.99]
                tracking-[-0.055em]
                text-[#0D3152]
                sm:text-[41px]
                lg:text-[43px]
                xl:text-[46px]
              "
            >
              Your experience
              <br />
              is strong.
              <br />

              <span className="text-[#C68A24]">
                Your resume
              </span>

              <br />

              <span>
                <span className="text-[#C68A24]">
                  doesn&apos;t
                </span>{" "}
                show it.
              </span>
            </h2>

            {/* description */}
            <p
              className="
                mt-4
                max-w-[445px]
                text-[14px]
                font-medium
                leading-[1.5]
                text-[#58758A]
              "
            >
              CareerSense helps your resume communicate your value clearly, to both ATS systems and recruiters.
            </p>

            {/* signals */}
            <div
              className="
                mt-6
                grid
                max-w-[390px]
                grid-cols-3
                gap-4
              "
            >
              {problemSignals.map(({ label, icon: Icon }, index) => {
                const styles = [
                  {
                    bg: "bg-[#FFF0EF]",
                    text: "text-[#EF5359]",
                  },
                  {
                    bg: "bg-[#FFF4DF]",
                    text: "text-[#D79215]",
                  },
                  {
                    bg: "bg-[#F3F0FF]",
                    text: "text-[#725BD8]",
                  },
                ][index];

                return (
                  <div key={label} className="min-w-0">
                    <div
                      className={`
                        flex
                        h-[46px]
                        w-[46px]
                        items-center
                        justify-center
                        rounded-full
                        ${styles.bg}
                        ${styles.text}
                      `}
                    >
                      <Icon size={20} strokeWidth={2.3} />
                    </div>

                    <p
                      className="
                        mt-2.5
                        max-w-[100px]
                        text-[10.5px]
                        font-extrabold
                        leading-[1.2]
                        text-[#123553]
                      "
                    >
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              RIGHT COMPARISON
          ================================================= */}

          <div className="relative">
            <div
              className="
                grid
                gap-5
                md:grid-cols-2
                lg:gap-6
              "
            >
              <BeforeCard />
              <AfterCard />
            </div>

            {/* =================================================
                RESULT CARD
            ================================================= */}

            <div
              className="
                relative
                z-20
                mx-auto
                mt-4
                flex
                w-full
                max-w-[620px]
                flex-col
                items-center
                justify-center
                gap-4
                rounded-[18px]
                border
                border-[#E4DED5]
                bg-white/78
                px-6
                py-3.5
                shadow-[0_12px_35px_rgba(28,48,63,0.065)]
                backdrop-blur-[8px]
                sm:flex-row
                sm:gap-7
              "
            >
              {/* score improvement */}
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-[44px]
                    w-[44px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[13px]
                    bg-[#FFF5DE]
                    text-[#D89516]
                  "
                >
                  <TrendingUp size={22} strokeWidth={2.4} />
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="
                        text-[27px]
                        font-black
                        tracking-[-0.05em]
                        text-[#0D3152]
                      "
                    >
                      +44
                    </span>

                    <span
                      className="
                        text-[14px]
                        font-extrabold
                        text-[#0D3152]
                      "
                    >
                      pts
                    </span>
                  </div>

                  <p
                    className="
                      mt-0.5
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      text-[#496B84]
                    "
                  >
                    ATS Match
                  </p>
                </div>
              </div>

              {/* separator */}
              <div className="hidden h-[44px] w-px bg-[#CCD4D9] sm:block" />

              {/* message */}
              <div className="text-center sm:text-left">
                <p
                  className="
                    text-[11px]
                    font-medium
                    text-[#687F91]
                  "
                >
                  Same experience.
                </p>

                <p
                  className="
                    mt-0.5
                    text-[16px]
                    font-extrabold
                    tracking-[-0.02em]
                    text-[#0D3152]
                  "
                >
                  Better presentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyCareerSenseSection;