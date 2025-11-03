import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import prefixRoutes from "./routes/prefix.js";
import reportRoutes from "./routes/reports.js";
import analyseRoutes from "./routes/analyse.js";
import repliquesRoutes from "./routes/repliques.js";
import statsRoutes from "./routes/stats.js";
import exportCsvRoutes from "./routes/exportCsv.js";



const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use("/api/prefixes", prefixRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analyse", analyseRoutes);
app.use("/api/repliques", repliquesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/export-csv", exportCsvRoutes);


// Petite route ping
app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
