import { useState, useEffect, useCallback } from 'react';

const TEXT_LIMITS = {
  short:        { min: 1,  max: 100 },
  medium:       { min: 10, max: 300 },
  long:         { min: 50, max: 1000 },
  unrestricted: { min: 0,  max: Infinity },
};

export const useSurveyQuestionHandlers = (question, response, onResponseChange) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const hasOtherOption   = question.otherOption === true;
  const otherOptionText  = question.otherOptionText || 'Outro (especifique)';

  const isMultipleSelection = useCallback(() => {
    const v = question.multipleSelections;
    if (v === 'yes' || v === true || v === 'true' || v === 'sim') return true;
    if (v === 'no'  || v === false || v === 'false') return false;
    return false;
  }, [question.multipleSelections])();

  // selectionLimit vem já normalizado do hook pai
  const effectiveSelectionLimit =
    question.selectionLimit != null && !isNaN(Number(question.selectionLimit)) && Number(question.selectionLimit) > 0
      ? Number(question.selectionLimit)
      : null;

  // Carrega dimensões da imagem
  useEffect(() => {
    if (!question.imagem) return;
    const img = new Image();
    img.src = question.imagem;
    img.onload = () => setImageDimensions({ width: img.width, height: img.height });
  }, [question.imagem]);

  const isVerticalImage = imageDimensions.height > imageDimensions.width;
  const isSquareImage   = imageDimensions.height === imageDimensions.width;
  const imageAspectRatio = imageDimensions.height / imageDimensions.width;

  const getLengthConfig = useCallback(() => {
    const key = (question.answerLength || 'unrestricted').toLowerCase().trim();
    return TEXT_LIMITS[key] ?? TEXT_LIMITS.unrestricted;
  }, [question.answerLength]);

  const getLengthLabel = useCallback(() => {
    const map = {
      short: '🔹 Resposta curta (1–100 caracteres)',
      medium:'🔸 Resposta média (10–300 caracteres)',
      long:  '🔷 Resposta longa (50–1000 caracteres)',
    };
    const key = (question.answerLength || '').toLowerCase().trim();
    return map[key] || '∞ Sem limite de caracteres';
  }, [question.answerLength]);

  // Atualiza texto livre
  const handleTextChange = useCallback(
    (e) => onResponseChange(question.questionId, e.target.value),
    [question.questionId, onResponseChange]
  );

  // Atualiza seleção de opção
  const handleOptionChange = useCallback(
    (option) => {
      let newResponse;

      if (isMultipleSelection) {
        if (hasOtherOption) {
          const curr = response?.selectedOptions ?? [];
          const currText = response?.otherText ?? '';
          if (curr.includes(option)) {
            newResponse = { selectedOptions: curr.filter(x => x !== option), otherText: option === 'other' ? '' : currText };
          } else {
            if (effectiveSelectionLimit && curr.length >= effectiveSelectionLimit) return;
            newResponse = { selectedOptions: [...curr, option], otherText: currText };
          }
        } else {
          const curr = Array.isArray(response) ? response : [];
          if (curr.includes(option)) {
            newResponse = curr.filter(x => x !== option);
          } else {
            if (effectiveSelectionLimit && curr.length >= effectiveSelectionLimit) return;
            newResponse = [...curr, option];
          }
        }
      } else {
        if (hasOtherOption) {
          const currText = response?.otherText ?? '';
          const currSel  = response?.selectedOption ?? null;
          if (currSel === option) {
            newResponse = { selectedOption: null, otherText: option === 'other' ? '' : currText };
          } else {
            newResponse = { selectedOption: option, otherText: currText };
          }
        } else {
          newResponse = response === option ? '' : option;
        }
      }

      onResponseChange(question.questionId, newResponse);
    },
    [isMultipleSelection, hasOtherOption, response, effectiveSelectionLimit, question.questionId, onResponseChange]
  );

  // Atualiza texto do campo "outro"
  const handleOtherTextChange = useCallback(
    (text) => {
      if (!hasOtherOption) return;
      let newResponse;
      if (isMultipleSelection) {
        newResponse = { selectedOptions: response?.selectedOptions ?? [], otherText: text };
      } else {
        newResponse = { selectedOption: response?.selectedOption ?? null, otherText: text };
      }
      onResponseChange(question.questionId, newResponse);
    },
    [hasOtherOption, isMultipleSelection, response, question.questionId, onResponseChange]
  );

  const getCorrectedResponse = useCallback(() => {
    if (hasOtherOption) {
      return isMultipleSelection ? (response?.selectedOptions ?? []) : (response?.selectedOption ?? '');
    }
    if (isMultipleSelection) return Array.isArray(response) ? response : [];
    return response || '';
  }, [hasOtherOption, isMultipleSelection, response]);

  const getOtherText = useCallback(() => {
    return hasOtherOption ? (response?.otherText ?? '') : '';
  }, [hasOtherOption, response]);

  // Validação visual para texto (usada apenas no CharacterCounter)
  const isResponseValid = useCallback(
    (answer = '') => {
      if (question.type === 'text') {
        const text = (typeof answer === 'string' ? answer : '').trim();
        const required = question.required === true || question.required === 'yes';
        // Opcional e vazio → válido
        if (!required && text.length === 0) return true;
        const { min, max } = getLengthConfig();
        return text.length >= min && text.length <= max;
      }
      return true;
    },
    [question.type, question.required, getLengthConfig]
  );

  return {
    imageDimensions, isVerticalImage, isSquareImage, imageAspectRatio,
    getLengthLabel, getLengthConfig,
    handleTextChange, handleOptionChange, handleOtherTextChange,
    getCorrectedResponse, getOtherText,
    isResponseValid,
    isMultipleSelection,
    effectiveSelectionLimit,
    hasOtherOption,
    otherOptionText,
  };
};
