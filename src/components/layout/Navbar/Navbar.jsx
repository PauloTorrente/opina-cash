import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../../context/AuthContext';
import { useTranslation } from '../../../i18n/LanguageContext';
import {
  NavbarContainer,
  Brand,
  LeftSection,
  Hamburger,
  Sidebar,
  Overlay,
  CloseButton,
  NavLink,
  LanguageSwitcher,
  LanguageOption,
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
  const { t, language, setLanguage } = useTranslation();

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
            aria-label={t('navbar.menuAriaLabel')}
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
              <CloseButton onClick={() => setIsOpen(false)} aria-label={t('navbar.closeMenuAriaLabel')}>&times;</CloseButton>
              <NavLink as={Link} to="/" onClick={() => setIsOpen(false)}>{t('navbar.home')}</NavLink>
              {user ? (
                <>
                  <NavLink as={Link} to="/profile" onClick={() => setIsOpen(false)}>{t('navbar.myProfile')}</NavLink>
                  <LogoutButton onClick={() => { handleLogout(); setIsOpen(false); }}>
                    {t('navbar.logout')}
                  </LogoutButton>
                </>
              ) : (
                <>
                  <NavLink as={Link} to="/login" onClick={() => setIsOpen(false)}>{t('navbar.login')}</NavLink>
                  <NavLink as={Link} to="/register" onClick={() => setIsOpen(false)}>{t('navbar.register')}</NavLink>
                </>
              )}
              <LanguageSwitcher>
                <LanguageOption $active={language === 'es'} onClick={() => setLanguage('es')}>ES</LanguageOption>
                <LanguageOption $active={language === 'pt-BR'} onClick={() => setLanguage('pt-BR')}>PT-BR</LanguageOption>
              </LanguageSwitcher>
            </Sidebar>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
