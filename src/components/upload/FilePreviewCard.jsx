import { FileText } from "lucide-react";

import Card from "../common/Card";

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) {
    return "--";
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FilePreviewCard({ file }) {
  if (!file) {
    return null;
  }

  return (
    <Card className="border-slate-200 bg-slate-50/70 p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
          <p className="mt-1 text-sm text-slate-500">{formatFileSize(file.size)}</p>
        </div>
      </div>
    </Card>
  );
}

export default FilePreviewCard;
