import ResumeLineItem from "./ResumeLineItem";
import SectionToolbar from "./SectionToolbar";

const noiseTokens = new Set(["•", "-", "–", "—", "*", "▪", "◦", "●", "·"]);
const actionVerbPattern = /\b(achieved|analyzed|automated|built|coordinated|created|delivered|designed|developed|drove|implemented|improved|increased|involved|led|managed|optimized|performed|reduced|resolved|streamlined|supported|transformed)\b/i;
const staticContentPattern = /\b(address|phone|cell|mobile|email|e-mail|linkedin|github|portfolio|bachelor|master|university|college|school|education|gpa|phoenix|stephenville|texas|usa|az|nj|relocation|full time|part time|hybrid|remote|onsite)\b/i;
const headingTextPattern = /^(profile summary|professional summary|summary|objective|experience|professional experience|work experience|education|skills|technical skills|certifications|projects|area of expertise)$/i;

function isNoiseItem(item) {
  const text = (item.text || "").trim();
  const lowered = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const looksLikeName = wordCount <= 3 && /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/.test(text);

  return (
    !text ||
    noiseTokens.has(text) ||
    headingTextPattern.test(text) ||
    looksLikeName ||
    staticContentPattern.test(text) ||
    /^\d{1,3}$/.test(text) ||
    (wordCount <= 5 && /\b(usa|texas|nj|full time|part time|hybrid|remote|onsite)\b/i.test(lowered))
  );
}

function isMeaningfulAnalysisLine(item) {
  const text = (item.text || "").trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (isNoiseItem(item)) {
    return false;
  }

  if (staticContentPattern.test(text)) {
    return false;
  }

  if (wordCount < 6 || text.length < 35) {
    return false;
  }

  if (text.includes("|") && wordCount < 10) {
    return false;
  }

  if ((text.match(/,/g) || []).length >= 3 && !actionVerbPattern.test(text)) {
    return false;
  }

  return true;
}

function ResumeSection({
  section,
  allowedLineIds,
  lineStates,
  suggestions,
  onLineChange,
  onLineFocus,
  onAnalyze,
  onRewrite,
  onReviewSection,
  onApplySuggestion,
  onDismissSuggestion,
  highlightedLineId,
}) {
  const sectionName = `${section.section_id || ""} ${section.section_name || ""}`.toLowerCase();
  const isStaticSection = /\b(contact|personal|address|education|academic|certification|certifications)\b/.test(sectionName);
  const visibleItems = section.items.filter(
    (item) => !isNoiseItem(item) && (!allowedLineIds || allowedLineIds.has(item.line_id))
  );
  const analyzableItems = visibleItems.filter(isMeaningfulAnalysisLine);
  const canReviewSection = !isStaticSection && analyzableItems.length > 0;

  if (!visibleItems.length) {
    return null;
  }

  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{section.section_name}</h3>
      </div>
      <SectionToolbar
        itemCount={visibleItems.length}
        aiEnabled={canReviewSection}
        onReviewSection={() => onReviewSection(analyzableItems)}
        reviewing={analyzableItems.some((item) => suggestions[item.line_id]?.loadingMode === "analysis")}
      />
      <div className="space-y-3">
        {visibleItems.map((item) => (
          <ResumeLineItem
            key={item.line_id}
            item={item}
            lineState={lineStates[item.line_id]}
            suggestion={suggestions[item.line_id]}
            onChange={onLineChange}
            onFocus={onLineFocus}
            onAnalyze={onAnalyze}
            onRewrite={onRewrite}
            onApplySuggestion={onApplySuggestion}
            onDismissSuggestion={onDismissSuggestion}
            aiEnabled={!isStaticSection && isMeaningfulAnalysisLine(item)}
            highlighted={highlightedLineId === item.line_id}
          />
        ))}
      </div>
    </section>
  );
}

export default ResumeSection;
