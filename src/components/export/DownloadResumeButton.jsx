import Button from "../common/Button";

function DownloadResumeButton({ onClick, disabled = false, loading = false, format = "docx" }) {
  return (
    <Button onClick={onClick} disabled={disabled || loading}>
      {loading ? "Preparing export..." : `Download ${format.toUpperCase()}`}
    </Button>
  );
}

export default DownloadResumeButton;
