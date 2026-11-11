import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
import Search from "./Search";
import { getArcepAllocation, getPrefix, getReports } from "services/api";

jest.mock("services/api", () => ({
  getArcepAllocation: jest.fn(),
  getPrefix: jest.fn(),
  getReports: jest.fn(),
}));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("Search view", () => {
  let container;
  let root;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      root = createRoot(container);
      root.render(<Search />);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  async function search() {
    await act(async () => {
      container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  test("renders the existing responsive layout and search form", () => {
    const markup = renderToStaticMarkup(<Search />);

    expect(markup).toContain("container-fluid");
    expect(markup).toContain("Recherche de numéro");
    expect(markup).toContain("Numéro de téléphone");
  });

  test("shows every matching report category, comment, and date", async () => {
    getReports.mockResolvedValue({
      number: "+33601234567",
      frequency: 3,
      reports: [
        { id: "1", category: "Spam", comment: "Appel suspect", date: "2025-10-20" },
        { id: "2", category: "Spam", comment: "Test de persistance", date: "2026-11-11T12:22:53.186Z" },
        { id: "3", category: "Démarchage", comment: "Appel commercial", date: "2026-11-11T13:04:49.963Z" },
      ],
    });
    getArcepAllocation.mockResolvedValue({ allocation: null });
    getPrefix.mockRejectedValue(Object.assign(new Error("Aucun préfixe"), { status: 404 }));

    await search();

    expect(container.querySelectorAll("tbody tr")).toHaveLength(3);
    expect(container.textContent).toContain("3");
    expect(container.textContent).toContain("Appel suspect");
    expect(container.textContent).toContain("Test de persistance");
    expect(container.textContent).toContain("Appel commercial");
    expect(container.textContent).toContain("20/10/2025");
    expect(container.textContent).toContain("11/11/2026");
  });

  test("does not show a missing local prefix when an ARCEP allocation is available", async () => {
    getReports.mockResolvedValue({ number: "+33601234567", frequency: 0, reports: [] });
    getArcepAllocation.mockResolvedValue({
      allocation: {
        rangeStart: "0601200000",
        rangeEnd: "0601299999",
        allocationCode: "SFR0",
        entityName: "Société française du radiotéléphone",
        allocationDate: "08/12/2011",
        territory: "Métropole",
      },
      source: "ARCEP / MAJNUM",
      updatedAt: "2026-10-19",
      importedAt: "2026-10-19T15:35:37.769Z",
    });
    getPrefix.mockRejectedValue(Object.assign(new Error("Aucun préfixe local"), { status: 404 }));

    await search();

    expect(container.textContent).toContain("0601200000 – 0601299999");
    expect(container.textContent).toContain("Société française du radiotéléphone");
    expect(container.textContent).toContain("ARCEP / MAJNUM");
    expect(container.textContent).toContain("L’attribution d’une tranche ne permet pas d’identifier l’utilisateur final");
    expect(container.textContent).not.toContain("Aucune information de préfixe disponible dans le jeu local.");
  });

  test("shows the no-reports state and displays API errors", async () => {
    getReports.mockResolvedValue({ number: "+33600000000", frequency: 0, reports: [] });
    getArcepAllocation.mockResolvedValue({ allocation: null });
    getPrefix.mockRejectedValue(Object.assign(new Error("Aucun préfixe"), { status: 404 }));
    await search();
    expect(container.textContent).toContain("Aucun signalement disponible pour ce numéro.");
    expect(container.textContent).toContain("Les données ARCEP ne permettent pas d’identifier une attribution");
    expect(container.textContent).not.toContain("Aucune information de préfixe disponible dans le jeu local.");

    getReports.mockRejectedValue(new Error("Saisissez un numéro de téléphone français valide."));
    getArcepAllocation.mockRejectedValue(Object.assign(new Error("Numéro invalide"), { status: 400 }));
    getPrefix.mockRejectedValue(Object.assign(new Error("Numéro invalide"), { status: 400 }));
    await search();
    expect(container.textContent).toContain("Saisissez un numéro de téléphone français valide.");
    expect(container.textContent).toContain("Numéro invalide");

    getReports.mockResolvedValue({ number: "+33600000000", frequency: 0, reports: [] });
    getArcepAllocation.mockResolvedValue({ allocation: null });
    getPrefix.mockRejectedValue(Object.assign(new Error("Erreur serveur"), { status: 500 }));
    await search();
    expect(container.textContent).toContain("La recherche des préfixes locaux est momentanément indisponible.");
  });
});
