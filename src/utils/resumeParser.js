import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

let pdfWorkerConfigured = false;

const ensurePdfWorker = () => {
  if (!pdfWorkerConfigured) {
    const workerFilename = pdfWorkerUrl.split('/').pop();
    const resolvedWorkerUrl =
      pdfWorkerUrl.startsWith('/assets/') && workerFilename
        ? new URL(workerFilename, import.meta.url).toString()
        : pdfWorkerUrl;

    pdfjsLib.GlobalWorkerOptions.workerSrc = resolvedWorkerUrl;
    pdfWorkerConfigured = true;
  }
};

// PDF text extractor
export const extractTextFromPDF = async (file) => {
  try {
    ensurePdfWorker();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const sortedItems = textContent.items.sort((a, b) => {
        const yDiff = b.transform[5] - a.transform[5];
        if (Math.abs(yDiff) > 3) return yDiff;
        return a.transform[4] - b.transform[4];
      });

      let pageText = '';
      let lastY = null;
      for (const item of sortedItems) {
        const str = item.str;
        const y = item.transform[5];
        if (lastY !== null && Math.abs(y - lastY) > 3) {
          pageText += '\n' + str;
        } else {
          pageText += (pageText ? ' ' : '') + str;
        }
        lastY = y;
      }
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to read PDF file. Please ensure it has selectable text.');
  }
};

// DOCX text extractor
export const extractTextFromDocx = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to read Word document. Please verify the file.');
  }
};

// Heuristic Section Detector
const SECTION_PATTERNS = {
  summary: ["summary", "professional summary", "profile summary", "profile", "objective", "professional summary", "career objective"],
  experience: ["experience", "work experience", "professional experience", "employment history", "work history", "employment"],
  projects: ["projects", "project experience", "personal projects", "academic projects"],
  skills: ["skills", "technical skills", "core competencies", "technologies", "key skills", "expertise"],
  education: ["education", "academic background", "academic qualifications", "qualifications"],
  certifications: ["certifications", "licenses", "courses"],
  awards: ["awards", "achievements", "honors"],
  leadership: ["leadership", "leadership experience", "extracurricular activities", "volunteer experience"]
};

const detectSectionName = (line) => {
  const normalized = line.trim().toLowerCase().replace(":", "").replace(/\s+/g, " ");
  if (!normalized) return null;

  for (const [canonical, variants] of Object.entries(SECTION_PATTERNS)) {
    if (variants.includes(normalized)) {
      return canonical;
    }
  }

  // Capitalized section headers check
  if (normalized === normalized.toUpperCase() && normalized.split(" ").length <= 4 && normalized.length > 2) {
    return canonicalizeTitle(normalized);
  }

  return null;
};

const canonicalizeTitle = (str) => {
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
};

const scoreLine = (line) => {
  let score = 55;
  if (/\d+/.test(line)) score += 10;
  if (line.split(/\s+/).length >= 8) score += 10;
  
  const actionVerbs = ["built", "led", "improved", "developed", "designed", "created", "managed", "implemented", "optimized"];
  if (actionVerbs.some(verb => line.toLowerCase().includes(verb))) {
    score += 10;
  }
  return Math.min(score, 95);
};

const isNoiseLine = (line) => {
  const stripped = line.trim();
  const lowered = stripped.toLowerCase();
  const wordCount = stripped.split(/\s+/).length;
  const bulletPrefixes = ["-", "•", "*", "▪", "◦", "●", "·"];

  if (bulletPrefixes.includes(stripped)) return true;
  if (/^\d+$/.test(stripped) && Number(stripped) >= 1 && Number(stripped) <= 200) return true;
  if (["page", "page no", "page number"].includes(lowered)) return true;
  if (stripped.length === 1 && !/[a-zA-Z]/.test(stripped)) return true;
  if (wordCount <= 3 && stripped === canonicalizeTitle(stripped)) return true;
  
  const noiseTokens = ["email", "e-mail", "cell", "phone", "linkedin", "github", "portfolio", "relocation"];
  if (noiseTokens.some(token => lowered.includes(token))) return true;

  const locations = [" usa", "texas", " nj", " full time", "part time", "hybrid", "remote", "onsite"];
  if (wordCount <= 5 && locations.some(loc => lowered.includes(loc))) return true;

  return false;
};

