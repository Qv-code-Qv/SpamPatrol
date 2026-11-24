import React from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getArcepSummary } from "services/api";

function formatPublishedDate(value) {
  if (!value) return "Non indiquée";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Non vérifiable" : date.toLocaleDateString("fr-FR");
}

function formatCount(value) {
  return value.toLocaleString("fr-FR");
}

function formatShare(value) {
  return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`;
}

function hasConsistentTerritoryDistribution(distribution, recordCount) {
  return Boolean(
    distribution
    && distribution.totalRecords === recordCount
    && Array.isArray(distribution.entries)
    && distribution.entries.every((entry) => Number.isSafeInteger(entry.count)
      && entry.count >= 0
      && Number.isFinite(entry.sharePercent)
      && entry.sharePercent >= 0
      && entry.sharePercent <= 100)
    && distribution.entries.reduce((total, entry) => total + entry.count, 0) === recordCount
  );
}

function Dashboard() {
  const [summary, setSummary] = React.useState(null);
  const [summaryError, setSummaryError] = React.useState("");

  React.useEffect(() => {
    let active = true;
    getArcepSummary()
      .then((result) => { if (active) setSummary(result); })
      .catch(() => {
        if (active) setSummaryError("Données indisponibles.");
      });
    return () => { active = false; };
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Ressources de numérotation recensées</Card.Title>
            </Card.Header>
            <Card.Body>
              {summaryError ? (
                <Alert show variant="warning" role="alert">Les données officielles ne sont pas disponibles pour le moment.</Alert>
              ) : !summary ? (
                <div role="status" aria-live="polite">
                  <Spinner animation="border" size="sm" aria-hidden="true" /> Chargement des données officielles…
                </div>
              ) : (
                <Row>
                  <Col md="6">
                    <p className="display-4 mb-0" aria-label={`${formatCount(summary.recordCount)} ${summary.unit}`}>
                      {formatCount(summary.recordCount)}
                    </p>
                    <p className="mb-0">Ressources ou tranches recensées.</p>
                  </Col>
                  <Col md="6">
                    <p className="small text-muted mb-2">
                      Source :{" "}
                      {summary.sourceUrl ? (
                        <a href={summary.sourceUrl} target="_blank" rel="noopener noreferrer">Données officielles de l’ARCEP</a>
                      ) : "Données officielles de l’ARCEP"}
                      {" "}· Publication : {formatPublishedDate(summary.publishedDate)}
                    </p>
                    <p className="mb-0">Ce chiffre ne représente pas le nombre de lignes téléphoniques en service.</p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Répartition par territoire</Card.Title>
              <p className="card-category mb-0">Part des ressources recensées pour chaque territoire déclaré</p>
            </Card.Header>
            <Card.Body>
              {summaryError ? (
                <Alert show variant="warning" role="alert">Ce graphique est indisponible pour le moment.</Alert>
              ) : !summary ? (
                <div role="status" aria-live="polite">
                  <Spinner animation="border" size="sm" aria-hidden="true" /> Chargement du graphique…
                </div>
              ) : !hasConsistentTerritoryDistribution(summary.territoryDistribution, summary.recordCount) ? (
                <Alert show variant="warning" role="alert">La répartition est momentanément indisponible.</Alert>
              ) : summary.recordCount === 0 || summary.territoryDistribution.entries.length === 0 ? (
                <Alert show variant="info" role="status">Aucune donnée à afficher.</Alert>
              ) : (
                <>
                  <p className="mb-3">
                    Total : {formatCount(summary.territoryDistribution.totalRecords)} ressources recensées. Les barres indiquent leur part du total.
                  </p>
                  <ul className="list-unstyled" aria-label="Effectifs par territoire déclaré">
                    {summary.territoryDistribution.entries.map((entry) => (
                      <li key={`${entry.kind}:${entry.territory === null ? "" : entry.territory}`} className="mb-3">
                        <div className="d-flex justify-content-between align-items-baseline flex-wrap">
                          <strong>{entry.label}</strong>
                          <span>{formatCount(entry.count)} ({formatShare(entry.sharePercent)})</span>
                        </div>
                        <div className="progress" aria-hidden="true">
                          <div className="progress-bar bg-info" style={{ width: `${entry.sharePercent}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-2"><strong>À retenir :</strong> les libellés distincts restent séparés.</p>
                  <p className="small text-muted mb-0">Le territoire déclaré ne localise pas nécessairement l’appelant ou l’utilisateur.</p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Observatoire de la numérotation</Card.Title>
              <p className="card-category mb-0">
                Comprendre les informations publiques sur la numérotation téléphonique.
              </p>
            </Card.Header>
            <Card.Body>
              <p>La recherche présente les informations disponibles sur un numéro.</p>
              <Alert show variant="info" role="status">
                Les statistiques de consultation ne sont pas affichées.
              </Alert>
              <Button as={Link} to="/admin/search" className="btn-fill" variant="info">
                Rechercher un numéro
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Données et provenance</Card.Title>
              <p className="card-category">Référentiels officiels et données locales distincts</p>
            </Card.Header>
            <Card.Body>
              <p className="mb-0">
                Les préfixes locaux de SpamPatrol sont présentés séparément des données officielles de l’ARCEP.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Limites des attributions</Card.Title>
              <p className="card-category">Ce que les tranches ne permettent pas de conclure</p>
            </Card.Header>
            <Card.Body>
              <p className="mb-0">
                Une ressource attribuée ne permet pas d’identifier son utilisateur ni de confirmer l’opérateur actuel après portabilité.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
