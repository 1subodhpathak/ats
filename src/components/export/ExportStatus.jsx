import Toast from "../common/Toast";

function ExportStatus({ status, error, format }) {
  if (status === "idle") {
    return null;
  }

  if (status === "error") {
    return <Toast message={error} variant="error" />;
  }

  if (status === "success") {
    return (
      <Toast
        message={`${format.toUpperCase()} export is ready and should start downloading automatically.`}
        variant="success"
      />
    );
  }

  return <Toast message={`Preparing ${format.toUpperCase()} export...`} variant="info" />;
}

export default ExportStatus;
