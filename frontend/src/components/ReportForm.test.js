import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReportForm from "./ReportForm";

describe("ReportForm", () => {
  test("renders the report form inside the responsive Bootstrap container", () => {
    const markup = renderToStaticMarkup(<ReportForm />);

    expect(markup).toContain("container-fluid");
    expect(markup).toContain("Signaler un numéro");
    expect(markup).toContain("Envoyer le signalement");
  });
});
