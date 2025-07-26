import {
  QuestionContainer,
  QuestionText,
  MediaContainer,
  ResponsiveImage,
  ResponsiveVideo,
  InputFieldStyled,
  OptionsContainer,
  OptionItem,
  RadioInput,
  RadioLabel,
  StyledCheckbox,
  CheckboxLabel,
  SelectionTypeIndicator,
} from '../../components/survey/Survey.styles.jsx';
import CharacterCounter from './CharacterCounter';
import { useSurveyQuestionHandlers } from './SurveyQuestionHandlers';

const SurveyQuestion = ({ question, response, onResponseChange }) => {
  const {
    imageDimensions,
    isVerticalImage,
    isSquareImage,
    imageAspectRatio,
    getLengthLabel,
    handleTextChange,
    handleOptionChange,
    isResponseValid,
    getLengthConfig
  } = useSurveyQuestionHandlers(question, response, onResponseChange);

  // Render appropriate input component based on question type
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
                borderColor: !response ? '' : isValid ? '#38a169' : '#e53e3e',
                boxShadow: !response ? '' : isValid ? '0 0 0 1px #38a169' : '0 0 0 1px #e53e3e'
              }}
              aria-invalid={!isValid}
              aria-describedby={`length-counter-${question.questionId}`}
            />
            <CharacterCounter
              current={response?.length || 0}
              max={lengthConfig.max}
              min={lengthConfig.min}
              id={`length-counter-${question.questionId}`}
            />
          </div>
        );

      case 'multiple':
        return (
          <div>
            <SelectionTypeIndicator>
              {question.multipleSelections
                ? '🔘 Selección múltiple permitida'
                : '⭕ Selección única'}
            </SelectionTypeIndicator>

            <OptionsContainer>
              {question.options.map((option, index) => {
                const isSelected = question.multipleSelections
                  ? Array.isArray(response) && response.includes(option)
                  : response === option;

                return (
                  <OptionItem key={index}>
                    {question.multipleSelections ? (
                      <>
                        <StyledCheckbox
                          type="checkbox"
                          id={`q${question.questionId}-opt${index}`}
                          checked={isSelected}
                          onChange={() => handleOptionChange(option)}
                          aria-label={`Seleccionar ${option}`}
                          aria-checked={isSelected}
                        />
                        <CheckboxLabel
                          htmlFor={`q${question.questionId}-opt${index}`}
                          selected={isSelected}
                        >
                          {option}
                        </CheckboxLabel>
                      </>
                    ) : (
                      <>
                        <RadioInput
                          type="radio"
                          id={`q${question.questionId}-opt${index}`}
                          name={`question-${question.questionId}`}
                          checked={isSelected}
                          onChange={() => handleOptionChange(option)}
                          aria-label={`Seleccionar ${option}`}
                          aria-checked={isSelected}
                        />
                        <RadioLabel
                          htmlFor={`q${question.questionId}-opt${index}`}
                          selected={isSelected}
                        >
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
        return null;
    }
  };

  return (
    <QuestionContainer data-question-id={question.questionId}>
      <QuestionText>
        {question.questionId}. {question.question}
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
            alt={`Imagen para: ${question.question}`}
            loading="lazy"
          />
        </MediaContainer>
      )}

      {question.video && (
        <MediaContainer>
          <ResponsiveVideo>
            <iframe
              src={question.video}
              title={`Video para: ${question.question}`}
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
