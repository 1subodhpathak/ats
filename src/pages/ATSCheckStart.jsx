// import { Link } from "react-router-dom";
// import { ArrowRight, FileText, Target } from "lucide-react";

// import Card from "../components/common/Card";

// const options = [
//   {
//     to: "/check-ats/resume",
//     title: "Check ATS Using Resume",
//     description:
//       "Upload a resume and get a 50-point ATS report covering structure, readability, keywords, impact, and recruiter readiness.",
//     icon: FileText,
//   },
//   {
//     to: "/check-ats/resume-jd",
//     title: "Check ATS Using Resume and JD",
//     description:
//       "Upload a resume, add the job description, and get a 50-point ATS report focused on match quality, keyword gaps, and role alignment.",
//     icon: Target,
//   },
// ];

// function ATSCheckStart() {
//   return (
//     <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6">
//       <div className="space-y-3">
//         <span className="inline-flex rounded-full border border-shellstone/60 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sapphire">
//           ATS Check Workflow
//         </span>
//         <h1 className="text-4xl font-black tracking-tight text-royalblue">
//           Choose how you want to run the ATS check.
//         </h1>
//         <p className="max-w-3xl text-sm leading-6 text-slate-600">
//           Pick a resume-only audit or compare the resume directly against a job
//           description. Both options produce a saved 50-point report and a professional
//           PDF export.
//         </p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         {options.map(({ to, title, description, icon: Icon }) => (
//           <Link key={to} to={to} className="group block">
//             <Card className="h-full rounded-3xl border border-shellstone/60 bg-white p-7 transition hover:-translate-y-0.5 hover:border-quicksand hover:shadow-lg">
//               <div className="flex h-full flex-col justify-between gap-8">
//                 <div className="space-y-4">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-swanwing text-royalblue">
//                     <Icon className="h-6 w-6" />
//                   </div>
//                   <div className="space-y-2">
//                     <h2 className="text-xl font-black text-royalblue">{title}</h2>
//                     <p className="text-sm leading-6 text-slate-600">{description}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm font-bold text-royalblue">
//                   <span>Continue</span>
//                   <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
//                 </div>
//               </div>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ATSCheckStart;

import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  ScanSearch,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import AnimatedHeroBackground from "../components/layout/AnimatedHeroBackground";

const colors = {
  cream: "#F6F1EA",
  border: "#DDE5EA",
  navy: "#10245A",
  dark: "#2F4054",
  muted: "#5C8194",
  softBlue: "#E7F0F8",
  cardBlue: "#DCECF7",
};

const options = [
  {
    to: "/check-ats/resume",
    title: "Check ATS Using Resume",
    badge: "FAST SCAN",
    description:
      "Upload a resume and get a 50-point ATS report covering structure, readability, keywords, impact, and recruiter readiness.",
    icon: FileText,
    features: ["Resume structure", "Readability score"],
  },
  {
    to: "/check-ats/resume-jd",
    title: "Check ATS Using Resume and JD",
    badge: "BEST RESULT",
    description:
      "Upload a resume, add the job description, and get a 50-point ATS report focused on match quality, keyword gaps, and role alignment.",
    icon: Target,
    features: ["Keyword gaps", "Role alignment"],
    recommended: true,
  },
];

const benefits = [
  {
    title: "ATS-Friendly Review",
    text: "Clean scoring designed to show what may block your resume before it reaches recruiters.",
    icon: ScanSearch,
  },
  {
    title: "Smart Matching",
    text: "Compare your resume against the role and understand exactly what needs improvement.",
    icon: Sparkles,
  },
];

