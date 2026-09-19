import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coins,
  FileSearch,
  FileText,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import chooseBackground from "../assets/home/Choose.png";

/* =========================================================
   DATA
========================================================= */

const options = [
  {
    to: "/check-ats/resume",
    title: "Check ATS Using Resume",
    badge: "FAST SCAN",
    eyebrow: "QUICK & SIMPLE",
    description:
      "Upload a resume and get a 50-point ATS report covering structure, readability, keywords, impact, and recruiter readiness.",
    icon: FileText,
    features: ["Resume structure", "Readability score"],
    tokenRange: "8,000–20,000 tokens",
    tone: "gold",
  },

  {
    to: "/check-ats/resume-jd",
    title: "Check ATS Using Resume and JD",
    badge: "BEST RESULT",
    eyebrow: "DEEPER INSIGHTS",
    description:
      "Upload a resume, add the job description, and get a 50-point ATS report focused on match quality, keyword gaps, and role alignment.",
    icon: Target,
    features: ["Keyword gaps", "Role alignment"],
    tokenRange: "8,000–30,000 tokens",
    tone: "blue",
  },
];

const benefits = [
  {
    title: "ATS-Friendly Review",
    text:
      "Clean scoring designed to show what may block your resume before it reaches recruiters.",
    icon: FileSearch,
  },
  {
    title: "Smart Matching",
    text:
      "Compare your resume against the role and understand exactly what needs improvement.",
    icon: Sparkles,
  },
  {
    title: "Clear Next Steps",
    text:
      "See what to improve before you send your resume to recruiters.",
    icon: Zap,
  },
];

/* =========================================================
   OPTION CARD
========================================================= */

