import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function NavBar() {
  const { t } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" variant={theme} bg={theme} className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Inventory App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">{t('nav.home')}</Nav.Link>
            <Nav.Link as={Link} to="/inventories">{t('nav.inventories')}</Nav.Link>
            <Nav.Link as={Link} to="/search">{t('nav.search')}</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={toggleTheme} style={{ cursor: 'pointer' }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </Nav.Link>

            <NavDropdown title={language === 'en' ? 'EN' : 'RU'}>
              <NavDropdown.Item onClick={() => changeLanguage('en')}>
                {t('lang.en')}
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('ru')}>
                {t('lang.ru')}
              </NavDropdown.Item>
            </NavDropdown>

            {user ? (
              <>
                <Nav.Link as={Link} to={`/profile/${user.id}`}>{t('nav.profile')}</Nav.Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin">{t('nav.admin')}</Nav.Link>
                )}
                <Nav.Link onClick={handleLogout}>{t('nav.logout')}</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">{t('nav.login')}</Nav.Link>
                <Nav.Link as={Link} to="/register">{t('nav.register')}</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
