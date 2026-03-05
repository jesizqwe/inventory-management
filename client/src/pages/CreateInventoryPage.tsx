import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { inventoryApi } from '../services/api';
import axios from 'axios';

export default function CreateInventoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    isPublic: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await inventoryApi.create(formData);
      navigate(`/inventory/${res.data.id}`);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to create inventory');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{t('inventory.create')}</Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t('inventory.title')}</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('inventory.description')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('inventory.category')}</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="EQUIPMENT">{t('category.equipment')}</option>
                <option value="FURNITURE">{t('category.furniture')}</option>
                <option value="BOOK">{t('category.book')}</option>
                <option value="DOCUMENTS">{t('category.documents')}</option>
                <option value="OTHER">{t('category.other')}</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label={t('inventory.isPublic')}
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? t('common.loading') : t('common.save')}
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
              {t('common.cancel')}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
