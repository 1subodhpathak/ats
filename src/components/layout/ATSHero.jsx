import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  BarChart3,
  FileText,
  LayoutGrid,
  Target,
  X,
  Zap,
} from "lucide-react";

import heroBackground from "../../assets/home/hero.png";


/* =========================================================
   THEME
   ========================================================= */

const colors = {
  cream: "#F8F3EA",
  navy: "#0D2E4A",
  dark: "#071C2E",
  muted: "#4E7188",
  gold: "#C1882D",
  green: "#159369",
  red: "#D84E4E",
};


/* =========================================================
   HERO STATS
   ========================================================= */

const stats = [
  {
    value: "100+",
    label: "Check Points",
    icon: Zap,
  },
  {
    value: "SMART",
    label: "JD Matching",
    icon: LayoutGrid,
  },
  {
    value: "95%",
    label: "Accuracy",
    icon: FileText,
  },
  {
    value: "60s",
    label: "Instant Results",
    icon: BarChart3,
  },
];


/* =========================================================
   SCORE METRIC
   ========================================================= */

const MetricRow = ({
  value,
  label,
  tone = "green",
}) => {
  const positive =
    tone === "green";

  return (
    <div
      className="
        grid
        grid-cols-[27px_25px_1fr]
        items-center
        gap-2
      "
    >
      <div
        className={`
          flex
          h-[26px]
          w-[26px]
          items-center
          justify-center
          rounded-[7px]

          ${
            positive
              ? "bg-[#E4F5EC] text-[#139269]"
              : "bg-[#FCE9E6] text-[#DE5454]"
          }
        `}
      >
        {positive ? (
          <BarChart3
            size={12}
            strokeWidth={2.2}
          />
        ) : (
          <Target
            size={12}
            strokeWidth={2.2}
          />
        )}
      </div>

      <span
        className={`
          text-[10.5px]
          font-black

          ${
            positive
              ? "text-[#159369]"
              : "text-[#D84E4E]"
          }
        `}
      >
        {value}
      </span>

      <span
        className="
          whitespace-nowrap
          text-[7.5px]
          font-semibold
          text-[#657E8E]
        "
      >
        {label}
      </span>
    </div>
  );
};


/* =========================================================
   ATS HERO
   ========================================================= */

const ATSHero = () => {
  const reduceMotion =
    useReducedMotion();

  const [
    isSampleReportOpen,
    setIsSampleReportOpen,
  ] = useState(false);


  /* =======================================================
     SAMPLE REPORT SCROLL LOCK
     ======================================================= */

  useEffect(() => {
    if (
      typeof document === "undefined"
    ) {
      return undefined;
    }

    if (!isSampleReportOpen) {
      document.body.style.overflow =
        "";

      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isSampleReportOpen]);


  return (
    <>
      <section
        className="
          relative
          isolate
          overflow-hidden
          border-b
          border-[#DDD8CF]
          bg-[#F8F3EA]
        "
      >
        {/* =================================================
            HERO BACKGROUND
            ================================================= */}

        <img
          src={heroBackground}
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


        {/* =================================================
            LEFT READABILITY OVERLAY

            Strong cream coverage on the content side.
            Gradually disappears toward product / photography.
            ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[linear-gradient(
              90deg,
              rgba(250,247,240,.985)_0%,
              rgba(250,247,240,.96)_26%,
              rgba(250,247,240,.79)_40%,
              rgba(250,247,240,.32)_55%,
              rgba(250,247,240,.07)_70%,
              rgba(250,247,240,0)_100%
            )]
          "
        />


        {/* subtle vertical wash */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[linear-gradient(
              180deg,
              rgba(255,255,255,.08),
              transparent_34%,
              rgba(248,243,234,.10)
            )]
          "
        />


        {/* =================================================
            HERO CONTENT
            ================================================= */}

        <div
          className="landing-container
            relative
            z-10
            mx-auto
            w-full
            max-w-[1920px]
            px-5
            py-7
            sm:px-8
            lg:min-h-[510px]
            lg:px-12
            lg:py-8
            xl:px-[88px]
            2xl:px-[105px]
          "
        >
          <div
            className="
              grid
              h-full
              items-center
              gap-8
              lg:grid-cols-[0.43fr_0.57fr]
              xl:gap-6
            "
          >
            {/* ===============================================
                LEFT CONTENT
                =============================================== */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 14,
                    }
              }
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={{
                duration: 0.6,
                ease: [
                  0.16,
                  1,
                  0.3,
                  1,
                ],
              }}
              className="
                relative
                z-20
                max-w-[710px]
              "
            >
              {/* ---------------------------------------------
                  EYEBROW
                  --------------------------------------------- */}

              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    h-px
                    w-8
                    bg-[#B67A21]
                  "
                />

                <p
                  className="
                    text-[8.5px]
                    font-black
                    uppercase
                    tracking-[0.25em]
                    text-[#A96F19]
                    sm:text-[9.5px]
                  "
                >
                  AI-Powered ATS Resume Checker
                </p>
              </div>


              {/* ---------------------------------------------
                  HEADLINE
                  --------------------------------------------- */}

              <h1
                className="
                  max-w-[690px]
                  font-serif
                  text-[43px]
                  font-semibold
                  leading-[0.93]
                  tracking-[-0.052em]
                  text-[#0D2E4A]
                  sm:text-[50px]
                  md:text-[54px]
                  lg:text-[52px]
                  xl:text-[58px]
                  2xl:text-[62px]
                "
              >
                Beat the ATS.
                <br />

                <span className="text-[#C1882D]">
                  Get More
                </span>{" "}

                <span className="text-[#0D2E4A]">
                  Interviews.
                </span>
              </h1>


              {/* ---------------------------------------------
                  DESCRIPTION
                  --------------------------------------------- */}

              <p
                className="
                  mt-5
                  max-w-[620px]
                  text-[14px]
                  font-medium
                  leading-[1.68]
                  text-[#456A82]
                  sm:text-[14.5px]
                "
              >
                Instantly analyze your resume
                against any job description,
                uncover what&apos;s missing, and
                get clear, actionable
                recommendations to improve your
                chances.
              </p>


              {/* ---------------------------------------------
                  BUTTONS
                  --------------------------------------------- */}

              <div
                className="
                  mt-6
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                "
              >
                <Link
                  to="/check-ats"
                  className="
                    group
                    inline-flex
                    h-[50px]
                    min-w-[225px]
                    items-center
                    justify-between
                    rounded-[9px]
                    border
                    border-[#0B304B]
                    bg-[#0B304B]
                    px-5
                    text-[12.5px]
                    font-extrabold
                    text-white
                    shadow-[0_11px_24px_rgba(8,42,65,.18)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#123D59]
                  "
                >
                  <span>
                    Scan My Resume
                  </span>

                  <ArrowRight
                    size={17}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>


                <button
                  type="button"
                  onClick={() =>
                    setIsSampleReportOpen(
                      true
                    )
                  }
                  className="
                    group
                    inline-flex
                    h-[50px]
                    min-w-[220px]
                    items-center
                    justify-center
                    gap-3
                    rounded-[9px]
                    border
                    border-[#BFD0D9]
                    bg-white/94
                    px-5
                    text-[12.5px]
                    font-extrabold
                    text-[#0D2E4A]
                    shadow-[0_8px_18px_rgba(13,46,74,.07)]
                    backdrop-blur
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-white
                  "
                >
                  <FileText
                    size={16}
                  />

                  <span>
                    View Sample Report
                  </span>
                </button>
              </div>


              {/* ---------------------------------------------
                  STATS
                  --------------------------------------------- */}

              <div
                className="
                  mt-6
                  grid
                  max-w-[650px]
                  grid-cols-2
                  gap-x-5
                  gap-y-3
                  sm:grid-cols-4
                "
              >
                {stats.map(
                  (
                    {
                      value,
                      label,
                      icon: Icon,
                    },
                    index
                  ) => (
                    <motion.div
                      key={label}
                      initial={
                        reduceMotion
                          ? false
                          : {
                              opacity: 0,
                              y: 9,
                            }
                      }
                      animate={
                        reduceMotion
                          ? undefined
                          : {
                              opacity: 1,
                              y: 0,
                            }
                      }
                      transition={{
                        duration: 0.42,
                        delay:
                          0.15 +
                          index * 0.05,
                        ease: [
                          0.16,
                          1,
                          0.3,
                          1,
                        ],
                      }}
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-2.5
                      "
                    >
                      <div
                        className="
                          flex
                          h-[36px]
                          w-[36px]
                          shrink-0
                          items-center
                          justify-center
                          rounded-[9px]
                          border
                          border-[#D3DDE2]
                          bg-white/90
                          text-[#0D2E4A]
                          shadow-[0_6px_14px_rgba(13,46,74,.06)]
                        "
                      >
                        <Icon
                          size={15}
                          strokeWidth={2}
                        />
                      </div>


                      <div className="min-w-0">
                        <p
                          className="
                            whitespace-nowrap
                            text-[14px]
                            font-black
                            leading-none
                            tracking-[-0.025em]
                            text-[#0D2E4A]
                          "
                        >
                          {value}
                        </p>

                        <p
                          className="
                            mt-1
                            whitespace-nowrap
                            text-[6.5px]
                            font-black
                            uppercase
                            tracking-[0.13em]
                            text-[#668298]
                          "
                        >
                          {label}
                        </p>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>


            {/* ===============================================
                RIGHT PRODUCT PREVIEW
                =============================================== */}

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x: 20,
                    }
              }
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: 1,
                      x: 0,
                    }
              }
              transition={{
                duration: 0.7,
                delay: 0.08,
                ease: [
                  0.16,
                  1,
                  0.3,
                  1,
                ],
              }}
              className="
                relative
                z-20
                mx-auto
                hidden
                h-[390px]
                w-full
                max-w-[825px]
                lg:block
                xl:translate-x-5
              "
            >
              {/* ---------------------------------------------
                  CHECKER PANEL
                  --------------------------------------------- */}

              <div
                className="
                  absolute
                  left-[4%]
                  top-[35px]
                  z-10
                  w-[64%]
                  rounded-[14px]
                  border
                  border-[#D8E1E5]
                  bg-[#FFFEFC]
                  p-4
                  shadow-[0_20px_45px_rgba(10,39,59,.15)]
                "
              >
                {/* header */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <h2
                    className="
                      text-[15px]
                      font-black
                      tracking-[-0.025em]
                      text-[#0D2E4A]
                    "
                  >
                    CareerSense ATS Checker
                  </h2>


                  <span
                    className="
                      hidden
                      rounded-full
                      bg-[#F5EBD5]
                      px-2.5
                      py-1
                      text-[6px]
                      font-black
                      uppercase
                      tracking-[0.13em]
                      text-[#B67A1E]
                      xl:inline-flex
                    "
                  >
                    AI Powered
                  </span>
                </div>


                {/* resume */}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-[8px]
                    border
                    border-[#D7E0E5]
                    bg-white
                    px-3
                    py-2.5
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
                    <div
                      className="
                        flex
                        h-[34px]
                        w-[34px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-[8px]
                        bg-[#EAF3F9]
                        text-[#0D2E4A]
                      "
                    >
                      <FileText
                        size={15}
                      />
                    </div>


                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-[9px]
                          font-extrabold
                          text-[#173A51]
                        "
                      >
                        Jordan_Sterling_Resume.pdf
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[7px]
                          font-semibold
                          text-[#8CA1AF]
                        "
                      >
                        2.4 MB • PDF
                      </p>
                    </div>
                  </div>


                  <button
                    type="button"
                    className="
                      shrink-0
                      rounded-[7px]
                      border
                      border-[#D5E0E5]
                      bg-white
                      px-3
                      py-1.5
                      text-[7.5px]
                      font-extrabold
                      text-[#173A51]
                    "
                  >
                    Change
                  </button>
                </div>


                {/* JD */}

                <div className="mt-4">
                  <label
                    className="
                      text-[7.5px]
                      font-black
                      text-[#173A51]
                    "
                  >
                    Job Description

                    <span
                      className="
                        ml-1
                        font-semibold
                        text-[#8199A8]
                      "
                    >
                      (Optional)
                    </span>
                  </label>


                  <div
                    className="
                      mt-2
                      min-h-[67px]
                      rounded-[8px]
                      border
                      border-[#CBD9E0]
                      bg-white
                      px-3
                      py-3
                      text-[7.5px]
                      font-medium
                      text-[#97A9B4]
                    "
                  >
                    Paste the job description or
                    enter a job title...
                  </div>


                  <p
                    className="
                      mt-1
                      text-right
                      text-[6.5px]
                      font-semibold
                      text-[#8EA3AF]
                    "
                  >
                    0/2000
                  </p>
                </div>


                {/* analyze */}

                <Link
                  to="/check-ats/resume-jd"
                  className="
                    group
                    mt-3
                    flex
                    h-[44px]
                    w-full
                    items-center
                    justify-center
                    gap-4
                    rounded-[8px]
                    bg-[#0B304B]
                    px-4
                    text-[10.5px]
                    font-extrabold
                    text-white
                    shadow-[0_8px_18px_rgba(11,48,75,.17)]
                    transition
                    hover:bg-[#123D59]
                  "
                >
                  Analyze with CareerSense

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </div>


              {/* ---------------------------------------------
                  SCORE CARD
                  --------------------------------------------- */}

              <div
                className="
                  absolute
                  right-[2%]
                  top-[12px]
                  z-20
                  w-[235px]
                  rounded-[15px]
                  border
                  border-[#DDD8CF]
                  bg-[#FFFDF9]
                  px-4
                  py-4
                  shadow-[0_20px_48px_rgba(10,39,59,.18)]
                  xl:w-[245px]
                "
              >
                <p
                  className="
                    text-center
                    text-[7.5px]
                    font-black
                    text-[#173A51]
                  "
                >
                  Your ATS Score
                </p>


                {/* donut */}

                <div
                  className="
                    relative
                    mx-auto
                    mt-3
                    flex
                    h-[98px]
                    w-[98px]
                    items-center
                    justify-center
                    rounded-full
                  "
                  style={{
                    background:
                      "conic-gradient(#D9A534 0deg 140deg, #EAC455 140deg 190deg, #55BE83 190deg 281deg, #EEF0E9 281deg 360deg)",
                  }}
                >
                  <div
                    className="
                      flex
                      h-[72px]
                      w-[72px]
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                    "
                  >
                    <span
                      className="
                        text-[23px]
                        font-black
                        tracking-[-0.05em]
                        text-[#0D2E4A]
                      "
                    >
                      78%
                    </span>
                  </div>
                </div>


                <p
                  className="
                    mt-2
                    text-center
                    text-[14px]
                    font-black
                    text-[#199466]
                  "
                >
                  Good Match
                </p>


                <p
                  className="
                    mx-auto
                    mt-1
                    max-w-[180px]
                    text-center
                    text-[7px]
                    font-medium
                    leading-[1.4]
                    text-[#718A99]
                  "
                >
                  Your resume is well aligned,
                  with opportunities to improve.
                </p>


                <div
                  className="
                    mt-3.5
                    space-y-2
                  "
                >
                  <MetricRow
                    value="12"
                    label="Keywords Found"
                    tone="green"
                  />

                  <MetricRow
                    value="6"
                    label="Missing Keywords"
                    tone="red"
                  />

                  <MetricRow
                    value="3"
                    label="Content Suggestions"
                    tone="red"
                  />

                  <MetricRow
                    value="2"
                    label="Formatting Issues"
                    tone="green"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* =====================================================
          SAMPLE REPORT MODAL
          ===================================================== */}

      {typeof document !==
      "undefined"
        ? createPortal(
            <AnimatePresence>
              {isSampleReportOpen ? (
                <motion.div
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                        }
                  }
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 1,
                        }
                  }
                  exit={
                    reduceMotion
                      ? undefined
                      : {
                          opacity: 0,
                        }
                  }
                  transition={{
                    duration: 0.22,
                    ease: [
                      0.16,
                      1,
                      0.3,
                      1,
                    ],
                  }}
                  className="
                    fixed
                    inset-0
                    z-[9999]
                    flex
                    items-center
                    justify-center
                    bg-[#061929]/72
                    p-4
                    backdrop-blur-sm
                  "
                  onMouseDown={(
                    event
                  ) => {
                    if (
                      event.target ===
                      event.currentTarget
                    ) {
                      setIsSampleReportOpen(
                        false
                      );
                    }
                  }}
                >
                  <motion.div
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 12,
                            scale: 0.985,
                          }
                    }
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }
                    }
                    exit={
                      reduceMotion
                        ? undefined
                        : {
                            opacity: 0,
                            y: 8,
                            scale: 0.99,
                          }
                    }
                    transition={{
                      duration: 0.28,
                      ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                      ],
                    }}
                    className="
                      flex
                      h-[92vh]
                      w-full
                      max-w-[1180px]
                      flex-col
                      overflow-hidden
                      rounded-[24px]
                      border
                      border-[#D8DFE7]
                      bg-white
                      shadow-[0_28px_80px_rgba(16,36,90,.22)]
                    "
                  >
                    {/* Modal header */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-[#E4DDD4]
                        bg-[#FAF6EF]
                        px-5
                        py-4
                      "
                    >
                      <div className="min-w-0">
                        <p
                          className="
                            text-[9px]
                            font-black
                            uppercase
                            tracking-[0.18em]
                            text-[#69879A]
                          "
                        >
                          Sample Report
                        </p>

                        <h3
                          className="
                            mt-1
                            truncate
                            text-[20px]
                            font-black
                            tracking-[-0.025em]
                            text-[#0D2E4A]
                          "
                        >
                          ATS Resume Checker PDF
                        </h3>
                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          setIsSampleReportOpen(
                            false
                          )
                        }
                        className="
                          inline-flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-[#D8DFE7]
                          bg-white
                          text-[#0D2E4A]
                          shadow-sm
                          transition
                          hover:-translate-y-0.5
                        "
                        aria-label="Close sample report"
                      >
                        <X size={18} />
                      </button>
                    </div>


                    {/* PDF */}

                    <div
                      className="
                        flex-1
                        overflow-hidden
                        bg-[#F6F1EA]
                        p-3
                        sm:p-4
                      "
                    >
                      <iframe
                        src="/ATS%20Resume%20Checker.pdf#toolbar=0&navpanes=0&scrollbar=1"
                        title="Sample ATS report PDF"
                        className="
                          h-full
                          w-full
                          rounded-[18px]
                          border
                          border-[#D8DFE7]
                          bg-white
                          shadow-[0_18px_48px_rgba(16,36,90,.14)]
                        "
                      />
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
};


export default ATSHero;
