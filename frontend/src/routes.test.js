import routes from "./routes";

test("application navigation contains only the observatory and official number search", () => {
  expect(routes.map(({ path, name }) => ({ path, name }))).toEqual([
    { path: "/dashboard", name: "Observatoire" },
    { path: "/search", name: "Recherche de numéro" },
  ]);
  expect(routes.some(({ path }) => ["/report", "/table", "/maps", "/user"].includes(path))).toBe(false);
});
