import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Containers
export const Container = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

export const QuestionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const MediaContainer = styled.div`
  margin: 1rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

// Typography
export const Title = styled.h1`
  color: #6c63ff;
  margin-bottom: 1.5rem;
`;

export const QuestionText = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

// Form elements
export const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 1px solid #6c63ff;
  border-radius: 8px;
  font-size: 1rem;
`;

// Media components
export const ResponsiveImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ResponsiveVideo = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
  border-radius: 8px;
  background: #000;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

// Modal components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const ModalTitle = styled.h2`
  color: #6c63ff;
  margin-bottom: 1rem;
`;

export const ModalText = styled.p`
  margin-bottom: 2rem;
  color: #555;
`;
