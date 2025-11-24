import { useState, useMemo } from 'react';

// CRITICAL FIX: Function to fix double JSON serialization
const fixDoubleSerializedQuestions = (questions) => {
  if (!questions) return [];
  
  let rawQuestions = questions;
  
  // FIX: If it's a string, parse to fix double serialization
  if (typeof rawQuestions === 'string') {
    try {
      // First parse
      rawQuestions = JSON.parse(rawQuestions);
      
      // ⚠️ IF STILL STRING = DOUBLE SERIALIZATION!
      if (typeof rawQuestions === 'string') {
        // Remove external quotes if they exist (case: "\"[...]\"")
        if (rawQuestions.startsWith('"[') && rawQuestions.endsWith(']"')) {
          rawQuestions = rawQuestions.slice(1, -1);
        }
        
        // Second parse to get the real array
        rawQuestions = JSON.parse(rawQuestions);
      }
    } catch (error) {
      console.error('Error fixing double serialization:', error);
      return [];
    }
  }
  
  return Array.isArray(rawQuestions) ? rawQuestions : [];
};

// INTELLIGENT AUTOMATIC DETECTION SYSTEM
const detectAndAdaptSelectionLimits = (questions) => {
  if (!questions || !Array.isArray(questions)) return questions;
  
  // COMPLETE API PATTERN ANALYSIS
  let apiPattern = {
    totalQuestions: questions.length,
    multipleChoiceQuestions: 0,
    questionsWithLimits: 0,
    limitValues: [],
    averageLimit: 0,
    maxLimit: 0,
    minLimit: Infinity,
    // NEW: Detection of EXPLICIT API values
    explicitLimits: []
  };
  
  // First pass: ANALYZE API pattern
  questions.forEach((question, index) => {
    const isMultiple = question.multipleSelections === 'yes' || question.multipleSelections === true;
    
    if (isMultiple) {
      apiPattern.multipleChoiceQuestions++;
      
      // CRITICAL FIX: Detect if API sent selectionLimit
      const hasExplicitLimit = question.selectionLimit != null && question.selectionLimit !== '';
      
      if (hasExplicitLimit) {
        const limit = Number(question.selectionLimit);
        if (!isNaN(limit) && limit > 0) {
          apiPattern.questionsWithLimits++;
          apiPattern.limitValues.push(limit);
          apiPattern.explicitLimits.push({
            questionId: question.questionId,
            limit: limit,
            optionsCount: question.options?.length || 0
          });
          apiPattern.maxLimit = Math.max(apiPattern.maxLimit, limit);
          apiPattern.minLimit = Math.min(apiPattern.minLimit, limit);
        }
      }
    }
  });
  
  // Calculate average limits
  if (apiPattern.limitValues.length > 0) {
    apiPattern.averageLimit = apiPattern.limitValues.reduce((a, b) => a + b, 0) / apiPattern.limitValues.length;
  }
  
  // SECOND PASS: APPLY INTELLIGENT STRATEGY
  return questions.map((question, index) => {
    const isMultiple = question.multipleSelections === 'yes' || question.multipleSelections === true;
    const optionsCount = question.options?.length || 0;

    // CRITICAL FIX: IF API ALREADY SENT LIMIT → USE THAT EXACT VALUE
    if (isMultiple && question.selectionLimit != null && question.selectionLimit !== '') {
      const apiLimit = Number(question.selectionLimit);
      
      if (!isNaN(apiLimit) && apiLimit > 0) {
        return {
          ...question,
          selectionLimit: apiLimit, // ← USE EXACT API VALUE
          _limitSource: 'api_direct',
          _adaptiveStrategy: 'preserve_exact_api_value',
          _apiValue: apiLimit // Mark exact API value
        };
      }
    }
    
    // STRATEGY 2: IF MULTIPLE BUT WITHOUT LIMIT → USE INTELLIGENT PATTERN
    if (isMultiple && (question.selectionLimit == null || question.selectionLimit === '')) {
      let adaptiveLimit;
      
      // INTELLIGENT LOGIC BASED ON API PATTERN
      if (apiPattern.questionsWithLimits > 0) {
        // If other questions have limits, follow the pattern
        const suggestedByPattern = Math.min(optionsCount, Math.round(apiPattern.averageLimit));
        adaptiveLimit = suggestedByPattern;
      } else {
        // If no question has limits, use conservative strategy
        adaptiveLimit = Math.min(optionsCount, Math.max(2, Math.floor(optionsCount * 0.7)));
      }
      
      return {
        ...question,
        selectionLimit: adaptiveLimit,
        _limitSource: 'adaptive_intelligence',
        _adaptiveStrategy: apiPattern.questionsWithLimits > 0 ? 'follow_api_pattern' : 'conservative_70_percent'
      };
    }
    
    // STRATEGY 3: NOT MULTIPLE → NO LIMIT
    return {
      ...question,
      selectionLimit: null,
      _limitSource: 'not_multiple_choice',
      _adaptiveStrategy: 'no_limit_needed'
    };
  });
};

