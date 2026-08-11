import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StatePageWrapper, StateCard, StateIcon,
  StateTitle, StateMessage, CountdownBadge, HomeButton
} from '../../components/survey/Survey.styles.jsx';
import { useTranslation } from '../../i18n/LanguageContext';

const SurveyAlreadyResponded = () => {
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
          $bg="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
          $shadow="0 8px 24px rgba(16,185,129,0.3)"
        >✅</StateIcon>
        <StateTitle>{t('surveyAlreadyResponded.title')}</StateTitle>
        <StateMessage>
          {t('surveyAlreadyResponded.message')}
        </StateMessage>
        <CountdownBadge>{t('surveyAlreadyResponded.countdown', { seconds })}</CountdownBadge>
        <br />
        <HomeButton onClick={() => navigate('/')}>{t('surveyAlreadyResponded.goHomeNow')}</HomeButton>
      </StateCard>
    </StatePageWrapper>
  );
};

export default SurveyAlreadyResponded;
