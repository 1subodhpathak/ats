// import { useMemo, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   CheckCircle2,
//   FileText,
//   FolderOpen,
//   Shield,
//   Sparkles,
//   Target,
//   UploadCloud,
// } from "lucide-react";

// import Button from "../components/common/Button";
// import Loader from "../components/common/Loader";
// import Toast from "../components/common/Toast";
// import AnimatedHeroBackground from "../components/layout/AnimatedHeroBackground";
// import useResumeUpload from "../hooks/useResumeUpload";
// import { uploadJobDescriptionFile } from "../services/jobDescriptionApi";
// import { generateAnalysisReport } from "../services/reportApi";
// import { validateJobDescriptionFile } from "../utils/fileValidation";

// const colors = {
//   cream: "#F6F1EA",
//   border: "#DDE5EA",
//   navy: "#10245A",
//   dark: "#2F4054",
//   muted: "#5C8194",
//   softBlue: "#E7F0F8",
//   cardBlue: "#DCECF7",
// };

// const resumeHighlights = [
//   {
//     title: "Text extraction",
//     text: "Reads text from PDF, DOC, and DOCX resumes up to 10MB.",
//   },
//   {
//     title: "Profile setup",
//     text: "Keeps your uploaded experience separate while extracting structure and skills.",
//   },
//   {
//     title: "ATS scoring",
//     text: "Runs the 50-point scan after upload so you can move straight into the report.",
//   },
// ];

// const jdHighlights = [
//   {
//     title: "Role alignment",
//     text: "Matches your resume against the role requirements and repeated keywords.",
//   },
//   {
//     title: "Keyword gaps",
//     text: "Highlights what is missing and where your resume needs stronger alignment.",
//   },
//   {
//     title: "File or paste",
//     text: "Paste the full posting or upload a JD file and we will extract the text for you.",
//   },
// ];

// function SideInfoPanel({ isResumeJd }) {
//   const icon = isResumeJd ? Target : FileText;
//   const label = isResumeJd ? "Targeted ATS Match" : "Resume ATS Analysis";
//   const title = isResumeJd
//     ? "Match your resume to the job"
//     : "Upload your resume";
//   const description = isResumeJd
//     ? "Upload your resume, then paste or upload the job description so CareerSense can identify missing keywords, match quality, and the strongest proof points from your resume."
//     : "CareerSense extracts your experience, skills, and proof points, then prepares the resume for a focused ATS quality review.";
//   const highlights = isResumeJd ? jdHighlights : resumeHighlights;
//   const Icon = icon;

//   return (
//     <div
//       className="rounded-[32px] border bg-white/92 p-8 shadow-[0_18px_44px_rgba(16,36,90,0.08)]"
//       style={{ borderColor: "#D7E2EA" }}
//     >
//       <div
//         className="flex h-16 w-16 items-center justify-center rounded-3xl"
//         style={{ backgroundColor: colors.softBlue, color: colors.dark }}
//       >
//         <Icon className="h-8 w-8" />
//       </div>

//       <p
//         className="mt-8 text-[12px] font-black uppercase tracking-[0.22em]"
//         style={{ color: colors.muted }}
//       >
//         {label}
//       </p>

//       <h1
//         className="mt-4 max-w-md font-black leading-[0.98] tracking-tight"
//         style={{ color: colors.dark, fontSize: "clamp(2.5rem, 3vw, 3.7rem)" }}
//       >
//         {title}
//       </h1>

//       <p
//         className="mt-6 max-w-[46ch] text-[17px] font-medium leading-9"
//         style={{ color: colors.muted }}
//       >
//         {description}
//       </p>

//       <div className="mt-10 space-y-7">
//         {highlights.map((item) => (
//           <div key={item.title} className="flex gap-4">
//             <div
//               className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-white"
//               style={{ borderColor: "#BFD2DF", color: colors.muted }}
//             >
//               <CheckCircle2 className="h-4 w-4" />
//             </div>
//             <div>
//               <h2 className="text-[18px] font-black" style={{ color: colors.dark }}>
//                 {item.title}
//               </h2>
//               <p
//                 className="mt-2 max-w-[40ch] text-[15px] font-medium leading-8"
//                 style={{ color: colors.muted }}
//               >
//                 {item.text}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div
//         className="mt-10 rounded-[24px] border px-6 py-5"
//         style={{
//           borderColor: "#D7E2EA",
//           backgroundColor: "rgba(246,241,234,0.84)",
//         }}
//       >
//         <div className="flex gap-3">
//           <Shield className="mt-1 h-5 w-5 shrink-0" style={{ color: colors.dark }} />
//           <p
//             className="text-[15px] font-medium leading-8"
//             style={{ color: colors.dark }}
//           >
//             {isResumeJd
//               ? "Uploaded job description text is only used to create the ATS comparison for this report."
//               : "Resume text is only used to generate your ATS analysis and saved report."}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function UploadDropPanel({
//   title,
//   subtitle,
//   description,
//   onChooseFile,
//   accept,
//   disabled,
//   fileName,
//   ctaLabel = "Choose file",
// }) {
//   const inputRef = useRef(null);

