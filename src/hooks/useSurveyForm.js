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

  // Submit handler - FIXED FOR QUESTION_ID PROBLEM
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(allResponsesValid && termsAccepted)) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      // DEBUG: Check questionIds structure
      console.log('🔍 DEBUG - Question structure:');
      survey.questions.forEach((q, index) => {
        console.log(`Question ${index + 1}:`, {
          questionIdOriginal: q.questionId,
          questionIdType: typeof q.questionId,
          convertedToNumber: Number(q.questionId),
          isNaN: isNaN(Number(q.questionId)),
          question: q.question?.substring(0, 30) + '...'
        });
      });

      // FIX: Create response array with valid questionIds
      const responseData = survey.questions.map((q, index) => {
        let questionId;
        
        // Strategy to get a valid ID
        if (q.questionId && !isNaN(Number(q.questionId))) {
          // If convertible to number
          questionId = Number(q.questionId);
        } else if (q.id && !isNaN(Number(q.id))) {
          // Try to use 'id' field if it exists
          questionId = Number(q.id);
        } else {
          // Generate ID based on index as fallback
          questionId = index + 1;
          console.warn(`⚠️ Invalid questionId, using sequential ID: ${questionId} for question: "${q.question?.substring(0, 30)}..."`);
        }

        // Get current response for this question
        const answer = responses[q.questionId];
        
        console.log(`📝 Preparing response for question ${questionId}:`, {
          question: q.question?.substring(0, 30) + '...',
          type: q.type,
          response: answer,
          responseType: typeof answer
        });

        return {
          questionId: questionId,
          answer: answer
        };
      });

      console.log('📤 Sending responses to backend:', responseData);

      // CHANGED: Using permissive endpoint to handle complex question IDs
      const response = await fetch(
        `https://enova-backend.onrender.com/api/surveys/respond-permissive?accessToken=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(responseData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error:', errorText);
        
        // Try to parse as JSON if possible
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorJson.error || 'Error sending responses');
        } catch {
          throw new Error(errorText || 'Error sending responses');
        }
      }

      console.log('✅ Responses sent successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('❌ Error sending responses:', error);
      
      // User-friendly error messages
      if (error.message.includes('already responded') || error.message.includes('já respondeu')) {
        alert('You have already responded to this survey. Thank you for your participation!');
      } else if (error.message.includes('response limit') || error.message.includes('limite')) {
        alert('This survey has reached the maximum response limit. Thank you for your interest!');
      } else if (error.message.includes('Invalid response format')) {
        alert('Error in response format. Please check if all questions were answered correctly.');
      } else if (error.message.includes('Question with ID') && error.message.includes('not found')) {
        alert('Survey question compatibility error. Please reload the page and try again.');
      } else {
        alert(`Error: ${error.message}`);
      }
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
