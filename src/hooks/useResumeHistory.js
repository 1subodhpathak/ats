import { useMemo } from "react";

import { getResumeVersions, restoreResumeVersion } from "../services/resumeApi";
import useResumeStore from "../store/useResumeStore";

function useResumeHistory() {
  const resume = useResumeStore((state) => state.currentResume);
  const versions = useResumeStore((state) => state.versions);
  const versionStatus = useResumeStore((state) => state.versionStatus);
  const versionError = useResumeStore((state) => state.versionError);
  const setVersionsLoading = useResumeStore((state) => state.setVersionsLoading);
  const setVersions = useResumeStore((state) => state.setVersions);
  const setVersionError = useResumeStore((state) => state.setVersionError);
  const setCurrentResume = useResumeStore((state) => state.setCurrentResume);

  const loadVersions = async () => {
    if (!resume?.resume_id) {
      setVersionError("Upload a resume before checking version history.");
      return null;
    }

    setVersionsLoading();
    try {
      const response = await getResumeVersions(resume.resume_id);
      setVersions(response.data.versions || []);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.detail || "Unable to load resume version history.";
      setVersionError(message);
      return null;
    }
  };

  const restoreVersion = async (versionId) => {
    if (!resume?.resume_id) {
      setVersionError("Upload a resume before restoring a version.");
      return null;
    }

    setVersionsLoading();
    try {
      const response = await restoreResumeVersion(resume.resume_id, {
        version_id: versionId,
      });
      setCurrentResume(response.data.resume);
      const versionsResponse = await getResumeVersions(resume.resume_id);
      setVersions(versionsResponse.data.versions || []);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.detail || "Unable to restore the selected version.";
      setVersionError(message);
      return null;
    }
  };

  return useMemo(
    () => ({
      resume,
      versions,
      versionStatus,
      versionError,
      loadVersions,
      restoreVersion,
    }),
    [resume, versionError, versionStatus, versions]
  );
}

export default useResumeHistory;
