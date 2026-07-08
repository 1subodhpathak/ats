import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Gamepad2,
  LayoutDashboard,
  LayoutGrid,
  ScanSearch,
  Sparkles,
  Target,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import AnimatedHeroBackground from "./AnimatedHeroBackground";
import { SignedIn } from "@clerk/clerk-react";

const HERO_WORDS = ["Land the Interview", "Get Shortlisted", "Apply with Confidence", "Reach the Recruiter", "Unlock More Interviews"];

const methodCards = [
  {
    title: "Resume Audit",
    text: "Get an instant ATS scan with structure, keyword, and readability checks before you apply.",
    to: "/check-ats/resume",
    icon: ScanSearch,
  },
  {
    title: "Job Alignment",
    text: "Compare your resume with a target role and uncover missing skills, keywords, and fit gaps.",
    to: "/check-ats/resume-jd",
    icon: Target,
  },
  {
    title: "Play with Resume",
    text: "Practice improving your resume in an interactive guided space before making final edits.",
    to: "/play-with-resume",
    icon: Gamepad2,
  },
];

const stats = [
  { value: "100+", label: "Check Points", icon: Zap },
  { value: "SMART", label: "JD Alignment", icon: LayoutGrid },
  { value: "100%", label: "ATS Cheks", icon: FileText },
  { value: "60s", label: "Scoring", icon: Sparkles },
];

const workflowSteps = [
  {
    title: "Upload resume",
    text: "Start with your current file and let CareerSense parse the structure.",
    badge: "Step 1",
    icon: UploadCloud,
  },
  {
    title: "Analyze for ATS",
    text: "We inspect formatting, keywords, and recruiter-facing readability.",
    badge: "Step 2",
    icon: ScanSearch,
  },
  {
    title: "Match to job description",
    text: "Add the target role to surface missing, skills and alignment issues.",
    badge: "Step 3",
    icon: Target,
  },
  {
    title: "Improve and rescan",
    text: "Use the score, fixes, to strengthen the resume and check it again fast.",
    badge: "Done",
    icon: CheckCircle2,
  },
];

const colors = {
  cream: "#F6F1EA",
  border: "#E4DDD4",
  navy: "#10245A",
  dark: "#081632",
  muted: "#294160",
  blueText: "#6D8EAA",
  blueSoft: "#E7F0F8",
};

