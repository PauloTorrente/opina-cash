import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../../components/survey/Survey.styles.jsx';
import { useSurvey } from '../../hooks/useSurveys.js';
import AuthContext from '../../context/AuthContext';
import SurveyForm from './SurveyForm';
import SurveyAlreadyResponded from './SurveyAlreadyResponded';

const Survey = () => {
  // Navigation hooks for routing
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user from authentication context
  const { user } = useContext(AuthContext);
  
  // Get access token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('accessToken');

  // State to track if user has already responded
  const [hasResponded, setHasResponded] = useState(false);
  
  // Fetch survey data using custom hook
  const { survey, loading, error } = useSurvey(accessToken);

  // Check if user has already responded when survey data is loaded
  useEffect(() => {
    if (survey && user) {
      checkExistingResponse();
    }
  }, [survey, user]);

  // Function to check if user has already responded to this survey
  const checkExistingResponse = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`,
        {
          method: 'POST', // Using POST to trigger the existing validation
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify([]), // Empty array just to trigger the validation
        }
      );

      // If response is 400 and contains 'already responded' message
      if (response.status === 400) {
        const errorData = await response.json();
        if (errorData.message.includes('already responded')) {
          setHasResponded(true);
        }
      }
    } catch (error) {
      console.error('Error checking response:', error);
    }
  };

  // Close handler for success modal
  const handleModalClose = () => {
    navigate('/');
  };

  // Don't render if user is not authenticated
  if (!user) return null;
  
  // Show loading state while fetching survey
  if (loading) return <Container>Loading...</Container>;
  
  // Show error message if something went wrong
  if (error) return <Container>Error: {error}</Container>;
  
  // Show message if survey not found
  if (!survey) return <Container>Survey not found</Container>;

  // Show already responded message if user has completed the survey
  if (hasResponded) return <SurveyAlreadyResponded />;

  // Render survey form if all checks pass
  return (
    <SurveyForm 
      survey={survey}
      accessToken={accessToken}
      onModalClose={handleModalClose}
    />
  );
};

export default Survey;
