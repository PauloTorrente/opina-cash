import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styled from 'styled-components';

const StyledPhoneInputWrapper = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.3rem;
    color: #0f172a;
  }

  .PhoneInput {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 0.75rem;
    transition: border 0.2s ease;
  }

  .PhoneInput:focus-within {
    border-color: #3b82f6;
  }

  .PhoneInputCountry {
    margin-right: 0.5rem;
  }

  .PhoneInputCountryIcon {
    width: 18px;
    height: 13px;
    border-radius: 3px;
  }

  .PhoneInputInput {
    flex: 1;
    background: transparent;
    border: none;
    color: #0f172a;
    font-size: 1rem;
    outline: none;
  }

  .PhoneInputInput::placeholder {
    color: #64748b;
  }
`;

export default function PhoneInputField({ value, onChange }) {
  return (
    <StyledPhoneInputWrapper>
      <PhoneInput
        id="phone"
        international
        value={value || ''}
        onChange={(val) => onChange(val || '')}
      />
    </StyledPhoneInputWrapper>
  );
}
