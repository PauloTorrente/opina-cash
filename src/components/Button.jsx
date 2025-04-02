import styled from 'styled-components';

// Styled button component with dynamic width based on the fullWidth prop
const ButtonStyled = styled.button`
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')}; // If fullWidth prop is true, button takes full width
  background-color: #6c63ff; // Set the background color of the button
  color: white; // Set text color to white
  font-size: 1.2rem; // Font size of the button text
  padding: 1rem 2rem; // Add padding to the button for better spacing
  border: none; // Remove default border
  border-radius: 50px; // Give the button rounded corners
  cursor: pointer; // Change cursor to pointer when hovering over the button
  transition: transform 0.2s ease; // Smooth transition for scale effect

  &:hover {
    transform: scale(1.05); // Slightly enlarge the button when hovered
  }
`;

// Button component which passes down fullWidth prop to the styled button
const Button = ({ fullWidth, ...props }) => {
  return <ButtonStyled $fullWidth={fullWidth} {...props} />; // Apply the fullWidth prop and other props to the styled button
};

export default Button; // Export the Button component for use in other parts of the app
