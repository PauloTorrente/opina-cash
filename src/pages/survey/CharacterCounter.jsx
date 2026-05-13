import React from 'react';
import { CharCounterRow, CharCounter } from '../../components/survey/Survey.styles.jsx';

const CharacterCounter = ({ current, max, min }) => {
  const isOver  = max !== Infinity && current > max;
  const isWarn  = max !== Infinity && current > max * 0.8;
  const isBelow = current < min;

  return (
    <CharCounterRow>
      {isBelow && current > 0 && (
        <CharCounter $over style={{ marginRight: 'auto' }}>
          ⚠️ Mínimo {min} caracteres
        </CharCounter>
      )}
      {isOver && (
        <CharCounter $over style={{ marginRight: 'auto' }}>
          ⚠️ Excedido en {current - max}
        </CharCounter>
      )}
      <CharCounter $over={isOver} $warn={isWarn && !isOver}>
        {current}{max === Infinity ? '' : ` / ${max}`}
      </CharCounter>
    </CharCounterRow>
  );
};

export default CharacterCounter;
