import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Tabs, Tab, Spinner, Button, Card, Form, ListGroup, Table, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { inventoryApi, itemApi, commentApi } from '../services/api';

interface CustomFieldConfig {
  name: string;
  enabled: boolean;
  showInTable?: boolean;
}

interface CustomFieldsState {
  string1: CustomFieldConfig;
  string2: CustomFieldConfig;
  string3: CustomFieldConfig;
  int1: CustomFieldConfig;
  int2: CustomFieldConfig;
  int3: CustomFieldConfig;
  bool1: CustomFieldConfig;
  bool2: CustomFieldConfig;
  bool3: CustomFieldConfig;
}

export default function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const [inventory, setInventory] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items');
  const [newComment, setNewComment] = useState('');
  const [newItem, setNewItem] = useState({ customId: '', customString1: '', customString2: '', customString3: '', customInt1: undefined as number | undefined, customInt2: undefined as number | undefined, customInt3: undefined as number | undefined, customBool1: false, customBool2: false, customBool3: false });
  const [customFields, setCustomFields] = useState<CustomFieldsState>({
    string1: { name: '', enabled: false, showInTable: false },
    string2: { name: '', enabled: false, showInTable: false },
    string3: { name: '', enabled: false, showInTable: false },
    int1: { name: '', enabled: false, showInTable: false },
    int2: { name: '', enabled: false, showInTable: false },
    int3: { name: '', enabled: false, showInTable: false },
    bool1: { name: '', enabled: false, showInTable: false },
    bool2: { name: '', enabled: false, showInTable: false },
    bool3: { name: '', enabled: false, showInTable: false },
  });
  const [savingFields, setSavingFields] = useState(false);
  const [editInventory, setEditInventory] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    isPublic: false,
  });
  const [savingInventory, setSavingInventory] = useState(false);
  const [accessEmail, setAccessEmail] = useState('');
  const [addingAccess, setAddingAccess] = useState(false);

  const loadInventory = useCallback(async () => {
    try {
      const [invRes, itemsRes, commentsRes] = await Promise.all([
        inventoryApi.getById(Number(id)),
        itemApi.getByInventory(Number(id)),
        commentApi.getByInventory(Number(id)),
      ]);
      setInventory(invRes.data);
      setItems(itemsRes.data);
      setComments(commentsRes.data);

      // Load edit form data
      if (invRes.data) {
        setEditInventory({
          title: invRes.data.title || '',
          description: invRes.data.description || '',
          category: invRes.data.category || 'OTHER',
          imageUrl: invRes.data.imageUrl || '',
          isPublic: invRes.data.isPublic || false,
        });
      }

      // Load custom fields configuration from inventory
      if (invRes.data) {
        setCustomFields({
          string1: {
            name: invRes.data.customString1Name || '',
            enabled: invRes.data.customString1State || false,
            showInTable: invRes.data.customString1ShowInTable || false,
          },
          string2: {
            name: invRes.data.customString2Name || '',
            enabled: invRes.data.customString2State || false,
            showInTable: invRes.data.customString2ShowInTable || false,
          },
          string3: {
            name: invRes.data.customString3Name || '',
            enabled: invRes.data.customString3State || false,
            showInTable: invRes.data.customString3ShowInTable || false,
          },
          int1: {
            name: invRes.data.customInt1Name || '',
            enabled: invRes.data.customInt1State || false,
            showInTable: invRes.data.customInt1ShowInTable || false,
          },
          int2: {
            name: invRes.data.customInt2Name || '',
            enabled: invRes.data.customInt2State || false,
            showInTable: invRes.data.customInt2ShowInTable || false,
          },
          int3: {
            name: invRes.data.customInt3Name || '',
            enabled: invRes.data.customInt3State || false,
            showInTable: invRes.data.customInt3ShowInTable || false,
          },
          bool1: {
            name: invRes.data.customBool1Name || '',
            enabled: invRes.data.customBool1State || false,
            showInTable: invRes.data.customBool1ShowInTable || false,
          },
          bool2: {
            name: invRes.data.customBool2Name || '',
            enabled: invRes.data.customBool2State || false,
            showInTable: invRes.data.customBool2ShowInTable || false,
          },
          bool3: {
            name: invRes.data.customBool3Name || '',
            enabled: invRes.data.customBool3State || false,
            showInTable: invRes.data.customBool3ShowInTable || false,
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadInventory();
    }
  }, [id, loadInventory]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;
    try {
      const res = await commentApi.createForInventory(Number(id), newComment);
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async () => {
    if (!id) return;
    try {
      const res = await itemApi.create(Number(id), newItem);
      setItems([...items, res.data]);
      setNewItem({ customId: '', customString1: '', customString2: '', customString3: '', customInt1: undefined, customInt2: undefined, customInt3: undefined, customBool1: false, customBool2: false, customBool3: false });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm(t('inventory.confirmDelete'))) return;
    try {
      await inventoryApi.delete(Number(id));
      navigate('/inventories');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCustomFields = async () => {
    if (!id) return;
    setSavingFields(true);
    try {
      const dto = {
        customFields: {
          string1: { name: customFields.string1.name, enabled: customFields.string1.enabled, showInTable: customFields.string1.showInTable },
          string2: { name: customFields.string2.name, enabled: customFields.string2.enabled, showInTable: customFields.string2.showInTable },
          string3: { name: customFields.string3.name, enabled: customFields.string3.enabled, showInTable: customFields.string3.showInTable },
          int1: { name: customFields.int1.name, enabled: customFields.int1.enabled, showInTable: customFields.int1.showInTable },
          int2: { name: customFields.int2.name, enabled: customFields.int2.enabled, showInTable: customFields.int2.showInTable },
          int3: { name: customFields.int3.name, enabled: customFields.int3.enabled, showInTable: customFields.int3.showInTable },
          bool1: { name: customFields.bool1.name, enabled: customFields.bool1.enabled, showInTable: customFields.bool1.showInTable },
          bool2: { name: customFields.bool2.name, enabled: customFields.bool2.enabled, showInTable: customFields.bool2.showInTable },
          bool3: { name: customFields.bool3.name, enabled: customFields.bool3.enabled, showInTable: customFields.bool3.showInTable },
        },
      };
      await inventoryApi.update(Number(id), dto);
      alert(t('common.saved'));
    } catch (err) {
      console.error(err);
      alert(t('common.error'));
    } finally {
      setSavingFields(false);
    }
  };

  const handleSaveInventory = async () => {
    if (!id) return;
    setSavingInventory(true);
    try {
      await inventoryApi.update(Number(id), editInventory);
      setInventory({ ...inventory, ...editInventory });
      alert(t('common.saved'));
    } catch (err) {
      console.error(err);
      alert(t('common.error'));
    } finally {
      setSavingInventory(false);
    }
  };

  const handleAddAccess = async () => {
    if (!id || !accessEmail.trim()) return;
    setAddingAccess(true);
    try {
      const res = await inventoryApi.addAccess(Number(id), accessEmail.trim());
      setInventory(res.data);
      setAccessEmail('');
      alert(t('common.saved'));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || t('common.error'));
    } finally {
      setAddingAccess(false);
    }
  };

  const handleRemoveAccess = async (userId: number) => {
    if (!id) return;
    if (!window.confirm(t('inventory.confirmRemoveAccess'))) return;
    try {
      const res = await inventoryApi.removeAccess(Number(id), userId);
      setInventory(res.data);
      alert(t('common.saved'));
    } catch (err) {
      console.error(err);
      alert(t('common.error'));
    }
  };

  const updateCustomField = (type: keyof CustomFieldsState, field: Partial<CustomFieldConfig>) => {
    setCustomFields(prev => ({
      ...prev,
      [type]: { ...prev[type], ...field },
    }));
  };

  const renderCustomFieldRow = (type: keyof CustomFieldsState, label: string) => {
    const field = customFields[type];
    return (
      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder={t('customFields.fieldName')}
            value={field.name}
            onChange={(e) => updateCustomField(type, { name: e.target.value })}
            disabled={!field.enabled}
          />
        </Col>
        <Col md={3}>
          <Form.Check
            type="checkbox"
            label={t('customFields.enabled')}
            checked={field.enabled}
            onChange={(e) => updateCustomField(type, { enabled: e.target.checked })}
          />
        </Col>
        <Col md={3}>
          <Form.Check
            type="checkbox"
            label={t('customFields.showInTable')}
            checked={field.showInTable}
            onChange={(e) => updateCustomField(type, { showInTable: e.target.checked })}
            disabled={!field.enabled}
          />
        </Col>
      </Row>
    );
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!inventory) {
    return <Container>{t('inventory.notFound')}</Container>;
  }

  const isOwner = inventory.creatorId === user?.id;
  const hasWriteAccess = inventory.accessList?.some((access: any) => access.userId === user?.id);
  const canEdit = isOwner || isAdmin; // Can delete inventory
  const canWrite = canEdit || hasWriteAccess || inventory.isPublic; // Can add/edit/delete items
  const canEditSettings = canEdit || hasWriteAccess; // Can edit settings and custom fields

  // Get enabled fields for display
  const enabledFields = Object.entries(customFields)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => {
      // Convert 'string1' -> 'customString1', 'int1' -> 'customInt1', etc.
      const typeMap: Record<string, string> = {
        string: 'customString',
        int: 'customInt',
        bool: 'customBool',
      };
      const [type, num] = key.split(/(\d+)/);
      const apiField = `${typeMap[type] || type}${num}`;
      return { key, apiField, name: config.name || key, showInTable: config.showInTable };
    });

  const tableFields = enabledFields.filter(f => f.showInTable);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{inventory.title}</h1>
        {canEdit && (
          <div>
            <Button variant="danger" onClick={handleDelete} className="me-2">
              {t('inventory.delete')}
            </Button>
          </div>
        )}
      </div>

      <p className="text-muted">{inventory.description}</p>
      <p>
        <strong>{t('inventory.category')}:</strong> {inventory.category} |
        <strong> {t('inventory.items')}:</strong> {inventory._count?.items || items.length} |
        <strong> {t('inventory.creator')}:</strong> {inventory.creator?.name}
      </p>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'items')} className="mb-4">
        <Tab eventKey="items" title={t('inventory.items')}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>{t('items.add')}</Card.Title>
              <Form>
                <Row className="mb-2">
                  <Col md={3}>
                    <Form.Control
                      placeholder={t('items.customId')}
                      value={newItem.customId}
                      onChange={(e) => setNewItem({ ...newItem, customId: e.target.value })}
                    />
                  </Col>
                  {customFields.string1.enabled && (
                    <Col md={3}>
                      <Form.Control
                        placeholder={customFields.string1.name || 'String 1'}
                        value={newItem.customString1}
                        onChange={(e) => setNewItem({ ...newItem, customString1: e.target.value })}
                      />
                    </Col>
                  )}
                  {customFields.string2.enabled && (
                    <Col md={3}>
                      <Form.Control
                        placeholder={customFields.string2.name || 'String 2'}
                        value={newItem.customString2}
                        onChange={(e) => setNewItem({ ...newItem, customString2: e.target.value })}
                      />
                    </Col>
                  )}
                  {customFields.string3.enabled && (
                    <Col md={3}>
                      <Form.Control
                        placeholder={customFields.string3.name || 'String 3'}
                        value={newItem.customString3}
                        onChange={(e) => setNewItem({ ...newItem, customString3: e.target.value })}
                      />
                    </Col>
                  )}
                </Row>
                <Row className="mb-2">
                  {customFields.int1.enabled && (
                    <Col md={3}>
                      <Form.Control
                        type="number"
                        placeholder={customFields.int1.name || 'Int 1'}
                        value={newItem.customInt1 || ''}
                        onChange={(e) => setNewItem({ ...newItem, customInt1: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </Col>
                  )}
                  {customFields.int2.enabled && (
                    <Col md={3}>
                      <Form.Control
                        type="number"
                        placeholder={customFields.int2.name || 'Int 2'}
                        value={newItem.customInt2 || ''}
                        onChange={(e) => setNewItem({ ...newItem, customInt2: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </Col>
                  )}
                  {customFields.int3.enabled && (
                    <Col md={3}>
                      <Form.Control
                        type="number"
                        placeholder={customFields.int3.name || 'Int 3'}
                        value={newItem.customInt3 || ''}
                        onChange={(e) => setNewItem({ ...newItem, customInt3: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </Col>
                  )}
                </Row>
                <Row className="mb-2">
                  {customFields.bool1.enabled && (
                    <Col md={3}>
                      <Form.Check
                        type="checkbox"
                        label={customFields.bool1.name || 'Bool 1'}
                        checked={newItem.customBool1}
                        onChange={(e) => setNewItem({ ...newItem, customBool1: e.target.checked })}
                      />
                    </Col>
                  )}
                  {customFields.bool2.enabled && (
                    <Col md={3}>
                      <Form.Check
                        type="checkbox"
                        label={customFields.bool2.name || 'Bool 2'}
                        checked={newItem.customBool2}
                        onChange={(e) => setNewItem({ ...newItem, customBool2: e.target.checked })}
                      />
                    </Col>
                  )}
                  {customFields.bool3.enabled && (
                    <Col md={3}>
                      <Form.Check
                        type="checkbox"
                        label={customFields.bool3.name || 'Bool 3'}
                        checked={newItem.customBool3}
                        onChange={(e) => setNewItem({ ...newItem, customBool3: e.target.checked })}
                      />
                    </Col>
                  )}
                </Row>
                <Button onClick={handleAddItem} disabled={!canWrite}>
                  {t('items.add')}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t('items.customId')}</th>
                {tableFields.map(field => (
                  <th key={field.key}>{field.name}</th>
                ))}
                <th>{t('inventory.creator')}</th>
                <th>{t('inventory.createdAt')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.customId || `#${item.id}`}</td>
                  {tableFields.map(field => {
                    const fieldName = field.apiField as keyof typeof item;
                    let value = item[fieldName];
                    if (field.key.startsWith('bool')) {
                      value = value ? '✓' : '✗';
                    }
                    return <td key={field.key}>{value ?? '-'}</td>;
                  })}
                  <td>
                    <Link to={`/profile/${item.creator.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {item.creator?.name}
                    </Link>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="discussion" title={t('inventory.discussion')}>
          <Card className="mb-3">
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder={t('comments.add')}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Form.Group>
              <Button onClick={handleAddComment} disabled={!user}>
                {user ? t('comments.post') : t('comments.loginToComment')}
              </Button>
            </Card.Body>
          </Card>

          <ListGroup>
            {comments.map((comment) => (
              <ListGroup.Item key={comment.id}>
                <Link to={`/profile/${comment.author.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <strong>{comment.author.name}</strong>
                </Link>
                <small className="text-muted ms-2">
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
                <p className="mt-2 mb-0">{comment.text}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Tab>

        <Tab eventKey="customFields" title={t('customFields.title')}>
          {canEditSettings ? (
            <Card>
              <Card.Body>
                <Card.Title>{t('customFields.title')}</Card.Title>
                <Card.Text className="text-muted mb-4">{t('customFields.description')}</Card.Text>

                <h5 className="mt-4">{t('customFields.stringFields')}</h5>
                {renderCustomFieldRow('string1', 'String 1')}
                {renderCustomFieldRow('string2', 'String 2')}
                {renderCustomFieldRow('string3', 'String 3')}

                <h5 className="mt-4">{t('customFields.numberFields')}</h5>
                {renderCustomFieldRow('int1', 'Int 1')}
                {renderCustomFieldRow('int2', 'Int 2')}
                {renderCustomFieldRow('int3', 'Int 3')}

                <h5 className="mt-4">{t('customFields.booleanFields')}</h5>
                {renderCustomFieldRow('bool1', 'Bool 1')}
                {renderCustomFieldRow('bool2', 'Bool 2')}
                {renderCustomFieldRow('bool3', 'Bool 3')}

                <Button variant="primary" onClick={handleSaveCustomFields} disabled={savingFields} className="mt-3">
                  {savingFields ? t('common.loading') : t('common.save')}
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <div>{t('inventory.noAccessControl')}</div>
          )}
        </Tab>

        <Tab eventKey="settings" title={t('inventory.settings')}>
          {canEditSettings ? (
            <Card>
              <Card.Body>
                <Card.Title>{t('inventory.settings')}</Card.Title>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('inventory.title')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={editInventory.title}
                      onChange={(e) => setEditInventory({ ...editInventory, title: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>{t('inventory.description')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={editInventory.description}
                      onChange={(e) => setEditInventory({ ...editInventory, description: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>{t('inventory.category')}</Form.Label>
                    <Form.Select
                      value={editInventory.category}
                      onChange={(e) => setEditInventory({ ...editInventory, category: e.target.value })}
                    >
                      <option value="EQUIPMENT">{t('category.equipment')}</option>
                      <option value="FURNITURE">{t('category.furniture')}</option>
                      <option value="BOOK">{t('category.book')}</option>
                      <option value="DOCUMENTS">{t('category.documents')}</option>
                      <option value="OTHER">{t('category.other')}</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>{t('inventory.imageUrl')}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="https://..."
                      value={editInventory.imageUrl || ''}
                      onChange={(e) => setEditInventory({ ...editInventory, imageUrl: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label={t('inventory.isPublic')}
                      checked={editInventory.isPublic}
                      onChange={(e) => setEditInventory({ ...editInventory, isPublic: e.target.checked })}
                    />
                    <Form.Text className="text-muted">
                      {t('inventory.isPublicHelp')}
                    </Form.Text>
                  </Form.Group>

                  <Button variant="primary" onClick={handleSaveInventory} disabled={savingInventory}>
                    {savingInventory ? t('common.loading') : t('common.save')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <div>{t('inventory.noAccessSettings')}</div>
          )}
        </Tab>

        <Tab eventKey="access" title={t('inventory.access')}>
          {canEdit ? (
            <Card>
              <Card.Body>
                <Card.Title>{t('inventory.accessControl')}</Card.Title>
                <Card.Text className="text-muted mb-4">{t('inventory.accessControlDescription')}</Card.Text>

                <Form className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label>{t('inventory.addAccessByEmail')}</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="email"
                        placeholder={t('inventory.emailPlaceholder')}
                        value={accessEmail}
                        onChange={(e) => setAccessEmail(e.target.value)}
                        disabled={addingAccess}
                      />
                      <Button variant="primary" onClick={handleAddAccess} disabled={addingAccess || !accessEmail.trim()}>
                        {addingAccess ? t('common.loading') : t('inventory.grantAccess')}
                      </Button>
                    </div>
                  </Form.Group>
                </Form>

                <h5 className="mb-3">{t('inventory.usersWithAccess')}</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>{t('admin.name')}</th>
                      <th>{t('admin.email')}</th>
                      <th>{t('inventory.accessType')}</th>
                      <th>{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{inventory.creator?.name || '-'}</td>
                      <td>{inventory.creator?.email || '-'}</td>
                      <td>
                        <span className="badge bg-primary">{t('inventory.owner')}</span>
                      </td>
                      <td>-</td>
                    </tr>
                    {inventory.accessList && inventory.accessList.length > 0 ? (
                      inventory.accessList.map((access: any) => (
                        <tr key={access.userId}>
                          <td>{access.user?.name || '-'}</td>
                          <td>{access.user?.email || '-'}</td>
                          <td>
                            <span className="badge bg-success">{t('inventory.hasAccess')}</span>
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveAccess(access.userId)}
                              disabled={user?.id === access.userId}
                            >
                              {t('inventory.revokeAccess')}
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          {t('inventory.noUsersWithAccess')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            <div>{t('inventory.noAccessControl')}</div>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}
