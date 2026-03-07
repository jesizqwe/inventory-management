import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { inventoryApi } from '../services/api';
import { getPlural } from '../i18n';

export default function InventoriesPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inventories, setInventories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const loadInventories = useCallback(async () => {
    try {
      const res = await inventoryApi.getAll({ search, category: category || undefined });
      setInventories(res.data.inventories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    loadInventories();
  }, [loadInventories]);

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
          <h2>{t('nav.inventories')}</h2>
        </Col>
        {user && (
          <Col xs="auto">
            <Button onClick={() => navigate('/inventory/create')} variant="primary">
              {t('inventory.create')}
            </Button>
          </Col>
        )}
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">{t('category.all')}</option>
            <option value="EQUIPMENT">{t('category.equipment')}</option>
            <option value="FURNITURE">{t('category.furniture')}</option>
            <option value="BOOK">{t('category.book')}</option>
            <option value="DOCUMENTS">{t('category.documents')}</option>
            <option value="OTHER">{t('category.other')}</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        {inventories.map((inv) => (
          <Col key={inv.id} md={4} className="mb-3">
            <Card>
              {inv.imageUrl && <Card.Img variant="top" src={inv.imageUrl} />}
              <Card.Body>
                <Card.Title>
                  <Link to={`/inventory/${inv.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {inv.title}
                  </Link>
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
