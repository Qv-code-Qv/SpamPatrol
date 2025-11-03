import express from "express";
import fs from "fs";
import { getDataPath } from "../utils/getDataPath.js";
import { parse } from "json2csv"; // npm install json2csv

const router = express.Router();
const dataPath = getDataPath("reports.json");

// GET export CSV
router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Aucun signalement à exporter" });
  }

  try {
    const fields = Object.keys(data[0]); // toutes les colonnes du JSON
    const csv = parse(data, { fields });

    res.header("Content-Type", "text/csv");
    res.attachment("signalements.csv"); // nom du fichier exporté
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'export CSV" });
  }
});

export default router;