//   return (
//     <div
//       className="rounded-[32px] border bg-white p-8 shadow-[0_18px_44px_rgba(16,36,90,0.08)]"
//       style={{ borderColor: "#D7E2EA" }}
//     >
//       <h2 className="text-[30px] font-black tracking-tight" style={{ color: colors.dark }}>
//         {title}
//       </h2>
//       <p className="mt-2 text-[15px] font-medium leading-7" style={{ color: colors.muted }}>
//         {subtitle}
//       </p>

//       <div
//         className="mt-8 rounded-[30px] border-2 border-dashed px-8 py-14 text-center"
//         style={{
//           borderColor: "#CFE0EC",
//           backgroundColor: "rgba(246,241,234,0.38)",
//         }}
//       >
//         <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-white shadow-[0_16px_36px_rgba(16,36,90,0.08)]">
//           <UploadCloud className="h-11 w-11" style={{ color: colors.dark }} />
//         </div>

//         <h3 className="mt-8 text-[24px] font-black" style={{ color: colors.dark }}>
//           {description}
//         </h3>
//         <p className="mx-auto mt-4 max-w-2xl text-[15px] font-medium leading-8" style={{ color: colors.muted }}>
//           {fileName
//             ? `${fileName} is selected and ready.`
//             : "Upload from your device. Parsed text will be prepared automatically for analysis."}
//         </p>

//         <input
//           ref={inputRef}
//           type="file"
//           accept={accept}
//           className="hidden"
//           onChange={(event) => onChooseFile(event.target.files?.[0] || null)}
//         />

//         <div className="mt-8">
//           <Button
//             onClick={() => inputRef.current?.click()}
//             disabled={disabled}
//             className="rounded-2xl px-6 py-3 text-base shadow-[0_16px_30px_rgba(56,129,201,0.22)]"
//           >
//             <UploadCloud className="mr-2 h-4 w-4" />
//             {ctaLabel}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StoredPlaceholder({ title, description, emptyText }) {
//   return (
//     <div
//       className="mt-6 rounded-[28px] border px-5 py-5"
//       style={{
//         borderColor: "#D7E2EA",
//         backgroundColor: "rgba(246,241,234,0.42)",
//       }}
//     >
//       <div className="flex items-start gap-3">
//         <FolderOpen className="mt-1 h-5 w-5 shrink-0" style={{ color: colors.muted }} />
//         <div>
//           <h3 className="text-[17px] font-black" style={{ color: colors.dark }}>
//             {title}
//           </h3>
//           <p className="mt-1 text-[14px] font-medium leading-6" style={{ color: colors.muted }}>
//             {description}
//           </p>
//         </div>
//       </div>

//       <div
//         className="mt-5 rounded-[22px] border-2 border-dashed px-5 py-6 text-[14px] font-medium leading-7"
//         style={{
//           borderColor: "#CFE0EC",
//           color: colors.muted,
//           backgroundColor: "rgba(255,255,255,0.72)",
//         }}
//       >
//         {emptyText}
//       </div>
//     </div>
//   );
// }

// function ATSAnalysisFlow() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const mode = useMemo(
//     () => (location.pathname.includes("resume-jd") ? "resume_jd" : "resume_only"),
//     [location.pathname]
//   );
//   const isResumeJd = mode === "resume_jd";
//   const { upload, isUploading, serverMessage, selectFile, submitUpload } =
//     useResumeUpload();
//   const [jobDescription, setJobDescription] = useState("");
//   const [jobDescriptionFileName, setJobDescriptionFileName] = useState("");
//   const [jobDescriptionStatus, setJobDescriptionStatus] = useState({
//     isUploading: false,
//     error: "",
//     success: "",
//   });
//   const [analysisState, setAnalysisState] = useState({
//     status: "idle",
//     error: "",
//   });

//   const handleResumeFileSelected = (file) => {
//     if (!file) {
//       return;
//     }

//     selectFile(file);
//   };

//   const handleJobDescriptionFileSelected = async (file) => {
//     if (!file) {
//       return;
//     }

//     const validationError = validateJobDescriptionFile(file);
//     if (validationError) {
//       setJobDescriptionStatus({
//         isUploading: false,
//         error: validationError,
//         success: "",
//       });
//       return;
//     }

