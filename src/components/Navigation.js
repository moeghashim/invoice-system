import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/invoices">
          <img
            src="/assets/images/logo.png"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Al Rayyan Furniture Logo"
          />
          Invoice App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/invoices">Invoices</Nav.Link>
          </Nav>
          {currentUser && (
            <Nav>
              <span className="navbar-text me-3">
                Logged in as: {currentUser.username}
              </span>
              <Button 
                variant="outline-secondary" 
                onClick={handleLogout}
                size="sm"
              >
                Logout
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
