import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { createPortal } from "react-dom";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Download,
  FileSearch,
  FileText,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import whyBackground from "../../assets/home/why.png";


/* =========================================================
   DATA
   ========================================================= */

const resumeBullets = [
  "Led product strategy and roadmap for a B2B analytics platform",
  "Collaborated with engineering, design, and go-to-market teams",
  "Improved user engagement by 40% through product optimization",
  "Owned quarterly planning, prioritization, and executive reporting",
];

const jobBullets = [
  "5+ years of product management experience",
  "Strong product strategy and roadmap ownership",
  "Experience leading cross-functional product teams",
  "SQL or analytics experience preferred",
  "Track record of measurable product growth",
];

const results = [
  {
    value: 12,
    label: "Keywords Found",
    tone: "success",
  },
  {
    value: 6,
    label: "Missing Keywords",
    tone: "danger",
  },
  {
    value: 3,
    label: "Formatting Issues",
    tone: "danger",
  },
  {
    value: 2,
    label: "Content Suggestions",
    tone: "warning",
  },
];

const features = [
  {
    icon: FileText,
    title: "Plain Text",
    subtitle: "Parsing",
  },
  {
    icon: Search,
    title: "Keyword",
    subtitle: "Matching",
  },
  {
    icon: BarChart3,
    title: "Structure",
    subtitle: "Analysis",
  },
  {
    icon: CheckCircle2,
    title: "Actionable",
    subtitle: "Insights",
  },
];

const processSteps = [
  {
    number: 1,
    icon: FileText,
    title: "Upload Resume",
    subtitle: "PDF or DOCX",
  },
  {
    number: 2,
    icon: FileSearch,
    title: "Parse Content",
    subtitle: "Extract information",
  },
  {
    number: 3,
    icon: Search,
    title: "Analyze & Match",
    subtitle: "Compare with job description",
  },
  {
    number: 4,
    icon: BarChart3,
    title: "Identify Gaps",
    subtitle: "Find missing keywords",
  },
  {
    number: 5,
    icon: Sparkles,
    title: "Get Suggestions",
    subtitle: "AI-powered recommendations",
  },
  {
    number: 6,
    icon: Download,
    title: "Export Improved",
    subtitle: "Download optimized resume",
  },
];

const scanStatuses = [
  {
    title: "Scanning & Parsing...",
    description:
      "Extracting text and reading resume structure...",
  },
  {
    title: "Matching Keywords...",
    description:
      "Comparing resume language with the target role...",
  },
  {
    title: "Evaluating Impact...",
    description:
      "Checking measurable results and recruiter-facing clarity...",
  },
];


/* =========================================================
   RESULT ROW
   ========================================================= */

const ResultRow = ({
  value,
  label,
  tone,
  index,
}) => {
  const isSuccess =
    tone === "success";

  const isWarning =
    tone === "warning";

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 12,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.4,
        delay: 0.3 + index * 0.08,
      }}
      className="
        grid
        grid-cols-[28px_28px_1fr_14px]
        items-center
        gap-2
        border-b
        border-white/[0.08]
        py-2.5
        last:border-b-0
      "
    >
      <div
        className={`
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full

          ${
            isSuccess
              ? "bg-[#28C38A] text-[#06334A]"
              : isWarning
                ? "bg-[#F0C76C] text-[#173A52]"
                : "bg-[#FF725F] text-white"
          }
        `}
      >
        {isSuccess ? (
          <Check
            size={13}
            strokeWidth={3}
          />
        ) : isWarning ? (
          <AlertCircle
            size={13}
            strokeWidth={2.5}
          />
        ) : (
          <span className="text-[11px] font-black">
            !
          </span>
        )}
      </div>

      <span
        className={`
          text-[10px]
          font-black

          ${
            isSuccess
              ? "text-[#DFF7EE]"
              : isWarning
                ? "text-[#F2D78E]"
                : "text-[#FF8A78]"
          }
        `}
      >
        {value}
      </span>

      <span
        className="
          text-[9px]
          font-semibold
          text-[#F4F8FA]
        "
      >
        {label}
      </span>

      <ArrowRight
        size={12}
        className="text-[#C4D3DC]"
      />
    </motion.div>
  );
};


