import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Menu inverted borderless style={{ padding: '0.3rem', marginBottom: '20px' }} attached="top">
      <Container>
        <Menu.Item>
          <h2>Crud usuarios con imagenes</h2>
        </Menu.Item>
        <Menu.Item position="right">
          <Button size="mini" primary onClick={() => navigate('/add')}>
            Añadir Usuario
          </Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
}

export default NavBar;
