import { useState, useMemo } from 'react';

export const useSurveyForm = ({ survey, accessToken }) => {
  // Initialize form state
  const [responses, setResponses] = useState(() => {
    const initialResponses = {};
    survey.questions.forEach(q => {
      initialResponses[q.questionId] = (q.multipleSelections === true || q.multipleSelections === "yes") ? [] : '';
    });
    return initialResponses;
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle response changes
  const handleResponseChange = (questionId, answer) => {
    const question = survey.questions.find(q => q.questionId === questionId);
    const isMultiple = question?.multipleSelections === true;
    
    setResponses(prev => ({
      ...prev,
      [questionId]: isMultiple ? (Array.isArray(answer) ? answer : [answer].filter(Boolean)) : answer
    }));
  };

  // Validate responses
  const allResponsesValid = useMemo(() => {
    return survey.questions.every(question => {
      const answer = responses[question.questionId];
      const isMultiple = question.multipleSelections === true;

      if (question.type === 'text') {
        const lengthConfig = {
          short: { min: 1, max: 100 },
          medium: { min: 10, max: 300 },
          long: { min: 50, max: 1000 },
          unrestricted: { min: 0, max: Infinity }
        }[question.answerLength?.toLowerCase()?.trim() || 'unrestricted'];
        
        const answerText = answer || '';
        return answerText.length >= lengthConfig.min && answerText.length <= lengthConfig.max;
      }
      return isMultiple ? Array.isArray(answer) && answer.length > 0 : answer !== undefined && answer !== '';
    });
  }, [responses, survey]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(allResponsesValid && termsAccepted)) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(
        `https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(survey.questions.map(q => ({
            questionId: Number(q.questionId),
            answer: responses[q.questionId],
            questionType: q.type,
            multipleSelections: q.multipleSelections === true ? "yes" : "no"
          }))),
        }
      );

      if (!response.ok) throw new Error(await response.text());
      setShowSuccessModal(true);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    responses,
    showSuccessModal,
    termsAccepted,
    isSubmitting,
    formComplete: allResponsesValid && termsAccepted,
    handleResponseChange,
    handleTermsChange: (e) => setTermsAccepted(e.target.checked),
    handleSubmit,
    closeModal: () => setShowSuccessModal(false),
    allResponsesValid 
  };
};
