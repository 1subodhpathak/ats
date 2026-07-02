import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  ShieldCheck,
  Target,
  UploadCloud,
} from "lucide-react";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import AnimatedHeroBackground from "../components/layout/AnimatedHeroBackground";
import useResumeUpload from "../hooks/useResumeUpload";
import { generateAnalysisReport } from "../services/reportApi";
import { getResume, getResumes } from "../services/resumeApi";
import useResumeStore from "../store/useResumeStore";

const colors = {
  cream: "#F6F1EA",
  border: "#CFE0EC",
  navy: "#10245A",
  dark: "#2F4054",
  muted: "#5C8194",
  softBlue: "#E7F0F8",
};

const resumeOnlyBullets = [
  {
    title: "Text extraction",
    text: "Reads text from PDF resumes up to 5MB.",
  },
  {
    title: "Profile setup",
    text: "Keeps your manual details separate while extracting only resume experience and skills.",
  },
  {
    title: "AI drafting",
    text: "Resume-only flow opens the editor after CareerSense drafts the content.",
  },
];

const resumeJdBullets = [
  {
    title: "Role alignment",
    text: "Use the uploaded resume as the source file for the next job-description match step.",
  },
  {
    title: "Keyword gaps",
    text: "Continue into the JD page to compare required language against your existing experience.",
  },
  {
    title: "Stored reuse",
    text: "Previously uploaded resumes stay available here so you can rerun checks without uploading again.",
  },
];

function InfoPanel({ isResumeJd }) {
  const Icon = isResumeJd ? Target : FileText;
  const bullets = isResumeJd ? resumeJdBullets : resumeOnlyBullets;

  return (
    <aside
      className="flex h-full min-h-0 flex-col bg-white"
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "24px",
        boxShadow: "0 16px 36px rgba(16,36,90,0.075)",
        padding: "28px",
      }}
    >
      <div
        className="flex shrink-0 items-center justify-center"
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "16px",
          backgroundColor: colors.softBlue,
          color: colors.dark,
        }}
      >
        <Icon className="h-6 w-6" />
      </div>

      <p
        className="mt-7 text-[11px] font-black uppercase tracking-[0.22em]"
        style={{ color: colors.muted }}
      >
        {isResumeJd ? "Targeted ATS Match" : "Resume ATS Analysis"}
      </p>

      <h1
        className="mt-3 font-black leading-tight tracking-tight"
        style={{
          color: colors.dark,
          fontSize: "30px",
        }}
      >
        Upload your resume
      </h1>

      <p
        className="mt-4 max-w-md font-medium"
        style={{
          color: colors.muted,
          fontSize: "14.5px",
          lineHeight: "1.7",
        }}
      >
        {isResumeJd
          ? "Start with the resume you want to match. On the next page, you can upload or reuse a stored job description."
          : "CareerSense extracts your experience, skills, and proof points so your ATS review can start from a structured resume."}
      </p>

      <div className="mt-7 space-y-5">
        {bullets.map((item) => (
          <div key={item.title} className="flex gap-3">
            <div
              className="mt-1 flex shrink-0 items-center justify-center rounded-full border bg-white"
              style={{
                width: "20px",
                height: "20px",
                borderColor: "#BFD2DF",
                color: colors.muted,
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>

            <div>
              <h2
                className="font-black"
                style={{
                  color: colors.dark,
                  fontSize: "15.5px",
                }}
              >
                {item.title}
              </h2>

              <p
                className="mt-1.5 max-w-md font-medium"
                style={{
                  color: colors.muted,
                  fontSize: "13.5px",
                  lineHeight: "1.65",
                }}
              >
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-auto shrink-0"
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: "18px",
          backgroundColor: "rgba(246,241,234,0.78)",
          padding: "15px 16px",
        }}
      >
        <div className="flex gap-3">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: colors.dark }}
          />

          <p
            className="font-medium"
            style={{
              color: colors.dark,
              fontSize: "12.5px",
              lineHeight: "1.6",
            }}
          >
            {isResumeJd
              ? "Uploaded resumes are saved so you can reuse them later in ATS-only and ATS + JD workflows."
              : "Resume text is only used to generate your ATS analysis and saved report."}
          </p>
        </div>
      </div>
    </aside>
  );
}

