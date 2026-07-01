export const MAX_RESUME_FILE_SIZE_MB = 10;
export const MAX_JD_FILE_SIZE_MB = 10;

export const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];
export const ALLOWED_JD_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".md"];

export const ALLOWED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ALLOWED_JD_MIME_TYPES = [
  ...ALLOWED_RESUME_MIME_TYPES,
  "text/plain",
  "text/markdown",
  "text/x-markdown",
];
