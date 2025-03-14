// Survey.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

export const Title = styled.h1`
  color: #6c63ff;
  margin-bottom: 1.5rem;
`;

export const QuestionContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const QuestionText = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 1px solid #6c63ff;
  border-radius: 8px;
  font-size: 1rem;
`;

export const RadioGroup = styled.div`
  text-align: left;
  margin: 1rem 0;
`;

export const RadioLabel = styled.label`
  display: block;
  margin: 0.5rem 0;
`;