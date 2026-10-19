import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeFrenchNumber } from "../utils/reportSchema.js";
import { findArcepRange } from "../utils/arcepCsv.js";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data/arcep");

export function createArcepRouter({ dataDir = DEFAULT_ROOT } = {}) {
  const router = express.Router();
  let cachedGeneration = null;
  let cachedIndex = null;
  let cachedMetadata = null;
  router.get("/lookup/:numero", async (req, res, next) => {
    const number = normalizeFrenchNumber(req.params.numero);
    if (!number) return res.status(400).json({ message: "Saisissez un numéro de téléphone français valide." });
    try {
      const metadata = JSON.parse(await fs.readFile(path.join(dataDir, "metadata.json"), "utf8"));
      if (typeof metadata.indexFile !== "string" || metadata.indexFile.includes("..") || path.isAbsolute(metadata.indexFile)) {
        throw new Error("Chemin de l'index ARCEP invalide.");
      }
      let index = cachedGeneration === metadata.generation ? cachedIndex : null;
      if (!index) {
        index = JSON.parse(await fs.readFile(path.join(dataDir, metadata.indexFile), "utf8"));
        cachedGeneration = metadata.generation;
        cachedIndex = index;
        cachedMetadata = metadata;
      }
      if (!Array.isArray(index)) throw new Error("Index ARCEP invalide.");
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
        source: cachedMetadata?.sources?.MAJNUM?.attribution || metadata.sources?.MAJNUM?.attribution || "ARCEP, MAJNUM",
        updatedAt: cachedMetadata?.sources?.MAJNUM?.publishedDate || metadata.sources?.MAJNUM?.publishedDate || null,
        importedAt: cachedMetadata?.activatedAt || metadata.activatedAt || null,
        limits: cachedMetadata?.limits || metadata.limits || [],
      });
    } catch (error) {
      if (error.code === "ENOENT") return res.status(503).json({ message: "Les données officielles ARCEP ne sont pas encore disponibles. Lancez npm run arcep:update." });
      return next(error);
    }
  });
  return router;
}

export default createArcepRouter();
