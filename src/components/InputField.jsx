import styled from 'styled-components';

// Styled input component that accepts props for customization
const Input = styled.input`
  width: 100%; // Input takes up the full width of its container
  padding: 0.8rem; // Padding inside the input for better spacing
  margin: 0.5rem 0; // Margin above and below the input to space it out
  border: 1px solid ${(props) => (props.$error ? '#f00' : '#6c63ff')}; 
  /* Conditional border color:
     - If the $error prop is true, the border color will be red (#f00)
     - Otherwise, it will be purple (#6c63ff) */
  border-radius: 8px; // Rounded corners for the input
  font-size: 1rem; // Font size for the input text
`;

export default Input; // Exporting the Input component for use in other parts of the app
