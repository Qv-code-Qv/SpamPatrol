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
    { prefixe: "0162", zone: "Île-de-France", nature: "Géographique vérifié" },
    { prefixe: "09475", zone: "Guadeloupe", nature: "Outre-mer vérifié" },
    { prefixe: "0947", zone: "National", nature: "Non géographique" },
  ],
};

async function startApi(t, initialReports = [], { withReports = true, submissionLimit = 10 } = {}) {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "spampatrol-test-"));
  if (withReports) await fs.writeFile(path.join(dataDir, "reports.json"), JSON.stringify(initialReports), "utf8");
  await fs.writeFile(path.join(dataDir, "prefixes.json"), JSON.stringify(prefixes), "utf8");
  await fs.writeFile(path.join(dataDir, "repliques.json"), JSON.stringify(["Je ne suis pas intéressé."]), "utf8");
  const server = createServer(createApp({ dataDir, submissionLimit }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(dataDir, { recursive: true, force: true });
  });
  return { baseUrl, dataDir };
}

const validReport = { number: "06 01 23 45 67", category: "Spam", comment: "Appel suspect" };

test("health check responds and preserves the local API contract", async (t) => {
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

test("report submission validates fields and stores normalized numbers", async (t) => {
  const rawRecords = [
    { number: "0601234567", category: "Spam", comment: "Appel suspect", date: "2025-10-20" },
    { query: '{"number":"0612345678","category":"Démarchage","comment":"Appel commercial"}', date: "2025-11-02" },
    { query: "query IntrospectionQuery { __schema { types { name } }", date: "2025-11-02" },
  ];
  const { baseUrl, dataDir } = await startApi(t, rawRecords);
  for (const input of [
    { ...validReport, number: "abc" },
    { ...validReport, category: "Autre" },
    { ...validReport, comment: "x" },
    { ...validReport, comment: "x".repeat(501) },
  ]) {
    const response = await fetch(`${baseUrl}/api/reports`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input),
    });
    assert.equal(response.status, 400);
    assert.equal(typeof (await response.json()).message, "string");
  }
  const responses = await Promise.all(["0611223344", "+33611223345"].map((number) =>
    fetch(`${baseUrl}/api/reports`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...validReport, number }),
    })
  ));
  assert.deepEqual(responses.map((response) => response.status), [201, 201]);
  const saved = JSON.parse(await fs.readFile(path.join(dataDir, "reports.json"), "utf8"));
  assert.equal(saved.length, 5);
  assert.deepEqual(saved.slice(0, 3), rawRecords, "legacy raw records are preserved as unchanged objects");
  assert.equal(saved[3].number, "+33611223344");
});

test("search returns matching comments and normalized report frequency", async (t) => {
  const { baseUrl } = await startApi(t, [
    { number: "0601234567", category: "Spam", comment: "Appel suspect", date: "2025-10-20" },
    { query: '{"number":"0601234567","category":"Démarchage","comment":"Rappel fréquent"}', date: "2025-11-02" },
    { query: "query IntrospectionQuery { __schema { types { name } }" },
  ]);
  const response = await fetch(`${baseUrl}/api/reports?number=${encodeURIComponent("06 01 23 45 67")}`);
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.frequency, 2);
  assert.deepEqual(result.reports.map((report) => report.comment), ["Appel suspect", "Rappel fréquent"]);
  assert.equal((await fetch(`${baseUrl}/api/reports?number=bad`)).status, 400);
});

test("prefix lookup uses the longest matching prefix and handles absence", async (t) => {
  const { baseUrl } = await startApi(t);
  const response = await fetch(`${baseUrl}/api/prefixes/${encodeURIComponent("0947512345")}`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).prefixe, "09475");
  assert.equal((await fetch(`${baseUrl}/api/prefixes/${encodeURIComponent("0612345678")}`)).status, 404);
});

