import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { createApp } from "../src/app.js";
import { parseSemicolonCsv, buildArcepIndex, findArcepRange } from "../src/utils/arcepCsv.js";
import { normalizeFrenchNumber } from "../src/utils/phoneNumber.js";

test("CSV parser handles ANSI accents, quoted semicolons, and leading zeroes", () => {
  const csv = Buffer.from([
    ...Buffer.from("EZABPQM;Mn"), 0xe9, ...Buffer.from("mo;Territoire\r\n0130;FRTE;\"M"),
    0xe9, ...Buffer.from("tropole; Corse\"\r\n"),
  ]);
  assert.deepEqual(parseSemicolonCsv(csv), [{ EZABPQM: "0130", Mnémo: "FRTE", Territoire: "Métropole; Corse" }]);
});

test("CSV parser rejects malformed column counts and unterminated quotes", () => {
  assert.throws(() => parseSemicolonCsv(Buffer.from("a;b\n1\n")), /nombre de colonnes/);
  assert.throws(() => parseSemicolonCsv(Buffer.from('a;b\n1;"bad')), /guillemet non fermé/);
});

test("index uses exact CE codes and range boundaries without approximate matching", () => {
  const { ranges, entityCount, mappedCount } = buildArcepIndex([
    { Tranche_Debut: "0600000000", Tranche_Fin: "0600000099", Mnémo: "ABCD", Territoire: "Métropole", Date_Attribution: "01/01/2020", EZABPQM: "06000" },
    { Tranche_Debut: "0610000000", Tranche_Fin: "0610000099", Mnémo: "MISS", Territoire: "Métropole", Date_Attribution: "01/01/2020", EZABPQM: "06100" },
  ], [{ CODE_OPERATEUR: "ABCD", IDENTITE_OPERATEUR: "Entité officielle" }]);
  assert.equal(entityCount, 1);
  assert.equal(mappedCount, 1);
  assert.equal(findArcepRange(ranges, "0600000099").entityName, "Entité officielle");
  assert.equal(findArcepRange(ranges, "0600000100"), null);
  assert.equal(findArcepRange(ranges, "0610000001").entityName, null);
});

