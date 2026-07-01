import { create } from "zustand";

const useATSStore = create((set) => ({
  result: null,
  jobDescriptionResult: null,
  jobDescriptionInput: "",
  status: "idle",
  jobDescriptionStatus: "idle",
  error: null,
  jobDescriptionError: null,
  setLoading: () =>
    set({
      status: "loading",
      error: null,
    }),
  setResult: (result) =>
    set({
      result,
      status: "success",
      error: null,
    }),
  updateOverallScore: (overallScore) =>
    set((state) => ({
      result: state.result
        ? {
            ...state.result,
            overall_score: overallScore,
          }
        : state.result,
    })),
  setJobDescriptionInput: (jobDescriptionInput) =>
    set({
      jobDescriptionInput,
    }),
  setJobDescriptionLoading: () =>
    set({
      jobDescriptionStatus: "loading",
      jobDescriptionError: null,
    }),
  setJobDescriptionResult: (jobDescriptionResult) =>
    set({
      jobDescriptionResult,
      jobDescriptionStatus: "success",
      jobDescriptionError: null,
    }),
  setJobDescriptionError: (jobDescriptionError) =>
    set({
      jobDescriptionStatus: "error",
      jobDescriptionError,
    }),
  setError: (message) =>
    set({
      status: "error",
      error: message,
    }),
  reset: () =>
    set({
      result: null,
      jobDescriptionResult: null,
      jobDescriptionInput: "",
      status: "idle",
      jobDescriptionStatus: "idle",
      error: null,
      jobDescriptionError: null,
    }),
}));

export default useATSStore;