const ATSHero = () => {
  const reduceMotion = useReducedMotion();
  const [heroWordIdx, setHeroWordIdx] = useState(0);
  const [heroWordVisible, setHeroWordVisible] = useState(true);
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(0);
  const [isSampleReportOpen, setIsSampleReportOpen] = useState(false);

  useEffect(() => {
    if (reduceMotion || isSampleReportOpen) return undefined;

    const interval = window.setInterval(() => {
      setHeroWordVisible(false);

      window.setTimeout(() => {
        setHeroWordIdx((current) => (current + 1) % HERO_WORDS.length);
        setHeroWordVisible(true);
      }, 170);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [reduceMotion, isSampleReportOpen]);

  useEffect(() => {
    if (reduceMotion || isSampleReportOpen) return undefined;

    const workflowInterval = window.setInterval(() => {
      setActiveWorkflowIndex((current) => (current + 1) % workflowSteps.length);
    }, 1500);

    return () => window.clearInterval(workflowInterval);
  }, [reduceMotion, isSampleReportOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    if (!isSampleReportOpen) {
      document.body.style.overflow = "";
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSampleReportOpen]);

  return (
    <section
      className="relative isolate overflow-hidden border-b"
      style={{
        backgroundColor: colors.cream,
        borderColor: colors.border,
      }}
    >
      <div
        className="relative mx-auto overflow-hidden px-6 py-5 sm:px-8 lg:px-12 lg:py-5"
        style={{
          maxWidth: "1440px",
          minHeight: "calc(100vh - 72px)",
        }}
      >
        {!isSampleReportOpen ? <AnimatedHeroBackground /> : null}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 47% 42%, rgba(226,191,127,0.2), transparent 34%), linear-gradient(180deg, rgba(246,241,234,0.62), rgba(246,241,234,0.16) 38%, rgba(246,241,234,0.88) 100%)",
          }}
        />

        <div className="relative z-10 grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:pt-4"
          >
            <h1
              className="max-w-3xl font-black leading-none tracking-tighter"
              style={{
                color: colors.navy,
                fontSize: "clamp(40px, 3.9vw, 62px)",
              }}
            >
              Beat the ATS{" "}
              <br />
              <span
                style={{
                  display: "inline-block",
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                  opacity: heroWordVisible ? 1 : 0,
                  transform: heroWordVisible
                    ? "translateY(0px)"
                    : "translateY(-10px)",
                  color: colors.blueText,
                }}
              >
                {HERO_WORDS[heroWordIdx]}
              </span>
              <br />
            </h1>

            <p
              className="mt-5 max-w-2xl font-medium leading-relaxed tracking-tight"
              style={{
                color: "rgba(41,65,96,0.9)",
                fontSize: "16px",
              }}
            >
              Stop guessing what the algorithm wants. Our AI instantly compares
              your resume against any job description, highlights missing
              keywords, and optimizes your format to help you pass the initial
              screen.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <Link
                  to="/check-ats"
                  className="group inline-flex w-full items-center justify-between rounded-xl px-5 text-[13px] font-black text-white transition duration-300 hover:-translate-y-0.5"
                  style={{
                    minHeight: "44px",
                    backgroundColor: colors.navy,
                    boxShadow: "0 16px 28px rgba(16,36,90,0.18)",
                  }}
                >
                  <span>Scan Resume</span>
                  <ArrowRight
                    size={20}
                    className="transition duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div>
                <SignedIn>
                  <Link
                    to="/dashboard"
                    className="group inline-flex w-full items-center justify-between rounded-xl border bg-white px-5 text-[13px] font-black transition duration-300 hover:-translate-y-0.5"
                    style={{
                      minHeight: "44px",
                      color: colors.navy,
                      borderColor: "#D8DFE7",
                      boxShadow: "0 14px 24px rgba(16,36,90,0.08)",
                    }}
                  >
                    <span>Dashboard</span>
                    <LayoutDashboard size={18} />
                  </Link>
                </SignedIn>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsSampleReportOpen(true)}
                  className="group inline-flex w-full items-center justify-between rounded-xl border bg-white px-5 text-[13px] font-black transition duration-300 hover:-translate-y-0.5"
                  style={{
                    minHeight: "44px",
                    color: colors.navy,
                    borderColor: "#D8DFE7",
                    boxShadow: "0 14px 24px rgba(16,36,90,0.08)",
                  }}
                >
                  <span>Sample Report</span>
                  <FileText
                    size={18}
                    className="transition duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {methodCards.map(({ title, text, to, icon: Icon }, index) => (
                <motion.div
                  key={title}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.48,
                    delay: 0.1 + index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    to={to}
                    className="group flex flex-col rounded-2xl border bg-white p-4 transition duration-300 hover:-translate-y-1"
                    style={{
                      minHeight: "185px",
                      borderColor: "#E5E0DA",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      boxShadow: "0 14px 34px rgba(16,36,90,0.07)",
                    }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className="flex items-center justify-center rounded-2xl"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: colors.blueSoft,
                          color: colors.navy,
                        }}
                      >
                        <Icon size={18} strokeWidth={2.2} />
                      </div>

                      <ArrowRight
                        size={16}
                        className="transition duration-300 group-hover:translate-x-1"
                        style={{ color: "#5E7EA3" }}
                      />
                    </div>

                    <h3
                      className="font-black leading-tight tracking-tight"
                      style={{
                        color: colors.dark,
                        fontSize: "18px",
                      }}
                    >
                      {title}
                    </h3>

                    <p
                      className="mt-3 font-medium leading-relaxed tracking-tight"
                      style={{
                        color: "rgba(20,37,66,0.88)",
                        fontSize: "13px",
                      }}
                    >
                      {text}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={stat.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.22 + index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="flex shrink-0 items-center justify-center rounded-2xl bg-white"
                      style={{
                        width: "40px",
                        height: "40px",
                        color: colors.navy,
                        border: "1px solid rgba(216,223,231,0.95)",
                        boxShadow: "0 10px 22px rgba(16,36,90,0.1)",
                      }}
                    >
                      <Icon size={17} strokeWidth={2.2} />
                    </div>

                    <div>
                      <p
                        className="font-black leading-none tracking-tight"
                        style={{
                          color: colors.navy,
                          fontSize: "15px",
                        }}
                      >
                        {stat.value}
                      </p>

                      <p
                        className="mt-1 font-black uppercase leading-none tracking-[0.12em]"
                        style={{
                          color: "#537397",
                          fontSize: "10px",
                        }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.08,
            }}
            className="w-full justify-self-end lg:pt-2"
            style={{ maxWidth: "610px" }}
          >
            <div
              className="rounded-3xl border bg-white p-3"
              style={{
                borderColor: "#C8D8E6",
                boxShadow: "0 24px 58px rgba(16,36,90,0.12)",
              }}
            >
              <div
                className="rounded-3xl px-5 py-5"
                style={{
                  background:
                    "linear-gradient(180deg, #EEF7FF 0%, #E7F2FB 48%, #DCECF7 100%)",
                }}
              >
                <div
                  className="inline-flex rounded-full bg-white px-4 py-2 font-black uppercase tracking-widest"
                  style={{
                    color: "#466890",
                    fontSize: "10px",
                  }}
                >
                  ATS Resume Checker
                </div>

                <h2
                  className="mt-5 max-w-xl font-black leading-tight tracking-tight"
                  style={{
                    color: colors.dark,
                    fontSize: "25px",
                  }}
                >
                  Resume to Perfect Resume in minutes
                </h2>

                <p
                  className="mt-3 max-w-xl font-semibold leading-relaxed tracking-tight"
                  style={{
                    color: "rgba(41,65,96,0.9)",
                    fontSize: "13.5px",
                  }}
                >
                  Fastest way to see
                  what is blocking your resume before it reaches a recruiter.
                </p>

                <div
                  className="mt-4 h-px"
                  style={{ backgroundColor: "#C9D8E5" }}
                />

                <div className="mt-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {workflowSteps.map(
                      ({ title, text, badge, icon: Icon }, index) => {
                        const isLast = index === workflowSteps.length - 1;
                        const isCompleted = !reduceMotion && index < activeWorkflowIndex;
                        const isActive = reduceMotion
                          ? index === workflowSteps.length - 1
                          : index === activeWorkflowIndex;
                        const isPending = !isCompleted && !isActive;
                        const badgeLabel =
                          isCompleted || (isLast && isActive) ? "Done" : badge;

                        return (
                          <motion.div
                            key={title}
                            initial={
                              reduceMotion ? false : { opacity: 0, y: 10 }
                            }
                            transition={{
                              duration: 0.38,
                              delay: 0.14 + index * 0.05,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            animate={
                              reduceMotion
                                ? undefined
                                : isActive
                                  ? {
                                      opacity: 1,
                                      y: [0, -2, 0],
                                      scale: [1, 1.01, 1],
                                    }
                                  : {
                                      opacity: 1,
                                      y: 0,
                                      scale: 1,
                                    }
                            }
                            whileHover={{ y: -2 }}
                            className="flex items-center gap-4 rounded-2xl border px-4 py-2.5"
                            style={{
                              backgroundColor:
                                isActive
                                  ? "rgba(255,255,255,0.98)"
                                  : isLast
                                    ? "#FFFFFF"
                                    : "rgba(255,255,255,0.84)",
                              borderColor:
                                isActive
                                  ? "#9DB9D7"
                                  : isLast
                                    ? "#C8D9E6"
                                    : "rgba(255,255,255,0.75)",
                              boxShadow: isActive
                                ? "0 14px 28px rgba(16,36,90,0.11)"
                                : "0 8px 20px rgba(16,36,90,0.045)",
                            }}
                          >
                            <motion.div
                              className="flex shrink-0 items-center justify-center rounded-xl"
                              style={{
                                width: "38px",
                                height: "38px",
                                backgroundColor:
                                  isCompleted || (isLast && isActive)
                                    ? colors.navy
                                    : isActive
                                      ? "#D7E9F8"
                                      : isLast
                                        ? colors.navy
                                        : colors.blueSoft,
                                color:
                                  isCompleted || isLast
                                    ? "#FFFFFF"
                                    : isActive
                                      ? colors.navy
                                      : "#466890",
                              }}
                              animate={
                                reduceMotion
                                  ? undefined
                                  : isActive
                                    ? {
                                        scale: [1, 1.08, 1],
                                      }
                                    : {
                                        scale: 1,
                                      }
                              }
                              transition={{
                                duration: 0.7,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            >
                              <Icon size={17} strokeWidth={2.25} />
                            </motion.div>

                            <div className="min-w-0 flex-1">
                              <h3
                                className="font-black leading-tight tracking-tight"
                                style={{
                                  color: colors.dark,
                                  fontSize: "16px",
                                }}
                              >
                                {title}
                              </h3>

                              <p
                                className="mt-1 font-medium leading-relaxed tracking-tight"
                                style={{
                                  color: "rgba(41,65,96,0.9)",
                                  fontSize: "12.5px",
                                }}
                              >
                                {text}
                              </p>
                            </div>

                            <motion.div
                              className="shrink-0 rounded-full px-3 py-2 font-black uppercase tracking-wide"
                              style={{
                                backgroundColor:
                                  isCompleted || (isLast && isActive)
                                    ? "#DDECF8"
                                    : isActive
                                      ? "#10245A"
                                      : isPending && isLast
                                        ? "#DDECF8"
                                        : "#22385E",
                                color:
                                  isCompleted || isPending && isLast
                                    ? colors.navy
                                    : "#FFFFFF",
                                fontSize: "10px",
                              }}
                              animate={
                                reduceMotion
                                  ? undefined
                                  : isActive
                                    ? {
                                        x: [0, 3, 0],
                                        scale: [1, 1.04, 1],
                                      }
                                    : {
                                        x: 0,
                                        scale: 1,
                                      }
                              }
                              transition={{
                                duration: 0.75,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            >
                              <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                  key={`${title}-${badgeLabel}`}
                                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                  className="block"
                                >
                                  {badgeLabel}
                                </motion.span>
                              </AnimatePresence>
                            </motion.div>
                          </motion.div>
                        );
                      }
                    )}
                  </AnimatePresence>
                </div>

                <div
                  className="mt-4 border-t pt-4"
                  style={{ borderColor: "#C9D8E5" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p
                        className="font-black uppercase tracking-widest"
                        style={{
                          color: "#466890",
                          fontSize: "10px",
                        }}
                      >
                        Final Output
                      </p>

                      <p
                        className="mt-1 font-black leading-tight tracking-tight"
                        style={{
                          color: colors.dark,
                          fontSize: "16px",
                        }}
                      >
                        ATS score + guided fixes
                      </p>
                    </div>

                    <div
                      className="flex shrink-0 items-center justify-center rounded-2xl bg-white"
                      style={{
                        width: "42px",
                        height: "42px",
                        color: colors.navy,
                        boxShadow: "0 10px 22px rgba(16,36,90,0.12)",
                      }}
                    >
                      <ArrowRight size={17} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isSampleReportOpen ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4"
                >
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="flex h-[92vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-[28px] border bg-white shadow-[0_28px_80px_rgba(16,36,90,0.22)]"
                    style={{ borderColor: "#D8DFE7" }}
                  >
                    <div
                      className="flex items-center justify-between gap-4 border-b px-5 py-4"
                      style={{
                        borderColor: "#E4DDD4",
                        background:
                          "linear-gradient(180deg, rgba(246,241,234,0.7), rgba(255,255,255,0.95))",
                      }}
                    >
                      <div className="min-w-0">
                        <p
                          className="font-black uppercase tracking-[0.18em]"
                          style={{ color: "#5E7EA3", fontSize: "10px" }}
                        >
                          Sample Report
                        </p>
                        <h3
                          className="mt-1 truncate font-black tracking-tight"
                          style={{ color: colors.navy, fontSize: "20px" }}
                        >
                          ATS Resume Checker PDF
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsSampleReportOpen(false)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-white transition duration-300 hover:-translate-y-0.5"
                        style={{
                          color: colors.navy,
                          borderColor: "#D8DFE7",
                          boxShadow: "0 12px 22px rgba(16,36,90,0.08)",
                        }}
                        aria-label="Close sample report"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-hidden bg-[#F6F1EA] p-3 sm:p-4">
                      <iframe
                        src="/ATS%20Resume%20Checker.pdf#toolbar=0&navpanes=0&scrollbar=1"
                        title="Sample ATS report PDF"
                        className="h-full w-full rounded-[22px] border bg-white shadow-[0_18px_48px_rgba(16,36,90,0.14)]"
                        style={{ borderColor: "#D8DFE7" }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </section>
  );
};

export default ATSHero;
