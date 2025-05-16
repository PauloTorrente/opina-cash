import styled, { keyframes } from 'styled-components';

// Pulse animation for valid state
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

// Styled button component with all UX enhancements
const ButtonStyled = styled.button`
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  background-color: ${(props) => 
    props.$valid ? '#6c63ff' : '#a5a1ff'};
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: ${(props) => (props.$valid ? 'pointer' : 'not-allowed')};
  transition: all 0.3s ease;
  box-shadow: ${(props) => 
    props.$valid ? '0 4px 6px rgba(108, 99, 255, 0.2)' : 'none'};
  opacity: ${(props) => (props.$valid ? 1 : 0.8)};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${(props) => 
      props.$valid ? 'scale(1.03)' : 'none'};
    background-color: ${(props) => 
      props.$valid ? '#5a52d6' : '#a5a1ff'};
  }

  &:active {
    transform: ${(props) => 
      props.$valid ? 'scale(0.98)' : 'none'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover::after {
    transform: ${(props) => 
      props.$valid ? 'translateX(100%)' : 'none'};
  }

  ${(props) => 
    props.$valid && 
    `animation: ${pulse} 2s infinite ease-in-out;`}
`;

// Enhanced Button component with validation states
const Button = ({ 
  fullWidth, 
  valid = false, 
  children, 
  ...props 
}) => {
  return (
    <ButtonStyled 
      $fullWidth={fullWidth} 
      $valid={valid}
      aria-disabled={!valid}
      {...props}
    >
      {children}
    </ButtonStyled>
  );
};

export default Button;