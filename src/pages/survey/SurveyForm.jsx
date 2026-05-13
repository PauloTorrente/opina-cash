import React from 'react';
import {
  Container, SurveyHeader, Title, SurveyDescription,
  SubmitButton, SpinnerIcon, ModalOverlay, ModalContent,
  ModalIcon, ModalTitle, ModalText, ModalButton,
  LoadingWrapper, LoadingSpinnerLarge, LoadingText
} from '../../components/survey/Survey.styles.jsx';
import SurveyQuestion from './SurveyQuestion';
import SurveyWarning from './SurveyWarning';
import { useSurveyForm } from '../../hooks/useSurveyForm';
import styled, { keyframes } from 'styled-components';

// ─── Banner "Nunca" — encerra a enquete ───────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const NeverBanner = styled.div`
  background: linear-gradient(135deg, #FFF7ED, #FEF3C7);
  border: 1.5px solid #FCD34D;
  border-radius: 16px;
  padding: 20px 20px;
  margin: 8px 0 16px;
  text-align: center;
  animation: ${fadeUp} 0.35s ease-out;

  .icon { font-size: 2rem; margin-bottom: 8px; display: block; }
  .title {
    font-size: 1rem;
    font-weight: 700;
    color: #92400E;
    margin-bottom: 6px;
  }
  .sub {
    font-size: 0.88rem;
    color: #78350F;
    line-height: 1.5;
  }
`;

// ─── Modal de éxito ───────────────────────────────────────────────────────────
const SuccessModal = ({ onClose }) => (
  <ModalOverlay>
    <ModalContent>
      <ModalIcon>🎉</ModalIcon>
      <ModalTitle>¡Encuesta completada!</ModalTitle>
      <ModalText>
        Gracias por participar. Tu recompensa ya fue procesada y pronto se reflejará en tu cuenta.
      </ModalText>
      <ModalButton onClick={onClose}>Volver al inicio</ModalButton>
    </ModalContent>
  </ModalOverlay>
);

// ─── Componente principal ─────────────────────────────────────────────────────
const SurveyForm = ({ survey, accessToken, onModalClose, onResponseSuccess, onResponseError }) => {
  const {
    responses,
    showSuccessModal,
    termsAccepted,
    isSubmitting,
    formComplete,
    allResponsesValid,
    normalizedQuestions,
    isNeverBlocked,
    handleResponseChange,
    handleTermsChange,
    handleSubmit,
    closeModal,
  } = useSurveyForm({ survey, accessToken, onResponseSuccess, onResponseError });

  const getButtonLabel = () => {
    if (isSubmitting) return null;
    if (!allResponsesValid) return 'Completa todas las respuestas';
    if (!termsAccepted)     return 'Acepta los términos para continuar';
    if (isNeverBlocked)     return 'Enviar y finalizar';
    return 'Enviar respuestas';
  };

  return (
    <>
      <Container>
        <SurveyHeader>
          <Title>{survey.title}</Title>
          {survey.description && <SurveyDescription>{survey.description}</SurveyDescription>}
        </SurveyHeader>

        <form onSubmit={handleSubmit}>
          {normalizedQuestions.map((question, index) => (
            <SurveyQuestion
              key={`q-${question.questionId}-${index}`}
              question={question}
              selectionLimit={question.selectionLimit}
              response={responses[question.questionId]}
              onResponseChange={handleResponseChange}
              // PROBLEMA 7: pasar respuestas para la lógica de condicional
              allResponses={responses}
              questionIndex={index}
              allQuestions={normalizedQuestions}
            />
          ))}

          {/* PROBLEMAS 1 & 3: banner cuando seleccionó "Nunca" */}
          {isNeverBlocked && (
            <NeverBanner>
              <span className="icon">🚫</span>
              <div className="title">Encuesta finalizada anticipadamente</div>
              <div className="sub">
                Como no utilizas este servicio, no es necesario que continúes respondiendo.
                Puedes enviar tus respuestas con el botón de abajo.
              </div>
            </NeverBanner>
          )}

          <SurveyWarning checked={termsAccepted} onChange={handleTermsChange} />

          <SubmitButton type="submit" disabled={!formComplete || isSubmitting}>
            {isSubmitting
              ? <><SpinnerIcon /> Enviando...</>
              : <>{formComplete ? '✅' : '⏳'} {getButtonLabel()}</>
            }
          </SubmitButton>
        </form>
      </Container>

      {showSuccessModal && (
        <SuccessModal onClose={() => {
          closeModal();
          if (onModalClose) onModalClose();
        }} />
      )}
    </>
  );
};

export default SurveyForm;
