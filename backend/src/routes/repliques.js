import express from "express";
import { getDataPath } from "../utils/getDataPath.js";
import { readJson } from "../utils/jsonStore.js";

export function createRepliquesRouter({ dataPath = getDataPath("repliques.json") } = {}) {
  const router = express.Router();
  router.get("/", async (_req, res, next) => {
    try {
      const data = await readJson(dataPath);
      return res.json(Array.isArray(data) ? data.filter((item) => typeof item === "string") : []);
    } catch (error) { return next(error); }
  });
  return router;
}

export default createRepliquesRouter();
