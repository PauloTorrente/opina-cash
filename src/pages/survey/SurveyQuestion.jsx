import React, { useState, useEffect } from 'react';
import { QuestionContainer, QuestionText,  Select, MediaContainer, ResponsiveImage, ResponsiveVideo, InputFieldStyled} 
from '../../components/survey/Survey.styles.jsx';
import CharacterCounter from './CharacterCounter';

const SurveyQuestion = ({ question, response, onResponseChange }) => {
  // State to track image dimensions for responsive rendering
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Configuration for different answer length requirements
  const answerLengthRequirements = {
    short: { min: 1, max: 100 },    // Short text responses (1-100 chars)
    medium: { min: 10, max: 300 },  // Medium text responses (10-300 chars)
    long: { min: 50, max: 1000 },   // Long text responses (50-1000 chars)
    unrestricted: { min: 0, max: Infinity } // No length restrictions
  };

  // Extracts dimensions from image URL if dimensions are included in filename
  const getDimensionsFromUrl = (url) => {
    const dimensionMatch = url.match(/(\d+)x(\d+)/);
    if (dimensionMatch) {
      return {
        width: parseInt(dimensionMatch[1]),
        height: parseInt(dimensionMatch[2])
      };
    }
    return null;
  };

  // Effect to determine image dimensions for proper responsive rendering
  useEffect(() => {
    if (!question.imagem) return;
    
    // First try to get dimensions from URL pattern (most efficient)
    const urlDimensions = getDimensionsFromUrl(question.imagem);
    if (urlDimensions) {
      setImageDimensions(urlDimensions);
      return;
    }
    
    // Fallback: Load image to get actual dimensions
    const img = new Image();
    img.src = question.imagem;
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height
      });
    };
    return () => {
      img.onload = null; // Cleanup event listener
    };
  }, [question.imagem]);

  // Determines if image is vertical based on aspect ratio
  const isVerticalImage = imageDimensions.height / imageDimensions.width > 1.5;

  // Maps different answer length types to their configuration
  const getLengthConfig = () => {
    const lengthMap = {
      // English variations
      'short': answerLengthRequirements.short,
      'medium': answerLengthRequirements.medium,
      'long': answerLengthRequirements.long,
      // Portuguese variations
      'curto': answerLengthRequirements.short,
      'mediano': answerLengthRequirements.medium,
      'longo': answerLengthRequirements.long,
      // Spanish variations
      'corto': answerLengthRequirements.short
    };

    // Normalize the answer length type string
    const rawLength = question.answerLength || '';
    const cleanLength = rawLength.toString().toLowerCase().trim();
    
    return lengthMap[cleanLength] || answerLengthRequirements.unrestricted;
  };

  // Validates if response meets length requirements
  const isResponseValid = (answer = '') => {
    const answerStr = typeof answer === 'string' ? answer : JSON.stringify(answer);
    const { min, max } = getLengthConfig();
    const length = answerStr.length;
    return length >= min && length <= max;
  };

  // Gets the display label for answer length requirements
  const getLengthLabel = () => {
    const rawLength = question.answerLength || '';
    const cleanLength = rawLength.toString().toLowerCase().trim();
    
    // Return appropriate label based on answer length type
    switch(cleanLength) {
      case 'short':
      case 'curto':
      case 'corto':
        return '🔹 Short answer (1-100 characters)';
      case 'medium':
      case 'mediano':
        return '🔸 Medium answer (10-300 characters)';
      case 'long':
      case 'longo':
        return '🔷 Long answer (50-1000 characters)';
      default:
        return '∞ No character limit';
    }
  };
  
  const lengthConfig = getLengthConfig();
  return (
    <QuestionContainer>
      <QuestionText>
        {question.questionId}. {question.question}        
        {/* Show length requirements only for text questions */}
        {question.type === 'text' && (
          <small style={{ display: 'block', marginTop: '0.5rem', color: '#4a5568' }}>
            {getLengthLabel()}
          </small>
        )}
      </QuestionText> 
      {/* Render image if provided */}
      {question.imagem && (
        <MediaContainer>
          <ResponsiveImage 
            src={question.imagem}
            $isVertical={isVerticalImage}
            alt={`Image for: ${question.question}`}
            loading="lazy"
            onLoad={() => {
              // Final safety check if dimensions weren't captured yet
              if (imageDimensions.width === 0) {
                const img = new Image();
                img.src = question.imagem;
                setImageDimensions({
                  width: img.width || 1,
                  height: img.height || 1
                });
              }
            }}
          />
        </MediaContainer>
      )}
      {/* Render video if provided */}
      {question.video && (
        <MediaContainer>
          <ResponsiveVideo>
            <iframe
              src={question.video}
              title={`Video for: ${question.question}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </ResponsiveVideo>
        </MediaContainer>
      )}
      {/* Render appropriate input based on question type */}
      {question.type === 'text' ? (
        <div>
          <InputFieldStyled
            type="text"
            placeholder="Danos tu opinion "
            value={response || ''}
            onChange={(e) => onResponseChange(question.questionId, e.target.value)}
            required
            style={{
              borderColor: !response ? '' : 
                isResponseValid(response) ? '#38a169' : '#e53e3e'
            }}
          />
          {/* Show character counter for text questions */}
          <CharacterCounter 
            current={response?.length || 0} 
            max={lengthConfig.max}
            min={lengthConfig.min}
          />
        </div>
      ) : (
        <Select
          value={response || ''}
          onChange={(e) => onResponseChange(question.questionId, e.target.value)}
          required
        >
          <option value="" disabled>Select an option</option>
          {question.options?.map((option, i) => (
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
