import express from "express";
import fs from "fs";
import { getDataPath } from "../utils/getDataPath.js";

const router = express.Router();
const dataPath = getDataPath("repliques.json");

// GET toutes les répliques
router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  res.json(data);
});

export default router;
