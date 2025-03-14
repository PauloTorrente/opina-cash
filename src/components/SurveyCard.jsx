import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #888;
`;

const SurveyCard = ({ survey }) => {
  return (
    <Link to={`/results/${survey.id}`} style={{ textDecoration: 'none' }}>
      <Card
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Title>{survey.title}</Title>
        <Description>{survey.description}</Description>
        <Meta>
          <span>Expira em: {new Date(survey.expirationTime).toLocaleDateString()}</span>
        </Meta>
      </Card>
    </Link>
  );
};

export default SurveyCard;