import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  ArrowRight,
  Clock3,
  FileText,
  FolderOpen,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  Zap,
} from "lucide-react";

import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import ReportGenerationLoader from "../components/common/ReportGenerationLoader";

import {
  getJobDescription,
  getJobDescriptions,
  uploadJobDescriptionFile,
} from "../services/jobDescriptionApi";

import { generateAnalysisReport } from "../services/reportApi";

import {
  DEFAULT_REPORT_LEVEL,
  generateBasicAnalysisReport,
  REPORT_LEVELS,
  ReportTypeSelector,
} from "../basicreport";

import { getResume } from "../services/resumeApi";
import useResumeStore from "../store/useResumeStore";
import { validateJobDescriptionFile } from "../utils/fileValidation";

import resumeUploadBackground from "../assets/home/resumeupload.png";

/* =========================================================
   LEFT PANEL DATA
========================================================= */

const jdBullets = [
  {
    title: "Better Job Matches",
    text: "See how well your resume fits the role requirements.",
    icon: Zap,
  },
  {
    title: "Find Skill Gaps",
    text: "Identify missing skills and get suggestions to stand out.",
    icon: ShieldCheck,
  },
  {
    title: "Tailored Recommendations",
    text: "Get actionable insights to improve your chances.",
    icon: Sparkles,
  },
];

/* =========================================================
   LEFT PANEL
========================================================= */

