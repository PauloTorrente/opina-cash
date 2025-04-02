import React from 'react';
import styled, { keyframes } from 'styled-components';

// Rotation animation for the spinner
const rotate = keyframes`
  from {
    transform: rotate(0deg); // Start at 0 degrees
  }
  to {
    transform: rotate(360deg); // Rotate to 360 degrees
  }
`;

// Styled div for the spinner
const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1); // Light gray border around the spinner
  border-top: 4px solid #6c63ff; // Purple border on top for the spinning effect
  border-radius: 50%; // Makes the div circular
  width: 40px; // Set the width of the spinner
  height: 40px; // Set the height of the spinner (same as width to keep it circular)
  animation: ${rotate} 1s linear infinite; // Apply the rotation animation (1 second duration, infinite loop)
  margin: 0 auto; // Center the spinner horizontally
`;

// Styled container to center the spinner vertically and horizontally
const LoadingContainer = styled.div`
  display: flex; // Use flexbox to center the spinner
  justify-content: center; // Center horizontally
  align-items: center; // Center vertically
  padding: 1rem; // Padding around the container for spacing
`;

// LoadingSpinner component that renders the spinner inside a centered container
const LoadingSpinner = () => {
  return (
    <LoadingContainer>
      <Spinner />
    </LoadingContainer>
  );
};

export default LoadingSpinner; // Export the LoadingSpinner component for use elsewhere

