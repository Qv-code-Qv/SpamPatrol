import React from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { submitReport } from "services/api";

const categories = ["Spam", "Démarchage", "Sondage", "Arnaque", "Fraude"];

function ReportForm() {
  const [number, setNumber] = React.useState("");
  const [category, setCategory] = React.useState(categories[0]);
  const [comment, setComment] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const report = await submitReport({ number, category, comment });
      setSuccess(`Signalement enregistré pour ${report.number}.`);
      setNumber("");
      setComment("");
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col lg="8" md="10">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Signaler un numéro</Card.Title>
              <p className="card-category">Partagez votre expérience pour aider la communauté.</p>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger" role="alert">{error}</Alert>}
              {success && <Alert variant="success" role="status">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="report-number">
                  <Form.Label>Numéro de téléphone</Form.Label>
                  <Form.Control required type="tel" autoComplete="tel" maxLength={40} value={number} onChange={(event) => setNumber(event.target.value)} placeholder="06 12 34 56 78" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="report-category">
                  <Form.Label>Catégorie</Form.Label>
                  <Form.Control as="select" value={category} onChange={(event) => setCategory(event.target.value)}>
                    {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="report-comment">
                  <Form.Label>Commentaire</Form.Label>
                  <Form.Control required as="textarea" rows={4} minLength={3} maxLength={500} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Décrivez brièvement l’appel ou le message reçu." />
                  <Form.Text muted>{comment.trim().length}/500 caractères (minimum 3).</Form.Text>
                </Form.Group>
                <Button className="btn-fill" type="submit" variant="info" disabled={busy}>
                  {busy ? "Envoi…" : "Envoyer le signalement"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ReportForm;
