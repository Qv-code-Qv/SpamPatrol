import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
import Search from "./Search";
import { getArcepAllocation, getPrefix } from "services/api";

jest.mock("services/api", () => ({
  getArcepAllocation: jest.fn(),
  getPrefix: jest.fn(),
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

  function setNumber(value = "06 01 23 45 67") {
    act(() => {
      const input = container.querySelector("#search-number");
      const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value").set;
      valueSetter.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

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
    expect(markup).toContain("Numéro de téléphone français");
  });

  test("shows official allocation provenance and keeps local prefixes distinct", async () => {
    setNumber();
    getArcepAllocation.mockResolvedValue({
      number: "+33601234567",
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
    getPrefix.mockResolvedValue({
      prefixe: "0162",
      nature: "Géographique",
      zone: "Île-de-France",
      source: "Jeu local fourni avec SpamPatrol",
    });

    await search();

    expect(getArcepAllocation).toHaveBeenCalledWith("06 01 23 45 67");
    expect(getPrefix).toHaveBeenCalledWith("06 01 23 45 67");
    expect(container.textContent).toContain("0601200000 – 0601299999");
    expect(container.textContent).toContain("Société française du radiotéléphone");
    expect(container.textContent).toContain("ARCEP / MAJNUM");
    expect(container.textContent).toContain("index importé le");
    expect(container.textContent).toContain("Jeu local de préfixes");
    expect(container.textContent).toContain("Distinct des données officielles MAJNUM");
    expect(container.textContent).toContain("provenance externe de ce jeu n’est pas documentée");
    expect(container.textContent).toContain("L’attribution d’une tranche ne permet pas d’identifier l’utilisateur final");
    expect(container.textContent).not.toMatch(/signalement|commentaire|export CSV|fraude/i);
  });

  test("shows an official no-match separately from a missing local prefix", async () => {
    setNumber("09 47 50 00 01");
    getArcepAllocation.mockResolvedValue({ number: "+33947500001", allocation: null });
    getPrefix.mockRejectedValue(Object.assign(new Error("Aucun préfixe local"), { status: 404 }));

    await search();

    expect(container.textContent).toContain("Les données ARCEP/MAJNUM ne permettent pas d’identifier une attribution");
    expect(container.textContent).toContain("Aucune correspondance dans ce jeu local");
    expect(container.textContent).toContain("Cela ne préjuge pas du résultat du référentiel officiel");
  });

  test("shows official API and local prefix errors distinctly", async () => {
    setNumber();
    getArcepAllocation.mockRejectedValue(new Error("Les données ARCEP sont momentanément indisponibles."));
    getPrefix.mockRejectedValue(Object.assign(new Error("Erreur serveur"), { status: 500 }));

    await search();

    expect(container.textContent).toContain("Les données ARCEP sont momentanément indisponibles.");
    expect(container.textContent).toContain("La consultation du jeu local de préfixes est momentanément indisponible.");
  });

  test("disables the submit button during a search", async () => {
    setNumber();
    let resolveArcep;
    let resolvePrefix;
    getArcepAllocation.mockReturnValue(new Promise((resolve) => { resolveArcep = resolve; }));
    getPrefix.mockReturnValue(new Promise((resolve) => { resolvePrefix = resolve; }));

    act(() => container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    const button = container.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain("Recherche");

    await act(async () => {
      resolveArcep({ allocation: null });
      resolvePrefix({ prefixe: "0162", nature: "Géographique", zone: "Île-de-France" });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(button.disabled).toBe(false);
  });
});
