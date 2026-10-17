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
  return { baseUrl, logLines };
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

