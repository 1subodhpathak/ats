import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
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
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import ReportGenerationLoader from "../components/common/ReportGenerationLoader";

import useResumeUpload from "../hooks/useResumeUpload";
import { generateAnalysisReport } from "../services/reportApi";
import { getResume, getResumes } from "../services/resumeApi";
import useResumeStore from "../store/useResumeStore";
import {
  DEFAULT_REPORT_LEVEL,
  generateBasicAnalysisReport,
  REPORT_LEVELS,
  ReportDepthGuide,
  ReportTypeSelector,
} from "../basicreport";

import resumeUploadBackground from "../assets/home/resumeupload.png";


/* =========================================================
   THEME
   ========================================================= */

const colors = {
  navy: "#082F49",
  navyDeep: "#052A42",
  navySoft: "#124563",

  gold: "#E8B94F",
  goldDark: "#C98920",

  ivory: "#FBF7EF",
  cream: "#F7F1E7",
  white: "#FFFDFC",

  blue: "#567C8D",
  blueSoft: "#7893A2",

  border: "#D6E0E4",
};

function formatStoredResumeDate(resume) {
  const value = resume.updated_at || resume.updatedAt || resume.created_at || resume.createdAt;
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Recently uploaded";
  return `Uploaded on ${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}


/* =========================================================
   LEFT CONTENT
   ========================================================= */

const resumeOnlyBullets = [
  {
    icon: Zap,
    title: "Automatic Extraction",
    text: "We securely read your resume and extract key information.",
  },
  {
    icon: ShieldCheck,
    title: "Your Data is Safe",
    text: "Your files stay private inside your CareerSense workspace.",
  },
  {
    icon: Sparkles,
    title: "ATS Analysis Ready",
    text: "Your resume is prepared for the full ATS evaluation.",
  },
];

const resumeJdBullets = [
  {
    icon: Zap,
    title: "Automatic Extraction",
    text: "We securely read your resume and extract key information.",
  },
  {
    icon: ShieldCheck,
    title: "Your Data is Safe",
    text: "Your files stay private inside your CareerSense workspace.",
  },
  {
    icon: Target,
    title: "Ready for Role Matching",
    text: "Continue with a job description for targeted analysis.",
  },
];


/* =========================================================
   LEFT PANEL
   ========================================================= */

function InfoPanel({ isResumeJd }) {
  const bullets = isResumeJd
    ? resumeJdBullets
    : resumeOnlyBullets;

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
        bg-[rgba(6,46,71,0.80)]
        backdrop-blur-[2px]
        px-7
        py-6
        text-white
        shadow-[0_22px_55px_rgba(4,34,52,.24)]

        xl:px-8
        xl:py-7
      "
    >
      {/* subtle glass / background visibility */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[linear-gradient(145deg,rgba(255,255,255,.045),transparent_38%,rgba(0,0,0,.08))]
        "
      />

      {/* top leaf atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-12
          -top-20
          h-[270px]
          w-[280px]
          rounded-full
          bg-[#164B66]/22
          blur-[50px]
        "
      />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        {/* logo-ish top line */}
        <div className="flex items-start justify-between">
          <div
            className="
              flex
              h-[58px]
              w-[58px]
              items-center
              justify-center
              rounded-[15px]
              bg-[#F0BE4B]
              text-[#082F49]
              shadow-[0_10px_24px_rgba(232,185,79,.18)]
            "
          >
            <FileText size={27} strokeWidth={2} />
          </div>

          <div className="hidden pt-1 text-right xl:block">
            <p
              className="
                text-[6.5px]
                font-black
                uppercase
                leading-[1.55]
                tracking-[0.26em]
                text-[#BFD0D9]
              "
            >
              Careers
              <br />
              that move
              <br />
              you forward
            </p>

            <span className="ml-auto mt-2 block h-px w-7 bg-[#E8B94F]" />
          </div>
        </div>


        <p
          className="
            mt-4
            text-[9px]
            font-black
            uppercase
            tracking-[0.27em]
            text-[#F0BE4B]
          "
        >
          Resume Upload
        </p>


        <h1
          className="
            mt-2.5
            max-w-[350px]
            font-serif
            text-[32px]
            font-semibold
            leading-[1.02]
            tracking-[-0.035em]
            text-[#FFFDF7]

            xl:text-[36px]
          "
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          Turn your
          <br />
          experience into
          <br />

          <span className="text-[#F0BE4B]">
            opportunities.
          </span>
        </h1>


        <p
          className="
            mt-3
            max-w-[340px]
            text-[11px]
            font-medium
            leading-[1.55]
            text-[#CFDDE4]

            xl:text-[11.5px]
          "
        >
          Upload your resume and let CareerSense extract the key
          details needed for a precise ATS review.
        </p>


        {/* features */}
        <div
          className="
            mt-5
            rounded-[18px]
            border
            border-[#69899B]/48
            bg-[#0B3B57]/52
            px-4
            py-3.5
          "
        >
          {bullets.map(
            ({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className={`
                  flex
                  items-center
                  gap-3
                  py-3

                  ${
                    index !== bullets.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }
                `}
              >
                <div
                  className="
                    flex
                    h-[38px]
                    w-[38px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#125474]
                    text-[#F0BD4B]
                  "
                >
                  <Icon size={17} />
                </div>

                <div>
                  <h2 className="text-[11px] font-black text-white">
                    {title}
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      font-medium
                      leading-[1.45]
                      text-[#BFD0D9]
                    "
                  >
                    {text}
                  </p>
                </div>
              </div>
            )
          )}
        </div>


        {/* signature */}
        <div className="mt-auto pt-4">
          <div
            className="
              ml-auto
              max-w-[215px]
              rotate-[-5deg]
              text-center
            "
          >
            <p
              className="
                font-serif
                text-[14px]
                italic
                leading-[1.2]
                text-[#E5EDF0]
              "
            >
              Same resume.
              <br />
              Bigger opportunities.
            </p>

            <span
              className="
                mx-auto
                mt-2
                block
                h-[2px]
                w-[55px]
                rotate-[-4deg]
                bg-[#F0BE4B]
              "
            />
          </div>
        </div>
      </div>
    </aside>
  );
}


/* =========================================================
   DROP ZONE
   ========================================================= */

function UploadDropZone({
  onChooseFile,
  accept,
  disabled,
  fileName,
}) {
  const inputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();

    if (disabled) return;

    onChooseFile(
      event.dataTransfer.files?.[0] || null
    );
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) =>
          onChooseFile(
            event.target.files?.[0] || null
          )
        }
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`
          group
          relative
          flex
          w-full
          flex-col
          items-center
          justify-center
          overflow-hidden
          rounded-[18px]
          border-[1.5px]
          border-dashed
          border-[#AFCBDC]
          bg-[#FFFFFF]
          px-5
          text-center
          transition-all
          duration-300

          hover:border-[#D3A33D]
          hover:shadow-[0_12px_28px_rgba(7,47,73,.06)]

          disabled:cursor-not-allowed
          disabled:opacity-60

          ${fileName
            ? "h-[148px] sm:h-[158px] 2xl:h-[168px]"
            : "h-[190px] sm:h-[200px] 2xl:h-[210px]"}
        `}
      >
        <div
          className="
            flex
            h-[48px]
            w-[48px]
            items-center
            justify-center
            rounded-full
            bg-[#EEF5F8]
            text-[#083650]
            transition-transform
            duration-300
            group-hover:-translate-y-1
          "
        >
          <UploadCloud size={24} />
        </div>


        <h3
          className="
            mt-2.5
            font-serif
            text-[18px]
            font-semibold
            leading-none
            text-[#103650]

            xl:text-[20px]
          "
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          {fileName || "Drag & drop your resume here"}
        </h3>


        <p
          className="
            mt-2
            text-[10px]
            font-medium
            text-[#7893A2]
          "
        >
          {fileName
            ? "Resume selected and ready to continue."
            : "Only PDF files (max 5MB)"}
        </p>


        {!fileName && (
          <>
            <div
              className="
                mt-3
                flex
                h-[42px]
                min-w-[280px]
                items-center
                justify-center
                gap-2
                rounded-[9px]
                bg-[#083650]
                px-7
                text-[10.5px]
                font-black
                text-white
                shadow-[0_9px_20px_rgba(8,54,80,.16)]
              "
            >
              <UploadCloud size={14} />
              Choose PDF File
            </div>

            <p
              className="
                mt-2
                text-[8.5px]
                font-medium
                text-[#98ACB7]
              "
            >
              or drag and drop your file here
            </p>
          </>
        )}
      </button>


      {/* warning bar */}
      <div
        className="
          mt-2
          flex
          min-h-[38px]
          items-center
          justify-between
          rounded-[10px]
          border
          border-[#E5BB5E]
          bg-[#FFF6E4]
          px-4
          text-[9px]
          font-medium
          text-[#A76C13]
        "
      >
        <span className="flex items-center gap-2">
          <span
            className="
              flex
              h-[18px]
              w-[18px]
              items-center
              justify-center
              rounded-full
              border
              border-[#D6952D]
              text-[10px]
              font-black
            "
          >
            !
          </span>

          Please upload a text-selectable PDF (not a scanned image).
        </span>

        <span className="flex items-center gap-2 font-bold">
          <FileText size={12} />
          Max file size: 5MB
        </span>
      </div>
    </>
  );
}


/* =========================================================
   STORED RESUMES
   ========================================================= */

function StoredResumeCard({
  items,
  selectedId,
  onUse,
  loadingId,
  emptyText,
}) {
  return (
    <section
      className="
        h-full
        shrink-0
        overflow-hidden
        rounded-[18px]
        border
        border-[#D4DEE2]
        bg-[#FFFDFC]
        px-4
        py-3
        shadow-[0_10px_24px_rgba(7,47,73,.045)]
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div className="flex items-center gap-3">
          <FolderOpen
            size={21}
            className="text-[#C98A24]"
          />

          <h3
            className="
              text-[14px]
              font-black
              text-[#103650]
            "
          >
            Your Saved Resumes
          </h3>
        </div>

        <p
          className="
            text-[9px]
            font-medium
            text-[#7893A2]
          "
        >
          Use a previously uploaded resume
        </p>
      </div>


      <div
        className="
          mt-2
          space-y-2
          overflow-y-auto
          pr-1
        "
        style={{
          maxHeight: "220px",
        }}
      >
        {items.length > 0 ? (
          items.map((item) => {
            const isSelected =
              selectedId === item.id;

            const isLoading =
              loadingId === item.id;

            return (
              <div
                key={item.id}
                className={`
                  flex
                  min-h-[52px]
                  items-center
                  justify-between
                  gap-4
                  rounded-[11px]
                  border
                  px-3
                  py-2
                  transition-all

                  ${
                    isSelected
                      ? "border-[#91B6C8] bg-[#EFF6F8]"
                      : "border-[#DCE4E7] bg-[#FCFDFD]"
                  }
                `}
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-[38px]
                      w-[38px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[9px]
                      bg-[#EAF2F6]
                      text-[#103650]
                    "
                  >
                    <FileText size={17} />
                  </div>


                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-[10.5px]
                        font-black
                        text-[#103650]
                      "
                    >
                      {item.title}
                    </p>

                    <div
                      className="
                        mt-1
                        flex
                        items-center
                        gap-1.5
                        text-[8.5px]
                        font-medium
                        text-[#7893A2]
                      "
                    >
                      <Clock3 size={10} />

                      {item.label}
                    </div>
                  </div>
                </div>


                <Button
                  variant="secondary"
                  onClick={() =>
                    onUse(item.id)
                  }
                  disabled={isLoading}
                  className="
                    min-w-[118px]
                    rounded-[8px]
                    border
                    border-[#083650]
                    bg-[#083650]
                    px-4
                    py-2
                    text-[9px]
                    font-black
                    text-white
                    shadow-[0_7px_16px_rgba(8,54,80,.14)]
                    hover:bg-[#0D4968]
                  "
                  style={{ backgroundColor: "#083650", borderColor: "#083650", color: "#FFFFFF" }}
                >
                  <span
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    {isLoading
                      ? "Opening..."
                      : isSelected
                        ? "Selected"
                        : "Use"}

                    
                  </span>
                </Button>
              </div>
            );
          })
        ) : (
          <div
            className="
              flex
              min-h-[58px]
              items-center
              justify-center
              rounded-[11px]
              border
              border-dashed
              border-[#CFDDE3]
              bg-[#FAFCFC]
              px-4
              text-center
              text-[9.5px]
              font-medium
              text-[#7893A2]
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
   MAIN PAGE
   ========================================================= */

function ATSResumeUploadPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isResumeJd =
    location.pathname.includes("resume-jd");

  const setCurrentResume =
    useResumeStore(
      (state) => state.setCurrentResume
    );

  const {
    upload,
    isUploading,
    serverMessage,
    selectFile,
    submitUpload,
    resetUpload,
  } = useResumeUpload();

  const [storedResumes, setStoredResumes] = useState([]);
  const [selectedStoredResumeId, setSelectedStoredResumeId] =
    useState("");

  const [pageStatus, setPageStatus] = useState("loading");
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");

  const [storedResumeLoadingId, setStoredResumeLoadingId] =
    useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [reportLevel, setReportLevel] = useState(DEFAULT_REPORT_LEVEL);


  /* =======================================================
     LOAD STORED RESUMES
     ======================================================= */

  useEffect(() => {
    let active = true;

    async function loadResumes() {
      setPageStatus("loading");
      setPageError("");

      try {
        const response = await getResumes();

        if (!active) return;

        setStoredResumes(response.data || []);
        setPageStatus("success");
      } catch (error) {
        if (!active) return;

        setPageError(
          error?.response?.data?.detail ||
            "Unable to load stored resumes right now."
        );

        setPageStatus("error");
      }
    }

    loadResumes();

    return () => {
      active = false;
      resetUpload();
    };
  }, [resetUpload]);


  const storedItems = useMemo(
    () =>
      storedResumes.map((resume) => ({
        id: resume.resume_id,
        title: resume.file_name,
        updatedAt: resume.updated_at || resume.updatedAt || resume.created_at || resume.createdAt,
        label: formatStoredResumeDate(resume),
      })),
    [storedResumes]
  );


  /* =======================================================
     SELECT NEW FILE
     ======================================================= */

  const handleResumeFileSelected = (file) => {
    if (!file) return;

    const isValid = selectFile(file);

    if (!isValid) return;

    setActionError("");
    setSelectedStoredResumeId("");
  };


  /* =======================================================
     SELECT SAVED FILE
     ======================================================= */

  const handleUseStoredResume = async (resumeId) => {
    setStoredResumeLoadingId(resumeId);
    setActionError("");

    try {
      const response = await getResume(resumeId);

      setCurrentResume(response.data);
      setSelectedStoredResumeId(resumeId);
    } catch (error) {
      setActionError(
        error?.response?.data?.detail ||
          "Unable to open the selected stored resume."
      );
    } finally {
      setStoredResumeLoadingId("");
    }
  };


  /* =======================================================
     RUN / CONTINUE
     ======================================================= */

  const handlePrimaryAction = async () => {
    if (actionLoading || isUploading) return;

    setActionError("");
    setActionLoading(true);

    let resumeData = null;

    if (upload.file) {
      resumeData = await submitUpload();
    } else if (selectedStoredResumeId) {
      try {
        const response = await getResume(
          selectedStoredResumeId
        );

        resumeData = response.data;

        setCurrentResume(response.data);
      } catch (error) {
        setActionError(
          error?.response?.data?.detail ||
            "Unable to load the selected stored resume."
        );
      }
    } else {
      setActionError(
        "Upload a resume or choose a stored one before continuing."
      );
    }

    if (!resumeData?.resume_id) {
      setActionLoading(false);
      return;
    }

    if (isResumeJd) {
      navigate(
        `/check-ats/resume-jd/job-details?resumeId=${resumeData.resume_id}&reportLevel=${reportLevel}`
      );

      setActionLoading(false);
      return;
    }

    try {
      if (reportLevel === REPORT_LEVELS.BASIC) {
        const basicResponse = await generateBasicAnalysisReport({ resume_id: resumeData.resume_id });
        navigate(`/reports/basic/${resumeData.resume_id}`, {
          state: { basicReport: basicResponse.data },
        });
      } else {
        await generateAnalysisReport({ resume_id: resumeData.resume_id });
        navigate(`/reports/analysis/${resumeData.resume_id}`);
      }
    } catch (error) {
      setActionError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "ATS analysis failed. Please try again in a moment."
      );
    } finally {
      setActionLoading(false);
    }
  };


  const hasSelection =
    Boolean(upload.file || selectedStoredResumeId);


  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <main
      className="brand-type
        relative
        isolate
        w-full
        overflow-x-hidden
        overflow-y-auto
        bg-[#F8F3EA]

        lg:h-[calc(100dvh-72px)]
        lg:min-h-0
      "
    >
      {/* ===============================================
          BACKGROUND
          =============================================== */}

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
          bg-[#FBF7EF]/10
        "
      />


      {/* =========================================================
    CAREERSENSE PROCESSING OVERLAY
    ========================================================= */}

{isUploading && (
  <div
    className="
      fixed
      inset-0
      z-[100]
      flex
      items-center
      justify-center
      bg-[#062E47]/38
      p-4
      backdrop-blur-[7px]
    "
  >
    <div
      className="
        relative
        w-full
        max-w-[470px]
        overflow-hidden
        rounded-[24px]
        border
        border-[#DED7CB]
        bg-[#FFFDF8]
        shadow-[0_32px_90px_rgba(5,42,66,.26)]
      "
    >
      {/* GOLD TOP ACCENT */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          top-0
          h-[3px]
          bg-gradient-to-r
          from-transparent
          via-[#E8B94F]
          to-transparent
        "
      />


      {/* BODY */}
      <div
        className="
          flex
          flex-col
          items-center
          px-8
          pb-8
          pt-9
          text-center
        "
      >
        {/* ICON + LOADER */}
        <div
          className="
            relative
            flex
            h-[78px]
            w-[78px]
            items-center
            justify-center
          "
        >
          {/* outer ring */}
          <div
            className="
              absolute
              inset-0
              animate-spin
              rounded-full
              border-[4px]
              border-[#E5ECEF]
              border-t-[#E8B94F]
              border-r-[#E8B94F]
            "
          />

          {/* inner circle */}
          <div
            className="
              flex
              h-[56px]
              w-[56px]
              items-center
              justify-center
              rounded-full
              bg-[#F3F7F8]
              text-[#083650]
              shadow-[inset_0_0_0_1px_rgba(8,54,80,.05)]
            "
          >
            <FileText
              size={23}
              strokeWidth={1.9}
            />
          </div>
        </div>


        {/* STATUS LABEL */}
        <div
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-[#F7EAC9]
            px-3
            py-1.5
          "
        >
          <span
            className="
              h-[6px]
              w-[6px]
              animate-pulse
              rounded-full
              bg-[#C98A24]
            "
          />

          <span
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[0.18em]
              text-[#9B691C]
            "
          >
            {isUploading
              ? "Secure Upload"
              : "ATS Analysis"}
          </span>
        </div>


        {/* TITLE */}
        <h3
          className="
            mt-4
            text-[22px]
            font-black
            tracking-[-0.025em]
            text-[#103650]
          "
        >
          {isUploading
            ? "Uploading your resume"
            : "Preparing your ATS report"}
        </h3>


        {/* COPY */}
        <p
          className="
            mt-2
            max-w-[330px]
            text-[12px]
            font-medium
            leading-[1.6]
            text-[#668496]
          "
        >
          {isUploading
            ? "Securely saving your resume to your CareerSense workspace."
            : "Reviewing structure, readability, keywords, and ATS compatibility."}
        </p>


        {/* PROCESS LINE */}
        <div
          className="
            mt-7
            flex
            w-full
            items-center
            justify-center
          "
        >
          <div
            className="
              relative
              h-[4px]
              w-full
              max-w-[330px]
              overflow-hidden
              rounded-full
              bg-[#E7ECEE]
            "
          >
            <div
              className="
                absolute
                inset-y-0
                left-0
                w-[42%]
                animate-[loaderMove_1.5s_ease-in-out_infinite]
                rounded-full
                bg-gradient-to-r
                from-[#D59A2E]
                via-[#F0C85F]
                to-[#D59A2E]
              "
            />
          </div>
        </div>


        {/* SUBTEXT */}
        <p
          className="
            mt-4
            text-[9px]
            font-medium
            text-[#92A5AF]
          "
        >
          Please keep this window open for a moment.
        </p>
      </div>


      {/* BOTTOM TRUST STRIP */}
      <div
        className="
          flex
          items-center
          justify-center
          gap-2
          border-t
          border-[#EAE4DA]
          bg-[#FAF6EE]
          px-5
          py-3
          text-[8.5px]
          font-semibold
          text-[#7893A2]
        "
      >
        <ShieldCheck
          size={13}
          className="text-[#C98A24]"
        />

        Your resume stays private inside your CareerSense workspace.
      </div>
    </div>


    {/* LOCAL ANIMATION */}
    <style>
      {`
        @keyframes loaderMove {
          0% {
            transform: translateX(-115%);
          }

          50% {
            transform: translateX(135%);
          }

          100% {
            transform: translateX(330%);
          }
        }
      `}
    </style>
  </div>
)}

      <ReportGenerationLoader
        open={actionLoading}
        analysisType="resume"
        reportLevel={reportLevel}
      />


      {/* ===============================================
          DESKTOP ONE-SCREEN LAYOUT
          =============================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          grid
          w-full
          max-w-[1920px]
          gap-6
          px-5
          py-5

          lg:h-full
          lg:grid-cols-[430px_minmax(0,1fr)]
          lg:px-8
          lg:py-3

          xl:grid-cols-[455px_minmax(0,1fr)]
          xl:px-12

          2xl:grid-cols-[480px_minmax(0,1fr)]
          2xl:px-[62px]
        "
      >
        {/* LEFT */}
        <InfoPanel isResumeJd={isResumeJd} />


        {/* RIGHT */}
        <div
          className="
            flex
            min-h-0
            min-w-0
            flex-col
            py-1
          "
        >
          {/* page heading */}
          <div className="shrink-0 px-2">
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.28em]
                text-[#B6751C]

                xl:text-[9px]
              "
            >
              {isResumeJd
                ? "Step 2 of 3"
                : "Resume Analysis"}
            </p>

            <h2
              className="
                mt-1
                font-serif
                text-[32px]
                font-semibold
                leading-[1]
                tracking-[-0.035em]
                text-[#103650]

                xl:text-[37px]
                2xl:text-[40px]
              "
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              Upload Your Resume
            </h2>

            <p
              className="
                mt-1.5
                text-[10.5px]
                font-medium
                text-[#315A72]

                xl:text-[11px]
              "
            >
              Upload your resume (PDF) or choose from your saved resumes to continue.
            </p>
          </div>


          <div className="mt-2 grid shrink-0 gap-3 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)]">
            {/* upload card */}
            <section
              className="
                h-full
                rounded-[21px]
                border
                border-[#DDD8CF]
                bg-[#FFFDFC]
                p-2.5
                shadow-[0_15px_38px_rgba(7,47,73,.075)]
              "
            >
              <UploadDropZone
                onChooseFile={handleResumeFileSelected}
                accept=".pdf,.doc,.docx"
                disabled={isUploading || actionLoading}
                fileName={upload.file?.name}
              />
            </section>

            {/* saved resumes */}
            <StoredResumeCard
              items={storedItems}
              selectedId={selectedStoredResumeId}
              onUse={handleUseStoredResume}
              loadingId={storedResumeLoadingId}
              emptyText="No saved resumes yet. Upload one above and it will appear here automatically."
            />
          </div>


          {/* status / errors */}
          <div
            className="
              mt-1
              min-h-[22px]
              shrink-0
              space-y-1
            "
          >
            {pageStatus === "loading" ? (
              <Loader label="Loading saved resumes..." />
            ) : null}

            {pageError ? (
              <Toast
                message={pageError}
                variant="error"
              />
            ) : null}

            {upload.error ? (
              <Toast
                message={upload.error}
                variant="error"
              />
            ) : null}

            {serverMessage ? (
              <Toast
                message={serverMessage}
                variant="success"
              />
            ) : null}

            {actionError ? (
              <Toast
                message={actionError}
                variant="error"
              />
            ) : null}
          </div>

          {!isResumeJd ? (
            <div className="mt-2 grid shrink-0 gap-3">
              <ReportTypeSelector
                value={reportLevel}
                onChange={setReportLevel}
                disabled={isUploading || actionLoading}
                compact
                showResumeTokenEstimate
              />
              <ReportDepthGuide selectedLevel={reportLevel} />
            </div>
          ) : null}


          {/* =================================================
              ACTION
              Hidden before selection to match reference.
              Functionality remains available as soon as user
              uploads or chooses a saved resume.
              ================================================= */}

          {hasSelection && (
            <div
              className="
                mt-2
                flex
                shrink-0
                justify-end
                pb-4
              "
            >
              <Button
                variant="secondary"
                onClick={handlePrimaryAction}
                disabled={
                  isUploading ||
                  actionLoading ||
                  storedResumeLoadingId !== ""
                }
                className="
                  group
                  min-w-[230px]
                  rounded-[9px]
                  bg-[#083650]
                  px-5
                  py-2.5
                  text-[10px]
                  font-black
                  text-white
                  shadow-[0_9px_20px_rgba(8,54,80,.17)]
                  hover:bg-[#0D4968]
                "
                style={{ backgroundColor: "#083650", color: "#FFFFFF" }}
              >
                <span
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2.5
                  "
                >
                  {actionLoading || isUploading
                    ? isResumeJd
                      ? "Preparing Resume..."
                      : "Running ATS Check..."
                    : isResumeJd
                      ? "Continue to Job Details"
                      : "Run ATS Check"}

                  {!actionLoading &&
                    !isUploading && (
                      <ArrowRight
                        size={13}
                        className="
                          transition-transform
                          group-hover:translate-x-1
                        "
                      />
                    )}
                </span>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default ATSResumeUploadPage;
