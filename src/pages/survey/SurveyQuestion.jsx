import { useEffect } from 'react';
import {
  QuestionContainer, QuestionText, MediaContainer, ResponsiveImage,
  ResponsiveVideo, InputFieldStyled, OptionsContainer,
  RadioInput, RadioLabel, StyledCheckbox, OptionalItem, CheckboxLabel2
} from '../../components/survey/Survey.styles.jsx';
import CharacterCounter from './CharacterCounter';
import { useSurveyQuestionHandlers } from './SurveyQuestionHandlers';
import { FaCheckCircle, FaRegCircle, FaKeyboard } from 'react-icons/fa';
import QuestionHeader from './QuestionHeader';
import QuestionInputRenderer from './QuestionInputRenderer';

const SurveyQuestion = ({ question, response, onResponseChange }) => {
  const {
    imageDimensions, isVerticalImage, isSquareImage, imageAspectRatio,
    getLengthLabel, handleTextChange, handleOptionChange, isResponseValid,
    getLengthConfig, getCorrectedResponse
  } = useSurveyQuestionHandlers(question, response, onResponseChange);

  // Helper function to detect question type and return styling info
  const getQuestionTypeInfo = () => {
    if (question.type === 'text') {
      return {
        type: 'text',
        icon: <FaKeyboard size={14} />,
        label: 'Respuesta abierta',
        color: '#17a2b8',
        bgColor: '#d1ecf1'
      };
    }

    const isMultipleSelection = question.multipleSelections === "yes" || question.multipleSelections === true;
    const hasLimit = question.selectionLimit != null && question.selectionLimit > 0;

    if (isMultipleSelection) {
      if (hasLimit) {
        return {
          type: 'multiple-limited',
          icon: <FaCheckCircle size={14} />,
          label: `Selección múltiple - Máximo ${question.selectionLimit}`,
          color: '#dc3545',
          bgColor: '#f8d7da'
        };
      } else {
        return {
          type: 'multiple-unlimited',
          icon: <FaCheckCircle size={14} />,
          label: 'Selección múltiple',
          color: '#28a745',
          bgColor: '#d4edda'
        };
      }
    } else {
      return {
        type: 'single',
        icon: <FaRegCircle size={14} />,
        label: 'Selección única',
        color: '#007bff',
        bgColor: '#cce7ff'
      };
    }
  };

  const questionType = getQuestionTypeInfo();

  // Logic to detect selection limits for multiple choice questions
  const getSelectionLimitInfo = () => {
    const isMultipleSelection = question.multipleSelections === "yes" || question.multipleSelections === true;
    
    if (!isMultipleSelection) {
      return { hasLimit: false, current: 0, max: 0 };
    }

    const selectionLimit = question.selectionLimit;
    const hasLimit = selectionLimit != null && selectionLimit !== '' && Number(selectionLimit) > 0;
    const limitValue = hasLimit ? Number(selectionLimit) : 0;
    
    const currentSelections = Array.isArray(response) ? response.length : 0;
    
    return {
      hasLimit,
      current: currentSelections,
      max: limitValue
    };
  };

  const limitInfo = getSelectionLimitInfo();

  // Handle option selection with limit validation
  const handleOptionChangeWithLimit = (option) => {
    const isMultipleSelection = question.multipleSelections === "yes" || question.multipleSelections === true;
    
    if (!isMultipleSelection) {
      handleOptionChange(option);
      return;
    }

    const currentArray = Array.isArray(response) ? response : [];
    
    // Check limit only when adding new options
    if (!currentArray.includes(option)) {
      if (limitInfo.hasLimit && limitInfo.current >= limitInfo.max) {
        alert(`Solo puedes seleccionar hasta ${limitInfo.max} opciones. Desmarca algunas para seleccionar otras.`);
        return;
      }
    }

    handleOptionChange(option);
  };

  return (
    <QuestionContainer data-question-id={question.questionId}>
      {/* HEADER WITH QUESTION TYPE INDICATOR */}
      <QuestionHeader 
        questionType={questionType}
        question={question}
      />

      <QuestionText>
        {question.question}
        {question.type === 'text' && (
          <small style={{ 
            display: 'block', 
            marginTop: '0.5rem', 
            color: '#6c757d',
            fontSize: '0.9rem'
          }}>
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

      {/* RENDER INPUT COMPONENT BASED ON QUESTION TYPE */}
      <QuestionInputRenderer
        question={question}
        response={response}
        limitInfo={limitInfo}
        handleTextChange={handleTextChange}
        handleOptionChangeWithLimit={handleOptionChangeWithLimit}
        handleOptionChange={handleOptionChange}
        getLengthConfig={getLengthConfig}
        isResponseValid={isResponseValid}
        getCorrectedResponse={getCorrectedResponse}
      />
    </QuestionContainer>
  );
};

export default SurveyQuestion;
