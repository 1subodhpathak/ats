import { useEffect } from "react";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import useResumeHistory from "../hooks/useResumeHistory";

function ResumeHistory() {
  const {
    resume,
    versions,
    versionStatus,
    versionError,
    loadVersions,
    restoreVersion,
  } = useResumeHistory();

  useEffect(() => {
    if (resume?.resume_id && versionStatus === "idle") {
      loadVersions();
    }
  }, [loadVersions, resume?.resume_id, versionStatus]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Resume History</h2>
            <p className="mt-2 text-sm text-slate-600">
              Review previous resume snapshots and restore an older state if a recent
              editing direction did not work out.
            </p>
          </div>
          <Button onClick={loadVersions} disabled={!resume?.resume_id || versionStatus === "loading"}>
            {versionStatus === "loading" ? "Refreshing..." : "Refresh history"}
          </Button>
        </div>
      </Card>

      {!resume ? (
        <Toast message="Upload a resume first to view version history." variant="info" />
      ) : null}

      {versionStatus === "loading" ? <Loader label="Loading version history..." /> : null}
      {versionError ? <Toast message={versionError} variant="error" /> : null}

      {versions.length ? (
        <div className="grid gap-4">
          {versions.map((version) => (
            <Card key={version.version_id} className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{version.label}</p>
                <p className="text-sm text-slate-500">
                  {new Date(version.created_at).toLocaleString()} · {version.line_count} lines
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  {version.version_id}
                </p>
              </div>
              <Button onClick={() => restoreVersion(version.version_id)}>
                Restore version
              </Button>
            </Card>
          ))}
        </div>
      ) : resume && versionStatus === "success" ? (
        <Card>
          <p className="text-sm text-slate-600">No versions available yet.</p>
        </Card>
      ) : null}
    </div>
  );
}

export default ResumeHistory;
