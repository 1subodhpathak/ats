import { useEffect } from "react";

import ATSScoreCard from "../components/ats-score/ATSScoreCard";
import ResumeReadabilityScore from "../components/ats-score/ResumeReadabilityScore";
import ScoreBreakdown from "../components/ats-score/ScoreBreakdown";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import JDKeywordExtractor from "../components/job-description/JDKeywordExtractor";
import JDMatchScore from "../components/job-description/JDMatchScore";
import JobDescriptionInput from "../components/job-description/JobDescriptionInput";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import useATSScore from "../hooks/useATSScore";
import useJobDescriptionAnalysis from "../hooks/useJobDescriptionAnalysis";

function ResumeAnalysis() {
  const { resume, result, status, error, fetchScore } = useATSScore();
  const {
    jobDescriptionInput,
    jobDescriptionResult,
    jobDescriptionStatus,
    jobDescriptionError,
    setJobDescriptionInput,
    submitJobDescription,
  } = useJobDescriptionAnalysis();

  useEffect(() => {
    if (resume?.resume_id && !result && status === "idle") {
      fetchScore();
    }
  }, [fetchScore, resume?.resume_id, result, status]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Resume Analysis</h2>
            <p className="mt-2 text-sm text-slate-600">
              Score the parsed resume now, then we’ll layer in JD matching and AI rewrite
              guidance on top of this foundation.
            </p>
          </div>
          <Button onClick={fetchScore} disabled={!resume?.resume_id || status === "loading"}>
            {status === "loading" ? "Scoring..." : "Refresh score"}
          </Button>
        </div>
      </Card>

      {!resume ? (
        <Toast message="Upload a resume first to generate ATS scoring." variant="info" />
      ) : null}

      {status === "loading" ? <Loader label="Analyzing resume for ATS quality..." /> : null}
      {error ? <Toast message={error} variant="error" /> : null}

      {result ? (
        <>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <ATSScoreCard score={result.overall_score} summary={result.summary} />
            <ResumeReadabilityScore score={result.breakdown?.ats_readability || 0} />
          </div>
          <ScoreBreakdown breakdown={result.breakdown} />
          <JobDescriptionInput
            value={jobDescriptionInput}
            onChange={setJobDescriptionInput}
            onSubmit={submitJobDescription}
            loading={jobDescriptionStatus === "loading"}
          />
          {jobDescriptionError ? (
            <Toast message={jobDescriptionError} variant="error" />
          ) : null}
          {jobDescriptionStatus === "loading" ? (
            <Loader label="Comparing resume against job description..." />
          ) : null}
          {jobDescriptionResult ? (
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <JDMatchScore score={jobDescriptionResult.jd_match_score} />
              <JDKeywordExtractor result={jobDescriptionResult} />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default ResumeAnalysis;
