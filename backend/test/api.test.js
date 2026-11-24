import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createServer } from "node:http";
import { once } from "node:events";
import { createApp } from "../src/app.js";

const prefixes = {
  npv_officiels: [
    { prefixe: "063998", zone: "fiction", nature: "audiovisuel" },
    { prefixe: "0639980", zone: "fiction", nature: "audiovisuel" },
  ],
};

async function startApi(t, { logLines = [] } = {}) {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "spampatrol-test-"));
  await fs.writeFile(path.join(dataDir, "prefixes.json"), JSON.stringify(prefixes), "utf8");
  const logStream = { write(line) { logLines.push(String(line)); return true; } };
  const server = createServer(createApp({ dataDir, logStream }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(dataDir, { recursive: true, force: true });
  });
  return { baseUrl, dataDir, logLines };
}

async function snapshotFiles(root, relative = "") {
  const entries = await fs.readdir(path.join(root, relative), { withFileTypes: true });
  const snapshot = {};
  for (const entry of entries) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) Object.assign(snapshot, await snapshotFiles(root, child));
    else if (entry.isFile()) snapshot[child.split(path.sep).join("/")] = await fs.readFile(path.join(root, child), "utf8");
  }
  return snapshot;
}

test("health check responds and unknown routes return 404", async (t) => {
  const { baseUrl } = await startApi(t);
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  const missing = await fetch(`${baseUrl}/api/unknown`);
  assert.equal(missing.status, 404);
  assert.match((await missing.json()).message, /Route API inconnue/);
});

