// import { ArrowRight, Play, Sparkles } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useState } from "react";

// import backgroundMusic from "./Background.mp3";
// import ResumeBuilderGame from "./ResumeBuilderGame";

// function ResumeGameEntry({ onStart }) {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-[#040814] text-[#dff7ff]">
//       <audio autoPlay loop src={backgroundMusic} className="hidden" />
//       <video
//         className="absolute inset-0 h-full w-full object-cover"
//         autoPlay
//         muted
//         loop
//         playsInline
//       >
//         <source src="/Background.mp4" type="video/mp4" />
//       </video>
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,16,33,0.18),rgba(4,8,20,0.76)_58%,rgba(3,6,15,0.94)_100%)]" />
//       <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,20,0.54),rgba(4,8,20,0.9))]" />

//       <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-6 py-8 lg:px-10">
//         <header className="flex items-center justify-between gap-4">
//           <Link
//             to="/"
//             className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-cyan-200/90 transition hover:text-white"
//           >
//             <Sparkles className="h-4 w-4" />
//             Resume Quest
//           </Link>

//           <Link
//             to="/"
//             className="inline-flex items-center rounded-full border border-cyan-300/35 bg-slate-950/45 px-5 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-100 transition hover:border-cyan-200/60 hover:bg-slate-900/65 hover:text-white"
//           >
//             Home
//           </Link>
//         </header>

//         <main className="flex flex-1 items-center justify-center">
//           <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
//             <div className="space-y-6">
//               <div className="inline-flex items-center  px-6 py-2 text-sm font-bold uppercase tracking-[0.28em]">
//                 Hero Section
//               </div>

//               <h1 className="text-5xl font-black uppercase tracking-[0.08em] text-cyan-50 drop-shadow-[0_0_18px_rgba(125,211,252,0.45)] sm:text-6xl lg:text-5xl">
//                 Build. Learn. Conquer.
//               </h1>

//               <p className="mx-auto max-w-4xl text-xl font-medium uppercase tracking-[0.14em] text-cyan-100/85 sm:text-2xl lg:text-4xl">
//                 Master the art of resume crafting through gameplay.
//               </p>

//               <p className="mx-auto max-w-3xl text-base font-medium uppercase tracking-[0.18em] text-cyan-100/70 sm:text-lg">
//                 Drag and drop your way to the perfect job application.
//               </p>
//             </div>

//             <div className="mt-12 flex flex-col items-center gap-4">
//               <p className="text-xl font-medium text-white/90">See how it works</p>
//               <button
//                 type="button"
//                 onClick={onStart}
//                 className="group inline-flex items-center gap-4 rounded-[1.35rem] border border-cyan-300/50 bg-[linear-gradient(90deg,rgba(37,99,235,0.86),rgba(14,165,233,0.66))] px-8 py-5 text-2xl font-black uppercase tracking-[0.14em] text-white shadow-[0_0_22px_rgba(34,211,238,0.35),0_0_30px_rgba(251,146,60,0.25)] transition hover:scale-[1.01]"
//               >
//                 <Play className="h-6 w-6 fill-white" />
//                 Play With Resume
//                 <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// function ResumeGamePage() {
//   const [started, setStarted] = useState(false);

//   if (!started) {
//     return <ResumeGameEntry onStart={() => setStarted(true)} />;
//   }

//   return <ResumeBuilderGame onBackToEntry={() => setStarted(false)} />;
// }

// export default ResumeGamePage;
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResumeGameEntry from "./ResumeGameEntry";
import ResumeBuilderGame from "./ResumeBuilderGame";

