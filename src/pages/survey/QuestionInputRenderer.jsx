import React from 'react';
import {
  InputFieldStyled, OptionsContainer,
  RadioInput, RadioLabel, StyledCheckbox, OptionalItem, CheckboxLabel2
} from '../../components/survey/Survey.styles.jsx';
import CharacterCounter from './CharacterCounter';

// Component for rendering different input types based on question configuration
const QuestionInputRenderer = ({
  question,
  response,
  limitInfo,
  handleTextChange,
  handleOptionChangeWithLimit,
  handleOptionChange,
  getLengthConfig,
  isResponseValid,
  getCorrectedResponse
}) => {
  // Render text input for open-ended questions
  const renderTextInput = () => {
    const lengthConfig = getLengthConfig();
    const isValid = isResponseValid(response);
    
    return (
      <div>
        <InputFieldStyled
          type="text"
          placeholder="Escribe tu respuesta aquí..."
          value={response || ''}
          onChange={handleTextChange}
          required={question.required}
          style={{
            borderColor: !response ? '' : isValid ? '#28a745' : '#dc3545'
          }}
          aria-invalid={!isValid}
        />
        <CharacterCounter
          current={response?.length || 0}
          max={lengthConfig.max}
          min={lengthConfig.min}
        />
      </div>
    );
  };

  // Render multiple choice options with limit handling
  const renderMultipleChoice = () => {
    const correctedResponse = getCorrectedResponse();
    const isMultipleSelection = question.multipleSelections === 'yes' || question.multipleSelections === true;
    
    return (
      <div>
        {/* Limit progress bar - just the bar */}
        {isMultipleSelection && limitInfo.hasLimit && (
          <div style={{
            marginBottom: '15px'
          }}>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#e9ecef',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${Math.min(100, (limitInfo.current / limitInfo.max) * 100)}%`,
                  height: '100%',
                  backgroundColor: limitInfo.current >= limitInfo.max ? '#dc3545' : 
                                 limitInfo.current > limitInfo.max * 0.8 ? '#fd7e14' : '#28a745',
                  transition: 'all 0.3s ease',
                  borderRadius: '3px'
                }}
              />
            </div>
            {/* Simple counter below the bar */}
            {limitInfo.current > 0 && (
              <div style={{
                fontSize: '0.8rem',
                color: '#6c757d',
                textAlign: 'right',
                marginTop: '4px'
              }}>
                {limitInfo.current}/{limitInfo.max} seleccionadas
              </div>
            )}
          </div>
        )}

        {/* Limit reached message */}
        {limitInfo.hasLimit && limitInfo.current >= limitInfo.max && (
          <div style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
            fontSize: '14px',
            marginBottom: '15px'
          }}>
            ⚠️ Límite máximo alcanzado. Desmarca algunas opciones para seleccionar otras.
          </div>
        )}

        <OptionsContainer>
          {question.options.map((option, index) => {
            const isSelected = isMultipleSelection
              ? Array.isArray(correctedResponse) && correctedResponse.includes(option)
              : correctedResponse === option;

            const canSelect = !isMultipleSelection || 
              !limitInfo.hasLimit || 
              limitInfo.current < limitInfo.max || 
              isSelected;

            return (
              <OptionalItem 
                key={index} 
                $disabled={!canSelect}
                $isAtLimit={limitInfo.hasLimit && limitInfo.current >= limitInfo.max && !isSelected}
              >
                {isMultipleSelection ? (
                  <>
                    <StyledCheckbox
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleOptionChangeWithLimit(option)}
                      aria-label={`Seleccionar ${option}`}
                      disabled={!canSelect}
                      style={{
                        cursor: canSelect ? 'pointer' : 'not-allowed',
                        opacity: canSelect ? 1 : 0.5
                      }}
                    />
                    <CheckboxLabel2 
                      selected={isSelected} 
                      $disabled={!canSelect}
                    >
                      {option}
                      {!canSelect && !isSelected && limitInfo.hasLimit && (
                        <span style={{ 
                          fontSize: '0.8rem', 
                          color: '#dc3545', 
                          marginLeft: '5px',
                          fontStyle: 'italic'
                        }}>
                          (límite alcanzado)
                        </span>
                      )}
                    </CheckboxLabel2>
                  </>
                ) : (
                  <>
                    <RadioInput
                      type="radio"
                      name={`question-${question.questionId}`}
                      checked={isSelected}
                      onChange={() => handleOptionChange(option)}
                      aria-label={`Seleccionar ${option}`}
                    />
                    <RadioLabel selected={isSelected}>
                      {option}
                    </RadioLabel>
                  </>
                )}
              </OptionalItem>
            );
          })}
        </OptionsContainer>
      </div>
    );
  };

  // Main render function that switches between input types
  switch (question.type) {
    case 'text':
      return renderTextInput();
    case 'multiple':
      return renderMultipleChoice();
    default:
      return null;
  }
};

export default QuestionInputRenderer;