//     setJobDescriptionStatus({
//       isUploading: true,
//       error: "",
//       success: "",
//     });

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await uploadJobDescriptionFile(formData);
//       setJobDescription(response.data.raw_text || "");
//       setJobDescriptionFileName(response.data.file_name || file.name);
//       setJobDescriptionStatus({
//         isUploading: false,
//         error: "",
//         success: response.data.message || "Job description uploaded successfully.",
//       });
//     } catch (error) {
//       const message =
//         error?.response?.data?.detail ||
//         "Job description upload failed. Please try another file.";
//       setJobDescriptionStatus({
//         isUploading: false,
//         error: message,
//         success: "",
//       });
//     }
//   };

//   const handleSubmit = async () => {
//     if (isResumeJd && !jobDescription.trim()) {
//       setAnalysisState({
//         status: "error",
//         error: "Add a job description before running the ATS comparison.",
//       });
//       return;
//     }

//     setAnalysisState({ status: "loading", error: "" });
//     const resume = await submitUpload();
//     if (!resume?.resume_id) {
//       setAnalysisState({ status: "error", error: "Resume upload failed." });
//       return;
//     }

//     try {
//       const response = await generateAnalysisReport({
//         resume_id: resume.resume_id,
//         jd_text: isResumeJd ? jobDescription : undefined,
//       });
//       navigate(`/reports/analysis/${response.data.analysis_id}`);
//     } catch (error) {
//       const message =
//         error?.response?.data?.detail ||
//         "ATS analysis failed. Please try again in a moment.";
//       setAnalysisState({ status: "error", error: message });
//     }
//   };

//   return (
//     <main
//       className="relative isolate w-full overflow-hidden"
//       style={{
//         backgroundColor: colors.cream,
//         minHeight: "calc(100vh - 72px)",
//       }}
//     >
//       <AnimatedHeroBackground />

//       <div
//         className="pointer-events-none absolute inset-0"
//         style={{
//           background:
//             "linear-gradient(90deg, rgba(231,240,248,0.56) 0%, rgba(246,241,234,0.38) 45%, rgba(246,241,234,0.9) 100%)",
//         }}
//       />

//       <section className="relative z-10 mx-auto grid max-w-[1440px] gap-8 px-5 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
//         <SideInfoPanel isResumeJd={isResumeJd} />

//         <div className="space-y-6">
//           <UploadDropPanel
//             title="Resume PDF"
//             subtitle="Choose a resume from your device. We will parse the structure and prepare it for ATS analysis."
//             description="Click or drag resume here"
//             onChooseFile={handleResumeFileSelected}
//             accept=".pdf,.doc,.docx"
//             disabled={isUploading || analysisState.status === "loading"}
//             fileName={upload.file?.name}
//             ctaLabel="Choose resume"
//           />

//           <StoredPlaceholder
//             title="Stored Resumes"
//             description="Use a resume already saved in CareerSense."
//             emptyText={
//               upload.file?.name
//                 ? `${upload.file.name} is selected for this analysis.`
//                 : "No stored resumes yet. Upload one from your laptop or phone to save it here."
//             }
//           />

//           {isResumeJd ? (
//             <div
//               className="rounded-[32px] border bg-white p-8 shadow-[0_18px_44px_rgba(16,36,90,0.08)]"
//               style={{ borderColor: "#D7E2EA" }}
//             >
//               <h2
//                 className="text-[30px] font-black tracking-tight"
//                 style={{ color: colors.dark }}
//               >
//                 Job Details
//               </h2>
//               <p
//                 className="mt-2 text-[15px] font-medium leading-7"
//                 style={{ color: colors.muted }}
//               >
//                 Paste the full job description below or upload a PDF, DOC, DOCX,
//                 TXT, or Markdown file and we will extract the text for you.
//               </p>

//               <div className="mt-7">
//                 <div className="flex items-center justify-between gap-4">
//                   <label
//                     htmlFor="job-description"
//                     className="text-[14px] font-black uppercase tracking-[0.12em]"
//                     style={{ color: colors.muted }}
//                   >
//                     Job Description
//                   </label>
//                   <span
//                     className="text-[13px] font-semibold"
//                     style={{ color: "#94A9B6" }}
//                   >
//                     Paste full posting or upload a file
//                   </span>
//                 </div>

