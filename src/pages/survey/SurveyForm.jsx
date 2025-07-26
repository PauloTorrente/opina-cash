import React from 'react';
import { Container, Title, SubmitButton } from '../../components/survey/Survey.styles.jsx';
import { SuccessModal } from '../../components/survey/SuccessSurvey';
import SurveyQuestion from './SurveyQuestion';
import SurveyWarning from './SurveyWarning';
import { useSurveyForm } from '../../hooks/useSurveyForm';

const SurveyForm = ({ survey, accessToken, onModalClose }) => {
  const {
    responses,
    showSuccessModal,
    termsAccepted,
    isSubmitting,
    formComplete,
    allResponsesValid,
    handleResponseChange,
    handleTermsChange,
    handleSubmit,
    closeModal
  } = useSurveyForm({ survey, accessToken });

  return (
    <>
      <Container>
        <Title>{survey.title}</Title>
        
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

        <form onSubmit={handleSubmit}>
          {survey.questions.map(question => (
            <SurveyQuestion
              key={`q-${question.questionId}`}
              question={{
                ...question,
                multipleSelections: question.multipleSelections === "yes" || question.multipleSelections === true
              }}
              response={responses[question.questionId]}
              onResponseChange={handleResponseChange}
            />
          ))}

          <SurveyWarning checked={termsAccepted} onChange={handleTermsChange} />

          <SubmitButton
            type="submit"
            disabled={!formComplete || isSubmitting}
            style={{
              opacity: formComplete ? 1 : 0.7,
              cursor: formComplete ? 'pointer' : 'not-allowed'
            }}
          >
            <span role="img" aria-label="send">📨</span>
            {isSubmitting ? 'Submitting...' :
              formComplete ? 'Submit responses' :
              !allResponsesValid ? 'Complete all responses' : 'Accept terms to continue'}
          </SubmitButton>
        </form>
      </Container>

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
