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
  const { survey, loading, error } = useSurvey(accessToken);

  const verifyParticipation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Verificação otimizada
      const response = await fetch(
        `https://enova-backend.onrender.com/api/surveys/verify-participation?accessToken=${accessToken}`,
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.hasResponded) {
          setHasResponded(true);
        } else if (data.responseLimitReached) {
          setResponseLimitReached(true);
        }
      } else {
        // Se a verificação falhar, tentamos submeter uma resposta vazia
        await testSubmission();
      }
    } catch (error) {
      console.error("Verification error:", error);
      await testSubmission();
    } finally {
      setIsVerifying(false);
    }
  };

  const testSubmission = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify([]),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message.includes('already responded')) {
          setHasResponded(true);
        } else if (errorData.message.includes('response limit')) {
          setResponseLimitReached(true);
        }
      }
    } catch (error) {
      console.error("Submission test error:", error);
    }
  };

  useEffect(() => {
    if (survey && user) {
      verifyParticipation();
    } else {
      setIsVerifying(false);
    }
  }, [survey, user]);

  if (!user) return null;
  if (loading || isVerifying) return <Container>Cargando encuesta...</Container>;
  if (error) return <Container>Error al cargar: {error}</Container>;
  if (!survey) return <Container>Encuesta no encontrada</Container>;
  if (responseLimitReached) return <SurveyResponseLimitReached />;
  if (hasResponded) return <SurveyAlreadyResponded />;

  return (
    <SurveyForm 
      survey={survey}
      accessToken={accessToken}
      onResponseError={(error) => {
        if (error.includes('already responded')) {
          setHasResponded(true);
        } else if (error.includes('response limit')) {
          setResponseLimitReached(true);
        }
      }}
    />
  );
};

export default Survey;
