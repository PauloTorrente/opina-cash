import { useEffect } from 'react';
import {
  QuestionContainer, QuestionText, MediaContainer, ResponsiveImage,
  ResponsiveVideo, InputFieldStyled, OptionsContainer, OptionItem,
  RadioInput, RadioLabel, StyledCheckbox, CheckboxLabel, SelectionTypeIndicator,
} from '../../components/survey/Survey.styles.jsx';
import CharacterCounter from './CharacterCounter';
import { useSurveyQuestionHandlers } from './SurveyQuestionHandlers';

const SurveyQuestion = ({ question, response, onResponseChange }) => {
  const {
    imageDimensions, isVerticalImage, isSquareImage, imageAspectRatio,
    getLengthLabel, handleTextChange, handleOptionChange, isResponseValid,
    getLengthConfig, validateResponseFormat, getCorrectedResponse
  } = useSurveyQuestionHandlers(question, response, onResponseChange);

  // Validate response format on render
  useEffect(() => {
    const isValid = validateResponseFormat();
    if (!isValid) {
      console.error('❌ [RENDER] Invalid response format detected');
    }
  }, [question.questionId, response, validateResponseFormat]);

  console.log('🔍 [RENDER] SurveyQuestion:', {
    questionId: question.questionId,
    type: question.type,
    multiple: question.multipleSelections,
    response: response
  });

  // Render input based on question type
  const renderInputComponent = () => {
    switch (question.type) {
      case 'text':
        const lengthConfig = getLengthConfig();
        const isValid = isResponseValid(response);
        return (
          <div>
            <InputFieldStyled
              type="text"
              placeholder="Escribe tu respuesta aquí..."
              value={response || ''}
              onChange={handleTextChange}
              required
              style={{
                borderColor: !response ? '' : isValid ? '#38a169' : '#e53e3e'
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

      case 'multiple':
        const correctedResponse = getCorrectedResponse();
        const isMultipleSelection = question.multipleSelections === 'yes' || question.multipleSelections === true;

        return (
          <div>
            <SelectionTypeIndicator>
              {isMultipleSelection ? '🔘 Multiple selection allowed' : '⭕ Single selection'}
            </SelectionTypeIndicator>

            <OptionsContainer>
              {question.options.map((option, index) => {
                const isSelected = isMultipleSelection
                  ? Array.isArray(correctedResponse) && correctedResponse.includes(option)
                  : correctedResponse === option;

                return (
                  <OptionItem key={index}>
                    {isMultipleSelection ? (
                      <>
                        <StyledCheckbox
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleOptionChange(option)}
                          aria-label={`Select ${option}`}
                        />
                        <CheckboxLabel selected={isSelected}>
                          {option}
                        </CheckboxLabel>
                      </>
                    ) : (
                      <>
                        <RadioInput
                          type="radio"
                          name={`question-${question.questionId}`}
                          checked={isSelected}
                          onChange={() => handleOptionChange(option)}
                          aria-label={`Select ${option}`}
                        />
                        <RadioLabel selected={isSelected}>
                          {option}
                        </RadioLabel>
                      </>
                    )}
                  </OptionItem>
                );
              })}
            </OptionsContainer>
          </div>
        );

      default:
        console.warn('⚠️ Unsupported question type:', question.type);
        return null;
    }
  };

  return (
    <QuestionContainer data-question-id={question.questionId}>
      <QuestionText>
        {question.question}
        {question.type === 'text' && (
          <small style={{ display: 'block', marginTop: '0.5rem', color: '#4a5568' }}>
            {getLengthLabel()}
          </small>
        )}
      </QuestionText>

      {question.imagem && (
        <MediaContainer>
          <ResponsiveImage
            src={question.imagem}
            $isVertical={isVerticalImage}
            $isSquare={isSquareImage}
            $aspectRatio={imageAspectRatio}
            alt={`Image for: ${question.question}`}
            loading="lazy"
          />
        </MediaContainer>
      )}

      {question.video && (
        <MediaContainer>
          <ResponsiveVideo>
            <iframe
              src={question.video}
              title={`Video for: ${question.question}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            />
          </ResponsiveVideo>
        </MediaContainer>
      )}

      {renderInputComponent()}
    </QuestionContainer>
  );
};

export default SurveyQuestion;
