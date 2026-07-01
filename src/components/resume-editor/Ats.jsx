import { useMemo } from "react";

function normalizeText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function isLikelyHeading(text = "") {
  return /^(summary|professional summary|experience|work experience|professional experience|education|skills|technical skills|projects|certifications|contact|personal details)$/i.test(
    normalizeText(text)
  );
}

function formatSectionTitle(title = "") {
  return title
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function splitListItems(lines) {
  return lines.flatMap((line) => {
    const text = normalizeText(line);
    if (!text) {
      return [];
    }

    return text
      .split(/\s*[•▪●·]\s*|\s*-\s+/)
      .map((item) => normalizeText(item))
      .filter(Boolean);
  });
}

function extractPersonalDetails(sections) {
  const allLines = sections.flatMap((section) =>
    section.items.map((item) => item.text || "")
  );
  const cleanedLines = allLines.map(normalizeText).filter(Boolean);

  const email = cleanedLines.find((line) =>
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(line)
  );
  const phone = cleanedLines.find((line) => /(\+?\d[\d\s().-]{7,}\d)/.test(line));
  const linkedin = cleanedLines.find((line) =>
    /linkedin\.com|github\.com|portfolio|www\./i.test(line)
  );
  const name =
    cleanedLines.find(
      (line) =>
        !email?.includes(line) &&
        !phone?.includes(line) &&
        !linkedin?.includes(line) &&
        !isLikelyHeading(line) &&
        line.length < 50 &&
        !/@|http|www\.|linkedin\.com/i.test(line)
    ) || "Your Name";

  const location = cleanedLines.find(
    (line) =>
      line !== name &&
      line !== email &&
      line !== phone &&
      line !== linkedin &&
      /\b[A-Za-z]+,\s*[A-Za-z]{2,}\b/.test(line)
  );

  return { name, email, phone, linkedin, location };
}

function buildPreviewSections(sections) {
  const mapped = sections.map((section) => ({
    title: section.section_name || "General",
    items: section.items.map((item) => normalizeText(item.text || "")).filter(Boolean),
  }));

  const consumed = new Set();
  const findSection = (pattern) => {
    const match = mapped.find((section, index) => {
      if (consumed.has(index)) {
        return false;
      }
      return pattern.test(section.title);
    });
    if (!match) {
      return null;
    }
    const index = mapped.indexOf(match);
    consumed.add(index);
    return match;
  };

  const summarySection = findSection(/summary|objective|profile/i) || null;
  const skillsSection = findSection(/skill|technology|tools|competenc/i) || null;
  const experienceSections = mapped.filter((section, index) => {
    if (consumed.has(index)) {
      return false;
    }
    return /experience|employment|work history|professional/i.test(section.title);
  });
  experienceSections.forEach((section) => consumed.add(mapped.indexOf(section)));

  const educationSection = findSection(/education|academic/i) || null;
  const projectsSection = findSection(/project/i) || null;
  const certificationsSection = findSection(/certification|license/i) || null;

  const extraSections = mapped.filter((_, index) => !consumed.has(index));

  return {
    summary: summarySection ? summarySection.items.join(" ") : "",
    skills: skillsSection ? splitListItems(skillsSection.items) : [],
    experience: experienceSections.flatMap((section) => splitListItems(section.items)),
    education: educationSection ? splitListItems(educationSection.items) : [],
    projects: projectsSection ? splitListItems(projectsSection.items) : [],
    certifications: certificationsSection
      ? splitListItems(certificationsSection.items)
      : [],
    extraSections,
  };
}

function ATSSection({ title, children }) {
  return (
    <section>
      <h2 className="mb-2 border-b-2 border-slate-900 pb-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ATSBulletList({ items }) {
  return (
    <ul className="space-y-1.5 pl-4 text-[11px] leading-[1.55] text-slate-800">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Ats({ resume }) {
  const sections = resume?.sections || [];

  const { personal, previewSections } = useMemo(
    () => ({
      personal: extractPersonalDetails(sections),
      previewSections: buildPreviewSections(sections),
    }),
    [sections]
  );

  return (
    <div className="flex justify-center bg-slate-200 px-3 py-4">
      <div className="resume-preview-wrapper mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white p-10 shadow-md">
        <header className="border-b border-slate-300 pb-4 text-center">
          <h1 className="text-[26px] font-black uppercase tracking-[0.08em] text-slate-950">
            {personal.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-700">
            {personal.location ? <span>{personal.location}</span> : null}
            {personal.phone ? <span>{personal.phone}</span> : null}
            {personal.email ? <span>{personal.email}</span> : null}
            {personal.linkedin ? <span>{personal.linkedin}</span> : null}
          </div>
        </header>

        <div className="mt-5 space-y-4">
          {previewSections.summary ? (
            <ATSSection title="Professional Summary">
              <p className="text-[11px] leading-[1.6] text-slate-800">
                {previewSections.summary}
              </p>
            </ATSSection>
          ) : null}

          {previewSections.skills.length ? (
            <ATSSection title="Skills">
              <p className="text-[11px] leading-[1.6] text-slate-800">
                {previewSections.skills.join(", ")}
              </p>
            </ATSSection>
          ) : null}

          {previewSections.experience.length ? (
            <ATSSection title="Experience">
              <ATSBulletList items={previewSections.experience} />
            </ATSSection>
          ) : null}

          {previewSections.education.length ? (
            <ATSSection title="Education">
              <ATSBulletList items={previewSections.education} />
            </ATSSection>
          ) : null}

          {previewSections.projects.length ? (
            <ATSSection title="Projects">
              <ATSBulletList items={previewSections.projects} />
            </ATSSection>
          ) : null}

          {previewSections.certifications.length ? (
            <ATSSection title="Certifications">
              <ATSBulletList items={previewSections.certifications} />
            </ATSSection>
          ) : null}

          {previewSections.extraSections.map((section) =>
            section.items.length ? (
              <ATSSection key={section.title} title={formatSectionTitle(section.title)}>
                <ATSBulletList items={splitListItems(section.items)} />
              </ATSSection>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default Ats;
