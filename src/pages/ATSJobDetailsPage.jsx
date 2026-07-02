import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import {
  getJobDescription,
  getJobDescriptions,
  uploadJobDescriptionFile,
} from "../services/jobDescriptionApi";
import { generateAnalysisReport } from "../services/reportApi";
import { getResume } from "../services/resumeApi";
import useResumeStore from "../store/useResumeStore";
import { validateJobDescriptionFile } from "../utils/fileValidation";

const colors = {
  cream: "#F6F1EA",
  border: "#CFE0EC",
  navy: "#10245A",
  dark: "#2F4054",
  muted: "#5C8194",
  softBlue: "#E7F0F8",
};

const jdBullets = [
  {
    title: "Role alignment",
    text: "Compare your resume with the target role requirements and surface gaps before you apply.",
  },
  {
    title: "Keyword guidance",
    text: "Identify missing language, repeated keywords, and recruiter-facing fit issues.",
  },
  {
    title: "Stored reuse",
    text: "Uploaded job descriptions stay available so you can rerun ATS checks faster.",
  },
];

function InfoPanel() {
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
        <Target className="h-6 w-6" />
      </div>

      <p
        className="mt-7 text-[11px] font-black uppercase tracking-[0.22em]"
        style={{ color: colors.muted }}
      >
        Targeted ATS Match
      </p>

      <h1
        className="mt-3 font-black leading-tight tracking-tight"
        style={{
          color: colors.dark,
          fontSize: "30px",
        }}
      >
        Add job details
      </h1>

      <p
        className="mt-4 max-w-md font-medium"
        style={{
          color: colors.muted,
          fontSize: "14.5px",
          lineHeight: "1.7",
        }}
      >
        Upload or reuse a stored job description, then paste any missing role
        details before generating the ATS comparison report.
      </p>

      <div className="mt-7 space-y-5">
        {jdBullets.map((item) => (
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
            Job description text is only used to compare this resume against the
            target role and generate your ATS + JD report.
          </p>
        </div>
      </div>
    </aside>
  );
}

function UploadJobFileRow({
  fileName,
  onChooseFile,
  disabled,
}) {
  const inputRef = useRef(null);

  return (
    <div
      className="shrink-0"
      style={{
        border: "2px dashed #CFE0EC",
        borderRadius: "20px",
        backgroundColor: "rgba(246,241,234,0.42)",
        padding: "15px",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md"
        className="hidden"
        onChange={(event) => onChooseFile(event.target.files?.[0] || null)}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex shrink-0 items-center justify-center bg-white"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "15px",
              boxShadow: "0 10px 22px rgba(16,36,90,0.06)",
              color: colors.dark,
            }}
          >
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3
              className="font-black"
              style={{
                color: colors.dark,
                fontSize: "16px",
              }}
            >
              Upload a job description file
            </h3>

            <p
              className="mt-1 font-medium"
              style={{
                color: colors.muted,
                fontSize: "12.5px",
                lineHeight: "1.5",
              }}
            >
              Supports PDF, DOC, DOCX, TXT, and Markdown.
            </p>

            {fileName ? (
              <p
                className="mt-1 truncate text-xs font-black"
                style={{ color: colors.navy }}
              >
                Selected: {fileName}
              </p>
            ) : null}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="shrink-0 rounded-2xl border-[#D7E2EA] px-4 py-2 text-xs font-black"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload file
        </Button>
      </div>
    </div>
  );
}

function StoredJobDescriptionsCard({
  items,
  selectedId,
  onUse,
  loadingId,
  emptyText,
}) {
  return (
    <section
      className="flex min-h-0 flex-col"
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "20px",
        padding: "16px",
      }}
    >
      <div className="flex shrink-0 items-start gap-3">
        <FolderOpen
          className="mt-1 h-4 w-4 shrink-0"
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
            Stored Job Descriptions
          </h3>

          <p
            className="mt-1 font-medium"
            style={{
              color: colors.muted,
              fontSize: "12.5px",
              lineHeight: "1.45",
            }}
          >
            Choose a saved JD instead of uploading again.
          </p>
        </div>
      </div>

      <div
        className="mt-4 min-h-0 space-y-2 overflow-y-auto pr-1"
        style={{ maxHeight: "190px" }}
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

function ExtractedJobDescriptionCard({ value, onChange }) {
  return (
    <section
      className="flex min-h-0 flex-1 flex-col"
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: "20px",
        padding: "16px",
      }}
    >
      <div className="shrink-0">
        <h3
          className="font-black"
          style={{
            color: colors.dark,
            fontSize: "15.5px",
          }}
        >
          JD Extracted
        </h3>

        <p
          className="mt-1 font-medium"
          style={{
            color: colors.muted,
            fontSize: "12.5px",
            lineHeight: "1.45",
          }}
        >
          Review or edit the extracted job description before running the ATS
          comparison.
        </p>
      </div>

      <textarea
        value={value}
        onChange={onChange}
        placeholder="Paste responsibilities, requirements, company details, and role title here..."
        className="mt-4 min-h-0 flex-1 resize-none overflow-y-auto rounded-2xl border bg-white px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-[#AFC8DB]"
        style={{
          borderColor: colors.border,
          boxShadow: "0 10px 28px rgba(16,36,90,0.04)",
        }}
      />
    </section>
  );
}

function ATSJobDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resumeIdFromQuery = searchParams.get("resumeId");
  const currentResume = useResumeStore((state) => state.currentResume);
  const setCurrentResume = useResumeStore((state) => state.setCurrentResume);

  const [jobDescription, setJobDescription] = useState("");
  const [jobDescriptionFileName, setJobDescriptionFileName] = useState("");
  const [selectedStoredJobDescriptionId, setSelectedStoredJobDescriptionId] =
    useState("");
  const [storedJobDescriptions, setStoredJobDescriptions] = useState([]);
  const [pageStatus, setPageStatus] = useState("loading");
  const [pageError, setPageError] = useState("");
  const [jobDescriptionStatus, setJobDescriptionStatus] = useState({
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
  const [storedJobLoadingId, setStoredJobLoadingId] = useState("");

  const activeResumeId = currentResume?.resume_id || resumeIdFromQuery || "";

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      setPageStatus("loading");
      setPageError("");

      try {
        const requests = [getJobDescriptions()];

        if (
          resumeIdFromQuery &&
          (!currentResume || currentResume.resume_id !== resumeIdFromQuery)
        ) {
          setResumeStatus({ isLoading: true, error: "" });
          requests.push(getResume(resumeIdFromQuery));
        }

        const [jobDescriptionsResponse, resumeResponse] =
          await Promise.all(requests);

        if (!active) {
          return;
        }

        setStoredJobDescriptions(jobDescriptionsResponse.data || []);

        if (resumeResponse?.data) {
          setCurrentResume(resumeResponse.data);
        }

        setResumeStatus({ isLoading: false, error: "" });
        setPageStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

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

  useEffect(() => {
    if (!resumeIdFromQuery && !currentResume?.resume_id) {
      navigate("/check-ats/resume-jd", { replace: true });
    }
  }, [currentResume?.resume_id, navigate, resumeIdFromQuery]);

  const storedItems = useMemo(
    () =>
      storedJobDescriptions.map((item) => ({
        id: item.job_description_id,
        title: item.title || item.file_name || "Stored job description",
        createdAt: item.created_at,
        label: `Saved ${new Date(item.created_at).toLocaleDateString()}`,
      })),
    [storedJobDescriptions]
  );

  const refreshStoredJobDescriptions = async () => {
    try {
      const response = await getJobDescriptions();
      setStoredJobDescriptions(response.data || []);
    } catch {
      // Keep current list if refresh fails.
    }
  };

  const handleJobDescriptionFileSelected = async (file) => {
    if (!file) {
      return;
    }

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
      setSelectedStoredJobDescriptionId(
        response.data.job_description_id || ""
      );

      setJobDescriptionStatus({
        isUploading: false,
        error: "",
        success:
          response.data.message || "Job description uploaded successfully.",
      });

      refreshStoredJobDescriptions();
    } catch (error) {
      setJobDescriptionStatus({
        isUploading: false,
        error:
          error?.response?.data?.detail ||
          "Job description upload failed. Please try another file.",
        success: "",
      });
    }
  };

  const handleUseStoredJobDescription = async (jobDescriptionId) => {
    setStoredJobLoadingId(jobDescriptionId);

    setJobDescriptionStatus({
      isUploading: false,
      error: "",
      success: "",
    });

    try {
      const response = await getJobDescription(jobDescriptionId);

      setJobDescription(response.data.raw_text || "");
      setJobDescriptionFileName(
        response.data.title || "Stored job description"
      );
      setSelectedStoredJobDescriptionId(jobDescriptionId);
    } catch (error) {
      setJobDescriptionStatus({
        isUploading: false,
        error:
          error?.response?.data?.detail ||
          "Unable to load the selected stored job description.",
        success: "",
      });
    } finally {
      setStoredJobLoadingId("");
    }
  };

  const handleGenerateReport = async () => {
    if (!activeResumeId) {
      setAnalysisState({
        status: "error",
        error: "Select a resume before running the ATS comparison.",
      });
      return;
    }

    if (!jobDescription.trim()) {
      setAnalysisState({
        status: "error",
        error: "Add a job description before running the ATS comparison.",
      });
      return;
    }

    setAnalysisState({ status: "loading", error: "" });

    try {
      const response = await generateAnalysisReport({
        resume_id: activeResumeId,
        jd_text: jobDescription,
      });

      navigate(`/reports/analysis/${activeResumeId}`);
    } catch (error) {
      setAnalysisState({
        status: "error",
        error:
          error?.response?.data?.detail ||
          "ATS analysis failed. Please try again in a moment.",
      });
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
        className="relative z-10 mx-auto grid items-center gap-5 px-5 py-8 lg:grid-cols-2 lg:px-7"
        style={{ maxWidth: "1240px", minHeight: "calc(100vh - 120px)" }}
      >
        <InfoPanel />

        <div
          className="flex h-full min-h-0 flex-col bg-white"
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: "24px",
            boxShadow: "0 16px 36px rgba(16,36,90,0.075)",
            padding: "28px",
          }}
        >
          <div className="flex shrink-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <h2
                className="font-black tracking-tight"
                style={{
                  color: colors.dark,
                  fontSize: "26px",
                }}
              >
                Job Details
              </h2>

              <p
                className="mt-1.5 font-medium"
                style={{
                  color: colors.muted,
                  fontSize: "14px",
                  lineHeight: "1.55",
                }}
              >
                Upload the target job description or paste the full posting
                below.
              </p>
            </div>

            {currentResume?.file_name ? (
              <div
                className="hidden max-w-[230px] shrink-0 rounded-2xl border px-4 py-3 text-right md:block"
                style={{
                  borderColor: colors.border,
                  backgroundColor: "rgba(231,240,248,0.42)",
                }}
              >
                <p
                  className="text-[10px] font-black uppercase tracking-[0.16em]"
                  style={{ color: colors.muted }}
                >
                  Selected Resume
                </p>
                <p
                  className="mt-1 truncate text-sm font-black"
                  style={{ color: colors.dark }}
                >
                  {currentResume.file_name}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-5 shrink-0">
            <UploadJobFileRow
              fileName={jobDescriptionFileName}
              onChooseFile={handleJobDescriptionFileSelected}
              disabled={
                jobDescriptionStatus.isUploading ||
                analysisState.status === "loading"
              }
            />
          </div>

          <div className="mt-5 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
            <StoredJobDescriptionsCard
              items={storedItems}
              selectedId={selectedStoredJobDescriptionId}
              onUse={handleUseStoredJobDescription}
              loadingId={storedJobLoadingId}
              emptyText="No stored job descriptions yet. Upload one once and it will appear here automatically."
            />

            <ExtractedJobDescriptionCard
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
          </div>

          <div className="mt-3 min-h-[34px] shrink-0 space-y-1">
            {pageStatus === "loading" ? (
              <Loader label="Loading stored job descriptions..." />
            ) : null}

            {resumeStatus.isLoading ? (
              <Loader label="Loading selected resume..." />
            ) : null}

            {storedJobLoadingId ? (
              <Loader label="Opening stored job description..." />
            ) : null}

            {jobDescriptionStatus.isUploading ? (
              <Loader label="Extracting text from the uploaded job description..." />
            ) : null}

            {pageError ? <Toast message={pageError} variant="error" /> : null}

            {resumeStatus.error ? (
              <Toast message={resumeStatus.error} variant="error" />
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
          </div>

          <div className="mt-auto flex shrink-0 justify-end pt-3">
            <Button
              onClick={handleGenerateReport}
              disabled={
                analysisState.status === "loading" ||
                jobDescriptionStatus.isUploading ||
                !activeResumeId ||
                !jobDescription.trim()
              }
              className="min-w-[210px] rounded-2xl px-5 py-2.5 text-sm font-black shadow-[0_14px_24px_rgba(56,129,201,0.18)]"
            >
              {analysisState.status === "loading"
                ? "Generating report..."
                : "Run ATS + JD check"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ATSJobDetailsPage;
