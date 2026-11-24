import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeFrenchNumber } from "../utils/phoneNumber.js";
import { findArcepRange } from "../utils/arcepCsv.js";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data/arcep");

function buildTerritoryDistribution(index) {
  const groups = new Map();
  for (const record of index) {
    const value = record && typeof record === "object" ? record.territory : undefined;
    let kind = "value";
    let territory = value;
    let label = value;
    if (typeof value !== "string") {
      kind = value == null ? "missing" : "invalid";
      territory = null;
      label = kind === "missing" ? "Valeur absente ou vide" : "Valeur de territoire invalide";
    } else if (!value.trim()) {
      kind = "missing";
      territory = null;
      label = "Valeur absente ou vide";
    }
    const key = JSON.stringify([kind, territory]);
    const group = groups.get(key) || { kind, territory, label, count: 0 };
    group.count += 1;
    groups.set(key, group);
  }

  const totalRecords = index.length;
  const entries = [...groups.values()]
    .sort((left, right) => left.label.localeCompare(right.label, "fr"))
    .map((group) => ({
      ...group,
      sharePercent: totalRecords ? (group.count / totalRecords) * 100 : 0,
    }));
  const groupedCount = entries.reduce((total, entry) => total + entry.count, 0);
  if (groupedCount !== totalRecords) throw new Error("La répartition par territoire ne correspond pas au total MAJNUM.");

  return {
    totalRecords,
    entries,
    method: "Chaque enregistrement est regroupé sous son libellé exact de territoire. Les valeurs absentes, vides ou invalides sont comptées séparément; chaque part est calculée sur le total des enregistrements.",
  };
}

function buildAllocationCodeDistribution(index) {
  const groups = new Map();
  for (const record of index) {
    const value = record && typeof record === "object" ? record.allocationCode : undefined;
    let kind = "value";
    let code = value;
    let label = value;
    if (value == null) {
      kind = "missing";
      code = null;
      label = "Code absent";
    } else if (typeof value === "string" && !value.trim()) {
      kind = "empty";
      code = null;
      label = "Code vide";
    } else if (typeof value !== "string") {
      kind = "invalid";
      code = null;
      label = "Code invalide";
    }

    const key = JSON.stringify([kind, code]);
    const group = groups.get(key) || { kind, code, label, count: 0 };
    group.count += 1;
    groups.set(key, group);
  }

  const totalRecords = index.length;
  const entries = [...groups.values()]
    .sort((left, right) => {
      if (left.kind !== "value") return right.kind === "value" ? 1 : left.kind.localeCompare(right.kind, "fr");
      if (right.kind !== "value") return -1;
      return right.count - left.count || left.code.localeCompare(right.code, "fr");
    })
    .map((group) => ({
      ...group,
      sharePercent: totalRecords ? (group.count / totalRecords) * 100 : 0,
    }));
  const groupedCount = entries.reduce((total, entry) => total + entry.count, 0);
  if (groupedCount !== totalRecords) throw new Error("La répartition par code d’attribution ne correspond pas au total MAJNUM.");

  return {
    totalRecords,
    entries,
    method: "Chaque enregistrement est regroupé selon la valeur exacte de son code d’attribution. Les codes absents, vides ou invalides sont comptés séparément; chaque part est calculée sur le total des enregistrements.",
  };
}

function buildAllocationYearDistribution(index) {
  const groups = new Map();
  for (const record of index) {
    const value = record && typeof record === "object" ? record.allocationDate : undefined;
    let kind = "year";
    let year = null;
    let label;

    if (value == null) {
      kind = "missing";
      label = "Date absente";
    } else if (typeof value === "string" && !value.trim()) {
      kind = "empty";
      label = "Date vide";
    } else if (typeof value !== "string") {
      kind = "invalid";
      label = "Date invalide";
    } else {
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
      if (!match) {
        kind = "invalid";
        label = "Date invalide";
      } else {
        const [, dayText, monthText, yearText] = match;
        const day = Number(dayText);
        const month = Number(monthText);
        const yearNumber = Number(yearText);
        const leapYear = yearNumber % 4 === 0 && (yearNumber % 100 !== 0 || yearNumber % 400 === 0);
        const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (yearNumber < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
          kind = "invalid";
          label = "Date invalide";
        } else {
          year = yearText;
          label = year;
        }
      }
    }

    const key = JSON.stringify([kind, year]);
    const group = groups.get(key) || { kind, year, label, count: 0 };
    group.count += 1;
    groups.set(key, group);
  }

  const totalRecords = index.length;
  const entries = [...groups.values()]
    .sort((left, right) => {
      if (left.kind === "year" && right.kind === "year") return Number(left.year) - Number(right.year);
      if (left.kind === "year") return -1;
      if (right.kind === "year") return 1;
      return left.kind.localeCompare(right.kind, "fr");
    })
    .map((group) => ({
      ...group,
      sharePercent: totalRecords ? (group.count / totalRecords) * 100 : 0,
    }));
  const groupedCount = entries.reduce((total, entry) => total + entry.count, 0);
  if (groupedCount !== totalRecords) throw new Error("La répartition par année d’attribution ne correspond pas au total MAJNUM.");

  return {
    totalRecords,
    entries,
    method: "Les ressources présentes sont regroupées selon l’année de leur date d’attribution; chaque part est calculée sur le total des enregistrements. Les dates absentes, vides ou invalides restent comptées séparément.",
  };
}

