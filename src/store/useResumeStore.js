import { create } from "zustand";

const initialUploadState = {
  status: "idle",
  progress: 0,
  error: null,
  file: null,
};

const useResumeStore = create((set) => ({
  currentResume: null,
  resumes: [],
  layout: null,
  previewVersion: 0,
  versions: [],
  versionStatus: "idle",
  versionError: null,
  upload: initialUploadState,
  setResumes: (resumes) => set({ resumes }),
  setLayout: (layout) => set({ layout }),
  updateLayoutBlockLocally: (blockId, text) =>
    set((state) => {
      if (!state.layout) return {};
      const pages = state.layout.pages.map((page) => ({
        ...page,
        text_blocks: page.text_blocks.map((block) =>
          block.block_id === blockId ? { ...block, text } : block
        ),
      }));
      return { layout: { ...state.layout, pages } };
    }),
  setSelectedFile: (file) =>
    set((state) => ({
      upload: {
        ...state.upload,
        file,
        error: null,
      },
    })),
  setUploadProgress: (progress) =>
    set((state) => ({
      upload: {
        ...state.upload,
        progress,
        status: progress > 0 && progress < 100 ? "uploading" : state.upload.status,
      },
    })),
  startUpload: () =>
    set((state) => ({
      upload: {
        ...state.upload,
        status: "uploading",
        progress: 0,
        error: null,
      },
    })),
  uploadSuccess: (resume) =>
    set({
      currentResume: resume,
      previewVersion: 1,
      versions: [],
      versionStatus: "idle",
      versionError: null,
      upload: {
        status: "success",
        progress: 100,
        error: null,
        file: null,
      },
    }),
  setCurrentResume: (resume) =>
    set({
      currentResume: resume,
      previewVersion: Date.now(),
      versions: [],
      versionStatus: "idle",
      versionError: null,
    }),
  setVersionsLoading: () =>
    set({
      versionStatus: "loading",
      versionError: null,
    }),
  setVersions: (versions) =>
    set({
      versions,
      versionStatus: "success",
      versionError: null,
    }),
  setVersionError: (versionError) =>
    set({
      versionStatus: "error",
      versionError,
    }),
  updateResumeLineLocally: (lineId, text) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      const sections = state.currentResume.sections.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.line_id === lineId
            ? {
                ...item,
                text,
              }
            : item
        ),
      }));

      return {
        currentResume: {
          ...state.currentResume,
          sections,
        },
      };
    }),
  applyServerLineUpdate: ({ line_id, text, score }) =>
    set((state) => {
      if (!state.currentResume) {
        return state;
      }

      const sections = state.currentResume.sections.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.line_id === line_id
            ? {
                ...item,
                text,
                score,
              }
            : item
        ),
      }));

      return {
        currentResume: {
          ...state.currentResume,
          sections,
        },
        previewVersion: Date.now(),
      };
    }),
  uploadError: (message) =>
    set((state) => ({
      upload: {
        ...state.upload,
        status: "error",
        error: message,
      },
    })),
  resetUpload: () =>
    set({
      upload: initialUploadState,
    }),
}));

export default useResumeStore;