const shouldMergeContinuation = (previous, current) => {
  if (detectSectionName(previous) || detectSectionName(current)) return false;

  const bulletPrefixes = ["-", "•", "*", "▪", "◦", "●", "·"];
  const isNewEntry = current.trim().startsWith(bulletPrefixes) || 
                       (current.trim().split(/\s+/).length <= 5 && current.trim() === current.trim().toUpperCase()) ||
                       /^(20|19|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(current.trim()) ||
                       current.includes(" | ") || current.includes("\t");
  if (isNewEntry) return false;

  const looksLikeTableOrContact = (line) => {
    const separatorCount = (line.match(/[|•]/g) || []).length;
    return separatorCount >= 2 || line.includes("@") || line.toLowerCase().includes("linkedin.com") || line.toLowerCase().includes("github.com");
  };

  if (looksLikeTableOrContact(previous) || looksLikeTableOrContact(current)) return false;

  const prevWordCount = previous.split(/\s+/).length;
  const currWordCount = current.split(/\s+/).length;
  const startsLowercase = /^[a-z]/.test(current.trim());
  const prevIsIncomplete = !/[.!?:]$/.test(previous.trim());
  const currIsShortContinuation = currWordCount <= 12 && startsLowercase;

  if (startsLowercase) return true;
  if (prevIsIncomplete && currIsShortContinuation) return true;
  if (prevWordCount >= 6 && prevIsIncomplete && currWordCount <= 8) return true;

  return false;
};

// Logical Line Builder
const buildLogicalLines = (text) => {
  const physicalLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const logicalLines = [];

  for (const rawLine of physicalLines) {
    if (!logicalLines.length) {
      logicalLines.push(rawLine);
      continue;
    }

    const previous = logicalLines[logicalLines.length - 1];
    if (shouldMergeContinuation(previous, rawLine)) {
      logicalLines[logicalLines.length - 1] = `${previous} ${rawLine}`;
    } else {
      logicalLines.push(rawLine);
    }
  }

  return logicalLines;
};

// Clean raw name or filename by stripping extensions, underscores, and common resume metadata words
export const cleanCandidateName = (name) => {
  if (!name) return "";
  
  // 1. Strip file extension
  let clean = name.replace(/\.[^/.]+$/, "");
  
  // 2. Replace separators with spaces
  clean = clean.replace(/[_\-+]/g, " ");
  
  // 3. Remove common metadata/resume terminology
  const noiseWords = /\b(resume|cv|curriculum|vitae|updated|final|latest|draft|formatted|profile|job|description|jd|apply|ver\d*|v\d+|_old)\b/gi;
  const yearPattern = /\b(199\d|200\d|201\d|202\d)\b/g;
  
  clean = clean.replace(noiseWords, "").replace(yearPattern, "");
  
  // 4. Remove any remaining non-alphabetic/non-space characters
  clean = clean.replace(/[^a-zA-Z\s]/g, "");
  
  // 5. Title case words
  const words = clean.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "Candidate";
  
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
};

// Extract Candidate Name from raw text or filename
export const extractCandidateName = (text, fileName) => {
  if (!text) return cleanCandidateName(fileName);

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return cleanCandidateName(fileName);

  const noisePatterns = [
    /email|e-mail|phone|cell|mobile|contact|address|street|zip|curriculum|vitae|resume|cv/i,
    /github\.com|linkedin\.com|github\/|linkedin\//i,
    /^[^a-zA-Z\s]+$/, // no alphabetic characters
    /^Page\s+\d+/i,
    /@/i,           // contains email sign
    /http|www\./i,  // contains website link
    /^(education|experience|projects|skills|summary|profile|about|links|certifications|awards|publications|interests|languages|hobbies|work|employment|objective|history)$/i // standard section headers
  ];

  for (const line of lines.slice(0, 5)) {
    // Clean contact details and links inline from the line before validating
    let cleanLine = line
      .replace(/\S+@\S+\.\S+/g, "") // remove emails
      .replace(/\+?[\d-\s()]{7,}/g, "") // remove phone numbers
      .replace(/(github\.com|linkedin\.com|github\/|linkedin\/)\S*/gi, "") // remove social handles
      .replace(/[•▪●◦|]/g, "") // remove bullet indicators and separators
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanLine) continue;

    // Check against noise patterns
    if (noisePatterns.some(pattern => pattern.test(cleanLine))) continue;

    const words = cleanLine.split(/\s+/);
    if (words.length >= 1 && words.length <= 4) {
      // Ensure each word consists only of letters, hyphens, apostrophes, and optional trailing dots
      const isAlphabetic = words.every(w => /^[a-zA-Z'-]+\.?$/.test(w));
      if (isAlphabetic) {
        return cleanLine.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      }
    }
  }

  // Fallback to regex name matcher from start of text
  const regexMatch = text.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)/)?.[1];
  if (regexMatch) return regexMatch;

  return cleanCandidateName(fileName);
};

// Main Resume Builder
export const buildResumeStructure = (resumeId, fileName, text) => {
  const lines = buildLogicalLines(text);
  const sections = [];
  let currentSection = {
    section_id: "general",
    section_name: "General",
    items: []
  };

  let sectionIndex = 1;
  let lineIndex = 1;

  for (const rawLine of lines) {
    if (!rawLine || isNoiseLine(rawLine)) continue;

    const detected = detectSectionName(rawLine);
    if (detected) {
      if (currentSection.items.length || currentSection.section_id !== "general") {
        sections.push(currentSection);
      }

      currentSection = {
        section_id: `section_${sectionIndex}`,
        section_name: detected.charAt(0).toUpperCase() + detected.slice(1),
        items: []
      };
      sectionIndex++;
      continue;
    }

    currentSection.items.push({
      line_id: `line_${lineIndex}`,
      text: rawLine,
      original_text: rawLine,
      score: scoreLine(rawLine),
      issues: [],
      suggestions: []
    });
    lineIndex++;
  }

  if (currentSection.items.length || !sections.length) {
    sections.push(currentSection);
  }

  const filteredSections = sections.filter(sec => sec.items.length > 0);

  return {
    resume_id: resumeId,
    file_name: fileName,
    candidate_name: extractCandidateName(text, fileName),
    sections: filteredSections,
    raw_text: text
  };
};
