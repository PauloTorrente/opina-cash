import { motion } from 'framer-motion';
import styled from 'styled-components';

export const HeaderContainer = styled(motion.header)`
  text-align: center;
  padding: 2rem 1rem;
  width: 100%;
`;

export const Title = styled(motion.h1)`
  font-family: 'Poppins', sans-serif;
  color: #6c63ff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

export const TitleDivider = styled(motion.div)`
  width: 80px;
  height: 3px;
  background: #6c63ff;
  margin: 0 auto 2rem;
  border-radius: 2px;

  @media (min-width: 768px) {
    width: 120px;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;