//                 <div
//                   className="mt-3 rounded-[24px] border-2 border-dashed px-4 py-4"
//                   style={{
//                     borderColor: "#CFE0EC",
//                     backgroundColor: "rgba(246,241,234,0.38)",
//                   }}
//                 >
//                   <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                     <div className="flex gap-4">
//                       <div
//                         className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_10px_22px_rgba(16,36,90,0.06)]"
//                         style={{ color: colors.dark }}
//                       >
//                         <FileText className="h-7 w-7" />
//                       </div>
//                       <div>
//                         <h3
//                           className="text-[18px] font-black"
//                           style={{ color: colors.dark }}
//                         >
//                           Upload a job description file
//                         </h3>
//                         <p
//                           className="mt-1 max-w-[44ch] text-[14px] font-medium leading-7"
//                           style={{ color: colors.muted }}
//                         >
//                           Supports PDF, DOC, DOCX, TXT, and Markdown. Extracted
//                           text will appear in the editor below.
//                         </p>
//                         {jobDescriptionFileName ? (
//                           <p
//                             className="mt-2 text-[13px] font-semibold"
//                             style={{ color: colors.navy }}
//                           >
//                             Selected: {jobDescriptionFileName}
//                           </p>
//                         ) : null}
//                       </div>
//                     </div>

//                     <div>
//                       <UploadDropPanelButton
//                         onChooseFile={handleJobDescriptionFileSelected}
//                         disabled={
//                           jobDescriptionStatus.isUploading ||
//                           analysisState.status === "loading"
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <StoredPlaceholder
//                 title="Stored Job Descriptions"
//                 description="Choose a saved JD instead of uploading again."
//                 emptyText={
//                   jobDescriptionFileName
//                     ? `${jobDescriptionFileName} has been parsed into the editor below.`
//                     : "No stored job descriptions yet. Upload one once and it will appear here automatically."
//                 }
//               />

//               <div className="mt-5">
//                 <textarea
//                   id="job-description"
//                   value={jobDescription}
//                   onChange={(event) => setJobDescription(event.target.value)}
//                   placeholder="Paste responsibilities, requirements, company details, and role title here..."
//                   className="min-h-[240px] w-full rounded-[24px] border border-[#D7E2EA] bg-white px-5 py-4 text-[15px] leading-8 text-slate-700 shadow-[0_10px_28px_rgba(16,36,90,0.04)] outline-none transition focus:border-[#AFC8DB]"
//                 />
//               </div>
//             </div>
//           ) : null}

//           {upload.error ? <Toast message={upload.error} variant="error" /> : null}
//           {serverMessage ? <Toast message={serverMessage} variant="success" /> : null}
//           {jobDescriptionStatus.error ? (
//             <Toast message={jobDescriptionStatus.error} variant="error" />
//           ) : null}
//           {jobDescriptionStatus.success ? (
//             <Toast message={jobDescriptionStatus.success} variant="success" />
//           ) : null}
//           {analysisState.error ? <Toast message={analysisState.error} variant="error" /> : null}
//           {analysisState.status === "loading" ? (
//             <Loader label="Uploading files and generating the ATS analysis report..." />
//           ) : null}
//           {jobDescriptionStatus.isUploading ? (
//             <Loader label="Extracting text from the uploaded job description..." />
//           ) : null}

//           <div className="flex flex-wrap gap-3">
//             <Button
//               onClick={handleSubmit}
//               disabled={
//                 !upload.file ||
//                 isUploading ||
//                 analysisState.status === "loading" ||
//                 jobDescriptionStatus.isUploading ||
//                 (isResumeJd && !jobDescription.trim())
//               }
//               className="rounded-2xl px-6 py-3 text-base shadow-[0_18px_32px_rgba(56,129,201,0.24)]"
//             >
//               {analysisState.status === "loading"
//                 ? "Generating report..."
//                 : isResumeJd
//                   ? "Upload and run ATS + JD check"
//                   : "Upload and run ATS check"}
//             </Button>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// function UploadDropPanelButton({ onChooseFile, disabled }) {
//   const inputRef = useRef(null);

//   return (
//     <>
//       <input
//         ref={inputRef}
//         type="file"
//         accept=".pdf,.doc,.docx,.txt,.md"
//         className="hidden"
//         onChange={(event) => onChooseFile(event.target.files?.[0] || null)}
//       />
//       <Button
//         variant="outline"
//         onClick={() => inputRef.current?.click()}
//         disabled={disabled}
//         className="rounded-2xl border-[#D7E2EA] px-5 py-3 text-base"
//       >
//         <UploadCloud className="mr-2 h-4 w-4" />
//         Upload file
//       </Button>
//     </>
//   );
// }

// export default ATSAnalysisFlow;


import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  FileText,
  FolderOpen,
  Shield,
  Target,
  UploadCloud,
} from "lucide-react";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import AnimatedHeroBackground from "../components/layout/AnimatedHeroBackground";
import useResumeUpload from "../hooks/useResumeUpload";
import { uploadJobDescriptionFile } from "../services/jobDescriptionApi";
import { generateAnalysisReport } from "../services/reportApi";
import { validateJobDescriptionFile } from "../utils/fileValidation";

