import React from 'react';
import { Container, Title, SubmitButton } from '../../components/survey/Survey.styles.jsx';
import { SuccessModal } from '../../components/survey/SuccessSurvey';
import SurveyQuestion from './SurveyQuestion';
import SurveyWarning from './SurveyWarning';
import { useSurveyForm } from '../../hooks/useSurveyForm';

// Main survey form component that displays and handles survey responses
const SurveyForm = ({ survey, accessToken, onModalClose }) => {
  // Get form state and handlers from custom hook
  const {
    responses,
    showSuccessModal,
    termsAccepted,
    isSubmitting,
    formComplete,
    allResponsesValid,
    normalizedQuestions,
    handleResponseChange,
    handleTermsChange,
    handleSubmit,
    closeModal
  } = useSurveyForm({ survey, accessToken });

  return (
    <>
      <Container>
        {/* Survey title */}
        <Title>{survey.title}</Title>
        
        {/* Survey description - shows if available */}
        {survey.description && (
          <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #4c6ef5'
          }}>
            <p style={{ margin: 0, color: '#495057', fontSize: '1.05rem' }}>
              {survey.description}
            </p>
          </div>
        )}

        {/* Main survey form */}
        <form onSubmit={handleSubmit}>
          {/* Render each survey question */}
          {normalizedQuestions.map((question, index) => {
            // Create unique key for each question to help React with rendering
            const uniqueKey = `q-${question.questionId}-${index}`;
            
            return (
              <div key={uniqueKey} style={{
                position: 'relative',
                marginBottom: '10px'
              }}>
                {/* Individual question component */}
                <SurveyQuestion
                  question={question}
                  selectionLimit={question.selectionLimit}
                  response={responses[question.questionId]}
                  onResponseChange={handleResponseChange}
                />
              </div>
            );
          })}

          {/* Terms and conditions warning */}
          <SurveyWarning checked={termsAccepted} onChange={handleTermsChange} />

          {/* Submit button with dynamic states */}
          <SubmitButton
            type="submit"
            disabled={!formComplete || isSubmitting}
            style={{
              opacity: formComplete ? 1 : 0.7,
              cursor: formComplete ? 'pointer' : 'not-allowed',
              marginTop: '20px'
            }}
          >
            <span role="img" aria-label="send">📨</span>
            {isSubmitting ? 'Enviando...' :
              formComplete ? 'Enviar Respuestas' :
              !allResponsesValid ? 'Complete todas las respuestas correctamente' : 'Acepte los términos para continuar'}
          </SubmitButton>
        </form>
      </Container>

      {/* Success modal shown after form submission */}
      {showSuccessModal && (
        <SuccessModal onClose={() => {
          closeModal();
          onModalClose();
        }} />
      )}
    </>
  );
};

export default SurveyForm;
