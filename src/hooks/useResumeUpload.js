import { useMemo, useState } from "react";

import { uploadResume } from "../services/resumeApi";
import useResumeStore from "../store/useResumeStore";
import { validateResumeFile } from "../utils/fileValidation";

function useResumeUpload() {
  const {
    upload,
    setSelectedFile,
    setUploadProgress,
    startUpload,
    uploadSuccess,
    uploadError,
    resetUpload,
  } = useResumeStore();
  const [serverMessage, setServerMessage] = useState("");

  const isUploading = upload.status === "uploading";

  const selectFile = (file) => {
    const error = validateResumeFile(file);
    if (error) {
      uploadError(error);
      return false;
    }

    setSelectedFile(file);
    setServerMessage("");
    return true;
  };

  const submitUpload = async () => {
    if (!upload.file) {
      uploadError("Choose a resume file before uploading.");
      return null;
    }

    startUpload();

    const formData = new FormData();
    formData.append("file", upload.file);

    try {
      const response = await uploadResume(formData, {
        onUploadProgress: (event) => {
          if (!event.total) {
            return;
          }

          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        },
      });

      uploadSuccess(response.data);
      setServerMessage(response.data.message || "Resume uploaded successfully.");
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "Upload failed. Please try again with another file.";
      uploadError(message);
      return null;
    }
  };

  return useMemo(
    () => ({
      upload,
      isUploading,
      serverMessage,
      selectFile,
      submitUpload,
      resetUpload,
    }),
    [isUploading, resetUpload, serverMessage, upload]
  );
}

export default useResumeUpload;
