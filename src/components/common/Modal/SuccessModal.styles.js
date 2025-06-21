import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(12px);
`;

export const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  padding: 2.5rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 480px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #6c63ff, #00ccff);
    z-index: -1;
    border-radius: 25px;
    opacity: 0.3;
  }

  @media (max-width: 500px) {
    padding: 1.8rem;
    border-radius: 20px;
  }
`;

export const ModalTitle = styled.h2`
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(45deg, #6c63ff, #00ccff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;

  @media (max-width: 500px) {
    font-size: 1.5rem;
  }
`;

export const ModalButton = styled(motion.button)`
  background: linear-gradient(45deg, #6c63ff, #00ccff);
  color: white;
  font-size: 1rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 1.5rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(108, 99, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #00ccff, #6c63ff);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    box-shadow: 0 6px 20px rgba(108, 99, 255, 0.4);
    transform: translateY(-2px);
  }
`;

export const CountdownText = styled(motion.p)`
  color: #64748b;
  font-size: 1rem;
  margin-top: 1.5rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(241, 245, 249, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 50px;
`;

export const IconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  background: linear-gradient(45deg, rgba(108, 99, 255, 0.1), rgba(0, 204, 255, 0.1));
  color: #6c63ff;
  font-size: 2.5rem;
`;

export const InfoCard = styled(motion.div)`
  background: rgba(241, 245, 249, 0.6);
  padding: 1.2rem;
  border-radius: 16px;
  margin: 1.5rem 0;
  text-align: left;
  border: 1px solid rgba(226, 232, 240, 0.5);
  backdrop-filter: blur(5px);

  p {
    margin: 0.5rem 0;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;