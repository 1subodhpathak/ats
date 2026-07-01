import Card from "../components/common/Card";
import ResumeEditor from "../components/resume-editor/ResumeEditor";
import useResumeStore from "../store/useResumeStore";
import useATSScore from "../hooks/useATSScore";
import { useEffect } from "react";

function ResumeEditorPage() {
  const resume = useResumeStore((state) => state.currentResume);
  const { result, status, fetchScore } = useATSScore();

  useEffect(() => {
    if (resume?.resume_id && !result && status === "idle") {
      fetchScore();
    }
  }, [fetchScore, resume?.resume_id, result, status]);

  return (
    <div className="space-y-4">
      {!resume ? (
        <Card className="p-3">
          <p className="text-sm text-slate-600">
            No resume has been uploaded yet. Start from the upload page.
          </p>
        </Card>
      ) : null}
      {resume ? <ResumeEditor /> : null}
    </div>
  );
}

export default ResumeEditorPage;
