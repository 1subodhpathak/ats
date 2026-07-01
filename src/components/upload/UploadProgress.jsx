import ProgressBar from "../common/ProgressBar";

function UploadProgress({ value = 0, status = "idle" }) {
  if (status === "idle") {
    return null;
  }

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">
          {status === "success" ? "Upload complete" : "Uploading resume"}
        </span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}

export default UploadProgress;
