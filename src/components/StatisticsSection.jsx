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

const Container = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const StatItem = styled(motion.div)`
  margin-bottom: 1.25rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatLabel = styled.span`
  font-size: 1rem;
  color: #666;
  display: block;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
  color: #1a1a1a;
`;

const StatisticsSection = ({ responses }) => {
  // Calcula o total de respostas
  const totalResponses = responses.length;

  // Agrupa respostas por pergunta
  const responsesByQuestion = responses.reduce((acc, response) => {
    if (!acc[response.question]) {
      acc[response.question] = [];
    }
    acc[response.question].push(response.answer);
    return acc;
  }, {});

  // Encontra a resposta mais comum para cada pergunta
  const mostCommonAnswers = Object.keys(responsesByQuestion).map(question => {
    const answers = responsesByQuestion[question];
    const answerCounts = answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {});
    const mostCommon = Object.keys(answerCounts).reduce((a, b) => answerCounts[a] > answerCounts[b] ? a : b);
    return { question, mostCommon };
  });

  return (
    <Container
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Title>Estadísticas</Title>

      <StatItem variants={itemVariants}>
        <StatLabel>Total de respuestas:</StatLabel>
        <StatValue>{totalResponses}</StatValue>
      </StatItem>

      {mostCommonAnswers.map((item, index) => (
        <StatItem key={index} variants={itemVariants}>
          <StatLabel>Respuesta más común para "{item.question}":</StatLabel>
          <StatValue>{item.mostCommon}</StatValue>
        </StatItem>
      ))}
    </Container>
  );
};

export default StatisticsSection;