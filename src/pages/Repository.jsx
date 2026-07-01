import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileSearch, FolderOpen } from "lucide-react";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import { getSavedReports, getSavedReportPdfUrl } from "../services/reportApi";
import { getResumes } from "../services/resumeApi";

function Repository() {
  const [resumes, setResumes] = useState([]);
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRepository() {
      setStatus("loading");
      setError("");
      try {
        const [resumeResponse, reportResponse] = await Promise.all([
          getResumes(),
          getSavedReports(),
        ]);

        if (!active) {
          return;
        }

        setResumes(resumeResponse.data || []);
        setReports(reportResponse.data || []);
        setStatus("success");
      } catch (requestError) {
        if (!active) {
          return;
        }
        setError(
          requestError?.response?.data?.detail ||
            "Unable to load the repository right now."
        );
        setStatus("error");
      }
    }

    loadRepository();
    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Loader label="Loading repository..." />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Toast message={error} variant="error" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6">
      <Card className="rounded-3xl border border-shellstone/60 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-royalblue">
              ATS Repository
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Review uploaded resumes, identify which ATS checks included job
              descriptions, and open or download saved reports for future reference.
            </p>
          </div>
          <Link to="/check-ats">
            <Button>
              <FileSearch className="mr-2 h-4 w-4" />
              Run New ATS Check
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border border-shellstone/60 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Resumes Uploaded
          </p>
          <p className="mt-3 text-4xl font-black text-royalblue">{resumes.length}</p>
        </Card>
        <Card className="rounded-3xl border border-shellstone/60 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Saved Reports
          </p>
          <p className="mt-3 text-4xl font-black text-royalblue">{reports.length}</p>
        </Card>
        <Card className="rounded-3xl border border-shellstone/60 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Reports With JD
          </p>
          <p className="mt-3 text-4xl font-black text-royalblue">
            {reports.filter((report) => report.has_job_description).length}
          </p>
        </Card>
      </div>

      <Card className="rounded-3xl border border-shellstone/60 bg-white p-6">
        <h2 className="text-2xl font-black text-royalblue">Uploaded Resumes</h2>
        <div className="mt-5 grid gap-4">
          {resumes.length ? (
            resumes.map((resume) => (
              <div
                key={resume.resume_id}
                className="rounded-2xl border border-shellstone/60 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-royalblue">
                      {resume.file_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Last updated {new Date(resume.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p>Current score: {resume.current_score}</p>
                    <p>Saved reports: {resume.reports_count}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No resumes uploaded yet.</p>
          )}
        </div>
      </Card>

      <Card className="rounded-3xl border border-shellstone/60 bg-white p-6">
        <h2 className="text-2xl font-black text-royalblue">Saved Reports</h2>
        <div className="mt-5 grid gap-4">
          {reports.length ? (
            reports.map((report) => (
              <div
                key={report.report_id}
                className="rounded-2xl border border-shellstone/60 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-black text-royalblue">
                      {report.candidate_name || report.resume_file_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Resume file: {report.resume_file_name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
                      {report.report_type === "resume_jd"
                        ? "Resume + JD"
                        : "Resume only"}{" "}
                      · Score {report.overall_score}
                    </p>
                    <p className="text-xs text-slate-500">
                      Saved {new Date(report.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      JD uploaded: {report.has_job_description ? "Yes" : "No"}
                    </p>
                    {report.job_description_excerpt ? (
                      <p className="max-w-3xl text-xs leading-5 text-slate-500">
                        {report.job_description_excerpt}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/repository/report/${report.report_id}`}>
                      <Button variant="outline">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        View Report
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          getSavedReportPdfUrl(report.report_id),
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">
              No reports have been saved yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Repository;
