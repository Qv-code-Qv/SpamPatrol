import express from "express";
import { getDataPath } from "../utils/getDataPath.js";
import { reportsToCsv } from "../utils/csv.js";
import { readJson } from "../utils/jsonStore.js";
import { normalizeStoredReports } from "../utils/reportSchema.js";

export function createExportCsvRouter({ dataPath = getDataPath("reports.json") } = {}) {
  const router = express.Router();
  router.get("/", async (_req, res, next) => {
    try {
      const reports = normalizeStoredReports(await readJson(dataPath));
      if (reports.length === 0) return res.status(404).json({ message: "Aucun signalement exploitable à exporter." });
      res.set({ "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="signalements.csv"' });
      return res.send(reportsToCsv(reports));
    } catch (error) { return next(error); }
  });
  return router;
}

export default createExportCsvRouter();
