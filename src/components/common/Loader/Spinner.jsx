import { keyframes , styled } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
  font-size: 2rem;
  color: #3498db;
`;

export default Spinner;
