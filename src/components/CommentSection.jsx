import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Animação de entrada
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const CommentContainer = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const CommentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const CommentList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #6c63ff;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const CommentItem = styled(motion.div)`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const QuestionText = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const AnswerText = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
`;

const CommentSection = ({ comments }) => {
  // Agrupa comentários por pergunta
  const groupedComments = comments.reduce((acc, comment) => {
    if (!acc[comment.question]) {
      acc[comment.question] = [];
    }
    acc[comment.question].push(comment);
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

export default CommentSection;