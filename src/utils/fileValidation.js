import {
  ALLOWED_JD_EXTENSIONS,
  ALLOWED_JD_MIME_TYPES,
  ALLOWED_RESUME_EXTENSIONS,
  ALLOWED_RESUME_MIME_TYPES,
  MAX_JD_FILE_SIZE_MB,
  MAX_RESUME_FILE_SIZE_MB,
} from "./constants";

export function validateResumeFile(file) {
  if (!file) {
    return "Please choose a resume file to upload.";
  }

  const fileName = file.name.toLowerCase();
  const hasSupportedExtension = ALLOWED_RESUME_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension)
  );

  if (!hasSupportedExtension) {
    return "Unsupported file type. Upload a PDF, DOC, or DOCX file.";
  }

  if (file.type && !ALLOWED_RESUME_MIME_TYPES.includes(file.type)) {
    return "The selected file does not look like a valid PDF or Word document.";
  }

  const maxBytes = MAX_RESUME_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File is too large. Maximum allowed size is ${MAX_RESUME_FILE_SIZE_MB} MB.`;
  }

  return null;
}

export function validateJobDescriptionFile(file) {
  if (!file) {
    return "Please choose a job description file to upload.";
  }

  const fileName = file.name.toLowerCase();
  const hasSupportedExtension = ALLOWED_JD_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension)
  );

  if (!hasSupportedExtension) {
    return "Unsupported file type. Upload a PDF, DOC, DOCX, TXT, or MD file.";
  }

  if (file.type && !ALLOWED_JD_MIME_TYPES.includes(file.type)) {
    return "The selected file does not look like a valid job description document.";
  }

  const maxBytes = MAX_JD_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File is too large. Maximum allowed size is ${MAX_JD_FILE_SIZE_MB} MB.`;
  }

  return null;
}
