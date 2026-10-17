import express from "express";
import { normalizeFrenchNumber } from "../utils/reportSchema.js";

export function createAnalyseRouter() {
  const router = express.Router();
  router.post("/", (req, res) => {
    const { number, message } = req.body || {};
    if (!normalizeFrenchNumber(number)) return res.status(400).json({ message: "Saisissez un numéro de téléphone français valide." });
    if (typeof message !== "string" || message.trim().length < 3 || message.length > 1000) {
      return res.status(400).json({ message: "Le texte à résumer doit contenir entre 3 et 1000 caractères." });
    }
    const text = message.trim();
    return res.json({
      number: normalizeFrenchNumber(number),
      summary: text.length > 160 ? `${text.slice(0, 157)}...` : text,
      category: null,
      score: null,
      mode: "simulation",
      disclaimer: "Résumé indicatif généré localement. Aucune IA ni évaluation de risque n’est utilisée.",
    });
  });
  return router;
}

export default createAnalyseRouter();
