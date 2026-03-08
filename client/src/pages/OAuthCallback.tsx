import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Spinner, Alert, Card } from 'react-bootstrap';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');

    if (token && user) {
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('user', decodeURIComponent(user));
        navigate('/');
      } catch (err) {
        console.error('Failed to save auth data:', err);
        navigate('/login');
      }
    } else {
      // Redirect to login if no token
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Completing login...</p>
        </Card.Body>
      </Card>
    </Container>
  );
}
