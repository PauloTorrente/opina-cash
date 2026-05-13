import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StatePageWrapper, StateCard, StateIcon,
  StateTitle, StateMessage, CountdownBadge, HomeButton
} from '../../components/survey/Survey.styles.jsx';

const SurveyAlreadyResponded = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    if (seconds <= 0) { navigate('/'); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, navigate]);

  return (
    <StatePageWrapper>
      <StateCard>
        <StateIcon
          $bg="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
          $shadow="0 8px 24px rgba(16,185,129,0.3)"
        >✅</StateIcon>
        <StateTitle>¡Ya participaste!</StateTitle>
        <StateMessage>
          Ya enviaste tus respuestas para esta encuesta. ¡Gracias por tu colaboración!
        </StateMessage>
        <CountdownBadge>⏱ Redirigiendo en {seconds}s…</CountdownBadge>
        <br />
        <HomeButton onClick={() => navigate('/')}>🏠 Ir al inicio ahora</HomeButton>
      </StateCard>
    </StatePageWrapper>
  );
};

export default SurveyAlreadyResponded;
