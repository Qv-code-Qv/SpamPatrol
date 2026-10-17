import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { getDataPath } from "./utils/getDataPath.js";
import { createPrefixRouter } from "./routes/prefix.js";
import { createReportsRouter } from "./routes/reports.js";
import { createAnalyseRouter } from "./routes/analyse.js";
import { createRepliquesRouter } from "./routes/repliques.js";
import { createStatsRouter } from "./routes/stats.js";
import { createExportCsvRouter } from "./routes/exportCsv.js";

function createSubmissionLimiter({ limit = 10, windowMs = 10 * 60 * 1000 } = {}) {
  const clients = new Map();
  return (req, res, next) => {
    if (req.method !== "POST") return next();
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    if (clients.size > 1000) {
      for (const [clientKey, timestamps] of clients) {
        if (!timestamps.some((timestamp) => now - timestamp < windowMs)) clients.delete(clientKey);
      }
    }
    const recent = (clients.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
    if (recent.length >= limit) return res.status(429).json({ message: "Trop de signalements depuis cette adresse. Réessayez plus tard." });
    recent.push(now);
    clients.set(key, recent);
    next();
  };
}

export function createApp({ dataDir = null, submissionLimit = 10 } = {}) {
  const app = express();
  const resolveDataPath = (name) => dataDir ? path.join(dataDir, name) : getDataPath(name);
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
  app.use(morgan(process.env.NODE_ENV === "test" ? "tiny" : "dev"));

  app.use("/api/prefixes", createPrefixRouter({ dataPath: resolveDataPath("prefixes.json") }));
  app.use("/api/prefix", createPrefixRouter({ dataPath: resolveDataPath("prefixes.json") }));
  app.use("/api/reports", createSubmissionLimiter({ limit: submissionLimit }));
  app.use("/api/reports", createReportsRouter({ dataPath: resolveDataPath("reports.json") }));
  app.use("/api/analyse", createAnalyseRouter());
  app.use("/api/repliques", createRepliquesRouter({ dataPath: resolveDataPath("repliques.json") }));
  app.use("/api/stats", createStatsRouter({ dataPath: resolveDataPath("reports.json") }));
  app.use("/api/export-csv", createExportCsvRouter({ dataPath: resolveDataPath("reports.json") }));
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use((_req, res) => res.status(404).json({ message: "Route API inconnue." }));

  app.use((error, _req, res, _next) => {
    if (error?.type === "entity.too.large") return res.status(413).json({ message: "La requête dépasse la taille maximale autorisée." });
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
      return res.status(400).json({ message: "Le corps doit être un JSON valide." });
    }
    console.error("Erreur API :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  });
  return app;
}

export default createApp;