const colors = {
  cream: "#F6F1EA",
  border: "#CFE0EC",
  navy: "#10245A",
  dark: "#2F4054",
  muted: "#5C8194",
  softBlue: "#E7F0F8",
  softPanel: "#F8F4F0",
};

const resumeHighlights = [
  {
    title: "Text extraction",
    text: "Reads text from PDF, DOC, and DOCX resumes up to 10MB.",
  },
  {
    title: "Profile setup",
    text: "Keeps your uploaded experience separate while extracting structure and skills.",
  },
  {
    title: "ATS scoring",
    text: "Runs the 50-point scan after upload so you can move straight into the report.",
  },
];

const jdHighlights = [
  {
    title: "Role alignment",
    text: "Matches your resume against the role requirements and repeated keywords.",
  },
  {
    title: "Keyword gaps",
    text: "Highlights what is missing and where your resume needs stronger alignment.",
  },
  {
    title: "File or paste",
    text: "Paste the full posting or upload a JD file and we will extract the text for you.",
  },
];

function SideInfoPanel({ isResumeJd }) {
  const Icon = isResumeJd ? Target : FileText;
  const compact = isResumeJd;

  const label = isResumeJd ? "Targeted ATS Match" : "Resume ATS Analysis";
  const title = isResumeJd ? "Match your resume" : "Upload your resume";
  const description = isResumeJd
    ? "CareerSense compares your resume with the job description, then identifies missing keywords, match quality, and the strongest proof points."
    : "CareerSense extracts your experience, skills, and proof points, then prepares your resume for a focused ATS quality review.";

  const highlights = isResumeJd ? jdHighlights : resumeHighlights;

  return (
    <aside
      className="flex h-full flex-col bg-white"
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "22px",
        boxShadow: "0 16px 38px rgba(16,36,90,0.075)",
        padding: compact ? "18px" : "22px",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: compact ? "44px" : "50px",
          height: compact ? "44px" : "50px",
          borderRadius: compact ? "12px" : "14px",
          backgroundColor: colors.softBlue,
          color: colors.dark,
        }}
      >
        <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />
      </div>

      <p
        className={`${compact ? "mt-4" : "mt-5"} text-[10px] font-black uppercase tracking-[0.18em]`}
        style={{ color: colors.muted }}
      >
        {label}
      </p>

      <h1
        className={`${compact ? "mt-2" : "mt-2.5"} font-black leading-tight tracking-tight`}
        style={{
          color: colors.dark,
          fontSize: compact ? "23px" : "26px",
        }}
      >
        {title}
      </h1>

      <p
        className={`${compact ? "mt-2.5" : "mt-3"} max-w-md font-medium`}
        style={{
          color: colors.muted,
          fontSize: compact ? "12px" : "13px",
          lineHeight: compact ? "1.55" : "1.65",
        }}
      >
        {description}
      </p>

      <div className={`${compact ? "mt-4 space-y-3.5" : "mt-5 space-y-4"}`}>
        {highlights.map((item) => (
          <div key={item.title} className={`flex ${compact ? "gap-2.5" : "gap-3"}`}>
            <div
              className="mt-1 flex shrink-0 items-center justify-center rounded-full border bg-white"
              style={{
                width: compact ? "18px" : "20px",
                height: compact ? "18px" : "20px",
                borderColor: "#BFD2DF",
                color: colors.muted,
              }}
            >
              <CheckCircle2 className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            </div>

            <div>
              <h2
                className="font-black"
                style={{
                  color: colors.dark,
                  fontSize: compact ? "13px" : "14px",
                }}
              >
                {item.title}
              </h2>

              <p
                className={`${compact ? "mt-1" : "mt-1.5"} max-w-md font-medium`}
                style={{
                  color: colors.muted,
                  fontSize: compact ? "11.5px" : "12.5px",
                  lineHeight: compact ? "1.45" : "1.55",
                }}
              >
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className={compact ? "mt-5" : "mt-6"}
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: "16px",
          backgroundColor: "rgba(246,241,234,0.78)",
          padding: compact ? "10px 12px" : "12px 14px",
        }}
      >
        <div className="flex gap-3">
          <Shield
            className={`${compact ? "mt-0 h-3.5 w-3.5" : "mt-0.5 h-4 w-4"} shrink-0`}
            style={{ color: colors.dark }}
          />

          <p
            className="font-medium"
            style={{
              color: colors.dark,
              fontSize: compact ? "10.5px" : "11.5px",
              lineHeight: compact ? "1.45" : "1.55",
            }}
          >
            {isResumeJd
              ? "Uploaded job description text is only used to create the ATS comparison for this report."
              : "Resume text is only used to generate your ATS analysis and saved report."}
          </p>
        </div>
      </div>
    </aside>
  );
}

