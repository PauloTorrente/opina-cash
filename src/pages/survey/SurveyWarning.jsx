import React, { useState } from 'react';
import styled from 'styled-components';

const WarningContainer = styled.div`
  background-color: #fff3cd;
  border-left: 6px solid #ffc107;
  padding: 16px;
  margin: 20px 0;
  border-radius: 4px;
  position: relative;
`;

const WarningTitle = styled.h4`
  color: #856404;
  margin-top: 0;
  display: flex;
  align-items: center;
`;

const WarningIcon = styled.span`
  margin-right: 8px;
  font-size: 1.2em;
`;

const WarningText = styled.p`
  color: #856404;
  margin-bottom: 16px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

const CheckboxLabel = styled.label`
  color: #856404;
  margin-left: 8px;
  font-weight: 500;
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const SurveyWarning = ({ checked, onChange }) => {
  return (
    <WarningContainer>
      <WarningTitle>
        <WarningIcon>⚠️</WarningIcon>
        Importante
      </WarningTitle>
      <WarningText>
        Al enviar tus respuestas, aceptas que serán evaluadas para determinar tu puntuación. 
        Tu desempeño en esta encuesta afectará directamente la cantidad y frecuencia de 
        encuestas futuras que recibirás. Respuestas completas y bien elaboradas aumentarán 
        tus posibilidades de recibir más oportunidades.
      </WarningText>
      <CheckboxContainer>
        <CheckboxInput 
          type="checkbox" 
          id="survey-warning" 
          checked={checked}
          onChange={onChange}
          required
        />
        <CheckboxLabel htmlFor="survey-warning">
          Entiendo y acepto los términos
        </CheckboxLabel>
      </CheckboxContainer>
    </WarningContainer>
  );
};

export default SurveyWarning;