/* =========================================================
   DOCUMENT ROW
   ========================================================= */

const DocumentLine = ({
  width = "100%",
  highlighted = false,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{
        scaleX: 0,
      }}
      whileInView={{
        scaleX: 1,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
        delay: 0.12 + index * 0.05,
      }}
      className={`
        h-[5px]
        origin-left
        rounded-full

        ${
          highlighted
            ? "bg-[linear-gradient(90deg,#E9C76C,#F5E8C0)]"
            : "bg-[#DCE4E8]"
        }
      `}
      style={{
        width,
      }}
    />
  );
};


/* =========================================================
   LIVE SIGNAL LINES
   ========================================================= */

const SignalLines = () => {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[12]
        hidden
        lg:block
      "
    >
      <svg
        viewBox="0 0 780 320"
        className="h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {[
          {
            y1: 120,
            y2: 116,
            delay: 0,
            color: "#E4B74E",
          },
          {
            y1: 138,
            y2: 142,
            delay: 0.15,
            color: "#E4B74E",
          },
          {
            y1: 158,
            y2: 160,
            delay: 0.3,
            color: "#4F8FFF",
          },
          {
            y1: 178,
            y2: 180,
            delay: 0.45,
            color: "#4F8FFF",
          },
        ].map(
          ({
            y1,
            y2,
            delay,
            color,
          }) => (
            <g key={`${y1}-${y2}`}>
              <motion.path
                d={`M 200 ${y1} C 290 ${y1}, 300 160, 390 160 C 475 160, 490 ${y2}, 580 ${y2}`}
                fill="none"
                stroke={color}
                strokeWidth="1.1"
                strokeDasharray="3 7"
                initial={{
                  pathLength: 0,
                  opacity: 0,
                }}
                animate={{
                  pathLength: [0, 1, 1],
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: 3.2,
                  delay,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: "easeInOut",
                }}
              />

              <motion.circle
                r="3"
                fill={color}
                initial={{
                  offsetDistance: "0%",
                  opacity: 0,
                }}
                animate={{
                  offsetDistance: [
                    "0%",
                    "100%",
                  ],
                  opacity: [
                    0,
                    1,
                    1,
                    0,
                  ],
                }}
                transition={{
                  duration: 2.6,
                  delay: delay + 0.3,
                  repeat: Infinity,
                  repeatDelay: 0.8,
                }}
                style={{
                  offsetPath: `path("M 200 ${y1} C 290 ${y1}, 300 160, 390 160 C 475 160, 490 ${y2}, 580 ${y2}")`,
                }}
              />
            </g>
          )
        )}
      </svg>
    </div>
  );
};


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