function StoredPlaceholder({ title, description, emptyText, compact = false }) {
  return (
    <div
      className={compact ? "mt-3.5" : "mt-5"}
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "18px",
        padding: compact ? "10px" : "12px",
      }}
    >
      <div className={`flex items-start ${compact ? "gap-2.5" : "gap-3"}`}>
        <FolderOpen
          className={`${compact ? "mt-0.5 h-3.5 w-3.5" : "mt-1 h-4 w-4"} shrink-0`}
          style={{ color: colors.muted }}
        />

        <div>
          <h3
            className="font-black"
            style={{
              color: colors.dark,
              fontSize: compact ? "12.5px" : "13.5px",
            }}
          >
            {title}
          </h3>

          <p
            className={compact ? "mt-0.5 font-medium" : "mt-1 font-medium"}
            style={{
              color: colors.muted,
              fontSize: compact ? "10.5px" : "11.5px",
              lineHeight: compact ? "1.35" : "1.5",
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        className={`${compact ? "mt-3" : "mt-4"} text-center font-medium`}
        style={{
          border: "2px dashed #CFE0EC",
          borderRadius: "14px",
          backgroundColor: "rgba(255,255,255,0.72)",
          color: colors.muted,
          padding: compact ? "10px 10px" : "14px 12px",
          fontSize: compact ? "10.5px" : "12px",
          lineHeight: compact ? "1.35" : "1.55",
        }}
      >
        {emptyText}
      </div>
    </div>
  );
}

function UploadDropPanel({
  title,
  subtitle,
  description,
  helperText,
  onChooseFile,
  accept,
  disabled,
  fileName,
  storedTitle,
  storedDescription,
  storedEmptyText,
  compact = false,
}) {
  const inputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    onChooseFile(event.dataTransfer.files?.[0] || null);
  };

  return (
    <div
      className="bg-white"
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "22px",
        boxShadow: "0 16px 38px rgba(16,36,90,0.075)",
        padding: compact ? "16px" : "22px",
      }}
    >
      <h2
        className="font-black tracking-tight"
        style={{
          color: colors.dark,
          fontSize: compact ? "18px" : "22px",
        }}
      >
        {title}
      </h2>

      <p
        className="mt-1.5 font-medium"
        style={{
          color: colors.muted,
          fontSize: compact ? "11px" : "13px",
          lineHeight: compact ? "1.35" : "1.55",
        }}
      >
        {subtitle}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => onChooseFile(event.target.files?.[0] || null)}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`${compact ? "mt-3.5" : "mt-4"} w-full text-center transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60`}
        style={{
          border: "2px dashed #CFE0EC",
          borderRadius: "20px",
          backgroundColor: "rgba(246,241,234,0.42)",
          padding: compact ? "14px 14px" : "26px 18px",
        }}
      >
        <div
          className="mx-auto flex items-center justify-center bg-white"
          style={{
            width: compact ? "40px" : "52px",
            height: compact ? "40px" : "52px",
            borderRadius: compact ? "14px" : "16px",
            boxShadow: "0 14px 30px rgba(16,36,90,0.08)",
            color: colors.dark,
          }}
        >
          <UploadCloud className={compact ? "h-5 w-5" : "h-7 w-7"} />
        </div>

        <h3
          className={compact ? "mt-2.5 font-black" : "mt-4 font-black"}
          style={{
            color: colors.dark,
            fontSize: compact ? "14px" : "17px",
          }}
        >
          {fileName ? fileName : description}
        </h3>

        <p
          className="mx-auto mt-2 max-w-lg font-medium"
        style={{
          color: colors.muted,
          fontSize: compact ? "10.5px" : "12.5px",
          lineHeight: compact ? "1.3" : "1.5",
        }}
      >
        {fileName ? "This file is selected and ready for analysis." : helperText}
      </p>
      </button>

      <StoredPlaceholder
        title={storedTitle}
        description={storedDescription}
        emptyText={
          fileName
            ? `${fileName} is selected for this analysis.`
            : storedEmptyText
        }
        compact={compact}
      />
    </div>
  );
}

