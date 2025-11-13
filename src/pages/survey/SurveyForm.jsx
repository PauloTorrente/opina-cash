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

  // Function to apply manual limits for specific questions
  const getQuestionWithFixedLimits = (question) => {
    let fixedQuestion = { ...question };
    
    if (question.selectionLimit == null) {
      if (question.questionId === 'q_1762970950169_lmsgt9939') {
        fixedQuestion.selectionLimit = 3;
      } else if (question.questionId === 'q_1762971100217_2nlzbrlvc') {
        fixedQuestion.selectionLimit = 2;
      } else if (question.questionId === 'q_1762971192236_d5v2ia6n9') {
        fixedQuestion.selectionLimit = 2;
      }
    }
    
    return fixedQuestion;
  };

  // Count different types of questions for statistics
  const getQuestionStats = () => {
    if (!survey?.questions) return {};
    
    const stats = {
      total: survey.questions.length,
      multipleSingle: 0,
      multipleUnlimited: 0,
      multipleLimited: 0,
      text: 0,
      required: 0
    };

    survey.questions.forEach(question => {
      if (question.type === 'text') {
        stats.text++;
      } else if (question.type === 'multiple') {
        const isMultiple = question.multipleSelections === "yes" || question.multipleSelections === true;
        const hasLimit = question.selectionLimit != null && question.selectionLimit > 0;
        
        if (isMultiple) {
          if (hasLimit) {
            stats.multipleLimited++;
          } else {
            stats.multipleUnlimited++;
          }
        } else {
          stats.multipleSingle++;
        }
      }
      
      if (question.required) {
        stats.required++;
      }
    });

    return stats;
  };

  const questionStats = getQuestionStats();

  return (
    <>
      <Container>
        <Title>{survey.title}</Title>
        
        {/* Survey description section */}
        {survey.description && (
          <div style={{
            marginBottom: '25px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #4c6ef5'
          }}>
            <p style={{ 
              margin: 0, 
              color: '#495057', 
              fontSize: '1.05rem',
              lineHeight: '1.6'
            }}>
              {survey.description}
            </p>
          </div>
        )}

        {/* Grid for question statistics (currently empty) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          marginBottom: '25px'
        }}>
          {/* Statistics grid can be added here later */}
        </div>

        {/* Main survey form */}
        <form onSubmit={handleSubmit}>
          {/* Render all survey questions with unique keys */}
          {survey.questions.map((question, index) => {
            const uniqueKey = `q-${question.questionId}-${index}`;
            
            // Apply fixed limits to questions
            const fixedQuestion = getQuestionWithFixedLimits(question);

            return (
              <div key={uniqueKey} style={{
                marginBottom: '30px',
                padding: '25px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {/* Question number indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #f8f9fa'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#4c6ef5',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#6c757d',
                    fontWeight: '500'
                  }}>
                    Pregunta {index + 1} de {survey.questions.length}
                  </div>
                </div>

                {/* Individual question component */}
                <SurveyQuestion
                  question={fixedQuestion}
                  response={responses[fixedQuestion.questionId]}
                  onResponseChange={handleResponseChange}
                />
              </div>
            );
          })}

          {/* Terms and conditions acceptance section */}
          <SurveyWarning checked={termsAccepted} onChange={handleTermsChange} />

          {/* Submit button section */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <SubmitButton
              type="submit"
              disabled={!formComplete || isSubmitting}
              style={{
                opacity: formComplete ? 1 : 0.6,
                cursor: formComplete ? 'pointer' : 'not-allowed',
                padding: '15px 40px',
                fontSize: '1.1rem',
                minWidth: '220px',
                borderRadius: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={{ marginRight: '8px' }}>⏳</span>
                  Enviando...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '8px' }}>📨</span>
                  Enviar Respuestas
                </>
              )}
            </SubmitButton>
            
            {/* Helper text when form is not complete */}
            {!formComplete && (
              <p style={{ 
                marginTop: '15px', 
                fontSize: '0.9rem', 
                color: '#6c757d',
                fontStyle: 'italic'
              }}>
                Complete todas las respuestas requeridas y acepte los términos
              </p>
            )}
          </div>
        </form>
      </Container>

      {/* Success modal shown after submission */}
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
