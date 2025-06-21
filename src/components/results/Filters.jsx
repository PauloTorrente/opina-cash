import React, { useState } from 'react';
import styled from 'styled-components';

// Styled container for the filter options, using flexbox to align items
const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem; // Space between the filter elements
  margin-bottom: 2rem; // Margin below the filter container
`;

// Styled select dropdown for filtering options
const Select = styled.select`
  padding: 0.5rem; // Padding for the select box
  border: 1px solid #ccc; // Light border color
  border-radius: 8px; // Rounded corners for the select box
  font-size: 1rem; // Font size for the options inside the select
`;

// Filters component to handle the filter selection
const Filters = ({ onFilterChange }) => {
  const [filter, setFilter] = useState('all'); // State to store the current selected filter

  // Handle the change in filter selection
  const handleFilterChange = (e) => {
    const value = e.target.value; // Get the selected filter value
    setFilter(value); // Update the state with the new filter
    onFilterChange(value); // Pass the selected filter value to the parent component
  };

  return (
    <FiltersContainer>
      <Select value={filter} onChange={handleFilterChange}>
        {/* Option for showing all filters */}
        <option value="all">Todas</option>
        {/* Option for filtering active surveys */}
        <option value="active">Ativas</option>
        {/* Option for filtering expired surveys */}
        <option value="expired">Expiradas</option>
      </Select>
    </FiltersContainer>
  );
};

export default Filters; // Export the Filters component for use in other parts of the app
