export function countResumeLines(resume) {
  if (!resume?.sections) {
    return 0;
  }

  return resume.sections.reduce(
    (count, section) => count + (section.items?.length || 0),
    0
  );
}