function InfoPanel() {
  return (
    <aside
      className="
        relative
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-[rgba(5,48,74,0.83)]
        px-7
        py-7
        text-white
        shadow-[0_24px_60px_rgba(3,30,47,.22)]
        backdrop-blur-[3px]

        xl:px-8
        xl:py-8
      "
    >
      {/* inner wash */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.012)_55%,rgba(2,25,40,.14))]
        "
      />

      {/* atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-[160px]
          -left-[100px]
          h-[360px]
          w-[360px]
          rounded-full
          bg-[#082D45]/30
          blur-[90px]
        "
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        {/* icon */}
        <div
          className="
            flex
            h-[58px]
            w-[58px]
            shrink-0
            items-center
            justify-center
            rounded-[17px]
            border
            border-[#E9BC50]
            bg-[#F3BA2E]
            text-[#103A54]
            shadow-[0_12px_26px_rgba(188,128,14,.20)]
          "
        >
          <Target className="h-[26px] w-[26px]" strokeWidth={2.1} />
        </div>

        <p
          className="
            mt-6
            text-[9px]
            font-black
            uppercase
            tracking-[0.28em]
            text-[#F0C45A]
          "
        >
          Job Details
        </p>

        <h1
          className="
            mt-3
            max-w-[355px]
            text-[34px]
            font-semibold
            leading-[1.02]
            tracking-[-0.045em]
            text-white

            xl:text-[37px]
          "
        >
          Match your resume
          <br />
          to the right
          <br />
          <span className="text-[#F3C247]">
            opportunity.
          </span>
        </h1>

        <p
          className="
            mt-4
            max-w-[355px]
            text-[12px]
            font-medium
            leading-[1.6]
            text-white/76
          "
        >
          Add the target job description so CareerSense can compare your
          resume against the skills, keywords, and expectations that matter.
        </p>

        {/* benefits */}
        <div
          className="
            mt-6
            rounded-[20px]
            border
            border-white/30
            bg-[#193C51]/34
            px-4
            backdrop-blur-[6px]
          "
        >
          {jdBullets.map(({ title, text, icon: Icon }, index) => (
            <div
              key={title}
              className={`
                flex
                items-start
                gap-3
                py-[14px]

                ${
                  index !== jdBullets.length - 1
                    ? "border-b border-white/15"
                    : ""
                }
              `}
            >
              <div
                className="
                  flex
                  h-[40px]
                  w-[40px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#0E6C91]/90
                  text-[#F4BF37]
                "
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <h2 className="text-[11px] font-extrabold text-white">
                  {title}
                </h2>

                <p
                  className="
                    mt-1
                    max-w-[270px]
                    text-[9px]
                    font-medium
                    leading-[1.45]
                    text-white/58
                  "
                >
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* handwritten note */}
        <div className="mt-auto hidden pt-5 lg:block">
          <div className="ml-auto w-fit rotate-[-5deg] text-right">
            <p
              className="
                font-serif
                text-[13px]
                italic
                leading-[1.2]
                text-white/62
              "
            >
              Same resume.
              <br />
              Bigger opportunities.
            </p>

            <div className="ml-auto mt-2 h-px w-[74px] bg-[#DDA32A]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* =========================================================
   JOB DESCRIPTION FILE UPLOAD
========================================================= */

function UploadJobFileRow({
  fileName,
  onChooseFile,
  disabled,
}) {
  const inputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();

    if (disabled) return;

    onChooseFile(event.dataTransfer.files?.[0] || null);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md"
        className="hidden"
        onChange={(event) =>
          onChooseFile(event.target.files?.[0] || null)
        }
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="
          group
          flex
          h-[142px]
          w-full
          flex-col
          items-center
          justify-center
          rounded-[16px]
          border-[1.5px]
          border-dashed
          border-[#ABC8D8]
          bg-[#FEFEFD]
          px-5
          text-center
          transition-all
          duration-200

          hover:border-[#D0A044]
          hover:shadow-[0_10px_24px_rgba(7,47,73,.06)]

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <span
          className="
            grid
            h-[42px]
            w-[42px]
            place-items-center
            rounded-full
            bg-[#EEF5F8]
            text-[#083650]
            transition-transform
            duration-200

            group-hover:-translate-y-0.5
          "
        >
          <UploadCloud className="h-5 w-5" />
        </span>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[12px] font-black text-[#123A54]">
            {fileName || "Drag & drop a job description here"}
          </span>

          {!fileName ? (
            <span
              className="
                rounded-full
                bg-[#FFF2D3]
                px-2.5
                py-1
                text-[6px]
                font-black
                uppercase
                tracking-[0.12em]
                text-[#A66B0D]
              "
            >
              Optional File
            </span>
          ) : null}
        </div>

        <span className="mt-1 text-[8px] font-medium text-[#7893A2]">
          {fileName
            ? "Job description selected and ready to review."
            : "PDF, DOC, DOCX, TXT, or Markdown"}
        </span>

        <span
          className="
            mt-2
            inline-flex
            h-9
            min-w-[215px]
            items-center
            justify-center
            gap-2
            rounded-[9px]
            bg-[#083650]
            px-5
            text-[9.5px]
            font-black
            text-white
            shadow-[0_8px_18px_rgba(8,54,80,.15)]
          "
        >
          <UploadCloud className="h-[13px] w-[13px]" />

          {disabled
            ? "Please wait..."
            : fileName
            ? "Choose Another File"
            : "Choose File"}
        </span>
      </button>
    </div>
  );
}

/* =========================================================
   MAIN JOB DESCRIPTION CARD
========================================================= */

function ExtractedJobDescriptionCard({
  value,
  onChange,
  fileName,
  onChooseFile,
  disabled,
}) {
  return (
    <section
      className="
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden
        rounded-[19px]
        border
        border-[#D8E1E6]
        bg-[#FBF7F0]
        p-3
        shadow-[0_12px_28px_rgba(18,51,73,.045)]
      "
    >
      {/* header */}
      <div className="flex shrink-0 items-start justify-between gap-4">
        <div>
          <h3
            className="
              text-[13px]
              font-black
              tracking-[-0.02em]
              text-[#123A54]
            "
          >
            Job Description
          </h3>

          <p className="mt-1 text-[8px] font-medium text-[#718B9C]">
            Upload, paste, or review the role details before analysis.
          </p>
        </div>

        <span
          className="
            hidden
            rounded-full
            bg-[#FFF2D3]
            px-3
            py-1.5
            text-[6px]
            font-black
            uppercase
            tracking-[0.12em]
            text-[#A66B0D]

            sm:block
          "
        >
          Review Before Analysis
        </span>
      </div>

      {/* upload */}
      <div className="mt-3">
        <UploadJobFileRow
          fileName={fileName}
          onChooseFile={onChooseFile}
          disabled={disabled}
        />
      </div>

      {/* textarea */}
      <div className="relative mt-2.5 min-h-0 flex-1">
        <textarea
          value={value}
          onChange={onChange}
          maxLength={5000}
          placeholder="Or paste the job description here (responsibilities, requirements, company details, and role title)..."
          className="
            h-full
            min-h-[130px]
            w-full
            resize-none
            overflow-y-auto
            rounded-[15px]
            border
            border-[#D5E0E6]
            bg-white
            px-4
            py-3
            pb-8
            text-[10.5px]
            font-medium
            leading-[1.6]
            text-[#36586D]
            outline-none
            transition

            placeholder:text-[#9AAEBB]

            focus:border-[#C58A25]
            focus:ring-2
            focus:ring-[#EFCB83]/20
          "
        />

        <span
          className="
            pointer-events-none
            absolute
            bottom-3
            right-4
            text-[8px]
            font-medium
            text-[#708A9B]
          "
        >
          {value.length}/5000
        </span>
      </div>
    </section>
  );
}

/* =========================================================
   SAVED JOB DESCRIPTIONS
========================================================= */

function StoredJobDescriptionsCard({
  items,
  selectedId,
  onUse,
  loadingId,
  emptyText,
}) {
  return (
    <section
      className="
        flex
        h-full
        min-h-0
        flex-col
        overflow-hidden
        rounded-[19px]
        border
        border-[#D8E1E6]
        bg-[#F8F1E5]
        px-4
        py-4
        shadow-[0_12px_28px_rgba(18,51,73,.045)]
      "
    >
      {/* header */}
      <div className="flex shrink-0 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-[48px]
              w-[48px]
              shrink-0
              items-center
              justify-center
              rounded-[14px]
              bg-[#FFF0CC]
              text-[#C88615]
            "
          >
            <FolderOpen className="h-[21px] w-[21px]" />
          </div>

          <div>
            <h3 className="text-[14px] font-black text-[#123A54]">
              Your Saved Job Descriptions
            </h3>

            <p className="mt-[2px] text-[9px] font-medium text-[#718B9C]">
              Use a previously uploaded job description.
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <span
            className="
              rounded-full
              bg-[#EAF2F6]
              px-3
              py-2
              text-[8px]
              font-bold
              text-[#607F92]
            "
          >
            {items.length} saved
          </span>
        ) : null}
      </div>

      {/* list */}
      <div
        className="
          mt-4
          min-h-0
          flex-1
          space-y-2.5
          overflow-y-auto
          pr-1
        "
      >
        {items.length > 0 ? (
          items.map((item) => {
            const isSelected = selectedId === item.id;
            const isLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className={`
                  flex
                  min-h-[72px]
                  items-center
                  justify-between
                  gap-4
                  rounded-[15px]
                  border
                  px-4
                  py-3
                  shadow-[0_4px_10px_rgba(16,58,84,.025)]

                  ${
                    isSelected
                      ? "border-[#9DBFD0] bg-[#F2F8FB]"
                      : "border-[#DCE4E7] bg-white"
                  }
                `}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div
                    className="
                      flex
                      h-[48px]
                      w-[48px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[13px]
                      bg-[#EEF3F6]
                      text-[#173B54]
                    "
                  >
                    <FileText className="h-[20px] w-[20px]" />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-[11px]
                        font-black
                        text-[#173B54]
                      "
                    >
                      {item.title}
                    </p>

                    <div
                      className="
                        mt-[5px]
                        flex
                        items-center
                        gap-1.5
                        text-[8.5px]
                        text-[#79909F]
                      "
                    >
                      <Clock3 className="h-[10px] w-[10px]" />

                      <span>{item.label}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onUse(item.id)}
                  disabled={isLoading}
                  className="
                    min-h-[46px]
                    min-w-[88px]
                    shrink-0
                    rounded-[13px]
                    !bg-[#083650]
                    px-5
                    py-3
                    text-[11px]
                    font-black
                    text-white
                    shadow-[0_8px_18px_rgba(8,54,80,.14)]

                    hover:!bg-[#124A68]
                  "
                >
                  {isLoading
                    ? "Opening..."
                    : isSelected
                    ? "Selected"
                    : "Use"}
                </Button>
              </div>
            );
          })
        ) : (
          <div
            className="
              flex
              h-full
              min-h-[160px]
              items-center
              justify-center
              rounded-[16px]
              border
              border-dashed
              border-[#CBDCE5]
              bg-white
              px-5
              text-center
              text-[9px]
              font-medium
              leading-[1.5]
              text-[#718B9C]
            "
          >
            {emptyText}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

function ATSJobDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resumeIdFromQuery = searchParams.get("resumeId");
  const requestedReportLevel = searchParams.get("reportLevel");

  const currentResume = useResumeStore(
    (state) => state.currentResume
  );

  const setCurrentResume = useResumeStore(
    (state) => state.setCurrentResume
  );

  const [jobDescription, setJobDescription] = useState("");

  const [
    jobDescriptionFileName,
    setJobDescriptionFileName,
  ] = useState("");

  const [
    selectedStoredJobDescriptionId,
    setSelectedStoredJobDescriptionId,
  ] = useState("");

  const [
    storedJobDescriptions,
    setStoredJobDescriptions,
  ] = useState([]);

  const [pageStatus, setPageStatus] = useState("loading");
  const [pageError, setPageError] = useState("");

  const [
    jobDescriptionStatus,
    setJobDescriptionStatus,
  ] = useState({
    isUploading: false,
    error: "",
    success: "",
  });

  const [resumeStatus, setResumeStatus] = useState({
    isLoading: false,
    error: "",
  });

  const [analysisState, setAnalysisState] = useState({
    status: "idle",
    error: "",
  });

  const [reportLevel, setReportLevel] = useState(
    requestedReportLevel === REPORT_LEVELS.DETAILED
      ? REPORT_LEVELS.DETAILED
      : DEFAULT_REPORT_LEVEL
  );

  const [
    storedJobLoadingId,
    setStoredJobLoadingId,
  ] = useState("");

  const activeResumeId =
    currentResume?.resume_id || resumeIdFromQuery || "";

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      setPageStatus("loading");
      setPageError("");

      try {
        const requests = [getJobDescriptions()];

        if (
          resumeIdFromQuery &&
          (!currentResume ||
            currentResume.resume_id !== resumeIdFromQuery)
        ) {
          setResumeStatus({
            isLoading: true,
            error: "",
          });

          requests.push(getResume(resumeIdFromQuery));
        }

        const [jobDescriptionsResponse, resumeResponse] =
          await Promise.all(requests);

        if (!active) return;

        setStoredJobDescriptions(jobDescriptionsResponse.data || []);

        if (resumeResponse?.data) {
          setCurrentResume(resumeResponse.data);
        }

        setResumeStatus({
          isLoading: false,
          error: "",
        });

        setPageStatus("success");
      } catch (error) {
        if (!active) return;

        setPageError(
          error?.response?.data?.detail ||
            "Unable to load stored job descriptions right now."
        );

        setResumeStatus({
          isLoading: false,
          error:
            error?.response?.data?.detail ||
            "Unable to load the selected resume.",
        });

        setPageStatus("error");
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [currentResume, resumeIdFromQuery, setCurrentResume]);

  /* =======================================================
     REDIRECT IF NO RESUME
  ======================================================= */

  useEffect(() => {
    if (!resumeIdFromQuery && !currentResume?.resume_id) {
      navigate("/check-ats/resume-jd", {
        replace: true,
      });
    }
  }, [currentResume?.resume_id, navigate, resumeIdFromQuery]);

  /* =======================================================
     STORED JD ITEMS
  ======================================================= */

  const storedItems = useMemo(
    () =>
      storedJobDescriptions.map((item) => ({
        id: item.job_description_id || item.id,

        title:
          item.title ||
          item.file_name ||
          item.name ||
          "Stored job description",

        createdAt: item.created_at,

        label: item.created_at
          ? `Saved on ${new Date(item.created_at).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            )}`
          : "Saved job description",
      })),
    [storedJobDescriptions]
  );

  const refreshStoredJobDescriptions = async () => {
    try {
      const response = await getJobDescriptions();

      setStoredJobDescriptions(response.data || []);
    } catch {
      // Keep existing data if refresh fails.
    }
  };

  /* =======================================================
     UPLOAD JD FILE
  ======================================================= */

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

      const storedText =
        response.data.raw_text ||
        response.data.text ||
        response.data.content ||
        response.data.job_description ||
        response.data.description ||
        "";

      if (!storedText.trim()) {
        throw new Error(
          "This job description does not contain readable text."
        );
      }

      setJobDescription(storedText);

      setJobDescriptionFileName(
        response.data.file_name || file.name
      );

      setSelectedStoredJobDescriptionId(
        response.data.job_description_id || ""
      );

      setJobDescriptionStatus({
        isUploading: false,
        error: "",
        success:
          response.data.message ||
          "Job description uploaded successfully.",
      });

      refreshStoredJobDescriptions();
    } catch (error) {
      setJobDescriptionStatus({
        isUploading: false,
        error:
          error?.response?.data?.detail ||
          error?.message ||
          "Job description upload failed. Please try another file.",
        success: "",
      });
    }
  };

  /* =======================================================
     USE SAVED JD
  ======================================================= */

  const handleUseStoredJobDescription = async (
    jobDescriptionId
  ) => {
    setStoredJobLoadingId(jobDescriptionId);

    setJobDescriptionStatus({
      isUploading: false,
      error: "",
      success: "",
    });

    try {
      const response = await getJobDescription(jobDescriptionId);

      const storedText =
        response.data.raw_text ||
        response.data.text ||
        response.data.content ||
        response.data.job_description ||
        response.data.description ||
        "";

      if (!storedText.trim()) {
        throw new Error(
          "This saved job description does not contain readable text."
        );
      }

      setJobDescription(storedText);

      setJobDescriptionFileName(
        response.data.file_name ||
          response.data.name ||
          response.data.title ||
          "Stored job description"
      );

      setSelectedStoredJobDescriptionId(jobDescriptionId);

      setJobDescriptionStatus({
        isUploading: false,
        error: "",
        success: "Saved job description selected.",
      });
    } catch (error) {
      setJobDescriptionStatus({
        isUploading: false,
        error:
          error?.response?.data?.detail ||
          error?.message ||
          "Unable to load the selected stored job description.",
        success: "",
      });
    } finally {
      setStoredJobLoadingId("");
    }
  };

  /* =======================================================
     GENERATE REPORT
  ======================================================= */

  const handleGenerateReport = async () => {
    if (analysisState.status === "loading") return;

    if (!activeResumeId) {
      setAnalysisState({
        status: "error",
        error:
          "Select a resume before running the ATS comparison.",
      });

      return;
    }

    if (!jobDescription.trim()) {
      setAnalysisState({
        status: "error",
        error:
          "Add a job description before running the ATS comparison.",
      });

      return;
    }

    setAnalysisState({
      status: "loading",
      error: "",
    });

    try {
      if (reportLevel === REPORT_LEVELS.BASIC) {
        const basicResponse = await generateBasicAnalysisReport({
          resume_id: activeResumeId,
          jd_text: jobDescription,
        });

        navigate(`/reports/basic/${activeResumeId}`, {
          state: { basicReport: basicResponse.data },
        });
      } else {
        await generateAnalysisReport({
          resume_id: activeResumeId,
          jd_text: jobDescription,
        });

        navigate(`/reports/analysis/${activeResumeId}`);
      }
    } catch (error) {
      setAnalysisState({
        status: "error",
        error:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "ATS analysis failed. Please try again in a moment.",
      });
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  const headerNotice = pageError
    ? { message: pageError, variant: "error" }
    : resumeStatus.error
      ? { message: resumeStatus.error, variant: "error" }
      : jobDescriptionStatus.error
        ? { message: jobDescriptionStatus.error, variant: "error" }
        : analysisState.error
          ? { message: analysisState.error, variant: "error" }
          : jobDescriptionStatus.isUploading
            ? { message: "Extracting text from the uploaded job description...", variant: "info" }
            : storedJobLoadingId
              ? { message: "Opening stored job description...", variant: "info" }
              : resumeStatus.isLoading
                ? { message: "Loading selected resume...", variant: "info" }
                : pageStatus === "loading"
                  ? { message: "Loading saved job descriptions...", variant: "info" }
                  : jobDescriptionStatus.success
                    ? { message: jobDescriptionStatus.success, variant: "success" }
                    : null;

  return (
    <main
      className="
        brand-type
        relative
        isolate
        w-full
        overflow-hidden
        bg-[#F8F3EA]

        lg:h-[calc(100dvh-72px)]
        lg:min-h-0
      "
      style={{
        minHeight: "calc(100vh - 72px)",
      }}
    >
      <ReportGenerationLoader
        open={analysisState.status === "loading"}
        analysisType="resume_jd"
        reportLevel={reportLevel}
      />

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <img
        src={resumeUploadBackground}
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[rgba(251,247,239,.04)]
        "
      />

      {/* ===================================================
          PAGE GRID
      =================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          grid
          h-full
          w-full
          max-w-[1920px]
          gap-5
          px-5
          py-3

          lg:grid-cols-[430px_minmax(0,1fr)]
          lg:px-8

          xl:grid-cols-[450px_minmax(0,1fr)]
          xl:px-12

          2xl:grid-cols-[470px_minmax(0,1fr)]
          2xl:px-[58px]
        "
      >
        {/* LEFT */}
        <InfoPanel />

        {/* =================================================
            RIGHT
        ================================================= */}

        <div
          className="
            relative
            flex
            h-full
            min-h-0
            flex-col
            overflow-visible
            py-1
          "
        >
          {/* HEADER */}
          <div
            className="
              flex
              shrink-0
              items-start
              justify-between
              gap-5
              px-1
            "
          >
            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.27em]
                  text-[#B77A16]
                "
              >
                Step 3 of 3
              </p>

              <h2
                className="
                  mt-1
                  text-[34px]
                  font-semibold
                  leading-none
                  tracking-[-0.045em]
                  text-[#123A54]

                  xl:text-[37px]
                "
              >
                Add Job Details
              </h2>

              <p
                className="
                  mt-2
                  text-[10.5px]
                  font-medium
                  text-[#567A90]
                "
              >
                Add the job description so CareerSense can measure match
                quality, keywords, and role alignment.
              </p>
            </div>

            <div className="flex min-w-0 max-w-[610px] flex-1 items-start justify-end gap-2">
              {headerNotice ? (
                <div className="min-w-0 max-w-[360px] flex-1 pt-1" role="status" aria-live="polite">
                  <Toast message={headerNotice.message} variant={headerNotice.variant} compact />
                </div>
              ) : null}

              {currentResume?.file_name ? (
                <div className="hidden max-w-[245px] shrink-0 items-center gap-3 rounded-[12px] border border-[#D9E3E8] bg-white px-3 py-2 shadow-[0_8px_20px_rgba(18,51,73,.05)] md:flex">
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#FFF2D7] text-[#C58413]">
                    <FileText className="h-[16px] w-[16px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[6.5px] font-black uppercase tracking-[0.15em] text-[#8297A5]">Selected Resume</p>
                    <p className="mt-[2px] truncate text-[9px] font-black text-[#173B54]">{currentResume.file_name}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* =================================================
              MAIN CONTENT ROW
          ================================================= */}

          <div
            className="
              mt-3
              grid
              min-h-0
              flex-1
              gap-3

              lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,.94fr)]
            "
          >
            <ExtractedJobDescriptionCard
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              fileName={jobDescriptionFileName}
              onChooseFile={handleJobDescriptionFileSelected}
              disabled={
                jobDescriptionStatus.isUploading ||
                analysisState.status === "loading"
              }
            />

            <StoredJobDescriptionsCard
              items={storedItems}
              selectedId={selectedStoredJobDescriptionId}
              onUse={handleUseStoredJobDescription}
              loadingId={storedJobLoadingId}
              emptyText="No saved job descriptions yet. Upload one and it will appear here automatically."
            />
          </div>

          {/* =================================================
              REPORT DEPTH
          ================================================= */}

          <div className="mt-3 shrink-0">
            <ReportTypeSelector
              value={reportLevel}
              onChange={setReportLevel}
              disabled={
                jobDescriptionStatus.isUploading ||
                analysisState.status === "loading"
              }
              compact
              showResumeJdTokenEstimate
            />
          </div>

          {/* =================================================
              ACTION BAR
          ================================================= */}

          <div
            className="
              mt-2
              flex
              shrink-0
              items-center
              justify-between
              gap-4
              pb-1
            "
          >
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="
                  h-[14px]
                  w-[14px]
                  shrink-0
                  text-[#C78818]
                "
              />

              <p
                className="
                  text-[8px]
                  font-semibold
                  text-[#738C9D]
                "
              >
                Your information stays private in your CareerSense workspace.
              </p>
            </div>

            <Button
              onClick={handleGenerateReport}
              disabled={
                analysisState.status === "loading" ||
                jobDescriptionStatus.isUploading ||
                !activeResumeId ||
                !jobDescription.trim()
              }
              className="
                group
                min-w-[260px]
                shrink-0
                rounded-[10px]
                !bg-[#083650]
                px-5
                py-3
                text-[10.5px]
                font-black
                text-white
                shadow-[0_10px_22px_rgba(8,54,80,.18)]

                hover:!bg-[#0D4968]
              "
              style={{
                backgroundColor: "#083650",
                color: "#FFFFFF",
              }}
            >
              <span className="inline-flex items-center gap-3">
                {analysisState.status === "loading"
                  ? "Generating report..."
                  : "Run ATS + JD Check"}

                {analysisState.status !== "loading" ? (
                  <ArrowRight
                    className="
                      h-[14px]
                      w-[14px]
                      transition-transform

                      group-hover:translate-x-1
                    "
                  />
                ) : null}
              </span>
            </Button>
          </div>

        </div>
      </section>
    </main>
  );
}

export default ATSJobDetailsPage;
