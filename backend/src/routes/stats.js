import express from "express";
import fs from "fs";
import { getDataPath } from "../utils/getDataPath.js";

const router = express.Router();
const dataPath = getDataPath("reports.json");

// GET /api/stats → statistiques globales
router.get("/", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    if (!Array.isArray(data) || data.length === 0) {
      return res.json({
        totalReports: 0,
        topCategories: [],
        topNumbers: [],
      });
    }

    // 🧮 Total de signalements
    const totalReports = data.length;

    // 📊 Top catégories
    const categoryCount = {};
    data.forEach(r => {
      categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // ☎️ Top 5 des numéros les plus signalés
    const numberCount = {};
    data.forEach(r => {
      numberCount[r.number] = (numberCount[r.number] || 0) + 1;
    });
    const topNumbers = Object.entries(numberCount)
      .map(([number, count]) => ({ number, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      totalReports,
      topCategories,
      topNumbers,
    });
  } catch (error) {
    console.error("Erreur lors du calcul des stats :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

export default router;
