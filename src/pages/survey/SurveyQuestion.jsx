import React from 'react';
import {
  QuestionContainer, QuestionText, MediaContainer, ResponsiveImage,
  ResponsiveVideo, OptionsContainer, RadioInput, StyledCheckbox,
  OptionalItem, OptionLabel, DisabledHint, OtherInputWrapper,
  LimitRow, LimitTrack, LimitFill, LimitCount, LimitWarning,
  InputFieldStyled, TypeBadge, QuestionHeaderRow, RequiredBadge,
} from '../../components/survey/Survey.styles.jsx';
import CharacterCounter from './CharacterCounter';
import { useSurveyQuestionHandlers } from './SurveyQuestionHandlers';
import { FaCheckCircle, FaRegCircle, FaKeyboard } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

// ─── PROBLEMA 7: wrapper condicional ─────────────────────────────────────────
const fadeUp = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const ConditionalHint = styled.div`
  font-size: 0.8rem;
  color: #9CA3AF;
  font-style: italic;
  padding: 10px 4px 2px;
  animation: ${fadeUp} 0.25s ease-out;
`;

// ─── PROBLEMA 2: Labels de escala 1-5 ─────────────────────────────────────────
// Detecta se uma pergunta é de escala e retorna os labels correspondentes
const detectScaleLabels = (question) => {
  const text = (question.question || '').toLowerCase();
  const opts  = question.options || [];

  // Só processa se as opções são exatamente ['1','2','3','4','5']
  const numericOpts = opts.map(o => String(o).trim());
  const isScale5 = numericOpts.length === 5 &&
    numericOpts.every((o, i) => o === String(i + 1));

  if (!isScale5) return null;

  // Mapeamento por tipo de pergunta detectado no texto
  if (text.includes('probable') || text.includes('recomendarías') || text.includes('recomendar')) {
    return {
      1: '1 — Nada probable',
      2: '2 — Poco probable',
      3: '3 — Ni probable, ni improbable',
      4: '4 — Probable',
      5: '5 — Muy probable',
    };
  }
  if (text.includes('satisfech') || text.includes('satisfacci')) {
    return {
      1: '1 — Muy insatisfecho',
      2: '2 — Insatisfecho',
      3: '3 — Neutral',
      4: '4 — Satisfecho',
      5: '5 — Muy satisfecho',
    };
  }
  if (text.includes('frecuencia') || text.includes('frecuent') || text.includes('cuántas veces') || text.includes('con qué frecuencia')) {
    return {
      1: '1 — Nunca',
      2: '2 — Raramente',
      3: '3 — A veces',
      4: '4 — Frecuentemente',
      5: '5 — Siempre',
    };
  }
  if (text.includes('acuerdo') || text.includes('desacuerdo')) {
    return {
      1: '1 — Totalmente en desacuerdo',
      2: '2 — En desacuerdo',
      3: '3 — Ni de acuerdo ni en desacuerdo',
      4: '4 — De acuerdo',
      5: '5 — Totalmente de acuerdo',
    };
  }
  if (text.includes('calidad') || text.includes('excelente') || text.includes('calificación') || text.includes('calific')) {
    return {
      1: '1 — Muy malo',
      2: '2 — Malo',
      3: '3 — Regular',
      4: '4 — Bueno',
      5: '5 — Excelente',
    };
  }
  if (text.includes('importan') || text.includes('relevante') || text.includes('prioridad')) {
    return {
      1: '1 — Nada importante',
      2: '2 — Poco importante',
      3: '3 — Moderadamente importante',
      4: '4 — Importante',
      5: '5 — Muy importante',
    };
  }
  // Escala genérica
  return {
    1: '1 — Muy bajo',
    2: '2 — Bajo',
    3: '3 — Medio',
    4: '4 — Alto',
    5: '5 — Muy alto',
  };
};

// ─── PROBLEMA 7: helpers ──────────────────────────────────────────────────────
const isConditionalOnOtro = (q) => {
  const text = (q.question || '').toLowerCase();
  return (
    text.includes("si seleccionaste 'otro'") ||
    text.includes('si seleccionaste "otro"') ||
    text.includes('si seleccionaste otro') ||
    text.includes('si respondiste otro') ||
    text.includes('si elegiste otro') ||
    text.includes('si marcaste otro') ||
    (/si (seleccionaste|respondiste|elegiste|marcaste)/.test(text) && text.includes('otro'))
  );
};

