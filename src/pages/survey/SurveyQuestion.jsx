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

// Helper function to determine if question allows multiple selections
const getIsMultipleSelection = (question) => {
  const value = question.multipleSelections;

  // Valores que indicam seleção múltipla
  if (value === 'yes' || value === true || value === 'true' || value === 'sim') {
    return true;
  }
  
  // Valores que indicam seleção única
  if (value === 'no' || value === false || value === 'false' || value === 'não' || value === 'nao') {
    return false;
  }

  // CORREÇÃO: Se tem selectionLimit > 1, é múltipla escolha
  if (question.selectionLimit != null && question.selectionLimit !== '') {
    const limit = Number(question.selectionLimit);
    if (!isNaN(limit) && limit > 1) {
      return true;
    }
  }

  // Fallback: analisar texto da pergunta para indicadores de múltipla seleção
  const questionText = question.question?.toLowerCase() || '';
  const multipleIndicators = [
    'selecione até', 'seleccione hasta', 'select up to', 'choose up to',
    'múltipla', 'multiple', 'várias', 'varias', 'mais de uma',
    'quais', 'which ones', 'selecione quantos', 'seleccione cuantos',
    'opciones', 'options', 'selecciones', 'selections'
  ];
  
  const hasMultipleIndicator = multipleIndicators.some(indicator => 
    questionText.includes(indicator)
  );
  
  if (hasMultipleIndicator) {
    return true;
  }

  // Padrão: assumir seleção única
  return false;
};

// Helper function to determine effective selection limit
const getEffectiveSelectionLimit = (question, isMultipleSelection) => {
  // Se não é seleção múltipla, limite é 1
  if (!isMultipleSelection) {
    return 1;
  }

  // CORREÇÃO: Usar selectionLimit da questão de forma robusta
  if (question.selectionLimit != null && question.selectionLimit !== '') {
    const limit = Number(question.selectionLimit);
    if (!isNaN(limit) && limit > 0) {
      return limit;
    }
  }

  // Tentar extrair limite do texto da pergunta
  const textLimit = extractLimitFromQuestionText(question.question);
  if (textLimit) {
    return textLimit;
  }

  // Sem limite definido para seleção múltipla
  return null;
};

