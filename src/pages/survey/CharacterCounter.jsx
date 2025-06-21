import React from 'react';

const CharacterCounter = ({ current, max, min }) => {
  let color = '#718096';
  if (current > max) color = '#e53e3e';
  else if (current > max * 0.8) color = '#dd6b20';
  else if (current < min) color = '#e53e3e';

  return (
    <div style={{
      textAlign: 'right',
      fontSize: '0.8rem',
      marginTop: '0.25rem',
      color: color
    }}>
      {current} / {max === Infinity ? '∞' : max} caracteres
      
      {current < min && (
        <span style={{ color: '#e53e3e', display: 'block' }}>
          ⚠️ Mínimo requerido: {min} caracteres
        </span>
      )}
      
      {current > max && (
        <span style={{ color: '#e53e3e', display: 'block' }}>
          ⚠️ Límite excedido en {current - max} caracteres
        </span>
      )}
    </div>
  );
};

export default CharacterCounter;