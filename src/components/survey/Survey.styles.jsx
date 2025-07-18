import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Containers
export const Container = styled.div`
  padding: 1rem;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;

  @media (min-width: 768px) {
    max-width: 600px;
    padding: 2rem;
  }
`;

export const QuestionContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  text-align: left;
`;

export const MediaContainer = styled.div`
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
`;

// Typography
export const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #6c63ff;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

export const QuestionText = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #34495e;

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const Message = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: #4a5568;
  margin-bottom: 1.5rem;
`;

// Form elements
export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #6c63ff;
  font-size: 1rem;
  background-color: #f8f9fa;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
  margin: 1rem 0;
`;

// Media components
export const ResponsiveImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: ${props => props.$isVertical ? 'contain' : 'cover'};
  max-height: ${props => props.$isVertical ? '500px' : '250px'};
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: block;
  
  ${props => props.$isVertical && `
    margin-left: auto;
    margin-right: auto;
    width: auto;
    max-width: 100%;
  `}
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
    border-radius: 8px;
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

// Button components
export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: #5a52d6;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const InputFieldStyled = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: #f8f9fa;
  margin-top: 0.5rem;
  border: 1px solid #6c63ff;
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
    box-shadow: 0 0 0 2px rgba(108,99,255,0.2);
  }
`;

// Survey Already Responded Components
export const AlreadyRespondedContainer = styled(Container)`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

export const TimerContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #edf2f7;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  animation: ${pulse} 2s infinite;
  
  svg {
    margin-right: 0.5rem;
    font-size: 1.5rem;
  }
`;

export const RedirectText = styled.span`
  font-size: 0.9rem;
  color: #4a5568;
`;

export const CharacterCounter = styled.div`
  text-align: right;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  color: ${props => {
    if (props.$current > props.$max) return '#e53e3e';
    if (props.$current > props.$max * 0.8) return '#dd6b20';
    return '#718096';
  }};
`;

// Warning Message
export const WarningMessage = styled.div`
  background-color: #fffaf0;
  border-left: 4px solid #dd6b20;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 4px 4px 0;
  text-align: left;
  
  p {
    margin: 0;
    color: #744210;
  }
`;
