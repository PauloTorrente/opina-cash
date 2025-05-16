import React from 'react';
import ProfileField from '../components/ProfileField';

export default function ProfileFormFields({ fields, form, onChange, onPhoneChange, errors }) {
  return (
    <>
      {fields.map((field) => (
        <ProfileField
          key={field.name}
          field={field}
          value={form[field.name]}
          onChange={onChange}
          onPhoneChange={onPhoneChange}
          error={errors ? errors[field.name] : undefined}  // passa o erro pro ProfileField
        />
      ))}
    </>
  );
}
