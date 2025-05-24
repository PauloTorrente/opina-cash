import styled from 'styled-components';
import { FaUsers } from 'react-icons/fa';
import { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MegaTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #3498db, #2c3e50);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const BigTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubTitle = styled.p`
  font-size: 1rem;
  margin: 0;
  color: rgba(255,255,255,0.8);
`;

function TitleHeader() {
  return (
    <MegaTitle>
      <BigTitle><FaUsers /> Panel de Usuarios</BigTitle>
      <SubTitle>Administra fácilmente todos los usuarios registrados</SubTitle>
    </MegaTitle>
  );
}

export default TitleHeader;
