import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  PenTool,
  ScanSearch,
  UploadCloud,
  Target,
  Sparkles,
  Zap,
  Layout,
  PlayCircle,
  FileCheck,
  Check,
  Download,
  Users,
  CheckCircle2,
  Quote,
  Star,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Card from "../components/common/Card";
import ATSResumeAnatomy from "../components/layout/ATSResumeAnatomy";
import ATSReportCoverage from "../components/layout/ATSReportCoverage";
import ATSHero from "../components/layout/ATSHero";
import AnimatedHeroBackground from "../components/layout/AnimatedHeroBackground";

const testimonials = [
  // Your original 3
  {
    name: "Kreeti Mathur",
    role: "Staff Software Engineer",
    company: "formerly @ ISGEC",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=250",
    text: "After applying to 50+ roles with no replies, I ran my resume through CareerSense. The 50-pointer checklist caught 4 critical parsing bugs. Two weeks after fixing them, I landed three interviews at Google and Stripe!"
  },
  {
    name: "Naveen Malhotra",
    role: "Senior Solutions Architect",
    company: "Amazon Web Services",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=250",
    text: "The Job Description Alignment mode is a cheat code. It highlighted exact keyword gaps I missed. Being able to edit and re-scan in real-time saved me hours of manual polishing."
  },
  {
    name: "Sarah Jenkins",
    role: "VP of Product",
    company: "Deloitte",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=250",
    text: "Our university career center recommends CareerSense to all graduating seniors. The instant scoring and recruiter-grade tenses guide make it simple for students to match executive hiring standards."
  },
  // 3 New additions
  {
    name: "David Chen",
    role: "Data Analyst",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=250",
    text: "I thought my resume was perfect because of a fancy two-column template. CareerSense showed me it was failing ATS parsers completely. I switched to their recommended format, scored a 92%, and finally got past the screening round."
  },
  {
    name: "Elena Rodriguez",
    role: "Growth Marketing Lead",
    company: "HubSpot",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=250",
    text: "The 'Impact Metrics' analysis completely transformed how I present my achievements. It pushed me to quantify my campaigns and use stronger action verbs, raising my impact score from 55 to 88."
  },
  {
    name: "Marcus Thorne",
    role: "Director of Operations",
    company: "Oracle",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=250",
    text: "As a hiring manager myself, I know exactly what modern ATS systems look for. CareerSense is the closest I've seen a tool get to an actual recruiter's initial screen. The readability feedback is spot on."
  }
];

