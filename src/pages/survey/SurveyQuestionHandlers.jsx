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

  // Normalize selectionLimit and multipleSelections
  const normalizedSelectionLimit =
    question.selectionLimit !== undefined &&
    question.selectionLimit !== null &&
    question.selectionLimit !== ''
      ? Number(question.selectionLimit)
      : undefined;

  const isMultipleSelection =
    question.multipleSelections === 'yes' || question.multipleSelections === true;

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
    const cleanLength = (question.answerLength || 'unrestricted')
      .toString()
      .toLowerCase()
      .trim();
    return (
      answerLengthRequirements[cleanLength] ||
      answerLengthRequirements.unrestricted
    );
  }, [question.answerLength]);

  // Validate response based on question type
  const isResponseValid = useCallback(
    (answer = '') => {
      if (question.type !== 'text') {
        if (isMultipleSelection) {
          const currentSelections = Array.isArray(answer) ? answer.length : 0;

          if (question.required === true || question.required === 'yes') {
            if (currentSelections === 0) return false;
          }

          if (
            normalizedSelectionLimit &&
            currentSelections > normalizedSelectionLimit
          ) {
            return false;
          }

          return Array.isArray(answer);
        }

        if (question.required === true || question.required === 'yes') {
          return answer !== undefined && answer !== '' && answer !== null;
        }

        return true;
      }

      // For text questions
      const answerStr =
        typeof answer === 'string' ? answer : JSON.stringify(answer);
      const { min, max } = getLengthConfig();

      if (question.required === true || question.required === 'yes') {
        return answerStr.length >= min && answerStr.length <= max;
      }

      return (
        answerStr === '' || (answerStr.length >= min && answerStr.length <= max)
      );
    },
    [
      question.type,
      question.required,
      isMultipleSelection,
      normalizedSelectionLimit,
      getLengthConfig
    ]
  );

  // Get display label for length requirements
  const getLengthLabel = useCallback(() => {
    const labelMap = {
      short: '🔹 Respuesta corta (1-100 caracteres)',
      medium: '🔸 Respuesta media (10-300 caracteres)',
      long: '🔷 Respuesta larga (50-1000 caracteres)',
      default: '∞ Sin límite de caracteres'
    };
    const cleanLength = (question.answerLength || '')
      .toString()
      .toLowerCase()
      .trim();
    return labelMap[cleanLength] || labelMap.default;
  }, [question.answerLength]);

  // Handle option selection with selectionLimit enforcement
  const handleOptionChange = useCallback(
    (option) => {
      let newResponse;

      if (isMultipleSelection) {
        const currentArray = Array.isArray(response) ? response : [];
        const currentSelections = currentArray.length;
        const selectionLimit = normalizedSelectionLimit || Infinity;

        if (currentArray.includes(option)) {
          newResponse = currentArray.filter((item) => item !== option);
        } else {
          if (currentSelections >= selectionLimit) return;
          newResponse = [...currentArray, option];
        }
      } else {
        newResponse = response === option ? '' : option;
      }

      onResponseChange(question.questionId, newResponse);
    },
    [
      isMultipleSelection,
      response,
      normalizedSelectionLimit,
      question.questionId,
      onResponseChange
    ]
  );

  // Handle text input changes
  const handleTextChange = useCallback(
    (e) => {
      onResponseChange(question.questionId, e.target.value);
    },
    [question.questionId, onResponseChange]
  );

  // Validate response format before submission
  const validateResponseFormat = useCallback(() => {
    if (isMultipleSelection) {
      return Array.isArray(response);
    } else {
      if (Array.isArray(response) && response.length > 0) {
        return false;
      }
      return true;
    }
  }, [isMultipleSelection, response]);

  // Fix response format if needed
  const getCorrectedResponse = useCallback(() => {
    if (isMultipleSelection) {
      return Array.isArray(response) ? response : [];
    } else {
      if (Array.isArray(response)) {
        return response.length > 0 ? response[0] : '';
      }
      return response || '';
    }
  }, [isMultipleSelection, response]);

  // Get selection limit info for UI
  const getSelectionLimitInfo = useCallback(() => {
    if (!isMultipleSelection) return null;

    const currentSelections = Array.isArray(response) ? response.length : 0;
    const selectionLimit = normalizedSelectionLimit;

    return {
      current: currentSelections,
      limit: selectionLimit,
      hasLimit: !!selectionLimit,
      canSelectMore: !selectionLimit || currentSelections < selectionLimit,
      isAtLimit: !!selectionLimit && currentSelections >= selectionLimit,
      remaining: selectionLimit ? selectionLimit - currentSelections : Infinity
    };
  }, [isMultipleSelection, normalizedSelectionLimit, response]);

  // Check if selection limit is exceeded
  const isSelectionLimitExceeded = useCallback(() => {
    if (question.type !== 'text' && isMultipleSelection) {
      const currentSelection = Array.isArray(response) ? response : [];
      return (
        normalizedSelectionLimit &&
        currentSelection.length > normalizedSelectionLimit
      );
    }
    return false;
  }, [question.type, isMultipleSelection, normalizedSelectionLimit, response]);

  // Get current selection count
  const getSelectionCount = useCallback(() => {
    if (question.type !== 'text' && isMultipleSelection) {
      return Array.isArray(response) ? response.length : 0;
    }
    return 0;
  }, [question.type, isMultipleSelection, response]);

  // Check if option can be selected (for UI disabling)
  const canSelectOption = useCallback(
    (option) => {
      if (!isMultipleSelection) return true;

      const currentArray = Array.isArray(response) ? response : [];
      const isSelected = currentArray.includes(option);
      const selectionLimit = normalizedSelectionLimit;

      if (isSelected) return true;
      return !selectionLimit || currentArray.length < selectionLimit;
    },
    [isMultipleSelection, normalizedSelectionLimit, response]
  );

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
    getCorrectedResponse,
    getSelectionLimitInfo,
    isSelectionLimitExceeded,
    getSelectionCount,
    canSelectOption
  };
};

