import { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { userApi } from '../services/api';

interface SalesforceFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  companyWebsite?: string;
  description?: string;
}

interface SalesforceFormModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  userEmail?: string;
  userName?: string;
}

export default function SalesforceFormModal({
  show,
  onHide,
  onSuccess,
  userEmail,
  userName,
}: SalesforceFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {register, handleSubmit, formState: { errors },} = useForm<SalesforceFormData>({
    defaultValues: {
      email: userEmail || '',
    },
  });

  const onSubmit = async (data: SalesforceFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userApi.createSalesforceRecord(data);
      setSuccess(response.data.message);
      
      setTimeout(() => {
        onSuccess();
        onHide();
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Failed to create records in Salesforce. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Connect to Salesforce</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>First Name *</Form.Label>
            <Form.Control
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name *</Form.Label>
            <Form.Control
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              {...register('email', { 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              isInvalid={!!errors.email}
              placeholder="your@email.com"
            />
            <Form.Text className="text-muted">
              Your email from profile will be used if not specified
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              {...register('companyName')}
            />
            <Form.Text className="text-muted">
              Your name will be used if not specified
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Company Website</Form.Label>
            <Form.Control
              type="url"
              {...register('companyWebsite')}
              placeholder="https://example.com"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('description')}
              placeholder="Additional information about you or your company"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creating in Salesforce...
              </>
            ) : (
              'Create Account & Contact'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
