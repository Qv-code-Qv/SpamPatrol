import express from "express";
import { getDataPath } from "../utils/getDataPath.js";
import { readJson } from "../utils/jsonStore.js";
import { normalizeStoredReports } from "../utils/reportSchema.js";

export function createStatsRouter({ dataPath = getDataPath("reports.json") } = {}) {
  const router = express.Router();
  router.get("/", async (_req, res, next) => {
    try {
      const reports = normalizeStoredReports(await readJson(dataPath));
      const countBy = (field) => {
        const counts = new Map();
        reports.forEach((report) => counts.set(report[field], (counts.get(report[field]) || 0) + 1));
        return [...counts.entries()]
          .map(([value, count]) => ({ [field]: value, count }))
          .sort((a, b) => b.count - a.count || String(a[field]).localeCompare(String(b[field])));
      };
      const numbers = countBy("number");
      return res.json({ totalReports: reports.length, uniqueNumbers: numbers.length, topCategories: countBy("category"), topNumbers: numbers.slice(0, 10) });
    } catch (error) { return next(error); }
  });
  return router;
}

export default createStatsRouter();
