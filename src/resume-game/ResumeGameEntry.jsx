import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import backgroundMusic from "./Background.mp3";

const TypewriterText = ({ text, className, delay = 0 }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      textShadow: "0px 0px 12px rgba(224, 197, 143, 0.45)",
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)",
      textShadow: "0px 0px 0px rgba(224, 197, 143, 0)",
    },
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap justify-center ${className}`}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="ml-2 inline-block w-[1ch] bg-quicksand"
      >
        &nbsp;
      </motion.span>
    </motion.h1>
  );
};

export default function ResumeGameEntry({ onStart }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040814] text-swanwing selection:bg-quicksand/30 selection:text-royalblue">
      <audio autoPlay loop src={backgroundMusic} className="hidden" />
      <video className="absolute inset-0 h-full w-full object-cover opacity-80" autoPlay muted loop playsInline>
        <source src="/Background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,16,33,0.26),rgba(4,8,20,0.82)_58%,rgba(3,6,15,0.98)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,20,0.42),rgba(4,8,20,0.94))]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(224,197,143,0.06),rgba(60,80,125,0.04),rgba(224,197,143,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-swanwing/90 transition hover:text-quicksand"
          >
            <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            Resume Quest
          </Link>

          <Link
            to="/"
            className="group relative inline-flex items-center overflow-hidden rounded-full border border-quicksand/30 bg-slate-950/55 px-6 py-2 text-xs font-bold uppercase tracking-[0.24em] text-swanwing backdrop-blur-md transition-all hover:border-quicksand/55 hover:text-white hover:shadow-[0_0_15px_rgba(224,197,143,0.28)]"
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-quicksand/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-6 py-2 text-xs font-black uppercase tracking-[0.3em] text-quicksand"
              >
                <Terminal className="h-4 w-4 animate-pulse" />
                Resume Builder Game Lobby Ready
              </motion.div>

              <TypewriterText
                text="BUILD. LEARN. CONQUER."
                className="text-5xl font-black uppercase tracking-[0.08em] text-white sm:text-6xl lg:text-6xl"
                delay={0.3}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="mx-auto max-w-4xl text-xl font-medium tracking-[0.14em] text-swanwing sm:text-2xl lg:text-2xl drop-shadow-[0_0_8px_rgba(224,197,143,0.3)]"
              >
                Master the art of resume crafting through gameplay.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4, duration: 1 }}
                className="mx-auto max-w-2xl text-sm font-medium tracking-[0.2em] text-swanwing/68 sm:text-base"
              >
                Drag, sort, and sharpen your resume instincts before the real application begins.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8, type: "spring" }}
              className="mt-16 flex flex-col items-center gap-6"
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-swanwing/56 animate-pulse">
                Press start to enter the Game
              </p>

              <div className="relative group">
                <div className="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-r from-quicksand/70 via-sapphire/70 to-quicksand/70 opacity-60 blur-lg transition duration-500 group-hover:opacity-100 group-hover:duration-200 animate-[pulse_3s_ease-in-out_infinite]" />

                <button
                  type="button"
                  onClick={onStart}
                  className="relative inline-flex items-center gap-4 rounded-[1.35rem] border border-quicksand/40 bg-[#061224] px-10 py-5 text-2xl font-black uppercase tracking-[0.14em] text-white transition-transform active:scale-95 group-hover:-translate-y-1"
                >
                  <div className="absolute inset-0 rounded-[1.35rem] bg-[linear-gradient(90deg,rgba(224,197,143,0.22),rgba(60,80,125,0.18))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="relative z-10 flex items-center gap-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]">
                    <Play className="h-7 w-7 fill-white" />
                    Play With Resume
                    <ArrowRight className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-2" />
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
