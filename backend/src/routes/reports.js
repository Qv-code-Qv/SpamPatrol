import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataPath = path.resolve("src/data/reports.json"); // ✅ chemin corrigé

// GET tous les signalements
router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  res.json(data);
});

// POST un nouveau signalement
router.post("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const newReport = { ...req.body, date: new Date().toISOString().split("T")[0] };
  data.push(newReport);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json(newReport);
});

export default router;
