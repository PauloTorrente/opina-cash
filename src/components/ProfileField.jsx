// components/ProfileField.jsx
import React from 'react';
import Input from './InputField';
import PhoneInputField from './PhoneInputField';
import { FieldContainer, Label, Select } from './Profile.styles';

export default function ProfileField({ field, value, onChange, onPhoneChange }) {
  const { name, label, type, options } = field;

  return (
    <FieldContainer>
      <Label>{label}</Label>
      {type === 'select' ? (
        <Select name={name} value={value || ''} onChange={onChange}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      ) : type === 'phone' ? (
        <PhoneInputField
          label={label}
          value={value || ''}
          onChange={onPhoneChange}
        />
      ) : (
        <Input name={name} value={value || ''} onChange={onChange} />
      )}
    </FieldContainer>
  );
}
