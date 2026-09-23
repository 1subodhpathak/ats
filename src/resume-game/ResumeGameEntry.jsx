import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Gamepad2,
  Play,
  Trophy,
} from "lucide-react";

import backgroundMusic from "./Background.mp3";
import careerSenseLogo from "../assets/logos/BlueLogo.png";

/* =========================================================
   TYPEWRITER
========================================================= */

function TypewriterText({
  text,
  delay = 0,
}) {
  const letters =
    Array.from(text);

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {
          opacity: 0,
        },

        visible: {
          opacity: 1,

          transition: {
            staggerChildren:
              0.035,

            delayChildren:
              delay,
          },
        },
      }}
      className="
        flex
        flex-wrap
        justify-center
        text-center
        text-[44px]
        font-black
        leading-none
        tracking-[-0.055em]
        text-[#0C3A59]

        md:text-[51px]

        xl:text-[58px]
      "
    >
      {letters.map(
        (
          letter,
          index
        ) => (
          <motion.span
            key={index}
            variants={{
              hidden: {
                opacity: 0,
                y: 10,
                filter:
                  "blur(2px)",
              },

              visible: {
                opacity: 1,
                y: 0,
                filter:
                  "blur(0px)",

                transition: {
                  type:
                    "spring",

                  damping: 18,

                  stiffness: 230,
                },
              },
            }}
          >
            {letter === " "
              ? "\u00A0"
              : letter}
          </motion.span>
        )
      )}

      <motion.span
        animate={{
          opacity: [
            0,
            1,
            0,
          ],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
        }}
        className="
          ml-1
          inline-block
          w-[3px]
          rounded-full
          bg-[#C99127]
        "
      >
        &nbsp;
      </motion.span>
    </motion.h1>
  );
}

/* =========================================================
   BRAND
========================================================= */

