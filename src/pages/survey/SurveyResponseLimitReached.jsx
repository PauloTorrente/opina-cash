import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StatePageWrapper, StateCard, StateIcon,
  StateTitle, StateMessage, CountdownBadge, HomeButton
} from '../../components/survey/Survey.styles.jsx';
import { useTranslation } from '../../i18n/LanguageContext';

const SurveyResponseLimitReached = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    if (seconds <= 0) { navigate('/'); return; }
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, navigate]);

  return (
    <StatePageWrapper>
      <StateCard>
        <StateIcon
          $bg="linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)"
          $shadow="0 8px 24px rgba(124,58,237,0.3)"
        >🏆</StateIcon>
        <StateTitle>{t('surveyResponseLimitReached.title')}</StateTitle>
        <StateMessage>
          {t('surveyResponseLimitReached.message')}
        </StateMessage>
        <CountdownBadge>{t('surveyResponseLimitReached.countdown', { seconds })}</CountdownBadge>
        <br />
        <HomeButton onClick={() => navigate('/')}>{t('surveyResponseLimitReached.goHomeNow')}</HomeButton>
      </StateCard>
    </StatePageWrapper>
  );
};

export default SurveyResponseLimitReached;
