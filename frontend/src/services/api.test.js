import { getReports, submitReport } from "./api";

describe("API client", () => {
  const originalFetch = global.fetch;
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { global.fetch = originalFetch; });

  test("recherche avec le numéro encodé dans la query string", async () => {
    const payload = { number: "+33601234567", frequency: 0, reports: [] };
    global.fetch.mockResolvedValue({ ok: true, json: async () => payload });
    await expect(getReports("06 01 23 45 67")).resolves.toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/reports?number=06%2001%2023%2045%2067"), {});
  });

  test("envoie le signalement en JSON et remonte les erreurs de l'API", async () => {
    const report = { number: "0601234567", category: "Spam", comment: "Appel suspect" };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => report });
    await expect(submitReport(report)).resolves.toEqual(report);
    expect(global.fetch.mock.calls[0][1]).toMatchObject({ method: "POST", body: JSON.stringify(report) });

    global.fetch.mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({ message: "Numéro invalide" }) });
    await expect(submitReport(report)).rejects.toThrow("Numéro invalide");
  });
});
