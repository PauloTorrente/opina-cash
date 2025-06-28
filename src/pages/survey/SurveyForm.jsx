import React, { useState, useMemo } from 'react';
import { Container, Title, SubmitButton } from '../../components/survey/Survey.styles.jsx';
import { SuccessModal } from '../../components/survey/SuccessSurvey';
import SurveyQuestion from './SurveyQuestion';
import SurveyWarning from './SurveyWarning';

const SurveyForm = ({ survey, accessToken, onModalClose }) => {
  // State for user responses, success modal, and terms
  const [responses, setResponses] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Handle change in user responses
  const handleResponseChange = (questionId, answer) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };
  
  // Handle change in terms acceptance checkbox
  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't submit if valid responses are missing
    if (!allResponsesValid) return;
    
    try {
      // Get authentication token from local storage
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');
      
      // Prepare response data for API
      const responseData = survey.questions
        .map(question => ({
          questionId: Number(question.questionId),
          answer: responses[question.questionId] || ''
        }))
        .filter(item => item.answer !== '');
      
      // Send responses to backend API
      const response = await fetch(
        `https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(responseData),
        }
      );
      
      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error submitting responses');
      }
      
      // Show success modal on successful submission
      setShowSuccessModal(true);
    } catch (error) {
      alert(error.message);
    }
  };
  
  // Memoized validation for all responses
  const allResponsesValid = useMemo(() => {
    // Check each question for valid response
    return survey.questions.every(question => {
      // Multiple choice: check if option is selected
      if (question.type !== 'text') {
        return responses[question.questionId] !== '';
      } 
      // Text questions: check length requirements
      else {
        const answer = responses[question.questionId] || '';
        const answerLength = answer.length;
        // Length requirements configuration
        const lengthRequirements = {
          short: { min: 1, max: 100 },
          medium: { min: 10, max: 300 },
          long: { min: 50, max: 1000 },
          unrestricted: { min: 0, max: Infinity }
        };
        // Helper to get length config
        const getLengthConfig = (lengthType) => {
          // Normalize length type string
          const type = (lengthType || 'unrestricted').toLowerCase().trim();
          return lengthRequirements[type] || lengthRequirements.unrestricted;
        };
        // Get min/max for current question
        const { min, max } = getLengthConfig(question.answerLength);
        // Check if answer length is within range
        return answerLength >= min && answerLength <= max;
      }
    });
  }, [responses, survey]);

  // Check if form is ready for submission
  const formComplete = allResponsesValid && termsAccepted;
  
  return (
    <>
      <Container>
        <Title>{survey.title}</Title>
        <form onSubmit={handleSubmit}>
          {/* Render all survey questions */}
          {survey.questions.map((question) => (
            <SurveyQuestion
              key={`q-${question.questionId}`}
              question={question}
              response={responses[question.questionId] || ''}
              onResponseChange={handleResponseChange}
            />
          ))}
          {/* Terms and conditions warning */}
          <SurveyWarning 
            checked={termsAccepted}
            onChange={handleTermsChange}
          />
          {/* Submit button with dynamic text */}
          <SubmitButton 
            type="submit"
            disabled={!formComplete}
            style={{ 
              opacity: formComplete ? 1 : 0.7,
              cursor: formComplete ? 'pointer' : 'not-allowed'
            }}
          >
            <span role="img" aria-label="send">📨</span> 
            {formComplete 
              ? 'Enviar respuestas' 
              : !allResponsesValid 
                ? 'Complete todas as respostas' 
                : 'Aceite os termos para continuar'}
          </SubmitButton>
        </form>
      </Container>
      {/* Show success modal after submission */}
      {showSuccessModal && (
        <SuccessModal onClose={() => {
          setShowSuccessModal(false);
          onModalClose();
        }} />
      )}
    </>
  );
};

export default SurveyForm;
