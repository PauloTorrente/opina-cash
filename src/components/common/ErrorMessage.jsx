import { styled , keyframes } from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  animation: ${fadeIn} 0.5s ease-out;
`;

function ErrorMessage({ error }) {
  return (
    <ErrorContainer>
      <FaExclamationTriangle size={48} color="#e74c3c" />
      <p>{error}</p>
    </ErrorContainer>
  );
}

export default ErrorMessage;