import fs from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseSemicolonCsv, buildArcepIndex } from "../src/utils/arcepCsv.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/data/arcep");
const SOURCES = {
  MAJNUM: { url: "https://extranet.arcep.fr/uploads/MAJNUM.csv", pageUrl: "https://extranet.arcep.fr/communications-electroniques/numerotation", marker: "MAJNUM : Liste des ressources en numérotation téléphoniques attribuées", maxBytes: 8 * 1024 * 1024, required: ["EZABPQM", "Tranche_Debut", "Tranche_Fin", "Mnémo", "Territoire", "Date_Attribution"] },
  IDENTIFIANTS_CE: { url: "https://extranet.arcep.fr/uploads/identifiants_CE.csv", pageUrl: "https://extranet.arcep.fr/communications-electroniques/identifiant-ce", marker: "Acteurs attributaires ou dépositaires de ressources en numérotation", maxBytes: 2 * 1024 * 1024, required: ["IDENTITE_OPERATEUR", "CODE_OPERATEUR"] },
};
const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

async function fetchOfficialCsv(source) {
  let url = new URL(source.url);
  for (let redirect = 0; redirect < 4; redirect += 1) {
    if (url.protocol !== "https:" || url.hostname !== "extranet.arcep.fr") throw new Error("Domaine de téléchargement non autorisé.");
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000), redirect: "manual", headers: { Accept: "text/csv" } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Redirection ARCEP sans destination.");
      url = new URL(location, url);
      continue;
    }
    if (!response.ok) throw new Error(`Téléchargement ARCEP refusé : HTTP ${response.status}.`);
    const declaredLength = Number(response.headers.get("content-length"));
    if (declaredLength && declaredLength > source.maxBytes) throw new Error("Fichier ARCEP supérieur à la taille maximale autorisée.");
    const chunks = [];
    let length = 0;
    for await (const chunk of response.body) {
      length += chunk.length;
      if (length > source.maxBytes) throw new Error("Fichier ARCEP supérieur à la taille maximale autorisée.");
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  throw new Error("Trop de redirections pendant le téléchargement ARCEP.");
}

async function fetchPublicationDate(source) {
  const url = new URL(source.pageUrl);
  if (url.protocol !== "https:" || url.hostname !== "extranet.arcep.fr") throw new Error("Page de provenance non autorisée.");
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000), headers: { Accept: "text/html" } });
  if (!response.ok) throw new Error(`Page de provenance ARCEP inaccessible : HTTP ${response.status}.`);
  const html = await response.text();
  if (Buffer.byteLength(html) > 2 * 1024 * 1024) throw new Error("Page de provenance ARCEP supérieure à la taille maximale autorisée.");
  const text = html.replace(/<[^>]*>/g, " ").replace(/&eacute;/gi, "é").replace(/&egrave;/gi, "è").replace(/&agrave;/gi, "à").replace(/&ecirc;/gi, "ê").replace(/&ocirc;/gi, "ô").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ");
  const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const marker = source.marker.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const markerPosition = normalizedText.indexOf(marker);
  if (markerPosition < 0) return null;
  const match = normalizedText.slice(markerPosition, markerPosition + 700).match(/(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})/);
  return match ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}` : null;
}

async function writeImmutable(filePath, buffer) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try { await fs.writeFile(filePath, buffer, { flag: "wx" }); }
  catch (error) { if (error.code !== "EEXIST") throw error; }
}

async function publishJson(filePath, value) {
  const temporary = `${filePath}.${randomUUID()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  try { await fs.rename(temporary, filePath); }
  catch (error) { await fs.rm(temporary, { force: true }).catch(() => {}); throw error; }
}

const [numbersBuffer, entitiesBuffer, numbersDate, entitiesDate] = await Promise.all([
  fetchOfficialCsv(SOURCES.MAJNUM), fetchOfficialCsv(SOURCES.IDENTIFIANTS_CE),
  fetchPublicationDate(SOURCES.MAJNUM), fetchPublicationDate(SOURCES.IDENTIFIANTS_CE),
]);
const numbers = parseSemicolonCsv(numbersBuffer);
const entities = parseSemicolonCsv(entitiesBuffer);
for (const [key, records] of [["MAJNUM", numbers], ["IDENTIFIANTS_CE", entities]]) {
  const expected = SOURCES[key].required;
  if (expected.some((header) => !Object.hasOwn(records[0], header))) throw new Error(`${key} ne correspond pas aux colonnes attendues par les spécifications ARCEP.`);
}
const index = buildArcepIndex(numbers, entities);
const numberHash = sha256(numbersBuffer);
const entitiesHash = sha256(entitiesBuffer);
const generation = `${numberHash}-${entitiesHash}`;