test("downloaded ARCEP snapshots match their provenance hashes and active counts", async () => {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/data/arcep");
  const metadata = JSON.parse(await fs.readFile(path.join(projectRoot, "metadata.json"), "utf8"));
  const index = JSON.parse(await fs.readFile(path.join(projectRoot, metadata.indexFile), "utf8"));
  assert.equal(index.length, metadata.counts.allocations);
  for (const key of ["MAJNUM", "IDENTIFIANTS_CE"]) {
    const source = metadata.sources[key];
    const raw = await fs.readFile(path.join(projectRoot, source.rawFile));
    assert.equal(createHash("sha256").update(raw).digest("hex"), source.sha256);
  }
  assert.ok(metadata.counts.entities > 0);
  assert.equal(metadata.counts.exactEntityMatches, metadata.counts.allocations);

  const candidate = index.find((range) => normalizeFrenchNumber(range.start) && findArcepRange(index, range.start));
  assert.ok(candidate, "the official index contains at least one searchable French number range");
  const server = createServer(createApp({ dataDir: path.dirname(projectRoot) }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const urlNumber = encodeURIComponent(normalizeFrenchNumber(candidate.start));
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/arcep/lookup/${urlNumber}`);
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.allocation.rangeStart, candidate.start);
    assert.equal(result.updatedAt, metadata.sources.MAJNUM.publishedDate);

    const summaryResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/arcep/summary`);
    assert.equal(summaryResponse.status, 200);
    const summary = await summaryResponse.json();
    assert.equal(summary.recordCount, index.length);
    assert.equal(summary.recordCount, metadata.counts.allocations);
    assert.equal(summary.recordCount, metadata.sources.MAJNUM.rows);
    assert.equal(summary.source, "ARCEP – MAJNUM");
    assert.equal(summary.publishedDate, metadata.sources.MAJNUM.publishedDate);
    assert.equal(summary.activatedAt, metadata.activatedAt);
    assert.equal(summary.snapshotVersion, metadata.generation);
    assert.match(summary.unit, /enregistrements de ressources ou de tranches/);
    assert.equal("index" in summary, false, "the API must not send the full MAJNUM index");
    assert.equal("allocations" in summary, false, "the API returns only its summary");
    const distribution = summary.territoryDistribution;
    assert.equal(distribution.totalRecords, index.length);
    assert.match(distribution.method, /libellé exact de territoire/);
    assert.equal(distribution.entries.reduce((sum, entry) => sum + entry.count, 0), index.length);
    const expectedTerritories = new Map();
    for (const record of index) {
      const territory = typeof record.territory === "string" && record.territory.trim()
        ? record.territory : "Valeur absente ou vide";
      expectedTerritories.set(territory, (expectedTerritories.get(territory) || 0) + 1);
    }
    assert.deepEqual(
      Object.fromEntries(distribution.entries.map((entry) => [entry.label, entry.count])),
      Object.fromEntries(expectedTerritories),
    );
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test("ARCEP lookup is exact, reports no match, validates input, and survives absent data", async (t) => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "spampatrol-arcep-test-"));
  const dataDir = path.join(tempDir, "data");
  const arcepDir = path.join(dataDir, "arcep");
  const generationDir = path.join(arcepDir, "processed", "test");
  await fs.mkdir(generationDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, "prefixes.json"), JSON.stringify({ npv_officiels: [] }));
  await fs.writeFile(path.join(generationDir, "index.json"), JSON.stringify([
    { start: "0600000000", end: "0600000099", allocationCode: "ABCD", entityName: "Entité officielle", territory: "Métropole", allocationDate: "01/01/2020", resource: "06000" },
    { start: "0610000000", end: "0610000099", allocationCode: "ABCD", entityName: "Entité officielle", territory: "Métropole", allocationDate: "01/01/2020", resource: "06100" },
    { start: "0620000000", end: "0620000099", allocationCode: "ABCD", entityName: "Entité officielle", territory: "MÉTROPOLE", allocationDate: "01/01/2020", resource: "06200" },
    { start: "0630000000", end: "0630000099", allocationCode: "ABCD", entityName: "Entité officielle", territory: null, allocationDate: "01/01/2020", resource: "06300" },
    { start: "0640000000", end: "0640000099", allocationCode: "ABCD", entityName: "Entité officielle", allocationDate: "01/01/2020", resource: "06400" },
    { start: "0650000000", end: "0650000099", allocationCode: "ABCD", entityName: "Entité officielle", territory: 42, allocationDate: "01/01/2020", resource: "06500" },
    { start: "0660000000", end: "0660000099", allocationCode: "ABCD", entityName: "Entité officielle", territory: "   ", allocationDate: "01/01/2020", resource: "06600" },
  ]));
  const metadataPath = path.join(arcepDir, "metadata.json");
  const metadata = {
    generation: "test", indexFile: "processed/test/index.json", activatedAt: "2026-10-19T00:00:00.000Z",
    counts: { allocations: 7 },
    sources: { MAJNUM: { attribution: "Source ARCEP test", rows: 7, publishedDate: "2026-10-19", datasetUrl: "https://example.invalid/majnum" } },
    limits: ["Numéro porté non identifié."],
  };
  await fs.writeFile(metadataPath, JSON.stringify(metadata));
  const server = createServer(createApp({ dataDir }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/arcep/lookup/`;
  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  const found = await fetch(`${base}0600000099`);
  assert.equal(found.status, 200);
  assert.equal((await found.json()).allocation.entityName, "Entité officielle");
  const localPrefix = await fetch(`http://127.0.0.1:${server.address().port}/api/prefix/0600000099`);
  assert.equal(localPrefix.status, 404, "a local prefix miss is independent of an existing ARCEP allocation");
  const absent = await fetch(`${base}0600000100`);
  assert.equal((await absent.json()).allocation, null);
  assert.equal((await fetch(`${base}bad`)).status, 400);

  const summaryUrl = `http://127.0.0.1:${server.address().port}/api/arcep/summary`;
  const summaryResponse = await fetch(summaryUrl);
  assert.equal(summaryResponse.status, 200);
  const summary = await summaryResponse.json();
  assert.equal(summary.recordCount, 7);
  assert.equal(summary.publishedDate, "2026-10-19");
  assert.equal(summary.snapshotVersion, "test");
  assert.equal(summary.sourceUrl, "https://example.invalid/majnum");
  assert.equal(summary.territoryDistribution.totalRecords, 7);
  assert.match(summary.territoryDistribution.method, /valeurs absentes, vides ou invalides/);
  assert.deepEqual(
    Object.fromEntries(summary.territoryDistribution.entries.map((entry) => [entry.label, entry.count])),
    { "MÉTROPOLE": 1, "Métropole": 2, "Valeur absente ou vide": 3, "Valeur de territoire invalide": 1 },
  );
  assert.equal(summary.territoryDistribution.entries.find((entry) => entry.label === "Métropole").sharePercent, (2 / 7) * 100);
  assert.equal(summary.territoryDistribution.entries.reduce((sum, entry) => sum + entry.count, 0), summary.recordCount);

  metadata.counts.allocations = 8;
  await fs.writeFile(metadataPath, JSON.stringify(metadata));
  const inconsistent = await fetch(summaryUrl);
  assert.equal(inconsistent.status, 503);
  assert.match((await inconsistent.json()).message, /comptes locaux sont incohérents/);

  await fs.rm(metadataPath);
  assert.equal((await fetch(`${base}0600000001`)).status, 503);
  assert.equal((await fetch(summaryUrl)).status, 503);
});
