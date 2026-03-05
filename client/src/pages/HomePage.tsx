import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { inventoryApi } from '../services/api';
import { getPlural } from '../i18n';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [recent, setRecent] = useState<any[]>([]);
  const [top, setTop] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      inventoryApi.getRecent(5),
      inventoryApi.getTop(5),
    ])
      .then(([recentRes, topRes]) => {
        setRecent(recentRes.data);
        setTop(topRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>{t('home.recentInventories')}</h2>
        </Col>
      </Row>
      <Row className="mb-4">
        {recent.map((inv) => (
          <Col key={inv.id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title as={Link} to={`/inventory/${inv.id}`}>
                  {inv.title}
                </Card.Title>
                <Card.Text className="text-muted">
                  {inv.description?.substring(0, 100)}...
                </Card.Text>
                <small className="text-muted">
                  {t('inventory.by')} {inv.creator.name} • {t(`inventory.items_count_${getPlural(inv._count.items, i18n.language)}`, { count: inv._count.items })}
                </small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col>
          <h2>{t('home.topInventories')}</h2>
        </Col>
      </Row>
      <Row className="mb-4">
        {top.map((inv) => (
          <Col key={inv.id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title as={Link} to={`/inventory/${inv.id}`}>
                  {inv.title}
                </Card.Title>
                <Card.Text className="text-muted">
                  {inv.description?.substring(0, 100)}...
                </Card.Text>
                <small className="text-muted">
                  {t('inventory.by')} {inv.creator.name} • {t(`inventory.items_count_${getPlural(inv._count.items, i18n.language)}`, { count: inv._count.items })}
                </small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