// COMPLETE AUTO-ADAPTIVE SYSTEM
const normalizeSurveyQuestions = (questions) => {
  if (!questions || !Array.isArray(questions)) return [];
  
  const adaptedQuestions = detectAndAdaptSelectionLimits(questions);
  
  // FINAL PROCESSING WITH GUARANTEES
  return adaptedQuestions.map((question, index) => {
    // FINAL GUARANTEE: If limit > options, adjust to maximum possible
    if (question.selectionLimit != null && 
        question.options && 
        question.selectionLimit > question.options.length) {
      
      return {
        ...question,
        selectionLimit: question.options.length,
        _adjusted: true,
        _originalLimit: question.selectionLimit
      };
    }

    return question;
  });
};

export const useSurveyForm = ({ survey, accessToken }) => {
  // AUTO-ADAPTIVE SYSTEM - DETECTS AND ADAPTS TO ANY SURVEY
  const normalizedQuestions = useMemo(() => {
    if (!survey?.questions) {
      return [];
    }
    
    // SERIALIZATION CORRECTION
    const deserializedQuestions = fixDoubleSerializedQuestions(survey.questions);
    
    // APPLY CORRECTED INTELLIGENT SYSTEM
    const normalized = normalizeSurveyQuestions(deserializedQuestions);
    
    return normalized;
  }, [survey]);

  // Initialize form state with normalized questions
  const [responses, setResponses] = useState(() => {
    const initialResponses = {};
    normalizedQuestions.forEach(q => {
      initialResponses[q.questionId] = q.multipleSelections ? [] : '';
    });
    return initialResponses;
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle response changes WITH REAL-TIME LIMIT VALIDATION
  const handleResponseChange = (questionId, answer) => {
    const question = normalizedQuestions.find(q => q.questionId === questionId);
    if (!question) return;
    
    const isMultiple = question.multipleSelections;
    
    // CRITICAL VALIDATION: Prevents exceeding selectionLimit in real time
    if (isMultiple && question.selectionLimit && Array.isArray(answer)) {
      if (answer.length > question.selectionLimit) {
        // Don't update state - keep previous selection
        return;
      }
    }
    
    setResponses(prev => ({
      ...prev,
      [questionId]: isMultiple 
        ? (Array.isArray(answer) ? answer : [answer].filter(Boolean)) 
        : answer
    }));
  };

  // Validate responses WITH ROBUST SELECTION LIMIT VALIDATION
  const allResponsesValid = useMemo(() => {
    const validationResults = normalizedQuestions.map(question => {
      const answer = responses[question.questionId];
      const isMultiple = question.multipleSelections;

      // VALIDATION 1: Selection limit for multiple choice
      if (isMultiple && Array.isArray(answer) && question.selectionLimit) {
        if (answer.length > question.selectionLimit) {
          return false;
        }
      }

      // VALIDATION 2: Required response
      if (isMultiple) {
        if (!Array.isArray(answer) || answer.length === 0) {
          return false;
        }
      } else {
        if (answer === undefined || answer === null || answer === '') {
          return false;
        }
      }

      // VALIDATION 3: Text length
      if (question.type === 'text') {
        const lengthConfig = {
          short: { min: 1, max: 100 },
          medium: { min: 10, max: 300 },
          long: { min: 50, max: 1000 },
          unrestricted: { min: 0, max: Infinity }
        }[question.answerLength?.toLowerCase()?.trim() || 'unrestricted'];
        
        const answerText = answer || '';
        const isValidLength = answerText.length >= lengthConfig.min && answerText.length <= lengthConfig.max;
        
        if (!isValidLength) {
          return false;
        }
      }
      
      return true;
    });

    const validCount = validationResults.filter(r => r).length;
    const allValid = validCount === validationResults.length;
    
    return allValid;
  }, [responses, normalizedQuestions]);

  // ROBUST Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // FINAL VALIDATION BEFORE SUBMISSION
    if (!allResponsesValid) {
      alert('Please complete all responses correctly before submitting. Check selection limits and required fields.');
      return;
    }
    
    if (!termsAccepted) {
      alert('Please accept the terms and conditions to continue.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      // Prepare data for submission
      const responseData = normalizedQuestions.map((q, index) => {
        let questionId;
        
        // Robust strategy for question IDs
        if (q.questionId && !isNaN(Number(q.questionId))) {
          questionId = Number(q.questionId);
        } else if (q.id && !isNaN(Number(q.id))) {
          questionId = Number(q.id);
        } else {
          questionId = index + 1;
        }

        return {
          questionId: questionId,
          answer: responses[q.questionId]
        };
      });

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
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorJson.error || 'Error sending responses');
        } catch {
          throw new Error(errorText || 'Error sending responses');
        }
      }

      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error sending responses:', error);
      
      // User-friendly error messages
      if (error.message.includes('already responded')) {
        alert('You have already responded to this survey. Thank you for your participation!');
      } else if (error.message.includes('response limit')) {
        alert('This survey has reached the maximum response limit. Thank you for your interest!');
      } else if (error.message.includes('Invalid response format')) {
        alert('Error in response format. Please verify that all questions have been answered correctly.');
      } else if (error.message.includes('Question with ID') && error.message.includes('not found')) {
        alert('Survey question compatibility error. Please reload the page and try again.');
      } else if (error.message.includes('selection limit')) {
        alert('The allowed selection limit was exceeded for some question. Please review your responses.');
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
    normalizedQuestions,
    handleResponseChange,
    handleTermsChange: (e) => setTermsAccepted(e.target.checked),
    handleSubmit,
    closeModal: () => setShowSuccessModal(false),
    allResponsesValid 
  };
};
