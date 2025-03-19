import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: #ffe6e6;
  border: 1px solid #ff4d4d;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
`;

const ErrorList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ErrorItem = styled.li`
  color: #ff4d4d;
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;

const ErrorDisplay = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <ErrorContainer>
      <ErrorList>
        {errors.map((error, index) => (
          <ErrorItem key={index}>{error}</ErrorItem>
        ))}
      </ErrorList>
    </ErrorContainer>
  );
};

export default ErrorDisplay;