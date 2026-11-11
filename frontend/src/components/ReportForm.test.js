import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
import ReportForm from "./ReportForm";
import { submitReport } from "services/api";

jest.mock("services/api", () => ({ submitReport: jest.fn() }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("ReportForm", () => {
  let container;
  let root;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      root = createRoot(container);
      root.render(<ReportForm />);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  function fillForm() {
    act(() => {
      [
        ["#report-number", "06 01 23 45 67"],
        ["#report-comment", "Appel suspect"],
      ].forEach(([selector, value]) => {
        const input = container.querySelector(selector);
        const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value").set;
        valueSetter.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
  }

  test("renders the report form inside the responsive Bootstrap container", () => {
    const markup = renderToStaticMarkup(<ReportForm />);

    expect(markup).toContain("container-fluid");
    expect(markup).toContain("Signaler un numéro");
    expect(markup).toContain("Envoyer le signalement");
  });

  test("shows confirmation after a successful save even when the response has no number field", async () => {
    fillForm();
    submitReport.mockResolvedValue({ id: "saved-report" });

    await act(async () => {
      container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await submitReport.mock.results[0].value;
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(submitReport).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[role="status"]')?.textContent).toBe("Votre signalement a bien été enregistré.");
    expect(container.querySelector("#report-number").value).toBe("");
    expect(container.querySelector("#report-comment").value).toBe("");
  });

  test("shows an explicit fallback error and re-enables the submit button", async () => {
    fillForm();
    submitReport.mockRejectedValue(new Error(""));

    await act(async () => {
      container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await Promise.resolve();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container.querySelector('[role="alert"]')?.textContent).toBe("Impossible d’enregistrer le signalement. Veuillez réessayer.");
    expect(container.querySelector('button[type="submit"]').disabled).toBe(false);
  });

  test("disables the button while saving and ignores duplicate submissions", async () => {
    fillForm();
    let resolveSave;
    submitReport.mockReturnValue(new Promise((resolve) => { resolveSave = resolve; }));

    act(() => container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    const button = container.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe("Envoi…");

    act(() => container.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    expect(submitReport).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSave({ number: "+33601234567" });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(button.disabled).toBe(false);
  });
});
