import { create } from "zustand";

const useEditorStore = create((set) => ({
  initializedResumeId: null,
  lineStates: {},
  suggestions: {},
  exportStatus: {
    status: "idle",
    error: null,
    format: "docx",
  },
  initializeFromResume: (resume) =>
    set((state) => {
      if (!resume?.resume_id || state.initializedResumeId === resume.resume_id) {
        return state;
      }

      const lineStates = {};
      resume.sections.forEach((section) => {
        section.items.forEach((item) => {
          lineStates[item.line_id] = {
            status: "idle",
            error: null,
            lastSavedText: item.text,
          };
        });
      });

      return {
        initializedResumeId: resume.resume_id,
        lineStates,
        suggestions: {},
      };
    }),
  setLineSaving: (lineId) =>
    set((state) => ({
      lineStates: {
        ...state.lineStates,
        [lineId]: {
          ...(state.lineStates[lineId] || {}),
          status: "saving",
          error: null,
        },
      },
    })),
  setLineSaved: (lineId, text) =>
    set((state) => ({
      lineStates: {
        ...state.lineStates,
        [lineId]: {
          ...(state.lineStates[lineId] || {}),
          status: "saved",
          error: null,
          lastSavedText: text,
        },
      },
    })),
  setLineDirty: (lineId) =>
    set((state) => ({
      lineStates: {
        ...state.lineStates,
        [lineId]: {
          ...(state.lineStates[lineId] || {}),
          status: "dirty",
          error: null,
        },
      },
    })),
  setLineError: (lineId, error) =>
    set((state) => ({
      lineStates: {
        ...state.lineStates,
        [lineId]: {
          ...(state.lineStates[lineId] || {}),
          status: "error",
          error,
        },
      },
    })),
  setSuggestionLoading: (lineId, mode) =>
    set((state) => ({
      suggestions: {
        ...state.suggestions,
        [lineId]: {
          ...(state.suggestions[lineId] || {}),
          loadingMode: mode,
          error: null,
        },
      },
    })),
  setSuggestionData: (lineId, data) =>
    set((state) => ({
      suggestions: {
        ...state.suggestions,
        [lineId]: {
          ...(state.suggestions[lineId] || {}),
          loadingMode: null,
          error: null,
          data,
          open: true,
        },
      },
    })),
  setSuggestionError: (lineId, error) =>
    set((state) => ({
      suggestions: {
        ...state.suggestions,
        [lineId]: {
          ...(state.suggestions[lineId] || {}),
          loadingMode: null,
          error,
          open: true,
        },
      },
    })),
  toggleSuggestionOpen: (lineId, open) =>
    set((state) => ({
      suggestions: {
        ...state.suggestions,
        [lineId]: {
          ...(state.suggestions[lineId] || {}),
          open,
        },
      },
    })),
  setExportLoading: (format) =>
    set((state) => ({
      exportStatus: {
        ...state.exportStatus,
        status: "loading",
        error: null,
        format,
      },
    })),
  setExportSuccess: (format) =>
    set((state) => ({
      exportStatus: {
        ...state.exportStatus,
        status: "success",
        error: null,
        format,
      },
    })),
  setExportError: (error) =>
    set((state) => ({
      exportStatus: {
        ...state.exportStatus,
        status: "error",
        error,
        format: state.exportStatus.format,
      },
    })),
  setExportFormat: (format) =>
    set((state) => ({
      exportStatus: {
        ...state.exportStatus,
        format,
      },
    })),
  resetEditor: () =>
    set({
      initializedResumeId: null,
      lineStates: {},
      suggestions: {},
      exportStatus: {
        status: "idle",
        error: null,
        format: "docx",
      },
    }),
}));

export default useEditorStore;
