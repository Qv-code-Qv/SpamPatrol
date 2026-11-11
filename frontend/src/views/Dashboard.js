import React from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Observatoire de la numérotation</Card.Title>
              <p className="card-category mb-0">
                Informations issues des référentiels officiels de numérotation téléphonique.
              </p>
            </Card.Header>
            <Card.Body>
              <p>
                SpamPatrol consulte principalement les données ARCEP/MAJNUM pour présenter les tranches de numérotation,
                leur attributaire déclaré, leur territoire et les dates disponibles.
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
                Les informations ARCEP/MAJNUM sont présentées avec leur source et les dates disponibles. Les préfixes
                locaux sont identifiés séparément et ne sont pas présentés comme des données MAJNUM.
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
