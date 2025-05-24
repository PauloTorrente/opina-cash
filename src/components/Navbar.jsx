import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';

// Navbar container styled component
const NavbarContainer = styled.nav`
  position: fixed; // Fixes the navbar at the top
  top: 0;
  left: 0;
  width: 100%; // Make navbar span across the entire width
  background-color: #6c63ff; // Purple background color
  padding: 1rem; // Padding inside navbar
  display: flex; // Flexbox layout for navbar items
  justify-content: space-between; // Distribute items with space between
  align-items: center; // Center items vertically
  z-index: 1000; // Ensure navbar is above other elements
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Shadow effect for navbar
`;

// Styled component for navigation links (for mobile)
const NavLinks = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  position: fixed;
  top: 60px;
  left: 0;
  background-color: #6c63ff;
  width: 100%;
  padding: 1rem;

  @media (min-width: 769px) {
    flex-direction: row; // Align links horizontally on larger screens
    position: initial;
    background-color: transparent;
    width: auto;
    padding: 0;
  }

  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')}; // Toggle display based on $isOpen
`;

// Styled component for each individual nav link
const NavLink = styled(Link)`
  color: white; // White text color
  text-decoration: none; // Remove underline
  font-size: 1rem;
  padding: 0.5rem;

  // Increase font size on larger screens
  @media (min-width: 769px) {
    font-size: 1.2rem;
  }

  &:hover {
    text-decoration: underline; // Underline on hover
  }
`;

// Styled button for logout
const LogoutButton = styled.button`
  background-color: #f7b7a3; // Light pink background
  color: white; // White text color
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px; // Rounded corners
  cursor: pointer;

  @media (min-width: 769px) {
    font-size: 1.1rem; // Adjust font size on larger screens
  }

  &:hover {
    background-color: #f4a59d; // Darker pink on hover
  }
`;

// Styled component for hamburger icon
const Hamburger = styled(motion.div)`
  display: flex;
  flex-direction: column;
  cursor: pointer;

  @media (min-width: 769px) {
    display: flex;
  }

  div {
    width: 25px;
    height: 3px;
    background-color: white; // White color for hamburger bars
    margin: 4px 0;
  }
`;

// Centered text container (for branding or title)
const CenterText = styled.div`
  flex: 1;
  text-align: center;

  @media (min-width: 769px) {
    text-align: left; // Align text left on larger screens
  }
`;

// Navbar component
const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { user, logout } = useContext(AuthContext); // Accessing AuthContext to get user data and logout function
  const [isOpen, setIsOpen] = useState(false); // State for controlling the mobile menu open/close

  // Logout function to clear user session and redirect to login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Animation variants for hamburger icon
  const hamburgerVariants = {
    open: { rotate: 45, y: 5 }, // Rotate and shift bars when open
    closed: { rotate: 0, y: 0 }, // Reset to original state when closed
  };

  // Animation variants for menu (slide-in/out)
  const menuVariants = {
    open: { x: 0, opacity: 1 }, // Menu visible when open
    closed: { x: '-100%', opacity: 0 }, // Menu hidden when closed
  };

  return (
    <NavbarContainer>
      {/* Hamburger menu to toggle the navigation links */}
      <Hamburger
        onClick={() => setIsOpen(!isOpen)} // Toggle the state of isOpen
        animate={isOpen ? 'open' : 'closed'} // Apply animation based on isOpen
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

      {/* Branding or title (centered) */}
      <CenterText>
        <NavLink to="/">OpinaCash</NavLink>
      </CenterText>

      {/* Animated menu that appears/disappears based on isOpen */}
      <AnimatePresence>
        {isOpen && (
          <NavLinks
            $isOpen={isOpen} // Pass isOpen state to control visibility
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {user ? ( // Check if user is logged in
              <>
                {/* Show dashboard link only for admin users */}
                {user.role.toLowerCase() === 'admin' && (
                  <>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/results">Resultados</NavLink>
                    <NavLink to="/create-survey">Crear Encuesta</NavLink>
                  </>
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
