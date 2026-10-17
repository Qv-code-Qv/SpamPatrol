import React from "react";
import { Alert, Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { downloadCsv, getRepliques, getStats } from "services/api";

function Dashboard() {
  const [stats, setStats] = React.useState(null);
  const [replica, setReplica] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    Promise.allSettled([getStats(), getRepliques()]).then(([statsResult, repliquesResult]) => {
      if (statsResult.status === "fulfilled") setStats(statsResult.value);
      else setError(statsResult.reason.message);
      if (repliquesResult.status === "fulfilled" && repliquesResult.value.length) {
        const items = repliquesResult.value;
        setReplica(items[Math.floor(Math.random() * items.length)]);
      }
      setLoading(false);
    });
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
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Alert variant="warning">Les données locales actuelles comprennent des exemples historiques non vérifiés. Ces chiffres décrivent uniquement le fichier du projet et ne représentent pas une fréquence réelle des appels indésirables.</Alert>
      {loading ? <Alert variant="light">Chargement des données SpamPatrol…</Alert> : stats && (
        <>
          <Row>
            <Col lg="3" sm="6">
              <Card className="card-stats"><Card.Body><Row><Col xs="5"><div className="icon-big text-center icon-warning"><i className="nc-icon nc-notes text-info"></i></div></Col><Col xs="7"><div className="numbers"><p className="card-category">Signalements valides</p><Card.Title as="h4">{stats.totalReports}</Card.Title></div></Col></Row></Card.Body></Card>
            </Col>
            <Col lg="3" sm="6">
              <Card className="card-stats"><Card.Body><Row><Col xs="5"><div className="icon-big text-center icon-warning"><i className="nc-icon nc-bulb-63 text-warning"></i></div></Col><Col xs="7"><div className="numbers"><p className="card-category">Catégories actives</p><Card.Title as="h4">{stats.topCategories.length}</Card.Title></div></Col></Row></Card.Body></Card>
            </Col>
            <Col lg="3" sm="6">
              <Card className="card-stats"><Card.Body><Row><Col xs="5"><div className="icon-big text-center icon-warning"><i className="nc-icon nc-mobile text-success"></i></div></Col><Col xs="7"><div className="numbers"><p className="card-category">Numéros signalés</p><Card.Title as="h4">{stats.uniqueNumbers}</Card.Title></div></Col></Row></Card.Body></Card>
            </Col>
            <Col lg="3" sm="6">
              <Card className="card-stats"><Card.Body className="d-flex align-items-center justify-content-center"><Button className="btn-fill" variant="info" disabled={exporting || stats.totalReports === 0} onClick={handleExport}>{exporting ? "Préparation…" : "Exporter les données"}</Button></Card.Body></Card>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Card>
                <Card.Header><Card.Title as="h4">Numéros les plus signalés</Card.Title><p className="card-category">Données présentes dans le fichier local</p></Card.Header>
                <Card.Body>
                  {stats.topNumbers.length ? <Table responsive hover><thead><tr><th>Numéro</th><th>Signalements</th></tr></thead><tbody>{stats.topNumbers.map((item) => <tr key={item.number}><td>{item.number}</td><td>{item.count}</td></tr>)}</tbody></Table> : <p>Aucun signalement exploitable pour le moment.</p>}
                  <Button as={Link} to="/admin/search" variant="link" className="pl-0">Rechercher un numéro</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md="6">
              <Card>
                <Card.Header><Card.Title as="h4">Signalements par catégorie</Card.Title><p className="card-category">Répartition des enregistrements valides</p></Card.Header>
                <Card.Body>{stats.topCategories.length ? <Table responsive hover><thead><tr><th>Catégorie</th><th>Signalements</th></tr></thead><tbody>{stats.topCategories.map((item) => <tr key={item.category}><td>{item.category}</td><td>{item.count}</td></tr>)}</tbody></Table> : <p>Aucune catégorie à afficher.</p>}</Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="8">
              <Card>
                <Card.Header><Card.Title as="h4">Réplique anti-démarchage</Card.Title><p className="card-category">Phrase proposée depuis le fichier local</p></Card.Header>
                <Card.Body><blockquote className="blockquote mb-0">{replica || "Aucune réplique disponible."}</blockquote></Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card>
                <Card.Header><Card.Title as="h4">Contribuer</Card.Title><p className="card-category">Partagez une expérience récente</p></Card.Header>
                <Card.Body><Button as={Link} to="/admin/report" className="btn-fill" variant="info">Signaler un numéro</Button><p className="text-muted mt-3 mb-0">Les statistiques reflètent uniquement les signalements locaux exploitables.</p></Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default Dashboard;
