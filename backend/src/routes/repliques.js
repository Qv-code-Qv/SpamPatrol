import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataPath = path.resolve("src/data/repliques.json"); // ✅ chemin corrigé

// GET toutes les répliques
router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  res.json(data);
});

export default router;
