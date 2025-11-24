import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../../components/survey/Survey.styles.jsx';
import { useSurvey } from '../../hooks/useSurveys.js';
import AuthContext from '../../context/AuthContext';
import SurveyForm from './SurveyForm';
import SurveyAlreadyResponded from './SurveyAlreadyResponded';
import SurveyResponseLimitReached from './SurveyResponseLimitReached';

// Main survey component that handles survey loading and user verification
const Survey = () => {
  // Get navigation and location for URL parameters
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user authentication context
  const { user } = useContext(AuthContext);
  
  // Extract access token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('accessToken');

  // State for tracking survey response status
  const [hasResponded, setHasResponded] = useState(false);
  const [responseLimitReached, setResponseLimitReached] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState(null);
  
  // Fetch survey data using custom hook
  const { survey, loading, error } = useSurvey(accessToken);

  // Function to verify if user can participate in the survey
  const verifySurveyParticipation = async () => {
    try {
      // Skip verification if user or access token is missing
      if (!user || !accessToken) {
        setIsVerifying(false);
        return;
      }

      // Check if authentication token exists
      const token = localStorage.getItem('token');
      if (!token) {
        setVerificationError('Authentication token not found');
        setIsVerifying(false);
        return;
      }

      // Basic survey verification - check if survey exists and is active
      try {
        const surveyResponse = await fetch(
          `https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!surveyResponse.ok) {
          throw new Error('Error loading survey');
        }

        // Survey loaded successfully, continue with verification
        await surveyResponse.json();
        
      } catch (fetchError) {
        // If basic verification fails, still allow user to try responding
        // This handles cases where the API might have temporary issues
      }

      // Complete verification process
      setIsVerifying(false);
      
    } catch (error) {
      // If verification fails, still allow user to try responding
      setIsVerifying(false);
    }
  };

  // Run verification when survey, user, and access token are available
  useEffect(() => {
    if (survey && user && accessToken) {
      verifySurveyParticipation();
    } else {
      // Skip verification if required data is missing
      setIsVerifying(false);
    }
  }, [survey, user, accessToken]);

  // Show loading state while survey is being loaded or verified
  if (loading || isVerifying) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading survey...</h2>
          <p>Please wait while we load the survey.</p>
        </div>
      </Container>
    );
  }

  // Show error state if survey failed to load
  if (error || verificationError) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          <h2>Error loading survey</h2>
          <p>{error || verificationError}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </Container>
    );
  }

  // Show message if survey is not found
  if (!survey) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Survey not found</h2>
          <p>The survey may have expired or the link is incorrect.</p>
        </div>
      </Container>
    );
  }

  // Require user authentication
  if (!user) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Authentication required</h2>
          <p>Please log in to respond to the survey.</p>
          <button onClick={() => navigate('/login')}>
            Log In
          </button>
        </div>
      </Container>
    );
  }

  // Show message if survey response limit is reached
  if (responseLimitReached) {
    return <SurveyResponseLimitReached survey={survey} />;
  }

  // Show message if user has already responded
  if (hasResponded) {
    return <SurveyAlreadyResponded survey={survey} />;
  }

  // Check if survey has expired
  const now = new Date();
  const expirationTime = new Date(survey.expirationTime);
  
  if (now > expirationTime) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Survey Expired</h2>
          <p>This survey expired on {expirationTime.toLocaleDateString()}.</p>
        </div>
      </Container>
    );
  }

  // Render the main survey form if all checks pass
  return (
    <SurveyForm 
      survey={survey}
      accessToken={accessToken}
      userId={user.userId}
      onResponseSuccess={() => {
        // Mark user as having responded when submission is successful
        setHasResponded(true);
      }}
      onResponseError={(error) => {
        // Handle different types of response errors
        if (error.includes('already responded') || error.includes('já respondeu') || error.includes('ALREADY_RESPONDED')) {
          setHasResponded(true);
        } else if (error.includes('response limit') || error.includes('limite')) {
          setResponseLimitReached(true);
        } else {
          alert('Error sending response: ' + error);
        }
      }}
    />
  );
};

export default Survey;
