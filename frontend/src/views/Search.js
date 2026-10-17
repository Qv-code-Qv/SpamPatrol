import React from "react";
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { getPrefix, getReports } from "services/api";

function Search() {
  const [number, setNumber] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [prefix, setPrefix] = React.useState(null);
  const [prefixMessage, setPrefixMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setResult(null);
    setPrefix(null);
    setError("");
    setPrefixMessage("");
    setLoading(true);
    try {
      const data = await getReports(number);
      setResult(data);
      try {
        setPrefix(await getPrefix(number));
      } catch (prefixError) {
        if (prefixError.status === 404) setPrefixMessage("Aucune information de préfixe disponible dans le jeu local.");
        else setPrefixMessage("La recherche des préfixes est momentanément indisponible.");
      }
    } catch (searchError) {
      setError(searchError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Recherche de numéro</Card.Title>
              <p className="card-category">Consultez les entrées disponibles dans le jeu local de SpamPatrol.</p>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row className="align-items-end">
                  <Col md="8">
                    <Form.Group controlId="search-number">
                      <Form.Label>Numéro de téléphone</Form.Label>
                      <Form.Control required type="tel" autoComplete="tel" maxLength={40} value={number} onChange={(event) => setNumber(event.target.value)} placeholder="06 12 34 56 78" />
                    </Form.Group>
                  </Col>
                  <Col md="4" className="mb-3">
                    <Button className="btn-fill" type="submit" variant="info" disabled={loading}>
                      {loading ? "Recherche…" : "Rechercher"}
                    </Button>
                  </Col>
                </Row>
              </Form>
              {error && <Alert variant="danger" role="alert">{error}</Alert>}
              {result && <Alert variant="warning">Ces entrées locales ne sont pas vérifiées et ne permettent pas d’établir la fiabilité d’un numéro.</Alert>}
              {result && (
                <>
                  <Row className="mt-3">
                    <Col md="6">
                      <p><strong>Numéro normalisé :</strong> {result.number}</p>
                      <p><strong>Signalements :</strong> {result.frequency}</p>
                    </Col>
                    <Col md="6">
                      {prefix ? <p><strong>Préfixe {prefix.prefixe} :</strong> {prefix.nature} — {prefix.zone}</p> : <p className="text-muted">{prefixMessage || "Aucune information de préfixe disponible."}</p>}
                    </Col>
                  </Row>
                  {result.reports.length === 0 ? (
                    <Alert variant="info" role="status">Aucun signalement disponible pour ce numéro.</Alert>
                  ) : (
                    <Table responsive hover className="mt-2">
                      <thead><tr><th>Catégorie</th><th>Commentaire</th><th>Date</th></tr></thead>
                      <tbody>{result.reports.map((report) => (
                        <tr key={report.id || `${report.number}-${report.date}-${report.comment}`}>
                          <td><Badge variant="info">{report.category}</Badge></td>
                          <td>{report.comment || <span className="text-muted">Aucun commentaire conservé</span>}</td>
                          <td>{report.date ? new Date(report.date).toLocaleDateString("fr-FR") : "—"}</td>
                        </tr>
                      ))}</tbody>
                    </Table>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Search;
