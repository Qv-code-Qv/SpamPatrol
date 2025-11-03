import express from "express";
import fs from "fs";
import { getDataPath } from "../utils/getDataPath.js";

const router = express.Router();
const dataPath = getDataPath("prefixes.json"); // ✅ chemin corrigé

router.get("/:numero", (req, res) => {
  const numero = req.params.numero;
  const rawData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const data = rawData.npv_officiels; // ✅ on utilise le vrai tableau

  const prefix = data.find(p => numero.startsWith(p.prefixe));

  if (prefix) {
    res.json({
      prefixe: prefix.prefixe,
      zone: prefix.zone,
      nature: prefix.nature
    });
  } else {
    res.status(404).json({ message: "Préfixe non trouvé" });
  }
});

export default router;
