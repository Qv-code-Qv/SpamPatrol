import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { getArcepSummary } from "services/api";
import Dashboard from "./Dashboard";

jest.mock("services/api", () => ({ getArcepSummary: jest.fn() }));

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
    expect(text).toContain("Part des ressources recensées pour chaque territoire déclaré");
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
    expect(container.querySelector('a[href="https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique"]')).not.toBeNull();
  });

  test("does not show a territory chart when the API distribution total is inconsistent", async () => {
    const text = await renderDashboardWithSummary({
      source: "ARCEP – MAJNUM", recordCount: 2, unit: "enregistrements de ressources ou de tranches",
      territoryDistribution: { totalRecords: 1, entries: [{ label: "Métropole", count: 1, sharePercent: 100 }] },
    });

    expect(text).toContain("La répartition est momentanément indisponible.");
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
    expect(container.textContent).not.toContain("2 345");
  });
});
