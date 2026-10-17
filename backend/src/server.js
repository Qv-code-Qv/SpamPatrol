import "dotenv/config";
import { createServer } from "node:http";
import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT === undefined ? 4000 : Number(process.env.PORT);
const server = createServer(app);
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") console.error(`Le port ${PORT} est déjà utilisé. Définissez PORT avec un port libre.`);
  else console.error("Impossible de démarrer l’API :", error.message);
  process.exitCode = 1;
});
server.listen(PORT, () => console.log(`API running on http://localhost:${server.address().port}`));

export { server };
