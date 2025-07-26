import { useState, useEffect, useCallback } from 'react';

// Answer length requirements configuration
const answerLengthRequirements = {
  short: { min: 1, max: 100 },
  medium: { min: 10, max: 300 },
  long: { min: 50, max: 1000 },
  unrestricted: { min: 0, max: Infinity }
};

export const useSurveyQuestionHandlers = (question, response, onResponseChange) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Extract dimensions from image URL if available
  const getDimensionsFromUrl = useCallback((url) => {
    if (!url) return null;
    const dimensionMatch = url.match(/(\d+)x(\d+)/);
    return dimensionMatch ? {
      width: parseInt(dimensionMatch[1]),
      height: parseInt(dimensionMatch[2])
    } : null;
  }, []);

  // Handle image dimension calculation and responsive rendering
  useEffect(() => {
    if (!question.imagem) return;

    const urlDimensions = getDimensionsFromUrl(question.imagem);
    if (urlDimensions) {
      setImageDimensions(urlDimensions);
      return;
    }

    const img = new Image();
    img.src = question.imagem;

    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [question.imagem, getDimensionsFromUrl]);

  // Calculate image orientation and responsive behavior
  const isVerticalImage = imageDimensions.height > imageDimensions.width;
  const isSquareImage = imageDimensions.height === imageDimensions.width;
  const imageAspectRatio = imageDimensions.height / imageDimensions.width;

  // Get answer length configuration based on question settings
  const getLengthConfig = useCallback(() => {
    const lengthMap = {
      short: answerLengthRequirements.short,
      medium: answerLengthRequirements.medium,
      long: answerLengthRequirements.long,
      unrestricted: answerLengthRequirements.unrestricted
    };

    const cleanLength = (question.answerLength || 'unrestricted').toString().toLowerCase().trim();
    return lengthMap[cleanLength] || answerLengthRequirements.unrestricted;
  }, [question.answerLength]);

  // Validate response based on question type
  const isResponseValid = useCallback((answer = '') => {
    if (question.type !== 'text') {
      return question.multipleSelections
        ? Array.isArray(answer) && answer.length > 0
        : answer !== undefined && answer !== '';
    }

    const answerStr = typeof answer === 'string' ? answer : JSON.stringify(answer);
    const { min, max } = getLengthConfig();
    return answerStr.length >= min && answerStr.length <= max;
  }, [question.type, question.multipleSelections, getLengthConfig]);

  // Get display label for answer length requirements
  const getLengthLabel = useCallback(() => {
    const labelMap = {
      short: '🔹 Respuesta corta (1-100 caracteres)',
      medium: '🔸 Respuesta media (10-300 caracteres)',
      long: '🔷 Respuesta larga (50-1000 caracteres)',
      default: '∞ Sin límite de caracteres'
    };

    const cleanLength = (question.answerLength || '').toString().toLowerCase().trim();
    return labelMap[cleanLength] || labelMap.default;
  }, [question.answerLength]);

  // Handle option selection changes
  const handleOptionChange = useCallback((option) => {
    const isMultiple = question.multipleSelections;

    if (isMultiple) {
      const currentSelections = Array.isArray(response) ? [...response] : [];
      const newSelections = currentSelections.includes(option)
        ? currentSelections.filter(item => item !== option)
        : [...currentSelections, option];
      onResponseChange(question.questionId, newSelections);
    } else {
      const newValue = response === option ? '' : option;
      onResponseChange(question.questionId, newValue);
    }
  }, [question.multipleSelections, question.questionId, onResponseChange, response]);

  // Handle text input changes
  const handleTextChange = useCallback((e) => {
    onResponseChange(question.questionId, e.target.value);
  }, [question.questionId, onResponseChange]);

  return {
    imageDimensions,
    isVerticalImage,
    isSquareImage,
    imageAspectRatio,
    getLengthLabel,
    handleTextChange,
    handleOptionChange,
    isResponseValid,
    getLengthConfig
  };
};