test("the backend start entry point listens and serves its health check", async (t) => {
  const previousPort = process.env.PORT;
  process.env.PORT = "0";
  let started;
  try { started = await import("../src/server.js?startup-test"); }
  finally {
    if (previousPort === undefined) delete process.env.PORT;
    else process.env.PORT = previousPort;
  }
  const { server } = started;
  if (!server.listening) await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  const host = address.address.includes(":") ? `[${address.address}]` : address.address;
  const response = await fetch(`http://${host}:${address.port}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test("local prefix lookup uses the longest match and handles absence", async (t) => {
  const { baseUrl } = await startApi(t);
  const fictionRoot = prefixes.npv_officiels[0].prefixe;
  const fictionNumber = `${fictionRoot}${"0".repeat(10 - fictionRoot.length)}`;
  const match = await fetch(`${baseUrl}/api/prefixes/${encodeURIComponent(fictionNumber)}`);
  assert.equal(match.status, 200);
  assert.equal((await match.json()).prefixe, prefixes.npv_officiels[1].prefixe);

  const unmatchedRoot = "026191";
  const unmatchedNumber = `${unmatchedRoot}${"0".repeat(10 - unmatchedRoot.length)}`;
  assert.equal((await fetch(`${baseUrl}/api/prefixes/${encodeURIComponent(unmatchedNumber)}`)).status, 404);
  assert.equal((await fetch(`${baseUrl}/api/prefix/invalid`)).status, 400);
});

test("community and retired auxiliary routes are absent", async (t) => {
  const { baseUrl } = await startApi(t);
  const removedRoutes = [
    ["GET", "/api/reports"], ["POST", "/api/reports"],
    ["GET", "/api/stats"], ["GET", "/api/export-csv"],
    ["POST", "/api/analyse"], ["GET", "/api/repliques"],
  ];
  for (const [method, route] of removedRoutes) {
    const response = await fetch(`${baseUrl}${route}`, { method });
    assert.equal(response.status, 404, `${method} ${route} should not be mounted`);
  }
});

test("CORS allows local development origins and rejects unrelated browser origins", async (t) => {
  const { baseUrl } = await startApi(t);
  const local = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "http://localhost:3000" } });
  assert.equal(local.headers.get("access-control-allow-origin"), "http://localhost:3000");
  assert.equal(local.headers.get("access-control-allow-credentials"), null);
  const unrelated = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "https://example.invalid" } });
  assert.equal(unrelated.headers.get("access-control-allow-origin"), null);
});

test("JSON request limits and malformed JSON handling remain active", async (t) => {
  const { baseUrl } = await startApi(t);
  const malformed = await fetch(`${baseUrl}/api/unknown`, {
    method: "POST", headers: { "content-type": "application/json" }, body: "{",
  });
  assert.equal(malformed.status, 400);
  const oversized = await fetch(`${baseUrl}/api/unknown`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: "x".repeat(20_000) }),
  });
  assert.equal(oversized.status, 413);
});

test("HTTP access logs retain diagnostics without URL, client IP, or search path", async (t) => {
  const { baseUrl, logLines } = await startApi(t);
  const response = await fetch(`${baseUrl}/api/arcep/lookup/private-search-marker`);
  await response.text();
  const logs = logLines.join(" ");
  assert.ok(logLines.length >= 1);
  assert.match(logs, /GET/);
  assert.match(logs, /\d{3}/);
  assert.doesNotMatch(logs, /private-search-marker|127\.0\.0\.1/);
});

test("number searches do not persist their input or expose it in HTTP/error logs or error responses", async (t) => {
  const { baseUrl, dataDir, logLines } = await startApi(t);
  const number = "0600000001";
  const normalizedNumber = "+33600000001";
  const prefixesPath = path.join(dataDir, "prefixes.json");
  const prefixData = JSON.parse(await fs.readFile(prefixesPath, "utf8"));
  prefixData.npv_officiels.push({ prefixe: "0600000", zone: "test", nature: "test" });
  await fs.writeFile(prefixesPath, JSON.stringify(prefixData), "utf8");

  const arcepDir = path.join(dataDir, "arcep");
  const generationDir = path.join(arcepDir, "processed", "privacy-test");
  await fs.mkdir(generationDir, { recursive: true });
  await fs.writeFile(path.join(generationDir, "index.json"), JSON.stringify([
    { start: "0600000000", end: "0600000099", allocationCode: "TEST", entityName: "Test", territory: "Métropole", allocationDate: "01/01/2020", resource: "06000" },
  ]));
  await fs.writeFile(path.join(arcepDir, "metadata.json"), JSON.stringify({
    generation: "privacy-test",
    indexFile: "processed/privacy-test/index.json",
    sources: { MAJNUM: { attribution: "Source ARCEP de test", publishedDate: "2026-01-01" } },
    activatedAt: "2026-01-01T00:00:00.000Z",
    limits: [],
  }));

  const filesBeforeSearch = await snapshotFiles(dataDir);
  const initialDataContents = Object.values(filesBeforeSearch).join("\n");
  assert.equal(initialDataContents.includes(number), false);
  assert.equal(initialDataContents.includes(normalizedNumber), false);
  const arcepResponse = await fetch(`${baseUrl}/api/arcep/lookup/${number}`);
  assert.equal(arcepResponse.status, 200);
  assert.equal((await arcepResponse.json()).allocation.rangeStart, "0600000000");
  const prefixResponse = await fetch(`${baseUrl}/api/prefixes/${number}`);
  assert.equal(prefixResponse.status, 200);
  assert.equal((await prefixResponse.json()).prefixe, "0600000");
  assert.deepEqual(await snapshotFiles(dataDir), filesBeforeSearch);

  const arcepIndexPath = path.join(generationDir, "index.json");
  const metadataPath = path.join(arcepDir, "metadata.json");
  await fs.writeFile(arcepIndexPath, JSON.stringify({ invalid: true }), "utf8");
  const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));
  metadata.generation = "privacy-test-error";
  await fs.writeFile(metadataPath, JSON.stringify(metadata), "utf8");
  await fs.writeFile(prefixesPath, "{ invalid JSON", "utf8");
  const filesBeforeErrors = await snapshotFiles(dataDir);

  const originalConsoleError = console.error;
  const errorLines = [];
  console.error = (...args) => errorLines.push(args.map(String).join(" "));
  let arcepError;
  let prefixError;
  try {
    arcepError = await fetch(`${baseUrl}/api/arcep/lookup/${number}`);
    prefixError = await fetch(`${baseUrl}/api/prefixes/${number}`);
  } finally {
    console.error = originalConsoleError;
  }

  for (const response of [arcepError, prefixError]) {
    assert.equal(response.status, 500);
    const message = await response.text();
    assert.doesNotMatch(message, new RegExp(number));
    assert.doesNotMatch(message, new RegExp(normalizedNumber.replace("+", "\\+")));
  }
  assert.ok(errorLines.length >= 2);
  const combinedLogs = [...logLines, ...errorLines].join(" ");
  assert.doesNotMatch(combinedLogs, new RegExp(number));
  assert.doesNotMatch(combinedLogs, new RegExp(normalizedNumber.replace("+", "\\+")));
  assert.deepEqual(await snapshotFiles(dataDir), filesBeforeErrors);
});
