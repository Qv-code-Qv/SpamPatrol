import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Search from "./Search";

describe("Search view", () => {
  test("renders the existing responsive layout and search form", () => {
    const markup = renderToStaticMarkup(<Search />);

    expect(markup).toContain("container-fluid");
    expect(markup).toContain("Recherche de numéro");
    expect(markup).toContain("Numéro de téléphone");
  });
});
