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
import { normalizeFrenchNumber } from "../src/utils/reportSchema.js";

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
  await fs.writeFile(path.join(generationDir, "index.json"), JSON.stringify([
    { start: "0600000000", end: "0600000099", allocationCode: "ABCD", entityName: "Entité officielle", territory: "Métropole", allocationDate: "01/01/2020", resource: "06000" },
  ]));
  await fs.writeFile(path.join(arcepDir, "metadata.json"), JSON.stringify({
    generation: "test", indexFile: "processed/test/index.json", activatedAt: "2026-10-19T00:00:00.000Z",
    sources: { MAJNUM: { attribution: "Source ARCEP test" } }, limits: ["Numéro porté non identifié."],
  }));
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
  const absent = await fetch(`${base}0600000100`);
  assert.equal((await absent.json()).allocation, null);
  assert.equal((await fetch(`${base}bad`)).status, 400);

  await fs.rm(path.join(arcepDir, "metadata.json"));
  assert.equal((await fetch(`${base}0600000001`)).status, 503);
});