function Home() {
  const [activeTab, setActiveTab] = useState("mode_a");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const itemsPerSlide = 2;
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleTestimonials = testimonials.slice(
    testimonialIndex * itemsPerSlide,
    (testimonialIndex + 1) * itemsPerSlide
  );

  return (
    <div id="home" className="relative w-full scroll-smooth">
      {/* ================= ANIMATED HERO SECTION ================= */}
      <ATSHero />

      {/* ================= REST OF CONTENT ================= */}
      <div className="relative min-h-screen bg-swanwing text-slate-800 font-sans pb-24 overflow-hidden w-full">
        {/* Blueprints Coordinate Grid Background */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #3C507D 1px, transparent 1px),
              linear-gradient(to bottom, #3C507D 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Warm Glow Overlays */}
        <div className="absolute top-1/4 left-10 -z-10 w-96 h-96 rounded-full bg-royalblue/5 blur-3xl" />
        <div className="absolute top-1/3 right-10 -z-10 w-96 h-96 rounded-full bg-quicksand/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 pt-0 space-y-20">

        

          {/* ================= VISIBLE CONTENT SECTIONS ================= */}
          <section id="why-careersense" className="space-y-12 scroll-mt-20">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-extrabold text-royalblue uppercase tracking-[0.24em]">Resume + JD Match Checker</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-royalblue tracking-tight">Why job seekers use CareerSense before they apply</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center bg-white/80 rounded-3xl p-8 md:p-12 border border-shellstone/40 shadow-xs">
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-royalblue leading-tight">
                  Find out if your resume matches the job before a recruiter sees it
                </h3>
                <p className="text-sm text-sapphire/80 leading-relaxed font-medium">
                  CareerSense checks whether your resume is ATS-friendly, compares it with the job description, and shows simple fixes you can make right away. Instead of guessing why you are not getting callbacks, you see what is missing and how to improve it before you apply.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-royalblue shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-slate-700">See whether ATS can read your resume properly or if the layout may hide important details.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-royalblue shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-slate-700">Check how closely your resume matches the job description, including missing keywords and skills.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-royalblue shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-slate-700">Get easy-to-understand suggestions to improve wording, formatting, and your overall ATS score.</p>
                  </div>
                </div>
              </div>

              {/* Layout Comparison Card */}
              <div className="relative rounded-2xl border border-shellstone/40 bg-white p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[9px] font-black text-royalblue uppercase tracking-wider">Sample ATS Check</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-rose-50/50 border border-rose-200/50 rounded-xl space-y-1">
                    <div className="flex items-center gap-1 text-rose-800 font-bold text-[10px]">
                      <ShieldAlert className="h-3 w-3" />
                      <span>Formatting issue found</span>
                    </div>
                    <p className="text-[9px] text-rose-600 font-medium">Your resume uses a two-column section. Some ATS tools may skip text there, so key skills and experience could be missed.</p>
                  </div>
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200/50 rounded-xl space-y-1">
                    <div className="flex items-center gap-1 text-emerald-800 font-bold text-[10px]">
                      <Check className="h-3 w-3" />
                      <span>JD match improved</span>
                    </div>
                    <p className="text-[9px] text-emerald-600 font-medium">We found 6 missing keywords from the job description and suggested where to add them naturally in your resume.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ATSReportCoverage />

          {/* ================= HOW IT WORKS ================= */}
          <section id="how-it-works" className="space-y-12 scroll-mt-20">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-extrabold text-royalblue uppercase tracking-[0.24em]">The Engine Flow</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-royalblue tracking-tight">Interactive Workflow Modes</h2>
            </div>

            {/* Tab Selector */}
            <div className="flex flex-col items-center space-y-8">
              <div className="inline-flex rounded-xl bg-white p-1 border border-shellstone/60 shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("mode_a")}
                  className={`px-6 py-2.5 text-xs font-bold rounded-lg transition duration-200 ${activeTab === "mode_a"
                    ? "bg-royalblue text-swanwing shadow-sm"
                    : "text-[#3C507D] hover:text-royalblue"
                    }`}
                >
                  Mode A: Standalone Score Audit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("mode_b")}
                  className={`px-6 py-2.5 text-xs font-bold rounded-lg transition duration-200 ${activeTab === "mode_b"
                    ? "bg-royalblue text-swanwing shadow-sm"
                    : "text-[#3C507D] hover:text-royalblue"
                    }`}
                >
                  Mode B: Job Description Alignment
                </button>
              </div>

              {/* Tab Display Panel */}
              <Card className="w-full max-w-4xl p-8 border border-shellstone/60 shadow-xl relative overflow-hidden bg-white rounded-3xl">
                {activeTab === "mode_a" ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-royalblue animate-pulse" />
                      <h4 className="text-lg font-bold text-royalblue">50-Pointer Standalone Evaluation</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Analyze your layout structure against global recruiter standards. CareerSense crawls spelling, grammatical tenses, verb strengths, layout risks, and metadata completeness across all pages, yielding category radars and checklists instantly.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-swanwing/30 border border-shellstone/40 rounded-2xl">
                        <h5 className="text-xs font-extrabold text-royalblue mb-1">Independent Score Benchmarking</h5>
                        <p className="text-[10px] text-slate-400 leading-tight">No external descriptions needed. Calibrated to senior engineering and management paradigms.</p>
                      </div>
                      <div className="p-4 bg-swanwing/30 border border-shellstone/40 rounded-2xl">
                        <h5 className="text-xs font-extrabold text-royalblue mb-1">Actionable Checklist Priorities</h5>
                        <p className="text-[10px] text-slate-400 leading-tight">Receive explicit category recommendations with before/after replacement guides.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-quicksand animate-pulse" />
                      <h4 className="text-lg font-bold text-royalblue">Keyword Coverage & Seniority Alignment</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Paste the raw target Job Description text. The AI extracts core technologies, methodologies, preferred capabilities, and seniority expectations. It maps these requirements against your experience bullets, showing you exactly which terms to integrate.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-swanwing/30 border border-shellstone/40 rounded-2xl">
                        <h5 className="text-xs font-extrabold text-royalblue mb-1">Keyword Gap Auditing</h5>
                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Highlights required words missing from your current coordinate blocks in red/orange overlays.</p>
                      </div>
                      <div className="p-4 bg-swanwing/30 border border-shellstone/40 rounded-2xl">
                        <h5 className="text-xs font-extrabold text-royalblue mb-1">Interactive Inline AI Sparkles</h5>
                        <p className="text-[10px] text-slate-400 leading-tight font-medium">Suggests customized, recruiter-grade rewrites aligned with missing keywords inside the canvas editor.</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </section>

          {/* ================= ATS RESUME ANATOMY ================= */}
          <ATSResumeAnatomy />

          {/* ================= TESTIMONIALS SECTION ================= */}
          <section id="testimony" className="scroll-mt-20">
            <div className="relative  p-8 md:p-12 lg:p-16 w-full">
              {/* Subtle mesh/grid pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#d9cbc215_1px,transparent_1px),linear-gradient(to_bottom,#d9cbc215_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              <div className="relative z-10 grid lg:grid-cols-[1fr_2.8fr] gap-12 items-start w-full">

                {/* Left Heading Band */}
                <div className="space-y-6 lg:max-w-xs">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-royalblue uppercase tracking-[0.24em]">Success Stories</span>
                    <h2 className="text-4xl lg:text-5xl font-black text-royalblue leading-none tracking-tight">
                      Customer <br />
                      <span className="text-sapphire font-bold">Success Stories</span>
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    See how driven job seekers, engineering leaders, and transitioners are using CareerSense to eliminate resume blind spots, align with recruiters, and secure interviews at top enterprises.
                  </p>
                  <Link
                    to="/check-ats"
                    className="inline-flex items-center gap-2 text-xs font-black text-royalblue hover:text-sapphire transition group mt-2"
                  >
                    <span>Read Case Studies</span>
                    <div className="h-5 w-5 rounded-full border border-royalblue/30 flex items-center justify-center transition group-hover:border-royalblue group-hover:scale-105">
                      <PlayCircle className="h-3 w-3 text-royalblue fill-royalblue/10" />
                    </div>
                  </Link>
                </div>

                {/* Right Cards Slider/Grid */}
                <div className="space-y-8 w-full">
                  <div className="grid md:grid-cols-2 gap-6 min-h-[380px]">
                    <AnimatePresence>
                      {visibleTestimonials.map(({ name, role, company, image, text }) => (
                        <motion.div
                          key={name}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ duration: 0.3 }}
                          className="relative bg-white border border-shellstone/50 rounded-[24px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full overflow-hidden group"
                        >
                          {/* Flush full-width photo at the top */}
                          <div className="relative w-full h-44 overflow-hidden bg-slate-50">
                            <img
                              src={image}
                              alt={name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Overlapping circular quote badge */}
                            <div className="absolute bottom-0 left-4 translate-y-1/2 z-10 h-8 w-8 rounded-full bg-royalblue text-swanwing flex items-center justify-center shadow-md border-2 border-white">
                              <Quote className="h-3.5 w-3.5 fill-current animate-pulse" />
                            </div>
                          </div>

                          {/* Testimonial details & content */}
                          <div className="p-6 pt-8 flex flex-col justify-between flex-grow">
                            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 font-medium mb-6 italic">
                              "{text}"
                            </p>
                            <div className="border-t border-slate-100 pt-4">
                              <h4 className="text-sm font-extrabold text-royalblue leading-none">{name}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1.5">
                                {role} &bull; <span className="text-slate-600">{company}</span>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Navigation Slider Elements (Carousel styling mirroring visual reference) */}
                  <div className="flex items-center justify-between pt-6 border-t border-shellstone/30">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={prevTestimonial}
                        className="h-9 w-9 rounded-xl hover:bg-swanwing/30 text-royalblue flex items-center justify-center shadow-xs transition duration-200 active:scale-95"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextTestimonial}
                        className="h-9 w-9 rounded-xl hover:bg-swanwing/30 text-royalblue flex items-center justify-center shadow-xs transition duration-200 active:scale-95"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Active indicators
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalSlides }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setTestimonialIndex(i)}
                          className={`h-2 rounded-full transition-all duration-300 ${testimonialIndex === i ? "bg-royalblue w-4" : "bg-[#112250]/20 w-2"
                            }`}
                        />
                      ))}
                    </div> */}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ================= FINAL CTA CONVERSION ================= */}
          <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(135deg,#3b4c66_0%,#2c3a54_42%,#18243a_100%)] py-16 text-swanwing shadow-[0_-20px_60px_rgba(17,29,64,0.18)] md:py-20">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: "url('/FinalCTA.png')" }}
            />
            <div
              className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgb(0, 19, 96) 1px, transparent 1px)
                `,
                backgroundSize: "48px 48px"
              }}
            />
            <div className="absolute inset-y-0 left-0 w-[40%] bg-[radial-gradient(circle_at_top_left,rgba(229,203,148,0.18),transparent_68%)]" />
            <div className="absolute inset-y-0 right-0 w-[36%] bg-[radial-gradient(circle_at_center_right,rgba(255,255,255,0.08),transparent_72%)]" />

            <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] lg:items-center">
              <div className="space-y-8">
                <div className="space-y-5">
                  <span className="inline-flex text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#e5cb94]">
                    Ready When You Are
                  </span>
                  <h2 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tight text-swanwing sm:text-5xl lg:text-4xl">
                    Run the ATS check
                    <br />
                    that makes your resume
                    <span className="text-[#e5cb94]"> application-ready.</span>
                  </h2>
                  <p className="max-w-2xl text-base font-medium leading-relaxed text-swanwing/72">
                    Start with a fast resume scan, compare your resume against a real job description, and fix the gaps before you apply. CareerSense helps you understand what recruiters and ATS systems may flag first.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-swanwing/70 md:text-[13px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#e5cb94]" />
                    <span>Resume readability check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#e5cb94]" />
                    <span>JD keyword gap analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#e5cb94]" />
                    <span>Practical improvement suggestions</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/6 p-4 shadow-[0_24px_60px_rgba(7,14,28,0.22)] backdrop-blur-[2px]">
                <div className="rounded-[28px] bg-[#f7f3ea] p-5 text-royalblue md:p-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ebe5d7] text-royalblue">
                      <FileCheck className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-1xl font-black text-royalblue">CareerSense Workspace</h3>
                      <p className="text-xs tracking-[0.22em] text-[#8f9cb3]">
                        Resume + JD ATS Checker
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <Link
                      to="/check-ats/resume-jd"
                      className="group flex items-center justify-between rounded-[22px] bg-[#31415c] px-6 py-5 text-swanwing transition duration-300 hover:bg-[#25344d]"
                    >
                      <div>
                        <p className="text-xl font-black">Start ATS check</p>
                        <p className="mt-1 text-sm font-medium text-swanwing/64">Compare your resume with a target job description</p>
                      </div>
                      <ArrowRight className="h-8 w-8 shrink-0 text-[#e5cb94] transition group-hover:translate-x-1" />
                    </Link>

                    <Link
                      to="/check-ats/resume"
                      className="group flex items-center justify-between rounded-[22px] border border-[#d7deea] bg-white px-6 py-5 text-royalblue transition duration-300 hover:border-[#c6cfde] hover:bg-[#fbfaf7]"
                    >
                      <div>
                        <p className="text-xl font-black">Resume-only scan</p>
                        <p className="mt-1 text-sm font-medium text-slate-500">Quick ATS readability and formatting review</p>
                      </div>
                      <ArrowRight className="h-7 w-7 shrink-0 text-royalblue transition group-hover:translate-x-1" />
                    </Link>

                    <Link
                      to="/repository"
                      className="group flex items-center justify-between rounded-[22px] border border-[#d7deea] bg-[#fdfbf6] px-6 py-5 text-royalblue transition duration-300 hover:border-[#c6cfde] hover:bg-white"
                    >
                      <div>
                        <p className="text-xl font-black">Open saved reports</p>
                        <p className="mt-1 text-sm font-medium text-slate-500">Review past scans and track your improvements</p>
                      </div>
                      <ArrowRight className="h-7 w-7 shrink-0 text-royalblue transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;
