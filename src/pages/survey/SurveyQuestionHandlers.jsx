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

  // Robust detection of multiple selection with all possible cases
  const getIsMultipleSelection = useCallback(() => {
    const value = question.multipleSelections;
    
    if (value === 'yes' || value === true || value === 'true' || value === 'sim') {
      return true;
    }
    
    if (value === 'no' || value === false || value === 'false' || value === 'não' || value === 'nao') {
      return false;
    }

    if (question.selectionLimit && question.selectionLimit > 1) {
      return true;
    }

    return false;
  }, [question.multipleSelections, question.selectionLimit]);

  // Robust selection limit detection
  const getEffectiveSelectionLimit = useCallback(() => {
    const isMultipleSelection = getIsMultipleSelection();
    
    if (!isMultipleSelection) {
      return 1;
    }

    if (question.selectionLimit != null && question.selectionLimit !== '') {
      const limit = Number(question.selectionLimit);
      if (!isNaN(limit) && limit > 0) {
        return limit;
      }
    }

    const textLimit = extractLimitFromQuestionText(question.question);
    if (textLimit) {
      return textLimit;
    }

    return null;
  }, [question.selectionLimit, question.question, getIsMultipleSelection]);

  // Extract limit from question text
  const extractLimitFromQuestionText = useCallback((questionText) => {
    if (!questionText) return null;

    const patterns = [
      { regex: /\(Selecione hasta (\d+)\)/i },
      { regex: /\(selecione até (\d+)\)/i },
      { regex: /\(até (\d+) opções\)/i },
      { regex: /\(choose up to (\d+)\)/i },
      { regex: /\(select up to (\d+)\)/i },
      { regex: /\(max\.? (\d+)\)/i },
      { regex: /\(maximum (\d+)\)/i },
      { regex: /\(limite de (\d+)\)/i },
      { regex: /\(máximo de (\d+)\)/i },
      { regex: /\(até (\d+)\)/i },
      { regex: /selecione (\d+) opções/i },
      { regex: /choose (\d+) options/i },
      { regex: /select (\d+) options/i },
      { regex: /up to (\d+) options/i },
      { regex: /máximo (\d+)/i },
      { regex: /maximum (\d+)/i },
      { regex: /limite (\d+)/i },
      { regex: /até (\d+)/i }
    ];

    for (const pattern of patterns) {
      const match = questionText.match(pattern.regex);
      if (match && match[1]) {
        const limit = parseInt(match[1]);
        if (!isNaN(limit) && limit > 0) {
          return limit;
        }
      }
    }

    return null;
  }, []);

  const isMultipleSelection = getIsMultipleSelection();
  const effectiveSelectionLimit = getEffectiveSelectionLimit();

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
            effectiveSelectionLimit &&
            currentSelections > effectiveSelectionLimit
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
      effectiveSelectionLimit,
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
        const selectionLimit = effectiveSelectionLimit || Infinity;

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
      effectiveSelectionLimit,
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

    return {
      current: currentSelections,
      limit: effectiveSelectionLimit,
      hasLimit: !!effectiveSelectionLimit,
      canSelectMore: !effectiveSelectionLimit || currentSelections < effectiveSelectionLimit,
      isAtLimit: !!effectiveSelectionLimit && currentSelections >= effectiveSelectionLimit,
      remaining: effectiveSelectionLimit ? effectiveSelectionLimit - currentSelections : Infinity
    };
  }, [isMultipleSelection, effectiveSelectionLimit, response]);

  // Check if selection limit is exceeded
  const isSelectionLimitExceeded = useCallback(() => {
    if (question.type !== 'text' && isMultipleSelection) {
      const currentSelection = Array.isArray(response) ? response : [];
      return (
        effectiveSelectionLimit &&
        currentSelection.length > effectiveSelectionLimit
      );
    }
    return false;
  }, [question.type, isMultipleSelection, effectiveSelectionLimit, response]);

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

      if (isSelected) return true;
      return !effectiveSelectionLimit || currentArray.length < effectiveSelectionLimit;
    },
    [isMultipleSelection, effectiveSelectionLimit, response]
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
    canSelectOption,
    isMultipleSelection,
    effectiveSelectionLimit
  };
};
