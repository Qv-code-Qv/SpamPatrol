import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { getDataPath } from "./utils/getDataPath.js";
import { createArcepRouter } from "./routes/arcep.js";
import { createPrefixRouter } from "./routes/prefix.js";

function getSafeErrorDetails(error) {
  const message = String(error?.message || "Erreur inconnue")
    .replace(/(?<!\d)(?:\+33|0)(?:[ .()-]*\d){9,10}(?!\d)/g, "[numéro masqué]");
  return { name: error?.name || "Error", code: error?.code || "UNKNOWN", message };
}

export function createApp({ dataDir = null, logStream = process.stdout } = {}) {
  const app = express();
  const prefixDataPath = dataDir ? path.join(dataDir, "prefixes.json") : getDataPath("prefixes.json");
  const configuredOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost,http://127.0.0.1")
    .split(",").map((origin) => origin.trim()).filter(Boolean);

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      const allowed = !origin || configuredOrigins.includes(origin);
      callback(null, allowed ? origin || false : false);
    },
    credentials: false,
  }));
  app.use(express.json({ limit: "16kb", strict: true }));
  // Deliberately omit URLs and client addresses: phone searches are URL path parameters.
  app.use(morgan(":method :status :res[content-length] - :response-time ms", { stream: logStream }));

  app.use("/api/prefixes", createPrefixRouter({ dataPath: prefixDataPath }));
  app.use("/api/prefix", createPrefixRouter({ dataPath: prefixDataPath }));
  app.use("/api/arcep", createArcepRouter({ dataDir: dataDir ? path.join(dataDir, "arcep") : getDataPath("arcep") }));
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use((_req, res) => res.status(404).json({ message: "Route API inconnue." }));

  app.use((error, _req, res, _next) => {
    if (error?.type === "entity.too.large") return res.status(413).json({ message: "La requête dépasse la taille maximale autorisée." });
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
      return res.status(400).json({ message: "Le corps doit être un JSON valide." });
    }
    console.error("Erreur API :", getSafeErrorDetails(error));
    return res.status(500).json({ message: "Erreur interne du serveur." });
  });
  return app;
}

export default createApp;
