import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

describe("Dashboard observatory", () => {
  test("keeps the template layout and links to the official number search", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter><Dashboard /></MemoryRouter>
    );

    expect(markup).toContain("container-fluid");
    expect(markup).toContain("Observatoire de la numérotation");
    expect(markup).toContain("ARCEP/MAJNUM");
    expect(markup).toContain('href="/admin/search"');
    expect(markup).toContain("Les statistiques de consultation ne sont pas encore disponibles");
  });

  test("does not present community data or invented statistics", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter><Dashboard /></MemoryRouter>
    );

    expect(markup).not.toMatch(/signalement|commentaire|top 10|export CSV|réplique|numéros les plus signalés/i);
    expect(markup.replace(/<[^>]*>/g, " ")).not.toMatch(/\b\d+\b/);
  });
});
