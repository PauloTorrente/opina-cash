import { keyframes , styled } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const SuperSimpleContainer = styled.div`
  padding: 1rem;
  max-width: 100%;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
`;
