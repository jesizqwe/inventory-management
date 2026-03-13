import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { searchApi } from '../services/api';

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedTag, setSelectedTag] = useState<string | null>(searchParams.get('tag') || null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    const tag = searchParams.get('tag');
    if (q) {
      setQuery(q);
    }
    if (tag) {
      setSelectedTag(tag);
    }
    performSearch(q || '', tag);
  }, [searchParams]);

  const performSearch = async (q: string, tag: string | null) => {
    if (!q.trim() && !tag) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await searchApi.search(q, { tag: tag || undefined });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (query.trim()) {
      params.q = query;
    }
    if (selectedTag) {
      params.tag = selectedTag;
    }
    setSearchParams(params);
  };

  const clearTagFilter = () => {
    setSelectedTag(null);
    const params: any = {};
    if (query.trim()) {
      params.q = query;
    }
    setSearchParams(params);
  };

  return (
    <Container>
      <h2 className="mb-4">{t('common.search')}</h2>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit">{t('common.search')}</Button>
        </InputGroup>
      </Form>

      {selectedTag && (
        <Card className="mb-4">
          <Card.Body className="d-flex align-items-center">
            <span className="me-2">{t('search.inventory')}:</span>
            <span className="badge bg-primary me-2">{selectedTag}</span>
            <Button variant="outline-secondary" size="sm" onClick={clearTagFilter}>
              {t('common.cancel')}
            </Button>
          </Card.Body>
        </Card>
      )}

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {results && (
        <>
          {results.inventories && (
            <div className="mb-4">
              <h4>{t('search.inventories')} ({results.inventories.total})</h4>
              <Row>
                {results.inventories.items.map((inv: any) => (
                  <Col key={inv.id} md={4} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          <Link to={`/inventory/${inv.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {inv.title}
                          </Link>
                        </Card.Title>
                        <Card.Text className="text-muted">
                          {inv.description?.substring(0, 100)}...
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {results.items && (
            <div>
              <h4>{t('search.items')} ({results.items.total})</h4>
              <Row>
                {results.items.items.map((item: any) => (
                  <Col key={item.id} md={4} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          {item.customId || `Item #${item.id}`}
                        </Card.Title>
                        <small className="text-muted">
                          {t('search.inventory')}: <Link to={`/inventory/${item.inventory.id}`} style={{ textDecoration: 'none', color: '#6c757d' }}>{item.inventory.title}</Link>
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
