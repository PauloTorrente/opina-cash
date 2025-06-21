import styled from 'styled-components';
import { motion } from 'framer-motion';

// Main container styling - sets up the page layout
export const Container = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  padding: 1rem;
  position: relative;
`;

// Logo styling - shows logo with fixed dimensions
export const Logo = styled.img`
  width: 300px;
  height: 160px;
  margin-bottom: 1rem;
  object-fit: contain;
`;

// Main title styling with logo-inspired gradient
export const MainTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0.5rem 0;
  background: linear-gradient(
    90deg,
    #007A33,  /* green from "OPINA" */
    #004AAD   /* blue from "CASH" */
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15); // subtle shadow for better legibility
  letter-spacing: -1px;
  line-height: 1.1;
  text-align: center;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

// Subtitle styling below the main title
export const SubTitle = styled.p`
  font-size: 1.2rem;
  color: #334155; // dark slate blue
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
`;

// Section that wraps the survey info and buttons
export const SurveyInfoSection = styled.section`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
  border-radius: 12px;
  text-align: center;
`;

// Variants for framer-motion entrance animation
export const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      staggerChildren: 0.2
    } 
  },
};

// Title entrance animation config
export const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  },
};

// Header container that holds logo and text
export const HeaderContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding: 2rem;
`;

