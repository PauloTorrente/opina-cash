import React from 'react';
import styled from 'styled-components';

// Styled component for the skeleton card, which will be used as a placeholder for content while loading
const SkeletonCard = styled.div`
  background: #f0f0f0; // Light gray background to simulate loading state
  border-radius: 12px; // Rounded corners for a smooth appearance
  padding: 1.5rem; // Padding around the content
  margin-bottom: 1rem; // Space between skeleton cards
  animation: pulse 1.5s infinite; // Animation that gives a pulsing effect to indicate loading state

  // Keyframes for the pulse animation (changes opacity from 0.6 to 1 and back to 0.6)
  @keyframes pulse {
    0% {
      opacity: 0.6; // Starting opacity (faded)
    }
    50% {
      opacity: 1; // Full opacity (visible)
    }
    100% {
      opacity: 0.6; // Returning to starting opacity (faded)
    }
  }
`;

// Styled component for the skeleton text, which will simulate the loading state of a text line
const SkeletonText = styled.div`
  background: #e0e0e0; // Darker gray background for text lines
  height: 1rem; // Fixed height to simulate text
  border-radius: 4px; // Rounded edges for the text lines
  margin-bottom: 0.5rem; // Space between each line of skeleton text

  // If this is the last skeleton text item, reduce the width to 50% to simulate a shorter line
  &:last-child {
    width: 50%;
  }
`;

// SkeletonLoader component that renders multiple skeleton cards as loading placeholders
export const SkeletonLoader = () => (
  <>
    {/* Creating an array of 5 elements to represent 5 loading skeleton cards */}
    {[...Array(5)].map((_, index) => (
      <SkeletonCard key={index}>
        <SkeletonText /> {/* Placeholder for the first line of text */}
        <SkeletonText /> {/* Placeholder for the second line of text */}
        <SkeletonText /> {/* Placeholder for the third line of text */}
      </SkeletonCard>
    ))}
  </>
);
