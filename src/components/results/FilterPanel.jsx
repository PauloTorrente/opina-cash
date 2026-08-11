import { FaFilter, FaTimes, FaUserShield, FaCheckCircle, FaBaby } from 'react-icons/fa';
import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';

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
  const { t } = useTranslation();
  return (
    <FilterPanelContainer>
      <FilterHeader>
        <FilterTitle>
          <FaFilter /> {t('filterPanel.title')}
        </FilterTitle>
        <ClearButton onClick={clearFilters}>
          <FaTimes /> {t('filterPanel.clear')}
        </ClearButton>
      </FilterHeader>

      <FilterGroup>
        <FilterGroupTitle>{t('filterPanel.accountStatus')}</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.status === 'confirmed'}
            onClick={() => handleFilterChange('status', 'confirmed')}
          >
            <FaCheckCircle /> {t('filterPanel.confirmed')}
          </FilterButton>
          <FilterButton
            active={filters.status === 'unconfirmed'}
            onClick={() => handleFilterChange('status', 'unconfirmed')}
          >
            <FaTimes /> {t('filterPanel.unconfirmed')}
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>{t('filterPanel.userType')}</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.role === 'admin'}
            onClick={() => handleFilterChange('role', 'admin')}
          >
            <FaUserShield /> {t('filterPanel.admins')}
          </FilterButton>
          <FilterButton
            active={filters.role === 'user'}
            onClick={() => handleFilterChange('role', 'user')}
          >
            <FaUserShield /> {t('filterPanel.regularUsers')}
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>{t('filterPanel.age')}</FilterGroupTitle>
        <RangeContainer>
          <RangeInput
            type="number"
            placeholder={t('filterPanel.minPlaceholder')}
            value={filters.minAge}
            onChange={(e) => handleFilterChange('minAge', e.target.value)}
            min="0"
          />
          <span>{t('filterPanel.rangeSeparator')}</span>
          <RangeInput
            type="number"
            placeholder={t('filterPanel.maxPlaceholder')}
            value={filters.maxAge}
            onChange={(e) => handleFilterChange('maxAge', e.target.value)}
            min="0"
          />
        </RangeContainer>
      </FilterGroup>

      {/* Os valores comparados/enviados (Sí, No, Masculino, etc.) são os
          valores gravados no backend — só o texto exibido é traduzido. */}
      <FilterGroup>
        <FilterGroupTitle>{t('filterPanel.children')}</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.children === 'Sí'}
            onClick={() => handleFilterChange('children', 'Sí')}
          >
            <FaBaby /> {t('filterPanel.withChildren')}
          </FilterButton>
          <FilterButton
            active={filters.children === 'No'}
            onClick={() => handleFilterChange('children', 'No')}
          >
            <FaBaby /> {t('filterPanel.withoutChildren')}
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>{t('filterPanel.gender')}</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.gender === 'Masculino'}
            onClick={() => handleFilterChange('gender', 'Masculino')}
          >
            {t('filterPanel.genderMale')}
          </FilterButton>
          <FilterButton
            active={filters.gender === 'Femenino'}
            onClick={() => handleFilterChange('gender', 'Femenino')}
          >
            {t('filterPanel.genderFemale')}
          </FilterButton>
          <FilterButton
            active={filters.gender === 'Otro'}
            onClick={() => handleFilterChange('gender', 'Otro')}
          >
            {t('filterPanel.genderOther')}
          </FilterButton>
          <FilterButton
            active={filters.gender === 'Prefiero no decir'}
            onClick={() => handleFilterChange('gender', 'Prefiero no decir')}
          >
            {t('filterPanel.genderPreferNotToSay')}
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>{t('filterPanel.purchaseResponsibility')}</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.purchaseResponsibility === 'Sí'}
            onClick={() => handleFilterChange('purchaseResponsibility', 'Sí')}
          >
            {t('filterPanel.yes')}
          </FilterButton>
          <FilterButton
            active={filters.purchaseResponsibility === 'No'}
            onClick={() => handleFilterChange('purchaseResponsibility', 'No')}
          >
            {t('filterPanel.no')}
          </FilterButton>
          <FilterButton
            active={filters.purchaseResponsibility === 'Parcialmente'}
            onClick={() => handleFilterChange('purchaseResponsibility', 'Parcialmente')}
          >
            {t('filterPanel.partially')}
          </FilterButton>
        </FilterOptions>
      </FilterGroup>

      <FilterGroup>
        <FilterGroupTitle>{t('filterPanel.educationLevel')}</FilterGroupTitle>
        <FilterOptions>
          <FilterButton
            active={filters.educationLevel === 'Primaria'}
            onClick={() => handleFilterChange('educationLevel', 'Primaria')}
          >
            {t('filterPanel.educationPrimary')}
          </FilterButton>
          <FilterButton
            active={filters.educationLevel === 'Secundaria'}
            onClick={() => handleFilterChange('educationLevel', 'Secundaria')}
          >
            {t('filterPanel.educationSecondary')}
          </FilterButton>
          <FilterButton
            active={filters.educationLevel === 'Universidad'}
            onClick={() => handleFilterChange('educationLevel', 'Universidad')}
          >
            {t('filterPanel.educationUniversity')}
          </FilterButton>
          <FilterButton
            active={filters.educationLevel === 'Posgrado'}
            onClick={() => handleFilterChange('educationLevel', 'Posgrado')}
          >
            {t('filterPanel.educationPostgraduate')}
          </FilterButton>
          <FilterButton
            active={filters.educationLevel === 'Otro'}
            onClick={() => handleFilterChange('educationLevel', 'Otro')}
          >
            {t('filterPanel.educationOther')}
          </FilterButton>
        </FilterOptions>
      </FilterGroup>
    </FilterPanelContainer>
  );
}

export default FilterPanel;
