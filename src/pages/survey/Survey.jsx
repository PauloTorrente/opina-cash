import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LoadingWrapper, LoadingSpinnerLarge, LoadingText,
  StatePageWrapper, StateCard, StateIcon, StateTitle, StateMessage, HomeButton
} from '../../components/survey/Survey.styles.jsx';
import { useSurvey } from '../../hooks/useSurveys.js';
import AuthContext, { getCsrfToken } from '../../context/AuthContext';
import SurveyForm from './SurveyForm';
import SurveyAlreadyResponded from './SurveyAlreadyResponded';
import SurveyResponseLimitReached from './SurveyResponseLimitReached';
import { useTranslation } from '../../i18n/LanguageContext';

// ─── Verificação se o usuário já respondeu ────────────────────────────────────
const checkAlreadyResponded = async (accessToken) => {
  if (!accessToken) return false;
  try {
    // csrfToken cookie is cross-origin and unreadable here — see the note
    // in AuthContext.jsx. Use its in-memory copy instead.
    const csrfToken = getCsrfToken();

    // Tentamos o POST com corpo vazio — o backend retorna 400 "already responded"
    // se o user já respondeu, antes de qualquer validação de payload.
    const res = await fetch(
      `https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
        body: JSON.stringify([]),   // array vazio — não cria resultado, só aciona a guard
      }
    );
    if (res.status === 400) {
      const data = await res.json().catch(() => ({}));
      const msg  = (data.message || '').toLowerCase();
      if (msg.includes('already responded') || msg.includes('já respondeu')) return 'already';
      if (msg.includes('response limit') || msg.includes('limit reached'))   return 'limit';
    }
    return false;
  } catch {
    return false;
  }
};

const Survey = () => {
  const { t, language } = useTranslation();
  const navigate    = useNavigate();
  const location    = useLocation();
  const { user }    = useContext(AuthContext);
  const accessToken = new URLSearchParams(location.search).get('accessToken');

  const [hasResponded,         setHasResponded]         = useState(false);
  const [responseLimitReached, setResponseLimitReached] = useState(false);
  const [isChecking,           setIsChecking]           = useState(true);

  const { survey, loading, error } = useSurvey(accessToken);

  // Assim que o survey carregar, verifica se o usuário já respondeu
  useEffect(() => {
    if (!survey || !user || !accessToken) {
      setIsChecking(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const result = await checkAlreadyResponded(accessToken);
      if (cancelled) return;
      if (result === 'already') setHasResponded(true);
      if (result === 'limit')   setResponseLimitReached(true);
      setIsChecking(false);
    })();
    return () => { cancelled = true; };
  }, [survey, user, accessToken]);

  // ── Estados de carregamento ────────────────────────────────────────────────
  if (loading || isChecking) {
    return (
      <LoadingWrapper>
        <LoadingSpinnerLarge />
        <LoadingText>{t('survey.loading')}</LoadingText>
      </LoadingWrapper>
    );
  }

  if (error) {
    return (
      <StatePageWrapper>
        <StateCard>
          <StateIcon $bg="linear-gradient(135deg,#EF4444,#F87171)" $shadow="0 8px 24px rgba(239,68,68,0.3)">❌</StateIcon>
          <StateTitle>{t('survey.errorTitle')}</StateTitle>
          <StateMessage>{error}</StateMessage>
          <HomeButton onClick={() => window.location.reload()}>{t('survey.retry')}</HomeButton>
        </StateCard>
      </StatePageWrapper>
    );
  }

  if (!survey) {
    return (
      <StatePageWrapper>
        <StateCard>
          <StateIcon $bg="linear-gradient(135deg,#94A3B8,#CBD5E1)" $shadow="0 8px 24px rgba(148,163,184,0.3)">🔍</StateIcon>
          <StateTitle>{t('survey.notFoundTitle')}</StateTitle>
          <StateMessage>{t('survey.notFoundMessage')}</StateMessage>
          <HomeButton onClick={() => navigate('/')}>{t('survey.goHome')}</HomeButton>
        </StateCard>
      </StatePageWrapper>
    );
  }

  if (!user) {
    return (
      <StatePageWrapper>
        <StateCard>
          <StateIcon $bg="linear-gradient(135deg,#5B4FE9,#7C3AED)" $shadow="0 8px 24px rgba(91,79,233,0.3)">🔐</StateIcon>
          <StateTitle>{t('survey.authRequiredTitle')}</StateTitle>
          <StateMessage>{t('survey.authRequiredMessage')}</StateMessage>
          <HomeButton onClick={() => navigate('/login')}>{t('survey.goLogin')}</HomeButton>
        </StateCard>
      </StatePageWrapper>
    );
  }

  if (responseLimitReached) return <SurveyResponseLimitReached />;
  if (hasResponded)         return <SurveyAlreadyResponded />;

  const now            = new Date();
  const expirationTime = new Date(survey.expirationTime);
  if (now > expirationTime) {
    return (
      <StatePageWrapper>
        <StateCard>
          <StateIcon $bg="linear-gradient(135deg,#F59E0B,#FCD34D)" $shadow="0 8px 24px rgba(245,158,11,0.3)">⏰</StateIcon>
          <StateTitle>{t('survey.expiredTitle')}</StateTitle>
          <StateMessage>
            {t('survey.expiredMessage', {
              date: expirationTime.toLocaleDateString(language === 'pt-BR' ? 'pt-BR' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
            })}
          </StateMessage>
          <HomeButton onClick={() => navigate('/')}>{t('survey.goHome')}</HomeButton>
        </StateCard>
      </StatePageWrapper>
    );
  }

  return (
    <SurveyForm
      survey={survey}
      accessToken={accessToken}
      userId={user.userId}
      onResponseSuccess={() => setHasResponded(true)}
      onResponseError={(err) => {
        const msg = typeof err === 'string' ? err : err?.message || '';
        if (msg.includes('already responded') || msg.includes('ALREADY_RESPONDED')) {
          setHasResponded(true);
        } else if (msg.includes('response limit') || msg.includes('limit')) {
          setResponseLimitReached(true);
        }
      }}
    />
  );
};

export default Survey;