export default function ResumeGamePage() {
  const [phase, setPhase] = useState("idle"); // 'idle' -> 'unlocking' -> 'opening' -> 'done' -> 'closing'

  const handleStart = () => {
    if (phase !== "idle") return;
    
    // 1. Fade Entry UI, start rumble and lock animation
    setPhase("unlocking");

    // 2. Break the seal, flash light, slide doors
    setTimeout(() => {
      setPhase("opening");
      
      // 3. Complete transition, allow interaction
      setTimeout(() => {
        setPhase("done");
      }, 1600); 
    }, 1000); // 1-second suspense build-up
  };

  const handleBackToEntry = () => {
    if (phase !== "done") return;
    setPhase("closing");
    setTimeout(() => setPhase("idle"), 1200);
  };

  const isUnlocking = phase === "unlocking";
  const isOpening = phase === "opening";
  const isClosing = phase === "closing";
  const isDone = phase === "done";

  // Framer Motion variants for the heavy door rumble
  const rumbleAnimation = isUnlocking ? {
    x: [0, -2, 2, -1, 1, -2, 2, 0],
    y: [0, 1, -1, 2, -2, 1, -1, 0],
    transition: { duration: 0.4, repeat: Infinity, ease: "linear" }
  } : { x: 0, y: 0 };

  // Door slide variants
  const leftDoorVariants = {
    closed: { x: "0%", transition: { duration: 1, ease: [0.8, 0, 0.2, 1] } },
    open: { x: "-100%", transition: { duration: 1.2, ease: [0.8, 0, 0.2, 1] } }
  };

  const rightDoorVariants = {
    closed: { x: "0%", transition: { duration: 1, ease: [0.8, 0, 0.2, 1] } },
    open: { x: "100%", transition: { duration: 1.2, ease: [0.8, 0, 0.2, 1] } }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#040814] overflow-hidden">
      
      {/* 🟢 BOTTOM LAYER: THE ACTUAL GAME CANVAS */}
      <ResumeBuilderGame onBackToEntry={handleBackToEntry} />

      {/* 🔴 TOP LAYER: THE GATEKEEPER OVERLAY */}
      {!isDone && (
        <div className="absolute inset-0 z-[9999] flex overflow-hidden pointer-events-none">
          
          {/* CENTRAL LIGHT BURST (Flashes exactly when doors part) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isOpening ? [0, 1, 0] : 0, 
              scale: isOpening ? [0.8, 2, 3] : 0.8 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[100vh] bg-[#E0C58F] blur-[100px] z-0 mix-blend-screen"
          />

          {/* GLOWING ENERGY SEAM */}
          <div 
            className={`absolute top-0 left-1/2 -translate-x-1/2 h-full bg-[#E0C58F] transition-all ease-in z-0 shadow-[0_0_80px_40px_rgba(224,197,143,0.55)] ${
              isOpening ? 'w-[150vw] opacity-0 duration-700' : 'w-[2px] opacity-0 duration-300'
            } ${isUnlocking ? 'opacity-100 shadow-[0_0_60px_20px_rgba(224,197,143,0.9)]' : ''}`}
          />

          {/* LEFT BLAST DOOR */}
          <motion.div 
            variants={leftDoorVariants}
            initial="closed"
            animate={isOpening ? "open" : "closed"}
            className="absolute top-0 left-0 w-1/2 h-full bg-[linear-gradient(180deg,#12203d_0%,#0c1529_55%,#070c1a_100%)] border-r border-[#E0C58F]/50 shadow-[20px_0_60px_rgba(0,0,0,0.95)] z-10 flex justify-end items-center overflow-hidden"
          >
            <motion.div animate={rumbleAnimation} className="absolute inset-0 w-full h-full flex justify-end items-center">
              {/* Textures */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(245,240,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,240,233,0.02)_1px,transparent_1px)] bg-[length:32px_32px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,197,143,0.08),transparent_40%)]" />
              
              {/* Edge Highlighting */}
              <div className="absolute right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#E0C58F] to-transparent opacity-70" />
              
              {/* Left Half of Central Lock */}
              <div className="relative translate-x-[50%] w-48 h-48 rounded-full border-4 border-[#E0C58F]/80 bg-[#0c1529] shadow-[0_0_30px_rgba(224,197,143,0.2)] flex items-center justify-center overflow-hidden">
                <div className="absolute right-1/2 w-full h-full border-r border-[#E0C58F]/30 bg-[#16284c]/40" />
                {/* Inner glowing core */}
                <div className={`w-24 h-24 rounded-full bg-[#E0C58F]/10 blur-md transition-all duration-700 ${isUnlocking ? 'bg-[#E0C58F]/40 scale-125 blur-xl' : ''}`} />
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT BLAST DOOR */}
          <motion.div 
            variants={rightDoorVariants}
            initial="closed"
            animate={isOpening ? "open" : "closed"}
            className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(180deg,#12203d_0%,#0c1529_55%,#070c1a_100%)] border-l border-[#E0C58F]/50 shadow-[-20px_0_60px_rgba(0,0,0,0.95)] z-10 flex justify-start items-center overflow-hidden"
          >
            <motion.div animate={rumbleAnimation} className="absolute inset-0 w-full h-full flex justify-start items-center">
              {/* Textures */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(245,240,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,240,233,0.02)_1px,transparent_1px)] bg-[length:32px_32px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(224,197,143,0.08),transparent_40%)]" />
              
              {/* Edge Highlighting */}
              <div className="absolute left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#E0C58F] to-transparent opacity-70" />
              
              {/* Right Half of Central Lock */}
              <div className="relative -translate-x-[50%] w-48 h-48 rounded-full border-4 border-[#E0C58F]/80 bg-[#0c1529] shadow-[0_0_30px_rgba(224,197,143,0.2)] flex items-center justify-center overflow-hidden">
                <div className="absolute left-1/2 w-full h-full border-l border-[#E0C58F]/30 bg-[#16284c]/40" />
                {/* Inner glowing core */}
                <div className={`w-24 h-24 rounded-full bg-[#E0C58F]/10 blur-md transition-all duration-700 ${isUnlocking ? 'bg-[#E0C58F]/40 scale-125 blur-xl' : ''}`} />
              </div>
            </motion.div>
          </motion.div>

          {/* SPINNING LOCK RING (Only visible when doors are closed/unlocking) */}
          <AnimatePresence>
            {!isOpening && !isDone && (
              <motion.div 
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.4 } }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 z-20 pointer-events-none"
              >
                <motion.div 
                  animate={{ rotate: isUnlocking ? 180 : 0 }}
                  transition={{ duration: 1, ease: "backInOut" }}
                  className="w-full h-full rounded-full border-[3px] border-dashed border-[#E0C58F] opacity-80 shadow-[0_0_20px_rgba(224,197,143,0.4)]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* THE ENTRY PAGE UI (Fades out smoothly) */}
          <div 
            className={`absolute inset-0 z-50 pointer-events-auto transition-opacity duration-700 ${
              phase === 'idle' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ResumeGameEntry onStart={handleStart} />
          </div>

        </div>
      )}
    </div>
  );
}