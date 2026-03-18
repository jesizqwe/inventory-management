import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Tabs, Tab, Card, Spinner, ListGroup, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { itemApi, userApi } from '../services/api';
import SalesforceFormModal from '../components/SalesforceFormModal';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [ownedItems, setOwnedItems] = useState<any[]>([]);
  const [writeAccessItems, setWriteAccessItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('owned');
  const [showSalesforceModal, setShowSalesforceModal] = useState(false);
  const [salesforceMessage, setSalesforceMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!id) return;
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
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSalesforceSuccess = () => {
    setSalesforceMessage('Successfully created Account and Contact in Salesforce!');
    setTimeout(() => setSalesforceMessage(null), 5000);
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

  // Check if current user is viewing their own profile
  const currentUserId = localStorage.getItem('userId');
  const isOwnProfile = String(currentUserId) === String(profileUser.id);

  return (
    <Container>
      {salesforceMessage && (
        <Alert variant="success" onClose={() => setSalesforceMessage(null)} dismissible>
          {salesforceMessage}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Card.Title>{profileUser.name}</Card.Title>
              <Card.Text>
                <strong>{t('profile.email')}:</strong> {profileUser.email}<br />
                <strong>{t('profile.role')}:</strong> {profileUser.role}<br />
                <strong>{t('profile.memberSince')}:</strong> {new Date(profileUser.createdAt).toLocaleDateString()}
              </Card.Text>
            </div>
            {isOwnProfile && (
              <Button
                variant="primary"
                onClick={() => setShowSalesforceModal(true)}
                className="ms-3"
              >
                📈 Connect to Salesforce
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'owned')}>
        <Tab eventKey="owned" title={t('profile.ownedItems')}>
          <ListGroup>
            {ownedItems.map((item) => (
              <ListGroup.Item key={item.id}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong
                      style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }}
                      onClick={() => navigate(`/inventory/${item.inventoryId}`)}
                    >
                      {item.customId || `Item #${item.id}`}
                    </strong>
                    <div className="text-muted small">
                      {t('profile.itemIn')} {item.inventory.title}
                    </div>
                  </div>
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
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong
                      style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }}
                      onClick={() => navigate(`/inventory/${item.inventoryId}`)}
                    >
                      {item.customId || `Item #${item.id}`}
                    </strong>
                    <div className="text-muted small">
                      {t('profile.itemIn')} {item.inventory.title}
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
            {writeAccessItems.length === 0 && (
              <ListGroup.Item>{t('profile.noWriteAccess')}</ListGroup.Item>
            )}
          </ListGroup>
        </Tab>
      </Tabs>

      {isOwnProfile && (
        <SalesforceFormModal
          show={showSalesforceModal}
          onHide={() => setShowSalesforceModal(false)}
          onSuccess={handleSalesforceSuccess}
          userEmail={profileUser.email}
          userName={profileUser.name}
        />
      )}
    </Container>
  );
}
