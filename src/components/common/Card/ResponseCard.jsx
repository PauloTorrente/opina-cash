import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; 

// Styled component for the card container
const Card = styled(motion.div)`
  background: #ffffff; // White background color
  border-radius: 12px; // Rounded corners for the card
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // Light shadow for depth effect
  padding: 1.5rem; // Padding inside the card
  margin-bottom: 1rem; // Margin below the card
  transition: transform 0.2s ease, box-shadow 0.2s ease; // Smooth transition for hover effects

  // Hover effect to lift the card and increase shadow
  &:hover {
    transform: translateY(-5px); // Moves the card up slightly
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); // Increases shadow depth on hover
  }
`;

// Styled component for the question text
const Question = styled.h4`
  font-size: 1rem; // Font size for the question
  font-weight: 600; // Bold text for question
  color: #1a1a1a; // Dark color for the question
  margin-bottom: 0.5rem; // Margin below the question
`;

// Styled component for the answer text
const Answer = styled.p`
  font-size: 0.875rem; // Slightly smaller font for the answer
  color: #666; // Lighter color for the answer text
`;

// ResponseCard component that takes a 'response' prop and displays the question and answer
const ResponseCard = ({ response }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }} // Initial state: invisible and 20px below
      animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
      transition={{ duration: 0.3 }} // Transition duration for the animation
    >
      <Question>{response.question}</Question> {/* Displaying the question */}
      <Answer>{JSON.stringify(response.answer)}</Answer> {/* Displaying the answer as a string */}
    </Card>
  );
};

export default ResponseCard;
