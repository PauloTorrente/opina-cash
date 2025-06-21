import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../../components/survey/Survey.styles.jsx';
import { useSurvey } from '../../hooks/useSurveys.js';
import AuthContext from '../../context/AuthContext';
import SurveyForm from './SurveyForm';

const Survey = () => {
  // Navigation hooks for routing
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user from authentication context
  const { user } = useContext(AuthContext);
  
  // Fetch survey data using custom hook
  const { survey, loading, error } = useSurvey();
  
  // Get access token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('accessToken');

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

  return (
    <SurveyForm 
      survey={survey}
      accessToken={accessToken}
      onModalClose={handleModalClose}
    />
  );
};

export default Survey;
