import React from "react";
import { Alert, Card, Container } from "react-bootstrap";

function Maps() {
  return (
    <>
      <Container fluid>
        <Card><Card.Header><Card.Title as="h4">Cartographie</Card.Title></Card.Header>
          <Card.Body><Alert variant="info" className="mb-0">La carte sera disponible lorsque des données de localisation fiables seront recueillies. SpamPatrol ne déduit pas la ville d’un numéro et n’envoie aucune donnée à un service cartographique externe.</Alert></Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Maps;
