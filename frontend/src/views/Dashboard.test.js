import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { getArcepSummary } from "services/api";
import Dashboard from "./Dashboard";

jest.mock("services/api", () => ({ getArcepSummary: jest.fn() }));

function formatShareForTest(value) {
  return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`;
}

describe("Dashboard observatory", () => {
  let container;
  let root;

  beforeAll(() => { global.IS_REACT_ACT_ENVIRONMENT = true; });
  afterAll(() => { delete global.IS_REACT_ACT_ENVIRONMENT; });

  afterEach(() => {
    if (root) act(() => root.unmount());
    root = null;
    container = null;
    getArcepSummary.mockReset();
  });

  function renderDashboard() {
    return renderToStaticMarkup(
      <MemoryRouter><Dashboard /></MemoryRouter>
    );
  }

  test("keeps the Dashboard structure, short copy, and number search link", () => {
    const markup = renderDashboard();
    const text = markup.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

    expect(markup).toContain("container-fluid");
    expect(markup.match(/col-lg-6/g)).toHaveLength(3);
    expect(markup.match(/col-xl-4/g)).toHaveLength(3);
    expect(markup).toContain("Observatoire de la numérotation");
    expect(markup).toContain("Ressources de numérotation recensées");
    expect(text).toMatch(/Comprendre les informations publiques sur la numérotation téléphonique/);
    expect(text).toContain("La recherche présente les informations disponibles sur un numéro.");
    expect(markup).toContain('href="/admin/search"');
    expect(text).toContain("Rechercher un numéro");
    expect(text).toContain("Les statistiques de consultation ne sont pas affichées.");
  });

  test("does not present community content or unsupported numerical statistics", () => {
    const markup = renderDashboard();
    const text = markup.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

    expect(text).not.toMatch(/signalement|commentaire|top 10|export CSV|réplique|numéros les plus signalés/i);
    expect(text).not.toMatch(/\b\d+\b/);
    expect(text).toMatch(/statistiques de consultation ne sont pas affichées/i);
    expect(markup).toContain('href="/admin/search"');
  });

  async function renderDashboardWithSummary(result) {
    container = document.createElement("div");
    root = createRoot(container);
    getArcepSummary.mockResolvedValue(result);
    await act(async () => {
      root.render(<MemoryRouter><Dashboard /></MemoryRouter>);
    });
    return container.textContent.replace(/\s+/g, " ");
  }

  test("shows the API total, source, and publication date without technical details", async () => {
    const text = await renderDashboardWithSummary({
      source: "ARCEP – MAJNUM",
      sourceUrl: "https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique",
      publishedDate: "2026-10-19",
      activatedAt: "2026-10-19T15:35:37.769Z",
      snapshotVersion: "generation-test-123",
      recordCount: 2345,
      unit: "enregistrements de ressources ou de tranches",
      method: "Nombre d’objets de l’index MAJNUM préparé par l’application, comparé aux deux nombres d’enregistrements indiqués dans les métadonnées.",
    });

    expect(getArcepSummary).toHaveBeenCalledTimes(1);
    expect(text).toContain("2 345");
    expect(text).toContain("Ressources ou tranches recensées.");
    expect(text).toContain("Données officielles de l’ARCEP");
    expect(container.querySelector('a[href="https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique"]')).not.toBeNull();
    expect(text).toContain("Publication : 19/10/2026");
    expect(text).toContain("Ce chiffre ne représente pas le nombre de lignes téléphoniques en service.");
    expect(text).not.toContain("generation-test-123");
    expect(text).not.toMatch(/MAJNUM|JSON|index|instantané|génération|SHA-?256|activation locale|méthode de calcul/i);
    expect(text).not.toContain("20 931");
  });

  test("renders the territory distribution with concise explanation, values, and limit", async () => {
    const text = await renderDashboardWithSummary({
      source: "ARCEP – MAJNUM",
      sourceUrl: "https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique",
      publishedDate: "2026-10-19",
      activatedAt: "2026-10-19T15:35:37.769Z",
      recordCount: 6,
      unit: "enregistrements de ressources ou de tranches",
      territoryDistribution: {
        totalRecords: 6,
        method: "Chaque enregistrement est regroupé sous son libellé exact de territoire.",
        entries: [
          { kind: "value", territory: "MÉTROPOLE", label: "MÉTROPOLE", count: 1, sharePercent: 100 / 6 },
          { kind: "value", territory: "Métropole", label: "Métropole", count: 2, sharePercent: 200 / 6 },
          { kind: "missing", territory: null, label: "Valeur absente ou vide", count: 2, sharePercent: 200 / 6 },
          { kind: "invalid", territory: null, label: "Valeur de territoire invalide", count: 1, sharePercent: 100 / 6 },
        ],
      },
    });

    expect(text).toContain("Répartition par territoire");
    expect(text).toContain("Part du total par territoire déclaré");
    expect(text).toContain("MÉTROPOLE");
    expect(text).toContain("Métropole");
    expect(text).toContain("Valeur absente ou vide");
    expect(text).toContain("Valeur de territoire invalide");
    expect(text).toContain("2 (33,33 %)");
    expect(text).toContain("1 (16,67 %)");
    expect(text).toContain("Total : 6 ressources recensées.");
    expect(text).toContain("À retenir : les libellés distincts restent séparés.");
    expect(text).toContain("Le territoire déclaré ne localise pas nécessairement l’appelant ou l’utilisateur.");
    expect(text).not.toMatch(/MAJNUM|JSON|index|instantané|génération|SHA-?256|méthode de calcul/i);
    expect(container.querySelectorAll(".progress-bar")).toHaveLength(4);
    expect([...container.querySelectorAll(".progress")].every((bar) => bar.style.height === "0.5rem")).toBe(true);
    expect(container.querySelectorAll("li.mb-2")).toHaveLength(4);
    expect(container.querySelector('a[href="https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique"]')).not.toBeNull();
  });

  test("renders allocation years newest first, collapses after five, and preserves counts and shares", async () => {
    const years = ["1999", "2005", "2010", "2015", "2018", "2020", "2023", "2024", "2025", "2026"];
    const entries = years.map((year, index) => ({
      kind: "year", year, label: year, count: index + 1, sharePercent: (index + 1) * 100 / 60,
    }));
    const expectedCountsAndShares = [...entries].reverse().map(({ year, count, sharePercent }) => [
      year,
      `${count} (${formatShareForTest(sharePercent)})`,
    ]);
    const text = await renderDashboardWithSummary({
      recordCount: 60,
      allocationYearDistribution: {
        totalRecords: 60,
        entries: [
          ...entries,
          { kind: "missing", year: null, label: "Date absente", count: 5, sharePercent: 5 * 100 / 60 },
        ],
      },
    });

    expect(text).toContain("Répartition par année d’attribution");
    expect(text).toContain("Ressources présentes dans les données actuelles, classées selon leur date d’attribution.");
    expect(text).toContain("Total : 60 ressources recensées.");
    const getVisibleYears = () => [...container.querySelectorAll('ul[aria-label="Effectifs par année d’attribution"] strong')]
      .map((label) => label.textContent);
    expect(getVisibleYears()).toEqual(["2026", "2025", "2024", "2023", "2020"]);
    const yearDetails = [...container.querySelectorAll("details")]
      .find((details) => details.querySelector("summary").textContent === "Afficher toutes les années");
    expect(yearDetails).toBeDefined();
    expect(yearDetails.open).toBe(false);
    expect(container.querySelector('ul[aria-label="Autres années d’attribution"]')).toBeNull();
    expect(container.textContent).toContain("10 (16,67 %)");
    expect(container.textContent).toContain("9 (15 %)");
    expect(container.querySelector('ul[aria-label="Dates d’attribution absentes ou invalides"] strong').textContent)
      .toBe("Date absente");

    await act(async () => {
      yearDetails.querySelector("summary").click();
    });
    expect(yearDetails.open).toBe(true);
    expect(yearDetails.querySelector("summary").textContent).toBe("Réduire");
    expect(container.querySelector('ul[aria-label="Autres années d’attribution"]')).not.toBeNull();
    expect(getVisibleYears().concat([...yearDetails.querySelectorAll('ul[aria-label="Autres années d’attribution"] strong')]
      .map((label) => label.textContent))).toEqual([...years].reverse());
    expect(container.textContent).toContain("Total : 60 ressources recensées.");
    expect([...container.querySelectorAll('ul[aria-label="Effectifs par année d’attribution"] li')]
      .concat([...yearDetails.querySelectorAll('ul[aria-label="Autres années d’attribution"] li')]).map((row) => {
      const year = row.querySelector("strong").textContent;
      return [year, row.querySelector("span").textContent];
    })).toEqual(expectedCountsAndShares);

    await act(async () => {
      yearDetails.querySelector("summary").click();
    });
    expect(yearDetails.open).toBe(false);
    expect(container.querySelector('ul[aria-label="Autres années d’attribution"]')).toBeNull();
    expect(getVisibleYears()).toEqual(["2026", "2025", "2024", "2023", "2020"]);
    expect(text).toContain("Date absente");
    expect(container.textContent).toContain("Ce graphique ne représente pas le nombre total d’attributions réalisées chaque année.");
    expect(container.textContent).not.toMatch(/historique|courbe de croissance/i);
    expect(container.querySelectorAll(".progress-bar")).toHaveLength(6);
    expect([...container.querySelectorAll(".progress")].every((bar) => bar.style.height === "0.5rem")).toBe(true);
  });

  test("does not show allocation years when the distribution total is inconsistent", async () => {
    const text = await renderDashboardWithSummary({
      recordCount: 2,
      allocationYearDistribution: {
        totalRecords: 1,
        entries: [{ kind: "year", year: "2020", label: "2020", count: 1, sharePercent: 100 }],
      },
    });

    expect(text).toContain("Répartition par année d’attribution");
    expect(text).toContain("La répartition est momentanément indisponible.");
    expect(text).not.toContain("2020");
  });

  test("renders raw allocation codes with totals and interpretation limits", async () => {
    const text = await renderDashboardWithSummary({
      source: "ARCEP – MAJNUM",
      sourceUrl: "https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique",
      publishedDate: "2026-10-19",
      recordCount: 7,
      unit: "enregistrements de ressources ou de tranches",
      allocationCodeDistribution: {
        totalRecords: 7,
        entries: [
          { kind: "value", code: "ABCD", label: "ABCD", count: 2, sharePercent: 200 / 7 },
          { kind: "value", code: "abcd", label: "abcd", count: 1, sharePercent: 100 / 7 },
          { kind: "value", code: "ZZZZ", label: "ZZZZ", count: 1, sharePercent: 100 / 7 },
          { kind: "missing", code: null, label: "Code absent", count: 1, sharePercent: 100 / 7 },
          { kind: "empty", code: null, label: "Code vide", count: 1, sharePercent: 100 / 7 },
          { kind: "invalid", code: null, label: "Code invalide", count: 1, sharePercent: 100 / 7 },
        ],
      },
    });

    expect(text).toContain("Répartition par code d’attribution");
    expect(text).toContain("Part du total par code d’attribution");
    expect(text).toContain("Total : 7 ressources recensées.");
    expect(text).toContain("ABCD");
    expect(text).toContain("abcd");
    expect(text).toContain("ZZZZ");
    expect(text).toContain("2 (28,57 %)");
    expect(text).toContain("Code absent");
    expect(text).toContain("Code vide");
    expect(text).toContain("Code invalide");
    expect(text).toContain("À retenir : un code décrit l’attribution, pas les abonnés, les parts de marché ni l’utilisation réelle.");
    expect(text).toContain("Un code ne garantit pas l’opérateur actuel après portabilité.");
    expect(text).not.toMatch(/opérateur le plus important|classement des opérateurs|catégorie de fraude|démarchage|danger/i);
    expect(container.querySelectorAll(".progress-bar")).toHaveLength(6);
    expect([...container.querySelectorAll(".progress")].every((bar) => bar.style.height === "0.5rem")).toBe(true);
    expect(container.querySelectorAll("li.mb-2")).toHaveLength(6);
    expect(container.querySelector('a[href="https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique"]')).not.toBeNull();
  });

  test("keeps every code available while initially showing only the ten largest groups", async () => {
    const entries = Array.from({ length: 12 }, (_, index) => {
      const code = `CODE${String(index).padStart(2, "0")}`;
      return { kind: "value", code, label: code, count: 1, sharePercent: 100 / 12 };
    });
    const text = await renderDashboardWithSummary({
      recordCount: 12,
      allocationCodeDistribution: { totalRecords: 12, entries },
    });

    expect(text).toContain("Afficher les 2 autres codes");
    expect(container.querySelector("details").open).toBe(false);
    expect(container.querySelectorAll(".progress-bar")).toHaveLength(12);
    expect(text).toContain("CODE10");
    expect(text).toContain("CODE11");
  });

  test("does not show a territory chart when the API distribution total is inconsistent", async () => {
    const text = await renderDashboardWithSummary({
      source: "ARCEP – MAJNUM", recordCount: 2, unit: "enregistrements de ressources ou de tranches",
      territoryDistribution: { totalRecords: 1, entries: [{ label: "Métropole", count: 1, sharePercent: 100 }] },
    });

    expect(text).toContain("La répartition est momentanément indisponible.");
    expect(container.querySelectorAll(".progress-bar")).toHaveLength(0);
  });

  test("does not show the allocation-code chart when its total is inconsistent", async () => {
    const text = await renderDashboardWithSummary({
      recordCount: 2,
      allocationCodeDistribution: {
        totalRecords: 1,
        entries: [{ kind: "value", code: "ABCD", label: "ABCD", count: 1, sharePercent: 100 }],
      },
    });

    expect(text).toContain("Répartition par code d’attribution");
    expect(text).toContain("La répartition est momentanément indisponible.");
    expect(text).not.toContain("ABCD");
    expect(container.querySelectorAll(".progress-bar")).toHaveLength(0);
  });

  test("shows an unavailable publication date and a short error when data cannot be loaded", async () => {
    const availableText = await renderDashboardWithSummary({
      source: "ARCEP – MAJNUM", recordCount: 1, unit: "enregistrements de ressources ou de tranches",
      publishedDate: null, activatedAt: null, snapshotVersion: null,
    });
    expect(availableText).toContain("Publication : Non indiquée");

    act(() => root.unmount());
    root = null;
    container = document.createElement("div");
    root = createRoot(container);
    getArcepSummary.mockRejectedValue(new Error("API indisponible"));
    await act(async () => {
      root.render(<MemoryRouter><Dashboard /></MemoryRouter>);
    });
    expect(container.textContent).toContain("Les données officielles ne sont pas disponibles pour le moment.");
    expect(container.textContent).toContain("Ce graphique est indisponible pour le moment.");
    expect(container.textContent).not.toContain("2 345");
  });
});
