import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ResumeGameEntry from "./ResumeGameEntry";
import ResumeBuilderGame from "./ResumeBuilderGame";

class ResumeGameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Resume Quest rendering failed:", error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex h-full min-h-[700px] items-center justify-center bg-[#061D2F] px-5 text-center">
        <div className="w-full max-w-md rounded-3xl border border-[#D4A13D]/60 bg-[#0B3858] p-8 text-white shadow-2xl">
          <h1 className="text-2xl font-black">Resume Quest needs to reload</h1>
          <p className="mt-3 text-sm leading-6 text-[#C8D9E2]">
            Your completed resumes and total score are safely stored. Reload the game to continue.
          </p>
          {import.meta.env.DEV ? (
            <p className="mt-3 rounded-xl bg-[#062A42] px-3 py-2 text-left text-xs leading-5 text-[#F4C8C3]">
              {this.state.error?.message || "Unknown Resume Quest error"}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 min-h-11 w-full rounded-xl bg-[#F0C15B] px-5 text-sm font-black text-[#083650] transition hover:bg-[#FFD77E]"
          >
            Reload Resume Quest
          </button>
        </div>
      </div>
    );
  }
}

/* =========================================================
   VAULT DOOR
========================================================= */

function VaultDoor({
  side,
  phase,
}) {
  const isLeft = side === "left";

  const isUnlocking = phase === "unlocking";
  const isOpening = phase === "opening";
  const isClosing = phase === "closing";

  const rumble = isUnlocking
    ? {
        x: [0, -1.5, 1.5, -1, 1, 0],
        y: [0, 1, -1, 1, -1, 0],
        transition: {
          duration: 0.28,
          repeat: Infinity,
          ease: "linear",
        },
      }
    : {
        x: 0,
        y: 0,
      };

  const doorVariants = {
    framed: {
      x: 0,
      transition: {
        duration: isClosing ? 1.05 : 0.4,
        ease: [0.72, 0, 0.18, 1],
      },
    },

    open: {
      x: isLeft ? "-112%" : "112%",
      transition: {
        duration: 1.2,
        ease: [0.76, 0, 0.18, 1],
      },
    },
  };

  return (
    <motion.div
      variants={doorVariants}
      initial={isClosing ? "open" : "framed"}
      animate={isOpening ? "open" : "framed"}
      className={`
        pointer-events-none
        absolute
        bottom-0
        top-0
        z-30
        w-[19vw]
        min-w-[220px]
        max-w-[320px]

        ${isLeft ? "left-0" : "right-0"}
      `}
    >
      <motion.div
        animate={rumble}
        className="relative h-full w-full"
      >
        {/* =================================================
            MAIN DOOR SHAPE
        ================================================= */}

        <div
          className="
            absolute
            inset-0
            overflow-hidden
            bg-[linear-gradient(180deg,#12344D_0%,#08283E_45%,#061E31_100%)]
            shadow-[0_0_55px_rgba(4,24,39,.42)]
          "
          style={{
            clipPath: isLeft
              ? "polygon(0 0,73% 0,73% 11%,88% 18%,88% 34%,97% 40%,97% 60%,88% 66%,88% 82%,73% 90%,73% 100%,0 100%)"
              : "polygon(27% 0,100% 0,100% 100%,27% 100%,27% 90%,12% 82%,12% 66%,3% 60%,3% 40%,12% 34%,12% 18%,27% 11%)",
          }}
        >
          {/* subtle material texture */}
          <div
            className="
              absolute
              inset-0
              opacity-[0.22]
              bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)]
              bg-[length:30px_30px]
            "
          />

          <div
            className={`
              absolute
              inset-y-0
              w-[70%]
              opacity-50

              ${
                isLeft
                  ? "left-0 bg-[radial-gradient(circle_at_right,rgba(34,95,122,.30),transparent_70%)]"
                  : "right-0 bg-[radial-gradient(circle_at_left,rgba(34,95,122,.30),transparent_70%)]"
              }
            `}
          />

          {/* ===============================================
              GOLD FRAME SVG
          =============================================== */}

          <svg
            viewBox="0 0 300 900"
            preserveAspectRatio="none"
            className="
              absolute
              inset-0
              h-full
              w-full
            "
          >
            <defs>
              <filter
                id={`goldGlow-${side}`}
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur
                  stdDeviation={isUnlocking ? "9" : "5"}
                  result="blur"
                />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {isLeft ? (
              <>
                <path
                  d="
                    M218 0
                    L218 96
                    L264 160
                    L264 300
                    L290 360
                    L290 540
                    L264 600
                    L264 740
                    L218 804
                    L218 900
                  "
                  fill="none"
                  stroke="rgba(234,180,71,.28)"
                  strokeWidth="18"
                />

                <path
                  d="
                    M218 0
                    L218 96
                    L264 160
                    L264 300
                    L290 360
                    L290 540
                    L264 600
                    L264 740
                    L218 804
                    L218 900
                  "
                  fill="none"
                  stroke="#E8B64E"
                  strokeWidth={isUnlocking ? "6" : "4"}
                  filter={`url(#goldGlow-${side})`}
                />
              </>
            ) : (
              <>
                <path
                  d="
                    M82 0
                    L82 96
                    L36 160
                    L36 300
                    L10 360
                    L10 540
                    L36 600
                    L36 740
                    L82 804
                    L82 900
                  "
                  fill="none"
                  stroke="rgba(234,180,71,.28)"
                  strokeWidth="18"
                />

                <path
                  d="
                    M82 0
                    L82 96
                    L36 160
                    L36 300
                    L10 360
                    L10 540
                    L36 600
                    L36 740
                    L82 804
                    L82 900
                  "
                  fill="none"
                  stroke="#E8B64E"
                  strokeWidth={isUnlocking ? "6" : "4"}
                  filter={`url(#goldGlow-${side})`}
                />
              </>
            )}
          </svg>

          {/* ===============================================
              SIDE TEXT
          =============================================== */}

          <div
            className={`
              absolute
              top-[37%]
              z-20

              ${isLeft ? "left-[15%]" : "right-[15%]"}
            `}
          >
            <p
              className="
                text-center
                text-[13px]
                font-black
                uppercase
                leading-[1.65]
                tracking-[0.35em]
                text-[#E2B65B]
              "
            >
              Your
              <br />
              Potential
              <br />
              Awaits
            </p>

            <div
              className="
                mx-auto
                mt-5
                h-[2px]
                w-[38px]
                bg-[#D79D2C]
              "
            />
          </div>
        </div>

        {/* =================================================
            LOCK HALF
        ================================================= */}

        <div
          className={`
            absolute
            top-1/2
            z-40
            h-[205px]
            w-[205px]
            -translate-y-1/2

            ${isLeft ? "right-[-72px]" : "left-[-72px]"}
          `}
        >
          {/* outer glow */}
          <motion.div
            animate={{
              boxShadow: isUnlocking
                ? [
                    "0 0 20px rgba(231,181,80,.25)",
                    "0 0 58px rgba(231,181,80,.95)",
                    "0 0 20px rgba(231,181,80,.25)",
                  ]
                : "0 0 22px rgba(231,181,80,.18)",
            }}
            transition={{
              duration: 0.65,
              repeat: isUnlocking ? Infinity : 0,
            }}
            className="
              absolute
              inset-0
              rounded-full
              border-[3px]
              border-[#C8963C]/70
              bg-[#092B43]
            "
          />

          {/* rotating outer ring */}
          <motion.div
            animate={{
              rotate: isUnlocking
                ? isLeft
                  ? 145
                  : -145
                : 0,
            }}
            transition={{
              duration: 0.9,
              ease: [0.68, -0.35, 0.32, 1.25],
            }}
            className="
              absolute
              inset-[15px]
              rounded-full
              border-[2px]
              border-[#E4B04C]/80
            "
          >
            <span
              className="
                absolute
                left-1/2
                top-[-5px]
                h-[10px]
                w-[10px]
                -translate-x-1/2
                rounded-full
                bg-[#F2C763]
                shadow-[0_0_12px_rgba(242,199,99,.8)]
              "
            />

            <span
              className="
                absolute
                bottom-[-5px]
                left-1/2
                h-[10px]
                w-[10px]
                -translate-x-1/2
                rounded-full
                bg-[#F2C763]
                shadow-[0_0_12px_rgba(242,199,99,.8)]
              "
            />
          </motion.div>

          {/* middle ring */}
          <motion.div
            animate={{
              rotate: isUnlocking
                ? isLeft
                  ? -100
                  : 100
                : 0,
            }}
            transition={{
              duration: 0.85,
              ease: "easeInOut",
            }}
            className="
              absolute
              inset-[35px]
              rounded-full
              border
              border-[#D6A245]/55
            "
          />

          {/* center */}
          <div
            className="
              absolute
              inset-[58px]
              rounded-full
              border
              border-[#DAA946]/50
              bg-[radial-gradient(circle,#D6A44A_0%,#A87320_30%,#0D324A_72%)]
              shadow-[inset_0_0_22px_rgba(0,0,0,.35)]
            "
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   PARTICLES
========================================================= */

const particles = [
  { left: "25%", top: "28%", delay: 0.1 },
  { left: "30%", top: "65%", delay: 0.7 },
  { left: "34%", top: "20%", delay: 1.2 },
  { left: "42%", top: "73%", delay: 0.4 },
  { left: "50%", top: "24%", delay: 1.4 },
  { left: "58%", top: "67%", delay: 0.9 },
  { left: "66%", top: "32%", delay: 0.3 },
  { left: "72%", top: "58%", delay: 1.5 },
];

function GoldParticles({
  active,
}) {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-20
      "
    >
      {particles.map(
        (
          particle,
          index
        ) => (
          <motion.span
            key={index}
            className="
              absolute
              h-[3px]
              w-[3px]
              rounded-full
              bg-[#F0C36B]
              shadow-[0_0_9px_rgba(240,195,107,.85)]
            "
            style={{
              left:
                particle.left,

              top:
                particle.top,
            }}
            animate={{
              opacity: active
                ? [0.15, 1, 0.15]
                : [0.12, 0.55, 0.12],

              y: active
                ? [0, -22, -40]
                : [0, -8, 0],

              scale: active
                ? [0.7, 1.5, 0.5]
                : [0.7, 1.1, 0.7],
            }}
            transition={{
              duration: active
                ? 1.2
                : 3.5,

              repeat: Infinity,

              delay:
                particle.delay,

              ease: "easeInOut",
            }}
          />
        )
      )}
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ResumeGamePage() {
  const [phase, setPhase] =
    useState("idle");

  const handleStart = () => {
    if (phase !== "idle") {
      return;
    }

    /* charge the vault */
    setPhase("unlocking");

    /* release the doors */
    setTimeout(() => {
      setPhase("opening");

      setTimeout(() => {
        setPhase("done");
      }, 1350);
    }, 950);
  };

  const handleBackToEntry =
    () => {
      if (phase !== "done") {
        return;
      }

      setPhase("closing");

      setTimeout(() => {
        setPhase("idle");
      }, 1150);
    };

  const isDone =
    phase === "done";

  const isUnlocking =
    phase === "unlocking";

  const isOpening =
    phase === "opening";

  const isClosing =
    phase === "closing";

  return (
    <div
      className="
        relative
        h-[100dvh]
        min-h-0
        w-full
        overflow-hidden
        bg-[#061D2F]
      "
    >
      {/* ===================================================
          ACTUAL GAME
      =================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0
        "
      >
        <ResumeGameErrorBoundary>
          <ResumeBuilderGame
            audioActive={isDone}
            onBackToEntry={
              handleBackToEntry
            }
          />
        </ResumeGameErrorBoundary>
      </div>

      {/* ===================================================
          VAULT ENTRY
      =================================================== */}

      <AnimatePresence>
        {!isDone && (
          <motion.div
            key="vault-entry"
            initial={{
              opacity:
                isClosing ? 1 : 1,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.22,
              },
            }}
            className="
              absolute
              inset-0
              z-[9999]
              overflow-hidden
            "
          >
            {/* =============================================
                ENTRY PAGE
            ============================================= */}

            <motion.div
              initial={{
                opacity:
                  isClosing ? 0 : 1,
              }}
              animate={{
                opacity:
                  phase === "idle"
                    ? 1
                    : isClosing
                    ? 1
                    : isUnlocking
                    ? 0.92
                    : 0,
              }}
              transition={{
                duration: 0.5,
                delay:
                  isClosing
                    ? 0.45
                    : 0,
              }}
              className="
                absolute
                inset-0
                z-10
              "
            >
              <ResumeGameEntry
                onStart={
                  handleStart
                }
                onBack={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.assign("/dashboard");
                  }
                }}
              />
            </motion.div>

            {/* =============================================
                CENTRAL WARM LIGHT
            ============================================= */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: isOpening
                  ? [0, 0.85, 0]
                  : isUnlocking
                  ? 0.25
                  : 0,

                scale: isOpening
                  ? [0.8, 1.35, 2]
                  : 0.8,
              }}
              transition={{
                duration:
                  isOpening
                    ? 0.9
                    : 0.4,

                ease:
                  "easeOut",
              }}
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                z-20
                h-[85vh]
                w-[55vw]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#FFE3A1]
                blur-[120px]
                mix-blend-screen
              "
            />

            {/* particles */}
            <GoldParticles
              active={
                isUnlocking ||
                isOpening
              }
            />

            {/* =============================================
                LEFT VAULT
            ============================================= */}

            <VaultDoor
              side="left"
              phase={phase}
            />

            {/* =============================================
                RIGHT VAULT
            ============================================= */}

            <VaultDoor
              side="right"
              phase={phase}
            />

            {/* =============================================
                UNLOCK STATUS
            ============================================= */}

            <AnimatePresence>
              {isUnlocking && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="
                    pointer-events-none
                    absolute
                    bottom-[38px]
                    left-1/2
                    z-50
                    -translate-x-1/2
                  "
                >
                  <div
                    className="
                      rounded-full
                      border
                      border-[#E8BA59]/40
                      bg-[#08293F]/92
                      px-5
                      py-2
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.28em]
                      text-[#F0C86D]
                      shadow-[0_0_25px_rgba(231,181,80,.18)]
                    "
                  >
                    Unlocking Career Potential
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
