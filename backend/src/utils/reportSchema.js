import { parsePhoneNumberFromString } from "libphonenumber-js";

export const REPORT_CATEGORIES = [
  "Spam",
  "Démarchage",
  "Sondage",
  "Arnaque",
  "Fraude",
];

export const COMMENT_MIN_LENGTH = 3;
export const COMMENT_MAX_LENGTH = 500;

export function normalizeFrenchNumber(value) {
  if (typeof value !== "string" || value.length > 40) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = parsePhoneNumberFromString(trimmed, "FR");
  return parsed?.isValid() ? parsed.number : null;
}

export function getReportInputError(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return "Le corps de la requête doit être un objet JSON.";
  }
  if (!normalizeFrenchNumber(input.number)) {
    return "Saisissez un numéro de téléphone français valide.";
  }
  if (!REPORT_CATEGORIES.includes(input.category)) {
    return `La catégorie doit être l’une de ces valeurs : ${REPORT_CATEGORIES.join(", ")}.`;
  }
  if (typeof input.comment !== "string") {
    return "Le commentaire est obligatoire.";
  }
  const length = input.comment.trim().length;
  if (length < COMMENT_MIN_LENGTH || length > COMMENT_MAX_LENGTH) {
    return `Le commentaire doit contenir entre ${COMMENT_MIN_LENGTH} et ${COMMENT_MAX_LENGTH} caractères.`;
  }
  return null;
}

function parseLegacyQuery(record) {
  if (typeof record?.query !== "string") return null;
  try {
    const value = JSON.parse(record.query);
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : null;
  } catch {
    return null;
  }
}

// Read old records without altering the original JSON. Unparseable legacy items
// stay preserved on disk but are excluded from user-facing results.
export function normalizeStoredReport(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return null;
  const source = { ...parseLegacyQuery(record), ...record };
  const number = normalizeFrenchNumber(source.number);
  if (!number || !REPORT_CATEGORIES.includes(source.category)) return null;
  const comment = typeof source.comment === "string" ? source.comment.trim() : "";
  return {
    ...(typeof source.id === "string" ? { id: source.id } : {}),
    number,
    category: source.category,
    comment,
    date: typeof source.date === "string" ? source.date : null,
  };
}

export function normalizeStoredReports(records) {
  if (!Array.isArray(records)) throw new TypeError("Le fichier des signalements doit contenir un tableau.");
  return records.map(normalizeStoredReport).filter(Boolean);
}
