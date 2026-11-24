import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeFrenchNumber } from "../utils/phoneNumber.js";
import { findArcepRange } from "../utils/arcepCsv.js";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data/arcep");

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
