import styled from 'styled-components';
import { FaFilter } from 'react-icons/fa';

export const ControlsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.7rem 1rem;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52,152,219,0.2);
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background: ${props => props.active ? '#3498db' : '#ecf0f1'};
  color: ${props => props.active ? 'white' : 'inherit'};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#2980b9' : '#bdc3c7'};
  }
`;

const SearchControls = ({ searchTerm, setSearchTerm, onFilterToggle, isFilterActive }) => {
  return (
    <ControlsContainer>
      <SearchInput 
        type="text" 
        placeholder="Buscar por nome, email ou cidade..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FilterButton 
        onClick={onFilterToggle}
        active={isFilterActive}
      >
        <FaFilter /> {isFilterActive ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </FilterButton>
    </ControlsContainer>
  );
};

export default SearchControls;
