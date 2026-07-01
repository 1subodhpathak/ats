import React, { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const AnimatedHeroBackground = () => {
  const reduceMotion = useReducedMotion();
  const useStaticBackdrop = useMobilePerformanceMode();

  const { scrollY } = useScroll();
  const scrollRange = [0, 800];

  // LIGHT MODE: Swan Wing, Shellstone, Quicksand blends
  const bgLight1 = useTransform(scrollY, scrollRange, ["#D9CBC2", "#F5F0E9"]);
  const bgLight2 = useTransform(scrollY, scrollRange, ["#F5F0E9", "#E0C58F"]);
  const bgLight3 = useTransform(scrollY, scrollRange, ["#E0C58F", "#D9CBC2"]);

  // DARK MODE: Royal Blue, Sapphire, Quicksand blends
  const bgDark1 = useTransform(scrollY, scrollRange, ["#112250", "#3C507D"]);
  const bgDark2 = useTransform(scrollY, scrollRange, ["#3C507D", "#112250"]);
  const bgDark3 = useTransform(scrollY, scrollRange, ["#E0C58F", "#3C507D"]);

  if (useStaticBackdrop) {
    return <StaticHeroBackground />;
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#F5F0E9] dark:bg-[#112250]">
      {/* 1. STRUCTURAL GRID (Sapphire Blue Base) */}
      <div
        className="absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(60, 80, 125, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(60, 80, 125, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 95% 95% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 95% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* 2. SCROLL-DRIVEN AURORA BLOOMS */}
      <div className="absolute inset-0 opacity-60 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen saturate-125">
        {/* LIGHT MODE ORBS */}
        <div className="block dark:hidden absolute inset-0">
          <motion.div
            style={{ backgroundColor: bgLight1 }}
            animate={
              reduceMotion
                ? undefined
                : {
                  x: ["0%", "40%", "-10%", "0%"],
                  y: ["0%", "30%", "-10%", "0%"],
                }
            }
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px]"
          />

          <motion.div
            style={{ backgroundColor: bgLight2 }}
            animate={
              reduceMotion
                ? undefined
                : {
                  x: ["0%", "-50%", "20%", "0%"],
                  y: ["0%", "-40%", "30%", "0%"],
                }
            }
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-[20%] -right-[10%] w-[45vw] h-[45vw] rounded-full blur-[130px]"
          />

          <motion.div
            style={{ backgroundColor: bgLight3 }}
            animate={
              reduceMotion
                ? undefined
                : {
                  x: ["0%", "60%", "-20%", "0%"],
                  y: ["0%", "-50%", "10%", "0%"],
                }
            }
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-[20%] left-[10%] w-[60vw] h-[40vw] rounded-full blur-[140px]"
          />
        </div>

        {/* DARK MODE ORBS */}
        <div className="hidden dark:block absolute inset-0">
          <motion.div
            style={{ backgroundColor: bgDark1 }}
            animate={
              reduceMotion
                ? undefined
                : {
                  x: ["0%", "40%", "-10%", "0%"],
                  y: ["0%", "30%", "-10%", "0%"],
                }
            }
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-50"
          />

          <motion.div
            style={{ backgroundColor: bgDark2 }}
            animate={
              reduceMotion
                ? undefined
                : {
                  x: ["0%", "-50%", "20%", "0%"],
                  y: ["0%", "-40%", "30%", "0%"],
                }
            }
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-[20%] -right-[10%] w-[45vw] h-[45vw] rounded-full blur-[130px] opacity-60"
          />

          <motion.div
            style={{ backgroundColor: bgDark3 }}
            animate={
              reduceMotion
                ? undefined
                : {
                  x: ["0%", "60%", "-20%", "0%"],
                  y: ["0%", "-50%", "10%", "0%"],
                }
            }
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-[20%] left-[10%] w-[60vw] h-[40vw] rounded-full blur-[140px] opacity-40"
          />
        </div>
      </div>

      {/* 3. INTELLIGENT FLOW LINES (Sapphire to Quicksand) */}
      <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40">
        <defs>
          <linearGradient id="flowLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3C507D" stopOpacity="0" />
            <stop offset="40%" stopColor="#3C507D" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#E0C58F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E0C58F" stopOpacity="0" />
          </linearGradient>

          <filter id="flowGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[
          "M -100 600 C 200 420, 420 260, 720 420 S 1100 620, 1500 300",
          "M -120 250 C 220 120, 420 280, 700 350 S 1100 300, 1500 100",
          "M -100 800 C 260 650, 520 560, 780 690 S 1100 780, 1500 500",
        ].map((path, i) => (
          <motion.path
            key={i}
            d={path}
            fill="none"
            stroke="url(#flowLineGrad)"
            strokeWidth={i === 0 ? 2.2 : 1.6}
            strokeDasharray="420 800"
            filter="url(#flowGlow)"
            animate={
              reduceMotion ? {} : { strokeDashoffset: [0, -1200] }
            }
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}

        {[
          "M 100 -100 C 300 200, 600 250, 900 200 S 1200 300, 1500 700",
        ].map((path, i) => (
          <motion.path
            key={`secondary-${i}`}
            d={path}
            fill="none"
            stroke="url(#flowLineGrad)"
            strokeWidth="1.2"
            strokeDasharray="300 700"
            opacity="0.5"
            animate={
              reduceMotion ? {} : { strokeDashoffset: [0, -1000] }
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>

      {/* 4. SEAMLESS BLEND MASKS */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F5F0E9] dark:from-[#112250] to-transparent z-10" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#F5F0E9] dark:from-[#112250] to-transparent z-10" />
    </div>
  );
};

const StaticHeroBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#F5F0E9] dark:bg-[#112250]">
    <div
      className="absolute inset-0 opacity-45 dark:opacity-30"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(60, 80, 125, 0.15) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(60, 80, 125, 0.15) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
        maskImage:
          "radial-gradient(ellipse 95% 95% at 50% 50%, black 28%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 95% 95% at 50% 50%, black 28%, transparent 100%)",
      }}
    />
    {/* Static gradients adapted for the new palette */}
    <div className="absolute inset-0 block dark:hidden bg-[radial-gradient(circle_at_16%_18%,rgba(217,203,194,0.72),transparent_34%),radial-gradient(circle_at_86%_24%,rgba(224,197,143,0.14),transparent_36%),linear-gradient(180deg,rgba(245,240,233,0.72),rgba(255,255,255,0.46)_58%,rgba(245,240,233,0.92))]" />

    <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_16%_18%,rgba(60,80,125,0.4),transparent_40%),radial-gradient(circle_at_86%_24%,rgba(224,197,143,0.1),transparent_40%),linear-gradient(180deg,rgba(17,34,80,0.8),rgba(17,34,80,0.4)_58%,rgba(17,34,80,0.95))]" />

    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F5F0E9] dark:from-[#112250] to-transparent" />
  </div>
);

const useMobilePerformanceMode = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
};

export default AnimatedHeroBackground;