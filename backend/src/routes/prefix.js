import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataPath = path.resolve("src/data/prefixes.json"); // ✅ chemin corrigé

router.get("/:numero", (req, res) => {
  const numero = req.params.numero;
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  const prefix = data.find(p => numero.startsWith(p.prefix));
  if (prefix) {
    res.json(prefix);
  } else {
    res.status(404).json({ message: "Préfixe non trouvé" });
  }
});

export default router;
