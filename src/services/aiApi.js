import { analyzeResumeLine, rewriteResumeLine } from "./groqAIService";

export const analyzeLine = async (payload) => {
  const result = await analyzeResumeLine(payload.line_text, payload.target_role);
  return { data: result };
};

export const rewriteLine = async (payload) => {
  const result = await rewriteResumeLine(payload.line_text, payload.target_role);
  return { data: result };
};

