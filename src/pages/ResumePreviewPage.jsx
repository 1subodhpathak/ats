import Card from "../components/common/Card";
import ResumePreview from "../components/resume-editor/ResumePreview";
import useResumeStore from "../store/useResumeStore";

function ResumePreviewPage() {
  const resume = useResumeStore((state) => state.currentResume);
  const previewVersion = useResumeStore((state) => state.previewVersion);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-semibold text-slate-900">Resume Preview</h2>
        <p className="mt-2 text-sm text-slate-600">
          Review the current resume as a source-style document preview or a regenerated live document.
        </p>
      </Card>
      {resume ? (
        <ResumePreview resume={resume} previewVersion={previewVersion} />
      ) : (
        <Card>
          <p className="text-sm text-slate-600">
            Upload a resume first to preview it here.
          </p>
        </Card>
      )}
    </div>
  );
}

export default ResumePreviewPage;
