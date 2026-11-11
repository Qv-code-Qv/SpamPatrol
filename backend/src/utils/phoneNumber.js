import { parsePhoneNumberFromString } from "libphonenumber-js";

export function normalizeFrenchNumber(value) {
  if (typeof value !== "string" || value.length > 40) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = parsePhoneNumberFromString(trimmed, "FR");
  return parsed?.isValid() ? parsed.number : null;
}
