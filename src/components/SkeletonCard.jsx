import React from 'react';
import styled from 'styled-components';

const SkeletonCard = styled.div`
  background: #f0f0f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const SkeletonText = styled.div`
  background: #e0e0e0;
  height: 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;

  &:last-child {
    width: 50%;
  }
`;

export const SkeletonLoader = () => (
  <>
    {[...Array(5)].map((_, index) => (
      <SkeletonCard key={index}>
        <SkeletonText />
        <SkeletonText />
        <SkeletonText />
      </SkeletonCard>
    ))}
  </>
);