const existing = await fs.readFile(path.join(ROOT, "metadata.json"), "utf8").then(JSON.parse).catch(() => null);
if (existing?.generation === generation) {
  const updates = [["MAJNUM", numbersDate], ["IDENTIFIANTS_CE", entitiesDate]];
  let metadataChanged = false;
  for (const [key, date] of updates) {
    if (date && existing.sources?.[key]?.publishedDate !== date) {
      existing.sources[key].publishedDate = date;
      existing.sources[key].attribution = `Source : ARCEP, ${key === "MAJNUM" ? "MAJNUM" : "Identifiants CE"}, https://www.data.gouv.fr/datasets/${key === "MAJNUM" ? "ressources-en-numerotation-telephonique" : "identifiants-de-communications-electroniques"}, mise à jour le ${date}.`;
      metadataChanged = true;
    }
  }
  if (metadataChanged) await publishJson(path.join(ROOT, "metadata.json"), existing);
  console.log(metadataChanged ? "Les fichiers sources et l’index sont inchangés ; provenance ARCEP actualisée." : "Les sources ARCEP sont inchangées ; aucun fichier actif n'a été remplacé.");
  console.log(`Tranches MAJNUM : ${index.ranges.length} ; identifiants CE : ${index.entityCount} ; correspondances exactes : ${index.mappedCount}.`);
  process.exit(0);
}

const rawDir = path.join(ROOT, "raw");
const processedDir = path.join(ROOT, "processed", generation);
const rawFiles = {
  MAJNUM: `MAJNUM-${numberHash}.csv`,
  IDENTIFIANTS_CE: `identifiants_CE-${entitiesHash}.csv`,
};
await writeImmutable(path.join(rawDir, rawFiles.MAJNUM), numbersBuffer);
await writeImmutable(path.join(rawDir, rawFiles.IDENTIFIANTS_CE), entitiesBuffer);
await fs.mkdir(processedDir, { recursive: true });
const indexPath = path.join(processedDir, "index.json");
await writeImmutable(indexPath, Buffer.from(`${JSON.stringify(index.ranges)}\n`, "utf8"));

const metadata = {
  generation,
  activatedAt: new Date().toISOString(),
  indexFile: `processed/${generation}/index.json`,
  counts: { allocations: index.ranges.length, entities: index.entityCount, exactEntityMatches: index.mappedCount },
  sources: {
    MAJNUM: { dataset: "Ressources en numérotation téléphonique", url: SOURCES.MAJNUM.url, datasetUrl: "https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique", publishedDate: numbersDate, producer: "ARCEP", license: "Licence Ouverte / Open Licence 2.0 (etalab-2.0)", attribution: `Source : ARCEP, MAJNUM, https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique, mise à jour le ${numbersDate || "date non fournie par l’Extranet"}.`, sha256: numberHash, bytes: numbersBuffer.length, rows: numbers.length, rawFile: `raw/${rawFiles.MAJNUM}`, encoding: "windows-1252 (CSV ANSI annoncé par la source)", delimiter: ";" },
    IDENTIFIANTS_CE: { dataset: "Identifiants de communications électroniques", url: SOURCES.IDENTIFIANTS_CE.url, datasetUrl: "https://www.data.gouv.fr/datasets/identifiants-de-communications-electroniques", publishedDate: entitiesDate, producer: "ARCEP", license: "Licence Ouverte / Open Licence 2.0 (etalab-2.0)", attribution: `Source : ARCEP, Identifiants CE, https://www.data.gouv.fr/datasets/identifiants-de-communications-electroniques, mise à jour le ${entitiesDate || "date non fournie par l’Extranet"}.`, sha256: entitiesHash, bytes: entitiesBuffer.length, rows: entities.length, rawFile: `raw/${rawFiles.IDENTIFIANTS_CE}`, encoding: "windows-1252 (CSV ANSI annoncé par la source)", delimiter: ";" },
  },
  limits: ["Les allocations ne prouvent pas l'attribution du numéro à un utilisateur final.", "Les données ne déterminent pas l'opérateur actuel d'un numéro porté.", "Une ressource attribuée par l'ARCEP n'est pas un indicateur de spam.", "Le rapprochement avec les identifiants CE est exact sur le code, sans correspondance approximative."],
};
await publishJson(path.join(ROOT, "metadata.json"), metadata);
console.log(`Données ARCEP activées (${generation}).`);
console.log(`Tranches MAJNUM : ${index.ranges.length} ; identifiants CE : ${index.entityCount} ; correspondances exactes : ${index.mappedCount}.`);
console.log(`SHA-256 MAJNUM ${numberHash} ; Identifiants CE ${entitiesHash}.`);
