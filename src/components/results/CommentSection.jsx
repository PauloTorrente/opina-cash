import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Animation settings for the comment container
const containerVariants = {
  hidden: { opacity: 0, y: 20 }, // Starts slightly below with no opacity
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Moves to original position with fade-in effect
};

// Animation settings for each comment item
const itemVariants = {
  hidden: { opacity: 0, x: -20 }, // Starts shifted to the left with no opacity
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }, // Moves into position with fade-in effect
};

// Styled container for a comment block
const CommentContainer = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); // Light shadow effect
  margin-bottom: 2rem; // Space between comment sections
`;

// Styled title for the comment section
const CommentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

// Container for the list of comments with scrollbar customization
const CommentList = styled.div`
  max-height: 400px;
  overflow-y: auto; // Enables vertical scrolling
  padding-right: 1rem; // Prevents content from being cut off

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #6c63ff; // Custom scrollbar color
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1; // Light background for scrollbar track
  }
`;

// Each comment item inside the list
const CommentItem = styled(motion.div)`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); // Soft shadow effect
`;

// Styled question text
const QuestionText = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

// Styled answer text
const AnswerText = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
`;

// CommentSection component receives an array of comments
const CommentSection = ({ comments }) => {
  // Groups comments by their associated question
  const groupedComments = comments.reduce((acc, comment) => {
    if (!acc[comment.question]) {
      acc[comment.question] = []; // Creates a new array for the question if it doesn't exist
    }
    acc[comment.question].push(comment); // Adds comment to the corresponding question group
    return acc;
  }, {});

  return (
    <>
      {Object.keys(groupedComments).map((question, index) => (
        <CommentContainer
          key={index}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <CommentTitle>Comentarios</CommentTitle>
          <QuestionText>{question}</QuestionText>
          <CommentList>
            {groupedComments[question].map((comment, idx) => (
              <CommentItem key={idx} variants={itemVariants}>
                <AnswerText>{comment.answer}</AnswerText>
              </CommentItem>
            ))}
          </CommentList>
        </CommentContainer>
      ))}
    </>
  );
};

export default CommentSection; // Exports the CommentSection component
