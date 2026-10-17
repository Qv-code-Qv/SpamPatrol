import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const writeQueues = new Map();

export async function readJson(filePath) {
  const contents = await fs.readFile(filePath, "utf8");
  return JSON.parse(contents);
}

export function updateJsonArray(filePath, update) {
  const key = path.resolve(filePath);
  const previous = writeQueues.get(key) || Promise.resolve();
  const operation = previous.catch(() => {}).then(async () => {
    const current = await readJson(key);
    if (!Array.isArray(current)) throw new TypeError("Le fichier JSON doit contenir un tableau.");
    const next = await update(current);
    const temporaryPath = `${key}.${randomUUID()}.tmp`;
    try {
      await fs.writeFile(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
      await fs.rename(temporaryPath, key);
    } catch (error) {
      await fs.rm(temporaryPath, { force: true }).catch(() => {});
      throw error;
    }
    return next;
  });
  writeQueues.set(key, operation);
  return operation.finally(() => {
    if (writeQueues.get(key) === operation) writeQueues.delete(key);
  });
}
