export function getScoreTone(score = 0) {
  if (score >= 80) {
    return "excellent";
  }
  if (score >= 65) {
    return "good";
  }
  if (score >= 50) {
    return "fair";
  }
  return "weak";
}

export function getScoreToneClasses(score = 0) {
  const tone = getScoreTone(score);

  if (tone === "excellent") {
    return "bg-emerald-100 text-emerald-800";
  }
  if (tone === "good") {
    return "bg-sky-100 text-sky-800";
  }
  if (tone === "fair") {
    return "bg-amber-100 text-amber-800";
  }
  return "bg-rose-100 text-rose-800";
}
