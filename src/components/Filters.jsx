import React, { useState } from 'react';
import styled from 'styled-components';

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const Filters = ({ onFilterChange }) => {
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    onFilterChange(value);
  };

  return (
    <FiltersContainer>
      <Select value={filter} onChange={handleFilterChange}>
        <option value="all">Todas</option>
        <option value="active">Ativas</option>
        <option value="expired">Expiradas</option>
      </Select>
    </FiltersContainer>
  );
};

export default Filters;