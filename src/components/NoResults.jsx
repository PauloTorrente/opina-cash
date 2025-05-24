import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const NoResultsContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  animation: ${({ theme }) => theme.animations.fadeIn} 0.5s ease-out;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const ClearButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2980b9;
  }
`;

function NoResults({ hasActiveFilters, onClear }) {
  return (
    <NoResultsContainer>
      <Message>No se encontraron usuarios que coincidan con tus filtros</Message>
      {hasActiveFilters && (
        <ClearButton onClick={onClear}>
          <FaTimes />
          Limpiar filtros
        </ClearButton>
      )}
    </NoResultsContainer>
  );
}

export default NoResults;
