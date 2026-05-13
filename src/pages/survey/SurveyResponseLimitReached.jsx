import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StatePageWrapper, StateCard, StateIcon,
  StateTitle, StateMessage, CountdownBadge, HomeButton
} from '../../components/survey/Survey.styles.jsx';

const SurveyResponseLimitReached = () => {
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
          $bg="linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)"
          $shadow="0 8px 24px rgba(124,58,237,0.3)"
        >🏆</StateIcon>
        <StateTitle>¡Encuesta completa!</StateTitle>
        <StateMessage>
          Esta encuesta ya alcanzó el número máximo de participantes. ¡Mantente atento a nuevas encuestas!
        </StateMessage>
        <CountdownBadge>⏱ Redirigiendo en {seconds}s…</CountdownBadge>
        <br />
        <HomeButton onClick={() => navigate('/')}>🏠 Ir al inicio ahora</HomeButton>
      </StateCard>
    </StatePageWrapper>
  );
};

export default SurveyResponseLimitReached;
