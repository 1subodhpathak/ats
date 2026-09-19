import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  CheckCircle,
  CheckCircle2,
  FileText,
  Target,
  Zap,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";


/* =========================================================
   ATS RESUME ANATOMY
   ========================================================= */

const ATSResumeAnatomy = () => {
  const [
    activeCategory,
    setActiveCategory,
  ] = useState("parsing");

  const [
    animationPhase,
    setAnimationPhase,
  ] = useState(0);


  /* =======================================================
     EXISTING LOOPING ANIMATION
     FUNCTIONALITY PRESERVED
     ======================================================= */

  useEffect(() => {
    let timeout1;
    let timeout2;
    let timeout3;
    let timeout4;
    let loopTimeout;

    const runAnimation = () => {
      setAnimationPhase(0);

      timeout1 = setTimeout(
        () => setAnimationPhase(1),
        450
      );

      timeout2 = setTimeout(
        () => setAnimationPhase(2),
        1400
      );

      timeout3 = setTimeout(
        () => setAnimationPhase(3),
        2350
      );

      timeout4 = setTimeout(
        () => setAnimationPhase(4),
        3300
      );

      loopTimeout = setTimeout(
        () => runAnimation(),
        8000
      );
    };

    runAnimation();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(loopTimeout);
    };
  }, [activeCategory]);


  /* =======================================================
     DATA
     ======================================================= */

  const scoringCategories = [
    {
      id: "parsing",
      title: "Parsing & Structure",
      icon: FileText,
      score: 85,
      description:
        "How well your resume can be parsed and structured by ATS systems.",
      checks: [
        "File format compatibility (PDF, DOCX)",
        "Section headers recognition",
        "Contact information accessibility",
        "Consistent date formatting",
      ],
    },

    {
      id: "keywords",
      title: "Keyword Match",
      icon: Target,
      score: 72,
      description:
        "Alignment with job description keywords and industry terminology.",
      checks: [
        "Hard skills matching",
        "Technical tools & frameworks",
        "Industry-specific terminology",
        "Action verb strength",
      ],
    },

    {
      id: "readability",
      title: "Readability",
      icon: BarChart3,
      score: 90,
      description:
        "Clarity, formatting, and how easily content is scannable.",
      checks: [
        "Sentence length & clarity",
        "Bullet point consistency",
        "Font size uniformity",
        "White space optimization",
      ],
    },

    {
      id: "impact",
      title: "Impact Metrics",
      icon: Zap,
      score: 68,
      description:
        "Quantifiable achievements and strong action verbs.",
      checks: [
        "Quantifiable results (numbers)",
        "Action verb strength",
        "Achievement vs. responsibility ratio",
        "Business impact clarity",
      ],
    },
  ];


  const processSteps = [
    {
      step: 1,
      label: "Upload",
      description: "Resume",
    },
    {
      step: 2,
      label: "Parse",
      description: "Content",
    },
    {
      step: 3,
      label: "Analyze",
      description: "Metrics",
    },
    {
      step: 4,
      label: "Identify",
      description: "Gaps",
    },
    {
      step: 5,
      label: "Improve",
      description: "Suggestions",
    },
    {
      step: 6,
      label: "Export",
      description: "Resume",
    },
  ];


  const activeData =
    scoringCategories.find(
      (category) =>
        category.id === activeCategory
    );


  /* =======================================================
     CHECKLIST ANIMATION
     ======================================================= */

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    show: {
      opacity: 1,

      transition: {
        staggerChildren: 0.1,
      },
    },
  };


  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 7,
    },

    show: {
      opacity: 1,
      y: 0,

      transition: {
        type: "spring",
        stiffness: 280,
        damping: 22,
      },
    },
  };


  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-[#173F59]
        bg-[#062B45]
        py-7
        text-white
        lg:py-8
      "
    >
      {/* ===================================================
          BACKGROUND
          =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-cover
          bg-center
          opacity-[0.08]
        "
        style={{
          backgroundImage:
            "url('/Anatomy.png')",
        }}
      />


      {/* navy wash */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(
            110deg,
            rgba(3,30,49,.97)_0%,
            rgba(7,48,76,.94)_46%,
            rgba(4,35,57,.96)_100%
          )]
        "
      />


      {/* subtle gold waves / atmosphere */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-[12%]
          bottom-[-190px]
          h-[370px]
          w-[760px]
          rounded-[50%]
          border
          border-[#D7A94B]/20
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-[16%]
          top-[-180px]
          h-[420px]
          w-[780px]
          rounded-[50%]
          border
          border-[#D7A94B]/15
        "
      />


      {/* ===================================================
          MAIN
          =================================================== */}

      <div
        className="landing-container
          relative
          z-10
          mx-auto
          w-full
          max-w-[1540px]
          px-5
          sm:px-8
          lg:px-10
          xl:px-14
        "
      >
        {/* =================================================
            HEADER
            ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.65,
          }}
          className="
            mb-6
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
                w-7
                bg-[#E1B54E]
              "
            />

            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.27em]
                text-[#E6C36D]
              "
            >
              How It Works
            </p>

            <span
              className="
                h-px
                w-7
                bg-[#E1B54E]
              "
            />
          </div>


          <h2
            className="
              mt-3
              font-serif
              text-[28px]
              font-semibold
              leading-none
              tracking-[-0.035em]
              text-[#FFFDF8]
              sm:text-[32px]
              lg:text-[34px]
            "
          >
            How the ATS Score Checker Works
          </h2>


          <p
            className="
              mx-auto
              mt-3
              max-w-[670px]
              text-[10.5px]
              font-medium
              leading-[1.55]
              text-[#C9D6DF]
              sm:text-[11px]
            "
          >
            CareerSense reads your resume,
            scores the areas ATS systems care
            about, identifies gaps, and shows
            what to improve before you apply.
          </p>
        </motion.div>


        {/* =================================================
            PROCESS STRIP
            ================================================= */}

        <div
          className="
            mb-6
            rounded-[14px]
            border
            border-white/12
            bg-white/[0.055]
            px-4
            py-4
            shadow-[0_16px_40px_rgba(0,0,0,.14)]
            backdrop-blur-[2px]
            sm:px-5
          "
        >
          <div
            className="
              grid
              gap-3
              sm:grid-cols-3
              lg:grid-cols-6
              lg:gap-0
            "
          >
            {processSteps.map(
              (item, index) => (
                <div
                  key={item.step}
                  className="
                    relative
                    flex
                    items-center
                    gap-2.5
                    lg:flex-col
                    lg:justify-center
                    lg:gap-0
                    lg:text-center
                  "
                >
                  {/* connector */}

                  {index <
                    processSteps.length -
                      1 && (
                    <motion.div
                      initial={{
                        scaleX: 0,
                      }}
                      animate={{
                        scaleX:
                          animationPhase >= 1
                            ? 1
                            : 0,
                      }}
                      transition={{
                        duration: 0.7,
                        delay:
                          animationPhase >= 1
                            ? index * 0.11
                            : 0,
                      }}
                      className="
                        absolute
                        left-[50%]
                        top-[16px]
                        hidden
                        h-px
                        w-full
                        origin-left
                        bg-[linear-gradient(
                          90deg,
                          rgba(229,190,102,.65),
                          rgba(229,190,102,.12)
                        )]
                        lg:block
                      "
                    />
                  )}


                  {/* number */}

                  <motion.div
                    animate={{
                      scale:
                        animationPhase === 2
                          ? [
                              1,
                              1.08,
                              1,
                            ]
                          : 1,
                    }}
                    transition={{
                      duration: 0.35,
                      delay:
                        index * 0.08,
                    }}
                    className="
                      relative
                      z-10
                      flex
                      h-[32px]
                      w-[32px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#E6C36D]/60
                      bg-[#F0D48D]
                      text-[10px]
                      font-black
                      text-[#0D2E4A]
                      shadow-[0_4px_12px_rgba(229,195,109,.15)]
                    "
                  >
                    {item.step}
                  </motion.div>


                  <div
                    className="
                      lg:mt-2
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        font-bold
                        text-[#FFFDF8]
                      "
                    >
                      {item.label}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[7px]
                        font-medium
                        text-[#91A7B7]
                      "
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>


        {/* =================================================
            LOWER INTERACTIVE AREA
            ================================================= */}

        <div
          className="
            grid
            gap-5
            lg:grid-cols-[0.78fr_1.22fr]
          "
        >
          {/* =================================================
              CATEGORY SELECTOR
              ================================================= */}

          <div>
            <p
              className="
                mb-3
                text-[8px]
                font-black
                uppercase
                tracking-[0.22em]
                text-[#E5C36D]
              "
            >
              Scoring Categories
            </p>


            <div
              className="
                grid
                gap-2
                sm:grid-cols-2
                lg:grid-cols-1
              "
            >
              {scoringCategories.map(
                (category) => {
                  const Icon =
                    category.icon;

                  const isActive =
                    activeCategory ===
                    category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          category.id
                        )
                      }
                      className={`
                        group
                        w-full
                        rounded-[11px]
                        border
                        px-3.5
                        py-3
                        text-left
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              border-[#E0BC69]/80
                              bg-[#F3E5C1]/10
                              shadow-[0_8px_22px_rgba(0,0,0,.12)]
                            `
                            : `
                              border-white/10
                              bg-[#0B2942]/72
                              hover:border-white/20
                              hover:bg-[#11344F]/80
                            `
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <div
                          className={`
                            flex
                            h-[34px]
                            w-[34px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-[8px]

                            ${
                              isActive
                                ? `
                                  bg-[#EED799]
                                  text-[#12354E]
                                `
                                : `
                                  bg-white/[0.06]
                                  text-[#8EA7B9]
                                `
                            }
                          `}
                        >
                          <Icon
                            size={15}
                          />
                        </div>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >
                            <p
                              className={`
                                truncate
                                text-[9.5px]
                                font-bold

                                ${
                                  isActive
                                    ? "text-[#FFFDF8]"
                                    : "text-[#B4C3CE]"
                                }
                              `}
                            >
                              {category.title}
                            </p>


                            <span
                              className={`
                                text-[9px]
                                font-black

                                ${
                                  isActive
                                    ? "text-[#E7C36C]"
                                    : "text-[#829AAA]"
                                }
                              `}
                            >
                              {category.score}
                            </span>
                          </div>


                          {/* score bar */}

                          <div
                            className="
                              mt-2
                              h-[4px]
                              overflow-hidden
                              rounded-full
                              bg-[#08233A]
                            "
                          >
                            <motion.div
                              animate={{
                                width:
                                  animationPhase >=
                                  1
                                    ? `${category.score}%`
                                    : "0%",
                              }}
                              transition={{
                                duration:
                                  animationPhase ===
                                  0
                                    ? 0.35
                                    : 1,
                                ease: "easeOut",
                              }}
                              className="
                                h-full
                                rounded-full
                                bg-[linear-gradient(
                                  90deg,
                                  #E4BE63,
                                  #F1D99B
                                )]
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>


          {/* =================================================
              ACTIVE CATEGORY DETAIL
              ================================================= */}

          {activeData && (
            <div
              className="
                grid
                gap-4
                md:grid-cols-[1.08fr_0.92fr]
              "
            >
              {/* =============================================
                  DETAILS
                  ============================================= */}

              <div
                className="
                  flex
                  min-h-[300px]
                  flex-col
                  rounded-[14px]
                  border
                  border-white/10
                  bg-[#0A2942]/92
                  p-5
                  shadow-[0_16px_40px_rgba(0,0,0,.15)]
                "
              >
                {/* title */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    border-b
                    border-white/10
                    pb-4
                  "
                >
                  <div
                    className="
                      flex
                      h-[38px]
                      w-[38px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[9px]
                      bg-[#F1DB9E]/10
                      text-[#E7C36C]
                    "
                  >
                    {React.createElement(
                      activeData.icon,
                      {
                        size: 18,
                      }
                    )}
                  </div>


                  <div>
                    <h3
                      className="
                        text-[15px]
                        font-bold
                        text-[#FFFDF8]
                      "
                    >
                      {activeData.title}
                    </h3>

                    <p
                      className="
                        mt-1
                        max-w-[430px]
                        text-[9px]
                        font-medium
                        leading-[1.45]
                        text-[#9FB2BF]
                      "
                    >
                      {
                        activeData.description
                      }
                    </p>
                  </div>
                </div>


                {/* checklist */}

                <div
                  className="
                    mt-4
                  "
                >
                  <p
                    className="
                      text-[7.5px]
                      font-black
                      uppercase
                      tracking-[0.22em]
                      text-[#E5C36D]
                    "
                  >
                    What we check
                  </p>


                  <motion.div
                    variants={
                      containerVariants
                    }
                    initial="hidden"
                    animate={
                      animationPhase >= 1
                        ? "show"
                        : "hidden"
                    }
                    className="
                      mt-3
                      grid
                      gap-2.5
                    "
                  >
                    {activeData.checks.map(
                      (
                        check,
                        index
                      ) => (
                        <motion.div
                          key={check}
                          variants={
                            itemVariants
                          }
                          className="
                            flex
                            items-start
                            gap-2.5
                          "
                        >
                          <motion.div
                            animate={{
                              scale:
                                animationPhase ===
                                3
                                  ? [
                                      1,
                                      1.25,
                                      1,
                                    ]
                                  : 1,

                              color:
                                animationPhase >=
                                3
                                  ? "#E4BE63"
                                  : "#7F98AA",
                            }}
                            transition={{
                              duration: 0.35,
                              delay:
                                animationPhase ===
                                3
                                  ? index *
                                    0.08
                                  : 0,
                            }}
                            className="
                              mt-[1px]
                              shrink-0
                            "
                          >
                            <CheckCircle2
                              size={15}
                            />
                          </motion.div>


                          <p
                            className="
                              text-[9px]
                              font-medium
                              leading-[1.45]
                              text-[#AABBC7]
                            "
                          >
                            {check}
                          </p>
                        </motion.div>
                      )
                    )}
                  </motion.div>
                </div>


                {/* tip */}

                <div
                  className="
                    mt-auto
                    rounded-[9px]
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-3
                    py-2.5
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-2
                    "
                  >
                    <AlertCircle
                      size={13}
                      className="
                        mt-[1px]
                        shrink-0
                        text-[#E5C36D]
                      "
                    />

                    <p
                      className="
                        text-[7.8px]
                        font-medium
                        leading-[1.5]
                        text-[#9FB2BF]
                      "
                    >
                      <span
                        className="
                          font-bold
                          text-[#FFFDF8]
                        "
                      >
                        Pro tip:
                      </span>{" "}
                      Higher scores mean your
                      resume is easier for ATS
                      systems to understand and
                      rank.
                    </p>
                  </div>
                </div>
              </div>


              {/* =============================================
                  VISUAL ANALYSIS PANEL
                  ============================================= */}

              <div
                className="
                  relative
                  min-h-[300px]
                  overflow-hidden
                  rounded-[14px]
                  border
                  border-white/10
                  bg-[linear-gradient(
                    145deg,
                    rgba(13,44,68,.95),
                    rgba(9,34,54,.98)
                  )]
                "
              >
                {/* glows */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-[10%]
                    top-[18%]
                    h-28
                    w-28
                    rounded-full
                    bg-[#315C76]/30
                    blur-[44px]
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    bottom-[10%]
                    right-[8%]
                    h-28
                    w-28
                    rounded-full
                    bg-[#E3B85A]/20
                    blur-[46px]
                  "
                />


                {/* ===========================================
                    MATCHING LINES
                    =========================================== */}

                <AnimatePresence>
                  {animationPhase >=
                    3 && (
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
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        z-10
                      "
                    >
                      <svg
                        className="
                          absolute
                          inset-0
                          h-full
                          w-full
                        "
                      >
                        <motion.line
                          x1="23%"
                          y1="40%"
                          x2="77%"
                          y2="44%"
                          stroke="#E3BD68"
                          strokeWidth="1.5"
                          strokeDasharray="4,5"
                          initial={{
                            pathLength: 0,
                          }}
                          animate={{
                            pathLength: 1,
                          }}
                          transition={{
                            duration: 0.45,
                          }}
                        />

                        <motion.line
                          x1="26%"
                          y1="56%"
                          x2="74%"
                          y2="60%"
                          stroke="#E3BD68"
                          strokeWidth="1.5"
                          strokeDasharray="4,5"
                          initial={{
                            pathLength: 0,
                          }}
                          animate={{
                            pathLength: 1,
                          }}
                          transition={{
                            duration: 0.45,
                            delay: 0.15,
                          }}
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>


                {/* ===========================================
                    RESUME DOCUMENT
                    =========================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    x: -60,
                  }}
                  animate={{
                    opacity:
                      animationPhase >=
                      4
                        ? 0.18
                        : animationPhase >=
                            1
                          ? 1
                          : 0,

                    x:
                      animationPhase >=
                      1
                        ? -54
                        : -80,

                    scale:
                      animationPhase >=
                      4
                        ? 0.88
                        : 1,
                  }}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    bounce: 0.22,
                  }}
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    z-20
                    flex
                    h-[138px]
                    w-[102px]
                    -translate-y-1/2
                    flex-col
                    rounded-[9px]
                    border
                    border-white/12
                    bg-[#102D47]/95
                    p-3
                    shadow-xl
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      border-b
                      border-white/10
                      pb-2
                    "
                  >
                    <FileText
                      size={13}
                      className="
                        text-[#E4BE63]
                      "
                    />

                    <span
                      className="
                        text-[7.5px]
                        font-bold
                        text-white
                      "
                    >
                      Resume
                    </span>
                  </div>


                  <div
                    className="
                      mt-2.5
                      space-y-2
                    "
                  >
                    <div
                      className="
                        h-[5px]
                        w-2/3
                        rounded-full
                        bg-white/15
                      "
                    />

                    <div
                      className="
                        h-[4px]
                        w-1/2
                        rounded-full
                        bg-white/12
                      "
                    />

                    <motion.div
                      animate={{
                        backgroundColor:
                          animationPhase >=
                          3
                            ? "rgba(228,190,99,.26)"
                            : "rgba(255,255,255,.12)",
                      }}
                      className="
                        h-[5px]
                        w-5/6
                        rounded-full
                      "
                    />

                    <div
                      className="
                        h-[4px]
                        w-full
                        rounded-full
                        bg-white/12
                      "
                    />
                  </div>
                </motion.div>


                {/* ===========================================
                    JOB DOCUMENT
                    =========================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    x: 60,
                  }}
                  animate={{
                    opacity:
                      animationPhase >=
                      4
                        ? 0.18
                        : animationPhase >=
                            1
                          ? 1
                          : 0,

                    x:
                      animationPhase >=
                      1
                        ? 54
                        : 80,

                    scale:
                      animationPhase >=
                      4
                        ? 0.88
                        : 1,
                  }}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    bounce: 0.22,
                  }}
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    z-20
                    flex
                    h-[138px]
                    w-[102px]
                    -translate-y-1/2
                    flex-col
                    rounded-[9px]
                    border
                    border-white/12
                    bg-[#102D47]/95
                    p-3
                    shadow-xl
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      border-b
                      border-white/10
                      pb-2
                    "
                  >
                    <Briefcase
                      size={13}
                      className="
                        text-[#F4F0E8]
                      "
                    />

                    <span
                      className="
                        text-[7.5px]
                        font-bold
                        text-white
                      "
                    >
                      Job Post
                    </span>
                  </div>


                  <div
                    className="
                      mt-2.5
                      space-y-2
                    "
                  >
                    <div
                      className="
                        h-[5px]
                        w-2/3
                        rounded-full
                        bg-white/15
                      "
                    />

                    <div
                      className="
                        h-[4px]
                        w-full
                        rounded-full
                        bg-white/12
                      "
                    />

                    <motion.div
                      animate={{
                        backgroundColor:
                          animationPhase >=
                          3
                            ? "rgba(228,190,99,.26)"
                            : "rgba(255,255,255,.12)",
                      }}
                      className="
                        h-[5px]
                        w-4/5
                        rounded-full
                      "
                    />

                    <div
                      className="
                        h-[4px]
                        w-full
                        rounded-full
                        bg-white/12
                      "
                    />
                  </div>
                </motion.div>


                {/* ===========================================
                    SCANNER
                    =========================================== */}

                <AnimatePresence>
                  {animationPhase >=
                    2 &&
                    animationPhase <
                      4 && (
                      <motion.div
                        initial={{
                          top: "7%",
                          opacity: 0,
                        }}
                        animate={{
                          top: "93%",
                          opacity: [
                            0,
                            1,
                            1,
                            0,
                          ],
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        transition={{
                          duration: 1.35,
                          ease: "linear",
                          repeat: Infinity,
                        }}
                        className="
                          absolute
                          left-5
                          right-5
                          z-30
                          h-px
                          bg-[#E3BD68]
                          shadow-[0_0_12px_rgba(227,189,104,.8)]
                        "
                      >
                        <div
                          className="
                            absolute
                            bottom-0
                            h-10
                            w-full
                            bg-gradient-to-t
                            from-[#E3BD68]/15
                            to-transparent
                          "
                        />
                      </motion.div>
                    )}
                </AnimatePresence>


                {/* ===========================================
                    FINAL SCORE
                    =========================================== */}

                <AnimatePresence>
                  {animationPhase >=
                    4 && (
                    <motion.div
                      key={`score-${activeData.id}`}
                      initial={{
                        scale: 0.7,
                        opacity: 0,
                        y: 14,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        scale: 0.75,
                        opacity: 0,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.35,
                        duration: 0.7,
                      }}
                      className="
                        absolute
                        left-1/2
                        top-1/2
                        z-40
                        flex
                        w-[155px]
                        -translate-x-1/2
                        -translate-y-1/2
                        flex-col
                        items-center
                        rounded-[14px]
                        border
                        border-[#E1BD69]/45
                        bg-[#0B2942]/95
                        p-4
                        shadow-[0_18px_48px_rgba(0,0,0,.28)]
                        backdrop-blur
                      "
                    >
                      <div
                        className="
                          relative
                          flex
                          h-[76px]
                          w-[76px]
                          items-center
                          justify-center
                        "
                      >
                        <svg
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            -rotate-90
                          "
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#294A60"
                            strokeWidth="6"
                          />

                          <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#E3BD68"
                            strokeWidth="6"
                            strokeLinecap="round"
                            initial={{
                              pathLength: 0,
                            }}
                            animate={{
                              pathLength:
                                activeData.score /
                                100,
                            }}
                            transition={{
                              duration: 1.2,
                              ease: "easeOut",
                              delay: 0.15,
                            }}
                          />
                        </svg>


                        <div
                          className="
                            text-center
                          "
                        >
                          <span
                            className="
                              text-[22px]
                              font-black
                              text-white
                            "
                          >
                            {
                              activeData.score
                            }
                          </span>

                          <span
                            className="
                              ml-0.5
                              text-[8px]
                              font-bold
                              text-[#E3BD68]
                            "
                          >
                            %
                          </span>
                        </div>
                      </div>


                      <h4
                        className="
                          mt-2
                          text-center
                          text-[9px]
                          font-bold
                          leading-[1.3]
                          text-white
                        "
                      >
                        {
                          activeData.title
                        }
                      </h4>


                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          gap-1.5
                          text-[7px]
                          font-medium
                          text-[#9CB1BE]
                        "
                      >
                        <CheckCircle
                          size={11}
                          className="
                            text-[#E3BD68]
                          "
                        />

                        Validated
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


export default ATSResumeAnatomy;
