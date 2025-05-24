import styled, { keyframes } from 'styled-components';
import { FaTimes } from 'react-icons/fa';

// Local animation fallback
const localFadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeaderContainer = styled.div`
  background: white;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${({ theme }) => theme?.animations?.fadeIn || localFadeIn} 0.5s ease-out;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  background: none;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #ffe9e7;
  }
`;

const ResultsHeader = ({ filteredCount, totalCount, hasActiveFilters, onClear }) => {
  return (
    <HeaderContainer>
      <p style={{ margin: 0 }}>
        Mostrando <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> usuários
      </p>
      {hasActiveFilters && (
        <ClearButton onClick={onClear}>
          <FaTimes /> Limpar filtros
        </ClearButton>
      )}
    </HeaderContainer>
  );
};

export default ResultsHeader;
