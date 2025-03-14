import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #6c63ff;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavLinks = styled(motion.div)`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    top: 60px;
    left: 0;
    background-color: #6c63ff;
    width: 100%;
    padding: 1rem;
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background-color: #f7b7a3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f4a59d;
  }
`;

const Hamburger = styled(motion.div)`
  display: none;
  flex-direction: column;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }

  div {
    width: 25px;
    height: 3px;
    background-color: white;
    margin: 4px 0;
  }
`;

const CenterText = styled.div`
  flex: 1;
  text-align: center;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Variantes de animação para o menu de hambúrguer
  const hamburgerVariants = {
    open: { rotate: 45, y: 5 },
    closed: { rotate: 0, y: 0 },
  };

  // Variantes de animação para o menu de links
  const menuVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  return (
    <NavbarContainer>
      <Hamburger
        onClick={() => setIsOpen(!isOpen)}
        animate={isOpen ? 'open' : 'closed'}
        variants={hamburgerVariants}
      >
        <motion.div
          animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        />
        <motion.div
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        />
        <motion.div
          animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
        />
      </Hamburger>

      <CenterText>
        <NavLink to="/">OpinaCash</NavLink>
      </CenterText>

      <AnimatePresence>
        {isOpen && (
          <NavLinks
            $isOpen={isOpen}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {user ? ( // Verifica se o usuário está logado (com base no token)
              <>
                <NavLink to="/survey">Responder Enquetes</NavLink>
                {/* Mostra o link de resultados apenas para administradores */}
                {user.role === 'Admin' && (
                  <NavLink to="/results">Resultados</NavLink>
                )}
                <LogoutButton onClick={handleLogout}>Cerrar sesión</LogoutButton>
              </>
            ) : (
              <>
                <NavLink to="/login">Iniciar sesión</NavLink>
                <NavLink to="/register">Registrarse</NavLink>
              </>
            )}
          </NavLinks>
        )}
      </AnimatePresence>
    </NavbarContainer>
  );
};

export default Navbar;
