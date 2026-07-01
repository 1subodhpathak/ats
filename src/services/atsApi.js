import { evaluateAtsScore, parseJdText } from "./groqAIService";

export const getATSScore = async (payload) => {
  const result = await evaluateAtsScore(payload.resume_text, payload.target_role);
  return { data: result };
};

export const analyzeJobDescription = async (payload) => {
  const result = await parseJdText(payload.jd_text);
  return { data: result };
};

