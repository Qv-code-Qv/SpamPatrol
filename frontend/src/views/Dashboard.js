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

function formatActivationDate(value) {
  if (!value) return "Non indiquée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Non vérifiable";
  return `${date.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })} à ${date.toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit",
  })} (heure de Paris)`;
}

function Dashboard() {
  const [summary, setSummary] = React.useState(null);
  const [summaryError, setSummaryError] = React.useState("");

  React.useEffect(() => {
    let active = true;
    getArcepSummary()
      .then((result) => { if (active) setSummary(result); })
      .catch(() => {
        if (active) setSummaryError("Le résumé de l’instantané MAJNUM n’est pas disponible : les données locales n’ont pas pu être vérifiées.");
      });
    return () => { active = false; };
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Instantané MAJNUM utilisé</Card.Title>
              <p className="card-category mb-0">Un premier repère sur les ressources de numérotation répertoriées</p>
            </Card.Header>
            <Card.Body>
              {summaryError ? (
                <Alert show variant="warning" role="alert">{summaryError}</Alert>
              ) : !summary ? (
                <div role="status" aria-live="polite">
                  <Spinner animation="border" size="sm" aria-hidden="true" /> Chargement du résumé officiel…
                </div>
              ) : (
                <>
                  <Row>
                    <Col md="6">
                      <p className="card-category mb-1">Ressources ou tranches répertoriées</p>
                      <p className="display-4 mb-0" aria-label={`${summary.recordCount.toLocaleString("fr-FR")} ${summary.unit}`}>
                        {summary.recordCount.toLocaleString("fr-FR")}
                      </p>
                      <p>{summary.unit}</p>
                    </Col>
                    <Col md="6">
                      <h5>Source et version des données</h5>
                      <p>
                        <strong>Source :</strong>{" "}
                        {summary.sourceUrl ? (
                          <a href={summary.sourceUrl} target="_blank" rel="noopener noreferrer">{summary.source}</a>
                        ) : summary.source}
                      </p>
                      <p><strong>Publication associée :</strong> {formatPublishedDate(summary.publishedDate)}</p>
                      <p><strong>Activation locale :</strong> {formatActivationDate(summary.activatedAt)}</p>
                      <p><strong>Méthode de calcul :</strong> {summary.method || "Non précisée"}</p>
                      <p className="mb-1"><strong>Identifiant de l’instantané :</strong></p>
                      <code className="d-block text-break">{summary.snapshotVersion || "Non indiqué"}</code>
                      <small className="text-muted">
                        La date d’activation locale ne prouve pas une synchronisation avec l’ARCEP; aucune date de dernière synchronisation n’est fournie ici.
                      </small>
                    </Col>
                  </Row>
                  <hr />
                  <h5>Que représente ce chiffre ?</h5>
                  <p>
                    Il compte les enregistrements de ressources ou de tranches présents dans l’index JSON de l’instantané MAJNUM étudié.
                    Une ressource ou une tranche correspond à une portion de numérotation attribuée et décrite par le référentiel.
                  </p>
                  <h5>Comment comprendre cette information ?</h5>
                  <p>
                    Le total décrit le contenu de cette version locale du référentiel à sa date de publication.
                  </p>
                  <Alert show variant="info" role="note">
                    <strong>À retenir :</strong> une ressource attribuée n’est pas nécessairement utilisée.
                  </Alert>
                  <h5>Ce que ce chiffre ne représente pas</h5>
                  <p>Il ne mesure ni le nombre de personnes, d’abonnés, de lignes actives, d’appels, de numéros utilisés ou de clients d’un opérateur.</p>
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
                Cette page présente l’objectif de SpamPatrol et les principes de l’observatoire. Consultez la recherche pour
                accéder aux informations détaillées sur la numérotation.
              </p>
            </Card.Header>
            <Card.Body>
              <p>
                La recherche permet de consulter les tranches de numérotation, leur attributaire déclaré, leur territoire et
                les dates disponibles à partir des données ARCEP/MAJNUM.
              </p>
              <Alert show variant="info" role="status">
                Les statistiques de consultation ne sont pas encore disponibles. Aucun chiffre n’est affiché tant que les
                compteurs et les règles de confidentialité correspondantes ne sont pas définis.
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
                Les données officielles ARCEP/MAJNUM, leurs sources et les dates disponibles figurent dans les résultats de
                recherche, et non directement sur ce tableau de bord. Les préfixes locaux sont identifiés séparément et ne
                sont pas présentés comme des données MAJNUM.
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
                Une attribution de tranche ne permet pas d’identifier l’utilisateur final ni de garantir l’opérateur actuel
                après portabilité. Elle ne renseigne pas sur l’usage du numéro.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
