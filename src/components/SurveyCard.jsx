import React from 'react'; // Import React for creating the component
import styled from 'styled-components'; // Import styled-components for styling
import { motion } from 'framer-motion'; // Import motion from framer-motion for animations
import { Link } from 'react-router-dom'; // Import Link from React Router for navigation

// Styled component for the card wrapper
const Card = styled(motion.div)`
  background: #ffffff; // White background for the card
  border-radius: 12px; // Rounded corners for the card
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // Light shadow for the card
  padding: 1.5rem; // Add padding inside the card
  transition: transform 0.2s, box-shadow 0.2s; // Smooth transitions for hover effect
  cursor: pointer; // Cursor changes to pointer when hovering

  &:hover {
    transform: translateY(-5px); // Slightly move the card up on hover
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); // Make shadow stronger on hover
  }
`;

// Styled component for the title of the survey card
const Title = styled.h3`
  font-size: 1.25rem; // Set font size for the title
  font-weight: 600; // Make the title bold
  color: #1a1a1a; // Dark gray color for the title
  margin-bottom: 0.5rem; // Space below the title
`;

// Styled component for the description text in the card
const Description = styled.p`
  font-size: 0.875rem; // Smaller font size for the description
  color: #666; // Light gray color for the description
  margin-bottom: 1rem; // Add space below the description
`;

// Styled component for meta information, like expiration date
const Meta = styled.div`
  display: flex; // Use flexbox to align items horizontally
  justify-content: space-between; // Space out the content evenly
  align-items: center; // Vertically center the items
  font-size: 0.875rem; // Smaller font size
  color: #888; // Light gray color for meta info
`;

// SurveyCard component that displays survey details
const SurveyCard = ({ survey }) => {
  return (
    // Link component to navigate to the results page when clicked
    <Link to={`/results/${survey.id}`} style={{ textDecoration: 'none' }}>
      <Card
        whileHover={{ scale: 1.05 }} // Slightly scale up the card when hovered
        whileTap={{ scale: 0.95 }} // Slightly scale down the card when clicked
      >
        <Title>{survey.title}</Title> {/* Display survey title */}
        <Description>{survey.description}</Description> {/* Display survey description */}
        <Meta>
          <span>Expira em: {new Date(survey.expirationTime).toLocaleDateString()}</span> {/* Display expiration date */}
        </Meta>
      </Card>
    </Link>
  );
};

export default SurveyCard;
