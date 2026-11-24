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

  test("explains the observatory purpose and directs detailed number information to search", () => {
    const markup = renderDashboard();
    const text = markup.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

    expect(markup).toContain("container-fluid");
    expect(markup).toContain("Observatoire de la numérotation");
    expect(text).toMatch(/objectif de SpamPatrol.*principes de l’observatoire/i);
    expect(text).toMatch(/recherche.*informations détaillées sur la numérotation/i);
    expect(text).toMatch(/recherche permet de consulter les tranches.*à partir des données ARCEP\/MAJNUM/i);
    expect(text).not.toMatch(/pour présenter les tranches de numérotation/i);
    expect(markup).toContain("ARCEP/MAJNUM");
    expect(markup).toContain('href="/admin/search"');
    expect(text).toContain("Rechercher un numéro");
    expect(markup).toContain("Les statistiques de consultation ne sont pas encore disponibles");
  });

  test("states that official data, sources, and dates appear in search results, not on the dashboard", () => {
    const text = renderDashboard().replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

    expect(text).toMatch(/données officielles ARCEP\/MAJNUM.*sources.*dates disponibles.*résultats de recherche/i);
    expect(text).toMatch(/non directement sur ce tableau de bord/i);
  });

  test("does not present community content or unsupported numerical statistics", () => {
    const markup = renderDashboard();
    const text = markup.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

    expect(text).not.toMatch(/signalement|commentaire|top 10|export CSV|réplique|numéros les plus signalés/i);
    expect(text).not.toMatch(/\b\d+\b/);
    expect(text).toMatch(/statistiques de consultation ne sont pas encore disponibles/i);
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

  test("shows a count returned by the API with the snapshot source, dates, version, and method", async () => {
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
    expect(text).toContain("enregistrements de ressources ou de tranches");
    expect(text).toContain("ARCEP – MAJNUM");
    expect(container.querySelector('a[href="https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique"]')).not.toBeNull();
    expect(text).toContain("19/10/2026");
    expect(text).toContain("generation-test-123");
    expect(text).toContain("Méthode de calcul : Nombre d’objets de l’index MAJNUM préparé par l’application");
    expect(text).toContain("La date d’activation locale ne prouve pas une synchronisation");
    expect(text).not.toContain("20 931");
  });

  test("explains the count and its interpretation limits in accessible language", async () => {
    const text = await renderDashboardWithSummary({
      source: "ARCEP – MAJNUM", recordCount: 3, unit: "enregistrements de ressources ou de tranches",
    });

    expect(text).toContain("Que représente ce chiffre ?");
    expect(text).toContain("Une ressource ou une tranche correspond à une portion de numérotation");
    expect(text).toContain("À retenir : une ressource attribuée n’est pas nécessairement utilisée.");
    expect(text).toContain("Ce que ce chiffre ne représente pas");
    expect(text).toMatch(/ne mesure ni le nombre de personnes, d’abonnés, de lignes actives, d’appels, de numéros utilisés ou de clients d’un opérateur/i);
  });

  test("shows unavailable metadata and a clear state when the summary cannot be loaded", async () => {
    const availableText = await renderDashboardWithSummary({
      source: "ARCEP – MAJNUM", recordCount: 1, unit: "enregistrements de ressources ou de tranches",
      publishedDate: null, activatedAt: null, snapshotVersion: null,
    });
    expect(availableText).toContain("Publication associée : Non indiquée");
    expect(availableText).toContain("Activation locale : Non indiquée");
    expect(availableText).toContain("Non indiqué");

    act(() => root.unmount());
    root = null;
    container = document.createElement("div");
    root = createRoot(container);
    getArcepSummary.mockRejectedValue(new Error("API indisponible"));
    await act(async () => {
      root.render(<MemoryRouter><Dashboard /></MemoryRouter>);
    });
    expect(container.textContent).toContain("les données locales n’ont pas pu être vérifiées");
    expect(container.textContent).not.toContain("2 345");
  });
});
