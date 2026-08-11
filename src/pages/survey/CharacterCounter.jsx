import React from 'react';
import { CharCounterRow, CharCounter } from '../../components/survey/Survey.styles.jsx';
import { useTranslation } from '../../i18n/LanguageContext';

const CharacterCounter = ({ current, max, min }) => {
  const { t } = useTranslation();
  const isOver  = max !== Infinity && current > max;
  const isWarn  = max !== Infinity && current > max * 0.8;
  const isBelow = current < min;

  return (
    <CharCounterRow>
      {isBelow && current > 0 && (
        <CharCounter $over style={{ marginRight: 'auto' }}>
          {t('surveyQuestion.minChars', { min })}
        </CharCounter>
      )}
      {isOver && (
        <CharCounter $over style={{ marginRight: 'auto' }}>
          {t('surveyQuestion.exceededChars', { count: current - max })}
        </CharCounter>
      )}
      <CharCounter $over={isOver} $warn={isWarn && !isOver}>
        {current}{max === Infinity ? '' : ` / ${max}`}
      </CharCounter>
    </CharCounterRow>
  );
};

export default CharacterCounter;
