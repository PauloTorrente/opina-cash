import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../../context/AuthContext';
import {
  NavbarContainer,
  Brand,
  LeftSection,
  Hamburger,
  Sidebar,
  Overlay,
  CloseButton,
  NavLink,
  LogoutButton,
} from './Navbar.styles';

const sidebarVariants = {
  hidden: { x: '-100%', y: 30, opacity: 0 },
  visible: { x: 0, y: 0, opacity: 1 },
  exit: { x: '-100%', y: 30, opacity: 0 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    function handleOutsideClick(e) {
      const sidebar = document.getElementById('sidebar');
      const hamburger = document.getElementById('hamburger');
      if (
        sidebar && !sidebar.contains(e.target) &&
        hamburger && !hamburger.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <>
      <NavbarContainer>
        <LeftSection>
          <Hamburger
            id="hamburger"
            className={isOpen ? 'open' : ''}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
            aria-expanded={isOpen}
          >
            <div />
            <div />
            <div />
          </Hamburger>
        </LeftSection>
      </NavbarContainer>

      <AnimatePresence>
        {isOpen && (
          <>
            <Overlay
              key="overlay"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            <Sidebar
              key="sidebar"
              id="sidebar"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <CloseButton onClick={() => setIsOpen(false)} aria-label="Fechar menu">&times;</CloseButton>
              <NavLink as={Link} to="/" onClick={() => setIsOpen(false)}>Inicio</NavLink>
              {user ? (
                <>
                  {user.role.toLowerCase() === 'admin' && (
                    <>
                      <NavLink as={Link} to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                      <NavLink as={Link} to="/results" onClick={() => setIsOpen(false)}>Resultados</NavLink>
                      <NavLink as={Link} to="/create-survey" onClick={() => setIsOpen(false)}>Crear Encuesta</NavLink>
                    </>
                  )}
                  <LogoutButton onClick={() => { handleLogout(); setIsOpen(false); }}>
                    Cerrar sesión
                  </LogoutButton>
                </>
              ) : (
                <>
                  <NavLink as={Link} to="/login" onClick={() => setIsOpen(false)}>Iniciar sesión</NavLink>
                  <NavLink as={Link} to="/register" onClick={() => setIsOpen(false)}>Registrarse</NavLink>
                </>
              )}
            </Sidebar>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