function ATSReportCoverage() {
  const reduceMotion =
    useReducedMotion();

  const [
    isSampleReportOpen,
    setIsSampleReportOpen,
  ] = useState(false);

  const [
    scanStatusIndex,
    setScanStatusIndex,
  ] = useState(0);

  const [
    activeProcessStep,
    setActiveProcessStep,
  ] = useState(0);


  /* =======================================================
     MODAL SCROLL LOCK
     ======================================================= */

  useEffect(() => {
    if (
      typeof document === "undefined"
    ) {
      return undefined;
    }

    if (!isSampleReportOpen) {
      document.body.style.overflow = "";

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


  /* =======================================================
     SCAN STATUS LOOP
     ======================================================= */

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    const interval =
      window.setInterval(() => {
        setScanStatusIndex(
          (current) =>
            (current + 1) %
            scanStatuses.length
        );
      }, 2600);

    return () =>
      window.clearInterval(interval);
  }, [reduceMotion]);


  /* =======================================================
     PROCESS LOOP
     ======================================================= */

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    const interval =
      window.setInterval(() => {
        setActiveProcessStep(
          (current) =>
            (current + 1) %
            processSteps.length
        );
      }, 1200);

    return () =>
      window.clearInterval(interval);
  }, [reduceMotion]);


  const activeScanStatus =
    scanStatuses[scanStatusIndex];


  return (
    <>
      <section
        id="ats-report-coverage"
        className="
          relative
          w-full
          overflow-hidden
          border-y
          border-[#17445F]
          bg-[#062C47]
          text-white
        "
      >
        {/* =================================================
            BACKGROUND
            ================================================= */}

        <img
          src={whyBackground}
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

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[#052B45]/45
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_53%_42%,rgba(35,106,151,.24),transparent_34%)]
          "
        />


        {/* =================================================
            TOP CONTENT
            ================================================= */}

        <div
          className="landing-container
            relative
            z-10
            mx-auto
            grid
            w-full
            max-w-[1920px]
            items-center
            gap-5
            px-5
            pb-5
            pt-7
            sm:px-8
            lg:grid-cols-[0.76fr_1.34fr_0.90fr]
            lg:px-12
            lg:pb-6
            lg:pt-8
            xl:gap-7
            xl:px-[72px]
          "
        >
          {/* =================================================
              LEFT
              ================================================= */}

          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -20,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="
              flex
              flex-col
              justify-center
              lg:min-h-[395px]
            "
          >
            {/* eyebrow */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-[#E7B84E]
                "
              />

              <p
                className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.27em]
                  text-[#F0C85E]
                "
              >
                What ATS Actually Sees
              </p>
            </div>


            {/* title */}

            <h2
              className="
                mt-4
                max-w-[455px]
                font-serif
                text-[34px]
                font-semibold
                leading-[0.97]
                tracking-[-0.045em]
                text-[#FFFDF8]
                sm:text-[37px]
                xl:text-[40px]
              "
            >
              ATS Doesn’t Read Like
              <span className="text-[#EAC15C]">
              You Do
              </span>{" "}
            </h2>


            {/* copy */}

            <p
              className="
                mt-4
                max-w-[445px]
                text-[11px]
                font-medium
                leading-[1.62]
                text-[#D4E0E7]
                sm:text-[11.5px]
              "
            >
              ATS systems parse your resume as plain
              text. Complex formatting, columns,
              icons, and graphics can confuse the
              system and hide important information.
            </p>


            {/* CTA */}

            <Link
              to="/check-ats/resume-jd"
              className="
                group
                mt-5
                inline-flex
                h-[46px]
                w-fit
                min-w-[215px]
                items-center
                justify-between
                rounded-[8px]
                border
                border-[#E5B84F]
                bg-[linear-gradient(110deg,#F6D378,#E8B745)]
                px-5
                text-[10.5px]
                font-black
                text-[#12354C]
                shadow-[0_10px_24px_rgba(0,0,0,.16)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:brightness-105
              "
            >
              Analyze JD Now

              <ArrowRight
                size={15}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>


            {/* feature icons */}

            <div
              className="
                mt-6
                grid
                max-w-[425px]
                grid-cols-2
                gap-x-4
                gap-y-4
                sm:grid-cols-4
              "
            >
              {features.map(
                ({
                  icon: Icon,
                  title,
                  subtitle,
                }) => (
                  <div
                    key={`${title}-${subtitle}`}
                    className="
                      flex
                      flex-col
                      items-start
                      sm:items-center
                      sm:text-center
                    "
                  >
                    <div
                      className="
                        flex
                        h-[39px]
                        w-[39px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#D7A741]/45
                        bg-[#113D59]/70
                        text-[#E9BE58]
                        shadow-[0_0_18px_rgba(227,181,72,.11)]
                      "
                    >
                      <Icon size={16} />
                    </div>

                    <p
                      className="
                        mt-2
                        text-[8px]
                        font-bold
                        text-[#FFFDF7]
                      "
                    >
                      {title}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[7px]
                        font-medium
                        text-[#B5C7D2]
                      "
                    >
                      {subtitle}
                    </p>
                  </div>
                )
              )}
            </div>
          </motion.div>


          {/* =================================================
              CENTER LIVE ANALYSIS
              ================================================= */}

          <div
            className="
              relative
              min-h-[395px]
            "
          >
            <SignalLines />


            {/* scanning state */}

            <AnimatePresence mode="wait">
              <motion.div
                key={scanStatusIndex}
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 7,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="
                  absolute
                  left-1/2
                  top-0
                  z-30
                  hidden
                  w-[225px]
                  -translate-x-1/2
                  rounded-[11px]
                  border
                  border-white/15
                  bg-[#0A3551]/90
                  px-3
                  py-2.5
                  shadow-[0_12px_30px_rgba(0,0,0,.18)]
                  backdrop-blur
                  lg:block
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <motion.div
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            scale: [
                              1,
                              1.1,
                              1,
                            ],
                          }
                    }
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                    }}
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E9BE58]/60
                      bg-[#E9BE58]/10
                      text-[#E9BE58]
                    "
                  >
                    <FileSearch
                      size={14}
                    />
                  </motion.div>

                  <div>
                    <p
                      className="
                        text-[9px]
                        font-bold
                        text-white
                      "
                    >
                      {
                        activeScanStatus.title
                      }
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[6.8px]
                        font-medium
                        leading-[1.35]
                        text-[#B6CAD6]
                      "
                    >
                      {
                        activeScanStatus.description
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>


            {/* documents layout */}

            <div
              className="
                relative
                z-20
                grid
                min-h-[395px]
                items-center
                gap-4
                pt-0
                md:grid-cols-[1fr_82px_1fr]
                lg:pt-10
              "
            >
              {/* =============================================
                  RESUME CARD
                  ============================================= */}

              <motion.div
                animate={
                  reduceMotion
                    ? {}
                    : {
                        y: [
                          0,
                          -4,
                          0,
                        ],
                      }
                }
                transition={{
                  duration: 4.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative
                  mx-auto
                  w-full
                  max-w-[248px]
                "
              >
                {/* stacked papers */}

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    -left-3
                    -top-3
                    h-full
                    w-full
                    rotate-[-5deg]
                    rounded-[10px]
                    border
                    border-white/10
                    bg-[#E9EEF1]/15
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    -right-3
                    -top-2
                    h-full
                    w-full
                    rotate-[4deg]
                    rounded-[10px]
                    border
                    border-white/10
                    bg-[#D9E2E8]/12
                  "
                />


                <div
                  className="
                    relative
                    z-10
                    min-h-[260px]
                    rounded-[11px]
                    border
                    border-[#D8E0E4]
                    bg-[#FFFDF9]
                    p-4
                    text-[#14364D]
                    shadow-[0_20px_44px_rgba(0,0,0,.20)]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      border-b
                      border-[#DDE4E7]
                      pb-3
                    "
                  >
                    <FileText
                      size={15}
                      className="text-[#244F69]"
                    />

                    <span
                      className="
                        text-[9px]
                        font-black
                      "
                    >
                      Your Resume
                    </span>
                  </div>


                  <p
                    className="
                      mt-3
                      text-[9.5px]
                      font-black
                    "
                  >
                    Alex Johnson
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[7.2px]
                      font-semibold
                      text-[#78909E]
                    "
                  >
                    Senior Product Manager
                  </p>


                  <div className="mt-3 space-y-2">
                    {resumeBullets.map(
                      (
                        bullet,
                        index
                      ) => (
                        <div
                          key={bullet}
                          className="
                            flex
                            items-start
                            gap-2
                          "
                        >
                          <span
                            className="
                              mt-[4px]
                              h-1
                              w-1
                              shrink-0
                              rounded-full
                              bg-[#214A65]
                            "
                          />

                          <p
                            className="
                              text-[6.6px]
                              font-medium
                              leading-[1.35]
                              text-[#516F81]
                            "
                          >
                            {bullet}
                          </p>
                        </div>
                      )
                    )}
                  </div>


                  <div
                    className="
                      mt-4
                      space-y-2
                    "
                  >
                    <DocumentLine
                      width="55%"
                      highlighted
                    />

                    <DocumentLine
                      width="84%"
                      index={1}
                    />

                    <DocumentLine
                      width="72%"
                      highlighted
                      index={2}
                    />

                    <DocumentLine
                      width="91%"
                      index={3}
                    />
                  </div>
                </div>


                {/* filename */}

                <div
                  className="
                    mx-auto
                    mt-3
                    flex
                    h-[34px]
                    w-[92%]
                    items-center
                    justify-between
                    rounded-[8px]
                    border
                    border-white/10
                    bg-[#123E5B]/90
                    px-3
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-2
                    "
                  >
                    <FileText
                      size={12}
                      className="
                        shrink-0
                        text-[#D6E3EA]
                      "
                    />

                    <span
                      className="
                        truncate
                        text-[6.7px]
                        font-semibold
                        text-[#EAF1F5]
                      "
                    >
                      Alex_Johnson_Resume.pdf
                    </span>
                  </div>

                  <CheckCircle2
                    size={13}
                    className="
                      shrink-0
                      text-[#28C38A]
                    "
                  />
                </div>
              </motion.div>


              {/* =============================================
                  ATS CORE
                  ============================================= */}

              <div
                className="
                  relative
                  hidden
                  items-center
                  justify-center
                  md:flex
                "
              >
                <motion.div
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          scale: [
                            1,
                            1.06,
                            1,
                          ],

                          boxShadow: [
                            "0 0 20px rgba(64,132,255,.22)",
                            "0 0 40px rgba(64,132,255,.40)",
                            "0 0 20px rgba(64,132,255,.22)",
                          ],
                        }
                  }
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    relative
                    z-20
                    flex
                    h-[76px]
                    w-[76px]
                    items-center
                    justify-center
                    rounded-[16px]
                    border
                    border-[#5E88E5]/70
                    bg-[linear-gradient(145deg,#173A56,#0C2C49)]
                    text-[18px]
                    font-black
                    text-white
                    shadow-[0_0_30px_rgba(58,123,255,.32)]
                  "
                >
                  ATS

                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      inset-[7px]
                      rounded-[11px]
                      border
                      border-[#E5B84F]/35
                    "
                  />
                </motion.div>
              </div>


              {/* =============================================
                  JOB DESCRIPTION CARD
                  ============================================= */}

              <motion.div
                animate={
                  reduceMotion
                    ? {}
                    : {
                        y: [
                          0,
                          4,
                          0,
                        ],
                      }
                }
                transition={{
                  duration: 4.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative
                  mx-auto
                  w-full
                  max-w-[248px]
                "
              >
                {/* stacked papers */}

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    -left-3
                    -top-3
                    h-full
                    w-full
                    rotate-[-4deg]
                    rounded-[10px]
                    border
                    border-white/10
                    bg-[#E9EEF1]/14
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    -right-3
                    -top-2
                    h-full
                    w-full
                    rotate-[5deg]
                    rounded-[10px]
                    border
                    border-white/10
                    bg-[#D9E2E8]/12
                  "
                />


                <div
                  className="
                    relative
                    z-10
                    min-h-[260px]
                    rounded-[11px]
                    border
                    border-[#D8E0E4]
                    bg-[#FFFDF9]
                    p-4
                    text-[#14364D]
                    shadow-[0_20px_44px_rgba(0,0,0,.20)]
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      border-b
                      border-[#DDE4E7]
                      pb-3
                    "
                  >
                    <BriefcaseBusiness
                      size={15}
                      className="text-[#244F69]"
                    />

                    <span
                      className="
                        text-[9px]
                        font-black
                      "
                    >
                      Job Description
                    </span>
                  </div>


                  <p
                    className="
                      mt-3
                      text-[9.5px]
                      font-black
                    "
                  >
                    Senior Product Manager
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[7.2px]
                      font-semibold
                      text-[#78909E]
                    "
                  >
                    Enterprise SaaS · Growth
                  </p>


                  <div className="mt-3 space-y-2">
                    {jobBullets.map(
                      (
                        bullet,
                        index
                      ) => (
                        <div
                          key={bullet}
                          className="
                            flex
                            items-start
                            gap-2
                          "
                        >
                          <span
                            className="
                              mt-[4px]
                              h-1
                              w-1
                              shrink-0
                              rounded-full
                              bg-[#214A65]
                            "
                          />

                          <p
                            className="
                              text-[6.6px]
                              font-medium
                              leading-[1.35]
                              text-[#516F81]
                            "
                          >
                            {bullet}
                          </p>
                        </div>
                      )
                    )}
                  </div>


                  <div className="mt-4 space-y-2">
                    <DocumentLine
                      width="69%"
                      index={1}
                    />

                    <DocumentLine
                      width="56%"
                      highlighted
                      index={2}
                    />

                    <DocumentLine
                      width="82%"
                      index={3}
                    />

                    <DocumentLine
                      width="72%"
                      highlighted
                      index={4}
                    />
                  </div>
                </div>


                {/* filename */}

                <div
                  className="
                    mx-auto
                    mt-3
                    flex
                    h-[34px]
                    w-[92%]
                    items-center
                    justify-between
                    rounded-[8px]
                    border
                    border-white/10
                    bg-[#123E5B]/90
                    px-3
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-2
                    "
                  >
                    <BriefcaseBusiness
                      size={12}
                      className="
                        shrink-0
                        text-[#D6E3EA]
                      "
                    />

                    <span
                      className="
                        truncate
                        text-[6.7px]
                        font-semibold
                        text-[#EAF1F5]
                      "
                    >
                      Product_Manager_JD.pdf
                    </span>
                  </div>

                  <CheckCircle2
                    size={13}
                    className="
                      shrink-0
                      text-[#28C38A]
                    "
                  />
                </div>
              </motion.div>
            </div>
          </div>


          {/* =================================================
              RIGHT RESULT PANEL
              ================================================= */}

          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 24,
                  }
            }
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.65,
            }}
            className="
              min-h-[395px]
              rounded-[15px]
              border
              border-white/[0.16]
              bg-[#0A3551]/88
              p-4
              shadow-[0_18px_44px_rgba(0,0,0,.20)]
              backdrop-blur
            "
          >
            {/* header */}

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-[#29C38A]
                    text-[#08344A]
                  "
                >
                  <Check
                    size={14}
                    strokeWidth={3}
                  />
                </div>

                <h3
                  className="
                    text-[12px]
                    font-black
                    text-white
                  "
                >
                  ATS Analysis Complete
                </h3>
              </div>

              <p
                className="
                  mt-1.5
                  text-[7.5px]
                  font-medium
                  text-[#BCD0DC]
                "
              >
                Here&apos;s what the ATS sees and
                where your resume can improve.
              </p>
            </div>


            {/* score */}

            <div
              className="
                mt-4
                grid
                grid-cols-[110px_1fr]
                items-center
                gap-3
              "
            >
              <div
                className="
                  relative
                  flex
                  h-[106px]
                  w-[106px]
                  items-center
                  justify-center
                "
              >
                <svg
                  viewBox="0 0 100 100"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    -rotate-90
                  "
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    stroke="rgba(255,255,255,.10)"
                    strokeWidth="7"
                  />

                  <motion.circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    stroke="#EBC35F"
                    strokeWidth="7"
                    strokeLinecap="round"
                    initial={{
                      pathLength: 0,
                    }}
                    whileInView={{
                      pathLength: 0.78,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 1.3,
                      ease: "easeOut",
                    }}
                  />
                </svg>

                <span
                  className="
                    text-[26px]
                    font-black
                    tracking-[-0.04em]
                    text-white
                  "
                >
                  78%
                </span>
              </div>


              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    text-white
                  "
                >
                  ATS Score
                </p>

                <p
                  className="
                    mt-1
                    text-[13px]
                    font-black
                    text-[#28C38A]
                  "
                >
                  Good Match
                </p>

                <p
                  className="
                    mt-2
                    text-[7.6px]
                    font-medium
                    leading-[1.45]
                    text-[#BDD0DC]
                  "
                >
                  Your resume is on the right
                  track, but there&apos;s room to
                  improve.
                </p>
              </div>
            </div>


            {/* results */}

            <div
              className="
                mt-4
                rounded-[10px]
                border
                border-white/[0.08]
                bg-[#082C45]/66
                px-3
              "
            >
              {results.map(
                (
                  item,
                  index
                ) => (
                  <ResultRow
                    key={item.label}
                    {...item}
                    index={index}
                  />
                )
              )}
            </div>
          </motion.div>
        </div>


        {/* =================================================
            BOTTOM PROCESS
            ================================================= */}

        <div
          className="
            relative
            z-20
            border-t
            border-white/[0.12]
            bg-[#052940]/72
          "
        >
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-[1920px]
              items-center
              gap-4
              overflow-x-auto
              no-scrollbar
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              px-5
              py-4
              sm:px-8
              lg:px-12
              xl:px-[72px]
            "
          >
            {processSteps.map(
              (
                step,
                index
              ) => {
                const Icon =
                  step.icon;

                const active =
                  activeProcessStep ===
                  index;

                return (
                  <React.Fragment
                    key={step.number}
                  >
                    <motion.div
                      animate={
                        active &&
                        !reduceMotion
                          ? {
                              y: [
                                0,
                                -3,
                                0,
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.4,
                      }}
                      className="
                        flex
                        min-w-[180px]
                        items-center
                        gap-2.5
                      "
                    >
                      <motion.div
                        animate={{
                          backgroundColor:
                            active
                              ? "#F0C65E"
                              : "rgba(24,62,86,.9)",

                          color:
                            active
                              ? "#10344B"
                              : "#D2E0E8",

                          borderColor:
                            active
                              ? "#F0C65E"
                              : "rgba(255,255,255,.17)",
                        }}
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          text-[9px]
                          font-black
                        "
                      >
                        {step.number}
                      </motion.div>


                      <Icon
                        size={15}
                        className={
                          active
                            ? "text-[#EAC05A]"
                            : "text-[#7F9AAA]"
                        }
                      />


                      <div>
                        <p
                          className={`
                            text-[8px]
                            font-bold

                            ${
                              active
                                ? "text-[#F0C65E]"
                                : "text-[#D7E2E8]"
                            }
                          `}
                        >
                          {step.title}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[6.5px]
                            font-medium
                            text-[#869FAD]
                          "
                        >
                          {step.subtitle}
                        </p>
                      </div>
                    </motion.div>


                    {index <
                      processSteps.length -
                        1 && (
                      <motion.div
                        animate={{
                          opacity:
                            active
                              ? 1
                              : 0.38,
                        }}
                        className="
                          hidden
                          h-px
                          min-w-[26px]
                          flex-1
                          bg-[linear-gradient(90deg,#E6BC55,rgba(230,188,85,.15))]
                          lg:block
                        "
                      />
                    )}
                  </React.Fragment>
                );
              }
            )}


            {/* handwritten finishing note */}

            <div
              className="
                ml-auto
                hidden
                min-w-[180px]
                items-center
                gap-2
                xl:flex
              "
            >
              <ArrowRight
                size={25}
                strokeWidth={1.4}
                className="
                  rotate-[18deg]
                  text-[#E9B84B]
                "
              />

              <p
                className="
                  -rotate-[4deg]
                  font-serif
                  text-[11px]
                  italic
                  leading-[1.25]
                  text-[#EFC45B]
                "
              >
                Turn your resume
                <br />
                into opportunities.
              </p>
            </div>
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
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.22,
                  }}
                  className="
                    fixed
                    inset-0
                    z-[9999]
                    flex
                    items-center
                    justify-center
                    bg-[#041726]/80
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
                    initial={{
                      opacity: 0,
                      y: 12,
                      scale: 0.985,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 8,
                      scale: 0.99,
                    }}
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
                      shadow-[0_28px_80px_rgba(0,0,0,.30)]
                    "
                  >
                    {/* header */}

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
                            text-[#102D47]
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
                          text-[#102D47]
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
}


export default ATSReportCoverage;