function JobDetailsCard({
  jobDescription,
  setJobDescription,
  jobDescriptionFileName,
  jobDescriptionStatus,
  analysisState,
  onChooseFile,
  compact = false,
}) {
  return (
    <div
      className="bg-white"
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "22px",
        boxShadow: "0 16px 38px rgba(16,36,90,0.075)",
        padding: compact ? "14px" : "20px",
      }}
    >
      <h2
        className="font-black tracking-tight"
        style={{
          color: colors.dark,
          fontSize: compact ? "17px" : "20px",
        }}
      >
        Job Details
      </h2>

      <p
        className="mt-1.5 font-medium"
        style={{
          color: colors.muted,
          fontSize: compact ? "10.5px" : "12px",
          lineHeight: compact ? "1.35" : "1.5",
        }}
      >
        Paste the full job description below or upload a PDF, DOC, DOCX, TXT, or
        Markdown file.
      </p>

      <div
        className="mt-4"
        style={{
          border: "2px dashed #CFE0EC",
          borderRadius: "18px",
          backgroundColor: "rgba(246,241,234,0.42)",
          padding: compact ? "8px 10px" : "12px",
        }}
      >
        <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4"} lg:flex-row lg:items-center lg:justify-between`}>
          <div className={`flex ${compact ? "gap-2.5" : "gap-3"}`}>
            <div
              className="flex shrink-0 items-center justify-center bg-white"
              style={{
                width: compact ? "34px" : "40px",
                height: compact ? "34px" : "40px",
                borderRadius: "12px",
                boxShadow: "0 10px 22px rgba(16,36,90,0.06)",
                color: colors.dark,
              }}
            >
              <FileText className={compact ? "h-3.5 w-3.5" : "h-4.5 w-4.5"} />
            </div>

            <div>
              <h3
                className="font-black"
                style={{
                  color: colors.dark,
                  fontSize: compact ? "12.5px" : "14px",
                }}
              >
                Upload a job description file
              </h3>

              <p
                className={`${compact ? "mt-0.5" : "mt-1"} max-w-xl font-medium`}
                style={{
                  color: colors.muted,
                  fontSize: compact ? "10px" : "11px",
                  lineHeight: compact ? "1.35" : "1.45",
                }}
              >
                Supports PDF, DOC, DOCX, TXT, and Markdown.
              </p>

              {jobDescriptionFileName ? (
                <p
                  className="mt-1.5 text-xs font-bold"
                  style={{ color: colors.navy }}
                >
                  Selected: {jobDescriptionFileName}
                </p>
              ) : null}
            </div>
          </div>

          <UploadDropPanelButton
            onChooseFile={onChooseFile}
            disabled={
              jobDescriptionStatus.isUploading ||
              analysisState.status === "loading"
            }
          />
        </div>
      </div>

      <textarea
        id="job-description"
        value={jobDescription}
        onChange={(event) => setJobDescription(event.target.value)}
        placeholder="Paste responsibilities, requirements, company details, and role title here..."
        className={`mt-3.5 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#AFC8DB] ${
          compact ? "min-h-[72px] leading-4" : "min-h-[110px] leading-5"
        }`}
        style={{
          borderColor: colors.border,
          boxShadow: "0 10px 28px rgba(16,36,90,0.04)",
        }}
      />
    </div>
  );
}

function UploadDropPanelButton({ onChooseFile, disabled }) {
  const inputRef = useRef(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md"
        className="hidden"
        onChange={(event) => onChooseFile(event.target.files?.[0] || null)}
      />

      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="rounded-2xl border-[#D7E2EA] px-4 py-2 text-[12px]"
      >
        <UploadCloud className="mr-2 h-4 w-4" />
        Upload file
      </Button>
    </>
  );
}

