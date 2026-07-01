import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import Card from "../common/Card";
import Toast from "../common/Toast";
import FilePreviewCard from "./FilePreviewCard";
import DragDropUpload from "./DragDropUpload";
import UploadProgress from "./UploadProgress";
import useResumeUpload from "../../hooks/useResumeUpload";

function ResumeUploader() {
  const navigate = useNavigate();
  const { upload, isUploading, serverMessage, selectFile, submitUpload } =
    useResumeUpload();

  const handleUpload = async () => {
    const resume = await submitUpload();
    if (resume?.resume_id) {
      navigate("/editor");
    }
  };

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Upload your resume</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Start with a PDF, DOC, or DOCX. We’ll parse it into editable resume lines
          so the later ATS analysis and AI improvements have clean structure.
        </p>
      </div>

      <DragDropUpload onFileSelected={selectFile} disabled={isUploading} />
      <FilePreviewCard file={upload.file} />
      <UploadProgress value={upload.progress} status={upload.status} />

      {upload.error ? <Toast message={upload.error} variant="error" /> : null}
      {serverMessage ? <Toast message={serverMessage} variant="success" /> : null}

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleUpload} disabled={!upload.file || isUploading}>
          {isUploading ? "Uploading..." : "Upload and parse"}
        </Button>
      </div>
    </Card>
  );
}

export default ResumeUploader;
