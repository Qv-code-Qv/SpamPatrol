const CSV_FIELDS = ["number", "category", "comment", "date"];

function escapeCsv(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function reportsToCsv(reports) {
  const header = CSV_FIELDS.map(escapeCsv).join(";");
  const rows = reports.map((report) =>
    CSV_FIELDS.map((field) => escapeCsv(report[field])).join(";")
  );
  return `\uFEFF${[header, ...rows].join("\r\n")}\r\n`;
}
