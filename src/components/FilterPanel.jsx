import { FaFilter, FaTimes, FaUserShield, FaCheckCircle, FaBaby } from 'react-icons/fa';
import styled from 'styled-components';

const FilterPanelContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterGroupTitle = styled.h4`
  margin: 0 0 0.8rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid ${props => props.active ? '#3498db' : '#ecf0f1'};
  background: ${props => props.active ? '#e1f0fa' : 'white'};
  color: ${props => props.active ? '#3498db' : '#7f8c8d'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    border-color: #3498db;
    color: #3498db;
  }
`;

const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  background: #e74c3c;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background: #c0392b;
  }
`;

const RangeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const RangeInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ecf0f1;
  border-radius: 6px;
  font-size: 0.9rem;
`;

function FilterPanel({ filters, handleFilterChange, clearFilters, searchTerm, setSearchTerm }) {
  return (
    <FilterPanelContainer>
      <FilterHeader>
        <FilterTitle>
          <FaFilter /> Filtros Avanzados
        </FilterTitle>
        <ClearButton onClick={clearFilters}>
          <FaTimes /> Limpiar
        </ClearButton>
      </FilterHeader>

      <FilterGroup>
        <FilterGroupTitle>Estado de cuenta</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.status === 'confirmed'}
            onClick={() => handleFilterChange('status', 'confirmed')}
          >
            <FaCheckCircle /> Confirmados
          </FilterButton>
          <FilterButton
            active={filters.status === 'unconfirmed'}
            onClick={() => handleFilterChange('status', 'unconfirmed')}
          >
            <FaTimes /> No confirmados
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>Tipo de usuario</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.role === 'admin'}
            onClick={() => handleFilterChange('role', 'admin')}
          >
            <FaUserShield /> Administradores
          </FilterButton>
          <FilterButton
            active={filters.role === 'user'}
            onClick={() => handleFilterChange('role', 'user')}
          >
            <FaUserShield /> Usuarios normales
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>Edad</FilterGroupTitle>
        <RangeContainer>
          <RangeInput
            type="number"
            placeholder="Mínimo"
            value={filters.minAge}
            onChange={(e) => handleFilterChange('minAge', e.target.value)}
            min="0"
          />
          <span>a</span>
          <RangeInput
            type="number"
            placeholder="Máximo"
            value={filters.maxAge}
            onChange={(e) => handleFilterChange('maxAge', e.target.value)}
            min="0"
          />
        </RangeContainer>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>Hijos</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.children === 'Sí'}
            onClick={() => handleFilterChange('children', 'Sí')}
          >
            <FaBaby /> Con hijos
          </FilterButton>
          <FilterButton
            active={filters.children === 'No'}
            onClick={() => handleFilterChange('children', 'No')}
          >
            <FaBaby /> Sin hijos
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>Género</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.gender === 'Masculino'}
            onClick={() => handleFilterChange('gender', 'Masculino')}
          >
            Masculino
          </FilterButton>
          <FilterButton
            active={filters.gender === 'Femenino'}
            onClick={() => handleFilterChange('gender', 'Femenino')}
          >
            Femenino
          </FilterButton>
          <FilterButton
            active={filters.gender === 'Otro'}
            onClick={() => handleFilterChange('gender', 'Otro')}
          >
            Otro
          </FilterButton>
          <FilterButton
            active={filters.gender === 'Prefiero no decir'}
            onClick={() => handleFilterChange('gender', 'Prefiero no decir')}
          >
            Prefiero no decir
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>Responsabilidad de compra</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.purchaseResponsibility === 'Sí'}
            onClick={() => handleFilterChange('purchaseResponsibility', 'Sí')}
          >
            Sí
          </FilterButton>
          <FilterButton
            active={filters.purchaseResponsibility === 'No'}
            onClick={() => handleFilterChange('purchaseResponsibility', 'No')}
          >
            No
          </FilterButton>
          <FilterButton
            active={filters.purchaseResponsibility === 'Parcialmente'}
            onClick={() => handleFilterChange('purchaseResponsibility', 'Parcialmente')}
          >
            Parcialmente
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>Nivel educativo</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.educationLevel === 'Primaria'}
            onClick={() => handleFilterChange('educationLevel', 'Primaria')}
          >
            Primaria
          </FilterButton>
          <FilterButton
            active={filters.educationLevel === 'Secundaria'}
            onClick={() => handleFilterChange('educationLevel', 'Secundaria')}
          >
            Secundaria
          </FilterButton>
          <FilterButton
            active={filters.educationLevel === 'Universidad'}
            onClick={() => handleFilterChange('educationLevel', 'Universidad')}
          >
            Universidad
          </FilterButton>
          <FilterButton
            active={filters.educationLevel === 'Posgrado'}
            onClick={() => handleFilterChange('educationLevel', 'Posgrado')}
          >
            Posgrado
          </FilterButton>
          <FilterButton
            active={filters.educationLevel === 'Otro'}
            onClick={() => handleFilterChange('educationLevel', 'Otro')}
          >
            Otro
          </FilterButton>
        </FilterOptions>
      </FilterGroup>
    </FilterPanelContainer>
  );
}

export default FilterPanel;
