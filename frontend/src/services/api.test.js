import { getArcepAllocation, getPrefix } from "./api";

describe("API client", () => {
  const originalFetch = global.fetch;
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { global.fetch = originalFetch; });

  test("recherche une attribution officielle avec le numéro encodé dans le chemin", async () => {
    const payload = { allocation: null, source: "ARCEP / MAJNUM" };
    global.fetch.mockResolvedValue({ ok: true, json: async () => payload });
    await expect(getArcepAllocation("06 01 23 45 67")).resolves.toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/arcep/lookup/06%2001%2023%2045%2067"), {});
  });

  test("consulte séparément le jeu local de préfixes", async () => {
    const payload = { prefixe: "0162", source: "Jeu local fourni avec SpamPatrol" };
    global.fetch.mockResolvedValue({ ok: true, json: async () => payload });
    await expect(getPrefix("06 01 23 45 67")).resolves.toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/prefixes/06%2001%2023%2045%2067"), {});
  });

  test("remonte le message de validation renvoyé par l’API", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: "Saisissez un numéro de téléphone français valide." }),
    });
    await expect(getArcepAllocation("invalide")).rejects.toThrow("Saisissez un numéro de téléphone français valide.");
  });

  test("présente une erreur explicite si l’API est injoignable", async () => {
    global.fetch.mockRejectedValue(new Error("connection refused"));
    await expect(getArcepAllocation("06 01 23 45 67")).rejects.toThrow("Impossible de joindre le serveur");
  });
});
