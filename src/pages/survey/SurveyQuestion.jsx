import React from 'react';
import {
  QuestionContainer,
  QuestionText,
  Select,
  MediaContainer,
  ResponsiveImage,
  ResponsiveVideo,
  InputFieldStyled
} from '../../components/survey/Survey.styles.jsx';
import CharacterCounter from './CharacterCounter'; // Componente movido

const SurveyQuestion = ({ question, response, onResponseChange }) => {
  // Configurações de comprimento
  const answerLengthRequirements = {
    short: { min: 1, max: 100 },
    medium: { min: 10, max: 300 },
    long: { min: 50, max: 1000 },
    unrestricted: { min: 0, max: Infinity }
  };

  const getLengthConfig = () => {
    const lengthMap = {
      'short': answerLengthRequirements.short,
      'medium': answerLengthRequirements.medium,
      'long': answerLengthRequirements.long,
      'curto': answerLengthRequirements.short,
      'mediano': answerLengthRequirements.medium,
      'longo': answerLengthRequirements.long,
      'corto': answerLengthRequirements.short
    };

    const rawLength = question.answerLength || '';
    const cleanLength = rawLength.toString().toLowerCase().trim();
    
    return lengthMap[cleanLength] || answerLengthRequirements.unrestricted;
  };

  const isResponseValid = (answer = '') => {
    const { min, max } = getLengthConfig();
    const length = answer.length;
    return length >= min && length <= max;
  };

  const getLengthLabel = () => {
    const rawLength = question.answerLength || '';
    const cleanLength = rawLength.toString().toLowerCase().trim();
    
    switch(cleanLength) {
      case 'short':
      case 'curto':
      case 'corto':
        return '🔹 Respuesta corta (1-100 caracteres)';
      case 'medium':
      case 'mediano':
        return '🔸 Respuesta mediana (10-300 caracteres)';
      case 'long':
      case 'longo':
        return '🔷 Respuesta larga (50-1000 caracteres)';
      default:
        return '∞ Sin límite de caracteres';
    }
  };

  const lengthConfig = getLengthConfig();

  return (
    <QuestionContainer>
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
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </ResponsiveVideo>
        </MediaContainer>
      )}

      {question.type === 'text' ? (
        <div>
          <InputFieldStyled
            type="text"
            placeholder="Escribe tu respuesta aquí..."
            value={response}
            onChange={(e) => onResponseChange(question.questionId, e.target.value)}
            required
            style={{
              borderColor: response === '' ? '' : 
                isResponseValid(response) ? '#38a169' : '#e53e3e'
            }}
          />
          
          <CharacterCounter 
            current={response.length} 
            max={lengthConfig.max}
            min={lengthConfig.min}
          />
        </div>
      ) : (
        <Select
          value={response}
          onChange={(e) => onResponseChange(question.questionId, e.target.value)}
          required
        >
          <option value="" disabled>Selecciona una opción</option>
          {question.options.map((option, i) => (
            <option key={`opt-${i}`} value={option}>
              {String.fromCharCode(65 + i)}. {option}
            </option>
          ))}
        </Select>
      )}
    </QuestionContainer>
  );
};

export default SurveyQuestion;
