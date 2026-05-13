import React from 'react';
import {
  InputFieldStyled, OptionsContainer,
  RadioInput, StyledCheckbox, OptionalItem,
  OptionLabel, DisabledHint, OtherInputWrapper,
  LimitRow, LimitTrack, LimitFill, LimitCount, LimitWarning
} from '../../components/survey/Survey.styles.jsx';
import CharacterCounter from './CharacterCounter';

const QuestionInputRenderer = ({
  question,
  response,
  limitInfo,
  handleTextChange,
  handleOptionChangeWithLimit,
  handleOptionChange,
  getLengthConfig,
  isResponseValid,
  getCorrectedResponse,
  handleOtherTextChange,
  otherText,
  correctedResponse,
  effectiveSelectionLimit,
  hasOtherOption,
  otherOptionText,
  canSelectMoreOptions
}) => {
  const isMultipleSelection = question.multipleSelections === 'yes' || question.multipleSelections === true;

  const isOptionSelected = (option) => {
    if (hasOtherOption) {
      if (isMultipleSelection) return Array.isArray(correctedResponse) && correctedResponse.includes(option);
      return correctedResponse === option;
    }
    return isMultipleSelection
      ? Array.isArray(correctedResponse) && correctedResponse.includes(option)
      : correctedResponse === option;
  };

  // ── Text input ──────────────────────────────────────────────────────────────
  const renderTextInput = () => {
    const lengthConfig = getLengthConfig();
    const isValid = isResponseValid(response);
    const hasContent = response && response.length > 0;

    return (
      <div>
        <InputFieldStyled
          type="text"
          placeholder="Escribe tu respuesta aquí..."
          value={response || ''}
          onChange={handleTextChange}
          required={question.required}
          $invalid={hasContent ? !isValid : undefined}
        />
        <CharacterCounter
          current={response?.length || 0}
          max={lengthConfig.max}
          min={lengthConfig.min}
        />
      </div>
    );
  };

  // ── Multiple choice ─────────────────────────────────────────────────────────
  const renderMultipleChoice = () => {
    const pct = limitInfo.hasLimit && limitInfo.max > 0
      ? (limitInfo.current / limitInfo.max) * 100
      : 0;

    return (
      <div>
        {/* Selection progress bar */}
        {isMultipleSelection && limitInfo.hasLimit && (
          <LimitRow>
            <LimitTrack>
              <LimitFill $pct={pct} />
            </LimitTrack>
            <LimitCount $atLimit={limitInfo.isAtLimit}>
              {limitInfo.current}/{limitInfo.max}
            </LimitCount>
          </LimitRow>
        )}

        {/* Limit reached warning */}
        {limitInfo.hasLimit && limitInfo.isAtLimit && (
          <LimitWarning>
            ⛔ Límite alcanzado — desmarca alguna opción para cambiar.
          </LimitWarning>
        )}

        <OptionsContainer>
          {question.options.map((option, index) => {
            const isSelected = isOptionSelected(option);
            const canSelect  = !isMultipleSelection
              || !limitInfo.hasLimit
              || limitInfo.current < limitInfo.max
              || isSelected;

            return (
              <OptionalItem
                key={index}
                $selected={isSelected}
                $disabled={!canSelect}
                onClick={() => canSelect && (isMultipleSelection
                  ? handleOptionChangeWithLimit(option)
                  : handleOptionChange(option))}
              >
                {isMultipleSelection ? (
                  <StyledCheckbox
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    disabled={!canSelect}
                  />
                ) : (
                  <RadioInput
                    type="radio"
                    name={`question-${question.questionId}`}
                    checked={isSelected}
                    readOnly
                  />
                )}
                <OptionLabel $selected={isSelected} $disabled={!canSelect}>
                  {option}
                  {!canSelect && !isSelected && (
                    <DisabledHint> (límite alcanzado)</DisabledHint>
                  )}
                </OptionLabel>
              </OptionalItem>
            );
          })}

          {/* Other option */}
          {hasOtherOption && (() => {
            const otherSelected = isMultipleSelection
              ? Array.isArray(correctedResponse) && correctedResponse.includes('other')
              : correctedResponse === 'other';
            const canSelectOther = !isMultipleSelection
              || canSelectMoreOptions(correctedResponse, effectiveSelectionLimit, 'other');

            return (
              <>
                <OptionalItem
                  key="other"
                  $selected={otherSelected}
                  $disabled={!canSelectOther && !otherSelected}
                  onClick={() => (canSelectOther || otherSelected) && handleOptionChangeWithLimit('other')}
                >
                  {isMultipleSelection ? (
                    <StyledCheckbox type="checkbox" checked={otherSelected} readOnly disabled={!canSelectOther && !otherSelected} />
                  ) : (
                    <RadioInput type="radio" name={`question-${question.questionId}`} checked={otherSelected} readOnly />
                  )}
                  <OptionLabel $selected={otherSelected}>
                    {otherOptionText}
                  </OptionLabel>
                </OptionalItem>

                {otherSelected && (
                  <OtherInputWrapper>
                    <InputFieldStyled
                      type="text"
                      placeholder="Especifique..."
                      value={otherText}
                      onChange={(e) => handleOtherTextChange(e.target.value)}
                      autoFocus
                    />
                    {question.answerLength && (
                      <CharacterCounter
                        current={otherText.length}
                        max={getLengthConfig().max}
                        min={getLengthConfig().min}
                      />
                    )}
                  </OtherInputWrapper>
                )}
              </>
            );
          })()}
        </OptionsContainer>
      </div>
    );
  };

  switch (question.type) {
    case 'text':     return renderTextInput();
    case 'multiple': return renderMultipleChoice();
    default:         return null;
  }
};

export default QuestionInputRenderer;