function ATSCheckStart() {
  return (
    <main
      className="relative isolate w-full overflow-hidden"
      style={{
        backgroundColor: colors.cream,
        minHeight: "calc(100vh - 72px)",
      }}
    >
      <AnimatedHeroBackground />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(231,240,248,0.58) 0%, rgba(246,241,234,0.42) 48%, rgba(246,241,234,0.9) 100%)",
        }}
      />

      <section
        className="relative z-10 grid w-full items-center gap-7 px-5 py-5 lg:grid-cols-[0.94fr_1.06fr] lg:px-7 lg:py-5"
        style={{
          minHeight: "calc(100vh - 72px)",
        }}
      >
        <div className="max-w-[620px]">
          <div
            className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest"
            style={{
              color: colors.muted,
              borderColor: colors.border,
              boxShadow: "0 8px 18px rgba(16,36,90,0.055)",
            }}
          >
            <Zap className="h-3.5 w-3.5" />
            Getting Started
          </div>

          <h1
            className="mt-6 font-black leading-none tracking-tighter"
            style={{
              color: colors.dark,
              fontSize: "clamp(38px, 4.2vw, 61px)",
            }}
          >
            Choose how to run
            <br />
            <span style={{ color: colors.muted }}>your ATS check.</span>
          </h1>

          <p
            className="mt-5 max-w-[570px] font-medium leading-relaxed"
            style={{
              color: colors.muted,
              fontSize: "15.5px",
            }}
          >
            Pick a starting point below. For the best result, upload both your
            resume and the job description so CareerSense can check structure,
            keywords, match quality, and recruiter readiness.
          </p>

          <div
            className="mt-7 h-px max-w-[620px]"
            style={{ backgroundColor: "rgba(92,129,148,0.28)" }}
          />

          <div className="mt-7 grid max-w-[620px] gap-7 sm:grid-cols-2">
            {benefits.map(({ title, text, icon: Icon }) => (
              <div key={title}>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md border bg-white"
                  style={{
                    borderColor: colors.border,
                    color: colors.dark,
                    boxShadow: "0 7px 16px rgba(16,36,90,0.055)",
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <h3
                  className="mt-3 text-sm font-black"
                  style={{ color: colors.dark }}
                >
                  {title}
                </h3>

                <p
                  className="mt-2 text-[13px] font-medium leading-relaxed"
                  style={{ color: colors.muted }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full space-y-5 justify-self-end">
          {options.map(
            ({
              to,
              title,
              badge,
              description,
              icon: Icon,
              features,
              recommended,
            }) => (
              <Link key={to} to={to} className="group block">
                <div
                  className="rounded-2xl border bg-white p-5 transition duration-300 group-hover:-translate-y-1"
                  style={{
                    borderColor: recommended ? "#BBD5E7" : colors.border,
                    boxShadow: recommended
                      ? "0 20px 46px rgba(16,36,90,0.12)"
                      : "0 15px 34px rgba(16,36,90,0.075)",
                  }}
                >
                  <div className="flex gap-5">
                    <div
                      className="flex shrink-0 items-center justify-center rounded-xl border"
                      style={{
                        width: "52px",
                        height: "52px",
                        backgroundColor: recommended
                          ? colors.cardBlue
                          : "#FFFFFF",
                        borderColor: "#BFD2DF",
                        color: colors.dark,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2
                          className="font-black tracking-tight"
                          style={{
                            color: colors.dark,
                            fontSize: "21px",
                            lineHeight: "1.12",
                          }}
                        >
                          {title}
                        </h2>

                        <span
                          className="rounded-md border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider"
                          style={{
                            color: colors.dark,
                            backgroundColor: recommended
                              ? "#E6EEF3"
                              : "#F5F8FA",
                            borderColor: "#C2D0D9",
                          }}
                        >
                          {badge}
                        </span>
                      </div>

                      <p
                        className="mt-4 max-w-3xl font-medium leading-relaxed"
                        style={{
                          color: colors.muted,
                          fontSize: "15px",
                        }}
                      >
                        {description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-2 text-[13px] font-bold"
                            style={{ color: colors.muted }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="hidden items-center md:flex">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full transition duration-300 group-hover:translate-x-1"
                        style={{
                          backgroundColor: recommended
                            ? colors.navy
                            : colors.softBlue,
                          color: recommended ? "#FFFFFF" : colors.navy,
                        }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </section>
    </main>
  );
}

export default ATSCheckStart;