export function createArcepRouter({ dataDir = DEFAULT_ROOT } = {}) {
  const router = express.Router();
  let cachedGeneration = null;
  let cachedIndex = null;
  async function loadSnapshot() {
    const metadata = JSON.parse(await fs.readFile(path.join(dataDir, "metadata.json"), "utf8"));
    if (typeof metadata.indexFile !== "string" || metadata.indexFile.includes("..") || path.isAbsolute(metadata.indexFile)) {
      throw new Error("Chemin de l'index ARCEP invalide.");
    }
    if (cachedGeneration === metadata.generation && cachedIndex) {
      return { index: cachedIndex, metadata };
    }
    const index = JSON.parse(await fs.readFile(path.join(dataDir, metadata.indexFile), "utf8"));
    if (!Array.isArray(index)) throw new Error("Index ARCEP invalide.");
    cachedGeneration = metadata.generation;
    cachedIndex = index;
    return { index, metadata };
  }

  router.get("/summary", async (_req, res, next) => {
    try {
      const { index, metadata } = await loadSnapshot();
      const recordCount = index.length;
      if (
        !Number.isSafeInteger(metadata.counts?.allocations)
        || !Number.isSafeInteger(metadata.sources?.MAJNUM?.rows)
        || metadata.counts.allocations !== recordCount
        || metadata.sources.MAJNUM.rows !== recordCount
      ) {
        return res.status(503).json({ message: "Le résumé MAJNUM est indisponible : les comptes locaux sont incohérents." });
      }
      const source = metadata.sources?.MAJNUM || {};
      return res.json({
        source: "ARCEP – MAJNUM",
        sourceUrl: source.datasetUrl || source.url || null,
        publishedDate: typeof source.publishedDate === "string" ? source.publishedDate : null,
        activatedAt: typeof metadata.activatedAt === "string" ? metadata.activatedAt : null,
        snapshotVersion: typeof metadata.generation === "string" ? metadata.generation : null,
        recordCount,
        unit: "enregistrements de ressources ou de tranches",
        method: "Nombre d’objets de l’index MAJNUM préparé par l’application, comparé aux deux nombres d’enregistrements indiqués dans les métadonnées.",
        territoryDistribution: buildTerritoryDistribution(index),
        allocationCodeDistribution: buildAllocationCodeDistribution(index),
        allocationYearDistribution: buildAllocationYearDistribution(index),
      });
    } catch (error) {
      if (error.code === "ENOENT") {
        return res.status(503).json({ message: "Le résumé MAJNUM est indisponible : l’instantané local ne peut pas être lu." });
      }
      return next(error);
    }
  });

  router.get("/lookup/:numero", async (req, res, next) => {
    const number = normalizeFrenchNumber(req.params.numero);
    if (!number) return res.status(400).json({ message: "Saisissez un numéro de téléphone français valide." });
    try {
      const { index, metadata } = await loadSnapshot();
      const national = number.replace(/^\+33/, "0");
      const allocation = findArcepRange(index, national);
      return res.json({
        number,
        allocation: allocation ? {
          rangeStart: allocation.start,
          rangeEnd: allocation.end,
          allocationCode: allocation.allocationCode,
          entityName: allocation.entityName,
          allocationDate: allocation.allocationDate,
          territory: allocation.territory,
          resource: allocation.resource,
        } : null,
        source: metadata.sources?.MAJNUM?.attribution || "ARCEP, MAJNUM",
        updatedAt: metadata.sources?.MAJNUM?.publishedDate || null,
        importedAt: metadata.activatedAt || null,
        limits: metadata.limits || [],
      });
    } catch (error) {
      if (error.code === "ENOENT") return res.status(503).json({ message: "Les données officielles ARCEP ne sont pas encore disponibles. Lancez npm run arcep:update." });
      return next(error);
    }
  });
  return router;
}

export default createArcepRouter();
