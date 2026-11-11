import React from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { getArcepAllocation, getPrefix } from "services/api";

function formatDate(value, fallback) {
  return value ? new Date(value).toLocaleDateString("fr-FR") : fallback;
}

function Search() {
  const [number, setNumber] = React.useState("");
  const [arcep, setArcep] = React.useState(null);
  const [arcepError, setArcepError] = React.useState("");
  const [prefix, setPrefix] = React.useState(null);
  const [prefixError, setPrefixError] = React.useState("");
  const [prefixMissing, setPrefixMissing] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setArcep(null);
    setArcepError("");
    setPrefix(null);
    setPrefixError("");
    setPrefixMissing(false);
    setSearched(false);
    setLoading(true);

    const [arcepResult, prefixResult] = await Promise.allSettled([
      getArcepAllocation(number),
      getPrefix(number),
    ]);

    if (arcepResult.status === "fulfilled") setArcep(arcepResult.value);
    else setArcepError(arcepResult.reason?.message || "Les données ARCEP sont momentanément indisponibles.");

    if (prefixResult.status === "fulfilled") setPrefix(prefixResult.value);
    else if (prefixResult.reason?.status === 404) setPrefixMissing(true);
    else if (prefixResult.reason?.status !== 400) {
      setPrefixError("La consultation du jeu local de préfixes est momentanément indisponible.");
    }

    setSearched(true);
    setLoading(false);
  }

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Recherche de numéro</Card.Title>
              <p className="card-category mb-0">
                Consultez les informations disponibles dans les référentiels de numérotation.
              </p>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row className="align-items-end">
                  <Col md="8">
                    <Form.Group controlId="search-number">
                      <Form.Label>Numéro de téléphone français</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        autoComplete="tel"
                        maxLength={40}
                        value={number}
                        onChange={(event) => setNumber(event.target.value)}
                        placeholder="06 12 34 56 78"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="4" className="mb-3">
                    <Button className="btn-fill" type="submit" variant="info" disabled={loading}>
                      {loading ? "Recherche…" : "Rechercher"}
                    </Button>
                  </Col>
                </Row>
              </Form>
              <p className="text-muted mb-0">
                La recherche consulte les référentiels sans conserver de journal de recherche dans l’application.
              </p>

              {searched && (
                <Row className="mt-3">
                  <Col md="8">
                    <Card>
                      <Card.Header>
                        <Card.Title as="h5">Référentiel officiel ARCEP / MAJNUM</Card.Title>
                        <p className="card-category mb-0">
                          SpamPatrol est indépendant, non affilié et non cautionné par l’ARCEP.
                        </p>
                      </Card.Header>
                      <Card.Body>
                        {arcepError ? (
                          <Alert show variant="danger" role="alert">{arcepError}</Alert>
                        ) : arcep?.allocation ? (
                          <>
                            <p><strong>Tranche :</strong> {arcep.allocation.rangeStart} – {arcep.allocation.rangeEnd}</p>
                            <p><strong>Code attributaire :</strong> {arcep.allocation.allocationCode}</p>
                            <p><strong>Entité :</strong> {arcep.allocation.entityName || "Aucune correspondance exacte dans le référentiel CE"}</p>
                            <p><strong>Date d’attribution :</strong> {arcep.allocation.allocationDate || "Non précisée"}</p>
                            <p><strong>Territoire :</strong> {arcep.allocation.territory || "Non précisé"}</p>
                            <p className="text-muted mb-1">
                              {arcep.source || "ARCEP / MAJNUM"} — MAJNUM publié le {formatDate(arcep.updatedAt, "date non précisée")};
                              {" "}index importé le {formatDate(arcep.importedAt, "date inconnue")}.
                            </p>
                            <small className="text-muted">
                              L’attribution d’une tranche ne permet pas d’identifier l’utilisateur final ni de garantir l’opérateur actuel
                              d’un numéro porté. Elle n’indique pas l’usage du numéro.
                            </small>
                          </>
                        ) : arcep ? (
                          <Alert show variant="info" role="status">
                            Les données ARCEP/MAJNUM ne permettent pas d’identifier une attribution pour ce numéro.
                          </Alert>
                        ) : null}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md="4">
                    <Card>
                      <Card.Header>
                        <Card.Title as="h5">Jeu local de préfixes</Card.Title>
                        <p className="card-category mb-0">Distinct des données officielles MAJNUM</p>
                      </Card.Header>
                      <Card.Body>
                        {prefixError ? (
                          <Alert show variant="warning" role="status">{prefixError}</Alert>
                        ) : prefix ? (
                          <>
                            <p><strong>Préfixe :</strong> {prefix.prefixe}</p>
                            <p><strong>Nature :</strong> {prefix.nature}</p>
                            <p><strong>Zone :</strong> {prefix.zone}</p>
                            <p className="text-muted mb-0">
                              Source locale : {prefix.source || "Jeu local fourni avec SpamPatrol"}. La provenance externe de ce jeu
                              n’est pas documentée ici.
                            </p>
                          </>
                        ) : prefixMissing ? (
                          <p className="mb-0" role="status">
                            Aucune correspondance dans ce jeu local. Cela ne préjuge pas du résultat du référentiel officiel.
                          </p>
                        ) : null}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Search;