const prevHasOtroSelected = (allQuestions, currentIndex, allResponses) => {
  if (currentIndex === 0) return false;
  const prev = allQuestions[currentIndex - 1];
  if (!prev) return false;
  const ans = allResponses[prev.questionId];
  const isMultiple = prev.multipleSelections === 'yes' || prev.multipleSelections === true;

  if (prev.otherOption) {
    if (isMultiple) return (ans?.selectedOptions ?? []).includes('other');
    return ans?.selectedOption === 'other';
  }
  const selected = isMultiple
    ? (Array.isArray(ans) ? ans : [])
    : (ans ? [ans] : []);
  return selected.some(s => typeof s === 'string' && s.toLowerCase() === 'otro');
};

// ─── Componente ───────────────────────────────────────────────────────────────
const SurveyQuestion = ({
  question, selectionLimit, response, onResponseChange,
  // Contexto para condicional (problema 7)
  allResponses = {}, questionIndex = 0, allQuestions = [],
}) => {
  const {
    isVerticalImage,
    getLengthLabel, getLengthConfig,
    handleTextChange, handleOptionChange, handleOtherTextChange,
    getCorrectedResponse, getOtherText,
    isResponseValid,
    isMultipleSelection,
    effectiveSelectionLimit,
    hasOtherOption,
    otherOptionText,
  } = useSurveyQuestionHandlers(question, response, onResponseChange);

  const limit = selectionLimit != null && !isNaN(Number(selectionLimit)) && Number(selectionLimit) > 0
    ? Number(selectionLimit)
    : effectiveSelectionLimit;

  const correctedResponse = getCorrectedResponse();
  const otherText = getOtherText();

  const currentCount = hasOtherOption
    ? (isMultipleSelection ? (response?.selectedOptions?.length ?? 0) : (response?.selectedOption ? 1 : 0))
    : (isMultipleSelection ? (Array.isArray(response) ? response.length : 0) : 0);

  const isAtLimit = limit != null && currentCount >= limit;
  const pct       = limit ? (currentCount / limit) * 100 : 0;

  // PROBLEMA 7: verificar se esta pergunta está oculta
  const isConditional  = isConditionalOnOtro(question);
  const showConditional = !isConditional || prevHasOtroSelected(allQuestions, questionIndex, allResponses);
  if (isConditional && !showConditional) return null; // Ocultar completamente

  // PROBLEMA 2: labels de escala
  const scaleLabels = detectScaleLabels(question);

  const isOptionSelected = (option) => {
    if (isMultipleSelection) return Array.isArray(correctedResponse) && correctedResponse.includes(option);
    return correctedResponse === option;
  };

  const canSelectMore = (option) => {
    if (!isMultipleSelection) return true;
    if (!limit) return true;
    return isOptionSelected(option) || currentCount < limit;
  };

  const handleOptionWithLimit = (option) => {
    if (!isMultipleSelection) { handleOptionChange(option); return; }
    if (!canSelectMore(option)) {
      alert(`❌ Solo puedes seleccionar hasta ${limit} opciones. Desmarca alguna para cambiar.`);
      return;
    }
    handleOptionChange(option);
  };

  // Badge de tipo
  const typeBadge = (() => {
    if (question.type === 'text') return { icon: <FaKeyboard size={12} />, label: 'Respuesta abierta', color: '#17a2b8' };
    if (isMultipleSelection && limit) return { icon: <FaCheckCircle size={12} />, label: `Selección múltiple — máx. ${limit}`, color: '#dc3545' };
    if (isMultipleSelection) return { icon: <FaCheckCircle size={12} />, label: 'Selección múltiple', color: '#28a745' };
    return { icon: <FaRegCircle size={12} />, label: 'Selección única', color: '#007bff' };
  })();

  return (
    <QuestionContainer data-question-id={question.questionId}>
      <QuestionHeaderRow>
        <TypeBadge $color={typeBadge.color}>{typeBadge.icon} {typeBadge.label}</TypeBadge>
        {question.required && <RequiredBadge>Obligatorio</RequiredBadge>}
      </QuestionHeaderRow>

      <QuestionText>
        {question.question}
        {question.type === 'text' && (
          <small style={{ display: 'block', marginTop: '4px', color: '#6e6e8a', fontSize: '0.85rem' }}>
            {getLengthLabel()}
          </small>
        )}
      </QuestionText>

      {question.imagem && (
        <MediaContainer>
          <ResponsiveImage src={question.imagem} $isVertical={isVerticalImage} alt={question.question} loading="lazy" />
        </MediaContainer>
      )}
      {question.video && (
        <MediaContainer>
          <ResponsiveVideo>
            <iframe src={question.video} title={question.question}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen frameBorder="0" />
          </ResponsiveVideo>
        </MediaContainer>
      )}

      {/* ── Input de texto ── */}
      {question.type === 'text' && (() => {
        const cfg = getLengthConfig();
        const isValid = isResponseValid(response);
        const hasContent = (response || '').length > 0;
        return (
          <div>
            <InputFieldStyled
              as="textarea"
              style={{ resize: 'vertical', minHeight: question.answerLength === 'long' ? '120px' : question.answerLength === 'medium' ? '80px' : '48px' }}
              placeholder="Escribe tu respuesta aquí..."
              value={response || ''}
              onChange={handleTextChange}
              required={question.required}
              $invalid={hasContent && !isValid ? true : undefined}
            />
            <CharacterCounter current={(response || '').length} max={cfg.max} min={cfg.min} />
          </div>
        );
      })()}

      {/* ── Opções múltiplas ── */}
      {question.type === 'multiple' && (
        <div>
          {isMultipleSelection && limit && (
            <>
              <LimitRow>
                <LimitTrack><LimitFill $pct={pct} /></LimitTrack>
                <LimitCount $atLimit={isAtLimit}>{currentCount}/{limit}</LimitCount>
              </LimitRow>
              {isAtLimit && (
                <LimitWarning>⛔ Límite alcanzado — desmarca una opción para cambiar.</LimitWarning>
              )}
            </>
          )}

          <OptionsContainer>
            {question.options.map((option, idx) => {
              const selected = isOptionSelected(option);
              const canSel   = canSelectMore(option);
              // PROBLEMA 2: usar label de escala se disponível
              const displayLabel = scaleLabels ? (scaleLabels[option] ?? option) : option;
              return (
                <OptionalItem key={idx} $selected={selected} $disabled={!canSel}
                  onClick={() => canSel && handleOptionWithLimit(option)}>
                  {isMultipleSelection
                    ? <StyledCheckbox type="checkbox" checked={selected} readOnly disabled={!canSel} />
                    : <RadioInput type="radio" name={`q-${question.questionId}`} checked={selected} readOnly />
                  }
                  <OptionLabel $selected={selected} $disabled={!canSel}>
                    {displayLabel}
                    {!canSel && !selected && <DisabledHint> (límite alcanzado)</DisabledHint>}
                  </OptionLabel>
                </OptionalItem>
              );
            })}

            {/* Opção Otro */}
            {hasOtherOption && (() => {
              const otherSelected = isOptionSelected('other');
              const canSelOther   = canSelectMore('other');
              return (
                <>
                  <OptionalItem $selected={otherSelected} $disabled={!canSelOther && !otherSelected}
                    onClick={() => (canSelOther || otherSelected) && handleOptionWithLimit('other')}>
                    {isMultipleSelection
                      ? <StyledCheckbox type="checkbox" checked={otherSelected} readOnly disabled={!canSelOther && !otherSelected} />
                      : <RadioInput type="radio" name={`q-${question.questionId}`} checked={otherSelected} readOnly />
                    }
                    <OptionLabel $selected={otherSelected}>{otherOptionText}</OptionLabel>
                  </OptionalItem>
                  {otherSelected && (
                    <OtherInputWrapper>
                      <InputFieldStyled type="text" placeholder="Especifica aquí..."
                        value={otherText}
                        onChange={(e) => handleOtherTextChange(e.target.value)}
                        autoFocus />
                    </OtherInputWrapper>
                  )}
                </>
              );
            })()}
          </OptionsContainer>
        </div>
      )}
    </QuestionContainer>
  );
};

export default SurveyQuestion;