test("statistics use only readable reports and return an empty state", async (t) => {
  const { baseUrl } = await startApi(t, [
    { number: "0601234567", category: "Spam", comment: "A" },
    { number: "0601234567", category: "Spam", comment: "B" },
    { query: "query IntrospectionQuery { __schema { types { name } }" },
  ]);
  const response = await fetch(`${baseUrl}/api/stats`);
  const stats = await response.json();
  assert.equal(stats.totalReports, 2);
  assert.equal(stats.topNumbers[0].count, 2);
  const empty = await startApi(t);
  assert.deepEqual(await (await fetch(`${empty.baseUrl}/api/stats`)).json(), { totalReports: 0, uniqueNumbers: 0, topCategories: [], topNumbers: [] });
});

test("CSV export includes UTF-8 BOM, download headers and escaped content", async (t) => {
  const { baseUrl } = await startApi(t, [{ number: "0601234567", category: "Spam", comment: 'Il a dit "non"; puis raccroché', date: "2025-10-20" }]);
  const response = await fetch(`${baseUrl}/api/export-csv`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/csv; charset=utf-8/);
  assert.match(response.headers.get("content-disposition"), /attachment/);
  const csvBytes = Buffer.from(await response.arrayBuffer());
  assert.deepEqual([...csvBytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
  const csv = csvBytes.toString("utf8");
  assert.match(csv, /"Il a dit ""non""; puis raccroché"/);
});

test("invalid and missing JSON files produce controlled API errors", async (t) => {
  const missing = await startApi(t, [], { withReports: false });
  const absentResponse = await fetch(`${missing.baseUrl}/api/reports`);
  assert.equal(absentResponse.status, 500);
  assert.equal(typeof (await absentResponse.json()).message, "string");
  const invalid = await startApi(t);
  await fs.writeFile(path.join(invalid.dataDir, "reports.json"), "not-json", "utf8");
  assert.equal((await fetch(`${invalid.baseUrl}/api/stats`)).status, 500);
});

test("analysis is validated and explicitly identified as a local simulation", async (t) => {
  const { baseUrl } = await startApi(t);
  const invalid = await fetch(`${baseUrl}/api/analyse`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ number: "06", message: "Bonjour" }) });
  assert.equal(invalid.status, 400);
  const response = await fetch(`${baseUrl}/api/analyse`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ number: "0601234567", message: "Appel répété au sujet d’un contrat" }),
  });
  const result = await response.json();
  assert.equal(result.mode, "simulation");
  assert.equal(result.category, null);
  assert.equal(result.score, null);
  assert.match(result.disclaimer, /Aucune IA/);
});

test("large request bodies are rejected with HTTP 413", async (t) => {
  const { baseUrl } = await startApi(t);
  const response = await fetch(`${baseUrl}/api/reports`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: "x".repeat(20_000) }),
  });
  assert.equal(response.status, 413);
});

test("CORS allows local development origins and rejects unrelated browser origins", async (t) => {
  const { baseUrl } = await startApi(t);
  const local = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "http://localhost:3000" } });
  assert.equal(local.headers.get("access-control-allow-origin"), "http://localhost:3000");
  assert.equal(local.headers.get("access-control-allow-credentials"), null);
  const unrelated = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "https://example.invalid" } });
  assert.equal(unrelated.headers.get("access-control-allow-origin"), null);
});

test("CSV export reports an empty dataset without generating a fake file", async (t) => {
  const { baseUrl } = await startApi(t);
  const response = await fetch(`${baseUrl}/api/export-csv`);
  assert.equal(response.status, 404);
  assert.match((await response.json()).message, /Aucun signalement/);
});

test("submission rate limit rejects repeated requests", async (t) => {
  const { baseUrl } = await startApi(t, [], { submissionLimit: 2 });
  const send = (number) => fetch(`${baseUrl}/api/reports`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...validReport, number }),
  });
  assert.equal((await send("0601234567")).status, 201);
  assert.equal((await send("0601234568")).status, 201);
  const limited = await send("0601234569");
  assert.equal(limited.status, 429);
  assert.match((await limited.json()).message, /Trop de signalements/);
});
