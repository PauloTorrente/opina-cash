import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '../../components/survey/Survey.styles.jsx';
import { useSurvey } from '../../hooks/useSurveys.js';
import AuthContext from '../../context/AuthContext';
import SurveyForm from './SurveyForm';
import SurveyAlreadyResponded from './SurveyAlreadyResponded';
import SurveyResponseLimitReached from './SurveyResponseLimitReached';

const Survey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('accessToken');

  const [hasResponded, setHasResponded] = useState(false);
  const [responseLimitReached, setResponseLimitReached] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState(null);
  const { survey, loading, error } = useSurvey(accessToken);

  // Function to verify if user has already responded
  const verifySurveyParticipation = async () => {
    try {
      if (!user || !accessToken) {
        setIsVerifying(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setVerificationError('Authentication token not found');
        setIsVerifying(false);
        return;
      }

      // Check if survey exists and is active
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

      const surveyData = await surveyResponse.json();
      
      // Try a direct check by attempting to submit empty response to trigger duplicate detection
      try {
        const testResponse = await fetch(
          `https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify([]) // Empty array to trigger validation
          }
        );

        // If we get a "already responded" error, user has participated
        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          if (errorText.includes('already responded') || errorText.includes('já respondeu') || errorText.includes('ALREADY_RESPONDED')) {
            setHasResponded(true);
            setIsVerifying(false);
            return;
          }
        }
      } catch (testError) {
        // If test fails, continue normally
      }

      // Check response limit by looking at survey data
      if (surveyData.responseLimit) {
        // We can't directly check response count due to 403, but we can show the form
        // and let backend handle the limit when submitting
        setIsVerifying(false);
        return;
      }

      setIsVerifying(false);
    } catch (error) {
      setVerificationError('Error verifying survey participation');
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (survey && user && accessToken) {
      verifySurveyParticipation();
    } else {
      setIsVerifying(false);
    }
  }, [survey, user, accessToken]);

  // Loading and error states
  if (loading || isVerifying) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading survey...</h2>
          <p>Please wait while we verify your participation.</p>
        </div>
      </Container>
    );
  }

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

  if (responseLimitReached) {
    return <SurveyResponseLimitReached survey={survey} />;
  }

  if (hasResponded) {
    return <SurveyAlreadyResponded survey={survey} />;
  }

  // Check if survey is expired
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

  return (
    <SurveyForm 
      survey={survey}
      accessToken={accessToken}
      userId={user.userId}
      onResponseSuccess={() => {
        setHasResponded(true);
      }}
      onResponseError={(error) => {
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
