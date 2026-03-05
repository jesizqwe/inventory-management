import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">{t('auth.login')}</Card.Title>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t('auth.email')}</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('auth.password')}</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? t('common.loading') : t('auth.login')}
            </Button>

            <div className="text-center">
              <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/auth/google`} className="btn btn-danger w-100 mb-2">
                {t('auth.loginWithGoogle')}
              </a>
              <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/auth/github`} className="btn btn-dark w-100 mb-3">
                {t('auth.loginWithGithub')}
              </a>
            </div>

            <div className="text-center">
              <span>{t('auth.noAccount')}</span>{' '}
              <Link to="/register">{t('nav.register')}</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