function UploadDropZone({ onChooseFile, accept, disabled, fileName }) {
  const inputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    onChooseFile(event.dataTransfer.files?.[0] || null);
  };

  return (
    <>
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
        className="mt-5 w-full shrink-0 text-center transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          border: "2px dashed #CFE0EC",
          borderRadius: "22px",
          backgroundColor: "rgba(246,241,234,0.42)",
          padding: "36px 24px",
        }}
      >
        <div
          className="mx-auto flex items-center justify-center bg-white"
          style={{
            width: "62px",
            height: "62px",
            borderRadius: "18px",
            boxShadow: "0 14px 30px rgba(16,36,90,0.08)",
            color: colors.dark,
          }}
        >
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3
          className="mt-5 font-black"
          style={{
            color: colors.dark,
            fontSize: "20px",
          }}
        >
          {fileName || "Click or drag PDF here"}
        </h3>

        <p
          className="mx-auto mt-2 max-w-lg font-medium"
          style={{
            color: colors.muted,
            fontSize: "13.5px",
            lineHeight: "1.6",
          }}
        >
          {fileName
            ? "This file is selected and ready for analysis."
            : "PDF, DOC, or DOCX. Every uploaded resume is also saved in Data Sources automatically."}
        </p>
      </button>
    </>
  );
}

function StoredResumeCard({ items, selectedId, onUse, loadingId, emptyText }) {
  return (
    <section
      className="mt-5 min-h-0 shrink-0"
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "20px",
        padding: "16px",
      }}
    >
      <div className="flex items-start gap-3">
        <FolderOpen
          className="mt-1 h-4.5 w-4.5 shrink-0"
          style={{ color: colors.muted }}
        />

        <div>
          <h3
            className="font-black"
            style={{
              color: colors.dark,
              fontSize: "15.5px",
            }}
          >
            Stored Resumes
          </h3>

          <p
            className="mt-1 font-medium"
            style={{
              color: colors.muted,
              fontSize: "12.5px",
              lineHeight: "1.45",
            }}
          >
            Use a resume already saved in Data Sources.
          </p>
        </div>
      </div>

      <div
        className="mt-4 space-y-2 overflow-y-auto pr-1"
        style={{
          maxHeight: "132px",
        }}
      >
        {items.length > 0 ? (
          items.map((item) => {
            const isSelected = selectedId === item.id;
            const isLoading = loadingId === item.id;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
                style={{
                  border: `1px solid ${isSelected ? "#9EC1D8" : colors.border}`,
                  borderRadius: "14px",
                  backgroundColor: isSelected
                    ? "#F0F7FC"
                    : "rgba(255,255,255,0.78)",
                  padding: "10px 12px",
                  boxShadow: isSelected
                    ? "0 8px 18px rgba(16,36,90,0.06)"
                    : "none",
                }}
              >
                <div className="min-w-0">
                  <p
                    className="truncate font-black"
                    style={{
                      color: colors.dark,
                      fontSize: "14px",
                    }}
                  >
                    {item.title}
                  </p>

                  <div
                    className="mt-1 flex items-center gap-1.5 font-medium"
                    style={{
                      color: colors.muted,
                      fontSize: "11.5px",
                    }}
                  >
                    <Clock3 className="h-3 w-3" />
                    <span>{item.label}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onUse(item.id)}
                  disabled={isLoading}
                  className="rounded-xl px-3.5 py-2 text-xs font-black"
                >
                  {isLoading ? "Opening..." : isSelected ? "Selected" : "Use"}
                </Button>
              </div>
            );
          })
        ) : (
          <div
            className="text-center font-medium"
            style={{
              border: "2px dashed #CFE0EC",
              borderRadius: "16px",
              backgroundColor: "rgba(255,255,255,0.72)",
              color: colors.muted,
              padding: "20px 16px",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            {emptyText}
          </div>
        )}
      </div>
    </section>
  );
}

function ATSResumeUploadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isResumeJd = location.pathname.includes("resume-jd");
  const setCurrentResume = useResumeStore((state) => state.setCurrentResume);

  const {
    upload,
    isUploading,
    serverMessage,
    selectFile,
    submitUpload,
    resetUpload,
  } = useResumeUpload();

  const [storedResumes, setStoredResumes] = useState([]);
  const [selectedStoredResumeId, setSelectedStoredResumeId] = useState("");
  const [pageStatus, setPageStatus] = useState("loading");
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");
  const [storedResumeLoadingId, setStoredResumeLoadingId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadResumes() {
      setPageStatus("loading");
      setPageError("");

      try {
        const response = await getResumes();

        if (!active) {
          return;
        }

        setStoredResumes(response.data || []);
        setPageStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

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
        updatedAt: resume.updated_at,
        label: `Saved ${new Date(resume.updated_at).toLocaleDateString()}`,
      })),
    [storedResumes]
  );

  const handleResumeFileSelected = (file) => {
    if (!file) {
      return;
    }

    const isValid = selectFile(file);

    if (!isValid) {
      return;
    }

    setActionError("");
    setSelectedStoredResumeId("");
  };

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

  const handlePrimaryAction = async () => {
    setActionError("");
    setActionLoading(true);

    let resumeData = null;

    if (upload.file) {
      resumeData = await submitUpload();
    } else if (selectedStoredResumeId) {
      try {
        const response = await getResume(selectedStoredResumeId);
        resumeData = response.data;
        setCurrentResume(response.data);
      } catch (error) {
        setActionError(
          error?.response?.data?.detail ||
            "Unable to load the selected stored resume."
        );
      }
    } else {
      setActionError("Upload a resume or choose a stored one before continuing.");
    }

    if (!resumeData?.resume_id) {
      setActionLoading(false);
      return;
    }

    if (isResumeJd) {
      navigate(`/check-ats/resume-jd/job-details?resumeId=${resumeData.resume_id}`);
      setActionLoading(false);
      return;
    }

    try {
      const response = await generateAnalysisReport({
        resume_id: resumeData.resume_id,
      });

      navigate(`/reports/analysis/${resumeData.resume_id}`);
    } catch (error) {
      setActionError(
        error?.response?.data?.detail ||
          "ATS analysis failed. Please try again in a moment."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main
      className="relative isolate w-full overflow-y-auto"
      style={{
        minHeight: "calc(100vh - 72px)",
        backgroundColor: colors.cream,
      }}
    >
      <AnimatedHeroBackground />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(231,240,248,0.22) 0%, rgba(246,241,234,0.58) 48%, rgba(246,241,234,0.94) 100%)",
        }}
      />

      <section
        className="relative z-10 mx-auto grid items-center gap-5 px-5 py-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-7"
        style={{ maxWidth: "1240px", minHeight: "calc(100vh - 120px)" }}
      >
        <InfoPanel isResumeJd={isResumeJd} />

        <div
          className="flex h-full min-h-0 flex-col bg-white"
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: "24px",
            boxShadow: "0 16px 36px rgba(16,36,90,0.075)",
            padding: "28px",
          }}
        >
          <div className="shrink-0">
            <h2
              className="font-black tracking-tight"
              style={{
                color: colors.dark,
                fontSize: "26px",
              }}
            >
              Resume PDF
            </h2>

            <p
              className="mt-1.5 font-medium"
              style={{
                color: colors.muted,
                fontSize: "14px",
                lineHeight: "1.55",
              }}
            >
              Choose a resume from your device or reuse one from stored data
              sources.
            </p>
          </div>

          <UploadDropZone
            onChooseFile={handleResumeFileSelected}
            accept=".pdf,.doc,.docx"
            disabled={isUploading || actionLoading}
            fileName={upload.file?.name}
          />

          <StoredResumeCard
            items={storedItems}
            selectedId={selectedStoredResumeId}
            onUse={handleUseStoredResume}
            loadingId={storedResumeLoadingId}
            emptyText="No stored resumes yet. Upload one from your laptop or phone to save it here."
          />

          <div className="mt-3 min-h-[34px] shrink-0 space-y-1">
            {pageStatus === "loading" ? (
              <Loader label="Loading stored resumes..." />
            ) : null}

            {pageError ? <Toast message={pageError} variant="error" /> : null}
            {upload.error ? <Toast message={upload.error} variant="error" /> : null}
            {serverMessage ? (
              <Toast message={serverMessage} variant="success" />
            ) : null}
            {actionError ? <Toast message={actionError} variant="error" /> : null}
          </div>

          <div className="mt-auto flex shrink-0 justify-end pt-3">
            <Button
              onClick={handlePrimaryAction}
              disabled={
                isUploading ||
                actionLoading ||
                storedResumeLoadingId !== "" ||
                (!upload.file && !selectedStoredResumeId)
              }
              className="min-w-[200px] rounded-2xl px-5 py-2.5 text-sm font-black shadow-[0_14px_24px_rgba(56,129,201,0.18)]"
            >
              {actionLoading || isUploading
                ? isResumeJd
                  ? "Preparing resume..."
                  : "Generating report..."
                : isResumeJd
                  ? "Continue to job details"
                  : "Run ATS check"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ATSResumeUploadPage;