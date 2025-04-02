import React from 'react';
import styled from 'styled-components'; 
import { motion } from 'framer-motion';

// Animation variants for the container (fade in with slide-up effect)
const containerVariants = {
  hidden: { opacity: 0, y: 20 }, // Initially hidden and slightly moved down
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Fade in and slide up
};

// Animation variants for each item (fade in with slide-right effect)
const itemVariants = {
  hidden: { opacity: 0, x: -20 }, // Initially hidden and slightly moved to the left
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }, // Fade in and slide to the right
};

// Styled container for the statistics section
const Container = styled(motion.div)`
  background-color: #ffffff; // White background for the section
  border-radius: 12px; // Rounded corners for the container
  padding: 1.5rem; // Padding around the content
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); // Soft shadow around the container
`;

// Styled title for the statistics section
const Title = styled.h2`
  font-size: 1.5rem; // Size of the title text
  font-weight: 600; // Make the title bold
  color: #1a1a1a; // Dark color for the title
  margin-bottom: 1.5rem; // Space below the title
`;

// Styled item for each statistic
const StatItem = styled(motion.div)`
  margin-bottom: 1.25rem; // Space between stat items
  padding: 1rem; // Padding inside each stat item
  background-color: #f8f9fa; // Light gray background for the item
  border-radius: 8px; // Rounded corners for each item
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); // Light shadow around the item
`;

// Styled label for each stat
const StatLabel = styled.span`
  font-size: 1rem; // Size of the label text
  color: #666; // Medium gray color for the label
  display: block; // Make it a block element for spacing
  margin-bottom: 0.5rem; // Space below the label
`;

// Styled value for each stat
const StatValue = styled.span`
  font-size: 1.25rem; // Larger size for the value
  font-weight: 500; // Semi-bold text for the value
  color: #1a1a1a; // Dark color for the value
`;

const StatisticsSection = ({ responses }) => {
  // Calculate total responses
  const totalResponses = responses.length;

  // Group responses by question
  const responsesByQuestion = responses.reduce((acc, response) => {
    if (!acc[response.question]) {
      acc[response.question] = [];
    }
    acc[response.question].push(response.answer); // Collect answers for each question
    return acc;
  }, {});

  // Find the most common answer for each question
  const mostCommonAnswers = Object.keys(responsesByQuestion).map(question => {
    const answers = responsesByQuestion[question];
    const answerCounts = answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1; // Count the occurrences of each answer
      return acc;
    }, {});
    const mostCommon = Object.keys(answerCounts).reduce((a, b) => answerCounts[a] > answerCounts[b] ? a : b); // Get the most common answer
    return { question, mostCommon }; // Return the question and the most common answer
  });

  return (
    <Container
      variants={containerVariants} // Apply the container animation
      initial="hidden"
      animate="visible"
    >
      <Title>Estadísticas</Title> {/* Title of the statistics section */}

      <StatItem variants={itemVariants}> {/* Animation for each stat item */}
        <StatLabel>Total de respuestas:</StatLabel> {/* Label for total responses */}
        <StatValue>{totalResponses}</StatValue> {/* Display total responses */}
      </StatItem>

      {/* Render the most common answers for each question */}
      {mostCommonAnswers.map((item, index) => (
        <StatItem key={index} variants={itemVariants}> {/* Animation for each stat item */}
          <StatLabel>Respuesta más común para "{item.question}":</StatLabel> {/* Label for the most common answer */}
          <StatValue>{item.mostCommon}</StatValue> {/* Display the most common answer */}
        </StatItem>
      ))}
    </Container>
  );
};

export default StatisticsSection; 
