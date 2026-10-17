import express from "express";
import { randomUUID } from "node:crypto";
import { getDataPath } from "../utils/getDataPath.js";
import { readJson, updateJsonArray } from "../utils/jsonStore.js";
import { getReportInputError, normalizeFrenchNumber, normalizeStoredReports } from "../utils/reportSchema.js";

export function createReportsRouter({ dataPath = getDataPath("reports.json") } = {}) {
  const router = express.Router();
  router.get("/", async (req, res, next) => {
    try {
      const reports = normalizeStoredReports(await readJson(dataPath));
      if (req.query.number !== undefined) {
        const number = normalizeFrenchNumber(req.query.number);
        if (!number) return res.status(400).json({ message: "Saisissez un numéro de téléphone français valide." });
        const matches = reports.filter((report) => report.number === number);
        return res.json({ number, frequency: matches.length, reports: matches });
      }
      return res.json(reports);
    } catch (error) { return next(error); }
  });
  router.post("/", async (req, res, next) => {
    const validationError = getReportInputError(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const report = {
      id: randomUUID(),
      number: normalizeFrenchNumber(req.body.number),
      category: req.body.category,
      comment: req.body.comment.trim(),
      date: new Date().toISOString(),
    };
    try {
      await updateJsonArray(dataPath, (records) => [...records, report]);
      return res.status(201).json(report);
    } catch (error) { return next(error); }
  });
  return router;
}

export default createReportsRouter();