function CareerSenseBrand() {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-3
      "
    >
      <img
        src={
          careerSenseLogo
        }
        alt=""
        className="
          h-[60px]
          w-[60px]
          object-contain
        "
      />

      <div className="text-left">
        <p
          className="
            whitespace-nowrap
            text-[29px]
            font-black
            leading-none
            tracking-[-0.045em]
            text-[#0B3A5C]
          "
        >
          Career
          <span className="text-[#C8891C]">
            Sense
          </span>
        </p>

        <p
          className="
            mt-1.5
            text-[8px]
            font-black
            uppercase
            tracking-[0.31em]
            text-[#58778A]
          "
        >
          ATS Intelligence
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FEATURE
========================================================= */

function Feature({
  icon: Icon,
  title,
  copy,
  blue = false,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="
        flex
        flex-col
        items-center
        text-center
      "
    >
      <div
        className={`
          flex
          h-[52px]
          w-[52px]
          items-center
          justify-center
          rounded-full

          ${
            blue
              ? "bg-[#E4F2F7] text-[#245F7C]"
              : "bg-[#FFF0CD] text-[#B87A10]"
          }
        `}
      >
        <Icon
          className="h-[21px] w-[21px]"
          strokeWidth={2}
        />
      </div>

      <p
        className="
          mt-3
          text-[11px]
          font-black
          text-[#103B55]
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          max-w-[145px]
          text-[8px]
          font-medium
          leading-[1.45]
          text-[#71899A]
        "
      >
        {copy}
      </p>
    </motion.div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ResumeGameEntry({
  onStart,
  onBack,
}) {
  const musicRef = useRef(null);

  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return undefined;

    const startMusic = () => {
      audio.volume = 0.15;
      audio.play().catch(() => {
        // Browsers may require a user gesture before starting audio.
      });
    };

    const unlockMusic = () => startMusic();
    startMusic();
    window.addEventListener("pointerdown", unlockMusic, { once: true });
    window.addEventListener("keydown", unlockMusic, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockMusic);
      window.removeEventListener("keydown", unlockMusic);
      audio.pause();
    };
  }, []);

  const handleStart = () => {
    musicRef.current?.pause();
    onStart?.();
  };

  return (
    <div
      className="
        relative
        h-full
        w-full
        overflow-hidden
        bg-[#F8F0E4]
      "
    >
      <audio
        ref={musicRef}
        autoPlay
        loop
        src={
          backgroundMusic
        }
        className="hidden"
      />

      {/* ===============================================
          WORKSPACE VIDEO
      =============================================== */}

      <video
        autoPlay
        muted
        loop
        playsInline
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      >
        <source
          src="https://d7exlrhix3get.cloudfront.net/ats-background.mp4"
          type="video/mp4"
        />
      </video>

      {/* warm wash */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[rgba(255,249,238,.42)]
        "
      />

      {/* central readability */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[700px]
          w-[950px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#FFF9EF]/50
          blur-[100px]
        "
      />

      {/* ===============================================
          CENTER CONTENT
      =============================================== */}

      <main
        className="
          relative
          z-10
          mx-auto
          flex
          h-full
          w-full
          max-w-[920px]
          flex-col
          items-center
          justify-center
          px-6
          text-center
        "
      >
        <motion.button
          type="button"
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute left-6 top-6 inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-[#C9A65E] bg-[#FFF9ED]/95 px-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#123A54] shadow-[0_8px_20px_rgba(18,58,84,.10)] transition hover:border-[#B87812] hover:bg-[#FFF1D3]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </motion.button>

        {/* brand */}
        <motion.div
          initial={{
            opacity: 0,
            y: -12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
        >
          <CareerSenseBrand />
        </motion.div>

        {/* eyebrow */}
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.18,
            duration: 0.5,
          }}
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-3
          "
        >
          <span
            className="
              h-px
              w-[33px]
              bg-[#CA8D24]
            "
          />

          <Gamepad2
            className="
              h-[17px]
              w-[17px]
              text-[#B77811]
            "
          />

          <p
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[0.31em]
              text-[#B77811]
            "
          >
            Resume Builder Game
          </p>

          <span
            className="
              h-px
              w-[33px]
              bg-[#CA8D24]
            "
          />
        </motion.div>

        {/* title */}
        <div className="mt-5">
          <TypewriterText
            text="Build. Learn. Conquer."
            delay={0.3}
          />
        </div>

        <motion.p
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.05,
            duration: 0.55,
          }}
          className="
            mt-5
            text-[16px]
            font-bold
            tracking-[-0.025em]
            text-[#587A90]

            xl:text-[18px]
          "
        >
          Master the art of resume crafting through gameplay.
        </motion.p>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.3,
            duration: 0.6,
          }}
          className="
            mt-2
            text-[10px]
            font-medium
            text-[#748D9E]
          "
        >
          Drag, sort, and sharpen your resume instincts before the real
          application begins.
        </motion.p>

        {/* =============================================
            FEATURES
        ============================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.5,
            duration: 0.55,
          }}
          className="
            mt-8
            grid
            w-full
            max-w-[560px]
            grid-cols-3
            gap-6
          "
        >
          <Feature
            icon={
              Gamepad2
            }
            title="Learn by Doing"
            copy="Turn resume tips into hands-on practice."
          />

          <Feature
            icon={
              BarChart3
            }
            blue
            title="Build Confidence"
            copy="Improve your resume with real-world scenarios."
          />

          <Feature
            icon={
              Trophy
            }
            title="Get Career Ready"
            copy="Develop the skills to stand out."
          />
        </motion.div>

        {/* =============================================
            PLAY
        ============================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.75,
            duration: 0.55,
          }}
          className="
            mt-8
            w-full
            max-w-[390px]
          "
        >
          <button
            type="button"
            onClick={handleStart}
            className="
              group
              relative
              flex
              h-[62px]
              w-full
              items-center
              justify-between
              overflow-hidden
              rounded-[20px]
              border
              border-[#174F6C]
              bg-[#084B6D]
              px-7
              text-white
              shadow-[0_16px_34px_rgba(11,66,95,.18)]
              transition-all
              duration-300

              hover:-translate-y-[3px]
              hover:bg-[#063F5D]
              hover:shadow-[0_22px_38px_rgba(11,66,95,.24)]

              active:translate-y-0
              active:scale-[.99]
            "
          >
            {/* shine */}
            <span
              className="
                pointer-events-none
                absolute
                inset-0
                -translate-x-[120%]
                bg-[linear-gradient(100deg,transparent,rgba(255,255,255,.14),transparent)]
                transition-transform
                duration-700

                group-hover:translate-x-[120%]
              "
            />

            <span
              className="
                relative
                z-10
                flex
                items-center
                gap-4
                text-[15px]
                font-black
              "
            >
              <Play
                className="
                  h-[18px]
                  w-[18px]
                  fill-white
                "
              />

              Play With Resume
            </span>

            <ArrowRight
              className="
                relative
                z-10
                h-[17px]
                w-[17px]
                transition-transform

                group-hover:translate-x-1
              "
            />
          </button>

          <motion.p
            animate={{
              opacity: [
                0.45,
                0.9,
                0.45,
              ],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
            }}
            className="
              mt-4
              text-[7px]
              font-black
              uppercase
              tracking-[0.32em]
              text-[#688699]
            "
          >
            Press Play to enter the game
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
