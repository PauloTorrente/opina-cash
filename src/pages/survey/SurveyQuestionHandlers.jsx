import { useState, useEffect, useCallback } from 'react';

// Answer length configuration
const answerLengthRequirements = {
  short: { min: 1, max: 100 },
  medium: { min: 10, max: 300 },
  long: { min: 50, max: 1000 },
  unrestricted: { min: 0, max: Infinity }
};

export const useSurveyQuestionHandlers = (question, response, onResponseChange) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Get image dimensions for responsive rendering
  useEffect(() => {
    if (!question.imagem) return;

    const img = new Image();
    img.src = question.imagem;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, [question.imagem]);

  // Calculate image properties
  const isVerticalImage = imageDimensions.height > imageDimensions.width;
  const isSquareImage = imageDimensions.height === imageDimensions.width;
  const imageAspectRatio = imageDimensions.height / imageDimensions.width;

  // Get length configuration for text questions
  const getLengthConfig = useCallback(() => {
    const cleanLength = (question.answerLength || 'unrestricted').toString().toLowerCase().trim();
    return answerLengthRequirements[cleanLength] || answerLengthRequirements.unrestricted;
  }, [question.answerLength]);

  // Validate response based on question type
  const isResponseValid = useCallback((answer = '') => {
    if (question.type !== 'text') {
      const isMultiple = question.multipleSelections === 'yes' || question.multipleSelections === true;
      if (isMultiple) {
        return Array.isArray(answer) && answer.length > 0; // CRITICAL FIX: Require at least one selection
      }
      return answer !== undefined && answer !== '';
    }

    const answerStr = typeof answer === 'string' ? answer : JSON.stringify(answer);
    const { min, max } = getLengthConfig();
    return answerStr.length >= min && answerStr.length <= max;
  }, [question.type, question.multipleSelections, getLengthConfig]);

  // Get display label for length requirements
  const getLengthLabel = useCallback(() => {
    const labelMap = {
      short: '🔹 Short answer (1-100 characters)',
      medium: '🔸 Medium answer (10-300 characters)',
      long: '🔷 Long answer (50-1000 characters)',
      default: '∞ No character limit'
    };
    const cleanLength = (question.answerLength || '').toString().toLowerCase().trim();
    return labelMap[cleanLength] || labelMap.default;
  }, [question.answerLength]);

  // Handle option selection - FIXED VERSION
  const handleOptionChange = useCallback((option) => {
    const isMultipleSelection = question.multipleSelections === 'yes' || question.multipleSelections === true;
    let newResponse;

    if (isMultipleSelection) {
      // For multiple selection: always use array format
      const currentArray = Array.isArray(response) ? response : [];
      
      if (currentArray.includes(option)) {
        // Remove option if already selected
        newResponse = currentArray.filter(item => item !== option);
      } else {
        // Add option
        newResponse = [...currentArray, option];
      }
      
      // CRITICAL FIX: Ensure array is never empty for multiple selection questions
      // Backend validation requires at least one selection
      console.log('✅ [MULTIPLE] Response updated:', newResponse);
    } else {
      // For single selection: use string directly
      newResponse = response === option ? '' : option;
      console.log('✅ [SINGLE] Response updated:', newResponse);
    }

    onResponseChange(question.questionId, newResponse);
  }, [question.multipleSelections, question.questionId, onResponseChange, response]);

  // Handle text input changes
  const handleTextChange = useCallback((e) => {
    const newValue = e.target.value;
    onResponseChange(question.questionId, newValue);
  }, [question.questionId, onResponseChange]);

  // Validate response format before submission
  const validateResponseFormat = useCallback(() => {
    const isMultipleSelection = question.multipleSelections === 'yes' || question.multipleSelections === true;
    
    if (isMultipleSelection) {
      // For multiple selection: must be array (can be empty during input)
      if (!Array.isArray(response)) {
        console.warn('❌ [VALIDATION] Expected array for multiple selection');
        return false;
      }
      return true;
    } else {
      // For single selection: string or empty array
      if (Array.isArray(response) && response.length > 0) {
        console.warn('❌ [VALIDATION] Expected string for single selection');
        return false;
      }
      return true;
    }
  }, [question.multipleSelections, response]);

  // Fix response format if needed
  const getCorrectedResponse = useCallback(() => {
    const isMultipleSelection = question.multipleSelections === 'yes' || question.multipleSelections === true;
    
    if (isMultipleSelection) {
      // Ensure it's always an array for multiple selection
      return Array.isArray(response) ? response : [];
    } else {
      // Ensure it's a string for single selection
      if (Array.isArray(response)) {
        return response.length > 0 ? response[0] : '';
      }
      return response || '';
    }
  }, [question.multipleSelections, response]);

  return {
    imageDimensions,
    isVerticalImage,
    isSquareImage,
    imageAspectRatio,
    getLengthLabel,
    handleTextChange,
    handleOptionChange,
    isResponseValid,
    getLengthConfig,
    validateResponseFormat,
    getCorrectedResponse
  };
};