// Helper function to extract selection limit from question text
const extractLimitFromQuestionText = (questionText) => {
  if (!questionText) return null;

  const patterns = [
    { regex: /\(Selecione hasta (\d+)\)/i },
    { regex: /\(selecione hasta (\d+)\)/i },
    { regex: /\(hasta (\d+) opciones\)/i },
    { regex: /\(choose up to (\d+)\)/i },
    { regex: /\(select up to (\d+)\)/i },
    { regex: /\(max\.? (\d+)\)/i },
    { regex: /\(maximum (\d+)\)/i },
    { regex: /\(limite de (\d+)\)/i },
    { regex: /\(máximo de (\d+)\)/i },
    { regex: /\(hasta (\d+)\)/i },
    { regex: /selecione (\d+) opciones/i },
    { regex: /choose (\d+) options/i },
    { regex: /select (\d+) options/i },
    { regex: /up to (\d+) options/i },
    { regex: /máximo (\d+)/i },
    { regex: /maximum (\d+)/i },
    { regex: /limite (\d+)/i },
    { regex: /hasta (\d+)/i },
    { regex: /seleccione (\d+)/i },
    { regex: /selecione (\d+)/i }
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
};

// Função para validar se pode selecionar mais opções
const canSelectMoreOptions = (currentResponse, selectionLimit, optionToAdd = null) => {
  if (!Array.isArray(currentResponse)) return true;
  
  const currentCount = currentResponse.length;
  
  // Se não há limite, pode selecionar infinitamente
  if (selectionLimit === null || selectionLimit === undefined) return true;
  
  // Se está tentando adicionar uma opção e já atingiu o limite
  if (optionToAdd && !currentResponse.includes(optionToAdd)) {
    return currentCount < selectionLimit;
  }
  
  // Para verificação geral
  return currentCount < selectionLimit;
};

const SurveyQuestion = ({ question, selectionLimit, response, onResponseChange }) => {
  const {
    imageDimensions, isVerticalImage, isSquareImage, imageAspectRatio,
    getLengthLabel, handleTextChange, handleOptionChange, isResponseValid,
    getLengthConfig, getCorrectedResponse
  } = useSurveyQuestionHandlers(question, response, onResponseChange);

  // CORREÇÃO: Usar selectionLimit das props se disponível, senão calcular
  const effectiveSelectionLimit = selectionLimit != null ? 
    Number(selectionLimit) : 
    getEffectiveSelectionLimit(question, getIsMultipleSelection(question));

  // Determine if question allows multiple selections usando helper function
  const isMultipleSelection = getIsMultipleSelection(question);

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

    // Usar lógica corrigida para limites de seleção
    const hasLimit = effectiveSelectionLimit !== null && effectiveSelectionLimit > 1;

    if (isMultipleSelection) {
      if (hasLimit) {
        return {
          type: 'multiple-limited',
          icon: <FaCheckCircle size={14} />,
          label: `Selección múltiple - Máximo ${effectiveSelectionLimit}`,
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

  // Get selection limit information for UI
  const getSelectionLimitInfo = () => {
    if (!isMultipleSelection) {
      return { 
        hasLimit: false, 
        current: 0, 
        max: 0,
        isAtLimit: false,
        canSelectMore: true
      };
    }

    const hasLimit = effectiveSelectionLimit !== null && effectiveSelectionLimit > 0;
    const limitValue = hasLimit ? effectiveSelectionLimit : 0;
    
    const currentSelections = Array.isArray(response) ? response.length : 0;
    
    return {
      hasLimit,
      current: currentSelections,
      max: limitValue,
      isAtLimit: hasLimit ? currentSelections >= limitValue : false,
      canSelectMore: hasLimit ? currentSelections < limitValue : true
    };
  };

  const limitInfo = getSelectionLimitInfo();

  // Handle option selection with limit validation
  const handleOptionChangeWithLimit = (option) => {
    if (!isMultipleSelection) {
      // Seleção única - comportamento normal
      handleOptionChange(option);
      return;
    }

    const currentArray = Array.isArray(response) ? response : [];
    const isSelected = currentArray.includes(option);

    // Verificar limite apenas ao adicionar novas opções
    if (!isSelected) {
      if (!canSelectMoreOptions(currentArray, effectiveSelectionLimit, option)) {
        alert(`❌ Solo puedes seleccionar hasta ${effectiveSelectionLimit} opciones. Desmarca algunas para seleccionar otras.`);
        return;
      }
    }

    // Prosseguir com mudança normal de opção
    handleOptionChange(option);
  };

  // Renderização condicional baseada no tipo de questão
  const renderQuestionSpecificUI = () => {
    return (
      <QuestionInputRenderer
        question={question}
        response={response}
        limitInfo={limitInfo}
        isMultipleSelection={isMultipleSelection}
        effectiveSelectionLimit={effectiveSelectionLimit}
        handleTextChange={handleTextChange}
        handleOptionChangeWithLimit={handleOptionChangeWithLimit}
        handleOptionChange={handleOptionChange}
        getLengthConfig={getLengthConfig}
        isResponseValid={isResponseValid}
        getCorrectedResponse={getCorrectedResponse}
      />
    );
  };

  return (
    <QuestionContainer 
      data-question-id={question.questionId}
      data-selection-limit={effectiveSelectionLimit}
      data-multiple-selection={isMultipleSelection}
    >
      {/* Question header with type indicator */}
      <QuestionHeader 
        questionType={questionType}
        question={question}
        selectionLimit={effectiveSelectionLimit}
        isMultipleSelection={isMultipleSelection}
      />

      {/* Question text */}
      <QuestionText>
        {question.question}
        {question.required && (
          <span style={{ color: '#e53e3e', marginLeft: '4px' }}>*</span>
        )}
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

      {/* Image media */}
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

      {/* Video media */}
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

      {/* Componente de entrada de questão */}
      {renderQuestionSpecificUI()}

      {/* REMOVIDO: Contador de seleções para questões múltiplas com limite */}
      {/* REMOVIDO: "X/Y seleccionados" */}
      
    </QuestionContainer>
  );
};

export default SurveyQuestion;
