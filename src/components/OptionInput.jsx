import React from 'react';
import styled from 'styled-components';

// Styled component for the option input field
const OptionInputField = styled.input`
  width: 100%; // Full width input field
  padding: 1.2rem; // Padding inside the input field
  margin-bottom: 1.5rem; // Space below the input field
  border: 2px solid #ddd; // Light gray border color
  border-radius: 6px; // Rounded corners
  font-size: 1.2rem; // Font size inside the input
  &:focus {
    border-color: #28a745; // Green border when focused
    outline: none; // Remove the default outline
    box-shadow: 0 0 10px rgba(40, 167, 69, 0.5); // Green shadow when focused
  }
`;

// Functional component for an individual option input field
const OptionInput = ({ questionIndex, optionIndex, option, onOptionChange }) => {
  // Handle the change event when the input value is updated
  const handleOptionChange = (e) => {
    const updatedOption = e.target.value; // Get the new value of the input
    onOptionChange(optionIndex, updatedOption); // Call the parent function to update the option
  };

  return (
    <OptionInputField
      type="text" // Input type is text
      placeholder={`Opción ${optionIndex + 1}`} // Placeholder for the option input
      value={option} // Controlled input value
      onChange={handleOptionChange} // Handle input change
      required // Make this field required
    />
  );
};

export default OptionInput;
