import express from "express";
import { getDataPath } from "../utils/getDataPath.js";
import { readJson } from "../utils/jsonStore.js";
import { normalizeFrenchNumber } from "../utils/reportSchema.js";

export function createPrefixRouter({ dataPath = getDataPath("prefixes.json") } = {}) {
  const router = express.Router();
  router.get("/:numero", async (req, res, next) => {
    const normalized = normalizeFrenchNumber(req.params.numero);
    if (!normalized) return res.status(400).json({ message: "Saisissez un numéro de téléphone français valide." });
    try {
      const rawData = await readJson(dataPath);
      const prefixes = Array.isArray(rawData?.npv_officiels) ? rawData.npv_officiels : [];
      const nationalNumber = normalized.replace(/^\+33/, "0");
      const prefix = prefixes
        .filter((item) => typeof item?.prefixe === "string" && nationalNumber.startsWith(item.prefixe))
        .sort((a, b) => b.prefixe.length - a.prefixe.length)[0];
      if (!prefix) return res.status(404).json({ message: "Aucun préfixe correspondant dans le jeu de données local." });
      return res.json({ prefixe: prefix.prefixe, zone: prefix.zone, nature: prefix.nature, source: "Jeu local fourni avec SpamPatrol" });
    } catch (error) { return next(error); }
  });
  return router;
}

export default createPrefixRouter();
