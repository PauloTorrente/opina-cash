import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Container for the success message with padding and centered text
const Container = styled.div`
  padding: 2rem;
  text-align: center; // Center the text inside the container
`;

// Title for the success message, styled with green color
const SuccessTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #28a745; // Green color for success
`;

// Message paragraph that shows additional information about the survey
const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem; // Space below the message
`;

// Container for the link input and copy button, aligned horizontally
const CopyContainer = styled.div`
  display: flex;
  align-items: center; // Vertically align the items in the center
  justify-content: center; // Center items horizontally
  gap: 1rem; // Space between input and button
  margin-bottom: 1rem; // Space below the container
`;

// Styled input field for displaying the link, with some padding and border
const LinkInput = styled.input`
  width: 80%; // Takes 80% of the container width
  padding: 0.75rem; // Padding inside the input
  border: 2px solid #ddd; // Light border color
  border-radius: 6px; // Rounded corners
  font-size: 1rem;
  text-align: center; // Center the text inside the input
  background-color: #f9f9f9; // Light background color
`;

// Button to copy the link, styled with a blue background
const CopyButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: #007bff; // Blue background color
  border: none;
  color: #fff; // White text color
  font-size: 1rem;
  border-radius: 6px; // Rounded corners
  cursor: pointer; // Pointer cursor when hovering over the button
  &:hover {
    background-color: #0056b3; // Darker blue when hovered
  }
`;

// Main component to show the success message after survey creation
const SurveyCreatedSuccess = ({ survey, accessToken }) => {
  // Link for the survey created, using the accessToken
  const link = `https://www.opinacash.com/survey/respond?accessToken=${accessToken}`;
  const [copySuccess, setCopySuccess] = useState(''); // State to show copy success message

  // Function to handle copying the link to the clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess('¡Copiado!'); // Show success message
      setTimeout(() => setCopySuccess(''), 2000); // Clear success message after 2 seconds
    });
  };

  return (
    <Container as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SuccessTitle>¡Encuesta creada con éxito!</SuccessTitle>
      <Message>
        La encuesta <strong>{survey.title}</strong> ha sido creada correctamente.
      </Message>
      <CopyContainer>
        <LinkInput type="text" value={link} readOnly /> {/* Display the link, read-only */}
        <CopyButton onClick={handleCopy}>Copiar</CopyButton> {/* Button to copy the link */}
      </CopyContainer>
      {copySuccess && <p>{copySuccess}</p>} {/* Show the success message if link is copied */}
    </Container>
  );
};

export default SurveyCreatedSuccess; // Export the component for use in other parts of the app
