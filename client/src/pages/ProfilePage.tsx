import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Tabs, Tab, Card, Spinner, ListGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { itemApi } from '../services/api';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [ownedItems, setOwnedItems] = useState<any[]>([]);
  const [writeAccessItems, setWriteAccessItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('owned');

  useEffect(() => {
    if (id) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProfile = async () => {
    try {
      const userId = Number(id);
      const [userRes, ownedRes, writeRes] = await Promise.all([
        userApi.getById(userId),
        itemApi.getOwnedByUser(userId),
        itemApi.getWithWriteAccess(userId),
      ]);
      setProfileUser(userRes.data);
      setOwnedItems(ownedRes.data.items);
      setWriteAccessItems(writeRes.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!profileUser) {
    return <Container>User not found</Container>;
  }

  return (
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{profileUser.name}</Card.Title>
          <Card.Text>
            <strong>{t('profile.email')}:</strong> {profileUser.email}<br />
            <strong>{t('profile.role')}:</strong> {profileUser.role}<br />
            <strong>{t('profile.memberSince')}:</strong> {new Date(profileUser.createdAt).toLocaleDateString()}
          </Card.Text>
        </Card.Body>
      </Card>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'owned')}>
        <Tab eventKey="owned" title={t('profile.ownedItems')}>
          <ListGroup>
            {ownedItems.map((item) => (
              <ListGroup.Item key={item.id}>
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{item.customId || `Item #${item.id}`}</strong>
                    <div className="text-muted small">
                      {t('profile.itemIn')} {item.inventory.title}
                    </div>
                  </div>
                  <Button variant="outline-primary" size="sm">
                    {t('profile.view')}
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
            {ownedItems.length === 0 && (
              <ListGroup.Item>{t('profile.noOwnedItems')}</ListGroup.Item>
            )}
          </ListGroup>
        </Tab>

        <Tab eventKey="write" title={t('profile.writeAccess')}>
          <ListGroup>
            {writeAccessItems.map((item) => (
              <ListGroup.Item key={item.id}>
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{item.customId || `Item #${item.id}`}</strong>
                    <div className="text-muted small">
                      {t('profile.itemIn')} {item.inventory.title}
                    </div>
                  </div>
                  <Button variant="outline-primary" size="sm">
                    {t('profile.view')}
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
            {writeAccessItems.length === 0 && (
              <ListGroup.Item>{t('profile.noWriteAccess')}</ListGroup.Item>
            )}
          </ListGroup>
        </Tab>
      </Tabs>
    </Container>
  );
}
