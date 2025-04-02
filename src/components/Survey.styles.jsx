import styled from 'styled-components';

// Container for the entire survey
export const Container = styled.div`
  padding: 2rem; // Add padding around the container
  max-width: 600px; // Set max width of the survey
  margin: 0 auto; // Center the survey horizontally
  text-align: center; // Center the text inside the container
`;

// Title of the survey
export const Title = styled.h1`
  color: #6c63ff; // Purple color for the title
  margin-bottom: 1.5rem; // Add space below the title
`;

// Container for each survey question
export const QuestionContainer = styled.div`
  margin-bottom: 1.5rem; // Space below each question container
`;

// Style for the question text
export const QuestionText = styled.h3`
  color: #333; // Dark gray color for the question text
  margin-bottom: 1rem; // Add space below the question text
`;

// Style for the select dropdown input
export const Select = styled.select`
  width: 100%; // Make the select input take up the full width
  padding: 0.8rem; // Add padding inside the select input
  margin: 1rem 0; // Add space above and below the select input
  border: 1px solid #6c63ff; // Purple border color
  border-radius: 8px; // Rounded corners for the select input
  font-size: 1rem; // Set font size for the text inside the select input
`;

// Container for radio button group
export const RadioGroup = styled.div`
  text-align: left; // Align radio buttons to the left
  margin: 1rem 0; // Add space above and below the radio group
`;

// Style for each radio button label
export const RadioLabel = styled.label`
  display: block; // Make the label display as a block element
  margin: 0.5rem 0; // Add space above and below each radio label
`;
