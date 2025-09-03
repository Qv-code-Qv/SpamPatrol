import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import numberRouter from './routes/number.js';
import reportsRouter from './routes/reports.js';
import statsRouter from './routes/stats.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/number', numberRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/stats', statsRouter);

// Petite route ping
app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
