import { TextDecoder } from "node:util";

export function parseSemicolonCsv(buffer) {
  const text = new TextDecoder("windows-1252").decode(buffer).replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && field.length === 0) quoted = true;
    else if (char === ";") { row.push(field); field = ""; }
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field); field = "";
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
    } else field += char;
  }
  if (quoted) throw new Error("CSV ARCEP invalide : guillemet non fermé.");
  if (field.length || row.length) { row.push(field); if (row.some((value) => value !== "")) rows.push(row); }
  if (rows.length < 2) throw new Error("CSV ARCEP invalide : en-tête ou données absents.");

  const headers = rows[0].map((header) => header.trim());
  if (new Set(headers).size !== headers.length || headers.some((header) => !header)) throw new Error("CSV ARCEP invalide : en-têtes vides ou dupliqués.");
  return rows.slice(1).map((values, index) => {
    if (values.length !== headers.length) throw new Error(`CSV ARCEP invalide : ligne ${index + 2}, nombre de colonnes incorrect.`);
    return Object.fromEntries(headers.map((header, column) => [header, values[column].trim()]));
  });
}

export function buildArcepIndex(numberRows, entityRows) {
  const entities = new Map();
  for (const entity of entityRows) {
    const code = entity.CODE_OPERATEUR?.trim();
    const name = entity.IDENTITE_OPERATEUR?.trim();
    if (!code || !name) throw new Error("Identifiants CE incohérent : code ou raison sociale absent.");
    if (entities.has(code)) throw new Error(`Identifiants CE incohérent : code dupliqué (${code}).`);
    entities.set(code, name);
  }

  const ranges = numberRows.map((record, index) => {
    const start = record.Tranche_Debut?.trim();
    const end = record.Tranche_Fin?.trim();
    const code = record.Mnémo?.trim();
    if (!start || !end || !/^\d+$/.test(start) || !/^\d+$/.test(end) || start.length !== end.length || start > end) {
      throw new Error(`MAJNUM incohérent : bornes invalides à la ligne ${index + 2}.`);
    }
    if (!code || !record.Territoire?.trim() || !/^\d{2}\/\d{2}\/\d{4}$/.test(record.Date_Attribution || "")) {
      throw new Error(`MAJNUM incohérent : champ obligatoire invalide à la ligne ${index + 2}.`);
    }
    return {
      start, end, allocationCode: code,
      entityName: entities.get(code) || null,
      territory: record.Territoire.trim(),
      allocationDate: record.Date_Attribution,
      resource: record.EZABPQM?.trim() || null,
    };
  }).sort((a, b) => a.start.length - b.start.length || a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
  return { ranges, entityCount: entities.size, mappedCount: ranges.filter((range) => range.entityName).length };
}

export function findArcepRange(ranges, nationalNumber) {
  let low = 0;
  let high = ranges.length - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const range = ranges[middle];
    if (nationalNumber.length < range.start.length) high = middle - 1;
    else if (nationalNumber.length > range.start.length) low = middle + 1;
    else if (nationalNumber < range.start) high = middle - 1;
    else if (nationalNumber > range.end) low = middle + 1;
    else return range;
  }
  return null;
}
