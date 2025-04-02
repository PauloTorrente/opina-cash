import React from 'react';
import styled from 'styled-components';

// Styled container to display error messages
const ErrorContainer = styled.div`
  background-color: #ffe6e6; // Light red background for error messages
  border: 1px solid #ff4d4d; // Red border to highlight the error
  border-radius: 8px; // Rounded corners for the error box
  padding: 1rem; // Padding inside the box for spacing
  margin: 1rem 0; // Margin to separate from other content
  text-align: center; // Center align the text inside the error box
`;

// Styled unordered list to hold multiple error messages
const ErrorList = styled.ul`
  list-style: none; // Removing default bullet points
  padding: 0; // Removing padding
  margin: 0; // Removing margin
`;

// Styled list item for each individual error message
const ErrorItem = styled.li`
  color: #ff4d4d; // Red color for error text
  font-size: 0.9rem; // Smaller font size for the error messages
  margin: 0.5rem 0; // Margin between individual error items
`;

// ErrorDisplay component to show errors passed as props
const ErrorDisplay = ({ errors }) => {
  // If no errors, or errors array is empty, return nothing (null)
  if (!errors || errors.length === 0) return null;

  return (
    <ErrorContainer>
      <ErrorList>
        {/* Map through errors array and display each error */}
        {errors.map((error, index) => (
          <ErrorItem key={index}>{error}</ErrorItem> // Display each error in a list item
        ))}
      </ErrorList>
    </ErrorContainer>
  );
};

export default ErrorDisplay; // Exporting the component to use elsewhere