function ATSOptionCard({ option }) {
  const {
    to,
    title,
    badge,
    eyebrow,
    description,
    icon: Icon,
    features,
    tokenRange,
    tone,
  } = option;

  const isGold = tone === "gold";

  return (
    <Link
      to={to}
      className="
        group
        block
        w-full
        rounded-[22px]
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#C98B24]
        focus-visible:ring-offset-2
      "
    >
      <article
        className={`
          relative
          overflow-hidden
          rounded-[22px]
          border
          bg-white/95
          px-5
          py-[18px]
          shadow-[0_13px_35px_rgba(18,45,66,0.06)]
          transition-all
          duration-300

          group-hover:-translate-y-[2px]
          group-hover:shadow-[0_20px_45px_rgba(18,45,66,0.10)]

          sm:px-6

          ${
            isGold
              ? "border-[#E8D4A9] group-hover:border-[#D8B15E]"
              : "border-[#CFE0E8] group-hover:border-[#99BFD0]"
          }
        `}
      >
        {/* tint */}
        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            inset-0

            ${
              isGold
                ? "bg-[radial-gradient(circle_at_8%_22%,rgba(242,190,81,0.10),transparent_34%)]"
                : "bg-[radial-gradient(circle_at_8%_22%,rgba(99,164,199,0.11),transparent_34%)]"
            }
          `}
        />

        {/* waves */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-[48px]
            right-[-25px]
            h-[110px]
            w-[280px]
            opacity-[0.30]
          "
        >
          {Array.from({ length: 7 }).map((_, index) => (
            <span
              key={index}
              className="
                absolute
                right-0
                block
                rounded-[50%]
                border-t
              "
              style={{
                bottom: index * 7,
                width: 260 - index * 12,
                height: 88 - index * 2,
                borderColor: isGold
                  ? "rgba(203,151,47,.48)"
                  : "rgba(88,145,177,.46)",
                transform: "rotate(-4deg)",
              }}
            />
          ))}
        </div>

        <div
          className="
            relative
            z-10
            grid
            items-center
            gap-4
            md:grid-cols-[62px_minmax(0,1fr)_48px]
          "
        >
          {/* icon */}
          <div
            className={`
              flex
              h-[56px]
              w-[56px]
              shrink-0
              items-center
              justify-center
              rounded-[16px]
              border

              ${
                isGold
                  ? `
                    border-[#E6C77A]
                    bg-[#FFF3D7]
                    text-[#153A53]
                  `
                  : `
                    border-[#B8D3E0]
                    bg-[#E3F1F7]
                    text-[#153A53]
                  `
              }
            `}
          >
            <Icon size={25} strokeWidth={2} />
          </div>

          {/* copy */}
          <div className="min-w-0">
            <span
              className={`
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]

                ${isGold ? "text-[#B77B18]" : "text-[#4D758C]"}
              `}
            >
              {eyebrow}
            </span>

            <div
              className="
                mt-1
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-1.5
              "
            >
              <h2
                className="
                  text-[18px]
                  font-black
                  leading-[1.08]
                  tracking-[-0.035em]
                  text-[#102F4A]

                  sm:text-[19px]
                  xl:text-[20px]
                "
              >
                {title}
              </h2>

              <span
                className={`
                  rounded-full
                  border
                  px-3
                  py-[5px]
                  text-[7px]
                  font-black
                  uppercase
                  tracking-[0.14em]

                  ${
                    isGold
                      ? `
                        border-[#E3C16D]
                        bg-[#FFF4D9]
                        text-[#9E6710]
                      `
                      : `
                        border-[#B6D0DD]
                        bg-[#EAF4F9]
                        text-[#315E77]
                      `
                  }
                `}
              >
                {badge}
              </span>
            </div>

            <p
              className="
                mt-2
                max-w-[700px]
                text-[11px]
                font-medium
                leading-[1.45]
                text-[#607D91]

                sm:text-[11.5px]
              "
            >
              {description}
            </p>

            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-x-6
                gap-y-1.5
              "
            >
              {features.map((feature) => (
                <div
                  key={feature}
                  className="
                    flex
                    items-center
                    gap-2
                    text-[9.5px]
                    font-bold
                    text-[#315B73]
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

                      ${
                        isGold
                          ? "bg-[#DCA53A] text-white"
                          : "bg-[#76A2B8] text-white"
                      }
                    `}
                  >
                    <Check size={9} strokeWidth={3} />
                  </span>

                  {feature}
                </div>
              ))}

              <div
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  px-2.5
                  py-1
                  text-[8.5px]
                  font-black
                  text-[#315B73]

                  ${
                    isGold
                      ? "border-[#E3C16D] bg-[#FFF4D9]"
                      : "border-[#B6D0DD] bg-[#EAF4F9]"
                  }
                `}
                aria-label={`Estimated token usage: ${tokenRange}`}
              >
                <Coins
                  size={12}
                  strokeWidth={2.2}
                  className={isGold ? "text-[#B77B18]" : "text-[#4D758C]"}
                  aria-hidden="true"
                />
                <span>Estimated usage: {tokenRange}</span>
              </div>
            </div>
          </div>

          {/* arrow */}
          <div className="hidden items-center justify-end md:flex">
            <div
              className={`
                flex
                h-[44px]
                w-[44px]
                items-center
                justify-center
                rounded-full
                transition-all
                duration-300

                group-hover:translate-x-1

                ${
                  isGold
                    ? "bg-[#FFF0C9] text-[#123A54]"
                    : "bg-[#0A3959] text-white"
                }
              `}
            >
              <ArrowRight size={20} strokeWidth={2.2} />
            </div>
          </div>

          {/* mobile arrow */}
          <div className="flex justify-end md:hidden">
            <ArrowRight
              size={18}
              className="
                text-[#123A54]
                transition-transform
                group-hover:translate-x-1
              "
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

/* =========================================================
   MAIN
========================================================= */

function ATSCheckStart() {
  return (
    <main
      className="
        brand-type
        relative
        min-h-[100dvh]
        w-full
        overflow-hidden
        bg-[#FAF8F4]
      "
    >
      <Link
        to="/dashboard"
        aria-label="Back to dashboard"
        className="
          group
          absolute
          right-5
          top-5
          z-30
          inline-flex
          min-h-11
          items-center
          gap-2
          rounded-full
          border
          border-white/25
          bg-[#0B3858]/75
          px-3.5
          text-[10px]
          font-extrabold
          text-white
          shadow-[0_8px_24px_rgba(2,29,48,0.14)]
          backdrop-blur-sm
          transition
          duration-200
          hover:border-[#F1C760]/65
          hover:bg-[#124663]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#F1C760]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-[#062B46]

          sm:right-8
          lg:right-10
          lg:top-7
          lg:border-[#C9D7DF]
          lg:bg-[#FAFBFC]/90
          lg:text-[#244A63]
          lg:shadow-none
          lg:hover:border-[#D4A13D]
          lg:hover:bg-[#FFF7E6]
          lg:focus-visible:ring-[#C98B24]
          lg:focus-visible:ring-offset-[#FAFBFC]

          xl:right-12
          2xl:right-[56px]
        "
      >
        <ArrowLeft
          size={15}
          strokeWidth={2.2}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        <span>Back</span>
      </Link>

      <section
        className="
          grid
          min-h-[100dvh]
          w-full
          items-stretch

          lg:h-[100dvh]
          lg:min-h-0
          lg:grid-cols-[39%_61%]
        "
      >
        {/* =====================================================
            LEFT PANEL
        ====================================================== */}

        <aside
          className="
            relative
            isolate
            flex
            min-h-[620px]
            overflow-hidden
            bg-[#062B46]
            px-6
            py-8
            text-white

            sm:px-9

            lg:h-full
            lg:min-h-0
            lg:px-10
            lg:py-8

            xl:px-12
            xl:py-9

            2xl:px-[56px]
          "
        >
          {/* =================================================
              BACKGROUND IMAGE

              Important:
              opacity increased substantially.
              Dark overlay is lighter than before.
          ================================================= */}

          <img
            src={chooseBackground}
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              h-full
              w-full
              scale-[1.02]
              object-cover
              opacity-[1.00]

              lg:object-[center_68%]
            "
          />

          {/* left readability gradient */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
            "
            style={{
              background:
                "linear-gradient(90deg, rgba(3,34,56,.92) 0%, rgba(3,34,56,.80) 50%, rgba(3,34,56,.58) 100%)",
            }}
          />

          {/* vertical wash — reduced intensity */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
            "
            style={{
              background:
                "linear-gradient(180deg, rgba(4,40,64,.34) 0%, rgba(2,29,48,.46) 58%, rgba(1,22,38,.72) 100%)",
            }}
          />

          {/* subtle light on background */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-[100px]
              top-[120px]
              h-[430px]
              w-[430px]
              rounded-full
              bg-[#5187A2]/10
              blur-[90px]
            "
          />

          {/* gold arc */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-[175px]
              top-[105px]
              h-[440px]
              w-[440px]
              rounded-full
              border
              border-[#D29B37]/35
            "
          />

          {/* content */}
          <div
            className="
              relative
              z-10
              flex
              w-full
              flex-1
              flex-col
            "
          >
            {/* eyebrow */}
            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2.5
                rounded-full
                border
                border-[#D9A849]/60
                bg-[#0B3858]/65
                px-4
                py-2
                backdrop-blur-[4px]
              "
            >
              

              <span
                className="
                  text-[8.5px]
                  font-black
                  uppercase
                  tracking-[0.20em]
                  text-[#F2CB6A]
                "
              >
                ATS Resume Checker
              </span>
            </div>

            {/* headline */}
            <h1
              className="
                mt-6
                max-w-[525px]
                text-[38px]
                font-black
                leading-[0.98]
                tracking-[-0.055em]
                text-white

                sm:text-[43px]
                lg:text-[41px]
                xl:text-[46px]
                2xl:text-[49px]
              "
            >
              Choose the right
              <br />
              ATS check for
              <br />

              <span className="text-[#F1C760]">
                your next opportunity.
              </span>
            </h1>

            {/* description */}
            <p
              className="
                mt-5
                max-w-[500px]
                text-[12px]
                font-medium
                leading-[1.58]
                text-[#C8D8E3]

                xl:text-[12.5px]
              "
            >
              Pick a starting point based on what you have. Scan your
              resume on its own, or add the job description for a deeper
              match analysis.
            </p>

            {/* benefits */}
            <div
              className="
                mt-7
                grid
                max-w-[560px]
                gap-4

                sm:grid-cols-3
                xl:gap-5
              "
            >
              {benefits.map(({ title, text, icon: Icon }) => (
                <div key={title} className="min-w-0">
                  <div
                    className="
                      flex
                      h-[44px]
                      w-[44px]
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#78A1B9]/35
                      bg-[#164864]/80
                      text-white
                      shadow-[0_7px_20px_rgba(0,0,0,0.13)]
                      backdrop-blur-sm
                    "
                  >
                    <Icon size={19} strokeWidth={1.9} />
                  </div>

                  <h3
                    className="
                      mt-3
                      text-[11.5px]
                      font-extrabold
                      leading-[1.18]
                      text-white
                    "
                  >
                    {title}
                  </h3>

                  <p
                    className="
                      mt-1.5
                      max-w-[155px]
                      text-[9px]
                      font-medium
                      leading-[1.45]
                      text-[#AFC4D1]
                    "
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* quote - bottom anchored */}
            <div
              className="
                mt-10
                hidden

                lg:mt-auto
                lg:block
                lg:pt-6
              "
            >
              <div className="flex items-start gap-3">
                <span
                  className="
                    -mt-1
                    font-serif
                    text-[34px]
                    font-bold
                    leading-none
                    text-[#F0C761]
                  "
                >
                  “
                </span>

                <div>
                  <p
                    className="
                      max-w-[370px]
                      text-[10px]
                      font-medium
                      italic
                      leading-[1.5]
                      text-[#CDD9E1]
                    "
                  >
                    A stronger resume starts with knowing what recruiters
                    and ATS systems actually see.
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="h-px w-9 bg-[#C98B24]" />

                    <span
                      className="
                        text-[7.5px]
                        font-black
                        uppercase
                        tracking-[0.27em]
                        text-[#DEE6EB]
                      "
                    >
                      CareerSense
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* =====================================================
            RIGHT PANEL
        ====================================================== */}

        <div
          className="
            relative
            flex
            min-h-[620px]
            overflow-hidden
            bg-[#FAFBFC]
            px-5
            py-7

            sm:px-8

            lg:h-full
            lg:min-h-0
            lg:px-10
            lg:py-7

            xl:px-12
            xl:py-8

            2xl:px-[56px]
          "
        >
          {/* soft cool atmosphere */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-[130px]
              -top-[140px]
              h-[540px]
              w-[540px]
              rounded-full
              bg-[#E8EFF6]/70
              blur-[110px]
            "
          />

          {/* large gold arc */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-[260px]
              top-[40px]
              h-[520px]
              w-[520px]
              rounded-full
              border
              border-[#D5A352]/22
            "
          />

          <div
            className="
              relative
              z-10
              mx-auto
              flex
              w-full
              max-w-[1020px]
              flex-1
              flex-col
            "
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <header>
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-[#C98B24]" />

                <span
                  className="
                    text-[8.5px]
                    font-black
                    uppercase
                    tracking-[0.28em]
                    text-[#71879A]
                  "
                >
                  Choose your path
                </span>
              </div>

              <h2
                className="
                  mt-4
                  text-[34px]
                  font-black
                  leading-[1]
                  tracking-[-0.05em]
                  text-[#102D47]

                  sm:text-[38px]
                  xl:text-[41px]
                "
              >
                Choose your starting point
              </h2>

              <p
                className="
                  mt-2
                  text-[12px]
                  font-medium
                  text-[#768C9E]

                  sm:text-[12.5px]
                "
              >
                You can run a quick resume scan or add the job description
                for deeper matching.
              </p>

              {/* progress */}
              <div
                aria-hidden="true"
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    flex
                    h-[18px]
                    w-[18px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FFF0C9]
                  "
                >
                  <span className="h-[7px] w-[7px] rounded-full bg-[#D9971D]" />
                </span>

                <span className="h-px w-14 bg-[#DFC996]" />

                <span className="h-[10px] w-[10px] rounded-full bg-[#D8DEE3]" />

                <span className="h-px w-14 bg-[#D8DEE3]" />

                <span className="h-[10px] w-[10px] rounded-full bg-[#A8B6C2]" />
              </div>
            </header>

            {/* =================================================
                CARDS
            ================================================= */}

            <div
              className="
                mt-6
                space-y-4

                xl:mt-7
                xl:space-y-[17px]
              "
            >
              {options.map((option) => (
                <ATSOptionCard key={option.to} option={option} />
              ))}
            </div>

            {/* =================================================
                FOOTER INFO
            ================================================= */}

            <div
              className="
                mt-7
                border-t
                border-[#DCE2E6]
                pt-4

                lg:mt-auto
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-4

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-[9.5px]
                      font-extrabold
                      text-[#254A64]
                    "
                  >
                    Not sure which one to choose?
                  </p>

                  <p
                    className="
                      mt-1
                      text-[9px]
                      font-medium
                      text-[#7890A0]
                    "
                  >
                    Resume + JD gives you the most complete match analysis.
                  </p>
                </div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#FFF6E2]
                    px-4
                    py-2
                  "
                >
                  <Target size={13} className="text-[#B77B18]" />

                  <span
                    className="
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.08em]
                      text-[#9E6C17]
                    "
                  >
                    Best result: Resume + JD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ATSCheckStart;
