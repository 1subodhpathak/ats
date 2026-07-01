import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Zap, Target, BarChart3, FileText, Briefcase, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ATSResumeAnatomy = () => {
  const [activeCategory, setActiveCategory] = useState('parsing');
  const [animationPhase, setAnimationPhase] = useState(0);

  // Sequence the animation phases - loops continuously for the ENTIRE component
  useEffect(() => {
    let timeout1, timeout2, timeout3, timeout4, loopTimeout;

    const runAnimation = () => {
      setAnimationPhase(0); // Everything resets (Bars drain, lists hide, docs exit)

      timeout1 = setTimeout(() => setAnimationPhase(1), 500);   // Enter (Bars fill, lines draw, list staggers)
      timeout2 = setTimeout(() => setAnimationPhase(2), 1500);  // Scan
      timeout3 = setTimeout(() => setAnimationPhase(3), 2500);  // Match (Checkmarks pulse)
      timeout4 = setTimeout(() => setAnimationPhase(4), 3500);  // Score pops up

      // Loop the animation sequence
      loopTimeout = setTimeout(() => runAnimation(), 8500);
    };

    runAnimation();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      clearTimeout(loopTimeout);
    };
  }, [activeCategory]); // Resets sequence instantly if user switches category

  const scoringCategories = [
    {
      id: 'parsing',
      title: 'Parsing & Structure',
      icon: FileText,
      score: 85,
      description: 'How well your resume can be parsed and structured by ATS systems.',
      checks: [
        'File format compatibility (PDF, DOCX)',
        'Section headers recognition',
        'Contact information accessibility',
        'Consistent date formatting'
      ]
    },
    {
      id: 'keywords',
      title: 'Keyword Match',
      icon: Target,
      score: 72,
      description: 'Alignment with job description keywords and industry terminology.',
      checks: [
        'Hard skills matching',
        'Technical tools & frameworks',
        'Industry-specific terminology',
        'Action verb strength'
      ]
    },
    {
      id: 'readability',
      title: 'Readability',
      icon: BarChart3,
      score: 90,
      description: 'Clarity, formatting, and how easily content is scannable.',
      checks: [
        'Sentence length & clarity',
        'Bullet point consistency',
        'Font size uniformity',
        'White space optimization'
      ]
    },
    {
      id: 'impact',
      title: 'Impact Metrics',
      icon: Zap,
      score: 68,
      description: 'Quantifiable achievements and strong action verbs.',
      checks: [
        'Quantifiable results (numbers)',
        'Action verb strength',
        'Achievement vs. responsibility ratio',
        'Business impact clarity'
      ]
    }
  ];

  const processSteps = [
    { step: 1, label: 'Upload Resume', description: 'You upload your PDF or DOCX resume' },
    { step: 2, label: 'Parse Content', description: 'We extract and structure all text content' },
    { step: 3, label: 'Analyze Metrics', description: 'Score across 4 major categories' },
    { step: 4, label: 'Identify Gaps', description: 'Pinpoint weak lines and missing keywords' },
    { step: 5, label: 'Get Suggestions', description: 'Receive AI-powered improvement recommendations' },
    { step: 6, label: 'Export Improved', description: 'Download your optimized resume' }
  ];

  const activeData = scoringCategories.find(cat => cat.id === activeCategory);

  // Stagger configurations for the checklist loop
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, transition: { duration: 0.2 } },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } }
  };

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(135deg,#3b4c66_0%,#2c3a54_42%,#18243a_100%)] py-14 text-swanwing md:py-16">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/Anatomy.png')" }}
      />
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px"
        }}
      />
      <div className="absolute inset-y-0 left-0 w-[40%] bg-[radial-gradient(circle_at_top_left,rgba(229,203,148,0.18),transparent_68%)]" />
      <div className="absolute inset-y-0 right-0 w-[36%] bg-[radial-gradient(circle_at_center_right,rgba(255,255,255,0.08),transparent_72%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header - Static Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#e5cb94]">How It Works</h2>
          <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-[#F5F0E9] sm:text-3xl">
            How Our ATS Score Checker Works
          </h3>
          <p className="mx-auto max-w-xl text-[11px] font-medium leading-relaxed text-[#c4cede] sm:text-xs">
            CareerSense analyzes your resume across multiple dimensions to predict how applicant tracking systems will rank your application before it reaches a recruiter.
          </p>
        </motion.div>

        {/* Process Flow - Lines animate on the main loop */}
        <div className="mb-14">
          <div className="rounded-[24px] border border-white/10 bg-white/8 p-6 shadow-[0_24px_60px_rgba(7,14,28,0.18)] backdrop-blur-[2px]">
            <h4 className="mb-6 text-xs font-black uppercase tracking-wider text-[#F5F0E9] text-center md:text-left">The Scoring Process</h4>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-6">
              {processSteps.map((item, idx) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="relative w-full">
                    <motion.div
                      animate={{ scale: animationPhase === 2 ? [1, 1.05, 1] : 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#E0C58F] to-[#D9CBC2] text-sm font-black text-[#112250] shadow-[0_0_15px_rgba(224,197,143,0.3)]"
                    >
                      {item.step}
                    </motion.div>
                    {idx < processSteps.length - 1 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: animationPhase >= 1 ? 1 : 0 }}
                        transition={{ duration: animationPhase === 0 ? 0.3 : 0.8, delay: animationPhase >= 1 ? idx * 0.15 : 0, ease: "easeInOut" }}
                        className="absolute left-1/2 top-5 hidden h-0.5 w-full origin-left bg-gradient-to-r from-[#E0C58F]/50 to-transparent md:block"
                      />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-[11px] font-bold text-[#F5F0E9]">{item.label}</p>
                    <p className="mt-1 text-[10px] text-[#8e9bb5]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scoring Categories Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Category Selector */}
          <div className="lg:col-span-1">
            <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-[#F5F0E9]">Scoring Categories</h4>
            <div className="space-y-2.5">
              {scoringCategories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full rounded-xl border-2 p-3.5 text-left transition-all duration-300 ${isActive
                      ? 'bg-[#f7f3ea]/12 border-[#E0C58F] shadow-[0_0_20px_rgba(224,197,143,0.15)]'
                      : 'bg-[#1a2740]/70 border-white/10 hover:border-[#8f9cb3]/40'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`mt-0.5 h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-[#E0C58F]' : 'text-[#8e9bb5]'}`} />
                      <div className="w-full">
                        <p className={`text-xs font-bold transition-colors ${isActive ? 'text-[#F5F0E9]' : 'text-[#a8b4cc]'}`}>
                          {category.title}
                        </p>
                        <div className="mt-2 flex items-center gap-2.5">
                          <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-[#112250]/80">
                            {/* Score bars fill up and drain on the main loop */}
                            <motion.div
                              animate={{ width: animationPhase >= 1 ? `${category.score}%` : "0%" }}
                              transition={{ duration: animationPhase === 0 ? 0.4 : 1.2, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-[#E0C58F] to-[#D9CBC2] rounded-full"
                            />
                          </div>
                          <span className={`text-[11px] font-bold ${isActive ? 'text-[#E0C58F]' : 'text-[#8e9bb5]'}`}>
                            {category.score}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Details & Animation Panels */}
          {activeData && (
            <div className="lg:col-span-2">
              <div className="grid h-full gap-5 md:grid-cols-2">

                {/* Details Panel (Left side loops in sync with right side phases) */}
                <div className="flex flex-col justify-between rounded-[24px] border border-white/10 bg-[rgba(18,31,52,0.82)] p-6 shadow-[0_24px_60px_rgba(7,14,28,0.18)] backdrop-blur-[2px]">
                  <div>
                    <div className="mb-5 flex items-start gap-3 border-b border-[#3C507D]/30 pb-5">
                      {React.createElement(activeData.icon, {
                        className: "h-6 w-6 text-[#E0C58F] shrink-0"
                      })}
                      <div>
                        <h5 className="text-lg font-bold text-[#F5F0E9]">{activeData.title}</h5>
                        <p className="mt-1 text-[11px] font-medium text-[#a8b4cc]">{activeData.description}</p>
                      </div>
                    </div>

                    <div className="mb-6 space-y-2.5">
                      <p className="text-[10px] font-extrabold text-[#E0C58F] uppercase tracking-[0.2em]">What We Check:</p>

                      {/* Tied directly to animationPhase loop */}
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={animationPhase >= 1 ? "show" : "hidden"}
                        className="grid sm:grid-cols-1 gap-3"
                      >
                        {activeData.checks.map((check, idx) => (
                          <motion.div
                            variants={itemVariants}
                            key={idx}
                            className="flex items-start gap-2.5"
                          >
                            {/* Checkmark pulses and highlights when right side hits Phase 3 (Match) */}
                            <motion.div
                              animate={{
                                scale: animationPhase === 3 ? [1, 1.3, 1] : 1,
                                color: animationPhase >= 3 ? '#E0C58F' : '#8e9bb5'
                              }}
                              transition={{ duration: 0.4, delay: animationPhase === 3 ? idx * 0.1 : 0 }}
                              className="shrink-0 mt-0.5"
                            >
                              <CheckCircle2 className="h-5 w-5" />
                            </motion.div>
                            <p className="text-[11px] text-[#a8b4cc] font-medium leading-relaxed">{check}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-white/10 bg-[#f7f3ea]/8 p-3.5">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E0C58F]" />
                      <p className="text-[11px] leading-relaxed text-[#a8b4cc]">
                        <span className="font-bold text-[#F5F0E9]">Pro Tip:</span> A higher score in this category means your resume is highly optimized for Applicant Tracking Systems.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animation Panel (Right Side) */}
                <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(24,36,58,0.92),rgba(44,58,84,0.88))]">
                  {/* Background glow */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#3C507D] rounded-full blur-[40px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[#E0C58F] rounded-full blur-[40px]" />
                  </div>

                  {/* Connecting Lines */}
                  <AnimatePresence>
                    {animationPhase >= 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                      >
                        <svg className="w-full h-full absolute" style={{ filter: 'drop-shadow(0 0 8px rgba(224, 197, 143, 0.6))' }}>
                          <motion.line x1="20%" y1="40%" x2="80%" y2="45%" stroke="#E0C58F" strokeWidth="2" strokeDasharray="5,5"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                          <motion.line x1="25%" y1="55%" x2="75%" y2="60%" stroke="#E0C58F" strokeWidth="2" strokeDasharray="5,5"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
                          <motion.line x1="15%" y1="70%" x2="85%" y2="30%" stroke="#E0C58F" strokeWidth="2" strokeDasharray="5,5"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.4 }} />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Document 1: Resume */}
                  <motion.div
                    initial={{ opacity: 0, x: -60, rotateY: 15 }}
                    animate={{
                      opacity: animationPhase >= 4 ? 0.2 : (animationPhase >= 1 ? 1 : 0),
                      x: animationPhase >= 1 ? -58 : -90,
                      scale: animationPhase >= 4 ? 0.85 : 1
                    }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
                    className="absolute z-20 flex h-40 w-28 flex-col rounded-lg border border-[#3C507D]/50 bg-[#1d2a45]/80 p-3 shadow-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-3 border-b border-[#3C507D]/50 pb-2">
                      <FileText className="text-[#E0C58F] w-4 h-4" />
                      <span className="text-[#F5F0E9] font-semibold text-xs">Resume</span>
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-2.5 w-2/3 bg-[#3a3e4c] rounded"></div>
                      <div className="h-2 w-1/2 bg-[#3a3e4c] rounded"></div>
                      <motion.div
                        animate={{
                          backgroundColor: animationPhase >= 3 ? 'rgba(224, 197, 143, 0.2)' : '#3a3e4c',
                          borderColor: animationPhase >= 3 ? 'rgba(224, 197, 143, 0.5)' : 'transparent',
                        }}
                        className="h-2.5 w-5/6 rounded border"
                      />
                      <div className="h-2 w-full bg-[#3a3e4c] rounded"></div>
                    </div>
                  </motion.div>

                  {/* Document 2: Job Description */}
                  <motion.div
                    initial={{ opacity: 0, x: 60, rotateY: -15 }}
                    animate={{
                      opacity: animationPhase >= 4 ? 0.2 : (animationPhase >= 1 ? 1 : 0),
                      x: animationPhase >= 1 ? 58 : 90,
                      scale: animationPhase >= 4 ? 0.85 : 1
                    }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
                    className="absolute z-20 flex h-40 w-28 flex-col rounded-lg border border-[#3C507D]/50 bg-[#1d2a45]/80 p-3 shadow-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-3 border-b border-[#3C507D]/50 pb-2">
                      <Briefcase className="text-[#F5F0E9] w-4 h-4" />
                      <span className="text-[#F5F0E9] font-semibold text-xs">Job Post</span>
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-2.5 w-2/3 bg-[#3a3e4c] rounded"></div>
                      <div className="h-2 w-full bg-[#3a3e4c] rounded"></div>
                      <motion.div
                        animate={{
                          backgroundColor: animationPhase >= 3 ? 'rgba(224, 197, 143, 0.2)' : '#3a3e4c',
                          borderColor: animationPhase >= 3 ? 'rgba(224, 197, 143, 0.5)' : 'transparent',
                        }}
                        className="h-2.5 w-4/5 rounded border"
                      />
                      <div className="h-2 w-full bg-[#3a3e4c] rounded"></div>
                    </div>
                  </motion.div>

                  {/* Scanner Beam */}
                  <AnimatePresence>
                    {animationPhase >= 2 && animationPhase < 4 && (
                      <motion.div
                        initial={{ top: '0%', opacity: 0 }}
                        animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                        className="absolute left-0 right-0 z-30 flex h-0.5 w-full justify-center bg-[#E0C58F] shadow-[0_0_15px_rgba(224,197,143,0.8)]"
                      >
                        <div className="absolute top-0 h-12 w-full -translate-y-full bg-gradient-to-t from-[#E0C58F]/30 to-transparent" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Final Score Card */}
                  <AnimatePresence>
                    {animationPhase >= 4 && (
                      <motion.div
                        key={`score-${activeData.id}`}
                        initial={{ scale: 0.5, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 30 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                        className="absolute z-40 flex flex-col items-center justify-center rounded-2xl border border-[#E0C58F]/50 bg-[#1d2a45]/95 p-4 shadow-[0_0_50px_rgba(224,197,143,0.3)] backdrop-blur-xl"
                      >
                        <motion.div
                          initial={{ rotate: -90 }}
                          className="relative mb-2 flex h-20 w-20 items-center justify-center"
                        >
                          <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#3C507D" strokeWidth="6" strokeOpacity="0.3" />
                            <motion.circle
                              cx="50" cy="50" r="40" fill="none" stroke="#E0C58F" strokeWidth="6"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: activeData.score / 100 }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            />
                          </svg>
                          <div className="text-center absolute">
                            <span className="text-2xl font-black text-[#F5F0E9]">
                              {activeData.score}
                            </span>
                            <span className="text-xs font-bold text-[#E0C58F]">%</span>
                          </div>
                        </motion.div>

                        <h3 className="mb-1 text-center text-xs font-bold text-[#F5F0E9]">
                          {activeData.title} <br /> Score
                        </h3>

                        <div className="mt-1 w-full space-y-1 text-[11px]">
                          <div className="flex items-center justify-center gap-1.5 text-[#a8b4cc]">
                            <CheckCircle className="w-3.5 h-3.5 text-[#E0C58F]" />
                            Validated
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ATSResumeAnatomy;
