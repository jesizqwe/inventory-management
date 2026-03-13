import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Spinner, Card } from 'react-bootstrap';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    console.log('OAuth callback - token:', token ? 'present' : 'missing');
    console.log('OAuth callback - user param:', userParam);

    if (token && userParam) {
      try {
        const decodedUser = decodeURIComponent(userParam);
        console.log('OAuth callback - decoded user:', decodedUser);
        const userObj = JSON.parse(decodedUser);
        console.log('OAuth callback - parsed user object:', userObj);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userObj));
        console.log('OAuth callback - saved to localStorage');

        navigate('/');
      } catch (err) {
        console.error('Failed to save auth data:', err);
        navigate('/login');
      }
    } else {
      console.error('OAuth callback - missing token or user');
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
