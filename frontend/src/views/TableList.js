import React from "react";
import { Alert, Badge, Button, Card, Container, Table } from "react-bootstrap";
import { downloadCsv, getReports } from "services/api";

function TableList() {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    getReports()
      .then(setReports)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleExport() {
    setError("");
    setExporting(true);
    try { await downloadCsv(); }
    catch (exportError) { setError(exportError.message); }
    finally { setExporting(false); }
  }

  return (
    <Container fluid>
      <Card className="strpied-tabled-with-hover">
        <Card.Header className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <Card.Title as="h4">Signalements communautaires</Card.Title>
            <p className="card-category">{reports.length} entrée(s) interprétable(s) dans le jeu local non vérifié.</p>
          </div>
          <Button className="btn-fill" variant="info" disabled={exporting || loading || reports.length === 0} onClick={handleExport}>
            {exporting ? "Préparation…" : "Exporter en CSV"}
          </Button>
        </Card.Header>
        <Card.Body className="table-full-width table-responsive px-0">
          {error && <Alert className="mx-3" variant="danger" role="alert">{error}</Alert>}
          {loading ? <p className="px-3">Chargement des signalements…</p> : reports.length === 0 ? <Alert className="mx-3" variant="info">Aucun signalement disponible.</Alert> : (
            <Table className="table-hover table-striped" responsive>
              <thead><tr><th>Numéro</th><th>Catégorie</th><th>Commentaire</th><th>Date</th></tr></thead>
              <tbody>{reports.map((report) => (
                <tr key={report.id || `${report.number}-${report.date}-${report.comment}`}>
                  <td>{report.number}</td>
                  <td><Badge variant="info">{report.category}</Badge></td>
                  <td>{report.comment || <span className="text-muted">—</span>}</td>
                  <td>{report.date ? new Date(report.date).toLocaleDateString("fr-FR") : "—"}</td>
                </tr>
              ))}</tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TableList;
