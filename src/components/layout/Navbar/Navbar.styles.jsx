import styled from 'styled-components';
import { motion } from 'framer-motion';

export const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #6c63ff;
  padding: 1rem;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  z-index: 1001;
`;

export const Brand = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Hamburger = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  z-index: 1101;

  div {
    width: 25px;
    height: 3px;
    background-color: white;
    margin: 4px 0;
    transition: all 0.3s ease;
  }

  &.open div:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  &.open div:nth-child(2) {
    opacity: 0;
  }

  &.open div:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
`;

export const Sidebar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: #6c63ff;
  padding: 80px 2rem 1rem;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);

  @media (min-width: 1024px) {
    width: 450px;
    padding: 80px 3rem 1rem;
    gap: 2rem;
  }
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 2.5rem;
  color: white;
  cursor: pointer;

  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

export const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    text-decoration: none;
    background-color: rgba(255, 255, 255, 0.15);
  }

  @media (min-width: 1024px) {
    font-size: 1.5rem;
    padding: 1rem 1.5rem;
  }
`;

export const LogoutButton = styled.button`
  background-color: #f7b7a3;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f4a59d;
  }

  @media (min-width: 1024px) {
    font-size: 1.4rem;
    padding: 0.9rem 1.8rem;
  }
`;