function ATSAnalysisFlow() {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = useMemo(
    () => (location.pathname.includes("resume-jd") ? "resume_jd" : "resume_only"),
    [location.pathname]
  );

  const isResumeJd = mode === "resume_jd";

  const { upload, isUploading, serverMessage, selectFile, submitUpload } =
    useResumeUpload();

  const [jobDescription, setJobDescription] = useState("");
  const [jobDescriptionFileName, setJobDescriptionFileName] = useState("");
  const [jobDescriptionStatus, setJobDescriptionStatus] = useState({
    isUploading: false,
    error: "",
    success: "",
  });
  const [analysisState, setAnalysisState] = useState({
    status: "idle",
    error: "",
  });

  const handleResumeFileSelected = (file) => {
    if (!file) return;
    selectFile(file);
  };

  const handleJobDescriptionFileSelected = async (file) => {
    if (!file) return;

    const validationError = validateJobDescriptionFile(file);

    if (validationError) {
      setJobDescriptionStatus({
        isUploading: false,
        error: validationError,
        success: "",
      });
      return;
    }

    setJobDescriptionStatus({
      isUploading: true,
      error: "",
      success: "",
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadJobDescriptionFile(formData);
      setJobDescription(response.data.raw_text || "");
      setJobDescriptionFileName(response.data.file_name || file.name);
      setJobDescriptionStatus({
        isUploading: false,
        error: "",
        success:
          response.data.message || "Job description uploaded successfully.",
      });
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "Job description upload failed. Please try another file.";

      setJobDescriptionStatus({
        isUploading: false,
        error: message,
        success: "",
      });
    }
  };

  const handleSubmit = async () => {
    if (isResumeJd && !jobDescription.trim()) {
      setAnalysisState({
        status: "error",
        error: "Add a job description before running the ATS comparison.",
      });
      return;
    }

    setAnalysisState({ status: "loading", error: "" });

    const resume = await submitUpload();

    if (!resume?.resume_id) {
      setAnalysisState({ status: "error", error: "Resume upload failed." });
      return;
    }

    try {
      const response = await generateAnalysisReport({
        resume_id: resume.resume_id,
        jd_text: isResumeJd ? jobDescription : undefined,
      });

      navigate(`/reports/analysis/${response.data.analysis_id}`);
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "ATS analysis failed. Please try again in a moment.";

      setAnalysisState({ status: "error", error: message });
    }
  };

  return (
    <main
      className={`relative isolate w-full overflow-x-hidden ${
        isResumeJd
          ? "min-h-[calc(100vh-72px)] overflow-y-auto lg:h-[calc(100vh-72px)] lg:overflow-hidden"
          : "min-h-[calc(100vh-72px)] overflow-y-auto"
      }`}
      style={{ backgroundColor: colors.cream }}
    >
      <AnimatedHeroBackground />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(231,240,248,0.26) 0%, rgba(246,241,234,0.54) 48%, rgba(246,241,234,0.92) 100%)",
        }}
      />

      <section
        className={`relative z-10 mx-auto grid items-start px-4 lg:px-5 ${
          isResumeJd
            ? "gap-4 py-3 lg:h-full lg:grid-cols-[0.68fr_1fr] lg:py-4"
            : "gap-5 py-4 lg:grid-cols-[0.72fr_1.08fr]"
        }`}
        style={{ maxWidth: isResumeJd ? "1140px" : "1180px" }}
      >
        <SideInfoPanel isResumeJd={isResumeJd} />

        <div className={isResumeJd ? "space-y-2.5 lg:h-full" : "space-y-3"}>
          <UploadDropPanel
            title="Resume PDF"
            subtitle="Choose a resume from your device or reuse one from stored data sources."
            description="Click or drag resume here"
            helperText="PDF, DOC, or DOCX. Every uploaded resume is also saved in Data Sources automatically."
            onChooseFile={handleResumeFileSelected}
            accept=".pdf,.doc,.docx"
            disabled={isUploading || analysisState.status === "loading"}
            fileName={upload.file?.name}
            storedTitle="Stored Resumes"
            storedDescription="Use a resume already saved in Data Sources."
            storedEmptyText="No stored resumes yet. Upload one from your laptop or phone to save it here."
            compact={isResumeJd}
          />

          {isResumeJd ? (
            <JobDetailsCard
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              jobDescriptionFileName={jobDescriptionFileName}
              jobDescriptionStatus={jobDescriptionStatus}
              analysisState={analysisState}
              onChooseFile={handleJobDescriptionFileSelected}
              compact
            />
          ) : null}

          {upload.error ? <Toast message={upload.error} variant="error" /> : null}
          {serverMessage ? (
            <Toast message={serverMessage} variant="success" />
          ) : null}
          {jobDescriptionStatus.error ? (
            <Toast message={jobDescriptionStatus.error} variant="error" />
          ) : null}
          {jobDescriptionStatus.success ? (
            <Toast message={jobDescriptionStatus.success} variant="success" />
          ) : null}
          {analysisState.error ? (
            <Toast message={analysisState.error} variant="error" />
          ) : null}

          {analysisState.status === "loading" ? (
            <Loader label="Uploading files and generating the ATS analysis report..." />
          ) : null}

          {jobDescriptionStatus.isUploading ? (
            <Loader label="Extracting text from the uploaded job description..." />
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSubmit}
              disabled={
                !upload.file ||
                isUploading ||
                analysisState.status === "loading" ||
                jobDescriptionStatus.isUploading ||
                (isResumeJd && !jobDescription.trim())
              }
              className="rounded-2xl px-5 py-2 text-sm shadow-[0_14px_26px_rgba(56,129,201,0.22)]"
            >
              {analysisState.status === "loading"
                ? "Generating report..."
                : isResumeJd
                  ? "Upload and run ATS + JD check"
                  : "Upload and run ATS check"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ATSAnalysisFlow;
