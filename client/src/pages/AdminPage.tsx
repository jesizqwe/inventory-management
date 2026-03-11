import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../services/api';

export default function AdminPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || t('admin.failedToLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleSelectUser = (id: number) => {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.size === 0) {
      alert(t('admin.noUsersSelected'));
      return;
    }

    // Confirm for delete action
    if (action === 'delete' && !window.confirm(t('admin.confirmDelete'))) {
      return;
    }

    // Confirm for demote if user is demoting themselves
    if (action === 'demote' && selectedUsers.has(user?.id || -1)) {
      if (!window.confirm(t('admin.confirmDemoteSelf'))) {
        return;
      }
    }

    setBulkActionLoading(true);
    try {
      const ids = Array.from(selectedUsers);
      switch (action) {
        case 'block':
          await Promise.all(ids.map(id => adminApi.blockUser(id)));
          break;
        case 'unblock':
          await Promise.all(ids.map(id => adminApi.unblockUser(id)));
          break;
        case 'promote':
          await Promise.all(ids.map(id => adminApi.promote(id)));
          break;
        case 'demote':
          await Promise.all(ids.map(id => adminApi.demote(id)));
          if (selectedUsers.has(user?.id || -1)) {
            logout();
            return;
          }
          break;
        case 'delete':
          await Promise.all(ids.map(id => adminApi.deleteUser(id)));
          break;
      }
      setSelectedUsers(new Set());
      loadUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setBulkActionLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{t('admin.accessDenied')}</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">{t('admin.userManagement')}</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Bulk Actions Toolbar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 p-3 rounded" data-bs-theme="inherit">
        <span className="text-muted mb-2 mb-md-0">
          {t('admin.selected', { count: selectedUsers.size })}
        </span>

        <div className="d-flex flex-wrap gap-2">
          <Button
            variant="warning"
            size="sm"
            disabled={selectedUsers.size === 0 || bulkActionLoading}
            onClick={() => handleBulkAction('block')}
          >
            {t('admin.blockSelected')}
          </Button>
          <Button
            variant="success"
            size="sm"
            disabled={selectedUsers.size === 0 || bulkActionLoading}
            onClick={() => handleBulkAction('unblock')}
          >
            {t('admin.unblockSelected')}
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            disabled={selectedUsers.size === 0 || bulkActionLoading}
            onClick={() => handleBulkAction('promote')}
          >
            {t('admin.promoteSelected')}
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            disabled={selectedUsers.size === 0 || bulkActionLoading}
            onClick={() => handleBulkAction('demote')}
          >
            {t('admin.demoteSelected')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={selectedUsers.size === 0 || bulkActionLoading}
            onClick={() => handleBulkAction('delete')}
          >
            {t('admin.deleteSelected')}
          </Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>
              <Form.Check
                type="checkbox"
                checked={selectedUsers.size === users.length && users.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th>{t('admin.id')}</th>
            <th>{t('admin.name')}</th>
            <th>{t('admin.email')}</th>
            <th>{t('admin.role')}</th>
            <th>{t('admin.status')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedUsers.has(u.id)}
                  onChange={() => toggleSelectUser(u.id)}
                />
              </td>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Badge bg={u.role === 'ADMIN' ? 'danger' : 'secondary'}>
                  {u.role}
                </Badge>
              </td>
              <td>
                {u.isBlocked ? (
                  <Badge bg="danger">{t('admin.blocked')}</Badge>
                ) : (
                  <Badge bg="success">{t('admin.active')}</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
